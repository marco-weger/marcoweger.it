# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning: [SemVer](https://semver.org/).

## [1.1.0] - 2026-10-13

Code review: no copy or design changes, only quality, accessibility, performance and security.

### Added
- `boot.js` in `<head>`: saved language and theme are applied before the first paint (no more flash of the wrong one). Privacy and 404 now honour the saved theme too.
- Terminal: command history (Up/Down) and Tab completion; `aria-expanded` on the `>_` button, focus goes back to it on close.
- Content Security Policy (`script-src 'self'`, nothing third-party) and referrer policy on index and privacy.
- schema.org `Person` structured data; `lang="en"` on every English block.
- Font preload for the hero, lazy-loaded photo, cross-page view transitions, `text-wrap: pretty`.

### Changed
- Icon-only controls (theme, terminal, close) get labels in the active language.
- "stacca" flash slowed to under 3 flashes per second (WCAG 2.3.1).
- Matrix rain drawn at device pixel ratio (sharp on retina screens).
- Header paints the iOS notch area instead of leaving a gap; footer respects the home-indicator area.
- `~` hint hidden on touch devices; Cmd/Ctrl+` no longer opens the terminal.
- GitHub Actions bumped to the Node 24 majors (checkout v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5).

### Removed
- Inline `<style>`/`style=""` in privacy and 404 (moved to `styles.css`), unused `.org` rule.

## [1.0.0] - 2026-10-13

### Added
- One-page portfolio, Italian by default with English switch, light/dark theme.
- Hero with rotating "Entro in azienda e ..." line, "Work in progress" section, about, contact with copy-to-clipboard.
- Code-themed motion: name decode, typed shell commands per section, scroll "build" meter. Off with `prefers-reduced-motion`.
- Hidden terminal (`>_` button or `~`): help, whoami, ls, matrix, hal, stacca, 42, fuori-orario, exit and more.
- Self-hosted fonts (no third-party requests, no cookies), privacy page, themed 404, Open Graph image, favicons, robots.txt, sitemap.xml.
- GitHub Pages deploy from the `prod` branch.
