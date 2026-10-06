# Procedencia de recursos

Los tres empaques se extraen sin retoques creativos de la página 24 del PDF proporcionado por el usuario: `Estrategia de comunicación PADs JGB V2(1).pdf`.

- `pads-redondos.png`: empaque alto de Pads, 80 unidades, recurso PDF xref 142.
- `pads-cuadrados.png`: empaque Pads Faciales Desmaquilladores, 50 unidades, recurso PDF xref 144.
- `pads-control-poros.png`: frasco con tapa lavanda, recurso PDF xref 146.

La extracción conserva la máscara de transparencia incrustada en el PDF. Los archivos tienen la resolución disponible en la fuente; no se han inventado etiquetas ni ampliado con IA.

## Identidad y tipografía

- `jgb.svg`: logo oficial descargado de https://jgb.com.co/wp-content/uploads/2025/08/logo_principal.svg el 6 de octubre de 2026; localizado en la portada https://jgb.com.co/ . Sin redibujar.
- `inter-latin.woff2`: Inter Variable, https://github.com/rsms/inter, licencia SIL Open Font License en `Inter-LICENSE.txt`; reutilizada como recurso tipográfico local.
- `colombia.svg`: polígono continental de Colombia derivado de https://raw.githubusercontent.com/johan/world.geo.json/master/countries/COL.geo.json. Se conserva la geometría y relación de aspecto del recurso de mapa anterior; cambia solamente el estilo a lavanda. No representa departamentos ni densidad.

## Recursos ilustrativos generados

Herramienta integrada imagegen. Los originales PNG se convirtieron a WebP sin recortes ni cambios de composición.

- `hero.webp`: ambiente de estudio claro, fondo marfil/lavanda, hojas salvia desenfocadas, algodón y pedestal de travertino vacío; sin productos, personas, texto o logos. Los empaques originales PNG se superponen desde HTML/CSS.
- `audiences.webp`: cinco retratos verticales de igual ancho, mujeres adultas colombianas con rasgos diversos: profesional, madre con su hija, deportista, viajera y universitaria adulta; iluminación natural, marfil/salvia/lavanda, sin textos ni logos. La selección de cada celda se realiza con CSS. No representan participantes de una investigación.

Prompt de hero: “Create a photorealistic premium skincare still-life BACKGROUND asset, wide landscape 1536x1024. Very pale ivory and pastel lavender color palette, diffuse morning light, subtle defocused sage green leaves to right and behind. Lower middle a wide low white travertine oval pedestal, empty and usable for later overlay of two product pack images. A few white cotton pads and cotton sprigs to far left bottom. Upper and middle areas mostly open soft background. Understated, warm, quiet elegant clean cosmetic brand aesthetic. Absolutely NO products, NO bottles, NO jars, NO packaging, NO people, NO text, NO logo, NO interface. High fidelity natural materials. Intended as CSS background behind separate original product pack PNGs.”

Prompt de retratos: “Generate a photorealistic contact sheet of exactly FIVE equal-width vertical portraits side by side, with no gaps and no borders, landscape 1536x1024. Each portrait fills exactly one fifth of total width; identical framing and eye-line, head and torso visible, generous headroom. Five DIFFERENT adult Colombian women, diverse skin tones and hairstyles, naturally beautiful real textured skin, premium candid lifestyle photography, warm morning daylight. Left to right: 1 Productivas: 31 year old curly dark-haired professional in beige blouse, blurred modern office. 2 Madres: 40 year old mother with her 7 year old daughter hugging beside her, cream casual blouse, warm home background, mother is the central adult subject. 3 Deportistas: 29 year old athletic Afro-Colombian woman with dark skin and tied-back curls, sage exercise top, blurred outdoor park. 4 Viajeras: 35 year old Colombian woman with medium tan skin, beige travel clothes and straw sunhat, softly blurred Cartagena historic architecture. 5 Estudiantes: 23 year old adult Colombian university student with straight dark hair, denim shirt, backpack and book, campus background. Each person has a distinct face and clothing. Calm happy expressions, editorial natural look, not studio stock photo poses. All five scenes visually harmonized in ivory/sage/lavender palette. Absolutely no text, no logos, no UI, no numbers. The five equal cells will be selected with CSS background-position without editing the image.”

## Media marks · 2026-10-06
Meta, YouTube, TikTok and Pinterest SVG paths from Simple Icons: https://github.com/simple-icons/simple-icons/tree/develop/icons (files meta.svg, youtube.svg, tiktok.svg, pinterest.svg). Brand colors applied locally. CTV is a generic television pictogram, not a provider logo.
