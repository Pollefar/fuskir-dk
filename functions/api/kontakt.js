// Cloudflare Pages Function: kontaktformular på fuskir.dk -> mail via Microsoft Graph (Office 365).
// Miljøvariabler (Cloudflare Pages > Settings > Variables and Secrets):
//   MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET (hemmelig), MAIL_FROM (afsenderpostkasse), MAIL_TO (modtager)
const MAX = { navn: 100, email: 120, besked: 2000 };

function clean(v, max) { return String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max); }
function done(req, ok, why) {
  if ((req.headers.get('Accept') || '').includes('application/json'))
    return new Response(JSON.stringify({ ok, why: why || null }), { status: ok ? 200 : 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  return Response.redirect(new URL(ok ? '/tak/' : '/?fejl=1#kontakt', req.url).toString(), 303);
}

export async function onRequestPost({ request, env }) {
  let fd;
  try { fd = await request.formData(); } catch (e) { return done(request, false, 'formdata'); }
  if (clean(fd.get('website'), 200)) return done(request, true, 'spam'); // spam-fælde
  const d = {};
  for (const k of Object.keys(MAX)) d[k] = clean(fd.get(k), MAX[k]);
  if (!d.navn || !d.besked || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return done(request, false, 'validering');
  if (!env.MS_TENANT_ID || !env.MS_CLIENT_ID || !env.MS_CLIENT_SECRET || !env.MAIL_FROM || !env.MAIL_TO) return done(request, false, 'mangler: ' + ['MS_TENANT_ID','MS_CLIENT_ID','MS_CLIENT_SECRET','MAIL_FROM','MAIL_TO'].filter(k => !env[k]).join(','));

  const tok = await fetch(`https://login.microsoftonline.com/${env.MS_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.MS_CLIENT_ID, client_secret: env.MS_CLIENT_SECRET, scope: 'https://graph.microsoft.com/.default', grant_type: 'client_credentials' })
  }).then(r => r.json()).catch(() => null);
  if (!tok || !tok.access_token) return done(request, false, 'token: ' + ((tok && tok.error) || 'ingen svar'));

  const tekst = [
    'Ny henvendelse via kontaktformularen på fuskir.dk', '',
    'Navn: ' + d.navn,
    'E-mail: ' + d.email,
    '', 'Besked:', d.besked, '',
    'Sendt: ' + new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' })
  ].join('\n');
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.MAIL_FROM)}/sendMail`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + tok.access_token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject: 'fuskir.dk – henvendelse fra ' + d.navn,
        body: { contentType: 'Text', content: tekst },
        toRecipients: [{ emailAddress: { address: env.MAIL_TO } }],
        replyTo: [{ emailAddress: { address: d.email, name: d.navn } }]
      },
      saveToSentItems: false
    })
  }).catch(() => null);
  if (res && res.status === 202) return done(request, true);
  let fejl = ''; try { const j = await res.json(); fejl = j.error && j.error.code; } catch (e) {}
  return done(request, false, 'sendMail: ' + (res ? res.status : 'ingen svar') + ' ' + (fejl || ''));
}

export function onRequest() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
