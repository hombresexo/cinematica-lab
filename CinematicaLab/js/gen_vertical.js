/* =========================================================================
   Generadores — Movimientos verticales: caída libre y tiro vertical (U2.2)
   ========================================================================= */
(function (root) {
  'use strict';
  var FIS = root.FIS, R = FIS.registrar;
  var f = FIS.fmt, eq = FIS.eq;

  /* =======================================================================
     V1 · Caída libre desde una altura (básico)
     ======================================================================= */
  R({
    id: 'V1_caida_libre_basica',
    unidad: '2.2', cat: 'vertical', tema: 'Caída libre',
    nombre: 'Caída libre: tiempo, rapidez y altura en un instante',
    dif: 1,
    desc: 'Se suelta un cuerpo desde una altura conocida: tiempo de caída, rapidez de llegada y valores intermedios.',
    gen: function (r, g) {
      var H = r.pick([20, 45, 50, 80, 125, 180]);
      var objeto = r.pick(['una piedra', 'una maceta', 'un libro', 'una pelota de tenis']);
      var tF = Math.sqrt(2 * H / g);
      var vF = Math.sqrt(2 * g * H);
      var t1 = FIS.round(tF / 2, 2);
      var h1 = H - 0.5 * g * t1 * t1;
      var v1 = g * t1;
      return {
        titulo: 'Caída libre desde una altura',
        enunciado:
          '<p>' + objeto.charAt(0).toUpperCase() + objeto.slice(1) + ' cae libremente partiendo del reposo desde una altura de ' +
          f(H, 0) + ' m respecto del piso. Se desprecia el rozamiento con el aire y se adopta g = ' + f(g) + ' m/s², ' +
          'con un eje vertical y positivo hacia arriba cuyo origen está en el piso.</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tarda en llegar al piso?', tF, 's', {
            solucion: [
              FIS.herramientas('el cuerpo que cae', 'el piso', 'eje y vertical, origen en el piso, sentido positivo hacia arriba (por lo tanto aᵧ = −g)',
                'y₀ = ' + f(H, 0) + ' m, v₀ᵧ = 0 m/s (caída libre), aᵧ = −' + f(g) + ' m/s²'),
              FIS.paso('Ecuación horaria de posición', eq('y(t) = y₀ + v₀ᵧ·t − 0.5·g·t²')),
              FIS.paso('Condición: llega al piso (y = 0)', eq('0 = ' + f(H, 0) + ' − 0.5·' + f(g) + '·t² ⇒ t = √(2·' + f(H, 0) + '/' + f(g) + ') = ' + f(tF) + ' s'))
            ]
          }),
          FIS.num('b', '¿Con qué rapidez llega al piso?', vF, 'm/s', {
            solucion: [
              FIS.paso('Velocidad', eq('vᵧ(t) = −g·t ⇒ |v| = ' + f(g) + '·' + f(tF) + ' = ' + f(vF) + ' m/s')),
              FIS.paso('O con la ecuación complementaria', eq('|v| = √(2·g·y₀) = √(2·' + f(g) + '·' + f(H, 0) + ') = ' + f(vF) + ' m/s'))
            ]
          }),
          FIS.num('c', '¿A qué altura sobre el piso se encuentra a los ' + f(t1) + ' s de partir?', h1, 'm', {
            solucion: [FIS.paso('Reemplazo en la ecuación de posición',
              eq('y(' + f(t1) + ') = ' + f(H, 0) + ' − 0.5·' + f(g) + '·(' + f(t1) + ')² = ' + f(h1) + ' m'))]
          }),
          FIS.num('d', '¿Cuál es su rapidez en ese instante?', v1, 'm/s', {
            solucion: [FIS.paso('Velocidad', eq('|v| = g·t = ' + f(g) + '·' + f(t1) + ' = ' + f(v1) + ' m/s')),
              FIS.paso('Observación', 'La rapidez crece linealmente con el tiempo mientras la aceleración se mantiene constante.')]
          })
        ],
        datos: { H: H, t1: t1 }
      };
    }
  });

  /* =======================================================================
     V2 · Últimos metros de una caída libre
     ======================================================================= */
  R({
    id: 'V2_caida_ultimos_metros',
    unidad: '2.2', cat: 'vertical', tema: 'Caída libre',
    nombre: 'Caída libre: último segundo y últimos metros',
    dif: 2,
    desc: 'Distancia recorrida en el último segundo de caída y tiempo empleado en recorrer los últimos metros.',
    gen: function (r, g) {
      var H = r.pick([45, 80, 125, 180, 245]);
      var dUlt = r.pick([20, 25, 30]);
      if (dUlt >= H - 10) dUlt = 10;
      var tF = Math.sqrt(2 * H / g);
      var distUltimoSegundo = 0.5 * g * (2 * tF - 1);
      var tResto = Math.sqrt(2 * (H - dUlt) / g);
      var tUltimos = tF - tResto;
      return {
        titulo: 'Caída libre: tramos finales',
        enunciado:
          '<p>Un cuerpo cae libremente desde el reposo desde una altura de ' + f(H, 0) + ' m. Usar g = ' + f(g) + ' m/s².</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tarda en llegar al piso?', tF, 's', {
            solucion: [FIS.paso('Ecuación horaria', eq('0 = ' + f(H, 0) + ' − 0.5·g·t² ⇒ t = ' + f(tF) + ' s'))]
          }),
          FIS.num('b', '¿Qué distancia recorre durante el último segundo de caída?', distUltimoSegundo, 'm', {
            pistas: ['Calculá la posición 1 s antes de llegar al piso y restala de la altura inicial.'],
            solucion: [
              FIS.paso('Posición 1 s antes de llegar', eq('y(t − 1) = 0.5·g·(t − 1)² = 0.5·' + f(g) + '·(' + f(tF - 1) + ')² = ' + f(0.5 * g * (tF - 1) * (tF - 1)) + ' m sobre el piso')),
              FIS.paso('Distancia del último segundo', eq('∆y = ' + f(0.5 * g * (tF - 1) * (tF - 1)) + ' m − 0 m = ' + f(distUltimoSegundo) + ' m')),
              FIS.paso('Interpretación', 'Cae mucho más en el último segundo que en el primero (donde recorre 0.5·g·1² = ' + f(0.5 * g) + ' m): la rapidez va aumentando.')
            ]
          }),
          FIS.num('c', '¿Cuánto tarda en recorrer los últimos ' + f(dUlt, 0) + ' m?', tUltimos, 's', {
            solucion: [
              FIS.paso('Tiempo hasta la altura ' + f(dUlt, 0) + ' m', eq('t₁ = √(2·(' + f(H, 0) + ' − ' + f(dUlt, 0) + ')/g) = ' + f(tResto) + ' s')),
              FIS.paso('Tiempo del tramo final', eq('∆t = ' + f(tF) + ' s − ' + f(tResto) + ' s = ' + f(tUltimos) + ' s'))
            ]
          })
        ],
        datos: { H: H, dUlt: dUlt }
      };
    }
  });

  /* =======================================================================
     V3 · Tiro vertical hacia arriba desde el piso (básico)
     ======================================================================= */
  R({
    id: 'V3_tiro_vertical_basico',
    unidad: '2.2', cat: 'vertical', tema: 'Tiro vertical',
    nombre: 'Tiro vertical: altura máxima, tiempos y vuelo completo',
    dif: 1,
    desc: 'Proyectil lanzado verticalmente hacia arriba: altura máxima, tiempo de subida, vuelo total y velocidad de regreso.',
    gen: function (r, g) {
      var v0 = r.pick([15, 20, 25, 30, 40, 45]);
      var hMax = (v0 * v0) / (2 * g);
      var tSub = v0 / g;
      var tTotal = 2 * tSub;
      var t1 = FIS.round(tSub / 2, 2);
      var y1 = v0 * t1 - 0.5 * g * t1 * t1;
      return {
        titulo: 'Tiro vertical hacia arriba',
        enunciado:
          '<p>Un proyectil se lanza verticalmente hacia arriba desde el piso con una rapidez inicial de ' + f(v0, 0) +
          ' m/s. Usar g = ' + f(g) + ' m/s² y un eje vertical positivo hacia arriba con origen en el piso.</p>',
        incisos: [
          FIS.num('a', 'Calcular la altura máxima que alcanza.', hMax, 'm', {
            solucion: [
              FIS.herramientas('el proyectil', 'el piso', 'eje y positivo hacia arriba, origen en el piso',
                'y₀ = 0 m, v₀ᵧ = +' + f(v0, 0) + ' m/s, aᵧ = −' + f(g) + ' m/s²'),
              FIS.paso('En la altura máxima la velocidad se anula', eq('0 = v₀ᵧ² − 2·g·h ⇒ h = v₀² · 0.5 ÷ g = ' + f(v0, 0) + '²/(2·' + f(g) + ') = ' + f(hMax) + ' m'))
            ]
          }),
          FIS.num('b', '¿Cuánto tiempo tarda en alcanzarla?', tSub, 's', {
            solucion: [FIS.paso('Velocidad', eq('0 = ' + f(v0, 0) + ' − ' + f(g) + '·t ⇒ t = ' + f(tSub) + ' s')),
              FIS.paso('Nota', 'Ese mismo tiempo emplea en volver, por la simetría del movimiento: el ascenso y el descenso son idénticos pero con los sentidos invertidos.')]
          }),
          FIS.num('c', '¿Cuál es la altura del proyectil a los ' + f(t1) + ' s de ser lanzado?', y1, 'm', {
            solucion: [FIS.paso('Ecuación horaria de posición', eq('y(' + f(t1) + ') = ' + f(v0, 0) + '·' + f(t1) + ' − 0.5·' + f(g) + '·(' + f(t1) + ')² = ' + f(y1) + ' m'))]
          }),
          FIS.num('d', '¿Cuánto tiempo total permanece en el aire hasta volver al piso?', tTotal, 's', {
            solucion: [FIS.paso('Condición y = 0', eq('0 = ' + f(v0, 0) + '·t − 0.5·' + f(g) + '·t² = t·(' + f(v0, 0) + ' − ' + f(g / 2) + '·t) ⇒ t = ' + f(tTotal) + ' s')),
              FIS.paso('Interpretación', 'Dos soluciones: t = 0 s (lanzamiento) y t = ' + f(tTotal) + ' s (regreso al piso). El tiempo de vuelo es el doble del de subida.')]
          }),
          FIS.num('e', '¿Cuál es la distancia total recorrida durante todo el vuelo (hasta volver al piso)?', 2 * hMax, 'm', {
            solucion: [FIS.paso('Suma de trayectoria', 'Sube ' + f(hMax) + ' m y baja los mismos ' + f(hMax) + ' m: ' +
              eq('d = 2·h = 2·' + f(hMax) + ' = ' + f(2 * hMax) + ' m') + '. En cambio el desplazamiento total es nulo, porque vuelve a la posición inicial.')]
          }),
          FIS.vf('f', 'La velocidad con la que el proyectil regresa al piso es exactamente igual al vector velocidad inicial.', false, {
            pistas: ['Cuidado: la pregunta habla del <b>vector</b> velocidad, no de la rapidez.'],
            solucion: [FIS.paso('Rapidez vs. velocidad', 'La rapidez de llegada es la misma (' + f(v0, 0) + ' m/s), pero el sentido es opuesto: ' +
              'la velocidad inicial apunta hacia arriba y la final hacia abajo. Por eso la afirmación es <b>falsa</b>: coinciden los módulos, no los vectores.')]
          })
        ],
        datos: { v0: v0, t1: t1 }
      };
    }
  });

  /* =======================================================================
     V4 · Tiro vertical desde una altura (edificio / terraza)
     ======================================================================= */
  R({
    id: 'V4_tiro_vertical_desde_altura',
    unidad: '2.2', cat: 'vertical', tema: 'Tiro vertical',
    nombre: 'Tiro vertical desde una altura: altura máxima, regreso y choque con el piso',
    dif: 2,
    desc: 'Lanzamiento hacia arriba desde un edificio: altura máxima sobre el piso, tiempo de regreso al punto de partida y tiempo/rapidez de llegada al suelo.',
    gen: function (r, g) {
      var H = r.pick([20, 30, 45, 80, 100]);
      var v0 = r.pick([5, 8, 10, 12, 15]);
      var hRel = (v0 * v0) / (2 * g);
      var hMax = H + hRel;
      var tSub = v0 / g;
      var tRegreso = 2 * tSub;
      var tSuelo = (v0 + Math.sqrt(v0 * v0 + 2 * g * H)) / g;
      var vSuelo = Math.sqrt(v0 * v0 + 2 * g * H);
      var distTotal = 2 * hRel + H;
      return {
        titulo: 'Tiro vertical desde la terraza de un edificio',
        enunciado:
          '<p>Desde la terraza de un edificio de ' + f(H, 0) + ' m de altura se lanza una piedra verticalmente hacia arriba ' +
          'con una rapidez inicial de ' + f(v0, 0) + ' m/s. Usar g = ' + f(g) + ' m/s², con eje vertical positivo hacia arriba y origen en el piso.</p>',
        incisos: [
          FIS.num('a', '¿Cuál es la altura máxima alcanzada, medida desde el piso?', hMax, 'm', {
            solucion: [
              FIS.herramientas('la piedra', 'el piso', 'eje y positivo hacia arriba, origen en el piso (la terraza está en y₀ = ' + f(H, 0) + ' m)',
                'y₀ = ' + f(H, 0) + ' m, v₀ᵧ = +' + f(v0, 0) + ' m/s, aᵧ = −' + f(g) + ' m/s²'),
              FIS.paso('Altura por encima del punto de lanzamiento', eq('h = v₀² · 0.5 ÷ g = ' + f(v0, 0) + '²/(2·' + f(g) + ') = ' + f(hRel) + ' m')),
              FIS.paso('Altura sobre el piso', eq('y_máx = ' + f(H, 0) + ' + ' + f(hRel) + ' = ' + f(hMax) + ' m'))
            ]
          }),
          FIS.num('b', '¿Cuánto tiempo tarda en volver a pasar por el punto de lanzamiento?', tRegreso, 's', {
            solucion: [FIS.paso('Condición y = y₀', eq('y(t) − y₀ = v₀·t − 0.5·g·t² = 0 ⇒ t = 2·v₀/g = ' + f(tRegreso) + ' s')),
              FIS.paso('Observación', 'El tiempo de subida (' + f(tSub) + ' s) es igual al de bajada hasta ese punto.')]
          }),
          FIS.num('c', '¿Cuánto tiempo tarda en llegar al piso desde el lanzamiento?', tSuelo, 's', {
            solucion: [
              FIS.paso('Condición y = 0', eq('0 = ' + f(H, 0) + ' + ' + f(v0, 0) + '·t − 0.5·' + f(g) + '·t²')),
              FIS.paso('Ecuación cuadrática', eq(f(g / 2) + '·t² − ' + f(v0, 0) + '·t − ' + f(H, 0) + ' = 0')),
              FIS.paso('Solución válida', eq('t = ' + f(vSuelo * 0 + tSuelo) + ' s') + ' (se descarta la raíz negativa).')
            ]
          }),
          FIS.num('d', '¿Con qué rapidez llega al piso?', vSuelo, 'm/s', {
            solucion: [FIS.paso('Ecuación complementaria', eq('v² = v₀² + 2·g·' + f(H, 0) + ' ⇒ v = √(' + f(v0 * v0 + 2 * g * H) + ') = ' + f(vSuelo) + ' m/s')),
              FIS.paso('Verificación', 'Con la ecuación de velocidad también se obtiene |v| = ' + f(g * tSuelo) + ' m/s. La piedra pasa por la terraza bajando y sigue hasta el piso.')]
          }),
          FIS.num('e', '¿Qué distancia total recorrió la piedra desde el lanzamiento hasta llegar al piso?', distTotal, 'm', {
            solucion: [FIS.paso('Trayectoria con subida y bajada', 'Sube ' + f(hRel) + ' m desde la terraza, vuelve a bajar esos ' + f(hRel) +
              ' m y continúa ' + f(H, 0) + ' m hasta el piso: ' + eq('d = 2·' + f(hRel) + ' + ' + f(H, 0) + ' = ' + f(distTotal) + ' m')),
              FIS.paso('Comparación con el desplazamiento', 'El desplazamiento fue de −' + f(H, 0) + ' m (hacia abajo), muy distinto de la distancia recorrida.')]
          })
        ],
        datos: { H: H, v0: v0 }
      };
    }
  });

  /* =======================================================================
     V5 · Encuentro vertical: una sube y la otra baja
     ======================================================================= */
  R({
    id: 'V5_encuentro_vertical',
    unidad: '2.2', cat: 'vertical', tema: 'Encuentros verticales',
    nombre: 'Cruce de dos piedras (una hacia arriba y otra hacia abajo)',
    dif: 2,
    desc: 'Dos cuerpos lanzados simultáneamente en sentidos opuestos: instante y altura de cruce, y rapideces en ese instante.',
    gen: function (r, g) {
      var v1, v2, H, t, yEnc, intentos = 0;
      do {
        v1 = r.int(4, 20);
        v2 = r.int(0, 20);
        H = r.int(10, 60);
        t = H / (v1 + v2);
        yEnc = v1 * t - 0.5 * g * t * t;
        intentos++;
      } while ((yEnc <= 1 || yEnc >= H - 1) && intentos < 60);
      var vSuelo = g * t - v1;     // rapidez de la primera piedra (bajando si > 0)
      var rap1 = Math.abs(v1 - g * t);
      var rap2 = Math.abs(v2 + g * t);
      return {
        titulo: 'Encuentro de dos cuerpos en el aire',
        enunciado:
          '<p>Juan arroja verticalmente hacia arriba una piedra con una rapidez inicial de ' + f(v1, 0) + ' m/s. ' +
          'Simultáneamente, Pedro, que se encuentra ' + f(H, 0) + ' m más arriba, arroja otra piedra hacia abajo con una rapidez de ' +
          f(v2, 0) + ' m/s. Usar g = ' + f(g) + ' m/s², eje vertical positivo hacia arriba con origen en la posición inicial de Juan.</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tiempo transcurre hasta que las piedras se cruzan?', t, 's', {
            solucion: [
              FIS.herramientas('las dos piedras', 'el punto desde donde lanza Juan', 'eje y positivo hacia arriba, origen en Juan, con Pedro en y₀ = ' + f(H, 0) + ' m',
                'y_J(t) = ' + f(v1, 0) + '·t − 0.5·g·t²   y   y_P(t) = ' + f(H, 0) + ' − ' + f(v2, 0) + '·t − 0.5·g·t²'),
              FIS.paso('Condición de cruce', eq('y_J(t) = y_P(t)')),
              FIS.paso('Los términos −0.5·g·t² se cancelan', eq(f(v1, 0) + '·t = ' + f(H, 0) + ' − ' + f(v2, 0) + '·t ⇒ t = ' + f(H, 0) + '/(' + f(v1, 0) + ' + ' + f(v2, 0) + ') = ' + f(t) + ' s')),
              FIS.paso('Interpretación', 'Al caer las dos con la misma aceleración, la gravedad no influye en el tiempo de encuentro: sólo importan la separación inicial y la velocidad de acercamiento relativa.')
            ]
          }),
          FIS.num('b', '¿A qué altura respecto de Juan se cruzan?', yEnc, 'm', {
            solucion: [FIS.paso('Reemplazo en la ecuación de Juan',
              eq('y = ' + f(v1, 0) + '·' + f(t) + ' − 0.5·' + f(g) + '·(' + f(t) + ')² = ' + f(yEnc) + ' m')),
              FIS.paso('Verificación con la de Pedro', eq('y = ' + f(H, 0) + ' − ' + f(v2, 0) + '·' + f(t) + ' − 0.5·' + f(g) + '·(' + f(t) + ')² = ' + f(H - v2 * t - 0.5 * g * t * t) + ' m'))]
          }),
          FIS.num('c', '¿Cuál es la rapidez de la piedra de Juan en el momento del cruce?', rap1, 'm/s', {
            solucion: [FIS.paso('Velocidad de Juan', eq('v_J = ' + f(v1, 0) + ' − ' + f(g) + '·' + f(t) + ' = ' + f(v1 - g * t) + ' m/s')),
              FIS.paso('Lectura del resultado', (v1 - g * t) < 0 ? 'La componente es negativa: en ese instante su piedra ya está bajando.' : 'La componente es positiva: su piedra todavía está subiendo.')]
          }),
          FIS.num('d', '¿Y la rapidez de la piedra de Pedro?', rap2, 'm/s', {
            solucion: [FIS.paso('Velocidad de Pedro', eq('v_P = −' + f(v2, 0) + ' − ' + f(g) + '·' + f(t) + ' = ' + f(-v2 - g * t) + ' m/s')),
              FIS.paso('Rapidez', 'En módulo: ' + f(rap2) + ' m/s, siempre aumentando porque va cayendo.')]
          })
        ],
        datos: { H: H, v1: v1, v2: v2 }
      };
    }
  });

  /* =======================================================================
     V6 · Objeto que se suelta desde un globo (sube o baja)
     ======================================================================= */
  R({
    id: 'V6_globo_suelta_objeto',
    unidad: '2.2', cat: 'vertical', tema: 'Caída y lanzamiento desde un móvil',
    nombre: 'Objeto que se deja caer desde un globo en movimiento',
    dif: 2,
    desc: 'Al soltarse, el cuerpo conserva la velocidad del globo: altura máxima, tiempo de caída, rapidez de impacto y distancia recorrida.',
    gen: function (r, g) {
      var H = r.pick([200, 300, 400, 500, 1000]);
      var vB = r.pick([5, 8, 10, 12, 15, 20]);
      var sube = r.bool();
      var v0y = sube ? vB : -vB;
      var hMax = sube ? H + (vB * vB) / (2 * g) : H;
      var tSuelo = (-v0y + Math.sqrt(v0y * v0y + 2 * g * H)) / g;
      var vSuelo = Math.sqrt(v0y * v0y + 2 * g * H);
      var distRec = sube ? (2 * (vB * vB) / (2 * g) + H) : H;
      return {
        titulo: 'Cuerpo soltado desde un globo aerostático',
        enunciado:
          '<p>Un globo aerostático se encuentra a ' + f(H, 0) + ' m de altura y se desplaza verticalmente ' +
          (sube ? 'ascendiendo' : 'descendiendo') + ' con una velocidad constante de ' + f(vB, 0) + ' m/s. ' +
          'En ese momento se deja caer un bulto desde el globo. Usar g = ' + f(g) + ' m/s².</p>' +
          '<p class="nota">Al soltarse, el bulto conserva la velocidad que tenía el globo (propiedad de inercia).</p>',
        incisos: [
          FIS.num('a', '¿Qué velocidad inicial tiene el bulto respecto de Tierra al soltarse? (usar signo positivo hacia arriba)', v0y, 'm/s', {
            solucion: [FIS.paso('Continuidad de la velocidad', 'Al soltarse, el cuerpo mantiene por inercia la velocidad del globo: ' +
              eq('v₀ᵧ = ' + f(v0y) + ' m/s') + '.')]
          }),
          FIS.num('b', '¿Cuál es la altura máxima (respecto del piso) que alcanza el bulto' + (sube ? '' : ' (si asciende)') + '?', hMax, 'm', {
            solucion: sube
              ? [FIS.paso('Primero sube mientras se frena', eq('h = v₀ᵧ²/(2g) = ' + f(vB, 0) + '²/(2·' + f(g) + ') = ' + f((vB * vB) / (2 * g)) + ' m arriba del globo')),
                FIS.paso('Altura sobre el piso', eq('y_máx = ' + f(H, 0) + ' + ' + f((vB * vB) / (2 * g)) + ' = ' + f(hMax) + ' m'))]
              : [FIS.paso('No sube', 'Como se suelta mientras el globo desciende, el bulto ya baja desde el inicio: su altura máxima es la del globo, ' + f(H, 0) + ' m.')]
          }),
          FIS.num('c', '¿Cuánto tiempo tarda el bulto en llegar al piso?', tSuelo, 's', {
            solucion: [
              FIS.paso('Ecuaciones horarias del bulto', eq('y(t) = ' + f(H, 0) + ' ' + (v0y >= 0 ? '+' : '−') + ' ' + f(Math.abs(v0y), 0) + '·t − 0.5·' + f(g) + '·t²')),
              FIS.paso('Condición y = 0', eq(f(g / 2) + '·t² ' + (v0y >= 0 ? '− ' + f(v0y, 0) + '·t' : '+ ' + f(Math.abs(v0y), 0) + '·t') + ' − ' + f(H, 0) + ' = 0 ⇒ t = ' + f(tSuelo) + ' s'))
            ]
          }),
          FIS.num('d', '¿Con qué rapidez llega al piso?', vSuelo, 'm/s', {
            solucion: [FIS.paso('Ecuación complementaria desde el punto de suelta',
              eq('v² = v₀ᵧ² + 2·g·' + f(H, 0) + ' ⇒ v = ' + f(vSuelo) + ' m/s')),
              FIS.paso('Observación', 'El globo, en cambio, sigue bajando o subiendo a velocidad constante (' + f(vB, 0) + ' m/s): es un MRU que no se ve afectado por la gravedad.')]
          }),
          FIS.num('e', '¿Qué distancia total recorre el bulto desde que se suelta hasta llegar al piso?', distRec, 'm', {
            solucion: [FIS.paso('Longitud de trayectoria', sube
              ? 'Sube ' + f((vB * vB) / (2 * g)) + ' m, vuelve a pasar por el globo y baja los ' + f(H, 0) + ' m: ' +
                eq('d = 2·' + f((vB * vB) / (2 * g)) + ' + ' + f(H, 0) + ' = ' + f(distRec) + ' m')
              : 'Baja directamente los ' + f(H, 0) + ' m: ' + eq('d = ' + f(H, 0) + ' m'))]
          })
        ],
        datos: { H: H, vB: vB, sube: sube }
      };
    }
  });

  /* =======================================================================
     V7 · Bulto que se cae de un montacargas que asciende
     ======================================================================= */
  R({
    id: 'V7_bulto_montacargas',
    unidad: '2.2', cat: 'vertical', tema: 'Caída y lanzamiento desde un móvil',
    nombre: 'Bulto que cae de un montacargas en movimiento',
    dif: 2,
    desc: 'El bulto que cae de un ascensor en movimiento sube primero: tiempo hasta la altura máxima, altura de caída y distancia recorrida.',
    gen: function (r, g) {
      var v = r.pick([2, 3, 4, 5]);
      var tCaida = r.pick([2, 3, 4]);
      var hSobe = (v * v) / (2 * g);
      var tSubida = v / g;
      var H = 0.5 * g * tCaida * tCaida - v * tCaida;  // 0 = H + v t − 0.5 g t²
      var distTotal = H + 2 * hSobe;
      var t25 = 0.25;
      var y25 = H + v * t25 - 0.5 * g * t25 * t25;
      return {
        titulo: 'Caída de un bulto desde un montacargas',
        enunciado:
          '<p>Un bulto es colocado en un montacargas que asciende con una rapidez constante de ' + f(v, 0) +
          ' m/s. En cierto instante el bulto se cae y tarda ' + f(tCaida, 0) + ' s en llegar al fondo del hueco. ' +
          'Usar g = ' + f(g) + ' m/s², eje vertical positivo hacia arriba y origen en el fondo del hueco.</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tarda el bulto en alcanzar su altura máxima respecto del punto donde se separó del montacargas?', tSubida, 's', {
            solucion: [
              FIS.herramientas('el bulto', 'el fondo del hueco', 'eje y positivo hacia arriba, origen en el fondo del hueco',
                'al separarse el bulto tiene v₀ᵧ = +' + f(v, 0) + ' m/s (la del montacargas) y aᵧ = −' + f(g) + ' m/s²'),
              FIS.paso('Rapidez nula', eq('0 = ' + f(v, 0) + ' − ' + f(g) + '·t ⇒ t = ' + f(tSubida) + ' s')),
              FIS.paso('Altura que sube', eq('h = v₀ᵧ²/(2g) = ' + f(v, 0) + '²/(2·' + f(g) + ') = ' + f(hSobe) + ' m'))
            ]
          }),
          FIS.num('b', '¿A qué altura sobre el fondo del hueco se encontraba el bulto cuando se cayó?', H, 'm', {
            solucion: [FIS.paso('Ecuación horaria y condición conocida',
              eq('0 = H + ' + f(v, 0) + '·' + f(tCaida, 0) + ' − 0.5·' + f(g) + '·' + f(tCaida, 0) + '²')),
              FIS.paso('Despeje', eq('H = 0.5·' + f(g) + '·' + f(tCaida, 0) + '² − ' + f(v, 0) + '·' + f(tCaida, 0) + ' = ' + f(0.5 * g * tCaida * tCaida) + ' − ' + f(v * tCaida) + ' = ' + f(H) + ' m'))]
          }),
          FIS.num('c', '¿En qué posición (respecto del fondo) se encuentra 0,25 s después de empezar a caer?', y25, 'm', {
            solucion: [FIS.paso('Reemplazo en la ecuación horaria',
              eq('y(0,25 s) = ' + f(H) + ' + ' + f(v, 0) + '·0,25 − 0.5·' + f(g) + '·0,25² = ' + f(y25) + ' m')),
              FIS.paso('Interpretación', 'Está ' + f(y25 - H) + ' m por encima del punto de suelta: todavía está ascendiendo respecto del montacargas.')]
          }),
          FIS.num('d', '¿Qué distancia total recorre durante la caída (hasta llegar al fondo)?', distTotal, 'm', {
            solucion: [FIS.paso('Trayectoria con subida y bajada',
              eq('d = ' + f(hSobe) + ' m (sube) + (' + f(hSobe) + ' + ' + f(H) + ') m (baja hasta el fondo) = ' + f(distTotal) + ' m'))]
          })
        ],
        datos: { v: v, tCaida: tCaida }
      };
    }
  });

  /* =======================================================================
     V8 · Globo que asciende y piedra lanzada con la gomera
     ======================================================================= */
  R({
    id: 'V8_globo_y_gomera',
    unidad: '2.2', cat: 'vertical', tema: 'Encuentros verticales',
    nombre: 'Globo ascendente alcanzado por una piedra (dos encuentros)',
    dif: 3,
    desc: 'Persecución vertical en el aire: primer y segundo encuentro entre un globo que sube a velocidad constante y una piedra lanzada desde el piso.',
    gen: function (r, g) {
      var vb, v0, h0, h1 = 1, t1, t2, ok = false, intentos = 0;
      do {
        vb = r.int(8, 15);
        v0 = r.int(25, 35);
        h0 = r.int(12, 30);
        // 0.5g t² + (vb − v0) t + (h0 − h1) = 0
        var disc = (vb - v0) * (vb - v0) - 4 * (0.5 * g) * (h0 - h1);
        if (disc > 0) {
          var raices = FIS.cuadratica(0.5 * g, vb - v0, h0 - h1);
          t1 = raices[0]; t2 = raices[1];
          var tPiso = (v0 + Math.sqrt(v0 * v0 + 2 * g * h1)) / g;
          ok = t1 > 0.05 && t2 > t1 && t2 < tPiso - 0.1;
        }
        intentos++;
      } while (!ok && intentos < 200);
      var y1 = h0 + vb * t1, y2 = h0 + vb * t2;
      var vPiedra1 = v0 - g * t1;
      return {
        titulo: 'La piedra de la gomera y el globo',
        enunciado:
          '<p>Un globo con gas asciende verticalmente con velocidad constante de ' + f(vb, 0) +
          ' m/s. Cuando se encuentra a ' + f(h0, 0) + ' m del piso, un muchacho que está debajo le dispara una piedra con su gomera: ' +
          'la piedra parte verticalmente hacia arriba a ' + f(v0, 0) + ' m/s desde una altura de ' + f(h1) + ' m. ' +
          'Despreciar el rozamiento con el aire y usar g = ' + f(g) + ' m/s².</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tiempo después de partir alcanza la piedra al globo (primer encuentro)?', t1, 's', {
            solucion: [
              FIS.herramientas('la piedra (MRUV) y el globo (MRU)', 'el piso', 'eje y positivo hacia arriba, origen en el piso',
                'y_globo(t) = ' + f(h0, 0) + ' + ' + f(vb, 0) + '·t   y   y_piedra(t) = ' + f(h1) + ' + ' + f(v0, 0) + '·t − 0.5·' + f(g) + '·t²'),
              FIS.paso('Igualamos las posiciones', eq(f(h0, 0) + ' + ' + f(vb, 0) + '·t = ' + f(h1) + ' + ' + f(v0, 0) + '·t − ' + f(g / 2) + '·t²')),
              FIS.paso('Cuadrática', eq(f(g / 2) + '·t² + (' + f(vb - v0) + ')·t + ' + f(h0 - h1, 0) + ' = 0')),
              FIS.paso('Raíces', eq('t₁ = ' + f(t1) + ' s') + ' y ' + eq('t₂ = ' + f(t2) + ' s') + '. El primer encuentro es el menor: t₁.')
            ]
          }),
          FIS.num('b', '¿A qué altura del piso se produce ese primer encuentro?', y1, 'm', {
            solucion: [FIS.paso('Con la ecuación del globo (MRU)',
              eq('y = ' + f(h0, 0) + ' + ' + f(vb, 0) + '·' + f(t1) + ' = ' + f(y1) + ' m'))]
          }),
          FIS.num('c', '¿Cuál es la velocidad de la piedra (respecto de Tierra) en ese instante?', vPiedra1, 'm/s', {
            solucion: [FIS.paso('Velocidad de la piedra', eq('v = ' + f(v0, 0) + ' − ' + f(g) + '·' + f(t1) + ' = ' + f(vPiedra1) + ' m/s')),
              FIS.paso('Interpretación', 'El signo positivo indica que la piedra todavía está subiendo, pero más despacio que al partir (perdió ' + f(g * t1) + ' m/s).')]
          }),
          FIS.num('d', 'Suponiendo que la piedra pasa de costado sin tocarlo, ¿en qué instante se vuelven a encontrar?', t2, 's', {
            solucion: [FIS.paso('La otra raíz de la cuadrática', 'La segunda solución ' + eq('t₂ = ' + f(t2) + ' s') +
              ' corresponde a cuando la piedra, ya bajando, vuelve a la altura del globo (que sigue subiendo).'),
              FIS.paso('¿Por qué hay dos encuentros?', 'Porque el movimiento de la piedra es parabólico: alcanza la altura del globo dos veces, una subiendo y otra bajando.')]
          }),
          FIS.num('e', '¿A qué altura del piso se produce ese segundo encuentro?', y2, 'm', {
            solucion: [FIS.paso('Con la ecuación del globo', eq('y = ' + f(h0, 0) + ' + ' + f(vb, 0) + '·' + f(t2) + ' = ' + f(y2) + ' m'))]
          })
        ],
        datos: { h0: h0, h1: h1, vb: vb, v0: v0 }
      };
    }
  });

  /* =======================================================================
     V9 · Malabarista: dos clavas (una lanzada cuando la otra toca el techo)
     ======================================================================= */
  R({
    id: 'V9_malabarista',
    unidad: '2.2', cat: 'vertical', tema: 'Encuentros verticales',
    nombre: 'Dos clavas que se cruzan (lanzamiento retardado)',
    dif: 2,
    desc: 'Velocidad necesaria para llegar al techo, tiempo de ascenso y cruce entre dos objetos lanzados con retardo.',
    gen: function (r, g) {
      var h = r.pick([1.5, 2, 2.4, 2.8, 3.2, 3.6]);
      var v0 = Math.sqrt(2 * g * h);
      var tTecho = v0 / g;
      var tCruce = 1.5 * tTecho;
      var hCruce = 0.75 * h;
      var tDespues = tCruce - tTecho;
      return {
        titulo: 'Cruce de dos clavas en el aire',
        enunciado:
          '<p>Una malabarista está en una habitación cuyo techo está ' + f(h) + ' m por encima del nivel de sus manos. ' +
          'Arroja una clava verticalmente hacia arriba y logra que llegue justo al techo. Usar g = ' + f(g) + ' m/s², ' +
          'con eje vertical positivo hacia arriba y origen en las manos.</p>' +
          '<p>Luego lanza una segunda clava con la misma velocidad inicial, en el instante exacto en que la primera toca el techo.</p>',
        incisos: [
          FIS.num('a', '¿Con qué rapidez se lanzó la primera clava?', v0, 'm/s', {
            solucion: [
              FIS.paso('Condición: llega al techo con velocidad nula', eq('0 = v₀² − 2·g·h ⇒ v₀ = √(2·' + f(g) + '·' + f(h) + ') = ' + f(v0) + ' m/s'))
            ]
          }),
          FIS.num('b', '¿Cuánto tarda la clava en llegar al techo?', tTecho, 's', {
            solucion: [FIS.paso('Velocidad nula en el techo', eq('0 = v₀ − g·t ⇒ t = ' + f(v0) + '/' + f(g) + ' = ' + f(tTecho) + ' s'))]
          }),
          FIS.num('c', '¿Cuánto tiempo después del lanzamiento de la segunda clava se cruzan las dos?', tDespues, 's', {
            solucion: [
              FIS.paso('Ecuaciones de cada clava',
                'Clava 1 (lanzada en t = 0): ' + eq('y₁(t) = v₀·t − 0.5·g·t²') + '. Clava 2 (lanzada en t = T = ' + f(tTecho) + ' s): ' +
                eq('y₂(t) = v₀·(t − T) − 0.5·g·(t − T)²')),
              FIS.paso('Igualamos', eq('v₀·t − 0.5g·t² = v₀·t − v₀·T − 0.5g·(t − T)²') + ' ⇒ ' + eq('t = 1,5·T = ' + f(tCruce) + ' s')),
              FIS.paso('Resultado pedido', 'Respecto del lanzamiento de la segunda: ' + eq('∆t = ' + f(tCruce) + ' − ' + f(tTecho) + ' = ' + f(tDespues) + ' s'))
            ]
          }),
          FIS.num('d', '¿A qué altura por encima de las manos están las clavas en el momento de cruzarse?', hCruce, 'm', {
            solucion: [FIS.paso('Reemplazo', eq('y = v₀·(1,5T) − 0.5·g·(1,5T)² = ' + f(hCruce) + ' m')),
              FIS.paso('Resultado general', 'El cruce ocurre siempre a ' + eq('y = ¾·h') + ' de las manos, sin importar el valor de g. ¡Es un resultado elegante para recordar!')]
          })
        ],
        datos: { h: h }
      };
    }
  });

  /* =======================================================================
     V10 · Mismo punto, dos instantes distintos (3 s y 7 s)
     ======================================================================= */
  R({
    id: 'V10_dos_tiempos_misma_altura',
    unidad: '2.2', cat: 'vertical', tema: 'Tiro vertical',
    nombre: 'Cuerpo que pasa por la misma altura en dos instantes',
    dif: 3,
    desc: 'Conociendo dos instantes en que el cuerpo pasa por la misma altura, hallar la velocidad en el punto de paso, esa altura y la altura máxima.',
    gen: function (r, g) {
      var par = r.pick([[1, 5], [2, 6], [3, 7], [2, 8], [1, 7], [4, 8]]);
      var t1 = par[0], t2 = par[1];
      var vP = 0.5 * g * (t1 + t2);
      var h = vP * t1 - 0.5 * g * t1 * t1;
      var hMax = (vP * vP) / (2 * g);
      var intervalo = t2 - t1;
      return {
        titulo: 'Misma altura en dos instantes',
        enunciado:
          '<p>Un objeto se mueve verticalmente hacia arriba y pasa por un punto P con cierta velocidad. ' +
          'Se comprueba que se encuentra a una altura <i>h</i> por encima de P a los ' + t1 + ' s y a los ' + t2 +
          ' s de haber pasado por P. Usar g = ' + f(g) + ' m/s².</p>',
        incisos: [
          FIS.num('a', '¿Con qué rapidez pasó por el punto P?', vP, 'm/s', {
            solucion: [
              FIS.paso('Simetría del tiro vertical', 'El cuerpo pasa dos veces por la misma altura: una subiendo y otra bajando. ' +
                'El tiempo entre ambos pasos es ' + eq('∆t = ' + t2 + ' s − ' + t1 + ' s = ' + intervalo + ' s') + '.'),
              FIS.paso('Velocidad en P', 'La velocidad en P es tal que al cabo de ∆t/2 se anula la componente vertical: en ese instante, ' +
                eq('v_P = g·(∆t/2)') + ' ... tomando el intervalo completo desde P hasta el segundo paso:'),
              FIS.paso('Cálculo directo', eq('v_P = 0.5·g·(t₁ + t₂) = 0.5·' + f(g) + '·(' + t1 + ' + ' + t2 + ') = ' + f(vP) + ' m/s'))
            ]
          }),
          FIS.num('b', '¿Cuál es esa altura <i>h</i> por encima de P?', h, 'm', {
            solucion: [FIS.paso('Ecuación horaria desde P', eq('h = v_P·t₁ − 0.5·g·t₁² = ' + f(vP) + '·' + t1 + ' − 0.5·' + f(g) + '·' + t1 + '² = ' + f(h) + ' m')),
              FIS.paso('Verificación con t₂', eq('h = ' + f(vP) + '·' + t2 + ' − 0.5·' + f(g) + '·' + t2 + '² = ' + f(vP * t2 - 0.5 * g * t2 * t2) + ' m'))]
          }),
          FIS.num('c', '¿Qué altura máxima alcanza respecto del punto P?', hMax, 'm', {
            solucion: [FIS.paso('Desde P, con rapidez v_P', eq('h_máx = v_P²/(2g) = ' + f(vP) + '²/(2·' + f(g) + ') = ' + f(hMax) + ' m')),
              FIS.paso('Control', 'La altura pedida en (b) debe ser menor que esta: ' + f(h) + ' m < ' + f(hMax) + ' m. ✔')]
          }),
          FIS.vf('d', 'En el instante intermedio entre los dos pasos, la velocidad es nula y la aceleración también.', false, {
            pistas: ['Recordá qué ocurre con la aceleración en un tiro vertical.'],
            solucion: [FIS.paso('Justificación', 'En el instante intermedio (t = ' + f((t1 + t2) / 2, 1) + ' s después de P) la velocidad es nula, ' +
              'pero la aceleración sigue siendo g = ' + f(g) + ' m/s² hacia abajo. Es justamente esa aceleración la que hace que el cuerpo ' +
              'se detenga y comience a bajar. La afirmación es <b>falsa</b>.')]
          })
        ],
        datos: { t1: t1, t2: t2 }
      };
    }
  });

  /* =======================================================================
     V11 · Caída libre + movimiento horizontal (la pelota en la canasta)
     ======================================================================= */
  R({
    id: 'V11_pelota_canasta',
    unidad: '2.2', cat: 'mixto', tema: 'Composición: caída libre y MRU',
    nombre: 'Dejar caer una pelota dentro de una canasta en movimiento',
    dif: 3,
    desc: 'Combina una caída libre vertical con el MRU horizontal de la compañera que lleva la canasta.',
    gen: function (r, g) {
      var H = r.pick([30, 36, 40, 46, 55]);
      var hCanasta = r.pick([1, 1.2, 1.5, 1.8]);
      var v = r.pick([1, 1.2, 1.4, 1.6]);
      var hCaida = H - hCanasta;
      var t = Math.sqrt(2 * hCaida / g);
      var x = v * t;
      return {
        titulo: 'Caída libre y desplazamiento horizontal',
        enunciado:
          '<p>Estás en la azotea de un edificio de ' + f(H, 0) + ' m de altura. Tu compañera camina junto al edificio ' +
          'con velocidad constante de ' + f(v) + ' m/s, llevando una canasta cuya boca está a ' + f(hCanasta) +
          ' m del piso. Sueltas una pelota desde el borde de la azotea en el instante en que ella pasa justo debajo. ' +
          'Usar g = ' + f(g) + ' m/s² y despreciar el rozamiento con el aire.</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tiempo tarda la pelota en descender hasta la altura de la boca de la canasta?', t, 's', {
            solucion: [
              FIS.herramientas('la pelota (caída libre) y la compañera con la canasta (MRU)', 'el piso', 'eje y vertical positivo hacia arriba para la pelota, y eje x horizontal en el sentido en que camina la compañera',
                'la pelota cae ' + f(hCaida) + ' m desde el reposo; la compañera se desplaza a ' + f(v) + ' m/s'),
              FIS.paso('Altura que debe caer', eq('∆h = ' + f(H, 0) + ' m − ' + f(hCanasta) + ' m = ' + f(hCaida) + ' m')),
              FIS.paso('Caída libre', eq('∆h = 0.5·g·t² ⇒ t = √(2·' + f(hCaida) + '/' + f(g) + ') = ' + f(t) + ' s'))
            ]
          }),
          FIS.num('b', '¿A qué distancia del edificio debe estar la compañera en el instante en que sueltas la pelota?', x, 'm', {
            pistas: ['En el tiempo de caída, la compañera avanza con MRU: x = v·t.'],
            solucion: [FIS.paso('MRU horizontal de la compañera', eq('x = v·t = ' + f(v) + '·' + f(t) + ' = ' + f(x) + ' m')),
              FIS.paso('Interpretación', 'Al soltar, la canasta debe estar a esa distancia para que pelota y canasta coincidan ' + f(t) + ' s después.')]
          }),
          FIS.num('c', '¿A qué distancia horizontal del edificio está la canasta cuando la pelota entra en ella?', x, 'm', {
            solucion: [FIS.paso('Punto de encuentro', 'Pelota y canasta se encuentran en el mismo punto: la pelota cayó verticalmente ' +
              f(hCaida) + ' m desde el borde y la canasta llegó hasta allí recorriendo ' + f(x) + ' m desde su posición inicial.'),
              FIS.paso('Posición del encuentro', 'Sobre el eje x: a ' + f(x) + ' m del edificio; en altura: a ' + f(hCanasta) + ' m del piso.')]
          }),
          FIS.vf('d', 'Si el edificio fuera más alto, la compañera podría estar más lejos del edificio para que la pelota entre igual en la canasta.', true, {
            solucion: [FIS.paso('Justificación', 'El tiempo de caída crece con la altura ' + eq('t = √(2∆h/g)') +
              ', y en ese mayor tiempo la compañera recorre más distancia. La afirmación es <b>verdadera</b>.')]
          })
        ],
        datos: { H: H, hCanasta: hCanasta, v: v }
      };
    }
  });

  /* =======================================================================
     V12 · Dos proyectiles desde el mismo punto, con retardo
     ======================================================================= */
  R({
    id: 'V12_dos_proyectiles_retardo',
    unidad: '2.2', cat: 'vertical', tema: 'Encuentros verticales',
    nombre: 'Proyectil que es alcanzado por otro soltado después',
    dif: 3,
    desc: 'El primero se lanza hacia arriba y el segundo se deja caer desde el mismo punto varios segundos después: se cruzan en el aire.',
    gen: function (r, g) {
      g = 10;                                     // caso especial: números exactos (g = 10 m/s²)
      /* Sólo se aceptan combinaciones físicamente razonables:
         el cruce debe ocurrir después de soltar el segundo objeto y no demasiado abajo del techo. */
      var combinaciones = [];
      [3, 4, 5].forEach(function (d) {
        for (var v = 5 * d + 1; v <= 10 * d - 1; v++) {
          var tt = 0.5 * g * d * d / (g * d - v);
          var yy = v * tt - 0.5 * g * tt * tt;
          if (tt > d + 0.1 && yy >= -60) combinaciones.push([d, v]);
        }
      });
      var par = r.pick(combinaciones);
      var delta = par[0], v1 = par[1];
      // v1·t = 0.5·g·(2tΔ − Δ²) ⇒ t = 0.5·g·Δ²/(g·Δ − v1)
      var tTotal = 0.5 * g * delta * delta / (g * delta - v1);
      var tDespues = tTotal - delta;
      var yEnc = v1 * tTotal - 0.5 * g * tTotal * tTotal;
      var vProyectil1 = v1 - g * tTotal;
      return {
        titulo: 'Dos proyectiles desde el mismo punto',
        enunciado:
          '<p>Un proyectil se lanza verticalmente hacia arriba desde el techo de un edificio con rapidez de ' + f(v1, 0) +
          ' m/s. Otro proyectil se deja caer desde el mismo punto ' + delta + ' s después que se lanzó el primero. ' +
          'Usar <b>g = 10 m/s²</b>.</p>' +
          '<p class="nota">El edificio es lo suficientemente alto como para que el cruce ocurra antes de que alguno llegue al piso. ' +
          'Tomar el origen en el punto de lanzamiento y el sentido positivo hacia arriba (las alturas por debajo del techo serán negativas).</p>',
        incisos: [
          FIS.num('a', '¿Cuánto tiempo después de soltar el segundo proyectil lo alcanza el primero (pasa a su altura)?', tDespues, 's', {
            solucion: [
              FIS.herramientas('los dos proyectiles', 'el techo del edificio', 'eje y positivo hacia arriba, origen en el punto de lanzamiento',
                'y₁(t) = ' + f(v1, 0) + '·t − 0.5·10·t²   y   y₂(t) = −0.5·10·(t − ' + delta + ')² (para t ≥ ' + delta + ' s)'),
              FIS.paso('Igualamos posiciones', eq(f(v1, 0) + '·t − 5·t² = −5·(t − ' + delta + ')²')),
              FIS.paso('Despeje', eq(f(v1, 0) + '·t = 5·(2·' + delta + '·t − ' + delta + '²)') + ' ⇒ ' + eq('t = ' + f(tTotal) + ' s') + ' desde el lanzamiento del primero.'),
              FIS.paso('Respecto del segundo', eq('∆t = ' + f(tTotal) + ' s − ' + delta + ' s = ' + f(tDespues) + ' s'))
            ]
          }),
          FIS.num('b', '¿A qué altura sobre el punto de lanzamiento se cruzan?', yEnc, 'm', {
            solucion: [FIS.paso('Reemplazo en la ecuación del primero', eq('y = ' + f(v1, 0) + '·' + f(tTotal) + ' − 5·(' + f(tTotal) + ')² = ' + f(yEnc) + ' m')),
              FIS.paso('Verificación con el segundo', eq('y = −5·(' + f(tTotal) + ' − ' + delta + ')² = ' + f(-5 * tDespues * tDespues) + ' m')),
              FIS.paso('Interpretación', 'El signo de la altura indica que el cruce ocurre <b>' + (yEnc < 0 ? 'por debajo' : 'por encima') +
                '</b> del techo: ' + f(Math.abs(yEnc)) + ' m ' + (yEnc < 0 ? 'más abajo (el proyectil 1 ya bajaba y el 2 había caído más rápido).' : 'más arriba.') +
                ' El valor ' + f(-5 * tDespues * tDespues) + ' m obtenido con la ecuación del segundo confirma el resultado.')]
          }),
          FIS.vf('c', 'En el instante del cruce, el primer proyectil está descendiendo.', vProyectil1 < 0, {
            pistas: ['Calculá la velocidad del primero con v = v₀ − g·t.'],
            solucion: [FIS.paso('Velocidad del primero', eq('v = ' + f(v1, 0) + ' − 10·' + f(tTotal) + ' = ' + f(vProyectil1) + ' m/s')),
              FIS.paso('Conclusión', 'Como la velocidad es ' + (vProyectil1 < 0 ? 'negativa, está bajando ⇒ <b>verdadera</b>.' : 'positiva, todavía sube ⇒ <b>falsa</b>.'))]
          })
        ],
        datos: { delta: delta, v1: v1, gEspecial: 10 }
      };
    }
  });

  /* =======================================================================
     V13 · Encuentro entre un proyectil lanzado desde el suelo y otro desde
           el techo de un edificio (ambos hacia arriba)
     ======================================================================= */
  R({
    id: 'V13_encuentro_torre_y_suelo',
    unidad: '2.2', cat: 'vertical', tema: 'Encuentros verticales',
    nombre: 'Encuentro entre un proyectil lanzado desde el suelo y otro desde una torre',
    dif: 3,
    desc: 'Determina si hay encuentro entre dos proyectiles lanzados hacia arriba desde alturas distintas y calcula instante y altura.',
    gen: function (r, g) {
      var H, v1, v2, t, yEnc, ok = false, intentos = 0;
      do {
        H = r.pick([40, 60, 80, 100]);
        v1 = r.int(3, 12);                      // desde la torre, hacia arriba
        v2 = v1 + r.int(8, 25);                 // desde el suelo, más rápido
        t = H / (v2 - v1);                      // H + v1 t = v2 t
        yEnc = v2 * t - 0.5 * g * t * t;
        var tSuelo2 = 2 * v2 / g;               // el del suelo vuelve al piso
        var tTorre = (v1 + Math.sqrt(v1 * v1 + 2 * g * H)) / g;
        ok = t > 0.3 && yEnc > 2 && yEnc < H - 2 && t < tSuelo2 && t < tTorre;
        intentos++;
      } while (!ok && intentos < 300);
      var hMaxTorre = H + (v1 * v1) / (2 * g);
      var hMaxSuelo = (v2 * v2) / (2 * g);
      return {
        titulo: 'Encuentro con un proyectil desde una torre',
        enunciado:
          '<p>Desde la cima de una torre de ' + f(H, 0) + ' m de altura se lanza una piedra verticalmente hacia arriba con rapidez de ' +
          f(v1, 0) + ' m/s. En el mismo instante, desde el suelo, se lanza otra piedra verticalmente hacia arriba con rapidez de ' +
          f(v2, 0) + ' m/s. Usar g = ' + f(g) + ' m/s², con eje vertical positivo hacia arriba y origen en el suelo.</p>',
        incisos: [
          FIS.num('a', '¿Existe encuentro entre ambas piedras? Responder 1 si es Sí y 0 si es No.', 1, '', {
            pistas: ['Compará las alturas en función del tiempo: la de arriba parte de ' + f(H, 0) + ' m y la de abajo de 0 m.'],
            solucion: [FIS.paso('Planteo del encuentro', eq('y₁(t) = ' + f(H, 0) + ' + ' + f(v1, 0) + '·t − 0.5·g·t²') + ' y ' + eq('y₂(t) = ' + f(v2, 0) + '·t − 0.5·g·t²')),
              FIS.paso('Condición', eq(f(H, 0) + ' + ' + f(v1, 0) + '·t = ' + f(v2, 0) + '·t') + ' ⇒ ' + eq('t = ' + f(t) + ' s') + ', solución positiva y dentro del tiempo en que ambas están en el aire ⇒ <b>sí hay encuentro</b>.')]
          }),
          FIS.num('b', '¿En qué instante, desde el lanzamiento?', t, 's', {
            solucion: [FIS.paso('Despeje', eq('t = H/(v₂ − v₁) = ' + f(H, 0) + '/(' + f(v2, 0) + ' − ' + f(v1, 0) + ') = ' + f(t) + ' s')),
              FIS.paso('Interpretación', 'De nuevo los términos −0.5g t² se cancelan: el tiempo de encuentro sólo depende de la diferencia de velocidades y de la separación inicial.')]
          }),
          FIS.num('c', '¿A qué altura del suelo se encuentran?', yEnc, 'm', {
            solucion: [FIS.paso('Con la ecuación de la piedra del suelo', eq('y = ' + f(v2, 0) + '·' + f(t) + ' − 0.5·' + f(g) + '·(' + f(t) + ')² = ' + f(yEnc) + ' m')),
              FIS.paso('Verificación con la de la torre', eq('y = ' + f(H, 0) + ' + ' + f(v1, 0) + '·' + f(t) + ' − 0.5·' + f(g) + '·(' + f(t) + ')² = ' + f(H + v1 * t - 0.5 * g * t * t) + ' m'))]
          }),
          FIS.op('d', '¿Cuál de las dos piedras alcanzaría mayor altura si no se cruzaran?',
            ['La lanzada desde el suelo', 'La lanzada desde la torre', 'Ambas la misma'], hMaxSuelo > hMaxTorre ? 0 : 1, {
              solucion: [FIS.paso('Comparación de alturas máximas',
                'Desde el suelo: ' + eq('h = v₂²/(2g) = ' + f(hMaxSuelo) + ' m') + '. Desde la torre: ' + eq('h = ' + f(H, 0) + ' + v₁²/(2g) = ' + f(hMaxTorre) + ' m') +
                ' ⇒ la mayor es la de ' + (hMaxSuelo > hMaxTorre ? 'la piedra lanzada desde el suelo' : 'la lanzada desde la torre') + '.')]
            })
        ],
        datos: { H: H, v1: v1, v2: v2 }
      };
    }
  });

})(typeof globalThis !== 'undefined' ? globalThis : this);
