# marcoweger.it

Personal site of Marco Weger, integration engineer and IT consultant. Static HTML/CSS/JS, no build step, published on GitHub Pages at https://marcoweger.it.

## Layout

| Path | What |
| --- | --- |
| `site/index.html` | The page (IT + EN in the same file, `lang-it` / `lang-en` classes) |
| `site/styles.css` | Page layout and effects |
| `site/mw.css` | MW design tokens and components, copy of `MW/Stile grafico/mw.css`. Regenerate from there, never edit colours by hand |
| `site/script.js` | Language and theme switch, copy button, scroll effects, hidden terminal |
| `site/fonts.css`, `site/fonts/` | Space Grotesk and JetBrains Mono, self-hosted (SIL OFL 1.1) |
| `site/privacy.html`, `site/404.html` | Privacy notice and themed 404 |
| `site/og.png`, `site/favicon*`, `site/apple-touch-icon.png` | Share preview and icons |
| `site/CNAME`, `site/robots.txt`, `site/sitemap.xml` | Domain and indexing |
| `.github/workflows/pages.yml` | Deploys `site/` to GitHub Pages on push to `prod` |

## Branches

- `dev`: day-to-day work.
- `prod`: what is live. Merge `dev` into `prod` to publish.

No `test` branch: preview locally with `python3 -m http.server 4173 -d site`.

## Adding a terminal command

In `site/script.js`, add an entry to the `cmds` object (`'name': function () { print('...'); }`) and list it in `help`.

## DNS (Aruba)

- `marcoweger.it` A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www` CNAME: `marco-weger.github.io`
- Mail records (MX, SPF, DKIM) untouched.

## Release

1. Update `VERSION` and `CHANGELOG.md`.
2. Merge into `prod` and tag `vX.Y.Z`.
