const ORIGINS = new Set([
  'https://pilicat913.github.io',
  'https://namjoon-ios6-phone-m7x24.sunsetlotus9.chatgpt.site'
]);
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
    if (ORIGINS.has(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers.Vary = 'Origin';
    }
    const reply = (status, value) => new Response(JSON.stringify(value), { status, headers });
    if (url.pathname === '/health' && request.method === 'GET') return reply(200, { service: 'namjoon-feedback', configured: !!env.DB });
    if (url.pathname !== '/messages') return reply(404, { error: 'not_found' });
    if (!ORIGINS.has(origin)) return reply(403, { error: 'origin_denied' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    if (request.method !== 'POST') return reply(405, { error: 'method_not_allowed' });
    if (!env.DB) return reply(503, { error: 'database_not_bound' });
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, { error: 'json_required' });
    // Bound request bytes before JSON parsing, including chunked requests.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: 'empty_body' });
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return reply(413, { error: 'too_large' }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let data;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400, { error: 'invalid_json' }); }
    if (!data || data.consent !== 'v1' || typeof data.message !== 'string' || !data.message.trim() || data.message.length > 500 || typeof data.character !== 'string' || data.character.length > 80 || (data.reply != null && (typeof data.reply !== 'string' || data.reply.length > 2000))) return reply(400, { error: 'invalid_record' });
    // Public submissions are untrusted. Global quota limits accidental/spam writes;
    // CORS is a browser restriction, not authentication or complete bot protection.
    try {
      const minute = Math.floor(Date.now() / 60000);
      const quota = await env.DB.prepare('INSERT INTO quotas (minute, count) VALUES (?, 1) ON CONFLICT(minute) DO UPDATE SET count = count + 1 WHERE count < 200 RETURNING count').bind(minute).first();
      if (!quota) return reply(429, { error: 'try_later' });
      await env.DB.batch([
        env.DB.prepare('INSERT INTO feedback (id, character, message, reply, consent_version) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), data.character, data.message.trim(), data.reply || '', 'v1'),
        env.DB.prepare("DELETE FROM feedback WHERE created_at < datetime('now', '-90 days')"),
        env.DB.prepare('DELETE FROM quotas WHERE minute < ?').bind(minute - 5)
      ]);
      return reply(201, { ok: true });
    } catch { return reply(503, { error: 'storage_unavailable' }); }
  }
};
