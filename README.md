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

**Universo de categoría combinado con límite estricto: 7 millones de personas únicas entre ambas líneas**, después del overlap. El escenario predeterminado parte de **Pads normales: 4,5 M** (2,1 M compradores actuales + 2,4 M audiencia nueva) y **Pads Control Poros: 2,5 M** (600.000 compradores actuales + 1,9 M nueva audiencia). Con **10% de overlap de la audiencia menor**, comparten 250.000 personas y la suma deduplicada es **6,75 M únicos**; con overlap del 0%, alcanza exactamente 7 M. Cualquier edición que supere 7 M únicos se rechaza con aviso, sin guardar el valor inválido. No son cifras medidas de compradores.

**Cinco perfiles beauty vinculados a los universos de origen**: Vida laboral / Beauty after work, Madres y padres / Self-care sofisticado, Deportistas / Active beauty, Viajes / Beauty on the go, Estudiantes / Beauty discovery 18+. Cada tarjeta incluye cuatro tamaños de público (compradores actuales y nueva audiencia de cada producto) calculados a partir de participaciones hipotéticas. Al abrirla se ven los intereses premium de cada combinación, qué porcentaje representa de su cohorte nacional, medios, búsquedas de contenido y enfoque creativo. Una matriz de reconciliación debajo de las tarjetas muestra el total por fila y columna. Los perfiles son una **asignación primaria excluyente únicamente para modelado**, mientras los intereses en la realidad pueden coexistir, de modo que no se afirma un tamaño medido para cada interés ni se garantiza su disponibilidad en la plataforma.

La matriz también asigna a cada perfil una participación del overlap entre líneas, con la deduplicación calculada una sola vez, y permite exportar cantidades e intereses a CSV. Los tamaños del escenario se conservan en el navegador mediante `pads-product-audiences-v1`; los escenarios guardados antes de este máximo de 7 M se restablecen al nuevo ejemplo cuando ya no sean válidos.

**Distinción metodológica**: los 30 M son un potencial nacional amplio de comunicación (no compradores de la categoría). El simulador existente de medios, CPM y 12 olas sigue siendo una herramienta de alcance con base editable, independiente del dimensionamiento de categoría de hasta 7 M. Su supuesto anterior de cruce de pauta sobre la suma de alcances no sustituye ni se suma al overlap de universos de producto. [Metodología de medios](docs/buyer-segments.md).

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
- `src/cluster-intelligence.js`, `src/cluster-view.js`: asignación de los cuatro universos a cinco perfiles, matriz y despliegue detallado de intereses.
- `src/buyer-segments.js`, `src/buyer-view.js`: modelo previo conservado para sensibilidad de alcance en medios.
- `tests/`: pruebas del universo y simulador.
- `assets/SOURCES.md`: procedencia de los recursos.
- `docs/implementation.md`: decisiones y verificación.

## Vista publicada

![PADS Skin Lab A](docs/PADS_Skin_Lab_A.jpg)
