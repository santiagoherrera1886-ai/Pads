# PADS JGB · Metodología matemática DANE, audiencias y ticket medio

**Actualización 8 de octubre de 2026.** Esta es la metodología vigente. Los informes de implementación anteriores describen escenarios históricos reemplazados; el tablero actual muestra cifras de categoría fijas y ticket medio de **$70.000 COP por transacción**.

## 1. Población adulta DANE 2027

Proyecciones de población nacional DANE basadas en el CNPV 2018, serie 2018–2070, desagregación por sexo y edad. Se suman las edades desde **18 años, sin máximo superior, en toda Colombia**. La fuente demográfica agrupa por sexo; las campañas no excluyen identidades de género.

- Hombres proyectados: **19.166.107**.
- Mujeres proyectadas: **20.555.643**.
- Base total P(18+, 2027): **39.721.750**, calculada también por suma de edades.

**Identidad:** `P_adultos = Σ_(a≥18) P(2027,a) = P_hombres + P_mujeres`.

Fuente DANE: https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/proyecciones-de-poblacion

Serie utilizada: https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx

## 2. Población potencialmente digital (estimación propia)

Se utiliza la serie TIC DANE 2025, publicada el 30 de septiembre de 2026 y estimada mediante ECV. Para cada franja etaria:

| Edad proyectada 2027 | Personas | Tasa TIC 2025 | Advertencia |
|---|---:|---:|---|
| 18–24 | 6.151.801 | 93,8184% | Tasa publicada de 12–24 aplicada como proxy a 18–24. |
| 25–54 | 22.490.699 | 91,1285% | Se mantiene tasa 2025 para 2027. |
| 55+ | 11.079.250 | 63,2463% | Se mantiene tasa 2025 para 2027. |
| Total | **39.721.750** | No corresponde promediar tasas | Usar ponderación por población. |

**Fórmula:** `D_2027 = Σ_edad [P_2027(edad) × tasa_uso_internet_2025(edad)] = 33.274.171,16` personas digitales teóricas. No es la cifra oficial proyectada de usuarios de internet del DANE, ni el alcance real de una plataforma.

Sensibilidad hipotética (NO IC estadístico): `D(δ) = Σ_edad P_edad × max(0, min(1, tasa_edad+δ))` con δ = −0,05; 0; +0,05. Se presenta en pantalla sin alterar los universos PADS.

Fuente TIC: https://www.dane.gov.co/index.php/estadisticas-por-tema/tecnologia-e-innovacion/tecnologias-de-la-informacion-y-las-comunicaciones-tic/indicadores-basicos-de-tic-en-hogares

Anexo: https://www.dane.gov.co/files/operaciones/TICH/anex-TICH-2025.xlsx

## 3. Universo nacional de comunicación: 30 millones

Se adopta un **coeficiente de planeación**, no una tasa de inventario publicitario medida:

`C = D × k_comunicacion = 33.274.171,16 × (30.000.000 / 33.274.171,16) = 30.000.000`.

Así, `k_comunicacion ≈ 90,16%` y se deja margen de aproximadamente 3,27 M respecto del potencial digital propio. La decisión de fijar C en 30 M es del proyecto, no una estadística DANE. No se restringe por ciudades.

## 4. Universo fijo de la categoría: 6,75 millones únicos

El modelo usa cuatro bases **estratégicas**, NO tamaños de compradores registrados por el DANE:

| Línea | Compradores actuales supuestos | Nuevos supuestos | Total |
|---|---:|---:|---:|
| Pads normales | 2.100.000 | 2.400.000 | 4.500.000 |
| Pads Control Poros | 600.000 | 1.900.000 | 2.500.000 |

Overlap de producto: `O = 10% × min(4.500.000,2.500.000) = 250.000`.

Únicos: `U = 4.500.000 + 2.500.000 − 250.000 = 6.750.000`.

**Coeficiente inverso meramente descriptivo:** `U / C = 6,75M / 30M = 22,5%`. Multiplicar 30 M × 22,5% permite reconstruir el escenario, pero **no significa que el DANE estime un 22,5% de consumidores de pads**. Para justificar empíricamente esa proporción harían falta estudios de compra y uso, fuentes de categoría, CRM comparable o paneles con un periodo definido.

Las cifras y el overlap están fijos y no se editan desde la web. Los cinco clústeres beauty reciben participaciones normalizadas por cada cohorte, con conservación de totales, pero esas ponderaciones también son **editoriales, no prevalencias observadas**. Más detalle en [metodología matemática de campañas](math-methodology.md).

## 5. Contexto económico y límites de inferencia

DANE reporta para 2025 el **38,0% clase media y 3,3% clase alta** para la población total. Se aplica el 41,3% a los adultos proyectados 2027 como una **proxy** de referencia económica:

`E_proxy = 39.721.750 × (0,38 + 0,033) ≈ 16.405.083`.

No es una tabla cruzada por edad, internet, disposición a comprar y ciudad. No sirve para reducir automáticamente los 6,75 M. Si solo se conocen dos tamaños `D` y `E` dentro de la población adulta `P`, las únicas cotas lógicas de su intersección son:

`max(0,D + E − P) ≤ |D ∩ E| ≤ min(D,E)`.

Estas cotas son condicionales a los valores de referencia y **no constituyen intervalos de confianza**.

Fuente: https://www.dane.gov.co/files/operaciones/PM/cp-PMClasesSociales-2025.pdf

## 6. Ticket medio del proyecto: $70.000 COP

El proyecto utiliza **$70.000 COP por transacción como ticket medio fijo**; no es precio individual de cada presentación o SKU, no viene del DANE y no se modifica mediante la interfaz.

Si se supone una transacción cada `m` meses y que el gasto representa una fracción `q` del ingreso mensual per cápita:

- `Gasto_mensual_equivalente = 70.000 / m`.
- `Umbral_ingreso_aritmetico = (70.000 / m) / (q/100)`.
- `Ratio_referencia_2025 = (70.000 / m) / 943.791`. El denominador es el umbral inferior de clase media informado por DANE 2025, no el ingreso de cada individuo.

**Ejemplo:** con una transacción mensual y 5% del ingreso: gasto = **$70.000**, ingreso aritmético equivalente = **$1.400.000/mes**; razón frente a $943.791 ≈ **7,4%**. Esto NO afirma que una persona necesite ganar ese ingreso para comprar, ni describe demanda, precio unitario por SKU, ingreso disponible o elasticidad.

Las sensibilidades editoriales del 20%, 35% o 50% siguen siendo escenarios **sin observación**, no demanda estimada. El mismo ticket se utiliza en Resumen, Universo, paneles metodológicos y exportaciones. Cambiar meses o % de presupuesto cambia cálculos económicos, **no** los 6,75 M fijos.

## 7. Modelos de alcance y fuentes de validación

Modelo por línea: `R = N × [1−exp(−impresiones/N)]`, con intersección alcanzada deducida una sola vez del público común (hasta 250.000). Modelo por medio en 12 olas con CPM, mix de inversión, curva Poisson, unión bajo independencia y cotas de Fréchet/Boole para deduplicación. Los dos cálculos son **simulaciones distintas sobre la misma población** y no se suman.

Para calibrar faltan tamaños reales por plataforma, IDs de intereses seleccionables, CPM e impresiones por periodo, alcance observado y, para cruzar medios, una fuente válida de deduplicación. Los coeficientes editoriales de fit/5 solo ordenan la prioridad potencial y **no son penetración ni tamaños medidos de intereses**.

Código trazable en `src/dane-audience-math.js`, `src/dane-audience-view.js`, `src/math-foundation.js`, `src/simulation.js`. Tests en `tests/dane-audience.test.js` y `tests/math-foundation.test.js`.
