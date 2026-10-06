/* =========================================================================
   Generadores — MRUV sobre un eje horizontal (Unidad 2.1)
   Cada generador devuelve una situación aleatoria nueva, con incisos,
   pistas progresivas y resolución paso a paso.
   ========================================================================= */
(function (root) {
  'use strict';
  var FIS = root.FIS, R = FIS.registrar;
  var f = FIS.fmt, eq = FIS.eq;

  function pistas(ps) { return ps; }

  /* =======================================================================
     H1 · MRUV a partir de la ecuación horaria (x(t) = x0 + v0 t + 0.5 a t²)
     ======================================================================= */
  R({
    id: 'H1_ecuacion_horaria',
    unidad: '2.1', cat: 'horizontal', tema: 'Ecuaciones horarias del MRUV',
    nombre: 'Ecuación horaria: frenada, retroceso y distancia recorrida',
    dif: 2,
    desc: 'A partir de x(t) calcular el instante de detención, posiciones, desplazamiento y longitud de trayectoria.',
    gen: function (r, g) {
      var aMag = r.pick([1, 2, 2.5, 4, 5]);
      var k = r.int(2, 8);
      var v0 = aMag * k;                    // rapidez inicial
      var haciaDerecha = r.bool();
      var v0s = haciaDerecha ? v0 : -v0;
      var as = haciaDerecha ? -aMag : aMag;
      var x0 = r.pick([-20, -10, 0, 10, 20, 25, 40, 50]);
      var t2 = k + r.int(1, 4);
      var t1 = Math.max(1, Math.round(k / 2));

      function x(t) { return x0 + v0s * t + 0.5 * as * t * t; }
      function v(t) { return v0s + as * t; }
      var tDet = -v0s / as;
      var xDet = x(tDet), x2 = x(t2);
      var desl = x2 - x0;
      var dist = Math.abs(xDet - x0) + Math.abs(x2 - xDet);

      var unidadSentido = haciaDerecha ? 'sentido positivo (hacia la derecha)' : 'sentido negativo (hacia la izquierda)';
      return {
        titulo: 'Ecuación horaria del movimiento',
        enunciado:
          '<p>La función horaria de la componente <i>x</i> de la posición de un móvil que se desplaza sobre una ' +
          'trayectoria rectilínea es:</p>' +
          '<p class="formula">x(t) = ' + f(x0) + ' m ' + (v0s >= 0 ? '+' : '−') + ' ' + f(Math.abs(v0s)) +
          ' m/s · t ' + (as >= 0 ? '+' : '−') + ' ' + f(Math.abs(as) / 2, 2) + ' m/s² · t²</p>' +
          '<p>El sistema de coordenadas tiene su semieje positivo de abscisas hacia la derecha. ' +
          'Se pide responder justificando cada cálculo.</p>',
        incisos: [
          FIS.num('a', '¿En qué instante se detiene el móvil (rapidez nula)?', tDet, 's', {
            solucion: [
              FIS.paso('Datos y ecuación', 'De la función horaria se leen los parámetros iniciales: ' +
                eq('x₀ = ' + f(x0) + ' m') + ', ' + eq('v₀ₓ = ' + f(v0s) + ' m/s') + ' y ' +
                eq('aₓ = ' + f(as) + ' m/s²') + ' (el coeficiente de t² es aₓ/2).'),
              FIS.paso('Condición de rapidez nula', 'La velocidad es ' + eq('vₓ(t) = v₀ₓ + aₓ · t') + '. Se detiene cuando vₓ = 0:'),
              FIS.paso('Despeje', eq('0 = ' + f(v0s) + ' + (' + f(as) + ') · t ⇒ t = ' + f(tDet) + ' s'))
            ]
          }),
          FIS.num('b', '¿Cuál es su posición en t = ' + t1 + ' s?', x(t1), 'm', {
            solucion: [FIS.paso('Reemplazo en la ecuación horaria',
              eq('x(' + t1 + ' s) = ' + f(x0) + ' + (' + f(v0s) + ')·' + t1 + ' + ' + f(as / 2) + '·(' + t1 + ')² = ' + f(x(t1)) + ' m'))]
          }),
          FIS.num('c', '¿Cuál es la componente x del desplazamiento en el intervalo [0 ; ' + t2 + '] s?', desl, 'm', {
            solucion: [
              FIS.paso('Desplazamiento', eq('∆x = x(' + t2 + ') − x(0) = ' + f(x2) + ' m − (' + f(x0) + ' m) = ' + f(desl) + ' m')),
              FIS.paso('Interpretación', 'El signo del desplazamiento indica el sentido del movimiento resultante entre los dos instantes considerados.')
            ]
          }),
          FIS.num('d', '¿Cuál es la distancia recorrida (longitud de trayectoria) en ese mismo intervalo?', dist, 'm', {
            solucion: [
              FIS.paso('¡Cuidado con el retroceso!', 'El móvil invierte el sentido en t = ' + f(tDet) + ' s, así que la trayectoria tiene dos tramos: ' +
                'sumar distancias en valor absoluto, no el desplazamiento.'),
              FIS.paso('Tramo de ida', eq('|x(' + f(tDet) + ') − x(0)| = |' + f(xDet) + ' − (' + f(x0) + ')| = ' + f(Math.abs(xDet - x0)) + ' m')),
              FIS.paso('Tramo de vuelta', eq('|x(' + t2 + ') − x(' + f(tDet) + ')| = |' + f(x2) + ' − (' + f(xDet) + ')| = ' + f(Math.abs(x2 - xDet)) + ' m')),
              FIS.paso('Distancia total', eq('d = ' + f(Math.abs(xDet - x0)) + ' m + ' + f(Math.abs(x2 - xDet)) + ' m = ' + f(dist) + ' m'))
            ]
          }),
          FIS.vf('e', 'El móvil invierte el sentido de su movimiento en algún instante del intervalo [0 ; ' + t2 + '] s.', true, {
            pistas: ['Mirá el signo de la velocidad antes y después de t = ' + f(tDet) + ' s.'],
            solucion: [FIS.paso('Justificación', 'v₀ₓ = ' + f(v0s) + ' m/s apunta en sentido ' + unidadSentido +
              ', pero aₓ = ' + f(as) + ' m/s² tiene sentido contrario: el móvil frena, se detiene en t = ' + f(tDet) +
              ' s y luego se mueve en sentido opuesto. La afirmación es <b>verdadera</b>.')]
          })
        ],
        datos: { x0: x0, v0: v0s, a: as, t1: t1, t2: t2 }
      };
    }
  });

  /* =======================================================================
     H2 · MRUV directo (deportista/motociclista que acelera)
     ======================================================================= */
  R({
    id: 'H2_mruv_directo',
    unidad: '2.1', cat: 'horizontal', tema: 'Ecuaciones horarias del MRUV',
    nombre: 'Movimiento uniformemente acelerado: posición, velocidad y ecuación complementaria',
    dif: 1,
    desc: 'Datos x0, v0 y a constantes; calcular posición, velocidad, y dónde alcanza cierta velocidad.',
    gen: function (r, g) {
      var x0 = r.int(0, 20);
      var v0 = r.int(5, 15);
      var a = r.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]);
      var t = r.int(2, 6);
      var k = r.int(2, 5);
      var vf = v0 + a * k;
      var xT = x0 + v0 * t + 0.5 * a * t * t;
      var vT = v0 + a * t;
      var xVf = x0 + (vf * vf - v0 * v0) / (2 * a);
      var distVf = xVf - x0;
      return {
        titulo: 'MRUV: posición, velocidad y velocidad alcanzada',
        enunciado:
          '<p>Un motociclista se desplaza en línea recta. En <i>t</i> = 0 s pasa por la posición x = ' + f(x0, 0) +
          ' m moviéndose en el sentido positivo del eje x con una velocidad de ' + f(v0) +
          ' m/s, y mantiene una aceleración constante de ' + f(a) + ' m/s² (en el mismo sentido del movimiento).</p>' +
          '<p>Determinar, justificando con las ecuaciones horarias:</p>',
        incisos: [
          FIS.num('a', 'Su posición en t = ' + t + ' s.', xT, 'm', {
            solucion: [
              FIS.herramientas('el motociclista', 'la ruta', 'eje x con origen donde lo observamos por primera vez, sentido positivo hacia la derecha',
                'el móvil parte de x₀ = ' + f(x0, 0) + ' m con v₀ₓ = ' + f(v0) + ' m/s y aₓ = ' + f(a) + ' m/s²'),
              FIS.paso('Ecuación horaria de posición', eq('x(t) = x₀ + v₀ₓ·t + 0.5·aₓ·t²')),
              FIS.paso('Reemplazo', eq('x(' + t + ') = ' + f(x0, 0) + ' + ' + f(v0) + '·' + t + ' + 0.5·' + f(a) + '·' + t + '² = ' + f(xT) + ' m'))
            ]
          }),
          FIS.num('b', 'Su velocidad en t = ' + t + ' s.', vT, 'm/s', {
            solucion: [FIS.paso('Ecuación horaria de velocidad',
              eq('vₓ(t) = v₀ₓ + aₓ·t = ' + f(v0) + ' + ' + f(a) + '·' + t + ' = ' + f(vT) + ' m/s'))]
          }),
          FIS.num('c', '¿En qué posición se encuentra cuando su velocidad es de ' + f(vf) + ' m/s?', xVf, 'm', {
            pistas: ['Podés combinar las ecuaciones o usar la ecuación complementaria.'],
            solucion: [
              FIS.paso('Camino 1: por la ecuación de velocidad', eq('vₓ = v₀ₓ + aₓ·t ⇒ t = (' + f(vf) + ' − ' + f(v0) + ')/' + f(a) + ' = ' + f(k) + ' s')),
              FIS.paso('Luego, en posición', eq('x = ' + f(x0, 0) + ' + ' + f(v0) + '·' + f(k) + ' + 0.5·' + f(a) + '·' + f(k) + '² = ' + f(xVf) + ' m')),
              FIS.paso('Camino 2: ecuación complementaria (sin conocer t)', eq('x − x₀ = (vₓ² − v₀ₓ²)/(2·aₓ) = (' + f(vf) + '² − ' + f(v0) + '²)/(2·' + f(a) + ') = ' + f(distVf) + ' m ⇒ x = ' + f(xVf) + ' m'))
            ]
          })
        ],
        datos: { x0: x0, v0: v0, a: a, t: t, vf: vf }
      };
    }
  });

  /* =======================================================================
     H3 · Frenado: distancia y tiempo (con y sin tiempo de reacción)
     ======================================================================= */
  R({
    id: 'H3_frenado',
    unidad: '2.1', cat: 'horizontal', tema: 'Frenado y distancia de detención',
    nombre: 'Distancia y tiempo de frenado (con tiempo de reacción)',
    dif: 1,
    desc: 'Conversión de unidades, tiempo de detención, distancia de frenado y distancia total con tiempo de reacción.',
    gen: function (r, g) {
      var kmh = r.pick([36, 54, 72, 90, 108, 126, 144]);
      var v0 = kmh / 3.6;
      var aStop = r.pick([3, 4, 5, 6, 7, 8]);
      var reaccion = r.pick([0.5, 0.8, 1]);
      var tStop = v0 / aStop;
      var dFren = (v0 * v0) / (2 * aStop);
      var dReac = v0 * reaccion;
      var dTotal = dReac + dFren;
      return {
        titulo: 'Frenado de un vehículo',
        enunciado:
          '<p>Un auto se desplaza en línea recta a ' + f(kmh, 0) + ' km/h. La conductora ve un obstáculo y, desde ese instante, ' +
          'frena con una desaceleración constante de módulo ' + f(aStop) + ' m/s² hasta detenerse.</p>' +
          '<p>Despreciar el rozamiento con el aire y considerar movimiento rectilíneo.</p>',
        incisos: [
          FIS.num('a', 'Expresar la rapidez inicial en m/s (pasaje de unidades).', v0, 'm/s', {
            solucion: [FIS.paso('Pasaje de unidades', eq('v₀ = ' + f(kmh, 0) + ' km/h = ' + f(kmh, 0) + ' / 3,6 m/s = ' + f(v0) + ' m/s'))]
          }),
          FIS.num('b', '¿Cuánto tarda en detenerse?', tStop, 's', {
            solucion: [
              FIS.paso('Sistema de referencia', 'Eje x en el sentido del movimiento: v₀ₓ = +' + f(v0) + ' m/s y aₓ = −' + f(aStop) + ' m/s² (aceleración opuesta a la velocidad).'),
              FIS.paso('Condición de detención', eq('0 = v₀ₓ + aₓ·t ⇒ t = ' + f(v0) + '/' + f(aStop) + ' = ' + f(tStop) + ' s'))
            ]
          }),
          FIS.num('c', '¿Qué distancia recorre durante el frenado?', dFren, 'm', {
            solucion: [
              FIS.paso('Ecuación complementaria', eq('d = (vₓ² − v₀ₓ²)/(2·aₓ) = (0 − ' + f(v0) + '²)/(2·(−' + f(aStop) + ')) = ' + f(dFren) + ' m')),
              FIS.paso('Verificación por área del gráfico v-t', 'El área bajo v(t) es un triángulo de base ' + f(tStop) + ' s y altura ' + f(v0) + ' m/s: 0.5·' + f(tStop) + '·' + f(v0) + ' = ' + f(dFren) + ' m.')
            ]
          }),
          FIS.num('d', 'Si su tiempo de reacción (antes de pisar el freno) es de ' + f(reaccion) + ' s, ¿cuál es la distancia total recorrida desde que ve el obstáculo hasta detenerse?', dTotal, 'm', {
            pistas: ['En el tiempo de reacción el auto NO frena: se mueve con MRU.'],
            solucion: [
              FIS.paso('Tramo 1: tiempo de reacción (MRU)', eq('d₁ = v₀ · tᵣ = ' + f(v0) + ' · ' + f(reaccion) + ' = ' + f(dReac) + ' m')),
              FIS.paso('Tramo 2: frenado', eq('d₂ = ' + f(dFren) + ' m')),
              FIS.paso('Distancia total', eq('d = d₁ + d₂ = ' + f(dReac) + ' + ' + f(dFren) + ' = ' + f(dTotal) + ' m'))
            ]
          })
        ],
        datos: { kmh: kmh, aStop: aStop, reaccion: reaccion }
      };
    }
  });

  /* =======================================================================
     H4 · Frenado en dos superficies (seco / húmedo)
     ======================================================================= */
  R({
    id: 'H4_dos_superficies',
    unidad: '2.1', cat: 'horizontal', tema: 'Frenado y distancia de detención',
    nombre: 'Comparación de distancias de frenado en distintas superficies',
    dif: 2,
    desc: 'Comparar la distancia de detención sobre hormigón seco y húmedo e interpretar el efecto del tiempo de reacción.',
    gen: function (r, g) {
      var kmh = r.pick([72, 90, 108, 120, 144]);
      var v0 = kmh / 3.6;
      var aSeco = r.pick([6, 7, 8]);
      var aHum = r.pick([3, 4, 5]);
      var tr = r.pick([0.5, 0.8]);
      var dSeco = (v0 * v0) / (2 * aSeco);
      var dHum = (v0 * v0) / (2 * aHum);
      var dif = dHum - dSeco;
      var totalSeco = v0 * tr + dSeco;
      return {
        titulo: 'Frenado en hormigón seco y húmedo',
        enunciado:
          '<p>Sobre hormigón seco, un auto puede desacelerar a razón de ' + f(aSeco) + ' m/s²; sobre hormigón húmedo, ' +
          'ese valor se reduce a ' + f(aHum) + ' m/s². El auto se desplaza a ' + f(kmh, 0) + ' km/h.</p>',
        incisos: [
          FIS.num('a', 'Distancia necesaria para detenerse sobre hormigón seco.', dSeco, 'm', {
            solucion: [
              FIS.paso('Conversión', eq('v₀ = ' + f(kmh, 0) + ' km/h = ' + f(v0) + ' m/s')),
              FIS.paso('Ecuación complementaria', eq('d = v₀²/(2·a) = ' + f(v0) + '²/(2·' + f(aSeco) + ') = ' + f(dSeco) + ' m'))
            ]
          }),
          FIS.num('b', 'Distancia necesaria para detenerse sobre hormigón húmedo.', dHum, 'm', {
            solucion: [FIS.paso('Mismo cálculo con la menor desaceleración', eq('d = ' + f(v0) + '²/(2·' + f(aHum) + ') = ' + f(dHum) + ' m'))]
          }),
          FIS.num('c', '¿Cuántos metros más necesita sobre piso húmedo que sobre seco?', dif, 'm', {
            solucion: [FIS.paso('Diferencia', eq('∆d = ' + f(dHum) + ' m − ' + f(dSeco) + ' m = ' + f(dif) + ' m'))]
          }),
          FIS.num('d', 'Si la conductora tarda ' + f(tr) + ' s en reaccionar antes de frenar, ¿cuál es la distancia total de detención en piso seco?', totalSeco, 'm', {
            solucion: [
              FIS.paso('Tramo de reacción (MRU)', eq('d₁ = v₀·tᵣ = ' + f(v0) + '·' + f(tr) + ' = ' + f(v0 * tr) + ' m')),
              FIS.paso('Distancia total', eq('d = ' + f(v0 * tr) + ' + ' + f(dSeco) + ' = ' + f(totalSeco) + ' m')),
              FIS.paso('Interpretación', 'El tiempo de reacción agrega un tramo sin frenar; por eso el conductor debe mantener distancia de seguimiento.')
            ]
          })
        ],
        datos: { v0: v0, aSeco: aSeco, aHum: aHum, tr: tr }
      };
    }
  });

  /* =======================================================================
     H5 · Encuentro MRU – MRU (persecución o cruce frontal)
     ======================================================================= */
  R({
    id: 'H5_encuentro_mru_mru',
    unidad: '2.1', cat: 'horizontal', tema: 'Encuentros y persecuciones',
    nombre: 'Encuentro entre dos móviles con velocidad constante',
    dif: 1,
    desc: 'Persecución (mismo sentido) o cruce frontal (sentidos opuestos) entre dos móviles de velocidad constante.',
    gen: function (r, g) {
      var persecucion = r.bool();
      var d0 = r.int(2, 16) * 25;
      var vA, vB, t, x1, x2, nombreA, nombreB;
      if (persecucion) {
        vA = r.int(10, 24);                    // el que va adelante
        vB = vA + r.int(2, 12);                // el que persigue, más rápido
        t = d0 / (vB - vA);
        x1 = vB * t;                           // posición medida desde el punto de partida del perseguidor
        x2 = vA * t;
        nombreA = 'un auto que circula adelante'; nombreB = 'una moto que lo persigue';
      } else {
        vA = r.int(10, 30); vB = r.int(10, 30);
        t = d0 / (vA + vB);
        x1 = vA * t; x2 = vB * t;
        nombreA = 'un camión'; nombreB = 'un auto';
      }
      var t2 = Math.round(t * 2);
      return {
        titulo: persecucion ? 'Persecución con velocidades constantes' : 'Encuentro frontal con velocidades constantes',
        enunciado:
          '<p>' + (persecucion
            ? 'Por una ruta recta, ' + nombreA + ' a ' + f(vA, 0) + ' m/s y, ' + f(d0, 0) + ' m más atrás, ' + nombreB +
              ' a ' + f(vB, 0) + ' m/s en el mismo sentido. Ambos mantienen velocidad constante (MRU práctico).'
            : 'Por una ruta recta, ' + nombreA + ' y ' + nombreB + ' se acercan de frente separados por ' + f(d0, 0) +
              ' m, con velocidades constantes de ' + f(vB, 0) + ' m/s y ' + f(vA, 0) + ' m/s respectivamente.') +
          '</p><p>Tomar como origen la posición inicial de ' + (persecucion ? 'la moto (el perseguidor)' : 'el camión') +
          ' y sentido positivo hacia ' + (persecucion ? 'el avance' : 'el avance del camión') + '.</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tiempo transcurre hasta que se encuentran?', t, 's', {
            solucion: [
              FIS.herramientas('los dos móviles (uno por ecuación)', 'la ruta', 'eje x sobre la ruta, origen en la posición inicial del primero',
                persecucion ? 'x₁(t) = ' + f(vB, 0) + '·t (perseguidor) y x₂(t) = ' + f(d0, 0) + ' + ' + f(vA, 0) + '·t (perseguido)'
                  : 'x₁(t) = ' + f(vA, 0) + '·t y x₂(t) = ' + f(d0, 0) + ' − ' + f(vB, 0) + '·t'),
              FIS.paso('Condición de encuentro', 'Se encuentran cuando ocupan la misma posición: ' + eq('x₁(t) = x₂(t)')),
              FIS.paso('Planteo y despeje',
                persecucion
                  ? eq(f(vB, 0) + '·t = ' + f(d0, 0) + ' + ' + f(vA, 0) + '·t ⇒ (' + f(vB, 0) + ' − ' + f(vA, 0) + ')·t = ' + f(d0, 0) + ' ⇒ t = ' + f(t) + ' s')
                  : eq(f(vA, 0) + '·t = ' + f(d0, 0) + ' − ' + f(vB, 0) + '·t ⇒ (' + f(vA, 0) + ' + ' + f(vB, 0) + ')·t = ' + f(d0, 0) + ' ⇒ t = ' + f(t) + ' s'))
            ]
          }),
          FIS.num('b', '¿A qué distancia del origen se produce el encuentro?', x1, 'm', {
            solucion: [FIS.paso('Reemplazo en la ecuación del objeto de estudio que parte del origen',
              eq('x = ' + (persecucion ? f(vB, 0) : f(vA, 0)) + '·' + f(t) + ' = ' + f(x1) + ' m')),
              FIS.paso('Verificación', 'Con la otra ecuación se obtiene el mismo punto: ' + f(x2) + ' m medido desde el origen, ya que en el encuentro ambos ocupan la misma posición.')]
          }),
          FIS.num('c', '¿Qué distancia recorrió ' + (persecucion ? 'el perseguidor' : 'el camión') + ' hasta ese instante?', x1, 'm', {
            solucion: [FIS.paso('Distancia recorrida', eq('d = v · t = ' + f(persecucion ? vB : vA, 0) + ' · ' + f(t) + ' = ' + f(x1) + ' m'))]
          }),
          FIS.num('d', '¿Y ' + (persecucion ? 'el perseguido' : 'el auto') + '?', x2, 'm', {
            solucion: [FIS.paso('Distancia recorrida', eq('d = ' + f(persecucion ? vA : vB, 0) + ' · ' + f(t) + ' = ' + f(x2) + ' m'))]
          }),
          FIS.vf('e', '¿Se encuentran antes de los ' + t2 + ' s?', t < t2, {
            pistas: ['Compará el tiempo de encuentro con ' + t2 + ' s.'],
            solucion: [FIS.paso('Comparación', 'El tiempo de encuentro es t = ' + f(t) + ' s, ' + (t < t2 ? 'menor' : 'mayor') + ' que ' + t2 + ' s ⇒ la afirmación es ' + (t < t2 ? '<b>verdadera</b>' : '<b>falsa</b>') + '.')]
          })
        ],
        datos: { persecucion: persecucion, d0: d0, vA: vA, vB: vB }
      };
    }
  });

  /* =======================================================================
     H6 · Encuentro MRUV – MRUV (alcance con aceleraciones distintas)
     ======================================================================= */
  R({
    id: 'H6_encuentro_mruv_mruv',
    unidad: '2.1', cat: 'horizontal', tema: 'Encuentros y persecuciones',
    nombre: 'Alcance entre dos móviles uniformemente variados',
    dif: 3,
    desc: 'Dos móviles con aceleraciones distintas sobre el mismo eje: instante, posición y velocidades en el encuentro.',
    gen: function (r, g) {
      var d0 = r.int(4, 20) * 10;
      var aA = r.pick([0.5, 1, 1.2, 1.5, 2]);          // el que va adelante
      var aB = FIS.round(aA + r.pick([0.4, 0.5, 0.8, 1, 1.5]), 2); // el perseguidor
      var vA = r.pick([0, 0, 0, 5, 8, 10]);
      var vB = r.pick([0, 0, 0, 2, 6]);
      var nombreA = r.pick(['una camioneta', 'un auto antiguo', 'un colectivo']);
      var nombreB = r.pick(['un automóvil deportivo', 'un auto nuevo', 'una moto']);
      // d0 + vA t + 0.5 aA t² = vB t + 0.5 aB t²
      var A = 0.5 * (aA - aB), Bq = (vA - vB), C = d0;
      var t = FIS.raizPositiva(A, Bq, C);
      var xEnc = vB * t + 0.5 * aB * t * t;
      var vAe = vA + aA * t, vBe = vB + aB * t;
      var dRecA = xEnc - d0, dRecB = xEnc;
      return {
        titulo: 'Encuentro entre dos móviles con aceleración constante',
        enunciado:
          '<p>En una ruta recta, ' + nombreA + ' se encuentra ' + f(d0, 0) + ' m adelante de ' + nombreB +
          '. En t = 0 s, cuando se ponen en marcha, ' + nombreA + ' lleva una velocidad de ' + f(vA, 0) + ' m/s y acelera a razón de ' +
          f(aA) + ' m/s², mientras que ' + nombreB + ' lleva ' + f(vB, 0) + ' m/s y acelera a ' + f(aB) + ' m/s². ' +
          'Ambos se mueven en el mismo sentido y las aceleraciones son constantes.</p>' +
          '<p>Tomar el origen en la posición inicial de ' + nombreB + '.</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tiempo tarda ' + nombreB + ' en alcanzar a ' + nombreA + '?', t, 's', {
            solucion: [
              FIS.herramientas('los dos móviles', 'la ruta', 'eje x en el sentido del movimiento, origen en la posición inicial del que persigue',
                'x_A(t) = ' + f(d0, 0) + ' + ' + f(vA, 0) + '·t + 0.5·' + f(aA) + '·t²   y   x_B(t) = ' + f(vB, 0) + '·t + 0.5·' + f(aB) + '·t²'),
              FIS.paso('Igualamos posiciones', eq(f(d0, 0) + ' + ' + f(vA, 0) + '·t + ' + f(aA / 2) + '·t² = ' + f(vB, 0) + '·t + ' + f(aB / 2) + '·t²')),
              FIS.paso('Queda una cuadrática', eq(f(FIS.round(A, 3)) + '·t² + (' + f(Bq, 0) + ')·t + ' + f(d0, 0) + ' = 0')),
              FIS.paso('Raíz válida', eq('t = ' + f(t) + ' s') + ' (se descarta la raíz negativa, que no tiene significado físico).')
            ]
          }),
          FIS.num('b', '¿En qué posición se produce el encuentro (medida desde el origen)?', xEnc, 'm', {
            solucion: [FIS.paso('Reemplazo del tiempo en la ecuación del perseguidor',
              eq('x = ' + f(vB, 0) + '·' + f(t) + ' + 0.5·' + f(aB) + '·' + f(t) + '² = ' + f(xEnc) + ' m')),
              FIS.paso('Verificación con el otro móvil', eq('x = ' + f(d0, 0) + ' + ' + f(vA, 0) + '·' + f(t) + ' + 0.5·' + f(aA) + '·' + f(t) + '² = ' + f(d0 + vA * t + 0.5 * aA * t * t) + ' m'))]
          }),
          FIS.num('c', 'Velocidad del perseguidor en el momento del encuentro.', vBe, 'm/s', {
            solucion: [FIS.paso('Ecuación horaria de velocidad', eq('v_B = ' + f(vB, 0) + ' + ' + f(aB) + '·' + f(t) + ' = ' + f(vBe) + ' m/s'))]
          }),
          FIS.num('d', 'Velocidad del móvil alcanzado en ese instante.', vAe, 'm/s', {
            solucion: [FIS.paso('Ecuación horaria de velocidad', eq('v_A = ' + f(vA, 0) + ' + ' + f(aA) + '·' + f(t) + ' = ' + f(vAe) + ' m/s'))]
          }),
          FIS.vf('e', 'En el instante del encuentro, el perseguidor va más rápido que el móvil alcanzado.', vBe > vAe + 1e-9, {
            solucion: [FIS.paso('Comparación', f(vBe) + ' m/s vs ' + f(vAe) + ' m/s ⇒ la afirmación es ' + (vBe > vAe ? '<b>verdadera</b>' : '<b>falsa</b>') +
              '. Es lo esperable: para alcanzar a un móvil que va adelante hay que acercarse, y tras el cruce el perseguidor se aleja.')]
          })
        ],
        datos: { d0: d0, aA: aA, aB: aB, vA: vA, vB: vB }
      };
    }
  });

  /* =======================================================================
     H7 · El auto que arranca cuando pasa el camión (MRU vs MRUV)
     ======================================================================= */
  R({
    id: 'H7_arranque_tras_camion',
    unidad: '2.1', cat: 'horizontal', tema: 'Encuentros y persecuciones',
    nombre: 'Un móvil que arranca desde el reposo y alcanza a otro con velocidad constante',
    dif: 2,
    desc: 'MRU contra MRUV: un vehículo detenido arranca y persigue a otro que pasa con velocidad constante (con retardo).',
    gen: function (r, g) {
      var vC = r.int(6, 18);                 // camión en MRU
      var a = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      var retardo = r.pick([0, 0, 1, 2, 3, 4]);
      var vA = r.pick(['un auto', 'una moto', 'un ciclista']);
      var nombreB = r.pick(['un camión', 'una camioneta', 'un colectivo']);
      // 0.5 a t² = vC (t + retardo)  ⇒  0.5 a t² − vC t − vC·retardo = 0
      var t = FIS.raizPositiva(0.5 * a, -vC, -vC * retardo);
      var dist = 0.5 * a * t * t;
      var vAlc = a * t;
      return {
        titulo: 'Arranque y alcance',
        enunciado:
          '<p>En el instante en que ' + nombreB + ' pasa por la parada a ' + f(vC, 0) + ' m/s (velocidad constante), ' +
          vA + ' se pone en marcha desde el reposo en la parada con una aceleración constante de ' + f(a) + ' m/s², en el mismo sentido.</p>' +
          (retardo > 0 ? '<p>Suponer ahora que ' + vA + ' arranca ' + retardo + ' s <b>después</b> de que ' + nombreB + ' pasó por la parada.</p>' : '') +
          '<p>Tomar el origen en la parada y sentido positivo hacia el avance de ' + nombreB + '.</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tiempo tarda ' + vA + ' en alcanzar a ' + nombreB + ' desde que arranca?', t, 's', {
            solucion: [
              FIS.herramientas('los dos móviles', 'la ruta', 'eje x desde la parada, sentido positivo hacia el avance',
                retardo > 0 ? 'x₁(t) = 0.5·' + f(a) + '·t² (arranca retardado) y x₂(t) = ' + f(vC, 0) + '·(t + ' + retardo + ')' : 'x₁(t) = 0.5·' + f(a) + '·t² y x₂(t) = ' + f(vC, 0) + '·t'),
              FIS.paso('Condición de encuentro', eq('0.5·a·t² = ' + f(vC, 0) + '·(t' + (retardo > 0 ? ' + ' + retardo : '') + ')')),
              FIS.paso('Cuadrática', eq(f(a / 2) + '·t² − ' + f(vC, 0) + '·t − ' + f(vC * retardo, 0) + ' = 0 ⇒ t = ' + f(t) + ' s'))
            ]
          }),
          FIS.num('b', '¿A qué distancia de la parada lo alcanza?', dist, 'm', {
            solucion: [FIS.paso('Posición del perseguidor', eq('x = 0.5·' + f(a) + '·(' + f(t) + ')² = ' + f(dist) + ' m')),
              FIS.paso('Verificación', 'El otro móvil recorrió ' + f(vC * (t + retardo)) + ' m desde la parada en el mismo tiempo total.')]
          }),
          FIS.num('c', '¿Con qué velocidad va ' + vA + ' en el momento del encuentro?', vAlc, 'm/s', {
            solucion: [FIS.paso('Velocidad del perseguidor', eq('v = a·t = ' + f(a) + '·' + f(t) + ' = ' + f(vAlc) + ' m/s'))]
          })
        ],
        datos: { vC: vC, a: a, retardo: retardo }
      };
    }
  });

  /* =======================================================================
     H8 · Móvil que frena, se detiene y vuelve a pasar por A
     ======================================================================= */
  R({
    id: 'H8_frena_y_vuelve',
    unidad: '2.1', cat: 'horizontal', tema: 'Cambio de sentido y ecuación complementaria',
    nombre: 'Movimiento con cambio de sentido: rapidez nula, regreso e instantes en una posición',
    dif: 3,
    desc: 'El móvil pasa por A con cierta velocidad y aceleración contraria: tiempo hasta detenerse, distancia, regreso e instantes en una posición.',
    gen: function (r, g) {
      var v0 = r.int(6, 20);
      var a = r.pick([1, 1.5, 2, 2.5, 4]);
      var tDet = v0 / a;
      var dMax = (v0 * v0) / (2 * a);
      var tRegreso = 2 * v0 / a;
      var t1 = Math.max(1, Math.floor(tDet / 2));
      var t2 = 2 * tDet - t1;
      var d = v0 * t1 - 0.5 * a * t1 * t1;
      var lejos = Math.round(dMax + r.pick([5, 10, 15, 20]));
      return {
        titulo: 'Cambio de sentido de un móvil',
        enunciado:
          '<p>Un móvil pasa por el punto A desplazándose hacia la derecha con una rapidez de ' + f(v0, 0) +
          ' m/s, pero su aceleración es constante, de módulo ' + f(a) + ' m/s² y dirigida hacia la izquierda ' +
          '(sentido contrario al movimiento).</p>' +
          '<p>Se adopta un eje x con origen en A y semieje positivo hacia la derecha.</p>',
        incisos: [
          FIS.num('a', '¿Después de cuánto tiempo su rapidez es nula?', tDet, 's', {
            solucion: [
              FIS.paso('Ecuaciones horarias', 'Con el origen en A y sentido positivo hacia la derecha: ' +
                eq('x(t) = ' + f(v0, 0) + '·t − 0.5·' + f(a) + '·t²') + ' y ' + eq('vₓ(t) = ' + f(v0, 0) + ' − ' + f(a) + '·t')),
              FIS.paso('Rapidez nula', eq('0 = ' + f(v0, 0) + ' − ' + f(a) + '·t ⇒ t = ' + f(tDet) + ' s'))
            ]
          }),
          FIS.num('b', 'Cuando vₓ = 0, ¿a qué distancia de A se encuentra?', dMax, 'm', {
            solucion: [FIS.paso('Ecuación complementaria', eq('d = v₀²/(2·a) = ' + f(v0, 0) + '²/(2·' + f(a) + ') = ' + f(dMax) + ' m')),
              FIS.paso('Con la ecuación horaria', eq('x(' + f(tDet) + ') = ' + f(v0, 0) + '·' + f(tDet) + ' − 0.5·' + f(a) + '·' + f(tDet) + '² = ' + f(dMax) + ' m'))]
          }),
          FIS.num('c', '¿Después de cuánto tiempo vuelve a pasar por el punto A?', tRegreso, 's', {
            solucion: [FIS.paso('Condición x = 0', eq('0 = ' + f(v0, 0) + '·t − 0.5·' + f(a) + '·t² = t·(' + f(v0, 0) + ' − ' + f(a / 2) + '·t)')),
              FIS.paso('Soluciones', 't = 0 s (el instante de paso por A) o ' + eq('t = 2·v₀/a = ' + f(tRegreso) + ' s') + ', que es el regreso.')]
          }),
          FIS.num('d', '¿En qué instante (el primero) se encuentra a ' + f(d) + ' m a la derecha de A?', t1, 's', {
            solucion: [FIS.paso('Planteo', eq(f(d) + ' = ' + f(v0, 0) + '·t − ' + f(a / 2) + '·t²') + ' ⇒ ' + eq(f(a / 2) + '·t² − ' + f(v0, 0) + '·t + ' + f(d) + ' = 0')),
              FIS.paso('Raíces', eq('t = ' + f(t1) + ' s') + ' y ' + eq('t = ' + f(t2) + ' s') + ' (pasa dos veces por esa posición: subiendo-avanzando y volviendo).')]
          }),
          FIS.num('e', '¿Y en qué instante (el segundo) pasa por esa misma posición?', t2, 's', {
            solucion: [FIS.paso('Simetría de la parábola', 'Los dos instantes son simétricos respecto del vértice t = ' + f(tDet) + ' s: ' +
              eq('t₂ = 2·t' + Math.round(tDet * 100) / 100 + ' − ' + f(t1) + ' = ' + f(t2) + ' s'))]
          }),
          FIS.num('f', '¿La distancia máxima a la que se aleja de A (hacia la derecha) es mayor que ' + f(lejos) + ' m? Responder 1 si es Sí y 0 si es No.', dMax > lejos ? 1 : 0, '', {
            pistas: ['Compará la distancia máxima ' + f(dMax) + ' m con ' + f(lejos) + ' m.'],
            solucion: [FIS.paso('Comparación', 'El alejamiento máximo es ' + f(dMax) + ' m, ' + (dMax > lejos ? 'mayor' : 'menor') +
              ' que ' + f(lejos) + ' m. Antes de detenerse nunca supera esa distancia, porque después invierte el sentido y regresa.')]
          })
        ],
        datos: { v0: v0, a: a, t1: t1, t2: t2, lejos: lejos }
      };
    }
  });

  /* =======================================================================
     H9 · Gráfico v = f(t) por tramos (áreas y aceleraciones)
     ======================================================================= */
  R({
    id: 'H9_grafico_vt_tramos',
    unidad: '2.1', cat: 'horizontal', tema: 'Interpretación de gráficos',
    nombre: 'Gráfico v = f(t) por tramos: desplazamiento, distancia y aceleraciones',
    dif: 2,
    desc: 'Interpreta un gráfico v-t poligonal: áreas (desplazamiento y distancia), aceleración por tramo y cambio de sentido.',
    gen: function (r, g) {
      var t1 = r.int(2, 3), t2 = t1 + r.int(2, 3), t3 = t2 + r.int(2, 3), t4 = t3 + r.int(2, 4);
      var v1 = r.int(4, 10) * 2;
      var v4 = r.int(3, 8) * 2;                   // rapidez negativa final
      var tramos = [
        { t0: 0, t1: t1, v0: 0, v1: v1 },
        { t0: t1, t1: t2, v0: v1, v1: v1 },
        { t0: t2, t1: t3, v0: v1, v1: 0 },
        { t0: t3, t1: t4, v0: 0, v1: -v4 }
      ];
      var A1 = 0.5 * v1 * t1, A2 = v1 * (t2 - t1), A3 = 0.5 * v1 * (t3 - t2), A4 = -0.5 * v4 * (t4 - t3);
      var desplaz = A1 + A2 + A3 + A4;
      var distancia = A1 + A2 + A3 + Math.abs(A4);
      var a4 = -v4 / (t4 - t3);
      var grafico = FIS.svgPlot({
        series: [{ pts: FIS.puntosDeTramos(tramos), color: 'var(--acento)', label: 'vₓ(t) (m/s)' }],
        xLabel: 't (s)', yLabel: 'vₓ (m/s)', xMin: 0, xMax: t4,
        titulo: 'v = f(t)', marcarPuntos: [[t3, 0, 'v = 0']]
      });
      return {
        titulo: 'Gráfico de velocidad en función del tiempo',
        enunciado:
          '<p>El gráfico representa la componente <i>x</i> de la velocidad de un móvil que se desplaza sobre una trayectoria rectilínea, ' +
          'coincidente con el eje x. El móvil pasa por el origen de coordenadas en t = 0 s.</p>' +
          '<p>Los tramos son rectos: de 0 a ' + t1 + ' s la velocidad crece uniformemente de 0 a ' + f(v1, 0) + ' m/s; de ' + t1 + ' a ' + t2 +
          ' s se mantiene constante; de ' + t2 + ' a ' + t3 + ' s vuelve a cero; y de ' + t3 + ' a ' + t4 + ' s se hace negativa, con valor −' + f(v4, 0) + ' m/s al final.</p>',
        grafico: grafico,
        incisos: [
          FIS.num('a', 'Calcular la componente x del desplazamiento en todo el intervalo [0 ; ' + t4 + '] s.', desplaz, 'm', {
            solucion: [
              FIS.paso('El área bajo v(t) es el desplazamiento', 'Se calcula el área con signo de cada tramo:'),
              FIS.paso('Tramo 1 (triángulo)', eq('A₁ = 0.5·' + t1 + '·' + f(v1, 0) + ' = ' + f(A1) + ' m')),
              FIS.paso('Tramo 2 (rectángulo)', eq('A₂ = ' + f(v1, 0) + '·(' + t2 + ' − ' + t1 + ') = ' + f(A2) + ' m')),
              FIS.paso('Tramo 3 (triángulo)', eq('A₃ = 0.5·' + f(v1, 0) + '·(' + t3 + ' − ' + t2 + ') = ' + f(A3) + ' m')),
              FIS.paso('Tramo 4 (área negativa)', eq('A₄ = 0.5·(−' + f(v4, 0) + ')·(' + t4 + ' − ' + t3 + ') = ' + f(A4) + ' m')),
              FIS.paso('Desplazamiento total', eq('∆x = ' + f(A1) + ' + ' + f(A2) + ' + ' + f(A3) + ' + (' + f(A4) + ') = ' + f(desplaz) + ' m'))
            ]
          }),
          FIS.num('b', 'Calcular la distancia total recorrida.', distancia, 'm', {
            solucion: [FIS.paso('Distancia = suma de áreas en valor absoluto',
              eq('d = ' + f(A1) + ' + ' + f(A2) + ' + ' + f(A3) + ' + |' + f(A4) + '| = ' + f(distancia) + ' m')),
              FIS.paso('¿Por qué difieren?', 'En el último tramo la velocidad es negativa: el móvil retrocede, así que ese tramo suma trayectoria pero resta desplazamiento.')]
          }),
          FIS.num('c', '¿Cuál es la aceleración en el último tramo?', a4, 'm/s²', {
            solucion: [FIS.paso('Pendiente del gráfico v(t)', eq('aₓ = ∆v/∆t = ' + f(-v4, 0) + '/( ' + (t4 - t3) + ') = ' + f(a4) + ' m/s²') + ' (la pendiente es también negativa).')]
          }),
          FIS.num('d', '¿En qué instante el móvil invierte el sentido de su movimiento?', t3, 's', {
            solucion: [FIS.paso('Rapidez nula con cambio de signo', 'La velocidad se hace cero en t = ' + t3 + ' s y pasa de positiva a negativa: allí invierte el sentido.')]
          }),
          FIS.vf('e', 'En el último tramo el movimiento es acelerado (aumenta la rapidez).', true, {
            pistas: ['Compará los signos de v y de a en ese tramo.'],
            solucion: [FIS.paso('Justificación', 'En el último tramo v < 0 y a = ' + f(a4) + ' m/s² también es negativa: ambos vectores tienen el mismo sentido, por lo tanto la rapidez aumenta. La afirmación es <b>verdadera</b>.')]
          })
        ],
        datos: { tramos: tramos, t3: t3, t4: t4, v1: v1, v4: v4 }
      };
    }
  });

  /* =======================================================================
     H10 · Signos de x, v y a a partir de la gráfica x(t)
     ======================================================================= */
  R({
    id: 'H10_signos_grafico',
    unidad: '2.1', cat: 'horizontal', tema: 'Interpretación de gráficos',
    nombre: 'Lectura de signos y concavidad en la gráfica x(t)',
    dif: 2,
    desc: 'Determina los signos de posición, velocidad y aceleración en t = 0 y el carácter acelerado/desacelerado del movimiento.',
    gen: function (r, g) {
      var x0 = r.pick([-8, -5, -3, 3, 5, 8]);
      var v0 = r.pick([-6, -4, -2, 2, 4, 6]);
      var a = r.pick([-4, -2, -1, 1, 2, 4]);
      function x(t) { return x0 + v0 * t + 0.5 * a * t * t; }
      var tMin = 0, tMax = 4;
      var pts = [];
      for (var t = tMin; t <= tMax + 1e-9; t += 0.1) pts.push([FIS.round(t, 2), x(t)]);
      var grafico = FIS.svgPlot({
        series: [{ pts: pts, color: 'var(--acento)', label: 'x(t)' }],
        xLabel: 't (s)', yLabel: 'x (m)', xMin: 0, xMax: tMax, titulo: 'x = f(t)'
      });
      var signo = function (v) { return v > 0 ? 'Positiva' : v < 0 ? 'Negativa' : 'Nula'; };
      var acelerado = (v0 * a) > 0;
      return {
        titulo: 'Signos y concavidad en la gráfica x(t)',
        enunciado:
          '<p>La gráfica representa la posición de un móvil que sigue una trayectoria rectilínea. Sin hacer cálculos, ' +
          'analizar el movimiento indicando los signos de la posición, la velocidad y la aceleración en t = 0, ' +
          'tal como se pide en la Unidad 2.1.</p>' +
          '<p>Los valores numéricos son: x₀ = ' + f(x0, 0) + ' m, v₀ₓ = ' + f(v0, 0) + ' m/s y aₓ = ' + f(a, 0) + ' m/s².</p>',
        grafico: grafico,
        incisos: [
          FIS.op('a', '¿Cuál es el signo de la posición inicial x(0)?', ['Positiva', 'Negativa', 'Nula'], x0 > 0 ? 0 : x0 < 0 ? 1 : 2, {
            solucion: [FIS.paso('Lectura de la ordenada al origen', 'En t = 0 la gráfica corta al eje vertical en x = ' + f(x0, 0) + ' m ⇒ ' + signo(x0).toLowerCase() + '.')]
          }),
          FIS.op('b', '¿Cuál es el signo de la velocidad en t = 0?', ['Positiva', 'Negativa', 'Nula'], v0 > 0 ? 0 : v0 < 0 ? 1 : 2, {
            pistas: ['La velocidad es la pendiente de la recta tangente a x(t).'],
            solucion: [FIS.paso('Pendiente en t = 0', 'La recta tangente en t = 0 es ' + (v0 > 0 ? 'creciente' : 'decreciente') +
              ' ⇒ v₀ₓ = ' + f(v0, 0) + ' m/s es ' + signo(v0).toLowerCase() + '.')]
          }),
          FIS.op('c', '¿Cuál es el signo de la aceleración?', ['Positiva', 'Negativa', 'Nula'], a > 0 ? 0 : a < 0 ? 1 : 2, {
            pistas: ['La concavidad de x(t) indica el sentido de la aceleración.'],
            solucion: [FIS.paso('Concavidad', 'La parábola abre hacia ' + (a > 0 ? 'arriba (∪)' : 'abajo (∩)') + ' ⇒ aₓ = ' + f(a, 0) + ' m/s² es ' + signo(a).toLowerCase() + '.')]
          }),
          FIS.op('d', 'En t = 0, el movimiento es…', ['Acelerado (aumenta la rapidez)', 'Desacelerado (disminuye la rapidez)'],
            acelerado ? 0 : 1, {
              solucion: [FIS.paso('Comparación de signos', 'v₀ₓ = ' + f(v0, 0) + ' m/s y aₓ = ' + f(a, 0) + ' m/s² tienen ' +
                (acelerado ? 'el mismo signo ⇒ la rapidez aumenta (movimiento acelerado).' : 'signos opuestos ⇒ la rapidez disminuye (movimiento desacelerado).'))]
            })
        ],
        datos: { x0: x0, v0: v0, a: a }
      };
    }
  });

})(typeof globalThis !== 'undefined' ? globalThis : this);
