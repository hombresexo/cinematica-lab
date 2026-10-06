/* =========================================================================
   Interfaz de usuario — Cinemática Lab
   ========================================================================= */
(function (root) {
  'use strict';
  var FIS = root.FIS, doc = root.document;
  var f = FIS.fmt;

  var state = {
    sesion: null,
    idx: 0,
    respuestas: {},        // {itemIdx: {incisoId: valor}}
    estados: {},           // {itemIdx: {incisoId: 'ok'|'mal'|'parcial'|'vacio'}}
    revelados: {},         // {itemIdx: {incisoId: true}}  respuestas vistas
    pistas: {},            // {itemIdx: {incisoId: n}}    nivel de pista mostrado
    soluciones: {},        // {itemIdx: {incisoId: true, completa: true}}
    tGraficos: {},         // {itemIdx: {t, modo}}
    inicio: null,
    finalizada: false
  };

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function h(html) { var d = doc.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function mostrarVista(id) {
    $$('.vista').forEach(function (v) { v.classList.toggle('activa', v.id === id); });
    root.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function esTexto(inc) { return inc.tipo === 'texto'; }
  function esMovimientoVertical(it) {
    if (!it) return false;
    var contenido = it.contenido || {};
    var texto = [it.tema, it.nombre, contenido.titulo].join(' ');
    return it.cat === 'vertical' || it.unidad === '2.2' || /^V/i.test(String(it.genId || '')) ||
      /\beje\s+y\b|vertical|ca[ií]da libre|tiro vertical|globo/i.test(texto);
  }

  /* ================================================================== */
  /* Persistencia de la sesión en curso                                  */
  /* ================================================================== */
  function guardarProgreso() {
    if (!state.sesion || state.finalizada) return;
    FIS.store.set('cinematica.enCurso', {
      sesion: state.sesion, idx: state.idx, respuestas: state.respuestas,
      estados: state.estados, revelados: state.revelados, pistas: state.pistas,
      soluciones: state.soluciones, tGraficos: state.tGraficos, inicio: state.inicio
    });
  }
  function borrarProgreso() { FIS.store.set('cinematica.enCurso', null); }

  /* ================================================================== */
  /* Vista: inicio / configuración de la sesión                          */
  /* ================================================================== */
  function renderInicio() {
    var prefs = FIS.prefs.cargar();
    var enCurso = FIS.store.get('cinematica.enCurso', null);
    var cont = $('#vista-inicio');
    var cats = FIS.categorias.map(function (c) {
      var activo = prefs.categorias.indexOf(c.id) >= 0;
      return '<label class="tarjeta-cat' + (activo ? ' activa' : '') + '" data-cat="' + c.id + '">' +
        '<input type="checkbox" value="' + c.id + '"' + (activo ? ' checked' : '') + '>' +
        '<span class="cat-titulo">' + c.nombre + '</span>' +
        '<span class="cat-desc">' + c.desc + '</span></label>';
    }).join('');

    cont.innerHTML =
      '<section class="panel">' +
      '<h2>Armá tu sesión de práctica</h2>' +
      '<p class="intro">Elegí qué querés practicar. Cada problema se genera con datos nuevos: nunca vas a resolver dos veces el mismo ejercicio.</p>' +
      (enCurso ? '<div class="aviso sesion-pendiente"><span>Tenes una sesión sin terminar (' + enCurso.sesion.items.length + ' ejercicios, ' +
        Math.round((enCurso.idx + 1) / enCurso.sesion.items.length * 100) + ' % recorrido).</span>' +
        '<button class="btn chico" id="continuar-sesion">Continuar</button>' +
        '<button class="btn chico fantasma" id="descartar-sesion">Descartar</button></div>' : '') +
      '<h3>1. Temas</h3>' +
      '<div class="grilla-cats">' + cats + '</div>' +
      '<h3>2. Cantidad y dificultad</h3>' +
      '<div class="grilla-config">' +
      '<label class="campo"><span>Problemas a resolver</span><input type="number" id="cfg-problemas" min="0" max="20" value="' + prefs.nProblemas + '"></label>' +
      '<label class="campo"><span>Ejercicios teóricos (V/F + justificación)</span><input type="number" id="cfg-teoricos" min="0" max="10" value="' + prefs.nTeoricos + '"></label>' +
      '<label class="campo"><span>Dificultad</span><select id="cfg-dif">' +
      '<option value="auto"' + (prefs.dif === 'auto' ? ' selected' : '') + '>Progresiva (empieza fácil)</option>' +
      '<option value="1"' + (prefs.dif === 1 ? ' selected' : '') + '>Inicial</option>' +
      '<option value="2"' + (prefs.dif === 2 ? ' selected' : '') + '>Intermedia</option>' +
      '<option value="3"' + (prefs.dif === 3 ? ' selected' : '') + '>Avanzada (tipo examen)</option>' +
      '</select></label>' +
      '<label class="campo"><span>Valor de g</span><select id="cfg-g">' +
      '<option value="9.81"' + (prefs.g === 9.81 ? ' selected' : '') + '>9,81 m/s² (recomendado)</option>' +
      '<option value="9.8"' + (prefs.g === 9.8 ? ' selected' : '') + '>9,8 m/s²</option>' +
      '<option value="10"' + (prefs.g === 10 ? ' selected' : '') + '>10 m/s² (redondeado)</option>' +
      '</select></label>' +
      '<label class="campo"><span>Semilla (opcional, para repetir una sesión)</span><input type="text" id="cfg-semilla" placeholder="dejar vacío = aleatoria"></label>' +
      '<label class="campo campo-examen"><span><input type="checkbox" id="cfg-examen"> Modo examen</span><small>Sin pistas ni respuestas hasta finalizar</small></label>' +
      '<label class="campo"><span>Tiempo límite (minutos)</span><input type="number" id="cfg-tiempo" min="1" max="180" value="30"></label>' +
      '</div>' +
      '<div class="acciones"><button class="btn primario grande" id="btn-empezar">Generar sesión</button>' +
      '<button class="btn fantasma" id="btn-ir-teoria">Repasar teoría y fórmulas</button>' +
      '<button class="btn fantasma" id="btn-ir-historial">Mi historial</button></div>' +
      '</section>' +
      '<section class="panel suave">' +
      '<h3>Cómo funciona</h3>' +
      '<div class="grilla-3">' +
      '<div><b>1. Resolvé</b><p>Escribí tus respuestas en cada inciso. Podés pedir una <b>pista</b> si te trabás, sin que se te reste nada.</p></div>' +
      '<div><b>2. Verificá</b><p>Con <b>Verificar</b> el software corrige con tolerancia numérica y te devuelve una devolución orientadora en los errores.</p></div>' +
      '<div><b>3. Aprendé</b><p>Si querés, <b>Ver solución</b> muestra el desarrollo paso a paso, con las herramientas metodológicas de la cátedra.</p></div>' +
      '</div></section>';

    function actualizarTarjetas() {
      $$('.tarjeta-cat', cont).forEach(function (c) { c.classList.toggle('activa', $('input', c).checked); });
    }
    cont.onclick = function (e) {
      var t = e.target;
      actualizarTarjetas();
      if (t.id === 'btn-empezar') empezarSesion();
      if (t.id === 'btn-ir-teoria') { renderTeoria(); mostrarVista('vista-teoria'); }
      if (t.id === 'btn-ir-historial') { renderHistorial(); mostrarVista('vista-historial'); }
      if (t.id === 'continuar-sesion' && enCurso) continuarSesion(enCurso);
      if (t.id === 'descartar-sesion') { borrarProgreso(); renderInicio(); }
    };
    cont.onchange = actualizarTarjetas;
  }

  function leerConfig() {
    var cats = $$('#vista-inicio .tarjeta-cat input:checked').map(function (i) { return i.value; });
    if (!cats.length) { alert('Seleccioná al menos un tema para generar la sesión.'); return null; }
    var nP = parseInt($('#cfg-problemas').value, 10); if (isNaN(nP)) nP = 6;
    var nT = parseInt($('#cfg-teoricos').value, 10); if (isNaN(nT)) nT = 2;
    if (nP + nT === 0) nP = 4;
    var semillaTxt = $('#cfg-semilla').value.trim();
    var seed = semillaTxt ? FIS.seedFromString(semillaTxt) : FIS.seedAleatoria();
    return {
      categorias: cats,
      nProblemas: Math.min(nP, 20),
      nTeoricos: Math.min(nT, 10),
      dif: $('#cfg-dif').value === 'auto' ? 'auto' : Number($('#cfg-dif').value),
      g: parseFloat($('#cfg-g').value),
      seed: seed,
      semillaTxt: semillaTxt,
      examen: !!$('#cfg-examen').checked,
      limiteMin: Math.max(1, Math.min(180, parseInt($('#cfg-tiempo').value, 10) || 30))
    };
  }

  function empezarSesion() {
    var cfg = leerConfig();
    if (!cfg) return;
    FIS.prefs.guardar({
      categorias: cfg.categorias, dif: cfg.dif, nProblemas: cfg.nProblemas,
      nTeoricos: cfg.nTeoricos, g: cfg.g, tema: FIS.prefs.cargar().tema
    });
    var sesion = FIS.crearSesion(cfg);
    state.sesion = sesion;
    state.idx = 0;
    state.respuestas = {}; state.estados = {}; state.revelados = {};
    state.pistas = {}; state.soluciones = {}; state.tGraficos = {};
    state.inicio = Date.now();
    state.finalizada = false;
    if (!sesion.items.length) { alert('No se pudieron generar ejercicios con esa combinación de temas.'); return; }
    guardarProgreso();
    renderPractica();
    mostrarVista('vista-practica');
  }

  function continuarSesion(guardado) {
    state.sesion = guardado.sesion;
    state.idx = guardado.idx || 0;
    state.respuestas = guardado.respuestas || {};
    state.estados = guardado.estados || {};
    state.revelados = guardado.revelados || {};
    state.pistas = guardado.pistas || {};
    state.soluciones = guardado.soluciones || {};
    state.tGraficos = guardado.tGraficos || {};
    state.inicio = guardado.inicio || Date.now();
    state.finalizada = false;
    renderPractica();
    mostrarVista('vista-practica');
  }

  /* ================================================================== */
  /* Vista: práctica                                                     */
  /* ================================================================== */
  function cupoIncisos() {
    return state.sesion.items.reduce(function (acc, it) {
      return acc + (it.tipo === 'problema' ? it.contenido.incisos.length : 2);
    }, 0);
  }
  function contarEstados() {
    var ok = 0, mal = 0, pend = 0, revisar = 0;
    state.sesion.items.forEach(function (it, i) {
      var est = state.estados[i] || {};
      if (it.tipo === 'problema') {
        it.contenido.incisos.forEach(function (inc) { sumar(est[inc.id]); });
      } else {
        sumar(est.afirmacion); sumar(est.justificacion);
      }
    });
    function sumar(e) {
      if (e === 'ok') ok++;
      else if (e === 'mal' || e === 'parcial') { mal++; revisar++; }
      else if (e === 'vacio') pend++;
      else pend++;
    }
    return { ok: ok, mal: mal, pend: pend };
  }

  function renderPractica() {
    var s = state.sesion;
    if (!s) return;
    var c = contarEstados();
    var cont = $('#vista-practica');
    cont.innerHTML =
      '<div class="barra-sesion">' +
      '<div class="progreso"><div class="barra"><i style="width:' + ((state.idx + 1) / s.items.length * 100).toFixed(1) + '%"></i></div>' +
      '<span class="texto-progreso">Ejercicio ' + (state.idx + 1) + ' de ' + s.items.length + '</span></div>' +
      '<div class="marcadores">' +
      '<span class="chip ok">✔ ' + c.ok + ' correctos</span>' +
      '<span class="chip mal">✘ ' + c.mal + ' para revisar</span>' +
      '<span class="chip">◌ ' + c.pend + ' pendientes</span>' +
      '<span class="chip reloj' + (s.examen ? ' examen' : '') + '" id="reloj">' + (s.examen ? '00:00 restantes' : '00:00') + '</span>' +
      '</div>' +
      '<div class="acciones-sesion"><button class="btn fantasma chico" id="btn-inicio-sesion">← Inicio</button>' +
      '<button class="btn fantasma chico" id="btn-finalizar">' + (s.examen ? 'Entregar examen' : 'Finalizar y ver resultados') + '</button></div>' +
      '</div>' +
      '<div class="layout-practica">' +
      '<nav class="indice" id="indice"></nav>' +
      '<main id="item-actual" class="item-actual"></main>' +
      '</div>';

    renderIndice();
    renderItem();

    $('#btn-inicio-sesion').onclick = function () { guardarProgreso(); renderInicio(); mostrarVista('vista-inicio'); };
    $('#btn-finalizar').onclick = function () { finalizar(); };
    $('#indice').onclick = function (e) {
      var b = e.target.closest('.indice-item');
      if (!b) return;
      state.idx = Number(b.dataset.i);
      renderPractica();
    };
    iniciarReloj();
  }

  var relojTimer = null;
  function iniciarReloj() {
    if (relojTimer) clearInterval(relojTimer);
    function tic() {
      var el = doc.getElementById('reloj');
      if (!el || !state.inicio) return;
      var seg = Math.floor((Date.now() - state.inicio) / 1000);
      if (state.sesion && state.sesion.examen) {
        var resta = Math.max(0, Math.ceil(state.sesion.limiteMin * 60 - seg));
        el.textContent = String(Math.floor(resta / 60)).padStart(2, '0') + ':' + String(resta % 60).padStart(2, '0') + ' restantes';
        el.classList.toggle('urgente', resta <= 60);
        if (resta <= 0 && !state.finalizada) finalizar(true);
      } else {
        el.textContent = String(Math.floor(seg / 60)).padStart(2, '0') + ':' + String(seg % 60).padStart(2, '0');
      }
    }
    tic();
    relojTimer = setInterval(tic, 1000);
  }

  function renderIndice() {
    var nav = $('#indice');
    nav.innerHTML = '<div class="indice-titulo">Recorrido</div>' + state.sesion.items.map(function (it, i) {
      var est = state.estados[i] || {};
      var claves = it.tipo === 'problema' ? it.contenido.incisos.map(function (x) { return x.id; }) : ['afirmacion', 'justificacion'];
      var cuenta = { ok: 0, mal: 0, pend: 0 };
      claves.forEach(function (k) {
        var e = est[k];
        if (e === 'ok') cuenta.ok++;
        else if (e === 'mal' || e === 'parcial') cuenta.mal++;
        else cuenta.pend++;
      });
      var clase = cuenta.ok === claves.length ? 'completo' : (cuenta.mal ? 'con-errores' : '');
      return '<button class="indice-item ' + clase + (i === state.idx ? ' actual' : '') + '" data-i="' + i + '">' +
        '<span class="num">' + (i + 1) + '</span>' +
        '<span class="meta"><b>' + esc(it.tipo === 'problema' ? it.tema : 'Teórico V/F') + '</b>' +
        '<span class="sub">' + esc(it.tipo === 'problema' ? it.contenido.titulo : 'Justificar') + '</span></span>' +
        '<span class="puntos"><i class="p ok">' + cuenta.ok + '</i><i class="p mal">' + cuenta.mal + '</i></span>' +
        '</button>';
    }).join('');
  }

  function renderItem() {
    var it = state.sesion.items[state.idx];
    var cont = $('#item-actual');
    var res = state.respuestas[state.idx] || {};
    var est = state.estados[state.idx] || {};
    var rev = state.revelados[state.idx] || {};
    var pis = state.pistas[state.idx] || {};
    var sol = state.soluciones[state.idx] || {};
    var interSpec = it.tipo === 'problema' ? FIS.interactivoSpec(it.genId, it.contenido.datos, state.sesion.g) : null;
    var interState = state.tGraficos[state.idx] || { t: 0, modo: 'x' };
    var movimientoVertical = esMovimientoVertical(it);

    if (it.tipo === 'problema') {
      var incisos = it.contenido.incisos.map(function (inc) {
        return bloqueInciso(inc, res[inc.id], est[inc.id], rev[inc.id], pis[inc.id] || 0, sol[inc.id]);
      }).join('');
      cont.innerHTML =
        '<article class="tarjeta-ejercicio">' +
        '<header class="cabecera-ej">' +
        '<span class="etiqueta">Unidad ' + it.unidad + ' · ' + esc(it.tema) + '</span>' +
        '<h2>' + esc(it.contenido.titulo) + '</h2>' +
        '<span class="dif">Dificultad ' + it.dif + '/3</span>' +
        '</header>' +
        '<div class="enunciado">' + it.contenido.enunciado + '</div>' +
        '<div class="grafico-caja">' + FIS.diagramaPictorico(it.contenido.titulo, 'situación del enunciado', movimientoVertical ? 'eje Y vertical, positivo hacia arriba' : 'eje X horizontal, positivo hacia la derecha', movimientoVertical ? 'El esquema representa el eje físico Y: el piso es el origen, la altura crece hacia arriba y la gravedad apunta hacia abajo.' : 'El esquema representa el eje físico X: el origen queda a la izquierda y las flechas siguen los signos del movimiento.', { orientacion: movimientoVertical ? 'vertical' : 'horizontal', aSign: movimientoVertical ? -1 : 1 }) + '</div>' +
        (it.contenido.grafico ? '<div class="grafico-caja">' + it.contenido.grafico + '</div>' : '') +
        (interSpec ? '<div id="explorador-interactivo">' + FIS.interactivoHTML(interSpec, interState.t, interState.modo) + '</div>' : '') +
        '<div class="incisos">' + incisos + '</div>' +
        '<footer class="pie-ejercicio">' +
        '<button class="btn primario" id="btn-verificar-todo">Verificar respuestas</button>' +
        '<button class="btn fantasma" id="btn-ver-solucion-completa">Ver solución completa</button>' +
        '<button class="btn fantasma" id="btn-ver-respuestas">Ver respuestas correctas</button>' +
        '</footer>' +
        (sol.completa ? '<div class="caja-solucion">' + solucionCompleta(it) + '</div>' : '') +
        '</article>';
    } else {
      cont.innerHTML = bloqueTeorico(it, res, est, pis, sol);
    }

    /* navegación */
    var pie = h('<div class="nav-ejercicios"></div>');
    pie.innerHTML =
      '<button class="btn fantasma" id="btn-anterior"' + (state.idx === 0 ? ' disabled' : '') + '>← Anterior</button>' +
      '<button class="btn primario" id="btn-siguiente">' + (state.idx === state.sesion.items.length - 1 ? 'Finalizar' : 'Siguiente →') + '</button>';
    cont.appendChild(pie);

    cont.oninput = function (e) {
      var deslizador = e.target.closest('[data-interactivo-time]');
      if (deslizador) { state.tGraficos[state.idx] = state.tGraficos[state.idx] || {}; state.tGraficos[state.idx].t = Number(deslizador.value); actualizarGraficoInteractivo(cont, interSpec); return; }
      var campo = e.target.closest('[data-inciso]');
      if (!campo) return;
      var clave = campo.dataset.inciso;
      state.respuestas[state.idx] = state.respuestas[state.idx] || {};
      state.respuestas[state.idx][clave] = campo.type === 'checkbox' ? campo.checked : campo.value;
      guardarProgreso();
    };
    cont.onclick = function (e) { manejarClic(e); };
    cont.onchange = function (e) {
      var selectorGrafico = e.target.closest('[data-interactivo-modo]');
      if (selectorGrafico) { state.tGraficos[state.idx] = state.tGraficos[state.idx] || {}; state.tGraficos[state.idx].modo = selectorGrafico.value; actualizarGraficoInteractivo(cont, interSpec); return; }
      var campo = e.target.closest('[data-inciso]');
      if (!campo) return;
      var clave = campo.dataset.inciso;
      state.respuestas[state.idx] = state.respuestas[state.idx] || {};
      state.respuestas[state.idx][clave] = campo.value;
      guardarProgreso();
    };
  }

  function actualizarGraficoInteractivo(cont, sp) {
    if (!sp) return;
    var nodo = cont.querySelector('[data-interactivo-root]');
    if (!nodo) return;
    var st = state.tGraficos[state.idx] || { t: 0, modo: 'x' };
    nodo.outerHTML = FIS.interactivoHTML(sp, st.t, st.modo);
  }

  /* ------------------------- Bloques de inciso ---------------------- */
  function bloqueInciso(inc, respuesta, estado, revelado, nivelPista, solucionAbierta) {
    var bloqueoExamen = state.sesion && state.sesion.examen && !state.finalizada;
    var cl = 'inciso' + (estado === 'ok' ? ' bien' : estado === 'mal' ? ' mal' : estado === 'parcial' ? ' parcial' : '');
    var html = '<div class="' + cl + '" data-inciso-box="' + inc.id + '">';
    html += '<div class="consigna"><span class="letra">' + inc.id + ')</span> <span>' + inc.consigna + '</span>';
    if (inc.unidad) html += '<span class="unidad">' + inc.unidad + '</span>';
    html += '</div>';
    html += '<div class="respuesta">' + entradaInciso(inc, respuesta) + '</div>';
    html += bloqueoExamen ? '<div class="mini aviso-examen">Modo examen: la corrección, las pistas y las respuestas se habilitan al entregar.</div>' :
      '<div class="acciones-inciso">' +
        '<button class="btn chico verificar" data-accion="verificar" data-id="' + inc.id + '">Verificar</button>' +
        (inc.pistas && inc.pistas.length ? '<button class="btn chico fantasma" data-accion="pista" data-id="' + inc.id + '">Pista</button>' : '') +
        (inc.solucion ? '<button class="btn chico fantasma" data-accion="solucion" data-id="' + inc.id + '">Ver solución</button>' : '') +
        '<button class="btn chico fantasma" data-accion="respuesta" data-id="' + inc.id + '">Ver respuesta</button>' +
      '</div>';
    html += '<div class="pista-caja" data-pista="' + inc.id + '"></div>';
    html += '<div class="retro" data-retro="' + inc.id + '"></div>';
    html += '<div class="caja-solucion" data-sol="' + inc.id + '"></div>';
    html += '</div>';
    var nodo = h(html);
    if (inc.pistas && inc.pistas.length && nivelPista) pintarPistas(nodo, inc, nivelPista);
    if (solucionAbierta) pintarSolucion(nodo, inc);
    if (estado) pintarRetro(nodo, inc, { estado: estado });
    /* la respuesta revelada se agrega después de la devolución para que no se borre */
    if (revelado) pintarRespuesta(nodo, inc);
    return nodo.outerHTML;
  }

  function entradaInciso(inc, respuesta) {
    if (inc.tipo === 'numero') {
      return '<input class="entrada" type="text" inputmode="decimal" data-inciso="' + inc.id + '" ' +
        'placeholder="escribí el resultado (podés usar coma o punto)" value="' + (respuesta !== undefined && respuesta !== null ? esc(respuesta) : '') + '">';
    }
    if (inc.tipo === 'vf') {
      var ahora = respuesta;
      return '<div class="grupo-vf" data-inciso="' + inc.id + '" data-tipo="vf">' +
        '<button class="btn-vf' + (ahora === 'V' ? ' seleccionado' : '') + '" data-val="V">Verdadero</button>' +
        '<button class="btn-vf' + (ahora === 'F' ? ' seleccionado' : '') + '" data-val="F">Falso</button></div>';
    }
    if (inc.tipo === 'opcion') {
      return '<div class="grupo-op" data-inciso="' + inc.id + '" data-tipo="op">' + inc.opciones.map(function (op, i) {
        var sel = String(respuesta) === String(i);
        return '<label class="opcion' + (sel ? ' seleccionado' : '') + '"><input type="radio" name="op_' + inc.id + '" value="' + i + '"' +
          (sel ? ' checked' : '') + ' data-inciso="' + inc.id + '"><span>' + op + '</span></label>';
      }).join('') + '</div>';
    }
    if (esTexto(inc)) {
      return '<textarea class="entrada-texto" rows="5" data-inciso="' + inc.id + '" ' +
        'placeholder="Escribí tu justificación con tus palabras (mencioná las leyes o conceptos que usás)">' +
        (respuesta ? esc(respuesta) : '') + '</textarea>';
    }
    return '';
  }

  /* --------------------------- Acciones ----------------------------- */
  function manejarClic(e) {
    var btnVf = e.target.closest('.btn-vf');
    if (btnVf) {
      var grupo = btnVf.closest('.grupo-vf');
      $$('.btn-vf', grupo).forEach(function (b) { b.classList.remove('seleccionado'); });
      btnVf.classList.add('seleccionado');
      var claveVf = grupo.dataset.inciso;
      state.respuestas[state.idx] = state.respuestas[state.idx] || {};
      state.respuestas[state.idx][claveVf] = btnVf.dataset.val;
      guardarProgreso();
      return;
    }
    var opLbl = e.target.closest('.opcion');
    if (opLbl) {
      var g2 = opLbl.closest('.grupo-op');
      $$('.opcion', g2).forEach(function (o) { o.classList.remove('seleccionado'); });
      opLbl.classList.add('seleccionado');
      var claveOp = g2.dataset.inciso;
      state.respuestas[state.idx] = state.respuestas[state.idx] || {};
      state.respuestas[state.idx][claveOp] = opLbl.querySelector('input').value;
      guardarProgreso();
      return;
    }
    var acc = e.target.closest('[data-accion]');
    if (acc) {
      var id = acc.dataset.id, accion = acc.dataset.accion;
      var inc = incisoDe(id);
      if (accion === 'verificar') verificarInciso(id);
      if (accion === 'pista') agregarPista(id, inc);
      if (accion === 'solucion') abrirSolucion(id, inc);
      if (accion === 'respuesta') revelarInciso(id, inc);
      return;
    }
    if (e.target.id === 'btn-verificar-todo') {
      if (state.sesion.items[state.idx].tipo === 'problema') {
        state.sesion.items[state.idx].contenido.incisos.forEach(function (inc) { verificarInciso(inc.id, true); });
      } else {
        verificarTeorico(true);
      }
      renderPractica();
      marcarTodoVerificado();
      return;
    }
    if (e.target.id === 'btn-ver-solucion-completa') {
      state.soluciones[state.idx] = state.soluciones[state.idx] || {};
      state.soluciones[state.idx].completa = true;
      state.sesion.items[state.idx].contenido.incisos.forEach(function (inc) { state.soluciones[state.idx][inc.id] = true; });
      guardarProgreso(); renderPractica();
      return;
    }
    if (e.target.id === 'btn-ver-respuestas') {
      state.sesion.items[state.idx].contenido.incisos.forEach(function (inc) { revelarInciso(inc.id, inc, true); });
      guardarProgreso(); renderPractica();
      return;
    }
    if (e.target.id === 'btn-anterior') { state.idx = Math.max(0, state.idx - 1); guardarProgreso(); renderPractica(); return; }
    if (e.target.id === 'btn-siguiente') {
      if (state.idx === state.sesion.items.length - 1) finalizar();
      else { state.idx++; guardarProgreso(); renderPractica(); }
      return;
    }
    if (e.target.id === 'btn-corregir-texto') {
      verificarTeorico(false);
      renderPractica();
      marcarTodoVerificado();
      var cajaTexto = doc.querySelector('[data-retro="justificacion"]');
      if (cajaTexto) cajaTexto.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

  function incisoDe(id) {
    var it = state.sesion.items[state.idx];
    if (it.tipo === 'problema') return it.contenido.incisos.filter(function (i) { return i.id === id; })[0];
    if (id === 'afirmacion') {
      return { id: 'afirmacion', tipo: 'vf', consigna: '', valor: it.contenido.valor, pistas: it.contenido.pistas,
        solucion: [FIS.paso('Justificación modelo', it.contenido.justificacion)] };
    }
    return { id: 'justificacion', tipo: 'texto', consigna: '', rubrica: it.contenido.rubrica, modelo: it.contenido.justificacion };
  }

  function leerRespuestaInciso(id) {
    var cont = $('#item-actual');
    var guardado = (state.respuestas[state.idx] || {})[id];
    var el = cont.querySelector('[data-inciso="' + id + '"]');
    if (!el) return guardado === undefined ? '' : guardado;
    if (el.type === 'radio') {
      var marcado = cont.querySelector('input[name="' + el.name + '"]:checked');
      return marcado ? marcado.value : (guardado === undefined ? '' : guardado);
    }
    /* grupos de botones (Verdadero/Falso): el valor no está en un input */
    if (el.tagName === 'BUTTON' || (el.classList && el.classList.contains('grupo-vf'))) {
      var sel = $('.btn-vf.seleccionado', el);
      return sel ? sel.dataset.val : (guardado === undefined ? '' : guardado);
    }
    return el.value;
  }

  function verificarInciso(id, silencioso) {
    var inc = incisoDe(id);
    var val = leerRespuestaInciso(id);
    state.respuestas[state.idx] = state.respuestas[state.idx] || {};
    state.respuestas[state.idx][id] = val;
    var res = FIS.corregirInciso(inc, val);
    state.estados[state.idx] = state.estados[state.idx] || {};
    state.estados[state.idx][id] = res.estado;
    guardarProgreso();
    if (!silencioso) {
      renderPractica();
      var box = doc.querySelector('[data-retro="' + id + '"]');
      if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return res;
  }

  function revelarInciso(id, inc, silencioso) {
    state.revelados[state.idx] = state.revelados[state.idx] || {};
    state.revelados[state.idx][id] = true;
    if (state.estados[state.idx] && state.estados[state.idx][id] === undefined) {
      state.estados[state.idx][id] = 'vacio';
    }
    guardarProgreso();
    if (!silencioso) renderPractica();
  }

  function agregarPista(id, inc) {
    state.pistas[state.idx] = state.pistas[state.idx] || {};
    state.pistas[state.idx][id] = Math.min((state.pistas[state.idx][id] || 0) + 1, (inc.pistas || []).length || 1);
    guardarProgreso();
    renderPractica();
  }

  function abrirSolucion(id, inc) {
    state.soluciones[state.idx] = state.soluciones[state.idx] || {};
    state.soluciones[state.idx][id] = true;
    guardarProgreso();
    renderPractica();
  }

  function pintarPistas(nodo, inc, nivel) {
    var caja = nodo.querySelector('[data-pista="' + inc.id + '"]');
    if (!caja) return;
    var texto = (inc.pistas || []).slice(0, nivel).map(function (p, i) {
      return '<div class="pista"><b>Pista ' + (i + 1) + ':</b> ' + p + '</div>';
    }).join('');
    caja.innerHTML = texto;
    caja.classList.toggle('visible', !!texto);
  }

  function pintarSolucion(nodo, inc) {
    var caja = nodo.querySelector('[data-sol="' + inc.id + '"]');
    if (!caja) return;
    caja.innerHTML = pasosHtml(inc);
    caja.classList.add('abierta');
  }

  function pintarRespuesta(nodo, inc) {
    var caja = nodo.querySelector('[data-retro="' + inc.id + '"]');
    if (!caja) return;
    var txt = caja.innerHTML;
    caja.innerHTML = txt + '<div class="respuesta-correcta revelada"><b>Respuesta correcta:</b> ' + textoRespuesta(inc) + '</div>';
    caja.classList.add('visible');
  }

  function textoRespuesta(inc) {
    if (inc.tipo === 'numero') return '<b>' + f(inc.valor, inc.dec) + '</b>' + (inc.unidad ? ' ' + inc.unidad : '');
    if (inc.tipo === 'vf') return inc.valor ? '<b>Verdadero</b>' : '<b>Falso</b>';
    if (inc.tipo === 'opcion') return '<b>' + inc.opciones[inc.correcto] + '</b>';
    return '<b>ver justificación modelo</b>';
  }

  function pasosHtml(inc) {
    if (!inc.solucion || !inc.solucion.length) return '';
    return '<div class="pasos"><div class="pasos-titulo">Resolución paso a paso</div>' +
      inc.solucion.map(function (p, i) {
        return '<div class="paso"><div class="paso-num">' + (i + 1) + '</div><div class="paso-cuerpo">' +
          '<b>' + p.titulo + '</b><div class="paso-texto">' + p.html + '</div></div></div>';
      }).join('') + '</div>';
  }

  function solucionCompleta(it) {
    return '<div class="pasos"><div class="pasos-titulo">Solución completa del ejercicio</div>' +
      it.contenido.incisos.map(function (inc) {
        return '<div class="pasos-inciso"><div class="pasos-inciso-titulo">Inciso ' + inc.id + ')</div>' +
          '<div class="respuesta-corta">' + textoRespuesta(inc) + '</div>' + pasosHtml(inc) + '</div>';
      }).join('') + '</div>';
  }

  function pintarRetro(nodo, inc, res) {
    var caja = nodo.querySelector('[data-retro="' + inc.id + '"]');
    if (!caja) return;
    caja.classList.add('visible');
    if (inc.tipo === 'texto' && res.correccion) {
      caja.innerHTML = devolucionTexto(res.correccion, inc);
      return;
    }
    var cls = res.estado === 'ok' ? 'ok' : res.estado === 'mal' || res.estado === 'parcial' ? 'mal' : 'aviso';
    var titulo = res.estado === 'ok' ? '¡Correcto!' : res.estado === 'vacio' ? 'Falta responder' : 'Revisá esta respuesta';
    var extra = '';
    if (res.estado === 'ok') {
      extra = '<div class="mini">Muy bien. Si querés ver el desarrollo completo, tocá <b>Ver solución</b>.</div>';
    } else if (res.estado === 'vacio') {
      extra = '<div class="mini">Escribí tu resultado y volvé a verificar.</div>';
    } else {
      var pista = (inc.pistas && inc.pistas[0]) ? ('<div class="mini"><b>Pista:</b> ' + inc.pistas[0] + '</div>') : '';
      var sug = '';
      var esperado = inc.valor;
      if (inc.tipo === 'numero' && !isNaN(res.parsed)) {
        var u = FIS.parseNum(res.parsed);
        if (!isNaN(u) && esperado !== undefined) {
          if (Math.abs(u - esperado) < Math.abs(esperado) * 0.1) sug = '<div class="mini">Estás muy cerca: revisá el redondeo o las unidades.</div>';
          else if (inc.unidad === 'm' && Math.abs(u - esperado * 2) < Math.abs(esperado) * 0.1) sug = '<div class="mini">¿No habrás duplicado la distancia (ida y vuelta) cuando te piden sólo el desplazamiento?</div>';
        }
      }
      extra = pista + sug + '<div class="mini">Podés pedir otra <b>Pista</b>, mirar la <b>Solución</b> o directamente <b>Ver la respuesta</b>.</div>';
    }
    caja.innerHTML = '<div class="devolucion ' + cls + '"><b>' + titulo + '</b>' + extra + '</div>';
  }

  function devolucionTexto(corr, inc) {
    var nivelTxt = corr.nivel === 'logrado' ? '¡Muy buena justificación!' : corr.nivel === 'parcial' ? 'Vas bien, pero falta desarrollar' : 'La justificación necesita más contenido';
    var cls = corr.nivel === 'logrado' ? 'ok' : corr.nivel === 'parcial' ? 'aviso' : 'mal';
    var html = '<div class="devolucion ' + cls + '"><b>' + nivelTxt + '</b>' +
      '<div class="puntaje"><i style="width:' + Math.round(corr.puntaje * 100) + '%"></i></div>' +
      '<div class="mini">Idea completa: ' + Math.round(corr.puntaje * 100) + ' %' + (corr.muyCorta ? ' · ¡ojo! el texto es muy breve, desarrollá más.' : '') + '</div>';
    if (corr.acertados.length) html += '<div class="mini bueno"><b>Mencionaste bien:</b> ' + corr.acertados.join(' · ') + '</div>';
    if (corr.faltantes.length) html += '<div class="mini ojo"><b>Te faltó mencionar:</b> ' + corr.faltantes.join(' · ') + '</div>';
    if (corr.errores.length) {
      html += '<div class="mini error"><b>Revisá:</b></div><ul class="lista-errores-correccion">' +
        corr.errores.map(function (e) { return '<li><b>' + e.label + '</b>' + (e.mensaje ? ': ' + e.mensaje : '') + '</li>'; }).join('') + '</ul>';
    }
    html += '<details class="modelo"><summary>Ver justificación modelo</summary><div class="texto-modelo">' + inc.modelo + '</div></details>';
    html += '</div>';
    return html;
  }

  /* --------------------------- Teóricos ----------------------------- */
  function bloqueTeorico(it, res, est, pis, sol) {
    var c = it.contenido;
    var esTextoPuro = c.tipo === 'texto';
    var html = '<article class="tarjeta-ejercicio teorico">' +
      '<header class="cabecera-ej">' +
      '<span class="etiqueta">Teórico · ' + esc(it.tema || '') + '</span>' +
      '<h2>Verdadero o falso con justificación</h2>' +
      '<span class="dif">Dificultad ' + it.dif + '/3</span></header>' +
      '<div class="enunciado"><p class="afirmacion">' + c.afirmacion + '</p>' +
      (esTextoPuro ? '<p>' + (c.consignaTexto || 'Escribí tu respuesta justificando.') + '</p>' :
        '<p>Indicá si la afirmación es verdadera o falsa <b>y justificá</b> tu elección con tus palabras. El software corregirá tu justificación.</p>') +
      '</div>';

    if (!esTextoPuro) {
      html += '<div class="inciso" data-inciso-box="afirmacion">' +
        '<div class="consigna"><span class="letra">a)</span> <span>¿La afirmación es verdadera o falsa?</span></div>' +
        '<div class="respuesta">' + entradaInciso({ tipo: 'vf', id: 'afirmacion' }, res.afirmacion) + '</div>' +
        (state.sesion && state.sesion.examen && !state.finalizada ? '<div class="mini aviso-examen">Modo examen: se corrige al entregar.</div>' : '<div class="acciones-inciso"><button class="btn chico" data-accion="verificar" data-id="afirmacion">Verificar</button>' +
        '<button class="btn chico fantasma" data-accion="pista" data-id="afirmacion">Pista</button>' +
        '<button class="btn chico fantasma" data-accion="respuesta" data-id="afirmacion">Ver respuesta</button></div>') +
        '<div class="pista-caja" data-pista="afirmacion"></div>' +
        '<div class="retro" data-retro="afirmacion"></div>' +
        '<div class="caja-solucion" data-sol="afirmacion"></div></div>';
    }
    html += '<div class="inciso' + (est.justificacion === 'ok' ? ' bien' : est.justificacion ? ' parcial' : '') + '" data-inciso-box="justificacion">' +
      '<div class="consigna"><span class="letra">' + (esTextoPuro ? 'a)' : 'b)') + '</span> <span>Redactá tu justificación.</span></div>' +
      '<div class="respuesta">' + entradaInciso({ tipo: 'texto', id: 'justificacion' }, res.justificacion) + '</div>' +
      (state.sesion && state.sesion.examen && !state.finalizada ? '<div class="mini aviso-examen">La justificación se evalúa al entregar.</div>' : '<div class="acciones-inciso"><button class="btn chico primario" id="btn-corregir-texto">Corregir mi justificación</button>' +
      '<button class="btn chico fantasma" data-accion="respuesta" data-id="justificacion">Ver justificación modelo</button></div>') +
      '<div class="retro" data-retro="justificacion"></div></div>';
    html += '<footer class="pie-ejercicio">' + (state.sesion && state.sesion.examen && !state.finalizada ? '<span class="mini">La nota se calcula al entregar el examen.</span>' : '<button class="btn primario" id="btn-verificar-todo">Verificar todo</button><button class="btn fantasma" id="btn-ver-respuestas">Ver respuestas correctas</button>') + '</footer>';
    html += '</article>';

    var nodo = h(html);
    if (res.afirmacion && est.afirmacion) pintarRetro(nodo, incisoDe('afirmacion'), { estado: est.afirmacion });
    if (pis.afirmacion) pintarPistas(nodo, incisoDe('afirmacion'), pis.afirmacion);
    if (sol.afirmacion) pintarSolucion(nodo, incisoDe('afirmacion'));
    return nodo.outerHTML;
  }

  function verificarTeorico(todo) {
    var it = state.sesion.items[state.idx];
    var c = it.contenido;
    var ok = true;
    if (c.tipo !== 'texto') {
      var v = leerRespuestaInciso('afirmacion');
      state.respuestas[state.idx] = state.respuestas[state.idx] || {};
      state.respuestas[state.idx].afirmacion = v;
      var r1 = FIS.corregirInciso(incisoDe('afirmacion'), v);
      state.estados[state.idx] = state.estados[state.idx] || {};
      state.estados[state.idx].afirmacion = r1.estado;
    }
    var txt = leerRespuestaInciso('justificacion');
    state.respuestas[state.idx] = state.respuestas[state.idx] || {};
    state.respuestas[state.idx].justificacion = txt;
    var inc2 = incisoDe('justificacion');
    var r2 = FIS.corregirInciso(inc2, txt);
    state.estados[state.idx] = state.estados[state.idx] || {};
    state.estados[state.idx].justificacion = r2.estado;
    state.correccionTexto = state.correccionTexto || {};
    state.correccionTexto[state.idx] = r2.correccion;
    guardarProgreso();
    return ok;
  }

  /* Para que los textos corregidos se pinten con su devolución completa */
  function pintarCorreccionesPendientes() {
    var it = state.sesion.items[state.idx];
    if (!it || it.tipo !== 'teorico') return;
    if (state.correccionTexto && state.correccionTexto[state.idx]) {
      var caja = doc.querySelector('[data-retro="justificacion"]');
      if (caja) {
        caja.classList.add('visible');
        caja.innerHTML = devolucionTexto(state.correccionTexto[state.idx], incisoDe('justificacion'));
      }
    }
  }

  function marcarTodoVerificado() {
    pintarCorreccionesPendientes();
  }

  /* ================================================================== */
  /* Vista: resultados                                                   */
  /* ================================================================== */
  function finalizar(porTiempo) {
    if (state.finalizada) return;
    if (state.sesion && state.sesion.examen) {
      state.sesion.items.forEach(function (it, i) {
        var respuestas = state.respuestas[i] || {};
        state.estados[i] = state.estados[i] || {};
        if (it.tipo === 'problema') {
          it.contenido.incisos.forEach(function (inc) {
            state.estados[i][inc.id] = FIS.corregirInciso(inc, respuestas[inc.id] === undefined ? '' : respuestas[inc.id]).estado;
          });
        } else {
          if (it.contenido.tipo !== 'texto') state.estados[i].afirmacion = FIS.corregirInciso({ tipo: 'vf', valor: it.contenido.valor }, respuestas.afirmacion === undefined ? '' : respuestas.afirmacion).estado;
          state.estados[i].justificacion = FIS.corregirInciso({ tipo: 'texto', rubrica: it.contenido.rubrica }, respuestas.justificacion === undefined ? '' : respuestas.justificacion).estado;
        }
      });
    }
    state.finalizada = true;
    var s = state.sesion;
    var detalle = [];
    var ok = 0, mal = 0, total = 0;
    var porTema = {};
    s.items.forEach(function (it, i) {
      var est = state.estados[i] || {};
      var claves = it.tipo === 'problema' ? it.contenido.incisos.map(function (x) { return x.id; }) : ['afirmacion', 'justificacion'];
      var o = 0, m = 0, v = 0;
      claves.forEach(function (k) {
        total++;
        var e = est[k];
        if (e === 'ok') { ok++; o++; }
        else { mal++; m++; }
        if (e === undefined || e === 'vacio') v++;
      });
      var tema = it.tipo === 'problema' ? it.tema : 'Teórico V/F';
      porTema[tema] = porTema[tema] || { ok: 0, mal: 0 };
      porTema[tema].ok += o; porTema[tema].mal += m;
      detalle.push({ n: i + 1, titulo: it.tipo === 'problema' ? it.contenido.titulo : it.contenido.afirmacion.slice(0, 70) + '…', tipo: it.tipo, ok: o, mal: m, vacio: v, tema: tema });
    });
    var segundos = Math.round((Date.now() - state.inicio) / 1000);
    var registro = {
      fecha: new Date().toLocaleString('es-AR'),
      seed: s.seed, g: s.g, dif: s.dif,
      ok: ok, total: total, minutos: Math.round(segundos / 60 * 10) / 10,
      porTema: porTema, detalle: detalle, examen: !!s.examen, porTiempo: !!porTiempo
    };
    FIS.historial.agregar(registro);
    borrarProgreso();
    renderResultados(registro);
    mostrarVista('vista-resultados');
  }

  function renderResultados(reg) {
    var pct = reg.total ? Math.round(reg.ok / reg.total * 100) : 0;
    var mensaje = pct >= 85 ? '¡Excelente! Dominás estos temas.' : pct >= 65 ? 'Muy buen trabajo: hay algunos detalles para ajustar.' :
      pct >= 40 ? 'Vas por buen camino, pero conviene repasar.' : 'Hay que reforzar la base: repasá la teoría y volvé a practicar.';
    var malos = Object.keys(reg.porTema).filter(function (t) { return reg.porTema[t].mal > 0; });
    var html =
      '<section class="panel resultado">' +
      '<div class="anillo" style="--pct:' + pct + '"><span>' + pct + '%</span></div>' +
      '<h2>' + (reg.examen ? 'Examen entregado' : 'Sesión completada') + '</h2>' +
      '<p class="intro">' + mensaje + '</p>' +
      '<div class="resumen-chips">' +
      '<span class="chip ok">✔ ' + reg.ok + ' correctos</span>' +
      '<span class="chip mal">✘ ' + (reg.total - reg.ok) + ' para revisar</span>' +
      '<span class="chip">⏱ ' + reg.minutos + ' min</span>' +
      '<span class="chip">🎲 semilla ' + reg.seed + '</span>' +
      (reg.examen ? '<span class="chip examen-nota">Nota: ' + (pct / 10).toFixed(1).replace('.', ',') + ' / 10' + (reg.porTiempo ? ' · tiempo agotado' : '') + '</span>' : '') +
      '</div>' +
      '<h3>Desempeño por tema</h3>' +
      '<table class="tabla"><thead><tr><th>Tema</th><th>Correctos</th><th>Para revisar</th></tr></thead><tbody>' +
      Object.keys(reg.porTema).map(function (t) {
        return '<tr><td>' + esc(t) + '</td><td class="ok">' + reg.porTema[t].ok + '</td><td class="mal">' + reg.porTema[t].mal + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<h3>Detalle</h3>' +
      '<table class="tabla"><thead><tr><th>#</th><th>Ejercicio</th><th>Correctos</th><th>Para revisar</th><th></th></tr></thead><tbody>' +
      reg.detalle.map(function (d) {
        return '<tr><td>' + d.n + '</td><td>' + esc(d.titulo) + '</td><td class="ok">' + d.ok + '</td><td class="mal">' + d.mal + '</td>' +
          '<td>' + (d.mal ? '<button class="btn chico" data-rehacer="' + d.tema + '">Practicar este tema</button>' : '') + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<div class="acciones"><button class="btn primario grande" id="btn-nueva">Nueva sesión</button>' +
      '<button class="btn" id="btn-exportar-pdf">Exportar práctica a PDF</button>' +
      '<button class="btn fantasma" id="btn-exportar-historial">Exportar historial</button>' +
      (malos.length ? '<button class="btn" id="btn-refuerzo">Practicar sólo los temas flojos</button>' : '') +
      '<button class="btn fantasma" id="btn-historial-2">Ver historial</button></div>' +
      '</section>';
    var cont = $('#vista-resultados');
    cont.innerHTML = html;
    cont.onclick = function (e) {
      if (e.target.id === 'btn-exportar-pdf') exportarSesionPDF();
      if (e.target.id === 'btn-exportar-historial') exportarHistorial();
      if (e.target.id === 'btn-nueva') { renderInicio(); mostrarVista('vista-inicio'); }
      if (e.target.id === 'btn-historial-2') { renderHistorial(); mostrarVista('vista-historial'); }
      if (e.target.id === 'btn-refuerzo') {
        var temasTeoricos = malos.indexOf('Teórico V/F') >= 0;
        var cats = [];
        if (malos.some(function (t) { return /Encuentro|Persecución|Interpretación|Frenado|Ecuaciones|Cambio|Conceptos/.test(t); })) cats.push('horizontal');
        if (malos.some(function (t) { return /Caída|Tiro|vertical|Caída|Composición/.test(t); })) cats.push('vertical');
        if (temasTeoricos) cats.push('teorico');
        if (!cats.length) cats = ['horizontal', 'vertical', 'teorico'];
        var cfg = { categorias: cats, nProblemas: 6, nTeoricos: 2, dif: 2, g: reg.g, seed: FIS.seedAleatoria() };
        state.sesion = FIS.crearSesion(cfg);
        state.idx = 0; state.respuestas = {}; state.estados = {}; state.revelados = {};
        state.pistas = {}; state.soluciones = {}; state.inicio = Date.now(); state.finalizada = false;
        guardarProgreso(); renderPractica(); mostrarVista('vista-practica');
      }
    };
  }

  function exportarSesionPDF() {
    var s = state.sesion; if (!s) return;
    var contenido = s.items.map(function (it, i) {
      var titulo = it.tipo === 'problema' ? it.contenido.titulo : 'Verdadero o falso con justificación';
      var en = it.tipo === 'problema' ? it.contenido.enunciado : '<p class="afirmacion">' + it.contenido.afirmacion + '</p><p>Justificación escrita: ' + ((state.respuestas[i] || {}).justificacion || '—') + '</p>';
      return '<article><h2>' + (i + 1) + '. ' + esc(titulo) + '</h2>' + en + '<h3>Resolución</h3>' + (it.contenido.incisos ? solucionCompleta(it) : '<p><b>Respuesta:</b> ' + (it.contenido.valor ? 'Verdadero' : 'Falso') + '</p><p>' + it.contenido.justificacion + '</p>') + '</article>';
    }).join('');
    var w = root.open('', '_blank');
    if (!w) { alert('El navegador bloqueó la ventana de impresión. Permití ventanas emergentes para Cinemática Lab.'); return; }
    w.document.write('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Cinemática Lab · práctica resuelta</title><style>body{font-family:Arial,sans-serif;color:#182238;max-width:850px;margin:2rem auto;line-height:1.45}h1{color:#245ee8;border-bottom:2px solid #245ee8;padding-bottom:.5rem}h2{margin-top:2rem;color:#243b70}h3{color:#245ee8}.formula,.eq{font-family:Georgia,serif;background:#f2f5fb;padding:.35rem .6rem;display:inline-block}.pasos{border-left:4px solid #245ee8;padding-left:1rem}.paso{margin:.7rem 0}article{page-break-inside:avoid;border-bottom:1px solid #ccd4e3;padding-bottom:1rem}</style></head><body><h1>Cinemática Lab · práctica resuelta</h1><p><b>Fecha:</b> ' + new Date().toLocaleString('es-AR') + ' · <b>Semilla:</b> ' + s.seed + ' · <b>g:</b> ' + FIS.fmt(s.g) + ' m/s²</p>' + contenido + '<script>setTimeout(function(){window.print()},400)<\/script></body></html>');
    w.document.close();
  }
  function descargar(nombre, texto, tipo) {
    var blob = new Blob([texto], { type: tipo || 'application/json;charset=utf-8' });
    var a = doc.createElement('a'); a.href = root.URL.createObjectURL(blob); a.download = nombre; a.click();
    setTimeout(function () { root.URL.revokeObjectURL(a.href); }, 1000);
  }
  function exportarHistorial() { descargar('cinematica-lab-historial.json', JSON.stringify({ version: 1, exportado: new Date().toISOString(), historial: FIS.historial.cargar() }, null, 2)); }
  function importarHistorial() {
    var inp = doc.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = function () { var file = inp.files && inp.files[0]; if (!file) return; var rd = new FileReader(); rd.onload = function () { try { var p = JSON.parse(rd.result), h = Array.isArray(p) ? p : p.historial; if (!Array.isArray(h)) throw new Error('Formato inválido'); FIS.store.set('cinematica.historial', h.slice(0, 100)); renderHistorial(); alert('Historial importado correctamente.'); } catch (e) { alert('No se pudo importar el historial: ' + e.message); } }; rd.readAsText(file); };
    inp.click();
  }

  /* ================================================================== */
  /* Vista: teoría                                                       */
  /* ================================================================== */
  function renderTeoria() {
    var cont = $('#vista-teoria');
    cont.innerHTML = '<section class="panel">' +
      '<div class="cabecera-teoria"><h2>Repaso teórico</h2><button class="btn fantasma" id="btn-volver-inicio">← Volver</button></div>' +
      (FIS.teoria || []).map(function (s) {
        return '<details class="bloque-teoria" open><summary>' + s.titulo + '</summary><div class="cuerpo-teoria">' + s.html + '</div></details>';
      }).join('') +
      '</section>';
    $('#btn-volver-inicio', cont).onclick = function () { renderInicio(); mostrarVista('vista-inicio'); };
  }

  /* ================================================================== */
  /* Vista: historial                                                    */
  /* ================================================================== */
  function renderHistorial() {
    var hist = FIS.historial.cargar();
    var cont = $('#vista-historial');
    var acumOk = hist.reduce(function (a, x) { return a + x.ok; }, 0);
    var acumTot = hist.reduce(function (a, x) { return a + x.total; }, 0);
    cont.innerHTML = '<section class="panel">' +
      '<div class="cabecera-teoria"><h2>Mi historial</h2><button class="btn fantasma" id="btn-volver-inicio-2">← Volver</button></div>' +
      (hist.length ? '<p class="intro">' + hist.length + ' sesiones registradas · ' + acumOk + ' de ' + acumTot + ' respuestas correctas (' +
        (acumTot ? Math.round(acumOk / acumTot * 100) : 0) + ' % global).</p>' +
        '<table class="tabla"><thead><tr><th>Fecha</th><th>Correctos</th><th>Total</th><th>%</th><th>Minutos</th><th>g</th><th>Semilla</th></tr></thead><tbody>' +
        hist.map(function (x) {
          var pct = x.total ? Math.round(x.ok / x.total * 100) : 0;
          return '<tr><td>' + esc(x.fecha) + '</td><td class="ok">' + x.ok + '</td><td>' + x.total + '</td>' +
            '<td><b>' + pct + ' %</b></td><td>' + x.minutos + '</td><td>' + f(x.g) + '</td><td class="chico">' + x.seed + '</td></tr>';
        }).join('') + '</tbody></table>' +
        '<div class="acciones"><button class="btn" id="btn-exportar-historial">Exportar historial</button><button class="btn fantasma" id="btn-importar-historial">Importar historial</button><button class="btn fantasma" id="btn-borrar-historial">Borrar historial</button></div>'
        : '<p class="intro">Todavía no completaste ninguna sesión.</p>') +
      '</section>';
    $('#btn-volver-inicio-2', cont).onclick = function () { renderInicio(); mostrarVista('vista-inicio'); };
    var b = $('#btn-borrar-historial', cont);
    if (b) b.onclick = function () { FIS.historial.limpiar(); renderHistorial(); };
    var ex = $('#btn-exportar-historial', cont); if (ex) ex.onclick = exportarHistorial;
    var im = $('#btn-importar-historial', cont); if (im) im.onclick = importarHistorial;
  }

  /* ================================================================== */
  /* Arranque                                                            */
  /* ================================================================== */
  function init() {
    renderInicio();
    mostrarVista('vista-inicio');
    /* Tema claro/oscuro */
    var prefs = FIS.prefs.cargar();
    doc.documentElement.dataset.tema = prefs.tema || 'claro';
    var btnTema = doc.getElementById('btn-tema');
    if (btnTema) {
      actualizarIconoTema();
      btnTema.onclick = function () {
        var p = FIS.prefs.cargar();
        p.tema = doc.documentElement.dataset.tema === 'claro' ? 'oscuro' : 'claro';
        doc.documentElement.dataset.tema = p.tema;
        FIS.prefs.guardar(p);
        actualizarIconoTema();
      };
    }
  }
  function actualizarIconoTema() {
    var btn = doc.getElementById('btn-tema');
    if (btn) btn.textContent = doc.documentElement.dataset.tema === 'claro' ? '🌙 Modo oscuro' : '☀ Modo claro';
  }

  /* API para pruebas automatizadas */
  FIS.ui = {
    state: state, renderInicio: renderInicio, empezarSesion: empezarSesion,
    renderPractica: renderPractica, finalizar: finalizar, verificarInciso: verificarInciso,
    verificarTeorico: verificarTeorico, leerConfig: leerConfig, mostrarVista: mostrarVista
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();

})(typeof globalThis !== 'undefined' ? globalThis : this);
