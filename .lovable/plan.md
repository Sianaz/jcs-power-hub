
## Resumen
Rediseño completo del sitio para verlo más moderno, profesional y atractivo. Se reemplaza el "cuadro feo" del hero por una foto real del taller con overlay oscuro, se reorganiza el header (solo logo), se crean páginas dedicadas por sección y se añaden los nuevos servicios (programación, calibración, eléctricos, etc.).

## Cambios visuales (página principal `/`)
- **Header**: solo el logo (sin texto al lado), nav limpia, acceso admin discreto (icono de engranaje pequeño en footer, no en header).
- **Hero**: foto `jcs_fotos_1.jpeg` (equipos en patio) como fondo full-bleed con overlay oscuro degradado (negro→azul transparente). Encima: título grande, subtítulo, 2 CTAs (Agendar / WhatsApp). Sin el cuadro lateral desalineado.
- **Tipografía**: cambio a **Anton** (títulos, industrial moderno) + **Inter** (cuerpo). Más contundente, menos genérico que Oswald.
- **Servicios** (`/`): grid de 6 tarjetas con iconos — Equipo Pesado, Generación Eléctrica, Programación de Computadoras (ECU), Calibración, Diagnóstico Eléctrico, Servicio a Domicilio. Se elimina "Mantenimiento Preventivo".
- **Nueva sección "Nuestro Trabajo"**: galería con `jcs_fotos_2/3/5/6/7` (técnico, diagnóstico con laptop, excavadora CAT, bulldozer, cabina con scanner).
- **Nueva sección "¿Por qué elegirnos?"**: 4 puntos (técnicos certificados, equipo de diagnóstico, respuesta rápida, atención 24/7).
- **Nueva sección "Marcas que servimos"**: CAT, Volvo, Komatsu, John Deere, Olympian, etc.
- **Testimonios** breves (placeholders editables luego).
- **Footer**: solo logo (sin nombre), horario **Lun–Sáb 8am–6pm**, contacto, enlace discreto "Panel interno" (link a `/admin`).

## Nuevas páginas (rutas separadas, cada una con su `head()` SEO)
- `/servicios` — detalle de los 6 servicios con descripciones largas, foto `jcs_fotos_4` (generador) y `jcs_fotos_5` (excavadora).
- `/como-funciona` — proceso paso a paso (solicitud → diagnóstico → cotización → reparación → entrega), con foto `jcs_fotos_3` (diagnóstico).
- `/contacto` — WhatsApp +507 6453-1898, horario, formulario de cita reutilizado, mapa/cobertura.
- Header nav: Inicio · Servicios · ¿Cómo funciona? · Contacto (todos como `<Link>` a rutas reales, no hash).

## Acceso admin discreto
- Eliminar cualquier botón "Admin" visible.
- Footer: ícono pequeño de engranaje (sin texto) que enlaza a `/auth`. Solo perceptible si lo buscas.

## Assets
- Subir las 7 fotos vía `lovable-assets` desde `/mnt/user-uploads/` → pointers `.asset.json` en `src/assets/`.
- Logo ya existe.

## Detalles técnicos
- Nuevas rutas: `src/routes/servicios.tsx`, `src/routes/como-funciona.tsx`, `src/routes/contacto.tsx`. Cada una con `head()` propio (title, description, og:title, og:description, og:image leaf-only).
- `Header.tsx`: quitar bloque de texto del logo y el botón "Agendar visita" (queda solo nav + logo + menú móvil).
- `Hero.tsx`: reescribir — fondo `<img>` absoluto + overlay, sin la columna derecha del cuadro.
- `Footer.tsx`: quitar nombre/marca textual, dejar logo, horario corregido (8am–6pm), redes vacías por ahora, link `/auth` como icono `Settings` discreto.
- `ServicesSection.tsx`: actualizar lista (6 items, sin preventivo).
- Nuevo `WorkGallerySection.tsx`, `WhyUsSection.tsx`, `BrandsSection.tsx`.
- `styles.css`: cambiar familia display a Anton; cargar Google Font.
- Mantener color tokens (#3B82C4, #F5A623). No tocar lógica del formulario, webhook, ni Supabase.

## Fuera de alcance
- No se cambia la base de datos ni la lógica del panel `/admin`.
- No se publica.
