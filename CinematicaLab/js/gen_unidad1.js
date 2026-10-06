/* Generadores de las unidades 1.1, 1.2 y 1.3: magnitudes, vectores, cinemática básica y MRU. */
(function (root) {
  'use strict';
  var FIS = root.FIS, R = FIS.registrar, f = FIS.fmt, eq = FIS.eq;
  function pasosDatos(datos) { return FIS.herramientas('la magnitud o móvil', 'suelo / marco elegido', 'eje positivo indicado en el enunciado', datos); }

  R({
    id: 'U11_conversion_unidades', unidad: '1.1', cat: 'unidad11', tema: 'Magnitudes y unidades SI', nombre: 'Conversión de unidades y análisis dimensional', dif: 1,
    desc: 'Convierte unidades cotidianas al Sistema Internacional y reconoce magnitudes fundamentales y derivadas.',
    gen: function (r) {
      var casos = [
        { nombre: 'una distancia', valor: r.pick([1.2, 3.5, 7.2, 12.5]), unidad: 'km', factor: 1000, si: 'm', dim: 'longitud' },
        { nombre: 'un intervalo de tiempo', valor: r.pick([2, 3.5, 7, 12]), unidad: 'min', factor: 60, si: 's', dim: 'tiempo' },
        { nombre: 'una rapidez', valor: r.pick([36, 54, 72, 90]), unidad: 'km/h', factor: 1 / 3.6, si: 'm/s', dim: 'velocidad' },
        { nombre: 'un volumen', valor: r.pick([0.5, 1.2, 2.5, 7]), unidad: 'L', factor: 0.001, si: 'm³', dim: 'volumen' }
      ];
      var c = r.pick(casos), resultado = c.valor * c.factor;
      return { titulo: 'Magnitudes, unidades y sistema internacional', enunciado: '<p>En un experimento se mide ' + c.nombre + ' y se obtiene <b>' + f(c.valor) + ' ' + c.unidad + '</b>.</p><p>Trabajá con el SI y recordá que una magnitud física siempre se expresa con un número y una unidad.</p>', incisos: [
        FIS.num('a', '¿Cuál es el valor expresado en ' + c.si + '?', resultado, c.si, { pistas: ['Buscá la equivalencia entre ' + c.unidad + ' y ' + c.si + '.', 'Multiplicá por el factor de conversión sin cambiar la dimensión física.'], solucion: [pasosDatos(c.valor + ' ' + c.unidad + ' · factor ' + c.factor), FIS.paso('Conversión', eq(f(c.valor) + ' ' + c.unidad + ' = ' + f(resultado) + ' ' + c.si)), FIS.paso('Control dimensional', 'El resultado sigue siendo una magnitud de ' + c.dim + '; sólo cambió la unidad.') ]}),
        FIS.op('b', 'La magnitud trabajada es:', ['fundamental del SI', 'derivada del SI', 'un vector sin unidad'], c.dim === 'tiempo' ? 0 : 1, { pistas: ['El tiempo y la longitud son fundamentales; velocidad y volumen se construyen a partir de otras.', 'Mirá si la unidad puede escribirse combinando unidades fundamentales.'], solucion: [FIS.paso('Clasificación', c.dim === 'tiempo' ? 'El tiempo es una magnitud fundamental del SI.' : 'Esta magnitud se expresa combinando magnitudes fundamentales, por eso es derivada.') ]})
      ], datos: { resultado: resultado } };
    }
  });

  R({
    id: 'U11_vector_componentes', unidad: '1.1', cat: 'unidad11', tema: 'Vectores y magnitudes', nombre: 'Componentes cartesianas de un vector', dif: 2,
    desc: 'Descompone un vector dado en módulo y ángulo, y reconoce dirección y sentido.',
    gen: function (r) {
      var mod = r.pick([4, 5, 6, 8, 10]), ang = r.pick([30, 45, 60, 120, 150, 210, 300]), rad = ang * Math.PI / 180;
      var x = mod * Math.cos(rad), y = mod * Math.sin(rad);
      return { titulo: 'Vector en formato polar, cartesiano y versorial', enunciado: '<p>Un vector <b>A</b> tiene módulo ' + f(mod) + ' unidades y forma un ángulo de ' + ang + '° con el semieje x positivo.</p><p>Usá un sistema cartesiano usual y expresá los signos según el cuadrante.</p>', incisos: [
        FIS.num('a', '¿Cuál es la componente x del vector?', x, 'u', { pistas: ['La componente horizontal se obtiene con coseno: Aₓ = A·cos(θ).', 'Revisá el signo de cos(' + ang + '°) según el cuadrante.'], solucion: [FIS.paso('Descomposición', eq('Aₓ = A·cos θ = ' + f(mod) + '·cos(' + ang + '°) = ' + f(x) + ' u'))]}),
        FIS.num('b', '¿Cuál es la componente y del vector?', y, 'u', { pistas: ['La componente vertical se obtiene con seno: Aᵧ = A·sen(θ).', 'El signo depende de si el vector apunta arriba o abajo.'], solucion: [FIS.paso('Descomposición', eq('Aᵧ = A·sen θ = ' + f(mod) + '·sen(' + ang + '°) = ' + f(y) + ' u'))]}),
        FIS.op('c', 'El vector pertenece al cuadrante:', ['I', 'II', 'III', 'IV'], ang > 0 && ang < 90 ? 0 : ang < 180 ? 1 : ang < 270 ? 2 : 3, { solucion: [FIS.paso('Cuadrante', 'Se observan los signos de Aₓ y Aᵧ, o directamente el intervalo angular: ' + ang + '° corresponde al cuadrante indicado.') ]})
      ], datos: { x: x, y: y } };
    }
  });

  R({
    id: 'U12_desplazamiento_distancia', unidad: '1.2', cat: 'unidad12', tema: 'Desplazamiento y distancia', nombre: 'Desplazamiento, distancia y longitud de trayectoria', dif: 2,
    desc: 'Analiza recorridos con cambios de sentido y distingue desplazamiento de distancia total.',
    gen: function (r) {
      var a = r.pick([4, 6, 8, 10]), b = r.pick([2, 3, 5, 7]), c = r.pick([3, 4, 6]);
      var desplaz = a - b + c, dist = a + b + c, posFinal = desplaz;
      return { titulo: 'Desplazamiento y longitud de trayectoria', enunciado: '<p>Una persona parte del origen, avanza <b>' + a + ' m</b> hacia el norte, retrocede <b>' + b + ' m</b> y vuelve a avanzar <b>' + c + ' m</b> hacia el norte.</p><p>Tomá el norte como sentido positivo.</p>', incisos: [
        FIS.num('a', '¿Cuál es el desplazamiento total?', desplaz, 'm', { pistas: ['El desplazamiento es posición final menos posición inicial, con signo.', 'Sumá los tramos teniendo en cuenta sus sentidos: +' + a + ' − ' + b + ' + ' + c + '.'], solucion: [pasosDatos('x₀ = 0; tramos: +' + a + ', −' + b + ', +' + c), FIS.paso('Suma vectorial', eq('∆x = +' + a + ' − ' + b + ' + ' + c + ' = ' + f(desplaz) + ' m'))]}),
        FIS.num('b', '¿Cuál es la distancia total recorrida?', dist, 'm', { pistas: ['La distancia total no lleva signo y suma todos los tramos.', 'No canceles el tramo de regreso: d = ' + a + ' + ' + b + ' + ' + c + '.'], solucion: [FIS.paso('Longitud de trayectoria', eq('s = |' + a + '| + |' + b + '| + |' + c + '| = ' + f(dist) + ' m'))]}),
        FIS.vf('c', 'El módulo del desplazamiento siempre coincide con la distancia total recorrida.', false, { pistas: ['Sólo coinciden si el movimiento no cambia de sentido.', 'En este caso, el tramo de regreso aumenta la trayectoria pero no el desplazamiento.'], solucion: [FIS.paso('Comparación', 'Aquí |∆x| = ' + f(Math.abs(desplaz)) + ' m y s = ' + f(dist) + ' m; como son distintos, la afirmación es falsa.') ]})
      ], datos: { desplaz: desplaz, dist: dist } };
    }
  });

  R({
    id: 'U12_marco_referencia', unidad: '1.2', cat: 'unidad12', tema: 'Sistema de referencia', nombre: 'Posición respecto de un marco de referencia', dif: 1,
    desc: 'Trabaja posiciones con origen y sentido positivo explícitos.',
    gen: function (r) {
      var casa = r.pick([120, 180, 250]), cafe = r.pick([420, 480, 560]), origen = r.pick([0, 100, 200]);
      var posCasa = casa - origen, posCafe = cafe - origen, despl = posCafe - posCasa;
      return { titulo: 'Elegir y usar un sistema de referencia', enunciado: '<p>En una calle numerada de sur a norte, el sentido norte es positivo. Una persona sale de la casa ubicada en el ' + casa + ' y llega a un café ubicado en el ' + cafe + '.</p><p>Elegí como origen el ' + origen + ' de la calle.</p>', incisos: [
        FIS.num('a', '¿Cuál es la posición inicial respecto del origen elegido?', posCasa, 'm', { pistas: ['La posición se mide desde el origen: x = número de la calle − origen.', 'No confundas posición con desplazamiento.'], solucion: [FIS.paso('Posición inicial', eq('x₀ = ' + casa + ' − ' + origen + ' = ' + f(posCasa) + ' m'))]}),
        FIS.num('b', '¿Cuál es la posición final respecto del origen?', posCafe, 'm', { solucion: [FIS.paso('Posición final', eq('x_f = ' + cafe + ' − ' + origen + ' = ' + f(posCafe) + ' m'))]}),
        FIS.num('c', '¿Cuál es el desplazamiento?', despl, 'm', { pistas: ['Usá ∆x = x_f − x₀.', 'El signo indica el sentido respecto del eje elegido.'], solucion: [FIS.paso('Desplazamiento', eq('∆x = ' + f(posCafe) + ' − (' + f(posCasa) + ') = ' + f(despl) + ' m'))]})
      ], datos: { posCasa: posCasa, posCafe: posCafe, despl: despl } };
    }
  });

  if (!FIS.omitirUnidad13) R({
    id: 'U13_mru_directo', unidad: '1.3', cat: 'mru', tema: 'MRU: velocidad y ecuación horaria', nombre: 'Movimiento rectilíneo uniforme', dif: 1,
    desc: 'Calcula posiciones, velocidades, tiempos y conversiones en un MRU.',
    gen: function (r) {
      var x0 = r.pick([-20, 0, 10, 50]), v = r.pick([2, 3, 5, 8, 10]), t = r.pick([4, 6, 8, 12]), xf = x0 + v * t;
      return { titulo: 'Ecuación horaria del MRU', enunciado: '<p>Un móvil parte de x₀ = <b>' + x0 + ' m</b> en t₀ = 0 y se desplaza en línea recta con velocidad constante <b>' + v + ' m/s</b>.</p>', incisos: [
        FIS.num('a', '¿Dónde se encuentra a los ' + t + ' s?', xf, 'm', { pistas: ['En MRU: x(t) = x₀ + v·t.', 'La pendiente del gráfico x(t) es la velocidad constante.'], solucion: [FIS.paso('Ecuación horaria', eq('x(' + t + ') = ' + x0 + ' + ' + v + '·' + t + ' = ' + f(xf) + ' m'))]}),
        FIS.num('b', '¿Qué velocidad tiene a los ' + t + ' s?', v, 'm/s', { solucion: [FIS.paso('Velocidad', 'En MRU la velocidad no cambia: v(t) = ' + f(v) + ' m/s.')]}),
        FIS.num('c', '¿En qué instante pasa por x = ' + (x0 + v * (t + 2)) + ' m?', t + 2, 's', { pistas: ['Despejá t de x = x₀ + v·t.', 't = (x − x₀)/v.'], solucion: [FIS.paso('Despeje', eq('t = (x − x₀)/v = (' + (x0 + v * (t + 2)) + ' − ' + x0 + ')/' + v + ' = ' + f(t + 2) + ' s'))]})
      ], datos: { xf: xf, v: v, tiempo: t } };
    }
  });

  if (!FIS.omitirUnidad13) R({
    id: 'U13_mru_encuentro', unidad: '1.3', cat: 'mru', tema: 'Encuentros en MRU', nombre: 'Encuentro de dos móviles con velocidad constante', dif: 2,
    desc: 'Encuentra dos móviles mediante ecuaciones horarias y velocidad relativa.',
    gen: function (r) {
      var d = r.pick([120, 180, 240, 300]), vA = r.pick([4, 6, 8]), vB = r.pick([10, 12, 15]);
      var t = d / (vA + vB), x = vA * t;
      return { titulo: 'Encuentro de dos móviles en una recta', enunciado: '<p>Dos móviles parten simultáneamente desde extremos separados por <b>' + d + ' m</b> y avanzan uno hacia el otro. A se mueve a <b>' + vA + ' m/s</b> y B a <b>' + vB + ' m/s</b>.</p>', incisos: [
        FIS.num('a', '¿En qué instante se encuentran?', t, 's', { pistas: ['Como se acercan, la rapidez relativa es vA + vB.', 't = distancia inicial / (vA + vB).'], solucion: [FIS.herramientas('móvil A y móvil B', 'recta horizontal con origen en A', 'positivo de A hacia B', 'x_A = v_A·t; x_B = d − v_B·t'), FIS.paso('Igualación', eq(vA + '·t = ' + d + ' − ' + vB + '·t')), FIS.paso('Resultado', eq('t = ' + d + '/(' + vA + '+' + vB + ') = ' + f(t) + ' s'))]}),
        FIS.num('b', '¿A qué distancia del punto de partida de A se encuentran?', x, 'm', { pistas: ['Reemplazá el tiempo en xA = vA·t.', 'La distancia también se puede comprobar con d − vB·t.'], solucion: [FIS.paso('Posición de encuentro', eq('x_e = ' + vA + '·' + f(t) + ' = ' + f(x) + ' m'))]}),
        FIS.vf('c', 'En el encuentro ambos móviles tienen necesariamente la misma velocidad.', false, { pistas: ['Encontrarse significa misma posición y mismo instante.', 'La velocidad depende de cada móvil y puede ser distinta.'], solucion: [FIS.paso('Interpretación', 'Coinciden x y t, pero vA = ' + vA + ' m/s y vB = ' + vB + ' m/s; por eso la afirmación es falsa.') ]})
      ], datos: { tiempo: t, posicion: x } };
    }
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
