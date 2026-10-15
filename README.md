# fuskir.dk

Hjemmeside for Fagligt Undervisnings Selskab for Kirurger.
Statisk HTML/CSS uden build-trin. Udgives automatisk via Cloudflare Pages ved push til `main`.
Teknisk skabelon: Pollefar/vasektomi-dk.

## Arbejdsregler

- Claude opdaterer kun indhold, når Poul beder om det.
- Ingen tracking, ingen cookies, ingen eksterne scripts.
- Mail-DNS-poster for fuskir.dk hos Simply.com må ikke røres uden Pouls udtrykkelige besked.

## Struktur

- `index.html` – forside med links og kontaktformular.
- `begivenheder/index.html` – kommende begivenheder.
- `referater/index.html` – referater, nyeste øverst (kopier en `<div class="entry">`).
- `vedtaegter.pdf` – selskabets vedtægter.
- `tak/` – side efter afsendt kontaktformular. `404.html` – ukendt side.
- `functions/api/kontakt.js` – sender kontaktformularen som mail via Microsoft Graph.
- `assets/site.css` – fælles stylesheet. `_headers` – sikkerheds- og cacheheaders.

## Kontaktformular

Kræver disse variabler i Cloudflare Pages (Settings → Variables and Secrets):
`MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET` (hemmelig), `MAIL_FROM`, `MAIL_TO`.
Samme app-registrering som vasektomi.dk kan genbruges.
