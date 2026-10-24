/* 简体 / 繁體：
 * 1) 读者打的繁体字先转成简体，再交给回复规则（ZH.toSimp），所以两种写法都能被理解；
 * 2) 显示可以切换成繁体：只换字形（台湾标准字），外加少量界面用语，不改写台词本身。
 * 字库：opencc-js（MIT），见 vendor/opencc/LICENSE。 */
(function () {
  const KEY = 'namjoon-zh';
  const T2S = window.OpenCC && window.OpenCC.Converter ? window.OpenCC.Converter({ from: 'twp', to: 'cn' }) : (s) => s;
  const cache = new Map();
  const toSimp = (s) => { s = String(s == null ? '' : s); if (!/[^\x00-\x7f]/.test(s)) return s; let v = cache.get(s); if (v === undefined) { v = T2S(s); if (cache.size > 2000) cache.clear(); cache.set(s, v); } return v; };
  const guess = () => { const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map((x) => String(x).toLowerCase()); const zh = langs.find((x) => x.startsWith('zh')); return zh && /hant|tw|hk|mo/.test(zh) ? 'tw' : 'cn'; };
  let mode = 'cn';
  try { mode = localStorage.getItem(KEY) || guess(); } catch (e) { mode = guess(); }
  if (mode !== 'tw') mode = 'cn';
  /* 界面用语：字形转换之后再替换（键是繁体字形） */
  const WORDS = [['視頻通話', '視訊通話'], ['視頻', '視訊'], ['設置', '設定'], ['軟件', '軟體'], ['網絡', '網路'], ['轉賬', '轉帳'], ['短信', '簡訊'], ['信息', '訊息'], ['無線局域網', '無線區域網路'], ['屏幕', '螢幕'], ['臺', '台'], ['鬆開', '放開']];
  let S2T = null;
  const tcache = new Map();
  const toTrad = (s) => { if (!S2T || !/[一-鿿]/.test(s)) return s; let v = tcache.get(s); if (v === undefined) { v = S2T(s); for (const [a, b] of WORDS) if (v.includes(a)) v = v.split(a).join(b); if (tcache.size > 5000) tcache.clear(); tcache.set(s, v); } return v; };
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT']);
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  function convertNode(n) {
    if (n.nodeType === 3) { const p = n.parentNode; if (p && (SKIP.has(p.nodeName) || (p.closest && p.closest('[data-zh-keep]')))) return; const v = toTrad(n.data); if (v !== n.data) n.data = v; return; }
    if (n.nodeType !== 1 || SKIP.has(n.nodeName) && n.nodeName !== 'INPUT') return;
    for (const a of ATTRS) { const old = n.getAttribute && n.getAttribute(a); if (old) { const v = toTrad(old); if (v !== old) n.setAttribute(a, v); } }
    if (SKIP.has(n.nodeName)) return;
    const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let c; while ((c = w.nextNode())) { if (c.nodeType === 3) { const p = c.parentNode; if (p && (SKIP.has(p.nodeName) || p.closest('[data-zh-keep]'))) continue; const v = toTrad(c.data); if (v !== c.data) c.data = v; } else for (const a of ATTRS) { const old = c.getAttribute(a); if (old) { const v = toTrad(old); if (v !== old) c.setAttribute(a, v); } } }
  }
  let observer = null;
  function startTrad() {
    S2T = window.OpenCC.Converter({ from: 'cn', to: 'tw' });
    document.documentElement.lang = 'zh-Hant-TW';
    document.title = toTrad(document.title);
    convertNode(document.body);
    observer = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === 'characterData') convertNode(m.target);
        else if (m.type === 'attributes') convertNode(m.target);
        else m.addedNodes.forEach(convertNode);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function loadTrad(done) {
    // 两个字库文件都往 window.OpenCC 上挂，先留住转简体用的那份（已在上面建好），再载入转繁体的
    const s = document.createElement('script');
    s.src = 'vendor/opencc/cn2t.js';
    s.onload = () => { try { startTrad(); } catch (e) {} done && done(); };
    s.onerror = () => { done && done(); };
    document.head.append(s);
  }
  function setMode(m) {
    m = m === 'tw' ? 'tw' : 'cn';
    try { localStorage.setItem(KEY, m); } catch (e) {}
    if (m === mode) return;
    if (m === 'cn') { location.reload(); return; } // 切回简体：重新载入最干净，进度在 sessionStorage 里不会丢
    mode = 'tw'; loadTrad();
  }
  if (mode === 'tw') { if (document.body) loadTrad(); else document.addEventListener('DOMContentLoaded', () => loadTrad()); }
  window.ZH = { toSimp, setMode, get mode() { return mode; }, label: () => (mode === 'tw' ? '繁體中文' : '简体中文') };
})();
