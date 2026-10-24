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
    if (url.pathname === '/export' && request.method === 'GET') return exportFile(url, env);
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

/* 作者下载玩家消息用：/export?key=密码
 *   默认：只下载“上次下载以后”、成员没接住的话（按句子去重、带次数），下载后自动记下这次截到哪里。
 *   &all=1        下载全部消息（不只是没接住的），不去重
 *   &again=1      重新下载上一批（不前进），万一上次的文件丢了用
 *   &since=2026-10-24T16:26:00   从这个时间（UTC）之后开始（第一次用）
 *   &from=0       从头开始（rowid 从这个数之后）
 * 需要在 Cloudflare 里给这个 Worker 加一个 Secret：EXPORT_KEY = 你自己定的密码。 */
const FALLBACK = ['%没明白%', '%没看懂%', '%没跟上%', '%理解错%', '%再说一遍%', '%换个说法%', '%什么意思%', '%没懂%', '%说重点%',
  '%在说什么%', '%说什么呀%', '%你说啥%', '？%', '……什么%', '啥？%', '哥？%', '啊？%', '嗯？%'];
async function exportFile(url, env) {
  const text = (status, body) => new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
  if (!env.DB) return text(503, '数据库没有绑定');
  if (!env.EXPORT_KEY || url.searchParams.get('key') !== env.EXPORT_KEY) return text(403, '密码不对');
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS export_state (id INTEGER PRIMARY KEY CHECK (id = 1), prev INTEGER NOT NULL DEFAULT 0, last INTEGER NOT NULL DEFAULT 0)').run();
  await env.DB.prepare('INSERT OR IGNORE INTO export_state (id, prev, last) VALUES (1, 0, 0)').run();
  const state = await env.DB.prepare('SELECT prev, last FROM export_state WHERE id = 1').first();
  const top = (await env.DB.prepare('SELECT IFNULL(MAX(rowid), 0) AS m FROM feedback').first()).m;
  let from, to;
  if (url.searchParams.get('again') === '1') { from = state.prev; to = state.last; }
  else {
    const since = url.searchParams.get('since');
    if (since) from = (await env.DB.prepare('SELECT IFNULL(MAX(rowid), 0) AS m FROM feedback WHERE created_at <= ?').bind(since.replace('T', ' ')).first()).m;
    else from = url.searchParams.has('from') ? Number(url.searchParams.get('from')) || 0 : state.last;
    to = top;
    await env.DB.prepare('UPDATE export_state SET prev = ?, last = ? WHERE id = 1').bind(from, to).run();
  }
  const all = url.searchParams.get('all') === '1';
  const range = await env.DB.prepare('SELECT MIN(created_at) AS a, MAX(created_at) AS b, COUNT(*) AS n FROM feedback WHERE rowid > ? AND rowid <= ?').bind(from, to).first();
  let rows, head;
  if (all) {
    rows = (await env.DB.prepare("SELECT created_at, character, message, reply FROM feedback WHERE rowid > ? AND rowid <= ? AND character NOT IN ('妈妈','经纪人哥','方PD') ORDER BY rowid").bind(from, to).all()).results;
    head = ['时间', '角色', '玩家消息', '回复'];
    rows = rows.map((r) => [r.created_at, r.character, r.message, r.reply]);
  } else {
    const like = FALLBACK.map(() => 'reply LIKE ?').join(' OR ');
    rows = (await env.DB.prepare(`SELECT character, message, COUNT(*) AS n FROM feedback WHERE rowid > ? AND rowid <= ? AND character NOT IN ('妈妈','经纪人哥','方PD') AND (${like}) GROUP BY character, message ORDER BY n DESC`).bind(from, to, ...FALLBACK).all()).results;
    head = ['角色', '玩家消息', '次数'];
    rows = rows.map((r) => [r.character, r.message, r.n]);
  }
  const esc = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const csv = '﻿' + [`# 时间范围（UTC）：${range.a || '-'} ～ ${range.b || '-'}，共 ${range.n} 条消息；${all ? '全部' : '只含没接住的话'}`, head.join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n');
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="namjoon-feedback-${stamp}.csv"`, 'Cache-Control': 'no-store' } });
}

