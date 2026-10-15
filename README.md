# fuskir.dk

Hjemmeside for Fagligt Undervisnings Selskab for Kirurger.
Statisk HTML/CSS uden build-trin. Udgives automatisk som Cloudflare Worker (`fuskir-dk`) ved push til `main` (deploy-kommando: `npx wrangler deploy`).
Teknisk skabelon: Pollefar/vasektomi-dk.

## Arbejdsregler

- Claude opdaterer kun indhold, når Poul beder om det.
- Ingen tracking, ingen cookies, ingen eksterne scripts.
- Mail-DNS-poster for fuskir.dk hos Simply.com må ikke røres uden Pouls udtrykkelige besked.

## Struktur

Alt i `public/` bliver offentligt. Intet andet gør.

- `public/index.html` – forside med links og kontaktformular.
- `public/begivenheder/index.html` – kommende begivenheder.
- `public/referater/index.html` – referater, nyeste øverst (kopier en `<div class="entry">`).
- `public/vedtaegter.pdf` – selskabets vedtægter.
- `public/tak/` – side efter afsendt kontaktformular. `public/404.html` – ukendt side.
- `public/assets/site.css` – fælles stylesheet. `public/_headers` – sikkerheds- og cacheheaders.
- `src/worker.js` – Worker: serverer `public/` og sender `/api/kontakt` videre.
- `src/kontakt.js` – sender kontaktformularen som mail via Microsoft Graph.
- `wrangler.jsonc` – Worker-opsætning.

## Kontaktformular

Kræver disse variabler på Workeren (Cloudflare → Workers & Pages → fuskir-dk → Settings → Variables and Secrets):
`MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET` (hemmelig), `MAIL_FROM`, `MAIL_TO`.
Samme app-registrering som vasektomi.dk kan genbruges.
