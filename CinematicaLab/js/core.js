/* =========================================================================
   Cinemática Lab — núcleo del motor
   MRUV horizontal y movimientos verticales (UTN FRA · Seminario de Física)
   Sin dependencias externas: funciona con file:// abriendo index.html
   ========================================================================= */
(function (root) {
  'use strict';

  var FIS = (root.FIS = root.FIS || {});
  FIS.VERSION = '1.0.0';

  /* ------------------------------------------------------------------ */
  /* 1. Generador de números pseudoaleatorios con semilla reproducible   */
  /* ------------------------------------------------------------------ */
  function makeRng(seed) {
    var s = (seed >>> 0) || 1;
    function rnd() {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    rnd.int = function (a, b) { return a + Math.floor(rnd() * (b - a + 1)); };
    rnd.float = function (a, b, dec) {
      dec = dec === undefined ? 1 : dec;
      var f = Math.pow(10, dec);
      return Math.round((a + rnd() * (b - a)) * f) / f;
    };
    rnd.pick = function (arr) { return arr[Math.floor(rnd() * arr.length)]; };
    rnd.pickMany = function (arr, n) { return rnd.shuffle(arr).slice(0, n); };
    rnd.shuffle = function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(rnd() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    };
    rnd.chance = function (p) { return rnd() < p; };
    rnd.wp = function (pairs) { // elección ponderada: [[valor, peso], ...]
      var total = 0, i;
      for (i = 0; i < pairs.length; i++) total += pairs[i][1];
      var x = rnd() * total;
      for (i = 0; i < pairs.length; i++) { x -= pairs[i][1]; if (x <= 0) return pairs[i][0]; }
      return pairs[pairs.length - 1][0];
    };
    rnd.bool = function () { return rnd() < 0.5; };
    rnd.seed = seed;
    return rnd;
  }

  FIS.makeRng = makeRng;
  FIS.seedFromString = function (str) {
    var h = 2166136261, i;
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  FIS.seedAleatoria = function () { return Math.floor(Math.random() * 4294967295) >>> 0; };

  /* ------------------------------------------------------------------ */
  /* 2. Formato numérico (coma decimal, sin ceros sobrantes)             */
  /* ------------------------------------------------------------------ */
  function trimZeros(str) {
    if (str.indexOf('.') < 0) return str;
    return str.replace(/0+$/, '').replace(/\.$/, '');
  }
  /** Formatea un número con coma decimal. dec = decimales (por defecto 2). */
  FIS.fmt = function (x, dec) {
    if (x === null || x === undefined || isNaN(x)) return '—';
    if (dec === undefined) dec = 2;
    var s = trimZeros(Math.abs(x).toFixed(dec));
    return (x < 0 ? '−' : '') + s.replace('.', ',');
  };
  /** Formatea con la unidad: fmtU(4.9,'m/s') -> "4,9 m/s" */
  FIS.fmtU = function (x, unidad, dec) { return FIS.fmt(x, dec) + (unidad ? ' ' + unidad : ''); };
  /** Número redondeado a n decimales (half-up). */
  FIS.round = function (x, dec) {
    dec = dec === undefined ? 2 : dec;
    var f = Math.pow(10, dec);
    return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * f) / f;
  };
  /** Decimales sugeridos según magnitud. */
  FIS.autoDec = function (x) {
    var a = Math.abs(x);
    if (a === 0) return 2;
    if (a >= 1000) return 1;
    if (a >= 100) return 2;
    if (a >= 1) return 2;
    return 3;
  };

  /* ------------------------------------------------------------------ */
  /* 3. Lectura y verificación de respuestas                             */
  /* ------------------------------------------------------------------ */
  /** Extrae un número de un texto libre: acepta coma o punto, fracciones y notación científica. */
  FIS.parseNum = function (input) {
    if (typeof input === 'number') return input;
    if (input === null || input === undefined) return NaN;
    var s = String(input).trim().replace(/\s+/g, '').replace(/−/g, '-').replace(',', '.');
    if (s === '') return NaN;
    var frac = s.match(/^[+-]?\d*\.?\d+\/[+-]?\d*\.?\d+$/);
    if (frac) {
      var p = frac[0].split('/');
      return parseFloat(p[0]) / parseFloat(p[1]);
    }
    /* acepta "12.5m/s", "3,2seg", "=45" */
    var m = s.replace(/^=/, '').match(/^[+-]?\d*\.?\d+(?:e[+-]?\d+)?/i);
    if (!m) return NaN;
    return parseFloat(m[0]);
  };

  /**
   * Verifica una respuesta numérica.
   * opts: { tolAbs, tolRel, unidad, requiereSigno }
   */
  FIS.checkNum = function (input, valor, opts) {
    opts = opts || {};
    var tolAbs = opts.tolAbs === undefined ? 0.02 : opts.tolAbs;
    var tolRel = opts.tolRel === undefined ? 0.01 : opts.tolRel;
    var u = FIS.parseNum(input);
    if (isNaN(u)) return { ok: false, vacio: true, parsed: NaN };
    var tol = Math.max(tolAbs, Math.abs(valor) * tolRel);
    var dif = Math.abs(u - valor);
    if (Math.abs(valor) < 1e-9 && Math.abs(u) < 1e-9) return { ok: true, parsed: u, tol: tol };
    return { ok: dif <= tol, parsed: u, tol: tol, esperado: valor };
  };

  /* Normaliza texto: minúsculas, sin acentos, sin signos dobles. */
  FIS.norm = function (t) {
    return String(t || '')
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e').replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o').replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n')
      .replace(/\s+/g, ' ')
      .trim();
  };

  /**
   * Corrección de una justificación escrita por el alumno (corrección por rúbrica).
   * rubrica: { conceptos:[{label, patrones:[...], peso}], errores:[{label, patrones:[...], mensaje}] }
   */
  FIS.corregirTexto = function (texto, rubrica) {
    var t = FIS.norm(texto);
    var palabras = t.split(/\s+/).filter(function (w) { return w.length > 2; });
    var acertados = [], faltantes = [], errores = [];
    var total = 0, obtenido = 0;
    (rubrica.conceptos || []).forEach(function (c) {
      var peso = c.peso === undefined ? 1 : c.peso;
      total += peso;
      var ok = (c.patrones || []).some(function (p) { return t.indexOf(FIS.norm(p)) >= 0; });
      if (ok) { obtenido += peso; acertados.push(c.label); } else { faltantes.push(c.label); }
    });
    (rubrica.errores || []).forEach(function (e) {
      var mal = (e.patrones || []).some(function (p) { return t.indexOf(FIS.norm(p)) >= 0; });
      if (mal) errores.push({ label: e.label, mensaje: e.mensaje || '' });
    });
    var puntaje = total > 0 ? obtenido / total : 0;
    /* Respuestas muy breves (por ejemplo "es verdadero porque da 2 m") no alcanzan
       para el nivel "logrado". El mínimo es configurable por rúbrica. */
    var minPalabras = rubrica && rubrica.minPalabras !== undefined ? rubrica.minPalabras : 5;
    var muyCorta = palabras.length < minPalabras;
    return {
      puntaje: puntaje, acertados: acertados, faltantes: faltantes, errores: errores,
      muyCorta: muyCorta, palabras: palabras.length,
      nivel: puntaje >= 0.75 && !muyCorta ? 'logrado' : puntaje >= 0.4 ? 'parcial' : 'insuficiente'
    };
  };

  /* ------------------------------------------------------------------ */
  /* 4. Gráficos SVG (sin librerías)                                      */
  /* ------------------------------------------------------------------ */
  function niceStep(range, objetivo) {
    var raw = range / (objetivo || 5);
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / mag;
    var mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
    return mult * mag;
  }

  /**
   * FIS.svgPlot({ series:[{pts:[[x,y],...], color, label, dashed, width}], xLabel, yLabel,
   *   width, height, xMin, xMax, yMin, yMax, titulo, marcarPuntos:[[x,y,texto]] })
   */
  FIS.svgPlot = function (o) {
    o = o || {};
    var W = o.width || 460, H = o.height || 260;
    var pad = { l: 52, r: 16, t: o.titulo ? 30 : 16, b: 40 };
    var series = (o.series || []).filter(function (s) { return s.pts && s.pts.length; });
    var xs = [], ys = [], i, j;
    for (i = 0; i < series.length; i++) {
      for (j = 0; j < series[i].pts.length; j++) { xs.push(series[i].pts[j][0]); ys.push(series[i].pts[j][1]); }
    }
    if (o.marcarPuntos) for (i = 0; i < o.marcarPuntos.length; i++) { xs.push(o.marcarPuntos[i][0]); ys.push(o.marcarPuntos[i][1]); }
    if (!xs.length) { xs = [0, 1]; ys = [0, 1]; }
    var xMin = o.xMin !== undefined ? o.xMin : Math.min.apply(null, xs);
    var xMax = o.xMax !== undefined ? o.xMax : Math.max.apply(null, xs);
    var yMin = o.yMin !== undefined ? o.yMin : Math.min.apply(null, ys);
    var yMax = o.yMax !== undefined ? o.yMax : Math.max.apply(null, ys);
    if (xMax - xMin < 1e-9) { xMax = xMin + 1; }
    if (yMax - yMin < 1e-9) { yMax = yMin + 1; }
    var ry = yMax - yMin; yMin -= ry * 0.12; yMax += ry * 0.12;

    function X(x) { return pad.l + (x - xMin) / (xMax - xMin) * (W - pad.l - pad.r); }
    function Y(y) { return H - pad.b - (y - yMin) / (yMax - yMin) * (H - pad.t - pad.b); }

    var s = [];
    s.push('<svg class="grafico" viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" preserveAspectRatio="xMidYMid meet">');
    s.push('<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="var(--grafico-fondo)" rx="10"/>');
    var stepX = niceStep(xMax - xMin, 6), stepY = niceStep(yMax - yMin, 5);
    var k;
    /* grilla vertical */
    for (k = Math.ceil(xMin / stepX) * stepX; k <= xMax + 1e-9; k += stepX) {
      s.push('<line x1="' + X(k).toFixed(1) + '" y1="' + pad.t + '" x2="' + X(k).toFixed(1) + '" y2="' + (H - pad.b) + '" stroke="var(--grafico-grilla)" stroke-width="1"/>');
      s.push('<text x="' + X(k).toFixed(1) + '" y="' + (H - pad.b + 16) + '" class="eje-num" text-anchor="middle">' + FIS.fmt(k, Math.abs(stepX) < 1 ? 1 : 0) + '</text>');
    }
    /* grilla horizontal */
    for (k = Math.ceil(yMin / stepY) * stepY; k <= yMax + 1e-9; k += stepY) {
      s.push('<line x1="' + pad.l + '" y1="' + Y(k).toFixed(1) + '" x2="' + (W - pad.r) + '" y2="' + Y(k).toFixed(1) + '" stroke="var(--grafico-grilla)" stroke-width="1"/>');
      s.push('<text x="' + (pad.l - 8) + '" y="' + (Y(k) + 4).toFixed(1) + '" class="eje-num" text-anchor="end">' + FIS.fmt(k, Math.abs(stepY) < 1 ? 1 : 0) + '</text>');
    }
    /* ejes */
    var y0 = (yMin <= 0 && yMax >= 0) ? Y(0) : H - pad.b;
    var x0 = (xMin <= 0 && xMax >= 0) ? X(0) : pad.l;
    s.push('<line x1="' + pad.l + '" y1="' + y0.toFixed(1) + '" x2="' + (W - pad.r) + '" y2="' + y0.toFixed(1) + '" stroke="var(--grafico-eje)" stroke-width="1.6"/>');
    s.push('<line x1="' + x0.toFixed(1) + '" y1="' + pad.t + '" x2="' + x0.toFixed(1) + '" y2="' + (H - pad.b) + '" stroke="var(--grafico-eje)" stroke-width="1.6"/>');
    /* series */
    for (i = 0; i < series.length; i++) {
      var pts = series[i].pts.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' ');
      s.push('<polyline points="' + pts + '" fill="none" stroke="' + (series[i].color || 'var(--acento)') + '" stroke-width="' + (series[i].width || 2.6) + '"' + (series[i].dashed ? ' stroke-dasharray="6 4"' : '') + ' stroke-linejoin="round" stroke-linecap="round"/>');
    }
    /* puntos destacados */
    if (o.marcarPuntos) {
      for (i = 0; i < o.marcarPuntos.length; i++) {
        var mp = o.marcarPuntos[i];
        s.push('<circle cx="' + X(mp[0]).toFixed(1) + '" cy="' + Y(mp[1]).toFixed(1) + '" r="4" fill="var(--alerta)"/>');
        if (mp[2]) s.push('<text x="' + (X(mp[0]) + 7).toFixed(1) + '" y="' + (Y(mp[1]) - 7).toFixed(1) + '" class="eje-etq">' + mp[2] + '</text>');
      }
    }
    /* etiquetas de ejes */
    s.push('<text x="' + (W - pad.r) + '" y="' + (y0 - 8).toFixed(1) + '" class="eje-lab" text-anchor="end">' + (o.xLabel || 't (s)') + '</text>');
    s.push('<text x="' + (pad.l + 6) + '" y="' + (pad.t - 6) + '" class="eje-lab">' + (o.yLabel || '') + '</text>');
    if (o.titulo) s.push('<text x="' + (W / 2) + '" y="16" class="graf-titulo" text-anchor="middle">' + o.titulo + '</text>');
    /* leyenda */
    if (series.length > 1) {
      var ly = pad.t + 6;
      for (i = 0; i < series.length; i++) {
        s.push('<rect x="' + (pad.l + 8) + '" y="' + (ly - 7) + '" width="18" height="4" rx="2" fill="' + (series[i].color || 'var(--acento)') + '"/>');
        s.push('<text x="' + (pad.l + 32) + '" y="' + (ly - 1) + '" class="eje-etq">' + (series[i].label || ('serie ' + (i + 1))) + '</text>');
        ly += 16;
      }
    }
    s.push('</svg>');
    return s.join('');
  };

  /** Genera los puntos de una poligonal a partir de tramos {t0,t1,v0,v1} de v = f(t). */
  FIS.puntosDeTramos = function (tramos, paso) {
    paso = paso || 0.05;
    var pts = [];
    tramos.forEach(function (tr) {
      for (var t = tr.t0; t <= tr.t1 + 1e-9; t += paso) {
        var f = (t - tr.t0) / (tr.t1 - tr.t0);
        pts.push([FIS.round(t, 3), tr.v0 + (tr.v1 - tr.v0) * f]);
      }
    });
    return pts;
  };

  /* ------------------------------------------------------------------ */
  /* 5. Registro de generadores                                          */
  /* ------------------------------------------------------------------ */
  FIS.generadores = [];
  FIS.bancoTeorico = [];
  FIS.registrar = function (g) { FIS.generadores.push(g); return g; };
  FIS.registrarTeorico = function (t) { FIS.bancoTeorico.push(t); return t; };
  FIS.generadorPorId = function (id) {
    for (var i = 0; i < FIS.generadores.length; i++) if (FIS.generadores[i].id === id) return FIS.generadores[i];
    return null;
  };

  /* Constantes y utilidades físicas */
  FIS.G_DEFAULT = 9.81;
  FIS.grav = function (x) { return 9.81; };
  FIS.cuadratica = function (a, b, c) { // raíces reales de a t^2 + b t + c
    var d = b * b - 4 * a * c;
    if (d < 0) return [];
    var raiz = Math.sqrt(d);
    return [(-b - raiz) / (2 * a), (-b + raiz) / (2 * a)].sort(function (x, y) { return x - y; });
  };
  FIS.raizPositiva = function (a, b, c) {
    var rs = FIS.cuadratica(a, b, c);
    for (var i = 0; i < rs.length; i++) if (rs[i] > 1e-9) return rs[i];
    return NaN;
  };

  /* ------------------------------------------------------------------ */
  /* 6. Constructores de incisos y bloques de solución                   */
  /* ------------------------------------------------------------------ */
  /** Inciso numérico. */
  FIS.num = function (id, consigna, valor, unidad, extra) {
    var o = { id: id, tipo: 'numero', consigna: consigna, valor: valor, unidad: unidad || '' };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  };
  /** Inciso verdadero/falso. */
  FIS.vf = function (id, consigna, valor, extra) {
    var o = { id: id, tipo: 'vf', consigna: consigna, valor: !!valor };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  };
  /** Inciso de opción múltiple. */
  FIS.op = function (id, consigna, opciones, indiceCorrecto, extra) {
    var o = { id: id, tipo: 'opcion', consigna: consigna, opciones: opciones, correcto: indiceCorrecto };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  };
  /** Inciso de justificación redactada (corrección por rúbrica). */
  FIS.texto = function (id, consigna, rubrica, modelo, extra) {
    var o = { id: id, tipo: 'texto', consigna: consigna, rubrica: rubrica, modelo: modelo };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  };
  /** Paso de solución: {titulo, html} */
  FIS.paso = function (titulo, html) { return { titulo: titulo, html: html }; };

  /** Bloque de "herramientas metodológicas" usado por la cátedra. */
  FIS.diagramaPictorico = function (oe, mr, sc, rp) {
    var objeto = String(oe || 'móvil').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var marco = String(mr || 'referencia').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var eje = String(sc || 'eje elegido').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<div class="pictorico"><svg viewBox="0 0 620 170" role="img" aria-label="Esquema pictórico del movimiento">' +
      '<defs><marker id="flecha-pictorica" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--acento)"/></marker><marker id="flecha-acel" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--mal)"/></marker></defs>' +
      '<line x1="48" y1="125" x2="575" y2="125" stroke="var(--grafico-eje)" stroke-width="2" marker-end="url(#flecha-pictorica)"/><line x1="85" y1="118" x2="85" y2="132" stroke="var(--grafico-eje)"/><text x="78" y="149" class="pictorico-texto">origen</text>' +
      '<circle cx="300" cy="98" r="18" fill="var(--acento-suave)" stroke="var(--acento)" stroke-width="3"/><text x="300" y="103" text-anchor="middle" class="pictorico-texto">OE</text>' +
      '<line x1="300" y1="73" x2="410" y2="73" stroke="var(--acento)" stroke-width="3" marker-end="url(#flecha-pictorica)"/><text x="355" y="61" text-anchor="middle" class="pictorico-texto">v(t)</text>' +
      '<line x1="300" y1="51" x2="235" y2="51" stroke="var(--mal)" stroke-width="3" marker-end="url(#flecha-acel)"/><text x="267" y="39" text-anchor="middle" class="pictorico-texto">a(t)</text>' +
      '<text x="310" y="151" class="pictorico-texto">' + objeto + '</text><text x="48" y="22" class="pictorico-texto">Marco: ' + marco + '</text><text x="370" y="22" class="pictorico-texto">' + eje + '</text></svg>' +
      '<div class="pictorico-caption">' + String(rp || 'El esquema muestra el objeto, el eje y los vectores instantáneos.') + '</div></div>';
  };
  FIS.herramientas = function (oe, mr, sc, rp) {
    return FIS.paso('Herramientas metodológicas',
      '<ul class="lista-pasos">' +
      '<li><b>Objeto de estudio:</b> ' + oe + '</li>' +
      '<li><b>Modelización:</b> partícula (se desprecia el rozamiento con el aire)</li>' +
      '<li><b>Marco de referencia:</b> ' + mr + '</li>' +
      '<li><b>Sistema de coordenadas:</b> ' + sc + '</li>' +
      '<li><b>Representación pictórica:</b> ver esquema</li>' +
      '</ul>' + FIS.diagramaPictorico(oe, mr, sc, rp));
  };

  FIS.eq = function (txt) { return '<span class="eq">' + String(txt).replace(/½/g, '0.5').replace(/1\/3,6/g, '0.2778').replace(/\/(\s*\()/g, ' ÷ $1').replace(/²\/(\s*2)/g, '² · 0.5 ÷ $1') + '</span>'; };

})(typeof globalThis !== 'undefined' ? globalThis : this);
(function (root) {
  'use strict';
  var FIS = root.FIS;
  function spec(genId, d, g) {
    d = d || {}; g = g || FIS.G_DEFAULT;
    var x0, v0, a, tMax;
    if (genId === 'H1_ecuacion_horaria' || genId === 'H2_mruv_directo') { x0 = d.x0; v0 = d.v0; a = d.a; tMax = d.t2 || d.t || 6; }
    else if (genId === 'H3_frenado') { x0 = 0; v0 = d.v0 || (d.kmh || 0) / 3.6; a = -(d.aStop || 5); tMax = d.tStop || v0 / Math.abs(a); }
    else if (genId === 'V1_caida_libre_basica') { x0 = d.H; v0 = 0; a = -g; tMax = Math.sqrt(2 * x0 / g); }
    else if (genId === 'V3_tiro_vertical_basico') { x0 = 0; v0 = d.v0; a = -g; tMax = 2 * v0 / g; }
    else if (genId === 'V4_tiro_vertical_desde_altura') { x0 = d.H; v0 = d.v0; a = -g; tMax = (v0 + Math.sqrt(v0 * v0 + 2 * g * x0)) / g; }
    else return null;
    if (![x0, v0, a, tMax].every(function (n) { return typeof n === 'number' && isFinite(n); })) return null;
    return { x0: x0, v0: v0, a: a, tMax: Math.max(.5, tMax), unidad: genId.charAt(0) === 'V' ? 'y' : 'x' };
  }
  FIS.interactivoSpec = spec;
  FIS.interactivoHTML = function (sp, t, modo) {
    t = Math.max(0, Math.min(sp.tMax, Number(t) || 0)); modo = modo || 'x';
    var x = sp.x0 + sp.v0 * t + .5 * sp.a * t * t, v = sp.v0 + sp.a * t, a = sp.a;
    var n = 70, series = [], pts = [], i, q;
    for (i = 0; i <= n; i++) { q = sp.tMax * i / n; pts.push([q, modo === 'x' ? sp.x0 + sp.v0 * q + .5 * sp.a * q * q : modo === 'v' ? sp.v0 + sp.a * q : sp.a]); }
    series.push({ pts: pts, color: 'var(--acento)', label: modo === 'x' ? 'posición' : modo === 'v' ? 'velocidad' : 'aceleración' });
    var actual = modo === 'x' ? x : modo === 'v' ? v : a;
    var graf = FIS.svgPlot({ series: series, xLabel: 't (s)', yLabel: modo === 'x' ? sp.unidad + ' (m)' : modo === 'v' ? 'v (m/s)' : 'a (m/s²)', titulo: (modo === 'x' ? 'Posición' : modo === 'v' ? 'Velocidad' : 'Aceleración') + ' en función del tiempo', xMin: 0, xMax: sp.tMax, marcarPuntos: [[t, actual, 't = ' + FIS.fmt(t) + ' s']] });
    return '<div class="interactivo" data-interactivo-root><div class="interactivo-cab"><b>Explorador interactivo</b><span>Mové el tiempo y observá cómo cambian las magnitudes.</span></div>' +
      '<div class="interactivo-controles"><label>Gráfico <select data-interactivo-modo><option value="x"' + (modo === 'x' ? ' selected' : '') + '>posición ' + sp.unidad + '(t)</option><option value="v"' + (modo === 'v' ? ' selected' : '') + '>velocidad v(t)</option><option value="a"' + (modo === 'a' ? ' selected' : '') + '>aceleración a(t)</option></select></label><label>Tiempo: <output data-interactivo-label>' + FIS.fmt(t) + ' s</output><input type="range" min="0" max="' + sp.tMax + '" step="0.01" value="' + t + '" data-interactivo-time></label></div>' +
      '<div class="interactivo-grafico">' + graf + '</div><div class="interactivo-valores"><span><b>' + sp.unidad + '(t)</b><strong>' + FIS.fmt(x) + ' m</strong></span><span><b>v(t)</b><strong>' + FIS.fmt(v) + ' m/s</strong></span><span><b>a(t)</b><strong>' + FIS.fmt(a) + ' m/s²</strong></span></div></div>';
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
