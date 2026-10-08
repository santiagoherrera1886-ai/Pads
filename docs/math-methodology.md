# PADS JGB · Metodología matemática y límites de evidencia

**Versión:** 2026-10-08  
**Código fuente:** `src/product-audiences.js`, `src/cluster-intelligence.js`, `src/math-foundation.js`, `src/simulation.js`, `src/math-view.js`  
**Ámbito:** toda Colombia, personas de 18+ y todos los géneros. Una cifra deducida matemáticamente NO equivale a una cifra medida en Ads Manager.

## 0. Origen DANE y ticket medio COP 70.000

La metodología completa de proyección de población 2027, tasas TIC 2025 por rango de edad, factor de comunicación y conversión estratégica a la categoría de 6,75 M está en [DANE, audiencias y ticket](market-methodology.md). La transformación `P18+ = 39.721.750 → D_internet = Σ P_edad × r_TIC2025 = 33,27 M → comunicación = 30 M → categoría = 6,75 M` combina **tres clases distintas de datos**: proyección DANE; extrapolación TIC propia y ajuste de planeación; hipótesis estratégica de consumidores PADS. **No existe una fórmula que extraiga compradores de pads directamente de las tablas del DANE**.

La relación `6,75 M / 30 M = 22,5%` es una identidad aritmética del escenario, **no penetración observada**. Los cinco perfiles de belleza heredan estos cuatro universos con pesos que suman 100% por cohorte.

**Ticket medio comercial fijo:** 70.000 COP por transacción. Fórmulas económicas: `gasto_mensual = 70000/meses_entre_transacciones`, `ingreso_aritmético = gasto_mensual / (porcentaje_ingreso/100)`. Ejemplo con transacción mensual y 5%: 70.000/0,05 = **1.400.000 COP/mes** de referencia puramente aritmética; no es un requisito de ingreso ni un pronóstico de ventas. El ticket no equivale al precio de cada SKU ni modifica la composición de audiencias.

## 1. Tres niveles de evidencia

1. **Determinístico / verificable:** las operaciones y sus identidades aritméticas, redondeo controlado, sumatorias, cotas y monotonicidad del modelo.
2. **Hipótesis declarada:** los 4 tamaños de audiencias por producto, el 10% de cruce, las ponderaciones editoriales de clúster, los puntajes de idoneidad por plataforma, presupuesto y CPM. Que un número salga de una fórmula **no lo convierte en una estimación empírica**.
3. **Dato aún no observado:** penetración de pads, disponibilidad de intereses en los selectores de medios, audiencia elegible por plataforma, alcance e impresiones de campañas, CPM observado por plataforma, frecuencia y deduplicación real cross-media. Los conectores de las cuentas publicitarias no están conectados a la aplicación.

## 2. Universo de producto (fijo en UI)

- Pads normales: compradores actuales supuestos **2.100.000** + nuevos **2.400.000** = **4.500.000**.
- Pads Control Poros: actuales supuestos **600.000** + nuevos **1.900.000** = **2.500.000**.
- Intersección supuesta: `O = 0,10 × min(4.500.000, 2.500.000) = 250.000`.
- Universo conjunto deduplicado: `U = 4.500.000 + 2.500.000 − 250.000 = 6.750.000`, menor que el techo de **7 millones**.

El marco nacional separado de 30 M está sustentado por proyecciones DANE y tasas TIC con hipótesis de planeación; no se debe describir como 30 M de compradores de pads. Los estados comprador/nuevo son excluyentes *dentro del mismo producto*, mientras que una persona puede estar en ambas líneas. En el diagrama las áreas de círculos son **ilustrativas, no a escala**.

## 3. Asignación de los cuatro universos a cinco clústeres

Para cohorte `c` y clúster `g`, el tamaño asignado se calcula:

`N(g,c) = N(c) × w(g,c) / Σ_h w(h,c)`

Los coeficientes `w` son ponderaciones **editoriales expertas**, expresadas en `CLUSTER_SHARES`; no proceden de estudios de penetración por clúster. Cada cohorte completa suma 100%. Un algoritmo de redondeo con mayor residuo garantiza `Σ_g N(g,c) = N(c)` sin desviaciones por enteros.

Solapamiento estimado de productos en cada clúster (asignación *ilustrativa*):

`q(g) = min(Pads(g),Poros(g))`; `O(g) = O_total × q(g)/Σ_h q(h)`.

El redondeo vuelve a conservar `Σ_g O(g) = 250.000`. Por lo tanto:

`Núnico(g) = Pads(g) + Poros(g) − O(g)`; `Σ_g Núnico(g) = 6.750.000`.

Este particionado se emplea únicamente para evitar quintuplicar el universo. Las personas reales pueden encajar en **varios** contextos. No se debe usar la cifra del clúster como conteo de usuarios de cada interés.

## 4. Intereses y señales por plataforma

Cada clúster tiene intereses **editoriales propuestos** diferentes por cohorte. Para un medio `m` y un clúster `g`, se establece `fit(g,m)` de 1 a 5 en `MEDIA.fit`, de forma transparente, pero sin evidencia de rendimiento.

`Índice editorial(g,m) = 100 × fit(g,m)/5`.

**No es un porcentaje de personas** y no valida la existencia de un interés concreto en la taxonomía de Meta Ads, Google Ads, TikTok Ads o Pinterest Ads. Para CTV se consideran paquetes contextuales. Los términos deben comprobarse dentro de la cuenta publicitaria en Colombia.

Para construir **solo un mix de inversión ilustrativo**, el modelo pondera el puntaje con los únicos asignados de cada clúster:

`Score(m) = Σ_g Núnico(g) × fit(g,m)`  
`Mix(m) = Score(m) / Σ_j Score(j)`.

Se cumple `Σ_m Mix(m) = 1`. Esa normalización de una recomendación editorial no equivale a cuota de uso, alcance, CPA, propensión a compra ni inventario real. La recomendación de mix deberá recalibrarse con tests de pauta y métricas observadas.

## 5. Curvas matemáticas de alcance por plataforma

El modelo de 12 olas distribuye un presupuesto total supuesto `B`, con CPM común supuesto `C`; para plataforma `m` en ola acumulada `t`:

`B(m,t) = B × Mix(m) × t/12`  
`I(m,t) = 1000 × B(m,t)/C`.

Sin datos de elegibilidad real por medio, usa `N = 6.750.000` como **hipótesis teórica de elegibilidad total en cada plataforma**. Este supuesto es fuerte: **no certifica que 6,75 M estén disponibles en Meta, TikTok, YouTube, Pinterest o CTV**.

`R(m,t) = N × [1 − exp(−I(m,t)/N)]`.

Esta es una curva de saturación tipo Poisson bajo exposición uniforme; tiene retorno marginal decreciente, es monótona en impresiones, satisface `0 ≤ R ≤ N` y no es el algoritmo de pronóstico nativo de la plataforma.

La unión de exposiciones **bajo independencia entre plataformas** se presenta como sensibilidad ilustrativa:

`Rind(t) = N × {1 − ∏_m [1 − R(m,t)/N]}`.

La deduplicación cross-platform **no es medida**. Dadas las coberturas de cada medio y una misma población compatible, las cotas matemáticas posibles son:

`max_m R(m,t) ≤ Rúnico real condicional(t) ≤ min[N, Σ_m R(m,t)]`.

La pantalla muestra las dos cotas **condicionales a las curvas hipotéticas**, más la unión independiente y las 5 curvas individuales. Si los alcances por medio fueran erróneos, esas cotas no constituyen un rango de confianza de usuarios reales.

Frecuencia teórica acumulada: `F(t) = Σ_m I(m,t)/Rind(t)` si el denominador es positivo.

**Comprobaciones automatizadas:** restricciones del universo, suma de pesos, monotonicidad por olas, presupuesto e impresiones aditivos, cotas, frecuencia e intersección no repetida.

## 6. Curvas por producto dentro del simulador

La base también queda bloqueada en 6.750.000 al simular líneas de producto:
- 4.250.000 solo Pads normales,
- 250.000 compartidos,
- 2.250.000 solo Control Poros.

El usuario puede variar únicamente presupuesto, CPM y reparto financiero entre ambos productos. Para una línea con población `N_p` e impresiones acumuladas `I_p`, su alcance teórico es:

`R_p = N_p[1−exp(−I_p/N_p)]`.

En cada ola se deduplica la exposición dentro de los 250.000 de base compartida:

`Cruce_alcanzado = 250.000 × (R_Pads/4.500.000) × (R_Poros/2.500.000)`.  
`Rúnico = R_Pads + R_Poros − Cruce_alcanzado`.

**No se vuelve a restar un segundo 10% del alcance** de este cálculo. La curva por producto y la curva por plataforma son sensibilidades distintas del mismo universo y **no se suman**.

## 7. Cómo llevarlo de teórico a calibrado

Para cada plataforma obtener:
- `fecha inicio / fecha fin`, cobertura Colombia, configuración 18+, objetivo y emplazamientos.
- IDs/taxonomías de intereses **que efectivamente se pueden seleccionar**, junto con el tamaño potencial estimado según plataforma. No convertir cuentas de usuarios en población humana sin metodología.
- Impresiones, alcance único observado, inversión y CPM real en períodos comparables.
- Separar meta de `reach` por campaña y deduplicación cross-canal si hay solución válida (logs consentidos, medición propia o estudio cross-media). Un mismo usuario puede tener cuentas o dispositivos múltiples.
- Eventos de compra cuando existan y sean lícitos, con período y nivel de deduplicación.
- Calibrar saturación `R=N×[1−exp(−α I/N)]` en cada plataforma si `N` elegible y `R` observado son comparables; por ejemplo, `α = −(N/I) ln(1−R/N)` cuando `0<R<N` e `I>0`.
- Validar fuera de muestra; evaluar error absoluto `|R_real−R_modelado|` y WAPE `Σ|errores| / ΣR_real` solo sobre alcances **realmente medidos**; documentar incertidumbre y segmentación comparable.

**Fuentes de metodología de las plataformas:**

- [Google Ads · Reach Planner](https://support.google.com/google-ads/answer/9427120?hl=en): metodología de personas únicas y pronósticos.
- [Google Ads · Forecasts in Reach Planner](https://support.google.com/google-ads/answer/9808024?hl=en): supuestos y limitaciones.
- [TikTok · Estimación de audiencia](https://ads.tiktok.com/resources/help/article/audience-size-estimation-overview?lang=es): tamaños de audiencia potencial basados en cuentas, no alcance.
- [TikTok · Reach Estimator](https://ads.tiktok.com/resources/help/article/reach-estimator-for-brand-auction?lang=es): escenarios basados en presupuesto, targeting y puja, no garantizados.
- [TikTok · Intereses](https://ads.tiktok.com/resources/help/article/interest-targeting): seleccionar categorías existentes en Ads Manager.

## 8. Reproducibilidad

Usar `npm test` para pruebas de límites y ecuaciones (incluidos `tests/math-foundation.test.js`, `tests/cluster-intelligence.test.js` y `tests/simulation.test.js`). En **Audiencias** y **Simulador**, ver el módulo «La matemática detrás de cada audiencia» y exportar CSV para obtener las ecuaciones, coeficientes, matrices de interés y 13 puntos por curva (ola 0 a ola 12). La exportación preserva la diferencia entre **dato medido**, **supuesto** y **cálculo matemático**.