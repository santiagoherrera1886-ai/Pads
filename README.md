# PADS Audience Lab · JGB

Plataforma independiente de planeación de audiencias para PADS JGB en Colombia. Diseño **A · Skin Lab**, aprobado por Santiago el 6 de octubre de 2026: marfil, lavanda y salvia; empaques originales y fotografías ilustrativas.

Sitio: https://pads-fawn.vercel.app/

Repositorio: https://github.com/santiagoherrera1886-ai/Pads

## Secciones funcionales

- Resumen: universo de 7 millones únicos, filtros por línea y tarjetas de producto y audiencia.
- Audiencias: cinco perfiles del brief, búsqueda, mensajes, señales sugeridas y exportación CSV contextual.
- Productos: Pads de limpieza y Pads Control Poros, comparativa y navegación al público o medio correspondiente.
- Medios: guías contextuales de Meta, YouTube, TikTok, Pinterest y CTV, con selección de público/producto, fuentes y copia/descarga.
- Colombia: mapa continental con siete ciudades seleccionables, sin cifras geográficas inventadas.
- Simulador: reparto exclusivo entre solo limpieza, ambas líneas y solo Control Poros; inversión, CPM y mezcla editables; 12 olas, alcance deduplicado, frecuencia, persistencia local y CSV.

## Datos y límites

El universo de **7.000.000** fue definido por el usuario para este proyecto. No es un censo ni alcance medido. No hay datos aprobados de reparto por producto, tribu o ciudad. Las cinco audiencias pueden cruzarse. Los temas de segmentación son hipótesis editoriales; no son IDs de intereses confirmados.

El simulador inicia con un **ejemplo explícitamente ilustrativo**: 3,5 M solo limpieza, 1,4 M ambas líneas y 2,1 M solo Control Poros; $100 M COP, CPM $8.000 COP y mezcla 60/40. Ninguna de estas asignaciones es un presupuesto aprobado o benchmark. Se verifican 101 mezclas posibles, inversión cero, límites del universo y validación de entradas.

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
