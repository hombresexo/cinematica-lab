/* =========================================================================
   Resumen teórico — síntesis de las guías de la cátedra (UTN FRA)
   ========================================================================= */
(function (root) {
  'use strict';
  var FIS = root.FIS;

  FIS.teoria = [
    {
      id: 'metodo', titulo: 'Herramientas metodológicas (cómo encarar cualquier problema)',
      html:
        '<ol class="pasos-metodo">' +
        '<li><b>Representación pictórica:</b> dibujá la situación (esquema) con los móviles, el sentido de las velocidades y las alturas.</li>' +
        '<li><b>Objeto de estudio (OE):</b> si hay dos o más móviles, trabajá con uno por vez (OE₁, OE₂, …) y escribí una ecuación por cada uno.</li>' +
        '<li><b>Modelización:</b> se trabaja con partículas, sin rozamiento con el aire.</li>' +
        '<li><b>Marco de referencia y sistema de coordenadas (SC):</b> elegí origen y sentido positivo; indicá si el semieje positivo apunta hacia arriba o hacia abajo. ' +
        '<span class="destacado">Esto decide el signo de g, no el movimiento del cuerpo.</span></li>' +
        '<li><b>Evento inicial:</b> elegí el instante t₀ = 0 (por ejemplo, el momento del lanzamiento).</li>' +
        '<li><b>Ecuaciones horarias:</b> escribí a(t), v(t) y x(t) (o y(t)) para cada móvil.</li>' +
        '<li><b>Resolver:</b> igualá posiciones para los encuentros; usá la ecuación complementaria cuando no interese el tiempo.</li>' +
        '<li><b>Interpretar:</b> analizá los signos, si hay cambio de sentido, y compará el resultado con el gráfico.</li>' +
        '</ol>'
    },
    {
      id: 'mruv', titulo: 'MRUV: ecuaciones horarias y gráficos',
      html:
        '<p class="formula">aₓ(t) = constante</p>' +
        '<p class="formula">vₓ(t) = v₀ₓ + aₓ · (t − t₀)</p>' +
        '<p class="formula">x(t) = x₀ + v₀ₓ · (t − t₀) + 0.5 · aₓ · (t − t₀)²</p>' +
        '<p class="formula">vₓ² − v₀ₓ² = 2 · aₓ · (x − x₀)  <span class="chico">(ecuación complementaria: se usa cuando no interesa el tiempo)</span></p>' +
        '<table class="tabla"><thead><tr><th>Gráfico</th><th>Qué se lee</th></tr></thead><tbody>' +
        '<tr><td>aₓ = f(t)</td><td>Es una recta horizontal. El <b>área</b> encerrada equivale a la variación de velocidad (∆vₓ = aₓ·∆t).</td></tr>' +
        '<tr><td>vₓ = f(t)</td><td>Es una recta cuya <b>pendiente</b> es aₓ. El <b>área con signo</b> bajo la curva es la componente del desplazamiento ∆x.</td></tr>' +
        '<tr><td>x = f(t)</td><td>Es una parábola: la <b>pendiente de la tangente</b> en un instante es vₓ, y la <b>concavidad</b> (∪ o ∩) indica el sentido de aₓ. ' +
        '<span class="destacado">No es la trayectoria: el móvil se mueve en línea recta.</span></td></tr>' +
        '</tbody></table>' +
        '<p><b>Acelerado o desacelerado:</b> si vₓ y aₓ tienen el mismo signo, el móvil aumenta su rapidez; si tienen signos opuestos, la disminuye (frena), aunque siga siendo MRUV.</p>' +
        '<p><b>Desplazamiento vs. distancia:</b> ∆x = x_final − x_inicial (con signo). La distancia o longitud de trayectoria se calcula sumando los tramos en valor absoluto: ' +
        'si hay cambio de sentido, hay que separar el movimiento en etapas.</p>'
    },
    {
      id: 'encuentros', titulo: 'Encuentros y persecuciones',
      html:
        '<p>Se escribe la ecuación horaria de <b>cada</b> móvil y se impone la condición de encuentro: <span class="eq">x₁(t_e) = x₂(t_e)</span>. ' +
        'El tiempo t_e hallado se reemplaza en cualquiera de las dos ecuaciones para obtener la posición del encuentro.</p>' +
        '<table class="tabla"><thead><tr><th>Situación</th><th>Planteo</th><th>Tiempo de encuentro</th></tr></thead><tbody>' +
        '<tr><td>MRU + MRU, mismo sentido (alcance)</td><td>v₂·t = d₀ + v₁·t</td><td>t = d₀ / (v₂ − v₁)</td></tr>' +
        '<tr><td>MRU + MRU, sentidos opuestos</td><td>v₁·t = d₀ − v₂·t</td><td>t = d₀ / (v₁ + v₂)</td></tr>' +
        '<tr><td>MRUV + MRUV</td><td>d₀ + v_A·t + 0.5·a_A·t² = v_B·t + 0.5·a_B·t²</td><td>se resuelve la cuadrática y se toma la raíz positiva</td></tr>' +
        '<tr><td>Encuentro vertical (uno sube, otro baja)</td><td>v₁·t = H − v₂·t</td><td>t = H / (v₁ + v₂) &nbsp;<span class="chico">(los términos de g se cancelan)</span></td></tr>' +
        '</tbody></table>' +
        '<p class="destacado">En un encuentro coinciden la posición y el instante, no las velocidades.</p>'
    },
    {
      id: 'verticales', titulo: 'Caída libre y tiro vertical',
      html:
        '<p>Son MRUV con trayectoria vertical y aceleración gravitatoria. En las cercanías de la superficie terrestre: ' +
        '<span class="eq">|g| = 9,8 m/s² ≈ 9,81 m/s²</span>, dirección vertical y sentido hacia el centro de la Tierra.</p>' +
        '<p><b>Caída libre (CL):</b> el cuerpo se suelta, v₀ᵧ = 0. <b>Tiro vertical (TV):</b> se lanza con v₀ᵧ ≠ 0 (hacia arriba o hacia abajo).</p>' +
        '<p class="formula">y(t) = y₀ + v₀ᵧ · (t − t₀) ± 0.5 · g · (t − t₀)²</p>' +
        '<p class="formula">vᵧ(t) = v₀ᵧ ± g · (t − t₀)</p>' +
        '<p class="formula">aᵧ = ∓ g</p>' +
        '<p><b>El signo de g</b> depende del sistema de referencia: si el semieje positivo de ordenadas apunta hacia arriba, g entra con signo negativo; ' +
        'si apunta hacia abajo, con signo positivo. No depende de si el cuerpo sube o baja.</p>' +
        '<table class="tabla"><thead><tr><th>Resultado útil</th><th>Expresión</th></tr></thead><tbody>' +
        '<tr><td>Tiempo de caída desde altura h (CL)</td><td>t = √(2h/g)</td></tr>' +
        '<tr><td>Rapidez de llegada al piso (CL)</td><td>|v| = √(2gh)</td></tr>' +
        '<tr><td>Altura máxima (TV desde el punto de lanzamiento)</td><td>h_máx = v₀² · 0.5 ÷ g &nbsp;&nbsp; y&nbsp;&nbsp; t_subida = v₀/g</td></tr>' +
        '<tr><td>Tiempo total de vuelo</td><td>t = 2·v₀/g</td></tr>' +
        '<tr><td>Igual altura, igual rapidez</td><td>en el ascenso y en el descenso, al pasar por la misma altura la rapidez es la misma (los sentidos son opuestos)</td></tr>' +
        '</tbody></table>' +
        '<p class="destacado">En el punto más alto de un tiro vertical: vᵧ = 0 pero aᵧ = g ≠ 0. La aceleración nunca se anula.</p>'
    },
    {
      id: 'errores', titulo: 'Errores frecuentes (¡ojo!)',
      html:
        '<ul class="lista-errores">' +
        '<li>Creer que en el vacío no hay gravedad (sí hay: lo que no hay es aire).</li>' +
        '<li>Pensar que la aceleración cambia de signo cuando el móvil sube y luego baja: sólo cambia el signo de la <i>velocidad</i>.</li>' +
        '<li>Suponer que "MRUV" significa que el móvil siempre acelera: puede frenar si a y v tienen signos opuestos.</li>' +
        '<li>Confundir el gráfico x(t) con la trayectoria del móvil.</li>' +
        '<li>Mezclar rapidez (módulo, siempre ≥ 0) con velocidad (magnitud vectorial con signo).</li>' +
        '<li>Usar la fórmula de encuentro frontal cuando los móviles van en el mismo sentido (o viceversa).</li>' +
        '<li>Olvidar que al soltarse desde un globo o un montacargas en movimiento, el cuerpo conserva la velocidad de ese móvil.</li>' +
        '<li>Calcular la distancia recorrida como si fuera el desplazamiento cuando el móvil cambia de sentido.</li>' +
        '</ul>'
    },
    {
      id: 'u11', titulo: 'Unidad 1.1 — Magnitudes, unidades y vectores',
      html: '<p>Una magnitud física se expresa con un número y una unidad. En el SI las unidades fundamentales incluyen metro (m), kilogramo (kg) y segundo (s); las derivadas combinan fundamentales.</p>' +
        '<p class="formula">1 km = 1000 m · 1 min = 60 s · 1 km/h = 0.2778 m/s</p>' +
        '<p>Las magnitudes escalares sólo tienen módulo; las vectoriales necesitan módulo, dirección y sentido. Para un vector de módulo A y ángulo θ:</p>' +
        '<p class="formula">Aₓ = A·cos θ &nbsp;&nbsp; Aᵧ = A·sen θ &nbsp;&nbsp; A = √(Aₓ² + Aᵧ²)</p>'
    },
    {
      id: 'u12', titulo: 'Unidad 1.2 — Posición, desplazamiento y trayectoria',
      html: '<p>Todo movimiento se describe respecto de un marco de referencia y un sistema de coordenadas. La posición indica dónde está el móvil; la trayectoria es la línea geométrica que recorre.</p>' +
        '<p class="formula">∆r = r_f − r_i &nbsp;&nbsp; |∆r| = módulo del desplazamiento</p>' +
        '<p>La distancia total recorrida o longitud de trayectoria suma todos los tramos en valor absoluto. Si hay cambio de sentido, generalmente <b>distancia total ≠ módulo del desplazamiento</b>.</p>'
    },
  ];
})(typeof globalThis !== 'undefined' ? globalThis : this);
