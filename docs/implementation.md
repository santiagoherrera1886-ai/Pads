# Implementación de la opción A · 6 de octubre de 2026

El usuario eligió la opción A y creó el repositorio `santiagoherrera1886-ai/Pads` y el proyecto Vercel `pads`. No modificar Ritual ni usar sus cifras o perfiles.

## Flujo

El visitante navega en una aplicación estática: menú o tarjeta → estado de ruta/filtro → datos locales del brief/modelo → ficha, guía o escenario. No hay backend, cuentas publicitarias conectadas, API keys ni login propio.

## Diseño

Inter local para lectura y Georgia para títulos editoriales. Base marfil, texto ciruela, selección lavanda y contraste salvia para la segunda línea. Hero con PNG originales de los empaques sobre un ambiente ilustrativo. Tarjetas con cinco retratos diferentes. Todas las acciones visibles de navegación abren su vista o detalle; el menú móvil es desplegable.

## Datos y guías

Fuente: Estrategia de comunicación PADs JGB V2(1).pdf (28 páginas), especialmente pp. 13, 17–24 y 26–28. Los grupos son productivas, madres, deportistas, viajeras y estudiantes. No hay tamaños asignados a grupos o ciudades. Las señales sugeridas no garantizan categorías existentes en una plataforma.

Google, TikTok y Pinterest: documentación oficial revisada el 6 de octubre de 2026, enlazada en cada guía. Meta devolvió una pantalla de acceso: su ficha se presenta como guía de planeación pendiente de validar en cuenta, sin asegurar nombres de controles actuales. CTV no tiene proveedor confirmado; la guía pide diferenciar hogares, dispositivos y personas.

## Simulación

Los tres grupos exclusivos suman 7.000.000. El tamaño potencial de cada línea incluye el grupo compartido. Cada línea se modela con saturación exponencial `N × (1 − exp(−I/N))`; el cruce de alcance es `grupo compartido × tasa limpieza × tasa Control Poros`. La frecuencia es impresiones totales / únicos, no un promedio simple. Las doce olas tienen igual inversión.

No se gasta presupuesto sobre una línea sin audiencia. Entradas no finitas, negativas, fuera de rango o cuyo total de personas sea diferente de 7 M muestran error; se conserva la última versión válida. CSV incluye hipótesis y resultados. La interfaz identifica el ejemplo inicial como ilustrativo.

## Verificación local

Ocho pruebas de Node: 101 mezclas 0–100%, alcance monótono y acotado, intersección limitada por ambas líneas, presupuesto cero, frecuencia deduplicada, validación financiera, suma exclusiva de personas y escenarios extremos. Sintaxis de app.js revisada con node --check.

Verificación publicada en https://pads-fawn.vercel.app/: portada a 1363 px sin desbordamiento horizontal y con todos los empaques cargados; navegación a Audiencias, Productos, Medios, Simulador y Colombia; búsqueda de “viaje” deja Viajeras; ficha de Viajeras → guía de YouTube conserva el contexto; cambio a Control Poros actualiza los temas; inversión cero produce alcance y frecuencia cero; reparto inválido muestra error; restablecer recupera el ejemplo; selección de Cali actualiza el panel y el pin. Los cinco medios están presentes.

La prueba de integración DOM también verificó filtros y exportaciones CSV, copia de guía, persistencia del último escenario válido y estado del menú móvil. Responsive implementado; no se realizó inspección visual en viewport móvil porque el navegador disponible no expone cambio de tamaño.

Se corrigieron el botón de menú que aparecía innecesariamente en escritorio y el enlace de salto al contenido para conservar la ruta actual. No hay API ni datos de servidor que validar.

## Revision · 2026-10-06
Product hero uses bounded grid cells and contain sizing at all existing breakpoints. Media glyphs replaced with local SVG brand marks; CTV uses a television pictogram. Audience profiles now expose context, product-interest families, four proposed searches per product/persona, and creative direction. Contextual media guides add activation location, platform-specific mechanics, own-data prerequisites, controlled comparisons and KPIs. Copy/download includes the entire plan. All examples remain labeled hypotheses; no audience sizes assigned. Official Google, TikTok and Pinterest documentation rechecked. Existing integration and eight model tests pass.
