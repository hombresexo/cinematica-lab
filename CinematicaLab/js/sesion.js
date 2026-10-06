/* =========================================================================
   Sesiones de práctica: selección aleatoria, corrección y estadísticas
   ========================================================================= */
(function (root) {
  'use strict';
  var FIS = root.FIS;

  /* Categorías disponibles (lo que el usuario elige para practicar) */
  FIS.categorias = [
    { id: 'unidad11', nombre: 'Unidad 1.1 · Magnitudes y vectores', desc: 'Unidades SI, conversiones, magnitudes escalares/vectoriales y componentes.' },
    { id: 'unidad12', nombre: 'Unidad 1.2 · Nociones generales', desc: 'Marco de referencia, posición, desplazamiento, distancia y trayectoria.' },
    { id: 'horizontal', nombre: 'MRUV horizontal (Unidad 2.1)', desc: 'Ecuaciones horarias, frenado, gráficos, encuentros en un eje horizontal.' },
    { id: 'vertical', nombre: 'Movimientos verticales (Unidad 2.2)', desc: 'Caída libre, tiro vertical, objetos soltados desde móviles.' },
    { id: 'mixto', nombre: 'Composición caída libre + MRU', desc: 'Situaciones que combinan un eje vertical con otro horizontal.' },
    { id: 'teorico', nombre: 'Teórico: Verdadero/Falso con justificación', desc: 'Afirmaciones para razonar y redactar la justificación; el software la corrige.' }
  ];

  /* ------------------------------------------------------------------ */
  /* Almacenamiento seguro (funciona incluso si localStorage no está)    */
  /* ------------------------------------------------------------------ */
  var memoria = {};
  FIS.store = {
    get: function (k, def) {
      try {
        var raw = root.localStorage.getItem(k);
        return raw === null ? def : JSON.parse(raw);
      } catch (e) { return k in memoria ? memoria[k] : def; }
    },
    set: function (k, v) {
      memoria[k] = v;
      try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo memoria */ }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Creación de una sesión                                              */
  /* ------------------------------------------------------------------ */
  function filtrarPorCategoria(cats) {
    var sel = {};
    cats.forEach(function (c) { sel[c] = true; });
    return FIS.generadores.filter(function (gen) {
      if (gen.cat === 'unidad11') return !!sel.unidad11;
      if (gen.cat === 'unidad12') return !!sel.unidad12;
      if (gen.cat === 'horizontal') return !!sel.horizontal;
      if (gen.cat === 'vertical') return !!sel.vertical;
      if (gen.cat === 'mixto') return !!(sel.mixto || sel.vertical);
      return false;
    });
  }

  function dificultadAceptable(gen, nivel) {
    if (nivel === 'auto' || nivel === undefined) return true;
    var n = Number(nivel);
    return gen.dif <= n;
  }

  /**
   * config: {categorias:[...], dif:'auto'|1|2|3, nProblemas, nTeoricos, g, seed}
   */
  FIS.crearSesion = function (config) {
    config = config || {};
    var cats = (config.categorias && config.categorias.length ? config.categorias : ['unidad11', 'unidad12', 'horizontal', 'vertical', 'mixto', 'teorico']);
    var nP = Math.max(0, config.nProblemas === undefined ? 6 : config.nProblemas);
    var nT = Math.max(0, config.nTeoricos === undefined ? 2 : config.nTeoricos);
    var g = config.g || FIS.G_DEFAULT;
    var dif = config.dif === undefined ? 'auto' : config.dif;
    var seed = config.seed || FIS.seedAleatoria();
    var examen = !!config.examen;
    var limiteMin = Math.max(1, Math.min(180, Number(config.limiteMin) || 30));
    var r = FIS.makeRng(seed);

    var pool = filtrarPorCategoria(cats).filter(function (gen) { return dificultadAceptable(gen, dif); });
    if (!pool.length) pool = filtrarPorCategoria(cats);
    if (!pool.length) pool = FIS.generadores.slice();

    var items = [];
    var ultimos = [];
    /* Dificultad objetivo del ejercicio i-ésimo: con 'auto' va subiendo a lo largo de la sesión */
    function nivelObjetivo(i) {
      if (dif === 'auto') {
        var frac = nP > 1 ? i / (nP - 1) : 0;
        return frac < 0.34 ? 1 : frac < 0.7 ? 2 : 3;
      }
      return Number(dif);
    }
    function elegirGenerador(i) {
      var candidatos = pool.filter(function (gen) { return ultimos.indexOf(gen.id) < 0; });
      if (!candidatos.length) { ultimos = []; candidatos = pool; }
      /* se prioriza la dificultad objetivo, sin bloquear el resto (variedad) */
      var nivel = nivelObjetivo(i);
      var exactos = candidatos.filter(function (gen) { return gen.dif === nivel; });
      if (exactos.length) return r.pick(exactos);
      var cercanos = candidatos.filter(function (gen) { return gen.dif <= nivel; });
      if (cercanos.length) return r.pick(cercanos);
      return r.pick(candidatos);
    }

    var i;
    for (i = 0; i < nP; i++) {
      if (!pool.length) break;
      var gen = elegirGenerador(i);
      ultimos.push(gen.id);
      if (ultimos.length > Math.max(2, Math.floor(pool.length / 2))) ultimos.shift();
      var rSub = FIS.makeRng((seed + (i + 1) * 7919) >>> 0);
      var contenido;
      try {
        contenido = gen.gen(rSub, g);
      } catch (e) {
        continue;
      }
      items.push({
        tipo: 'problema', genId: gen.id, nombre: gen.nombre, tema: gen.tema, unidad: gen.unidad,
        cat: gen.cat, dif: gen.dif, contenido: contenido
      });
    }

    var banco = FIS.bancoTeorico.filter(function (t) { return dificultadAceptable(t, dif); });
    if (!banco.length) banco = FIS.bancoTeorico.slice();
    var usados = [];
    for (i = 0; i < nT; i++) {
      if (!banco.length) break;
      var cand = banco.filter(function (t) { return usados.indexOf(t.id) < 0; });
      if (!cand.length) { usados = []; cand = banco; }
      var th = r.pick(cand);
      usados.push(th.id);
      var rT = FIS.makeRng((seed + 104729 * (i + 1)) >>> 0);
      var cont;
      try { cont = th.gen(rT, g); } catch (e2) { continue; }
      items.push({
        tipo: 'teorico', genId: th.id, nombre: cont.afirmacion.slice(0, 90), tema: cont.tema || th.tema,
        unidad: th.unidad, cat: 'teorico', dif: th.dif, contenido: cont
      });
    }

    /* mezcla final para que no queden todos los problemas juntos y los teóricos al final */
    var barr = [], mix = [];
    items.forEach(function (it) { (it.tipo === 'problema' ? barr : mix).push(it); });
    var finales = [], j = 0, k = 0;
    while (j < barr.length) {
      finales.push(barr[j++]);
      /* intercala un teórico cada 3 problemas */
      if (k < mix.length && finales.length % 3 === 0) finales.push(mix[k++]);
    }
    while (k < mix.length) finales.push(mix[k++]);

    return {
      id: 'ses' + seed,
      seed: seed,
      g: g,
      dif: dif,
      examen: examen,
      limiteMin: limiteMin,
      categorias: cats,
      creada: new Date().toISOString(),
      items: finales
    };
  };

  /* ------------------------------------------------------------------ */
  /* Corrección                                                          */
  /* ------------------------------------------------------------------ */
  FIS.corregirInciso = function (inciso, respuesta) {
    if (!inciso) return { estado: 'mal' };
    if (inciso.tipo === 'numero') {
      if (respuesta === '' || respuesta === null || respuesta === undefined) return { estado: 'vacio' };
      var res = FIS.checkNum(respuesta, inciso.valor, inciso);
      if (res.ok) return { estado: 'ok', parsed: res.parsed };
      if (inciso.unidad === '' && (inciso.valor === 0 || inciso.valor === 1)) {
        /* preguntas de Sí/No codificadas 1 y 0: aceptar palabras */
        var t = FIS.norm(respuesta);
        var si = /^(si|sí|s|yes|1|verdadero|v)$/.test(t) || t.indexOf('si') === 0 && t.length <= 4;
        var no = /^(no|n|0|falso|f)$/.test(t);
        var quiere = inciso.valor === 1;
        if ((si && quiere) || (no && !quiere)) return { estado: 'ok' };
        if (si || no) return { estado: 'mal', parsed: si ? 1 : 0 };
      }
      return { estado: 'mal', parsed: res.parsed };
    }
    if (inciso.tipo === 'vf') {
      if (respuesta === null || respuesta === undefined || respuesta === '') return { estado: 'vacio' };
      var dado = (respuesta === true || respuesta === 'true' || respuesta === 'V' || respuesta === 1);
      return { estado: dado === inciso.valor ? 'ok' : 'mal' };
    }
    if (inciso.tipo === 'opcion') {
      if (respuesta === null || respuesta === undefined || respuesta === '') return { estado: 'vacio' };
      return { estado: Number(respuesta) === inciso.correcto ? 'ok' : 'mal' };
    }
    if (inciso.tipo === 'texto') {
      var texto = String(respuesta || '').trim();
      if (texto.length < 10) return { estado: 'vacio' };
      var corr = FIS.corregirTexto(texto, inciso.rubrica || {});
      return { estado: corr.nivel === 'logrado' ? 'ok' : corr.nivel === 'parcial' ? 'parcial' : 'mal', correccion: corr };
    }
    return { estado: 'mal' };
  };

  /* ------------------------------------------------------------------ */
  /* Estadísticas / historial                                            */
  /* ------------------------------------------------------------------ */
  FIS.historial = {
    cargar: function () { return FIS.store.get('cinematica.historial', []); },
    agregar: function (registro) {
      var h = FIS.historial.cargar();
      h.unshift(registro);
      h = h.slice(0, 40);
      FIS.store.set('cinematica.historial', h);
      return h;
    },
    limpiar: function () { FIS.store.set('cinematica.historial', []); }
  };

  FIS.prefs = {
    cargar: function () {
      var p = FIS.store.get('cinematica.prefs', {
        categorias: ['unidad11', 'unidad12', 'horizontal', 'vertical', 'mixto', 'teorico'],
        dif: 'auto', nProblemas: 6, nTeoricos: 2, g: 9.81, tema: 'claro'
      });
      p.categorias = p.categorias || [];
      ['unidad11', 'unidad12'].forEach(function (c) { if (p.categorias.indexOf(c) < 0) p.categorias.push(c); });
      return p;
    },
    guardar: function (p) { FIS.store.set('cinematica.prefs', p); }
  };

})(typeof globalThis !== 'undefined' ? globalThis : this);
