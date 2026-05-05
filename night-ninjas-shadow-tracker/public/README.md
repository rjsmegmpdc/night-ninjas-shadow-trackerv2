# public/

Static assets served at the site root.

The Night Ninjas wordmark + crossed-bones glyph is rendered as inline SVG
in `components/brand/logo.tsx`, so no image asset is required to run the
app. If you want to swap in your authentic brand mark (e.g. a transparent
PNG of the original Night Ninjas logo), drop it here as `logo.png` and
update `components/brand/logo.tsx` to use a `<Image>` instead of the SVG.

Suggested files:
- `logo.png` — the authentic Night Ninjas mask + bones
- `favicon.ico` — generated from the logo at 32x32
- `apple-touch-icon.png` — 180x180

None of these are required for v0.1.0.
