# PADS JGB · Deduplicación vigente de productos y medios

**Versión actual: 8 de octubre de 2026.** Reemplaza los ejemplos históricos de 13 M de compradores+nuevos y los modelos que duplicaban un segundo cruce de 10% en el alcance. El universo de categoría vigente es **fijo** y se calcula de manera reproducible.

## Bases de los cuatro grupos de planificación

| Línea | Compradores actuales supuestos | Audiencia nueva supuesta | Total |
|---|---:|---:|---:|
| Pads normales | 2.100.000 | 2.400.000 | 4.500.000 |
| Control Poros | 600.000 | 1.900.000 | 2.500.000 |

**Overlap por producto:** `min(4.500.000,2.500.000)×10%=250.000`. **Personas únicas de categoría:** `4.500.000+2.500.000−250.000=6.750.000`. Los compradores y nuevos se excluyen dentro de cada línea, pero alguien puede comprar Pads normales y ser nuevo para Control Poros.

El valor 6,75 M es un **supuesto estratégico fijo**, no una penetración DANE ni una cifra de Ads Manager. El **ticket medio de la transacción es 70.000 COP**, igualmente fijo y no asignado automáticamente a cada SKU.

## Deduplicación de alcance por producto

La base se divide sin doble conteo:
- 4.250.000 solo Pads normales;
- 250.000 en ambas líneas;
- 2.250.000 solo Control Poros.

La curva de saturación ilustrativa por línea es `R_p=N_p×[1−exp(−I_p/N_p)]`, donde `I_p=Presupuesto_p×1.000/CPM`.

Se modela la intersección **efectivamente expuesta** como:
`O_reach=250.000×(R_Pads/4.500.000)×(R_Poros/2.500.000)`.

Por tanto, `R_único=R_Pads+R_Poros−O_reach`, con `0≤R_único≤6.750.000`. Esta deduplicación no descuenta dos veces el overlap. Se apoya en independencia de exposición condicionada a pertenecer a ambos productos; es una hipótesis, no una medición de IDs.

## Entre plataformas

La curva independiente de Meta/YouTube/TikTok/Pinterest/CTV es **otra simulación del mismo universo**. `I_m = B×mix_m/CPM×1.000`, `R_m=N×(1−exp(−I_m/N))`. Se muestra la unión bajo independencia `R_ind=N×[1−∏_m(1−R_m/N)]` junto a cotas `max R_m≤R_único≤min(N,ΣR_m)`. **No sumar ambas curvas** ni afirmar que estén medidas por las plataformas.

Para cada clúster de beauty se usan ponderaciones estratégicas normalizadas que suman 100% por audiencia de origen, sin multiplicar los públicos por cada interés como si fueran personas independientes.

## Fuentes y reportes

La ruta demográfica DANE desde los adultos proyectados 2027, tasas TIC 2025, 30 M de comunicación, escenario de 6,75 M y ticket medio de $70.000 está en [Metodología DANE](market-methodology.md). Las ecuaciones de saturación, coeficientes y validaciones están en [Metodología matemática](math-methodology.md).

Las capturas y cálculos anteriores a esta versión son **históricos** y no deben utilizarse como la simulación vigente. Para cifras actuales utilice las exportaciones CSV del dashboard.
