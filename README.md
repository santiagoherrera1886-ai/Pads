# PADS Audience Lab · JGB

Plataforma independiente de planeación de audiencias para PADS JGB en Colombia. Diseño **A · Skin Lab**: marfil, lavanda y salvia; empaques originales y fotografías ilustrativas.

Sitio: https://pads-fawn.vercel.app/

Repositorio: https://github.com/santiagoherrera1886-ai/Pads

## Secciones funcionales

- Resumen: universo nacional de comunicación de 30 M, precio analizado por separado y enfoque de 18+ para todos los géneros.
- Universo: base nacional de 30 M, proyección adulta DANE 2027, cálculo digital, fuentes desplegables y análisis separado del precio de $80.000.
- Audiencias: cinco contextos del brief ampliados a hombres y mujeres, búsqueda, mensajes, señales sugeridas y exportación CSV contextual.
- Productos: Pads de limpieza y Pads Control Poros, comparativa y navegación al público o medio correspondiente.
- Medios: guías contextuales de Meta, YouTube, TikTok, Pinterest y CTV, con selección de público/producto, fuentes y copia/descarga.
- Colombia: contorno nacional y cinco clústeres por afinidad, sin segmentación por ciudades.
- Simulador: reparto exclusivo entre solo limpieza, ambas líneas y solo Control Poros; inversión, CPM y mezcla editables; 12 olas, alcance deduplicado, frecuencia, persistencia local y CSV.

Universo, Audiencias y Simulador incorporan la vista premium **Dos productos · Cuatro audiencias**: Pads normales (**6 M compradores actuales + 7 M personas nuevas = 13 M** de categoría supuesta), Control Poros (**1,5 M compradores actuales + 4,5 M personas nuevas = 6 M**, solo ejemplo editable) y **hasta 10% de overlap entre líneas**, aplicado a la base menor. Ejemplo: 600.000 personas compartidas, para un total de **18,4 M únicos** entre las dos bases, frente a los **30 M de comunicación nacional**, que permanecen intactos. Estos valores NO son penetración medida ni públicos verificados por plataformas. Se editan por separado y persisten en el navegador con la clave `pads-product-audiences-v1`.

El diagrama ilustra el cruce sin escalar las áreas de los círculos. En cada producto, comprador actual y audiencia nueva se excluyen; entre productos una persona puede ser comprador actual de una línea y nueva para la otra. La matriz 2×2 distribuye proporcionalmente el cruce como supuesto, sin deduplicación empírica. Se exportan el resumen de productos, la intersección y los territorios editoriales.

Los cinco clústeres se trabajan como **premium beauty y skincare**: Beauty after work, Self-care sofisticado, Active beauty, Beauty on the go y Beauty discovery 18+. Cada uno presenta afinidades distintas para los cuatro grupos (actuales/nuevos × Pads/Control Poros); estas etiquetas son ideas editoriales para validar en el selector real de medios. Se retiró del discurso de segmentación el foco en compras baratas.

**Importante:** el simulador existente de inversión/CPM/12 olas es un modelo independiente de alcance en medios. Conserva su sensibilidad del 10% de intersección entre **estrategias de pauta**, aplicado a la suma de alcances, aparte del overlap de **universos de producto** mostrado arriba. Los dos conceptos no deben sumarse directamente. [Metodología anterior del modelo de pauta](docs/buyer-segments.md).

## Datos y límites

El universo nacional de comunicación es **30 millones**, Colombia 18+, sin límite superior, todos los géneros. Parte de 39.721.750 adultos proyectados por DANE para 2027 y 33,27 M de potencial digital estimado al aplicar tasas TIC 2025 por edad constantes. Para 18–24 se aproxima con la tasa publicada de 12–24. Los 30 M incorporan un margen de planeación; no representan compradores ni alcance garantizado. [Método y fuentes](docs/market-methodology.md).

La referencia económica es un cálculo independiente: adultos 2027 × 41,3% de clase media/alta en todas las edades de 2025 ≈ 16,41 M. No cruza edad, ingresos e internet ni mide capacidad efectiva de compra. Las sensibilidades de 20%, 35% y 50% son hipótesis. El precio de $80.000 tiene SKU y recompra por confirmar; no se aplica automáticamente al algodón.

El simulador abre con 30 M compartidos para comunicación entre ambas líneas, presupuesto $100 M y CPM $8.000 supuestos. La compra de los dos productos no se presupone. Desde Universo se puede aplicar esa base o una hipótesis de precio explícita a Control Poros. El alcance depende de presupuesto y CPM. Los escenarios personalizados se conservan; el anterior ejemplo de 3 M se migra preservando sus supuestos de medios.

El brief anterior contiene 13,7 M, $400 M y packs Cuadrados/Redondos. No se trasladan esas cifras al nuevo proyecto. El PDF describe usos con diferencias de frecuencia, por lo que no se publican indicaciones de aplicación ni promesas clínicas adicionales.

## Ejecutar

Sitio estático, sin dependencias de aplicación ni servidor de datos:

```sh
python3 -m http.server 4174
npm test
```

Abrir la raíz del servidor. No abrir directamente con file:// porque se utilizan módulos JavaScript.

Vercel: framework Other, raíz del repositorio, sin instalación ni compilación, salida `.`. La configuración está en `vercel.json`. GitHub está conectado al proyecto Vercel `pads`, independiente de Ritual.

## Archivos

- `index.html`, `styles.css`, `app.js`: interfaz, diseño responsive, interacción y exportaciones.
- `src/brief.js`: productos, públicos y medios; páginas del brief de origen.
- `src/guides.js`: guías de activación y fuentes.
- `src/universe.js`, `src/simulation.js`: modelo y deduplicación.
- `src/product-audiences.js`, `src/product-audience-view.js`: universos por producto, cuatro públicos, overlap máximo de 10%, matriz y activación beauty.
- `src/buyer-segments.js`, `src/buyer-view.js`: modelo previo conservado para sensibilidad de alcance en medios.
- `tests/`: pruebas del universo y simulador.
- `assets/SOURCES.md`: procedencia de los recursos.
- `docs/implementation.md`: decisiones y verificación.

## Vista publicada

![PADS Skin Lab A](docs/PADS_Skin_Lab_A.jpg)
