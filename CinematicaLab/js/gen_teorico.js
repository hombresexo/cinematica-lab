/* =========================================================================
   Ejercicios teóricos — verdadero/falso con justificación redactada
   Cada ítem trae: respuesta correcta, pistas, justificación modelo y rúbrica
   (conceptos esperados y errores frecuentes) para corregir el texto del alumno.
   ========================================================================= */
(function (root) {
  'use strict';
  var FIS = root.FIS, T = FIS.registrarTeorico;
  var f = FIS.fmt;

  function con(label, patrones) { return { label: label, patrones: patrones }; }
  function err(label, patrones, mensaje) { return { label: label, patrones: patrones, mensaje: mensaje }; }

  /* ------------------------------------------------------------------ */
  /* Afirmaciones conceptuales (adaptadas de las guías 2.1 y 2.2 UTN FRA)*/
  /* ------------------------------------------------------------------ */
  var conceptuales = [
    {
      id: 'T_vacio_gravedad', unidad: '2.2', tema: 'Caída libre', dif: 1,
      afirmacion: 'En el vacío no hay gravedad.',
      valor: false,
      pistas: ['Pensá qué es la gravedad: ¿una fuerza que necesita aire para existir?', '¿Qué pasa con un satélite en el espacio, donde no hay aire?'],
      justificacion: 'Falso. El vacío es la ausencia de aire (de materia), pero el campo gravitatorio terrestre sigue actuando. ' +
        'En el vacío la caída es más "limpia" justamente porque desaparece el rozamiento con el aire, pero la aceleración gravitatoria g sigue valiendo 9,81 m/s². ' +
        'La prueba es el tubo de Newton: en su interior (vacío) la pluma y la piedra caen simultáneamente porque ambas tienen la misma aceleración g.',
      rubrica: { conceptos: [con('el vacío es ausencia de aire, no de gravedad', ['vac', 'aire']),
        con('la gravedad sigue actuando / g ≠ 0', ['gravedad', 'gravitatori', 'sigue actuando', 'no desaparece']),
        con('en el vacío todos los cuerpos caen con la misma aceleración g', ['misma aceleracion', 'caen igual', 'al mismo tiempo', 'simultane']),
        con('se elimina el rozamiento con el aire, no la gravedad', ['rozamiento', 'resistencia del aire'])],
        errores: [err('confunde ausencia de aire con ausencia de gravedad', ['no hay gravedad en el vacio', 'sin gravedad'], 'Cuidado: sin aire no significa sin gravedad.')] }
    },
    {
      id: 'T_aceleracion_cambia_signo', unidad: '2.2', tema: 'Tiro vertical', dif: 2,
      afirmacion: 'En un tiro vertical hacia arriba, el movimiento es primero desacelerado y luego acelerado, entonces la aceleración cambia de signo.',
      valor: false,
      pistas: ['¿De qué depende el signo de la aceleración en un movimiento libre?', 'Mirá el gráfico a = f(t) de un tiro vertical.'],
      justificacion: 'Falso. La aceleración es constante y siempre vale g hacia abajo. Lo que cambia es el signo de la velocidad: al subir, v y a tienen sentidos opuestos y el móvil frena; al bajar, tienen el mismo sentido y el móvil acelera. ' +
        'Es decir, el signo que cambia es el de v, no el de a.',
      rubrica: { conceptos: [con('la aceleración es constante (g) y no cambia de signo', ['constante', 'no cambia', 'siempre la misma']),
        con('el signo de g depende del sistema de referencia', ['sistema de referencia', 'sentido positivo', 'eje']),
        con('lo que cambia de signo es la velocidad', ['la velocidad cambia', 'signo de la velocidad', 'v cambia']),
        con('al subir v y a tienen sentidos opuestos: desacelera', ['sentidos opuestos', 'desacelera', 'frena'])],
        errores: [err('cree que la aceleración cambia de signo', ['la aceleracion cambia', 'a cambia de signo'], 'La aceleración en caída libre y tiro vertical es siempre g, constante.')] }
    },
    {
      id: 'T_pluma_piedra_tubo', unidad: '2.2', tema: 'Caída libre', dif: 1,
      afirmacion: 'Si se sueltan una pluma y una piedra dentro de un tubo en cuyo interior se hizo vacío, ambos objetos caen a la par.',
      valor: true,
      pistas: ['¿Qué fuerza frena a la pluma en el aire?'],
      justificacion: 'Verdadero. Sin aire no hay fuerza de rozamiento que frene a la pluma, y todos los cuerpos caen con la misma aceleración g, independientemente de su masa, tamaño o forma. Recorren la misma altura en el mismo tiempo.',
      rubrica: { conceptos: [con('todos caen con la misma aceleración g', ['misma aceleracion', 'misma g', 'g = 9']),
        con('la masa no influye en la caída', ['masa', 'peso', 'no influye', 'independientemente']),
        con('sin aire desaparece el rozamiento que frenaba a la pluma', ['rozamiento', 'resistencia del aire', 'aire'])],
        errores: [err('cree que el más pesado cae primero', ['el mas pesado cae primero', 'por el peso cae mas rapido'], 'En el vacío el peso no influye: la aceleración es la misma.')] }
    },
    {
      id: 'T_v_cero_a_distinta', unidad: '2.1', tema: 'Conceptos del MRUV', dif: 2,
      afirmacion: 'Hay casos en que la velocidad es cero y la aceleración es distinta de cero.',
      valor: true,
      pistas: ['Pensá en el punto más alto de un tiro vertical.'],
      justificacion: 'Verdadero. En el punto más alto de un tiro vertical la velocidad es nula pero la aceleración sigue siendo g = 9,81 m/s² hacia abajo; ' +
        'también un auto detenido que arranca tiene v = 0 y a ≠ 0. Que v sea cero no implica que a sea cero.',
      rubrica: { conceptos: [con('ejemplo del punto más alto de un tiro vertical', ['altura maxima', 'punto mas alto', 'tiro vertical']),
        con('la aceleración sigue siendo g', ['g ', 'gravedad', '9,81', '9.81', 'aceleracion de la gravedad']),
        con('distinción entre velocidad y aceleración', ['velocidad y aceleracion', 'no implica', 'independientes'])],
        errores: [] }
    },
    {
      id: 'T_mitad_tiempo_mitad_altura', unidad: '2.2', tema: 'Tiro vertical', dif: 2,
      afirmacion: 'En un tiro vertical hacia arriba, en la mitad del tiempo que tarda en subir llega a la mitad de la altura máxima.',
      valor: false,
      pistas: ['La posición depende de t², no linealmente de t.', 'Probá con v₀ = 20 m/s: ¿cuánto sube en 1 s y cuánto es la altura máxima?'],
      justificacion: 'Falso. La altura crece con t²: si el tiempo de subida es T = v₀/g, la altura máxima es h = v₀² · 0.5 ÷ g. En t = T/2 el cuerpo está a ¾ de la altura máxima, ' +
        'no a la mitad. (Con v₀ = 20 m/s: T = 2,04 s, h = 20,4 m; en t = 1,02 s está en 15,3 m ≈ ¾·h.)',
      rubrica: { conceptos: [con('la altura depende de t² (función cuadrática)', ['t al cuadrado', 'cuadratica', 't²', 'parabola']),
        con('en la mitad del tiempo está a ¾ de la altura máxima', ['¾', '3/4', 'tres cuartos', '0,75', '75%']),
        con('justificación con las ecuaciones horarias y(t) = v₀t − 0.5gt²', ['v₀', 'ecuacion horaria', 'y(t)', 'h = v₀', 'altura maxima es h'])],
        errores: [err('supone proporcionalidad lineal entre tiempo y altura', ['la mitad de la altura', 'es proporcional al tiempo', 'proporcional al tiempo'], 'La altura no es proporcional al tiempo: crece con t².')] }
    },
    {
      id: 'T_mitad_tiempo_mitad_velocidad', unidad: '2.2', tema: 'Tiro vertical', dif: 2,
      afirmacion: 'En un tiro vertical hacia arriba, en la mitad del tiempo que tarda en subir, tiene la mitad de la velocidad inicial.',
      valor: true,
      pistas: ['La velocidad sí varía linealmente con el tiempo.'],
      justificacion: 'Verdadero. La velocidad es v(t) = v₀ − g·t, una función lineal, y el tiempo de subida es T = v₀/g. ' +
        'En t = T/2 = v₀/(2g): v = v₀ − g·v₀/(2g) = v₀/2. La velocidad se reduce a la mitad justo en la mitad del tiempo de subida.',
      rubrica: { conceptos: [con('la velocidad varía linealmente con el tiempo', ['lineal', 'proporcional']),
        con('cálculo v = v₀ − g·(T/2) = v₀/2', ['v₀/2', 'la mitad de la velocidad inicial', 'mitad de v₀', 'v₀ − g·v₀']),
        con('el tiempo de subida es T = v₀/g', ['v₀/g', 'tiempo de subida'])],
        errores: [] }
    },
    {
      id: 'T_vector_regreso', unidad: '2.2', tema: 'Tiro vertical', dif: 2,
      afirmacion: 'En un tiro vertical hacia arriba desde el suelo, el vector velocidad inicial es igual al vector velocidad cuando vuelve al suelo.',
      valor: false,
      pistas: ['Distinga rapidez (módulo) de velocidad (vector).'],
      justificacion: 'Falso. Al volver al punto de partida la rapidez es la misma, pero el sentido es opuesto: el vector velocidad inicial apunta hacia arriba y el final hacia abajo. ' +
        'En notación de componentes: v₀ᵧ = +v₀ y v_final = −v₀. Los vectores no son iguales (sólo coinciden los módulos).',
      rubrica: { conceptos: [con('la rapidez (módulo) es la misma', ['misma rapidez', 'rapidez es la misma', 'mismo modulo', 'coinciden los modulos', 'misma velocidad en modulo']),
        con('el sentido es opuesto', ['sentido opuesto', 'contrario', 'hacia abajo', 'negativo']),
        con('la velocidad es una magnitud vectorial', ['vectorial', 'vector', 'componente'])],
        errores: [err('confunde rapidez con velocidad', ['es igual porque la rapidez'], 'Cuidado: coinciden los módulos, no los vectores.')] }
    },
    {
      id: 'T_misma_altura_primer_ultimo_segundo', unidad: '2.2', tema: 'Tiro vertical', dif: 3,
      afirmacion: 'En un tiro vertical hacia arriba, en el primer segundo de subida el cuerpo recorre la misma distancia que en el último segundo de subida.',
      valor: false,
      pistas: ['En el primer segundo la velocidad es máxima; en el último, casi nula.'],
      justificacion: 'Falso. En el primer segundo el cuerpo se mueve rápido y recorre más distancia; en el último segundo de subida la velocidad ya es muy pequeña y recorre menos. ' +
        'Por la simetría del movimiento, lo que sí coincide es la distancia recorrida en el primer segundo de subida con la del primer segundo de bajada (y la del último segundo de subida con la del último segundo de bajada).',
      rubrica: { conceptos: [con('la velocidad va disminuyendo durante el ascenso', ['disminuye', 'se frena', 'cada vez mas lento', 'muy pequena', 'cada vez menor']),
        con('en el primer segundo recorre más distancia', ['primer segundo', 'recorre mas', 'mayor distancia']),
        con('la simetría del movimiento relaciona subida y bajada', ['simetr', 'subida y bajada'])],
        errores: [] }
    },
    {
      id: 'T_depende_del_movil', unidad: '2.2', tema: 'Tiro vertical', dif: 2,
      afirmacion: 'Un estudiante afirma que el signo de g debe ser siempre negativo porque el objeto es lanzado hacia arriba; su compañera dice que debe ser siempre positivo. ¿Es correcta alguna de las dos posturas?',
      valor: false,
      tipo: 'texto',
      consignaTexto: 'Escribí un texto que explique por qué ambos estudiantes están equivocados.',
      pistas: ['¿De qué depende realmente el signo de la aceleración en las ecuaciones horarias?'],
      justificacion: 'Ninguna de las dos posturas es correcta. El signo de g no depende de lo que haga el móvil, sino del sistema de referencia elegido: ' +
        'si se toma el semieje positivo de ordenadas hacia arriba, g entra en las ecuaciones con signo negativo; si se lo toma hacia abajo, con signo positivo. ' +
        'Lo que caracteriza al movimiento es que la aceleración tiene siempre dirección vertical y sentido hacia el centro de la Tierra. ' +
        'Además, en un mismo tiro vertical el móvil primero frena y luego acelera, y eso ocurre con la misma g: lo que cambia es el signo de la velocidad.',
      rubrica: { conceptos: [con('el signo de g depende del sistema de referencia', ['sistema de referencia', 'eje', 'sentido positivo']),
        con('la dirección y el sentido de g es siempre hacia el centro de la Tierra (vertical hacia abajo)', ['hacia abajo', 'centro de la tierra', 'vertical']),
        con('el signo de g no depende de si el móvil sube o baja', ['no depende', 'suba o baje', 'independientemente']),
        con('la aceleración es constante durante todo el movimiento', ['constante', 'misma aceleracion', 'no cambia'])],
        errores: [err('adhiere a una de las dos posturas', ['tiene razon el', 'es correcto que g sea'], 'Recordá: ninguna de las dos posturas es correcta.')] }
    },
    {
      id: 'T_aceleracion_g_no_masa', unidad: '2.2', tema: 'Caída libre', dif: 1,
      afirmacion: 'Dos cuerpos de distinta masa, soltados desde la misma altura en el vacío, llegan al piso con distintas rapideces porque el más pesado es atraído con más fuerza.',
      valor: false,
      pistas: ['En el vacío, ¿qué aceleración tiene cada cuerpo?'],
      justificacion: 'Falso. Aunque la fuerza gravitatoria sobre el cuerpo más pesado es mayor, también lo es su masa, y el cociente F/m (la aceleración) es el mismo para ambos: g. ' +
        'En el vacío caen a la par y llegan con la misma rapidez, sin importar su masa.',
      rubrica: { conceptos: [con('la aceleración es la misma para ambos (g)', ['misma aceleracion', 'misma g', 'caen igual', 'caen a la par', 'el mismo para ambos', 'misma para ambos']),
        con('la fuerza es mayor pero también la masa', ['masa', 'fuerza', 'F/m', 'cociente']),
        con('llegan con la misma rapidez y al mismo tiempo', ['misma rapidez', 'al mismo tiempo', 'simultane'])],
        errores: [] }
    },
    {
      id: 'T_area_at', unidad: '2.1', tema: 'Interpretación de gráficos', dif: 1,
      afirmacion: 'El área encerrada por el gráfico a = f(t) entre dos instantes es numéricamente igual a la variación de velocidad en ese intervalo.',
      valor: true,
      pistas: ['En MRUV, a es constante: el área es base por altura.', 'Recordá: ∆v = a·∆t.'],
      justificacion: 'Verdadero. Para un MRUV, aₓ es constante, el área del rectángulo es aₓ·∆t y esto es exactamente ∆vₓ = aₓ·∆t. ' +
        'Es la interpretación geométrica de la definición de aceleración.',
      rubrica: { conceptos: [con('el área bajo a(t) es la variación de velocidad', ['variacion de velocidad', 'delta v', '∆v']),
        con('en MRUV a es constante (rectángulo)', ['constante', 'rectangulo']),
        con('relación ∆v = a·∆t', ['aₓ·∆t', 'a·∆t', 'aceleracion por tiempo', 'por el tiempo transcurrido', 'multiplicada por el tiempo'])],
        errores: [] }
    },
    {
      id: 'T_pendiente_vt', unidad: '2.1', tema: 'Interpretación de gráficos', dif: 1,
      afirmacion: 'En el gráfico v = f(t) de un MRUV, la pendiente de la recta es igual a la componente x de la aceleración.',
      valor: true,
      pistas: ['Pendiente = ∆v/∆t.'],
      justificacion: 'Verdadero. En el MRUV la aceleración es constante, por lo que el gráfico v(t) es una recta cuya pendiente es ∆vₓ/∆t = aₓ. ' +
        'Además, si la pendiente es positiva la aceleración es positiva; si la pendiente es negativa, la aceleración también lo es.',
      rubrica: { conceptos: [con('pendiente = ∆v/∆t = aceleración', ['pendiente', 'delta v', 'a']),
        con('a es constante en MRUV', ['constante'])],
        errores: [] }
    },
    {
      id: 'T_area_vt_desplazamiento', unidad: '2.1', tema: 'Interpretación de gráficos', dif: 2,
      afirmacion: 'Si el área neta bajo el gráfico v = f(t) en un intervalo es cero, entonces el móvil permaneció detenido durante todo el intervalo.',
      valor: false,
      pistas: ['Pensá en un móvil que va y vuelve al punto de partida.'],
      justificacion: 'Falso. El área neta nula significa que el desplazamiento es cero, es decir que el móvil volvió al punto de partida; pero pudo moverse (incluso mucho) durante el intervalo. ' +
        'Un ejemplo: un móvil que va hacia +x y luego hacia −x recorriendo la misma distancia, con la misma rapidez. Distancia recorrida ≠ desplazamiento.',
      rubrica: { conceptos: [con('área neta nula ⇒ desplazamiento nulo', ['desplazamiento nulo', 'desplazamiento es cero', 'desplazamiento cero', 'vuelve al punto de partida', 'punto de partida']),
        con('el móvil pudo moverse (distancia recorrida distinta de cero)', ['distancia recorrida', 'se movio', 'recorrio', 'pudo moverse']),
        con('diferencia entre desplazamiento y distancia', ['desplazamiento y distancia', 'no es lo mismo', 'distintos', '≠', 'desplazamiento ≠'])],
        errores: [err('confunde desplazamiento nulo con reposo', ['estuvo detenido', 'no se movio'], 'Un desplazamiento nulo no implica que el móvil haya estado detenido.')] }
    },
    {
      id: 'T_desaceleracion_signos', unidad: '2.1', tema: 'Conceptos del MRUV', dif: 2,
      afirmacion: 'Un móvil con velocidad y aceleración de signos opuestos está frenando (disminuye su rapidez).',
      valor: true,
      pistas: ['Compará los sentidos de los vectores velocidad y aceleración.'],
      justificacion: 'Verdadero. Si el vector velocidad y el vector aceleración tienen sentidos (signos) opuestos, el módulo de la velocidad disminuye: el móvil frena. ' +
        'Es el caso del vehículo que frena (v > 0, a < 0) o del móvil que se mueve hacia la izquierda y desacelera (v < 0, a > 0).',
      rubrica: { conceptos: [con('signos opuestos ⇒ se oponen los sentidos ⇒ frena', ['signos opuestos', 'sentidos opuestos', 'se oponen', 'opuestos', 'frena']),
        con('el módulo de la velocidad disminuye', ['disminuye', 'se reduce', 'modulo', 'menor rapidez'])],
        errores: [] }
    },
    {
      id: 'T_grafico_xt_curvo', unidad: '2.1', tema: 'Interpretación de gráficos', dif: 2,
      afirmacion: 'Si el gráfico x = f(t) de un móvil es una curva (parábola), entonces su trayectoria es curva.',
      valor: false,
      pistas: ['¿Qué representa realmente el gráfico x = f(t)?'],
      justificacion: 'Falso. El gráfico x(t) no es la trayectoria: es la representación de cómo cambia la posición con el tiempo. ' +
        'Que sea una parábola sólo indica que el movimiento es uniformemente variado (a constante), y la trayectoria sigue siendo una recta. ' +
        'Los gráficos son "curvos" porque el eje vertical no es un eje espacial, sino la posición en función del tiempo.',
      rubrica: { conceptos: [con('el gráfico x(t) no es la trayectoria', ['no es la trayectoria', 'no representa la trayectoria']),
        con('la trayectoria es rectilínea (el movimiento es en una recta)', ['rectilinea', 'una recta', 'linea recta']),
        con('la parábola indica MRUV / aceleración constante', ['parabola', 'aceleracion constante', 'mruv', 'cuadratica'])],
        errores: [err('confunde gráfico con trayectoria', ['la trayectoria es curva', 'se mueve en curva'], 'El eje vertical del gráfico es posición, no una coordenada espacial: la trayectoria es recta.')] }
    },
    {
      id: 'T_cruce_misma_velocidad', unidad: '2.1', tema: 'Encuentros y persecuciones', dif: 2,
      afirmacion: 'Cuando dos móviles se cruzan en una ruta, necesariamente tienen la misma velocidad en ese instante.',
      valor: false,
      pistas: ['¿Qué coincide exactamente en un encuentro: posición o velocidad?'],
      justificacion: 'Falso. Lo que coincide en un encuentro es la posición y el instante: x₁(t_e) = x₂(t_e). Las velocidades pueden ser muy distintas; ' +
        'en una persecución, el que alcanza va más rápido que el alcanzado. Sólo si se cruzan con velocidades iguales se mantendrían juntos.',
      rubrica: { conceptos: [con('lo que coincide es la posición y el instante', ['misma posicion', 'coincide la posicion', 'posicion y el instante', 'coincide en un encuentro', 'mismo instante']),
        con('las velocidades pueden ser distintas', ['distintas velocidades', 'pueden ser distintas', 'velocidades pueden ser', 'no necesariamente']),
        con('en una persecución el que alcanza va más rápido', ['persecucion', 'mas rapido', 'alcanza'])],
        errores: [] }
    },
    {
      id: 'T_mruv_a_constante', unidad: '2.1', tema: 'Conceptos del MRUV', dif: 1,
      afirmacion: 'En un MRUV la aceleración es constante, por lo que el móvil siempre aumenta su rapidez.',
      valor: false,
      pistas: ['¿Puede un MRUV tener aceleración negativa respecto del movimiento?'],
      justificacion: 'Falso. En el MRUV la aceleración es constante, pero eso no implica que el móvil acelere: si la aceleración tiene sentido opuesto a la velocidad, el móvil frena (movimiento desacelerado), ' +
        'aunque siga siendo uniformemente variado. "Uniformemente variado" se refiere a que la variación de velocidad es uniforme, no a que aumente.',
      rubrica: { conceptos: [con('a constante no implica que aumente la rapidez', ['no implica', 'no siempre', 'puede frenar']),
        con('si a y v tienen distinto signo el móvil frena', ['signos opuestos', 'sentido opuesto', 'frena', 'desacelera']),
        con('uniformemente variado = variación uniforme de velocidad', ['variacion uniforme', 'uniformemente variado', 'constante'])],
        errores: [] }
    },
    {
      id: 'T_trayectoria_recta_cl', unidad: '2.2', tema: 'Conceptos del MRUV', dif: 1,
      afirmacion: 'La caída libre y el tiro vertical son casos particulares de MRUV en los que la aceleración es la gravitatoria.',
      valor: true,
      pistas: ['¿Cómo se llama el movimiento cuya trayectoria es recta y la aceleración constante?'],
      justificacion: 'Verdadero. Ambos son movimientos rectilíneos uniformemente variados: la trayectoria es una recta vertical y la aceleración es constante e igual a g ' +
        '(en módulo 9,81 m/s², dirección vertical, sentido hacia el centro de la Tierra), siempre que las alturas sean despreciables frente al radio terrestre y se desprecie el rozamiento con el aire.',
      rubrica: { conceptos: [con('trayectoria rectilínea vertical', ['rectilinea', 'vertical', 'línea recta']),
        con('aceleración constante e igual a g', ['aceleracion constante', 'g', 'gravitatori']),
        con('caso particular del MRUV', ['mruv', 'caso particular', 'uniformemente variado'])],
        errores: [] }
    },
    {
      id: 'T_distancia_vs_desplazamiento', unidad: '2.1', tema: 'Conceptos del MRUV', dif: 3,
      tipo: 'texto',
      afirmacion: 'Explicá con tus palabras la diferencia entre la distancia recorrida (longitud de trayectoria) y la componente del desplazamiento, e ilustrá con un ejemplo de un móvil con MRUV.',
      valor: null,
      pistas: ['Imaginá un móvil que frena, se detiene y vuelve.'],
      justificacion: 'La distancia recorrida (o longitud de trayectoria) es la suma de todos los caminos recorridos, siempre positiva, y no depende del sistema de referencia. ' +
        'El desplazamiento es el vector que une la posición inicial con la final: su componente puede ser positiva, negativa o nula, y en los gráficos v-t se calcula como el área con signo. ' +
        'Ejemplo: un móvil que parte con v₀ = 10 m/s y a = −2 m/s² se detiene a los 5 s tras recorrer 25 m (distancia) y luego regresa al punto de partida a los 10 s: ' +
        'en [0; 10] s el desplazamiento es 0 m, mientras que la distancia recorrida es 50 m.',
      rubrica: { conceptos: [con('la distancia es la suma de trayectoria, siempre positiva', ['siempre positiva', 'suma', 'longitud de trayectoria']),
        con('el desplazamiento es vectorial, del punto inicial al final', ['vector', 'posicion inicial', 'posicion final', 'componente']),
        con('da un ejemplo con cambio de sentido', ['cambio de sentido', 'se detiene', 'vuelve', 'regresa']),
        con('menciona que pueden coincidir si no hay cambio de sentido', ['coinciden', 'si no cambia de sentido', 'mismo sentido'])],
        errores: [err('los trata como sinónimos', ['son lo mismo', 'es lo mismo', 'es igual que el desplazamiento'], 'No son lo mismo: sólo coinciden cuando el móvil no cambia de sentido.')] }
    },
    {
      id: 'T_vacio_tubo_newton', unidad: '2.2', tema: 'Caída libre', dif: 1,
      afirmacion: 'En el vacío, dos cuerpos soltados desde la misma altura tardan el mismo tiempo en caer sólo si tienen la misma forma.',
      valor: false,
      pistas: ['¿Influye la forma cuando no hay aire?'],
      justificacion: 'Falso. Al no haber aire que oponga resistencia, la aceleración de ambos es g sin importar su forma, tamaño o masa: caen simultáneamente. ' +
        'La forma sólo importa cuando hay rozamiento con el aire.',
      rubrica: { conceptos: [con('no influye la forma ni el tamaño en el vacío', ['no influye', 'forma', 'tamano', 'independientemente']),
        con('ambos caen con la misma aceleración g', ['misma aceleracion', 'g', 'al mismo tiempo']),
        con('la forma influye sólo con aire (rozamiento)', ['rozamiento', 'aire', 'resistencia'])],
        errores: [] }
    }
  ];
  conceptuales.forEach(function (c) {
    T({ id: c.id, unidad: c.unidad, tema: c.tema, dif: c.dif, tipo: c.tipo || 'tf', gen: function () { return c; } });
  });

  /* ------------------------------------------------------------------ */
  /* Afirmaciones con datos aleatorios (V/F sobre números calculados)     */
  /* ------------------------------------------------------------------ */
  T({
    id: 'T_num_altura_maxima', unidad: '2.2', tema: 'Tiro vertical', dif: 2,
    gen: function (r, g) {
      var v0 = r.pick([10, 15, 20, 25, 30]);
      var real = (v0 * v0) / (2 * g);
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(real, 1) : FIS.round(real * r.pick([0.6, 1.5, 2]), 1);
      if (mostrado === FIS.round(real, 1)) mostrado = FIS.round(real * 2, 1);
      return {
        afirmacion: 'En un tiro vertical lanzado desde el piso con rapidez inicial de ' + f(v0, 0) + ' m/s (g = ' + f(g) + ' m/s²), ' +
          'el cuerpo alcanza una altura máxima de ' + f(mostrado) + ' m.',
        valor: Math.abs(mostrado - real) < 0.15,
        pistas: ['Usá h_máx = v₀² · 0.5 ÷ g.'],
        justificacion: 'h_máx = v₀² · 0.5 ÷ g = ' + f(v0, 0) + '²/(2·' + f(g) + ') = ' + f(real) + ' m. ' +
          'Entonces la afirmación es ' + (Math.abs(mostrado - real) < 0.15 ? '<b>verdadera</b>' : '<b>falsa</b>: el valor indicado (' + f(mostrado) + ' m) no es el correcto.'),
        rubrica: { conceptos: [con('usa h = v₀² · 0.5 ÷ g', ['v₀', '2g', 'altura maxima']),
          con('calcula el valor numérico correcto', [f(real), f(real, 1), f(real, 0), 'calcul']),
          con('compara el valor dado con el calculado', ['no coincide', 'coincide', 'es distinto', 'es verdadera', 'es falsa', 'no es el correcto'])],
          errores: [] }
      };
    }
  });

  T({
    id: 'T_num_distancia_primer_segundo', unidad: '2.1', tema: 'Conceptos del MRUV', dif: 2,
    gen: function (r, g) {
      var a = r.pick([2, 4, 5, 6]);
      var real = 0.5 * a;
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(real, 1) : FIS.round(a, 1);
      return {
        afirmacion: 'Un móvil que parte del reposo con aceleración constante de ' + f(a, 0) + ' m/s² recorre ' + f(mostrado, 1) + ' m durante el primer segundo.',
        valor: Math.abs(mostrado - real) < 0.05,
        pistas: ['Con v₀ = 0: ∆x = 0.5·a·t² con t = 1 s.'],
        justificacion: '∆x = 0.5·a·t² = 0.5·' + f(a, 0) + '·(1 s)² = ' + f(real) + ' m. La afirmación es ' +
          (Math.abs(mostrado - real) < 0.05 ? '<b>verdadera</b>' : '<b>falsa</b>: en el primer segundo recorre ' + f(real) + ' m, no ' + f(mostrado, 1) + ' m (confundir 0.5·a·t² con a·t es un error frecuente).'),
        rubrica: { conceptos: [con('usa ∆x = 0.5·a·t²', ['0.5', '1/2', 'a t', 'cuadratica']),
          con('con t = 1 s', ['1 s', 'primer segundo']),
          con('el resultado correcto es 0.5·a', [f(real, 1), f(real, 0)])],
          errores: [err('confunde con a·t² o con la velocidad', ['a por t', 'aceleracion por tiempo', 'recorre a'], 'La distancia en el primer segundo es 0.5·a, no a.')] }
      };
    }
  });

  T({
    id: 'T_num_rapidez_impacto', unidad: '2.2', tema: 'Caída libre', dif: 2,
    gen: function (r, g) {
      var H = r.pick([20, 45, 80, 125]);
      var real = Math.sqrt(2 * g * H);
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(real, 1) : FIS.round(real * r.pick([0.5, 1.5, 2]), 1);
      if (Math.abs(mostrado - real) < 0.2) mostrado = FIS.round(real * 1.5, 1);
      return {
        afirmacion: 'Un cuerpo que cae libremente desde ' + f(H, 0) + ' m de altura llega al piso con una rapidez de ' + f(mostrado, 1) + ' m/s (g = ' + f(g) + ' m/s²).',
        valor: Math.abs(mostrado - real) < 0.2,
        pistas: ['Usá v² = 2·g·h.'],
        justificacion: 'v = √(2·g·h) = √(2·' + f(g) + '·' + f(H, 0) + ') = ' + f(real) + ' m/s. ' +
          'Ese valor es una <b>rapidez</b> (módulo de la velocidad de llegada), no un tiempo de caída. ⇒ la afirmación es ' +
          (Math.abs(mostrado - real) < 0.2 ? '<b>verdadera</b>' : '<b>falsa</b>: el valor correcto es ' + f(real) + ' m/s.'),
        rubrica: { conceptos: [con('usa v = √(2gh)', ['√', '2·g·h', '2gh', 'raiz']),
          con('valor correcto ' + f(real, 1) + ' m/s', [f(real), f(real, 1), f(real, 0)]),
          con('distingue rapidez de tiempo de caída', ['rapidez', 'no es el tiempo', 'no un tiempo'])],
          errores: [] }
      };
    }
  });

  T({
    id: 'T_num_tiempo_caida', unidad: '2.2', tema: 'Caída libre', dif: 2,
    gen: function (r, g) {
      var H = r.pick([20, 45, 80, 125, 180]);
      var real = Math.sqrt(2 * H / g);
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(real, 1) : FIS.round(Math.sqrt(2 * H / (2 * g)), 1);
      if (Math.abs(mostrado - real) < 0.2) mostrado = FIS.round(real + 1, 1);
      return {
        afirmacion: 'Un cuerpo soltado desde ' + f(H, 0) + ' m de altura tarda ' + f(mostrado, 1) + ' s en llegar al piso (g = ' + f(g) + ' m/s²).',
        valor: Math.abs(mostrado - real) < 0.2,
        pistas: ['h = 0.5·g·t².'],
        justificacion: 't = √(2h/g) = √(2·' + f(H, 0) + '/' + f(g) + ') = ' + f(real) + ' s ⇒ la afirmación es ' +
          (Math.abs(mostrado - real) < 0.2 ? '<b>verdadera</b>' : '<b>falsa</b>: el tiempo correcto es ' + f(real) + ' s.'),
        rubrica: { conceptos: [con('usa t = √(2h/g)', ['2h/g', 'raiz', 'despeja']),
          con('valor correcto ' + f(real, 1) + ' s', [f(real, 0), f(real, 1)])],
        errores: [err('olvida el factor 2 y calcula √(h/g)', ['raiz de h/g', '√(h/g)', 'raiz(h/g)'], 'Revisá el despeje: es t = √(2h/g).')] }
      };
    }
  });

  T({
    id: 'T_num_encuentro_mru', unidad: '2.1', tema: 'Encuentros y persecuciones', dif: 2,
    gen: function (r, g) {
      var d0 = r.int(5, 20) * 10;
      var vA = r.int(10, 25);
      var vB = vA + r.int(2, 10);
      var real = d0 / (vB - vA);
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(real, 2) : FIS.round(d0 / (vA + vB), 2);
      if (Math.abs(mostrado - real) < 0.05) mostrado = FIS.round(real * 2, 2);
      return {
        afirmacion: 'Un auto que va a ' + f(vA, 0) + ' m/s es perseguido por otro que va a ' + f(vB, 0) + ' m/s, ' + f(d0, 0) +
          ' m más atrás. Se encuentran a los ' + f(mostrado) + ' s.',
        valor: Math.abs(mostrado - real) < 0.05,
        pistas: ['En un alcance la velocidad relativa es la diferencia de velocidades.'],
        justificacion: 't = d₀/(v_B − v_A) = ' + f(d0, 0) + '/(' + f(vB, 0) + ' − ' + f(vA, 0) + ') = ' + f(real) + ' s. ' +
          'Se divide por la diferencia (resta) de velocidades porque van en el mismo sentido. ⇒ ' +
          (Math.abs(mostrado - real) < 0.05 ? '<b>verdadera</b>' : '<b>falsa</b>: el tiempo correcto es ' + f(real) + ' s. ' +
            'El valor mostrado corresponde a dividir por la suma de velocidades, que se usa sólo cuando van al encuentro de frente.'),
        rubrica: { conceptos: [con('usa la diferencia de velocidades (mismo sentido)', ['resta', 'diferencia', 'velocidad relativa']),
          con('valor correcto ' + f(real, 1) + ' s', [f(real, 0), f(real, 1), f(real, 2)]),
          con('distingue persecución de encuentro frontal', ['de frente', 'mismo sentido', 'suma', 'resta'])],
          errores: [] }
      };
    }
  });

  T({
    id: 'T_num_encuentro_vertical', unidad: '2.2', tema: 'Encuentros verticales', dif: 3,
    gen: function (r, g) {
      var H = r.int(10, 40);
      var v1 = r.int(5, 15);
      var v2 = r.int(5, 15);
      var real = H / (v1 + v2);
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(real, 2) : FIS.round(Math.sqrt(2 * H / g), 2);
      if (Math.abs(mostrado - real) < 0.05) mostrado = FIS.round(real * 1.5, 2);
      return {
        afirmacion: 'Una piedra se lanza hacia arriba a ' + f(v1, 0) + ' m/s y simultáneamente otra se lanza hacia abajo desde ' + f(H, 0) +
          ' m más arriba con ' + f(v2, 0) + ' m/s. Se cruzan a los ' + f(mostrado) + ' s.',
        valor: Math.abs(mostrado - real) < 0.05,
        pistas: ['Al plantear las ecuaciones, los términos cuadráticos se cancelan.'],
        justificacion: 'Igualando y₁ = y₂ los términos −0.5g t² se cancelan y queda v₁·t = H − v₂·t ⇒ t = H/(v₁ + v₂) = ' +
          f(H, 0) + '/(' + f(v1, 0) + ' + ' + f(v2, 0) + ') = ' + f(real) + ' s ⇒ la afirmación es ' + (Math.abs(mostrado - real) < 0.05 ? '<b>verdadera</b>' : '<b>falsa</b>') + '. ' +
          'Notar que g no interviene en el tiempo de encuentro.',
        rubrica: { conceptos: [con('plantea y₁(t) = y₂(t)', ['igualo', 'igualando', 'misma posicion', 'y₁', 'y₂']),
          con('los términos de g se cancelan (g no influye)', ['se cancelan', 'no influye', 'se simplifica']),
          con('usó t = H/(v₁+v₂)', ['suma de velocidades', 'v₁ + v₂', 'v₁+v₂']),
          con('valor correcto ' + f(real, 1) + ' s', [f(real, 0), f(real, 1), f(real, 2)])],
          errores: [] }
      };
    }
  });

  T({
    id: 'T_num_area_vt', unidad: '2.1', tema: 'Interpretación de gráficos', dif: 2,
    gen: function (r, g) {
      var v0 = r.int(4, 20);
      var a = r.pick([1, 2, 2.5, 3, 4]);
      var t = r.int(3, 8);
      var real = v0 * t + 0.5 * a * t * t;
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(real, 1) : FIS.round(v0 * t, 1);
      if (Math.abs(mostrado - real) < 0.5) mostrado = FIS.round(0.5 * a * t * t, 1);
      return {
        afirmacion: 'Un móvil con v₀ₓ = ' + f(v0, 0) + ' m/s y aₓ = ' + f(a) + ' m/s² recorre en los primeros ' + t +
          ' s una distancia de ' + f(mostrado, 1) + ' m.',
        valor: Math.abs(mostrado - real) < 0.5,
        pistas: ['Área bajo v(t): rectángulo + triángulo, o la ecuación horaria.'],
        justificacion: '∆x = v₀·t + 0.5·a·t² = ' + f(v0, 0) + '·' + t + ' + 0.5·' + f(a) + '·' + t + '² = ' + f(real) + ' m. ' +
          'Geométricamente es el área bajo el gráfico v(t): un rectángulo (v₀·t) más un triángulo (0.5·a·t²). ⇒ la afirmación es ' +
          (Math.abs(mostrado - real) < 0.5 ? '<b>verdadera</b>' : '<b>falsa</b>: ' + f(mostrado, 1) + ' m corresponde a olvidar el aporte de la aceleración (v₀·t).'),
        rubrica: { conceptos: [con('usa ∆x = v₀t + 0.5at²', ['v0 t', '0.5', '1/2', 'at²']),
          con('interpreta el área del gráfico v(t)', ['area', 'rectangulo', 'triangulo', 'trapecio']),
          con('valor correcto ' + f(real, 1) + ' m', [f(real, 0), f(real, 1)])],
          errores: [] }
      };
    }
  });

  T({
    id: 'T_num_regreso_a_punto', unidad: '2.1', tema: 'Conceptos del MRUV', dif: 3,
    gen: function (r, g) {
      var v0 = r.int(6, 20);
      var a = r.pick([1, 2, 2.5, 4]);
      var tDet = v0 / a;
      var tReg = 2 * tDet;
      var dMax = (v0 * v0) / (2 * a);
      var correcta = r.bool();
      var mostrado = correcta ? FIS.round(2 * dMax, 1) : FIS.round(dMax, 1);
      if (Math.abs(mostrado - 2 * dMax) < 0.2) mostrado = FIS.round(3 * dMax, 1);
      return {
        afirmacion: 'Un móvil que pasa por un punto A con rapidez de ' + f(v0, 0) + ' m/s e inmediatamente frena con aceleración de módulo ' +
          f(a) + ' m/s² vuelve a pasar por A (en sentido contrario) y para entonces ha recorrido una distancia total de ' + f(mostrado, 1) + ' m.',
        valor: Math.abs(mostrado - 2 * dMax) < 0.2,
        pistas: ['Calcule la distancia máxima y duplíquela.'],
        justificacion: 'Se detiene a los t = v₀/a = ' + f(tDet) + ' s tras recorrer d = v₀²/(2a) = ' + f(dMax) + ' m. Como la trayectoria de vuelta es simétrica, ' +
          'la distancia total hasta volver a A es 2·d = ' + f(2 * dMax) + ' m (el desplazamiento en cambio es nulo). ⇒ la afirmación es ' +
          (Math.abs(mostrado - 2 * dMax) < 0.2 ? '<b>verdadera</b>' : '<b>falsa</b>: sería ' + f(2 * dMax) + ' m, no ' + f(mostrado, 1) + ' m.'),
        rubrica: { conceptos: [con('calcula la distancia máxima v₀²/(2a)', ['v0', '2a', 'maxima distancia']),
          con('duplica por simetría', ['el doble', '2·d', 'duplica', 'simetr']),
          con('distingue distancia de desplazamiento (desplazamiento nulo)', ['desplazamiento nulo', 'desplazamiento', 'distancia total'])],
          errores: [err('informa sólo la distancia máxima', ['solo la distancia maxima'], 'Al volver al punto de partida la distancia recorrida es el doble.')] }
      };
    }
  });

})(typeof globalThis !== 'undefined' ? globalThis : this);
