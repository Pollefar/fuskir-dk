# fuskir.dk

Hjemmeside for Fagligt Undervisnings Selskab for Kirurger.
Statisk HTML/CSS uden build-trin. Udgives automatisk via Cloudflare Pages ved push til `main` (build-kommando: ingen, output-mappe: `public`).
Teknisk skabelon: Pollefar/vasektomi-dk.

## Arbejdsregler

- Claude opdaterer kun indhold, når Poul beder om det.
- Ingen tracking, ingen cookies, ingen eksterne scripts.
- Mail-DNS-poster for fuskir.dk hos Simply.com må ikke røres uden Pouls udtrykkelige besked.

## Struktur

Alt i `public/` bliver offentligt. Intet andet gør.

- `public/index.html` – forside med links og kontaktformular.
- `public/begivenheder/index.html` – kommende begivenheder.
- `public/konferencer/index.html` – konferencer og kurser. Data ligger i `DATA`-blokken i sidens script (funktionerne `r()`/`u()`), sæt `UPDATED`. Kilde: Claude Doc'en "Kirurgiske gastro-konferencer 2026–2027"; opdateres månedligt af Claude.
- `public/referater/index.html` – referater, nyeste øverst (kopier en `<div class="entry">`).
- `public/vedtaegter.pdf` – selskabets vedtægter.
- `public/tak/` – side efter afsendt kontaktformular. `public/404.html` – ukendt side.
- `public/assets/site.css` – fælles stylesheet. `public/_headers` – sikkerheds- og cacheheaders.
- `functions/api/kontakt.js` – Pages Function: sender kontaktformularen som mail via Microsoft Graph.

## Kontaktformular

Kræver disse variabler i Pages-projektet (Cloudflare → Workers & Pages → fuskir-dk → Settings → Variables and Secrets):
`MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET` (hemmelig), `MAIL_FROM`, `MAIL_TO`.
Samme app-registrering som vasektomi.dk kan genbruges.
