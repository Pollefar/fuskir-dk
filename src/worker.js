// Worker for fuskir.dk: statiske filer fra ./public, plus kontaktformularen på /api/kontakt.
import { handleKontakt } from './kontakt.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/kontakt') {
      if (request.method === 'POST') return handleKontakt(request, env);
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
    }
    return env.ASSETS.fetch(request);
  }
};
