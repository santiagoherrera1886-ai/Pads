# PADS Audience Lab · JGB

Plataforma independiente de planeación de audiencias para PADS JGB en Colombia. Diseño **A · Skin Lab**: marfil, lavanda y salvia; empaques originales y fotografías ilustrativas.

Sitio: https://pads-fawn.vercel.app/

Repositorio: https://github.com/santiagoherrera1886-ai/Pads

## Secciones funcionales

- Resumen: precio de referencia de $80.000 y enfoque para hombres y mujeres, filtros por línea y tarjetas de producto y audiencia.
- Universo: referencia demográfica DANE, aproximación económica y sensibilidad explícita a supuestos.
- Audiencias: cinco contextos del brief ampliados a hombres y mujeres, búsqueda, mensajes, señales sugeridas y exportación CSV contextual.
- Productos: Pads de limpieza y Pads Control Poros, comparativa y navegación al público o medio correspondiente.
- Medios: guías contextuales de Meta, YouTube, TikTok, Pinterest y CTV, con selección de público/producto, fuentes y copia/descarga.
- Colombia: mapa continental con siete ciudades seleccionables, sin cifras geográficas inventadas.
- Simulador: reparto exclusivo entre solo limpieza, ambas líneas y solo Control Poros; inversión, CPM y mezcla editables; 12 olas, alcance deduplicado, frecuencia, persistencia local y CSV.

## Datos y límites

No hay una cifra validada de compradores. La base DANE es 39.236.663 adultos en 2026; aplicar el 41,3% de clase media/alta de todas las edades de 2025 da una aproximación de 16,2 M. Este cálculo supone la misma proporción por edad y estabilidad temporal: no es un cruce de microdatos ni capacidad o intención de compra observada. Ver [metodología](docs/market-methodology.md).

El precio de referencia es $80.000 por unidad, con SKU y recompra por confirmar. Las sensibilidades de 20%, 35% y 50% son hipótesis, no pronósticos. El simulador permite cualquier reparto válido y abre con 3 M exclusivamente demostrativos (1,5 M / 0,6 M / 0,9 M), presupuesto $100 M y CPM $8.000 supuestos. Desde Universo puede transferirse una hipótesis a Control Poros, con ese supuesto de SKU explícito.

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
- `tests/`: pruebas del universo y simulador.
- `assets/SOURCES.md`: procedencia de los recursos.
- `docs/implementation.md`: decisiones y verificación.

## Vista publicada

![PADS Skin Lab A](docs/PADS_Skin_Lab_A.jpg)
