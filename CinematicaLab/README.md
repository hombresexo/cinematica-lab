

---

## 13. Representaciones pictóricas y formato numérico

Las representaciones pictóricas ya no se muestran solamente como una explicación textual. Cada problema presenta un esquema SVG con el objeto de estudio, el origen, el eje elegido, el sentido positivo, el vector velocidad y el vector aceleración. El mismo esquema aparece dentro de las herramientas metodológicas de las resoluciones, junto con la explicación escrita.

El contenido visible evita la notación de fracciones simples. Por ejemplo, el coeficiente de la aceleración se muestra como `0.5 · a · t²`, la conversión de km/h usa `0.2778 m/s` y las divisiones necesarias se expresan con el operador `÷`. Las cantidades calculadas continúan mostrándose como números decimales con unidades.

La prueba específica `tests/pictorico_decimales.html` verifica que aparezca el SVG, que las herramientas lo incluyan y que no queden símbolos `½` ni `1/3,6` en el contenido del problema. Resultado: **0 errores**.
