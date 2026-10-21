# Lisandro Murúa Asis — Portfolio web

Sitio estático (HTML + CSS + JS, sin build), bilingüe ES/EN, publicado en Vercel.

## Estructura

- `index.html` — home: servicios, proyectos, proceso, cifras, sobre mí y contacto.
- `proyectos/` — una página por proyecto (`cubrecarter.html` es la plantilla).
- `assets/css/styles.css` — estilos compartidos.
- `assets/js/main.js` — selector de idioma y contador de visitas.
- `assets/img/` — imágenes (una subcarpeta por proyecto).
- `vercel.json` — URLs limpias (`/proyectos/cubrecarter` sin `.html`).

## Idiomas

Cada texto existe dos veces: `data-l="es"` y `data-l="en"`. Se muestra el del idioma activo,
que se elige con el botón ES/EN y queda guardado en el navegador.

## Contador de visitas

GoatCounter, sitio `lisandromuruaweb`. El número aparece en el pie cuando el sitio existe en
GoatCounter y tiene activada la opción de mostrar el contador en la web.
