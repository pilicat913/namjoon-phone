/* Voluntary vocabulary feedback. Never reads stored chat history. */
(function () {
  const ENDPOINT = 'https://namjoon-feedback.1228088256.workers.dev/messages';
  const KEY = 'namjoon-feedback-consent-v1';
  let enabled = false, status = '', generation = 0;
  const staged = new Map(), requests = new Set(), views = new Set();
  try { enabled = sessionStorage.getItem(KEY) === 'yes'; } catch (_) {}
  const { h } = window.UI;
  function render() { views.forEach(view => view()); }
  function setEnabled(value) {
    enabled = value === true; generation++; staged.clear(); status = '';
    for (const controller of requests) controller.abort();
    requests.clear();
    try { if (enabled) sessionStorage.setItem(KEY, 'yes'); else sessionStorage.removeItem(KEY); } catch (_) {}
    render();
  }
  let invited = false;
  try { invited = sessionStorage.getItem('namjoon-feedback-invited-v1') === 'yes'; } catch (_) {}
  function inviteOnce() {
    if (invited || enabled || document.getElementById('feedback-dialog')) return;
    invited = true;
    try { sessionStorage.setItem('namjoon-feedback-invited-v1', 'yes'); } catch (_) {}
    const previous = document.activeElement;
    const close = () => { dialog.close(); dialog.remove(); previous?.focus(); };
    const choose = value => { setEnabled(value); close(); };
    const dialog = h('dialog', { id: 'feedback-dialog', 'aria-label': '作者的话' },
      h('p', null, '作者想把聊天功能再完善一下，所以想收集一些大家发出的消息和角色的回复用来补充网站语库。如果同意可以选择开启，可以随时关闭。感谢你的参与，爱你们！'),
      h('p', { class: 'feedback-invite-note' }, '请勿填写真实隐私。关闭不会撤回已经上传的内容。'),
      h('div', { class: 'feedback-actions feedback-invite-actions' },
        h('button', { type: 'button', onclick: () => choose(true) }, '愿意参与'),
        h('button', { type: 'button', onclick: () => choose(false) }, '暂不参与')),
      h('p', { class: 'feedback-author', 'data-zh-keep': '' }, '抖音/小红书：霹雳小猫', h('br'), 'threads：imyouryeon913'));
    dialog.addEventListener('cancel', e => { e.preventDefault(); choose(false); });
    document.body.append(dialog); dialog.showModal();
  }
  function settings() {
    if (document.getElementById('feedback-dialog')) return;
    const previous = document.activeElement;
    const check = h('input', { type: 'checkbox' });
    check.checked = enabled;
    const close = () => { dialog.close(); dialog.remove(); previous?.focus(); };
    const dialog = h('dialog', { id: 'feedback-dialog', 'aria-labelledby': 'feedback-title' },
      h('h2', { id: 'feedback-title' }, '一起完善角色回复'),
      h('p', null, '自愿参与，不影响游玩。开启后，你新发送的文字、聊天角色及游戏生成的回复会发送给作者，用来人工整理语库。不会补传历史消息。'),
      h('p', null, '不附带姓名或账号，但文字本身可能包含个人信息，请勿发送真实隐私。网站和 Cloudflare 仍会处理正常网络连接信息。'),
      h('p', null, '每条消息发送前可勾选“本条不分享”。可随时关闭；关闭不撤回已经上传的记录。记录会在后续提交时清理超过 90 天的内容。'),
      h('label', { class: 'feedback-consent' }, check, ' 我愿意分享新消息，用于改善角色回复（本标签页有效）'),
      h('p', { class: 'feedback-dialog-status', role: 'status' }, status),
      h('div', { class: 'feedback-actions' },
        h('button', { type: 'button', onclick: close }, '取消'),
        h('button', { type: 'button', onclick: () => { setEnabled(check.checked); close(); } }, '保存选择')));
    dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
    document.body.append(dialog); dialog.showModal();
  }
  function mountBar() {
    const button = h('button', { type: 'button', onclick: settings });
    const skip = h('input', { type: 'checkbox' });
    const label = h('label', null, skip, '本条不分享');
    const state = h('span', { class: 'feedback-status', role: 'status' });
    const el = h('div', { class: 'feedback-bar' }, button, label, state);
    const update = () => {
      button.textContent = '语库分享：' + (enabled ? '开' : '关');
      skip.disabled = !enabled; label.hidden = !enabled;
      state.textContent = status;
    };
    views.add(update); update();
    return { el, take() { const allow = enabled && !skip.checked; skip.checked = false; return allow; }, destroy() { views.delete(update); } };
  }
  function stage(room, message, allow) {
    if (!enabled || !allow || typeof message !== 'string') return;
    const list = staged.get(room) || [];
    list.push({ message: message.slice(0, 500), generation });
    staged.set(room, list.slice(-12));
  }
  function flush(room, character, reply) {
    const list = staged.get(room) || []; staged.delete(room);
    if (!enabled) return;
    const text = (Array.isArray(reply) ? reply.filter(x => typeof x === 'string').join('\n') : String(reply || '')).slice(0, 2000);
    list.forEach(item => {
      if (!enabled || item.generation !== generation) return;
      const controller = new AbortController(), epoch = generation;
      requests.add(controller);
      const timeout = setTimeout(() => controller.abort(), 10000);
      const payload = { consent: 'v1', character: String(character).slice(0, 80), message: item.message, reply: text };
      // One attempt only: failures never create an offline archive or block play.
      Promise.resolve().then(() => {
        if (!enabled || epoch !== generation) return null;
        return fetch(ENDPOINT, { method: 'POST', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }).then(response => {
        if (!response || epoch !== generation) return;
        status = response.ok ? '已分享' : '分享失败，游戏不受影响'; render();
      }).catch(() => {
        if (epoch !== generation) return;
        status = '分享失败，游戏不受影响'; render();
      }).finally(() => { clearTimeout(timeout); requests.delete(controller); });
    });
  }
  const style = h('style');
  style.textContent = '.feedback-bar{flex:none;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:5px 9px;background:#f2f0eb;color:#444;font:12px/1.4 sans-serif}.feedback-bar button{padding:5px 7px;color:#27568d;background:#fff;border:1px solid #b9c1ca;border-radius:4px;font:inherit}.feedback-bar label{display:flex;align-items:center;gap:3px}.feedback-bar label[hidden]{display:none}.feedback-bar input,#feedback-dialog input{appearance:auto;-webkit-appearance:auto;width:17px;height:17px;margin:0;vertical-align:middle;flex:none}.feedback-status{font-size:11px;color:#555}#feedback-dialog{box-sizing:border-box;width:min(92vw,420px);max-height:85vh;overflow:auto;padding:24px;border:0;border-radius:14px;background:#fff;color:#222;font:14px/1.7 sans-serif}#feedback-dialog::backdrop{background:#0009}#feedback-dialog h2{font-size:19px;margin:0 0 12px}.feedback-consent{display:flex;align-items:flex-start;gap:8px}.feedback-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}.feedback-author{margin:16px 0 0;text-align:center;font-size:11.5px;line-height:1.6;color:#999}.feedback-actions button{padding:9px 14px;border:1px solid #aaa;border-radius:6px;background:#f1f3f5;color:#222;font:inherit}';
  style.textContent += '.feedback-invite-note{font-size:12px;color:#666}.feedback-invite-actions{justify-content:center}.feedback-invite-actions button{font-size:12px;min-height:44px;padding:8px 12px}';
  document.head.append(style);
  window.Feedback = { inviteOnce, mountBar, stage, flush, setEnabled, get enabled() { return enabled; } };
})();
