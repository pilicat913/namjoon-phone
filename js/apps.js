/* 系统应用（iOS 6 样式）：备忘录、电话、信息、日历、地图、Safari、照片、时钟、设置、天气、相机 */
(function () {
  const S = window.STORY, A = window.ASSETS, U = window.UI, { h } = U;
  const P = (window.APPS = window.APPS || {});
  const D = S.device || {};
  const CHEV = '<svg class="i-chev" viewBox="0 0 9 14"><path d="M2 2l5 5-5 5"/></svg>';
  const SEARCH = '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg>';
  const PLUS = '<path d="M12 5v14M5 12h14"/>';
  const html = (s) => h('span', { html: s, style: 'display:contents' });
  const chev = () => html(CHEV);

  /* ---------- 页面栈 ---------- */
  function Nav(win, ctx) {
    const stack = [];
    const api = {
      root(el) { el.classList.add('page'); win.append(el); stack.push(el); ctx.setTone(); return el; },
      push(el) {
        U.sound.tap();
        el.classList.add('page', 'push-in');
        const under = stack[stack.length - 1];
        under.classList.add('under');
        win.append(el); stack.push(el);
        swipe(el);
        return el;
      },
      pop() {
        if (stack.length < 2) return false;
        U.sound.tap();
        const top = stack.pop(), under = stack[stack.length - 1];
        top.classList.remove('push-in'); top.classList.add('push-out');
        under.classList.remove('under'); under.classList.add('under-back');
        setTimeout(() => { top.remove(); under.classList.remove('under-back'); }, 320);
        top._onPop && top._onPop();
        under._onShow && under._onShow();
        return true;
      },
      replaceTop(el) { const old = stack.pop(); el.classList.add('page'); old.replaceWith(el); stack.push(el); swipe(el); return el; },
      get depth() { return stack.length; },
      top: () => stack[stack.length - 1],
    };
    function swipe(page) {
      let sx = null, dx = 0;
      page.addEventListener('pointerdown', (e) => { const r = page.getBoundingClientRect(); if (e.clientX - r.left < 24) { sx = e.clientX; dx = 0; } });
      page.addEventListener('pointermove', (e) => { if (sx == null) return; dx = Math.max(0, (e.clientX - sx) / (window.__scale || 1)); page.style.transform = `translateX(${dx}px)`; });
      const end = () => { if (sx == null) return; sx = null; page.style.transform = ''; if (dx > 110) api.pop(); };
      page.addEventListener('pointerup', end); page.addEventListener('pointercancel', end);
    }
    return api;
  }
  /* 导航栏：左边是箭头返回键（或自定义按钮），中间标题，右边按钮 */
  function navBar(nav, backLabel, title, right, left) {
    return h('div', { class: 'i-nav' },
      backLabel != null ? h('button', { class: 'i-back', type: 'button', onclick: () => nav.pop() }, h('span', null, backLabel)) : (left || h('span')),
      title ? h('div', { class: 'i-title' }, title) : null,
      h('div', { class: 'i-act' }, right || null));
  }
  // 每个应用最外层左上角的返回键：回到主屏幕，颜色跟着各应用的导航栏走
  const homeBack = () => h('button', { class: 'i-back', type: 'button', 'aria-label': '回到主屏幕', onclick: () => window.Phone.home() }, h('span', null, '主屏幕'));
  const bb = (label, opts = {}) => h('button', { class: 'bb' + (opts.cls ? ' ' + opts.cls : ''), type: 'button', 'aria-label': opts.aria || null, onclick: opts.onclick || null }, label);
  const bbIcon = (inner, aria, onclick, cls = '') => h('button', { class: 'bb ' + cls, type: 'button', 'aria-label': aria, onclick, html: `<svg viewBox="0 0 24 24">${inner}</svg>` });
  const searchBar = (ph) => h('div', { class: 'i-search' }, h('div', null, html(`<svg viewBox="0 0 24 24">${SEARCH}</svg>`), ph || '搜索'));
  const tabBar = (items, active, onPick) => h('nav', { class: 'i-tabs' }, items.map(([id, label, icon]) =>
    h('button', { class: 'i-tab' + (active === id ? ' on' : ''), type: 'button', onclick: () => onPick(id) }, html(`<svg viewBox="0 0 24 24">${icon}</svg>`), label)));
  function alertBox(title, text, buttons = ['好']) {
    const wrap = h('div', { class: 'i-alert-wrap' }, h('div', { class: 'i-alert', role: 'alertdialog' }, h('h3', null, title), text ? h('p', null, text) : null,
      h('div', { class: 'ia-btns' }, buttons.map((b) => h('button', { type: 'button', onclick: () => wrap.remove() }, b)))));
    window.Phone.screen.append(wrap);
  }
  const listDay = (p) => {
    const dd = U.dayDiff(p);
    if (dd === 0) return `${U.pad(p.hh)}:${U.pad(p.mm)}`;
    if (dd === 1) return '昨天';
    if (dd < 7) return U.WD[new Date(p.y, p.m - 1, p.d).getDay()];
    return `${String(p.y).slice(2)}-${p.m}-${p.d}`;
  };
  const contact = (id) => S.contacts.find((c) => c.id === id);

  /* ============================================================
   * 备忘录（皮革 + 横线纸）
   * ============================================================ */
  P.notes = { mount(win, ctx) {
    const nav = Nav(win, ctx);
    const notes = S.notes.map((n) => ({ ...n, p: U.parse(n.at) })).sort((a, b) => b.p.t - a.p.t);
    const firstLine = (n) => n.body.split('\n').find((l) => l.trim()) || '新备忘录';
    const noteDay = (p) => { const dd = U.dayDiff(p); return dd === 0 ? `${U.pad(p.hh)}:${U.pad(p.mm)}` : dd === 1 ? '昨天' : p.y === S.now.y ? `${p.m}月${p.d}日` : `${p.y}年${p.m}月${p.d}日`; };
    const root = h('div', { class: 'ios notes' },
      navBar(nav, null, `备忘录 (${notes.length})`, bb('+', { cls: 'plus', aria: '新备忘录', onclick: () => alertBox('不能新建备忘录', '这是别人的手机。') }), homeBack()),
      searchBar(),
      h('div', { class: 'i-scroll paper' }, notes.map((n, i) => h('button', { class: 'n-row', type: 'button', onclick: () => open(i) },
        h('span', { class: 'n-t' }, firstLine(n)), h('span', { class: 'n-d' }, noteDay(n.p)), chev()))));
    nav.root(root);

    function open(i, replace) {
      const n = notes[i];
      const lines = n.body.split('\n');
      const body = h('div', { class: 'note-body' }, lines.join('\n'));
      if (n.cursor) body.append(h('span', { class: 'note-cursor' }));
      const dd = U.dayDiff(n.p);
      const go = (k) => { const j = i + k; if (j < 0 || j >= notes.length) return; U.sound.tap(); open(j, true); };
      const tool = (inner, aria, fn, off) => h('button', { type: 'button', 'aria-label': aria, class: off ? 'off' : '', onclick: fn, html: `<svg viewBox="0 0 24 24">${inner}</svg>` });
      const pg = h('div', { class: 'ios notes' },
        navBar(nav, '备忘录', firstLine(n), bb('+', { cls: 'plus', aria: '新备忘录', onclick: () => alertBox('不能新建备忘录', '这是别人的手机。') })),
        h('div', { class: 'i-scroll' }, h('div', { class: 'note-sheet' },
          h('div', { class: 'note-date' }, h('span', null, dd === 0 ? '今天' : dd === 1 ? '昨天' : `${n.p.y === S.now.y ? '' : n.p.y + '年'}${n.p.m}月${n.p.d}日`), h('span', null, `${U.pad(n.p.hh)}:${U.pad(n.p.mm)}`)),
          body)),
        h('div', { class: 'i-toolbar' },
          tool('<path d="M15 5l-7 7 7 7"/>', '上一条', () => go(-1), i === 0),
          tool('<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5L12 13l8.5-6.5"/>', '共享', () => alertBox('无法发送邮件', '这部手机没有设置邮件帐户。')),
          tool('<path d="M5 7h14M10 7V4.5h4V7M6.5 7l1 13h9l1-13"/>', '删除', () => alertBox('还是别删了', '这是南俊的备忘录。')),
          tool('<path d="M9 5l7 7-7 7"/>', '下一条', () => go(1), i === notes.length - 1)));
      if (replace) nav.replaceTop(pg); else nav.push(pg);
      window.Events && window.Events.onNoteOpened(n.id);
    }
    return { back: () => nav.pop() };
  } };

  /* ============================================================
   * 电话
   * ============================================================ */
  const PINYIN = {}; (S.contacts || []).forEach((c) => { if (c.index) PINYIN[c.id] = c.index; });
  const ICON_PHONE = '<path d="M20 16.2v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 2.3 4.8 1.8 1.8 0 0 1 4.1 3h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.8.3 1.6.6 2.4a1.8 1.8 0 0 1-.4 1.9L7.6 9.9a14.3 14.3 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.4.6a1.8 1.8 0 0 1 1.7 1.9z"/>';
  P.phone = { mount(win, ctx, opts = {}) {
    const nav = Nav(win, ctx);
    let tab = opts.tab || 'recents', filter = 'all';
    const root = h('div', { class: 'ios phone-app' });
    nav.root(root);
    const fmtDur = (s) => (s >= 60 ? `${Math.floor(s / 60)}分${s % 60}秒` : `${s}秒`);
    function render() {
      root.innerHTML = '';
      root.classList.toggle('pinstripe', false);
      if (tab === 'recents') recents();
      else if (tab === 'contacts') contacts();
      else if (tab === 'keypad') keypad();
      else if (tab === 'fav') fav();
      else voicemail();
      root.append(tabBar([
        ['fav', '个人收藏', '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>'],
        ['recents', '最近通话', '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>'],
        ['contacts', '通讯录', '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1-3.5 3.8-5.3 7-5.3s6 1.8 7 5.3"/>'],
        ['keypad', '拨号键盘', '<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.5"/></g>'],
        ['vm', '语音留言', '<circle cx="7" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M7 15.5h10"/>']],
      tab, (id) => { if (tab !== id) { tab = id; U.sound.tap(); render(); } }));
      if (tab === 'recents') { S.calls.forEach((c) => (c.seen = true)); window.Phone.refresh(); }
    }
    function recents() {
      const seg = h('div', { class: 'i-seg' },
        h('button', { class: filter === 'all' ? 'on' : '', onclick: () => { filter = 'all'; render(); } }, '全部'),
        h('button', { class: filter === 'missed' ? 'on' : '', onclick: () => { filter = 'missed'; render(); } }, '未接来电'));
      root.append(h('div', { class: 'i-nav' }, homeBack(), h('div', { style: 'position:absolute;left:0;right:0;display:flex;justify-content:center;pointer-events:none' }, h('div', { style: 'pointer-events:auto' }, seg)), h('div', { class: 'i-act' }, bb('编辑'))));
      const list = S.calls.map((c) => ({ c, p: U.parse(c[0]) })).sort((a, b) => b.p.t - a.p.t).filter((x) => filter === 'all' || x.c[2] === 'missed');
      const g = h('div', { class: 'i-plain' });
      list.forEach(({ c, p }) => {
        const ct = contact(c[1]);
        g.append(h('button', { class: 'i-row', onclick: () => ct && openContact(ct) },
          h('span', { class: 'rc-ico', html: c[2] === 'out' ? '<svg viewBox="0 0 24 24"><path d="M6 18L18 6M9 6h9v9" stroke="currentColor" stroke-width="2.6" fill="none"/></svg>' : '' }),
          h('div', { class: 'i-main' }, h('div', { class: 'i-t rc-name' + (c[2] === 'missed' ? ' missed' : '') }, ct ? ct.name : c[1]), h('div', { class: 'i-s' }, ct ? '移动电话' : (S.numberLabels[c[1]] || '未知'))),
          h('div', { class: 'i-r' }, listDay(p), h('span', { class: 'i-info' }, 'i'))));
      });
      if (!list.length) g.append(h('div', { class: 'i-empty', style: 'color:#999;text-shadow:none' }, '无未接来电'));
      root.append(h('div', { class: 'i-scroll' }, g));
    }
    function contacts() {
      root.append(navBar(nav, null, '所有联系人', bbIcon(PLUS, '添加联系人', () => alertBox('不能添加联系人', '这是别人的手机。')), homeBack()));
      root.append(searchBar());
      const sc = h('div', { class: 'i-scroll' });
      sc.append(h('div', { class: 'i-row', style: 'border-bottom:1px solid #e0e0e0' }, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, S.me.name), h('div', { class: 'i-s' }, '我的名片'))));
      const sorted = [...S.contacts].sort((a, b) => (PINYIN[a.id] || 'Z').localeCompare(PINYIN[b.id] || 'Z') || a.name.localeCompare(b.name, 'zh'));
      let cur = null;
      sorted.forEach((c) => {
        const L = PINYIN[c.id] || '#';
        if (L !== cur) { cur = L; sc.append(h('div', { class: 'i-head-bar' }, L)); }
        sc.append(h('button', { class: 'i-row', style: 'border-bottom:1px solid #e0e0e0', onclick: () => openContact(c) }, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, c.name))));
      });
      sc.append(h('div', { style: 'text-align:center;color:#999;font-size:16px;font-weight:700;padding:14px 0 24px' }, `${S.contacts.length}位联系人`));
      root.append(sc);
    }
    function openContact(c) {
      const calls = S.calls.filter((x) => x[1] === c.id).map((x) => ({ x, p: U.parse(x[0]) })).sort((a, b) => b.p.t - a.p.t);
      const av = A.avatars && A.avatars[c.id];
      const pg = h('div', { class: 'ios pinstripe phone-app' },
        navBar(nav, tab === 'contacts' ? '所有联系人' : tab === 'fav' ? '个人收藏' : '最近通话', '简介', bb('编辑')),
        h('div', { class: 'i-scroll' },
          h('div', { class: 'contact-hero' }, h('div', { class: 'ch-av' }, av ? h('img', { src: av, alt: '' }) : c.name[0]),
            h('div', null, h('div', { class: 'ch-name' }, c.name), h('div', { class: 'ch-sub' }, c.fullName && c.fullName !== c.name ? c.fullName : ''))),
          calls.length ? h('div', { class: 'i-group' }, h('div', { class: 'i-row', style: 'display:block;font-weight:400' },
            h('div', { style: 'font-size:14px;font-weight:700;margin-bottom:3px' }, `${calls[0].p.m}月${calls[0].p.d}日`),
            calls.map(({ x, p }) => h('div', { style: 'display:flex;justify-content:space-between;font-size:14px;padding:2px 0' + (x[2] === 'missed' ? ';color:#d41e1e' : '') },
              h('span', null, `${U.pad(p.hh)}:${U.pad(p.mm)}  ${x[2] === 'in' ? '呼入通话' : x[2] === 'out' ? '呼出通话' : '未接来电'}`),
              h('span', { style: 'color:#808080' }, x[3] ? fmtDur(x[3]) : ''))))) : null,
          h('div', { class: 'i-group' }, h('div', { class: 'i-row' }, h('span', { class: 'i-k' }, '移动电话'), h('div', { class: 'i-main' }, c.phone))),
          h('div', { class: 'i-group' }, h('div', { class: 'i-row' }, h('span', { class: 'i-k' }, '备注'), h('div', { class: 'i-main', style: 'font-weight:400;font-size:15px' }, c.role || ''))),
          h('div', { class: 'contact-actions' }, h('button', { type: 'button', onclick: () => window.Phone.openApp('messages') }, '发送信息'), h('button', { type: 'button', onclick: () => alertBox('FaceTime 不可用', '对方当前无法使用 FaceTime。') }, 'FaceTime')),
          h('div', { class: 'contact-actions', style: 'padding-bottom:20px' }, h('button', { type: 'button' }, '共享联系人'), h('button', { type: 'button' }, c.favorite ? '已在个人收藏' : '添加到个人收藏'))));
      nav.push(pg);
    }
    function keypad() {
      let num = '';
      const disp = h('div', { class: 'kp-num' }, '');
      const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '+'], ['#', '']];
      root.append(navBar(nav, null, '拨号键盘', null, homeBack()), h('div', { class: 'keypad', style: 'padding-top:0' }, disp,
        h('div', { class: 'kp-grid' }, keys.map(([k, l]) => h('button', { class: 'kp-k', onclick: () => { U.sound.tap(); if (num.length < 15) { num += k; disp.textContent = num; } } }, h('b', null, k), h('small', null, l)))),
        h('div', { class: 'kp-row' },
          h('button', { 'aria-label': '添加联系人', html: '<svg viewBox="0 0 24 24"><circle cx="10" cy="8.5" r="3.6"/><path d="M3.5 19.5c.8-3.6 3.4-5.6 6.5-5.6 1.5 0 2.8.4 3.9 1.2M18 13v6M15 16h6"/></svg>' }),
          h('button', { class: 'kp-call', 'aria-label': '呼叫', onclick: () => { if (num) alertBox('呼叫失败', '这部手机现在不能拨打电话。'); } }, html(`<svg viewBox="0 0 24 24">${ICON_PHONE}</svg>`), '呼叫'),
          h('button', { 'aria-label': '删除', onclick: () => { num = num.slice(0, -1); disp.textContent = num; }, html: '<svg viewBox="0 0 30 20"><path d="M9 2h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9L1 10z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 6l8 8M22 6l-8 8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>' }))));
    }
    function fav() {
      root.append(navBar(nav, null, '个人收藏', bbIcon(PLUS, '添加'), homeBack()));
      const g = h('div', { class: 'i-plain' });
      S.contacts.filter((c) => c.favorite).forEach((c) => g.append(h('button', { class: 'i-row', onclick: () => openContact(c) }, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, c.name)), h('div', { class: 'i-r' }, '移动电话', h('span', { class: 'i-info' }, 'i')))));
      root.append(h('div', { class: 'i-scroll' }, g));
    }
    function voicemail() {
      root.append(navBar(nav, null, '语音留言', bb('问候语'), homeBack()), h('div', { class: 'i-scroll' }, h('div', { class: 'i-empty', style: 'color:#999;text-shadow:none' }, '无语音留言')));
    }
    render();
    return { back: () => nav.pop() };
  } };

  /* ============================================================
   * 信息（短信，绿色玻璃气泡）
   * ============================================================ */
  P.messages = { mount(win, ctx) {
    const nav = Nav(win, ctx);
    const read = new Set(U.store.get('readSms', []));
    const threads = S.sms.map((t) => ({ ...t, isPerson: !!t.with, ms: t.messages.map((m, i) => ({ id: `${t.id}-${i}`, p: U.parse(m[0]), from: m[1], text: m[2], unread: m[3] && m[3].unread })) }))
      .sort((a, b) => b.ms[b.ms.length - 1].p.t - a.ms[a.ms.length - 1].p.t);
    const root = h('div', { class: 'ios sms' });
    nav.root(root);
    function render() {
      root.innerHTML = '';
      root.append(navBar(nav, null, '信息', bbIcon('<path d="M4 20h4l11-11-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>', '新信息'), homeBack()));
      const g = h('div', { class: 'i-scroll i-plain' });
      threads.forEach((t) => {
        const last = t.ms[t.ms.length - 1];
        const un = t.ms.some((m) => m.unread && !read.has(m.id));
        g.append(h('button', { class: 'i-row', style: 'align-items:flex-start;padding-left:22px', onclick: () => open(t) },
          un ? h('span', { class: 's-dot', style: 'position:absolute;left:6px;top:16px' }) : null,
          h('div', { class: 'i-main' },
            h('div', { style: 'display:flex;justify-content:space-between;gap:8px;align-items:center' }, h('span', { class: 's-name' }, t.name), h('span', { class: 's-time', style: 'display:flex;gap:6px;align-items:center' }, listDay(last.p), chev())),
            h('div', { class: 's-prev' }, last.text))));
      });
      root.append(g);
    }
    function open(t) {
      t.ms.forEach((m) => read.add(m.id)); U.store.set('readSms', [...read]); window.Phone.refresh();
      const box = h('div', { class: 'st-msgs' });
      let lastT = 0;
      t.ms.forEach((m) => {
        if (m.p.t - lastT > 3600e3) box.append(h('div', { class: 'st-stamp' }, `${m.p.y}年${m.p.m}月${m.p.d}日 ${U.pad(m.p.hh)}:${U.pad(m.p.mm)}`));
        lastT = m.p.t;
        box.append(h('div', { class: 'st-b ' + (m.from === 'me' ? 'me' : 'them') }, m.text));
      });
      // 短信可以发出去，但不会有回复
      (U.store.get('smsSent', {})[t.id] || []).forEach(([at, text]) => { const p = U.parse(at); box.append(h('div', { class: 'st-b me' }, text)); });
      const field = h('input', { class: 'st-field', type: 'text', placeholder: '短信', enterkeyhint: 'send', maxlength: '300', 'aria-label': '输入短信' });
      const sendBtn = h('button', { class: 'st-send', type: 'button' }, '发送');
      const sync = () => sendBtn.classList.toggle('on', field.value.trim().length > 0);
      const send = () => {
        const text = field.value.trim(); if (!text) return;
        field.value = ''; sync();
        const n = S.now, at = `${n.y}-${U.pad(n.m)}-${U.pad(n.d)} ${U.pad(n.hh)}:${U.pad(n.mm)}`;
        const all = U.store.get('smsSent', {}); all[t.id] = [...(all[t.id] || []), [at, text]]; U.store.set('smsSent', all);
        box.append(h('div', { class: 'st-b me', style: 'animation:arrive .3s' }, text));
        box.scrollTop = box.scrollHeight;
      };
      field.addEventListener('input', sync);
      field.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); send(); } });
      sendBtn.addEventListener('pointerdown', (e) => e.preventDefault());
      sendBtn.addEventListener('click', send);
      const input = h('div', { class: 'st-input' }, h('span', { class: 'st-cam', html: '<svg viewBox="0 0 18 14"><path d="M2 3h3l1.5-2h5L13 3h3a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 16 13H2A1.5 1.5 0 0 1 .5 11.5v-7A1.5 1.5 0 0 1 2 3zm7 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6z"/></svg>' }), field, sendBtn);
      const pg = h('div', { class: 'ios sms sms-thread' },
        navBar(nav, '信息', t.name, bb('联系人')),
        box,
        input);
      pg._onPop = () => setTimeout(render, 330);
      nav.push(pg);
      const opened = U.store.get('openedSmsThreads', {}), visited = !!opened[t.id || t.name];
      U.store.set('openedSmsThreads', { ...opened, [t.id || t.name]: true });
      requestAnimationFrame(() => (box.scrollTop = visited ? box.scrollHeight : 0));
    }
    render();
    return { back: () => nav.pop() };
  } };

  /* ============================================================
   * 日历
   * ============================================================ */
  P.calendar = { mount(win, ctx) {
    const nav = Nav(win, ctx);
    let ym = { y: S.now.y, m: S.now.m };
    let sel = { y: S.now.y, m: S.now.m, d: S.now.d };
    const root = h('div', { class: 'ios cal' });
    nav.root(root);
    function eventsOn(y, m, d) {
      const key = `${y}-${U.pad(m)}-${U.pad(d)}`;
      const dt = new Date(y, m - 1, d);
      const out = S.events.filter((e) => e[0] === key);
      S.events.filter((e) => e[0].startsWith('weekly-')).forEach((e) => { if (dt.getDay() === Number(e[0].split('-')[1])) out.push(e); });
      return out.sort((a, b) => (a[1] === '全天' ? -1 : b[1] === '全天' ? 1 : a[1].localeCompare(b[1])));
    }
    function render() {
      root.innerHTML = '';
      const first = new Date(ym.y, ym.m - 1, 1).getDay();
      const days = new Date(ym.y, ym.m, 0).getDate();
      const prevDays = new Date(ym.y, ym.m - 1, 0).getDate();
      const move = (k) => { ym.m += k; if (ym.m < 1) { ym.m = 12; ym.y--; } if (ym.m > 12) { ym.m = 1; ym.y++; } U.sound.tap(); render(); };
      root.append(navBar(nav, null, '日历', bbIcon(PLUS, '新建日程', () => alertBox('不能新建日程', '这是别人的手机。')), homeBack()));
      const grid = h('div', { class: 'c-grid' });
      for (let i = 0; i < first; i++) grid.append(h('div', { class: 'c-d blank' }, prevDays - first + 1 + i));
      for (let d = 1; d <= days; d++) {
        const isToday = ym.y === S.now.y && ym.m === S.now.m && d === S.now.d;
        const isSel = ym.y === sel.y && ym.m === sel.m && d === sel.d;
        grid.append(h('button', { class: 'c-d' + (isToday ? ' today' : '') + (isSel ? ' sel' : ''), onclick: () => { sel = { y: ym.y, m: ym.m, d }; U.sound.tap(); render(); } },
          d, eventsOn(ym.y, ym.m, d).length ? h('i') : null));
      }
      const tail = (7 - ((first + days) % 7)) % 7;
      for (let i = 1; i <= tail; i++) grid.append(h('div', { class: 'c-d blank' }, i));
      const list = h('div', { class: 'c-list' });
      const evs = eventsOn(sel.y, sel.m, sel.d);
      list.append(h('div', { class: 'i-head-bar' }, `${sel.y}年${sel.m}月${sel.d}日 ${U.WD[new Date(sel.y, sel.m - 1, sel.d).getDay()]}`));
      if (!evs.length) list.append(h('div', { class: 'c-none' }, '无日程'));
      evs.forEach((e) => {
        const c = S.calendars[e[3]];
        list.append(h('div', { class: 'c-ev' }, h('div', { class: 'c-time' }, e[1]), h('span', { class: 'c-bar', style: `background:${c.color}` }), h('div', null, h('div', null, e[2]), h('div', { class: 'c-cal' }, c.name))));
      });
      root.append(h('div', { class: 'c-head' },
        h('div', { class: 'c-month' },
          h('button', { 'aria-label': '上个月', onclick: () => move(-1), html: '<svg viewBox="0 0 14 16"><path d="M12 1L2 8l10 7z"/></svg>' }), `${ym.y}年${ym.m}月`,
          h('button', { 'aria-label': '下个月', onclick: () => move(1), html: '<svg viewBox="0 0 14 16"><path d="M2 1l10 7-10 7z"/></svg>' })),
        h('div', { class: 'c-wd' }, ['日', '一', '二', '三', '四', '五', '六'].map((w) => h('span', null, w)))),
      h('div', { class: 'i-scroll' }, grid, list),
      h('div', { class: 'i-toolbar' }, bb('今天', { onclick: () => { ym = { y: S.now.y, m: S.now.m }; sel = { y: S.now.y, m: S.now.m, d: S.now.d }; render(); } }),
        h('div', { class: 'i-seg' }, h('button', null, '列表'), h('button', null, '日'), h('button', { class: 'on' }, '月')), h('span', { style: 'width:46px' })));
      let sx = null;
      grid.addEventListener('pointerdown', (e) => (sx = e.clientX));
      grid.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60) move(dx < 0 ? 1 : -1); });
    }
    render();
    return { back: () => nav.pop() };
  } };

  /* ============================================================
   * 地图（iOS 6 地图：图钉、气泡、步行路线、书签）
   * ============================================================ */
  const PL = S.places || {};
  const MAP_SVG = () => `<svg viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice">
    <rect width="360" height="640" fill="#f1eee6"/>
    <path d="M-20 150 C 60 120, 140 175, 220 150 S 340 95, 400 120 L 400 175 C 330 150, 270 215, 200 205 S 50 185, -20 215 Z" fill="#a9cbe8"/>
    <path d="M40 186 q30 -12 70 0 l-6 40 q-40 8 -66 -6 z" fill="#c6e3ae"/>
    <path d="M250 560 q50 -14 90 18 l-8 48 q-58 12 -86 -22 z" fill="#c6e3ae"/>
    <rect x="270" y="225" width="34" height="26" fill="#e8dcc9"/><rect x="215" y="338" width="34" height="28" fill="#e8dcc9"/>
    <g stroke="#d7d1c4" stroke-width="10" fill="none" stroke-linecap="round">
      <path d="M-10 268 L 380 252"/><path d="M-10 330 L 380 330"/><path d="M-10 410 L 380 395"/><path d="M-10 500 L 380 480"/>
      <path d="M90 230 L 70 660"/><path d="M150 230 L 150 660"/><path d="M204 230 L 214 660"/><path d="M300 230 L 320 660"/>
    </g>
    <g stroke="#fff" stroke-width="7.5" fill="none" stroke-linecap="round">
      <path d="M-10 268 L 380 252"/><path d="M-10 330 L 380 330"/><path d="M-10 410 L 380 395"/><path d="M-10 500 L 380 480"/>
      <path d="M90 230 L 70 660"/><path d="M150 230 L 150 660"/><path d="M204 230 L 214 660"/><path d="M300 230 L 320 660"/>
    </g>
    <path d="M-10 228 C 100 222, 250 222, 380 230" stroke="#e4a93a" stroke-width="12" fill="none"/>
    <path d="M-10 228 C 100 222, 250 222, 380 230" stroke="#f8d16a" stroke-width="9" fill="none"/>
    <path d="M250 -10 L 262 660" stroke="#e4a93a" stroke-width="11" fill="none"/><path d="M250 -10 L 262 660" stroke="#f8d16a" stroke-width="8" fill="none"/>
    <g stroke="#fff" stroke-width="3.5" fill="none"><path d="M-10 290 L 380 288"/><path d="M-10 370 L 380 362"/><path d="M-10 450 L 380 440"/><path d="M120 236 L 112 660"/><path d="M178 236 L 184 660"/><path d="M276 236 L 290 660"/></g>
    <g font-family="Helvetica Neue,Helvetica,Heiti SC,sans-serif" font-size="11" fill="#6c6a64" font-weight="700" stroke="#f6f4ee" stroke-width="3" paint-order="stroke">
      ${(PL.labels || []).map(([x, y, t]) => `<text x="${x}" y="${y}">${t}</text>`).join('')}
    </g>
    <g font-family="Helvetica Neue,Helvetica,Heiti SC,sans-serif" font-size="8.5" fill="#7b6f5c" stroke="#f6f4ee" stroke-width="2.4" paint-order="stroke">
      ${Object.entries(PL.pins || {}).map(([n, v]) => `<circle cx="${v.at[0]}" cy="${v.at[1]}" r="2.6" fill="#b19c7a" stroke="#fff" stroke-width="1"/><text x="${v.at[0] + 5}" y="${v.at[1] + 3}">${n}</text>`).join('')}
    </g>
    <path class="m-routeline" d="" stroke="#6b5be0" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
  </svg>`;
  P.maps = { mount(win, ctx) {
    const root = h('div', { class: 'ios maps page' });
    win.append(root); ctx.setTone();
    const canvas = h('div', { class: 'm-canvas' });
    // world 里放底图和图钉；拖动、缩放只改 world 的 transform
    const world = h('div', { class: 'm-world', html: MAP_SVG() });
    const layer = h('div', { class: 'm-layer' });
    world.append(layer); canvas.append(world);
    const field = h('div', { class: 'i-search-field' }, html(`<svg viewBox="0 0 24 24">${SEARCH}</svg>`), h('span', null, '搜索或输入地址'));
    function toScreen([x, y]) { // 底图按 360×640 设计（slice 铺满），换算成 world 里的像素位置
      const w = canvas.clientWidth, hh = canvas.clientHeight, s = Math.max(w / 360, hh / 640);
      return [(w - 360 * s) / 2 + x * s, (hh - 640 * s) / 2 + y * s];
    }
    const PIN = (c) => `<svg viewBox="0 0 20 38"><line x1="10" y1="16" x2="10" y2="37" stroke="#888" stroke-width="2"/><circle cx="10" cy="9" r="8" fill="${c}" stroke="rgba(0,0,0,.35)"/><circle cx="7.5" cy="6.5" r="2.6" fill="#fff" opacity=".7"/></svg>`;
    // 标记挂在一个零尺寸的锚点上，锚点反向缩放，所以放大地图时图钉大小不变
    function mark(el, at) { const anc = h('div', { class: 'm-anc', 'data-at': JSON.stringify(at) }, el); place(anc, at); layer.append(anc); return el; }
    function place(el, at) { const [x, y] = toScreen(at); el.style.left = x + 'px'; el.style.top = y + 'px'; }
    function relayout() { layer.querySelectorAll('.m-anc').forEach((el) => place(el, JSON.parse(el.dataset.at))); }
    let dot = null;
    function clearMarks() { layer.innerHTML = ''; dot = null; route.hidden = true; steps.hidden = true; drawRoute(null); showDot(); }
    function showDot() { if (dot || !PL.me) return; dot = mark(h('div', { class: 'm-dot' }), PL.me); }
    function drop(name, color = '#e2372b') {
      const info = (PL.pins || {})[name];
      if (!info) { const far = (PL.far || {})[name]; if (far) { clearMarks(); route.innerHTML = ''; route.append(h('b', null, name), far.sub, h('br'), far.route); route.hidden = false; field.lastChild.textContent = name; } return; }
      clearMarks();
      mark(h('div', { class: 'm-pin', html: PIN(color) }), info.at);
      mark(h('div', { class: 'm-callout' }, h('div', null, h('b', null, name), info.sub ? h('small', null, info.sub) : null),
        h('button', { class: 'i-info', type: 'button', style: 'width:24px;height:24px;font-size:14px', onclick: (e) => { e.stopPropagation(); alertBox(name, [info.sub, info.note].filter(Boolean).join('\n')); } }, '›')), info.at);
      field.lastChild.textContent = name; field.style.color = '#222';
      centerOn(info.at);
    }
    function drawRoute(r) {
      const line = world.querySelector('.m-routeline');
      if (line) line.setAttribute('d', r ? 'M' + r.path.map((p) => p.join(' ')).join(' L ') : '');
    }
    const route = h('div', { class: 'm-route', hidden: true });
    const steps = h('div', { class: 'm-steps', hidden: true });
    function showRoute() {
      const r = PL.route; if (!r) return;
      clearMarks(); drawRoute(r);
      const a = PL.pins[r.from], b = PL.pins[r.to];
      mark(h('div', { class: 'm-pin', html: PIN('#3fae2a') }), a.at); mark(h('div', { class: 'm-pin', html: PIN('#e2372b') }), b.at);
      route.innerHTML = ''; route.append(h('b', null, `${r.from} → ${r.to}`), `步行 ${r.mins} 分钟 · ${r.dist}`); route.hidden = false;
      steps.innerHTML = ''; r.steps.forEach((st, i) => steps.append(h('div', null, h('i', null, i + 1), st))); steps.hidden = false;
      field.lastChild.textContent = `${r.from} → ${r.to}`;
    }

    /* ---------- 拖动与缩放（单指拖、双指捏、滚轮、双击放大） ---------- */
    let z = 1, tx = 0, ty = 0;
    const MAXZ = 3.5;
    function clamp() {
      const w = canvas.clientWidth, hh = canvas.clientHeight;
      z = Math.max(1, Math.min(MAXZ, z));
      tx = Math.min(0, Math.max(w - w * z, tx)); ty = Math.min(0, Math.max(hh - hh * z, ty));
    }
    function apply(anim) {
      clamp();
      world.style.transition = anim ? 'transform .3s var(--ease-out)' : 'none';
      world.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
      world.style.setProperty('--iz', 1 / z);
    }
    function zoomAt(nz, cx, cy, anim) { nz = Math.max(1, Math.min(MAXZ, nz)); tx = cx - (cx - tx) * (nz / z); ty = cy - (cy - ty) * (nz / z); z = nz; apply(anim); }
    function centerOn(at) { if (z <= 1.01) zoomAt(1.8, ...toScreenCanvas(at), true); const [x, y] = toScreen(at); tx = canvas.clientWidth / 2 - x * z; ty = canvas.clientHeight * .45 - y * z; apply(true); }
    const toScreenCanvas = (at) => { const [x, y] = toScreen(at); return [x * z + tx, y * z + ty]; };
    const pts = new Map(); let pinch = null, moved = false, last = null;
    const local = (e) => { const r = canvas.getBoundingClientRect(), sc = window.__scale || 1; return [(e.clientX - r.left) / sc, (e.clientY - r.top) / sc]; };
    canvas.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, .m-route, .m-steps, .m-curl')) return;
      pts.set(e.pointerId, local(e)); moved = false;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z, mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], tx, ty }; }
      last = local(e);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      const p = local(e); pts.set(e.pointerId, p);
      if (pts.size >= 2 && pinch) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]), mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        const nz = Math.max(1, Math.min(MAXZ, pinch.z * d / pinch.d));
        tx = mid[0] - (pinch.mid[0] - pinch.tx) * (nz / pinch.z); ty = mid[1] - (pinch.mid[1] - pinch.ty) * (nz / pinch.z); z = nz; moved = true; apply(false);
      } else if (pts.size === 1 && last) {
        const dx = p[0] - last[0], dy = p[1] - last[1];
        if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
        tx += dx; ty += dy; last = p; apply(false);
      }
    });
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; last = pts.size ? [...pts.values()][0] : null; };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); const [x, y] = local(e); zoomAt(z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), x, y, false); }, { passive: false });
    canvas.addEventListener('dblclick', (e) => { const [x, y] = local(e); zoomAt(z * 1.8, x, y, true); });
    canvas.addEventListener('click', (e) => { if (moved) return; if (!e.target.closest('.m-callout, .m-pin, button, .m-route, .m-steps, .m-curl')) layer.querySelectorAll('.m-callout').forEach((c) => c.parentNode.remove()); });

    function bookmarks() {
      U.sound.tap();
      let seg = 'fav';
      const body = h('div', { class: 'i-scroll' });
      const sheet = h('div', { class: 'ios maps-list' });
      const title = h('div', { class: 'i-title' }, '书签');
      const paint = () => {
        body.innerHTML = ''; title.textContent = seg === 'fav' ? '书签' : '最近搜索';
        if (seg === 'fav') {
          body.append(h('div', { class: 'i-plain' }, (PL.favorites || []).map((name) => {
            const info = (PL.pins || {})[name] || (PL.far || {})[name] || {};
            return h('button', { class: 'i-row', onclick: () => { sheet.remove(); drop(name, '#7a4bd6'); } }, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, name), h('div', { class: 'i-s' }, info.sub || '')), h('span', { class: 'i-info' }, '›'));
          })));
        } else {
          body.append(h('div', { class: 'i-plain' }, (PL.recents || []).map(([at, name, sub]) => {
            const p = U.parse(at);
            return h('button', { class: 'i-row', onclick: () => { sheet.remove(); if (sub && sub.includes('→')) showRoute(); else drop(name); } }, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, name), h('div', { class: 'i-s' }, [sub, `${p.m}月${p.d}日`].filter(Boolean).join(' · '))));
          })));
        }
      };
      const segEl = h('div', { class: 'i-seg' }, h('button', { class: 'on', onclick: (e) => { seg = 'fav'; segEl.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === e.currentTarget)); paint(); } }, '书签'),
        h('button', { onclick: (e) => { seg = 'recent'; segEl.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === e.currentTarget)); paint(); } }, '最近搜索'));
      sheet.append(h('div', { class: 'i-nav' }, h('span'), title, h('div', { class: 'i-act' }, bb('完成', { cls: 'blue', onclick: () => sheet.remove() }))), body,
        h('div', { class: 'i-toolbar', style: 'justify-content:center' }, segEl));
      paint(); root.append(sheet);
    }
    root.append(h('div', { class: 'i-nav m-top' }, homeBack(), field,
      bbIcon('<path d="M5 3.5h11a2 2 0 0 1 2 2V21l-7.5-4L3 21V5.5a2 2 0 0 1 2-2z"/>', '书签', bookmarks)));
    root.append(canvas,
      h('div', { class: 'i-toolbar' }, h('button', { 'aria-label': '当前位置', onclick: () => { U.sound.tap(); clearMarks(); z = 1; tx = 0; ty = 0; apply(true); field.lastChild.textContent = '搜索或输入地址'; field.style.color = ''; }, html: '<svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l7.5 2.5L13 21z" fill="#fff"/></svg>' }),
        h('span', { class: 'tb-label' }, '首尔 · 江南区'), bb('路线', { onclick: () => { U.sound.tap(); showRoute(); } })));
    canvas.append(route, steps, h('div', { class: 'm-curl', title: '地图选项', onclick: () => alertBox('地图', '标准 · 卫星 · 混合\n（这部手机只存了标准地图）') }));
    const ro = new ResizeObserver(() => { relayout(); apply(false); }); ro.observe(canvas);
    requestAnimationFrame(() => { apply(false); showDot(); });
    return { back: () => { const sh = root.querySelector('.maps-list'); if (sh) { sh.remove(); return true; } return false; }, destroy: () => ro.disconnect() };
  } };

  /* ============================================================
   * Safari（停在上次看的那一页；书签里有历史记录）
   * ============================================================ */
  P.safari = { mount(win, ctx) {
    const items = S.searches.map((s) => ({ ...s, p: U.parse(s.at) })).sort((a, b) => b.p.t - a.p.t);
    const site = D.searchSite || 'search.example.kr';
    const root = h('div', { class: 'ios saf page' });
    win.append(root); ctx.setTone();
    const title = h('div', { class: 'sf-title' });
    const url = h('div', { class: 'sf-url' }, h('span'));
    const top = h('div', { class: 'sf-top' }, h('div', { class: 'sf-head' }, homeBack(), title), h('div', { class: 'sf-fields' }, url, h('div', { class: 'sf-q' }, html(`<svg viewBox="0 0 24 24">${SEARCH}</svg>`), '搜索')));
    const view = h('div', { class: 'i-scroll sf-page' });
    const back = h('button', { 'aria-label': '后退', onclick: () => go(-1), html: '<svg viewBox="0 0 24 24"><path d="M17 4L6 12l11 8z" fill="#fff"/></svg>' });
    const fwd = h('button', { 'aria-label': '前进', onclick: () => go(1), html: '<svg viewBox="0 0 24 24"><path d="M7 4l11 8-11 8z" fill="#fff"/></svg>' });
    root.append(top, view, h('div', { class: 'i-toolbar' }, back, fwd,
      h('button', { 'aria-label': '共享', onclick: () => alertBox('无法共享', '这部手机没有设置邮件帐户。'), html: '<svg viewBox="0 0 24 24"><path d="M5 10v10h14V10M12 15V3M8 7l4-4 4 4"/></svg>' }),
      h('button', { 'aria-label': '书签', onclick: () => bookmarks(), html: '<svg viewBox="0 0 24 24"><path d="M12 6c-2-1.6-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6-.1-8 1.5zM12 6v14"/></svg>' }),
      h('button', { 'aria-label': '页面', html: '<svg viewBox="0 0 24 24"><rect x="5" y="7" width="12" height="13" rx="1"/><path d="M8 7V4h11v13h-2"/></svg>' })));
    let hist = [], at = -1;
    function show(state) {
      view.innerHTML = ''; view.scrollTop = 0;
      if (state.kind === 'results') {
        const it = state.item;
        title.textContent = `${it.q} - 搜索`; url.firstChild.textContent = `${site}/search?q=${it.q}`;
        view.append(h('div', { class: 'sr-logo' }, 'Sea', h('span', null, 'r'), 'ch'),
          h('div', { class: 'sr-head' }, h('span', null, `“${it.q}”`), h('span', null, `约 ${(it.q.length * 3721 % 90000 + 1200).toLocaleString('en-US')} 条结果`)),
          it.results.map((r) => h('div', { class: 'sr', onclick: () => r[3] ? open({ kind: 'page', item: it, page: r[3], site: r[1] }) : null },
            h('div', { class: 'sr-t' }, r[0]), h('div', { class: 'sr-site' }, r[1]), r[2] ? h('div', { class: 'sr-d' }, r[2]) : null)));
      } else {
        const pg = state.page;
        title.textContent = pg.title; url.firstChild.textContent = `${state.site === '知识问答' ? 'qna' : 'page'}.example.kr/view`;
        view.append(h('div', { class: 'art' }, h('h1', null, pg.title), h('div', { class: 'art-meta' }, pg.meta || state.site), (pg.body || []).map((t) => h('p', null, t)),
          pg.comments ? h('div', { class: 'art-c' }, h('div', { style: 'border:0;font-weight:700;color:#333' }, `回答 ${pg.comments.length}`), pg.comments.map(([who, t]) => h('div', null, h('b', null, who), t))) : null));
      }
      back.classList.toggle('off', at <= 0); fwd.classList.toggle('off', at >= hist.length - 1);
    }
    function open(state) { hist = hist.slice(0, at + 1); hist.push(state); at = hist.length - 1; U.sound.tap(); show(state); }
    function go(k) { const n = at + k; if (n < 0 || n >= hist.length) return; at = n; U.sound.tap(); show(hist[at]); }
    function bookmarks() {
      U.sound.tap();
      const sheet = h('div', { class: 'ios maps-list', style: 'background:#fff' });
      const body = h('div', { class: 'i-scroll i-plain' });
      const listRoot = () => {
        body.innerHTML = '';
        sheet.querySelector('.i-title').textContent = '书签';
        body.append(h('button', { class: 'i-row', onclick: () => listHistory() }, html('<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#5a6f8f" stroke-width="1.8"><path d="M3 7h7l2 2h9v10H3z"/></svg>'), h('div', { class: 'i-main' }, '历史记录'), chev()));
        (S.bookmarks || []).forEach(([name, host]) => body.append(h('button', { class: 'i-row', onclick: () => alertBox('无法打开网页', `无法连接到 ${host}。`) },
          html('<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#5a6f8f" stroke-width="1.8"><path d="M12 6c-2-1.6-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6-.1-8 1.5zM12 6v14"/></svg>'), h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, name), h('div', { class: 'i-s' }, host)))));
      };
      const listHistory = () => {
        body.innerHTML = '';
        sheet.querySelector('.i-title').textContent = '历史记录';
        body.append(h('button', { class: 'i-row', style: 'color:#385487', onclick: listRoot }, '‹ 书签'));
        let cur = null;
        items.forEach((it) => {
          const dd = U.dayDiff(it.p);
          const sec = dd === 0 ? '今天' : dd === 1 ? '昨天' : `${it.p.y}年${it.p.m}月${it.p.d}日`;
          if (sec !== cur) { cur = sec; body.append(h('div', { class: 'i-head-bar' }, sec)); }
          body.append(h('button', { class: 'i-row', onclick: () => { sheet.remove(); open({ kind: 'results', item: it }); } }, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, `${it.q} - 搜索`), h('div', { class: 'i-s' }, site))));
        });
      };
      sheet.append(h('div', { class: 'i-nav' }, bb('编辑'), h('div', { class: 'i-title' }, '书签'), h('div', { class: 'i-act' }, bb('完成', { cls: 'blue', onclick: () => sheet.remove() }))), body);
      listRoot(); root.append(sheet);
    }
    // 打开时停在最后看过的网页：最近一次搜索点进去的那个回答
    const last = items[0];
    hist = [{ kind: 'results', item: last }]; at = 0;
    const firstPage = last.results.find((r) => r[3]);
    if (firstPage) { hist.push({ kind: 'page', item: last, page: firstPage[3], site: firstPage[1] }); at = 1; }
    show(hist[at]);
    return { back: () => { const s = root.querySelector('.maps-list'); if (s) { s.remove(); return true; } if (at > 0) { go(-1); return true; } return false; } };
  } };

  /* ============================================================
   * 照片
   * ============================================================ */
  P.photos = { mount(win, ctx) {
    const nav = Nav(win, ctx);
    const list = (A.album || []).map((x, i) => ({ ...x, i, p: U.parse(x.date) })).sort((a, b) => a.p.t - b.p.t);
    let tab = 'albums';
    const root = h('div', { class: 'ios photos' });
    nav.root(root);
    function render() {
      root.innerHTML = '';
      root.append(navBar(nav, null, tab === 'albums' ? '相簿' : '照片流', bb('编辑'), homeBack()));
      const sc = h('div', { class: 'i-scroll i-plain' });
      if (tab === 'albums') {
        const th = list.slice(-3).reverse().map((x) => h('img', { src: x.src, alt: '' }));
        sc.append(h('button', { class: 'i-row', style: 'min-height:66px', onclick: grid }, h('div', { class: 'alb-th' }, th), h('div', { class: 'i-main' }, '相机胶卷 ', h('span', { style: 'color:#808080;font-weight:400' }, `(${list.length})`)), chev()));
      } else sc.append(h('div', { class: 'i-empty', style: 'color:#999;text-shadow:none' }, '照片流已关闭'));
      root.append(sc, tabBar([['albums', '相簿', '<rect x="3" y="7" width="14" height="13" rx="1.5"/><path d="M7 4h12a2 2 0 0 1 2 2v10"/>'], ['stream', '照片流', '<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"/>']], tab, (id) => { tab = id; U.sound.tap(); render(); }));
    }
    function grid() {
      const g = h('div', { class: 'p-grid' }, list.map((x, idx) => h('div', { class: 'p-cell', onclick: () => view(idx) }, x.src ? h('img', { src: x.src, alt: '', loading: 'lazy' }) : null)));
      const sc = h('div', { class: 'i-scroll' }, g, h('div', { class: 'p-count' }, `${list.length} 张照片`));
      nav.push(h('div', { class: 'ios photos' }, navBar(nav, '相簿', '相机胶卷', bb('编辑')), sc));
      requestAnimationFrame(() => (sc.scrollTop = sc.scrollHeight));
    }
    function view(idx) {
      U.sound.tap();
      let i = idx;
      const img = h('div', { class: 'pv-img' });
      const ttl = h('div', { class: 'vt-title' });
      const pv = h('div', { class: 'pv' },
        h('div', { class: 'viewer-top pv-top' }, h('button', { type: 'button', onclick: () => close() }, '相机胶卷'), ttl, h('button', { type: 'button' }, '编辑')),
        img,
        h('div', { class: 'pv-bot' }, h('span', { html: '<svg viewBox="0 0 24 24"><path d="M5 10v10h14V10M12 15V3M8 7l4-4 4 4"/></svg>' }), h('span', { class: 'pv-play' }), h('span', { html: '<svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V4.5h4V7M6.5 7l1 13h9l1-13"/></svg>' })));
      function paint() {
        const x = list[i];
        ttl.innerHTML = ''; ttl.append(`${i + 1} / ${list.length}`, h('small', null, `${x.p.y}年${x.p.m}月${x.p.d}日`));
        img.innerHTML = ''; if (x.src) img.append(h('img', { src: x.src, alt: '' }));
      }
      const go = (k) => { const n = i + k; if (n >= 0 && n < list.length) { i = n; paint(); } };
      let sx = null;
      img.addEventListener('pointerdown', (e) => (sx = e.clientX));
      img.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); else pv.classList.toggle('bare'); });
      const key = (e) => { if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'Escape') { e.stopPropagation(); close(); } };
      document.addEventListener('keydown', key, true);
      function close() { document.removeEventListener('keydown', key, true); pv.remove(); }
      paint(); win.append(pv); pv._close = close;
    }
    render();
    return { back: () => { const pv = win.querySelector('.pv'); if (pv) { pv._close(); return true; } return nav.pop(); } };
  } };

  /* ============================================================
   * 时钟
   * ============================================================ */
  P.clock = { mount(win, ctx) {
    const nav = Nav(win, ctx);
    let tab = 'alarm', sw = null;
    const root = h('div', { class: 'ios dark clock-app' });
    nav.root(root);
    const face = (hh, mm) => {
      const night = hh < 6 || hh >= 18, fg = night ? '#fff' : '#111', bg = night ? '#111' : '#fff';
      const hA = ((hh % 12) + mm / 60) * 30, mA = mm * 6;
      let ticks = ''; for (let k = 0; k < 12; k++) ticks += `<line x1="32" y1="6" x2="32" y2="${k % 3 ? 9 : 11}" transform="rotate(${k * 30} 32 32)"/>`;
      return h('span', { class: 'wc-face', html: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${bg}" stroke="#777" stroke-width="2"/><g stroke="${fg}" stroke-width="1.6">${ticks}</g><line x1="32" y1="32" x2="32" y2="18" stroke="${fg}" stroke-width="3" stroke-linecap="round" transform="rotate(${hA} 32 32)"/><line x1="32" y1="32" x2="32" y2="10" stroke="${fg}" stroke-width="2" stroke-linecap="round" transform="rotate(${mA} 32 32)"/><circle cx="32" cy="32" r="2" fill="#e0281b"/></svg>` });
    };
    function render() {
      root.innerHTML = '';
      if (tab === 'world') world(); else if (tab === 'alarm') alarm(); else if (tab === 'sw') stopwatch(); else timer();
      root.append(tabBar([
        ['world', '世界时钟', '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.3 3.4 5.2 3.4 8.5s-1.1 6.2-3.4 8.5c-2.3-2.3-3.4-5.2-3.4-8.5S9.7 5.8 12 3.5z"/>'],
        ['alarm', '闹钟', '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2 1.5M5 4L3 6M19 4l2 2"/>'],
        ['sw', '秒表', '<circle cx="12" cy="13" r="7.5"/><path d="M12 13V9M10 3h4"/>'],
        ['timer', '计时器', '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>']], tab, (id) => { tab = id; U.sound.tap(); render(); }));
    }
    function world() {
      root.append(navBar(nav, null, '世界时钟', bbIcon(PLUS, '添加'), homeBack()));
      const sc = h('div', { class: 'i-scroll' });
      S.worldClocks.forEach((c) => {
        const d = new Date(S.now.y, S.now.m - 1, S.now.d, S.now.hh + c.offset, S.now.mm);
        const dayDelta = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(S.now.y, S.now.m - 1, S.now.d)) / 864e5);
        sc.append(h('div', { class: 'wc-row' }, face(d.getHours(), d.getMinutes()),
          h('div', { class: 'wc-main' }, h('div', { class: 'wc-c' }, c.city), h('div', { class: 'wc-sub' }, dayDelta === 0 ? '今天' : dayDelta < 0 ? '昨天' : '明天')),
          h('div', { class: 'wc-t' }, `${U.pad(d.getHours())}:${U.pad(d.getMinutes())}`)));
      });
      root.append(sc);
    }
    function alarm() {
      root.append(navBar(nav, null, '闹钟', bbIcon(PLUS, '添加闹钟', () => alertBox('不能添加闹钟', '这是别人的手机。')), homeBack()));
      const sc = h('div', { class: 'i-scroll al-list' });
      S.alarms.forEach((a) => {
        const tg = h('button', { class: 'tog' + (a.on ? ' on' : ''), 'aria-label': '开关', onclick: () => { a.on = !a.on; U.sound.tap(); U.store.set('alarms', S.alarms.map((x) => x.on)); render(); } });
        const [hh, mm] = a.time.split(':');
        sc.append(h('div', { class: 'al-row' + (a.on ? '' : ' off') }, h('div', { class: 'al-main' }, h('div', { class: 'al-t' }, `${hh}:${mm}`), h('div', { class: 'al-l' }, a.label)), tg));
      });
      root.append(sc);
    }
    function stopwatch() {
      sw = sw || { ms: 0, start: 0, timer: null, laps: [] };
      const fmt = (ms) => `${U.pad(Math.floor(ms / 60000))}:${U.pad(Math.floor(ms / 1000) % 60)}.${Math.floor(ms / 100) % 10}`;
      const cur = () => sw.ms + (sw.timer ? performance.now() - sw.start : 0);
      const t = h('div', { class: 'sw-t' }, fmt(cur()));
      const s = h('button', { class: 'sw-s' + (sw.timer ? ' run' : '') }, sw.timer ? '停止' : '开始');
      const l = h('button', { class: 'sw-l' }, sw.timer ? '计次' : '复位');
      s.onclick = () => { if (sw.timer) { sw.ms = cur(); clearInterval(sw.timer); sw.timer = null; } else { sw.start = performance.now(); sw.timer = setInterval(() => { const el = root.querySelector('.sw-t'); if (el) el.textContent = fmt(cur()); }, 50); } render(); };
      l.onclick = () => { if (sw.timer) { sw.laps.unshift(cur()); render(); } else { sw.ms = 0; sw.laps = []; render(); } };
      root.append(navBar(nav, null, '秒表', null, homeBack()), h('div', { class: 'sw' }, h('div', { class: 'sw-disp' }, t), h('div', { class: 'sw-btns' }, l, s),
        h('div', { class: 'sw-laps i-plain' }, sw.laps.map((ms, k) => h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, `计次 ${sw.laps.length - k}`), h('div', { class: 'i-r', style: 'color:#000' }, fmt(ms)))))));
    }
    function timer() {
      root.append(navBar(nav, null, '计时器', null, homeBack()), h('div', { class: 'sw' },
        h('div', { class: 'tm-picker' }, h('div', { class: 'tm-col' }, '23', h('b', null, '0 小时'), '1'), h('div', { class: 'tm-col' }, '14', h('b', null, '15 分钟'), '16'), h('div', { class: 'tm-band' })),
        h('div', { class: 'i-group', style: 'margin:0 12px' }, h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, '计时结束时'), h('div', { class: 'i-r' }, '雷达', html(CHEV)))),
        h('div', { class: 'sw-btns', style: 'margin-top:14px;background:none;border:0' }, h('button', { class: 'sw-s', onclick: () => alertBox('计时器', '先不打扰他了。') }, '开始'))));
    }
    render();
    return { back: () => false, destroy: () => { if (sw && sw.timer) clearInterval(sw.timer); } };
  } };

  /* ============================================================
   * 设置（条纹分组表格）
   * ============================================================ */
  P.settings = { mount(win, ctx) {
    const nav = Nav(win, ctx);
    const ic = (bg, inner) => h('span', { class: 'i-ico', style: `background:${bg}`, html: `<svg viewBox="0 0 24 24">${inner}</svg>` });
    const row = (icon, label, right, onclick) => h('button', { class: 'i-row', type: 'button', onclick }, icon, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, label)), h('div', { class: 'i-r' }, right || '', html(CHEV)));
    const info = (k, v) => h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, k), h('div', { class: 'i-r' }, v));
    const credit = () => (S.credit && S.credit.length) ? h('p', { class: 'credit' }, ...S.credit.flatMap((t, i) => (i ? [h('br'), t] : [t]))) : null;
    const root = h('div', { class: 'ios pinstripe settings' },
      navBar(nav, null, '设置', null, homeBack()),
      h('div', { class: 'i-scroll' },
        jumpRowGroup(),
        h('div', { class: 'i-group' }, row(ic('#d13326', '<path d="M5 12a7 7 0 1 0 2-4.9"/><path d="M5 4v4h4"/>'), '重新开始', '', () => restartAsk())),
        h('div', { class: 'i-group' },
          h('div', { class: 'i-row' }, ic('#f39a1e', '<path d="M3 15l7-2 4-9 2 1-2 9 6 3-1 2-6-2-4 6-2-1 2-6-5 1z" fill="#fff" stroke="none"/>'), h('div', { class: 'i-main' }, '飞行模式'), h('span', { class: 'tog' })),
          row(ic('#2a7fe6', '<path d="M4 9.5a11.5 11.5 0 0 1 16 0M7 12.6a7.2 7.2 0 0 1 10 0M10 15.6a3 3 0 0 1 4 0"/>'), '无线局域网', D.wifi || ''),
          row(ic('#2a7fe6', '<path d="M7 7l10 10-5 4V3l5 4L7 17"/>'), '蓝牙', '关闭'),
          row(ic('#3fae2a', '<path d="M6 18V14M10 18v-6M14 18V9M18 18V6"/>'), '运营商', 'SKTelecom')),
        h('div', { class: 'i-group' },
          row(ic('#d13326', '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 9h8M8 13h5"/>'), '通知'),
          h('div', { class: 'i-row' }, ic('#6a4bd0', '<path d="M17 15.5A7 7 0 0 1 8.5 7a7 7 0 1 0 8.5 8.5z" fill="#fff" stroke="none"/>'), h('div', { class: 'i-main' }, '勿扰模式'), h('span', { class: 'tog' }))),
        h('div', { class: 'i-group' },
          row(ic('#8a9097', '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'), '通用', '', () => general()),
          row(ic('#d13326', '<path d="M5 10h3l5-4v12l-5-4H5z" fill="#fff"/><path d="M16 9a4 4 0 0 1 0 6"/>'), '声音', '', () => soundSettings()),
          row(ic('#2a7fe6', '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>'), '亮度与墙纸'),
          row(ic('#5a6f8f', '<path d="M7 11V8a5 5 0 0 1 10 0v3"/><rect x="5" y="11" width="14" height="9" rx="1.5" fill="#fff"/>'), '隐私')),
        h('div', { class: 'i-group' },
          row(ic('#5aa6ef', '<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z" fill="#fff"/>'), 'iCloud'),
          row(ic('#3a7fe0', '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3.5 7L12 13l8.5-6"/>'), '邮件、通讯录、日历'),
          row(ic('#e3b93a', '<path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h3"/>'), '备忘录'),
          row(ic('#3fae2a', '<path d="M20 11.5c0 4-3.6 7-8 7-1 0-1.9-.1-2.7-.4L4.5 19.5l1.3-3.3C4.7 14.9 4 13.3 4 11.5c0-4 3.6-7 8-7s8 3 8 7z" fill="#fff"/>'), '信息'),
          row(ic('#3fae2a', ICON_PHONE.replace('<path', '<path fill="#fff"')), '电话'),
          row(ic('#2a7fe6', '<circle cx="12" cy="12" r="8"/><path d="M15.5 8.5L13 13l-4.5 2.5L11 11z" fill="#fff"/>'), 'Safari')),
        credit()));
    nav.root(root);
    /* 跳转时间：设置图标上的 1 和这一行的红点，点开过就消失 */
    function jumpRowGroup() {
      const dot = !U.store.get('jumpSeen', false) ? h('span', { class: 'st-dot' }, '1') : null;
      const done = window.Debut && window.Debut.jumped;
      return h('div', { class: 'i-group' }, h('button', { class: 'i-row', type: 'button', onclick: () => jumpPage() },
        ic('#6a4bd0', '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>'), h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, '跳转时间')),
        h('div', { class: 'i-r' }, dot, done ? '6月13日' : '6月12日', html(CHEV))));
    }
    function restartAsk() {
      const wrap = h('div', { class: 'i-alert-wrap' }, h('div', { class: 'i-alert', role: 'alertdialog' }, h('h3', null, '重新开始？'), h('p', null, '聊天记录、他们记住的名字、跳转的日期都会清空，手机回到刚捡到的样子。'),
        h('div', { class: 'ia-btns' }, h('button', { type: 'button', onclick: () => wrap.remove() }, '取消'), h('button', { type: 'button', onclick: () => {
          wrap.remove(); try { window.Music && window.Music.stop ? window.Music.stop() : document.querySelectorAll('audio').forEach((a) => a.pause()); } catch (e) {}
          U.store.reset(); location.reload();
        } }, '重新开始'))));
      window.Phone.screen.append(wrap);
    }
    function jumpPage() {
      if (!U.store.get('jumpSeen', false)) { U.store.set('jumpSeen', true); window.Phone.refresh(); const d = root.querySelector('.st-dot'); if (d) d.remove(); }
      const done = window.Debut && window.Debut.jumped;
      const check = '<svg viewBox="0 0 16 13" width="16" height="13"><path d="M1.5 7l4.5 4.5L14.5 1.5" fill="none" stroke="#385487" stroke-width="2.6"/></svg>';
      const row = (t, sub, on) => h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, t), h('div', { class: 'i-s' }, sub)), on ? html(check) : null);
      const go = h('button', { class: 'i-row', type: 'button', style: 'justify-content:center;color:#385487', onclick: () => {
        if (done) return;
        const wrap = h('div', { class: 'i-alert-wrap' }, h('div', { class: 'i-alert', role: 'alertdialog' }, h('h3', null, '跳到 6 月 13 日？'), h('p', null, '出道舞台结束后的晚上。跳过去以后就回不来了。'),
          h('div', { class: 'ia-btns' }, h('button', { type: 'button', onclick: () => wrap.remove() }, '取消'), h('button', { type: 'button', onclick: () => { wrap.remove(); window.Debut.jump(); } }, '跳转'))));
        window.Phone.screen.append(wrap);
      } }, done ? '已经是 6 月 13 日了' : '跳转');
      nav.push(h('div', { class: 'ios pinstripe settings' }, navBar(nav, '设置', '跳转时间'), h('div', { class: 'i-scroll' },
        h('div', { class: 'i-sec-h' }, '日期'),
        h('div', { class: 'i-group' }, row('6月12日 星期三', '出道前一晚', !done), row('6月13日 星期四', '出道日 · 舞台结束以后', done)),
        h('div', { class: 'i-group' }, go),
        h('p', { class: 'i-sec-foot' }, done ? '大家的消息都在 KakaoTalk 里。' : '都看完了的话，可以跳到出道那天的晚上。\n跳过去以后，会有人给南俊发消息。'))));
    }
    function soundSettings() {
      const mute = h('button', { class: 'tog' + (!U.sound.muted ? ' on' : ''), 'aria-label': '播放声音', 'aria-pressed': String(!U.sound.muted), onclick: () => { U.sound.setMuted(!U.sound.muted); mute.classList.toggle('on', !U.sound.muted); mute.setAttribute('aria-pressed', String(!U.sound.muted)); } });
      const slider = h('input', { type: 'range', min: 0, max: 1, step: .05, value: U.sound.volume, 'aria-label': '提示音音量', oninput: (e) => U.sound.setVolume(e.target.value) });
      let previewTimer;
      const stopPreview = () => { clearTimeout(previewTimer); U.sound.stop('alarm'); U.sound.stop('ring'); };
      const page = h('div', { class: 'ios pinstripe settings' }, navBar(nav, '设置', '声音'), h('div', { class: 'i-scroll' },
        h('div', { class: 'i-sec-h' }, '振动'),
        h('div', { class: 'i-group' }, h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, '响铃模式'), h('span', { class: 'tog on' })), h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, '静音模式'), h('span', { class: 'tog on' }))),
        h('div', { class: 'i-sec-h' }, '铃声和提醒'),
        h('div', { class: 'i-group' }, h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, '播放声音'), mute), h('div', { class: 'i-row' }, slider)),
        h('div', { class: 'i-group' },
          row(h('span', { class: 'i-ico', style: 'background:#f3c400', html: '<svg viewBox="0 0 24 24"><path d="M4 6h16v10H9l-5 4z" fill="#3c2318" stroke="none"/></svg>' }), '试听 消息提示音', '', () => { stopPreview(); U.sound.msg(); }),
          row(h('span', { class: 'i-ico', style: 'background:#f39a1e', html: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2 1.5"/></svg>' }), '试听 闹钟', '', () => { stopPreview(); U.sound.alarm(); previewTimer = setTimeout(stopPreview, 5000); }),
          row(h('span', { class: 'i-ico', style: 'background:#8a9097', html: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" fill="#fff"/></svg>' }), '停止试听', '', stopPreview)),
        h('p', { class: 'i-sec-foot' }, S.soundNote || '')));
      page._onPop = stopPreview; nav.push(page);
    }
    function general() {
      const about = () => nav.push(h('div', { class: 'ios pinstripe settings' }, navBar(nav, '通用', '关于本机'), h('div', { class: 'i-scroll' },
        h('div', { class: 'i-group' }, info('名称', S.deviceName), info('网络', 'SKTelecom'), info('歌曲', D.songs || '0'), info('视频', D.videos || '0'), info('照片', String((A.album || []).length)), info('应用程序', '23'), info('总容量', D.capacity || ''), info('可用容量', D.available || ''), info('版本', D.iosVersion || ''), info('型号', D.model || '—')),
        credit())));
      nav.push(h('div', { class: 'ios pinstripe settings' }, navBar(nav, '设置', '通用'), h('div', { class: 'i-scroll' },
        h('div', { class: 'i-group' }, row(null, '关于本机', '', about), row(null, '软件更新')),
        h('div', { class: 'i-group' }, row(null, '用量'), row(null, 'Siri')),
        h('div', { class: 'i-group' }, row(null, '自动锁定', '1 分钟'), row(null, '密码锁定', '立即')),
        h('div', { class: 'i-group' }, row(null, '日期与时间'), row(null, '键盘'), row(null, '多语言环境', window.ZH ? window.ZH.label() : '简体中文', () => langPage())))));
    }
    /* 简体 / 繁體 显示切换（读者打字两种都认） */
    function langPage() {
      const check = '<svg viewBox="0 0 16 13" width="16" height="13"><path d="M1.5 7l4.5 4.5L14.5 1.5" fill="none" stroke="#385487" stroke-width="2.6"/></svg>';
      const cur = window.ZH ? window.ZH.mode : 'cn';
      const opt = (m, t) => h('button', { class: 'i-row', type: 'button', onclick: () => { if (window.ZH && m !== window.ZH.mode) { window.ZH.setMode(m); nav.pop(); nav.pop(); } } },
        h('div', { class: 'i-main' }, h('div', { class: 'i-t', 'data-zh-keep': '' }, t)), m === cur ? html(check) : null);
      nav.push(h('div', { class: 'ios pinstripe settings' }, navBar(nav, '通用', '多语言环境'), h('div', { class: 'i-scroll' },
        h('div', { class: 'i-sec-h' }, '语言'),
        h('div', { class: 'i-group' }, opt('cn', '简体中文'), opt('tw', '繁體中文')),
        h('p', { class: 'i-sec-foot' }, '只改变显示的文字。聊天时简体、繁体都可以打。'))));
    }
    return { back: () => nav.pop(), destroy: () => { U.sound.stop('alarm'); U.sound.stop('ring'); } };
  } };

  /* ============================================================
   * 天气（卡片式；夜里是紫色的）
   * ============================================================ */
  P.weather = { mount(win, ctx) {
    const cities = S.weather || [];
    let i = 0;
    const root = h('div', { class: 'ios weather-app page' });
    win.append(root); ctx.setTone();
    const icon = (c, night) => (night && c === '晴' ? '☾' : ({ 晴: '☀', 多云: '☁', 阵雨: '☂', 小雨: '☂' }[c] || '☀'));
    function paint() {
      root.innerHTML = '';
      const c = cities[i]; if (!c) return;
      const local = new Date(S.now.y, S.now.m - 1, S.now.d, S.now.hh + (c.offset || 0), S.now.mm);
      const hh = local.getHours(), night = hh < 6 || hh >= 19;
      const hours = c.hours.map(([t, cond], k) => { const H = (hh + k) % 24; return h('div', null, k ? `${U.pad(H)}时` : '现在', h('b', null, `${t}°`), h('div', { class: 'wx-ic' }, icon(cond, H < 6 || H >= 19))); });
      const card = h('div', { class: 'wx-card ' + (night ? 'night' : 'day') },
        h('div', { class: 'wx-top' }, h('div', null, h('div', { class: 'wx-city' }, c.city), h('div', { class: 'wx-hl' }, `${c.cond}  最高 ${c.hi}° 最低 ${c.lo}°`), c.offset ? h('div', { class: 'wx-hl' }, `当地时间 ${U.pad(hh)}:${U.pad(local.getMinutes())}`) : null), h('div', { class: 'wx-temp' }, `${c.now}°`)),
        h('div', { class: 'wx-hours' }, hours),
        h('div', { class: 'wx-days' }, c.days.map(([d, cond, hi, lo]) => h('div', null, h('span', null, d), h('span', { class: 'wx-ic' }, icon(cond)), h('span', null, `${hi}°  ${lo}°`)))));
      let sx = null;
      card.addEventListener('pointerdown', (e) => (sx = e.clientX));
      card.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); });
      root.append(h('div', { class: 'wx-nav' }, homeBack()), h('div', { class: 'i-scroll' }, card,
        h('div', { class: 'wx-dots', role: 'tablist' }, cities.map((x, k) => h('button', { type: 'button', class: k === i ? 'on' : '', 'aria-label': x.city, onclick: () => { i = k; U.sound.tap(); paint(); } }))),
        h('div', { class: 'wx-foot' }, `更新于 ${U.pad(S.now.hh)}:${U.pad(S.now.mm)} · 左右滑动切换城市`)));
    }
    const go = (k) => { i = (i + k + cities.length) % cities.length; U.sound.tap(); paint(); };
    paint();
    return { back: () => false };
  } };

  /* ============================================================
   * 相机
   * ============================================================ */
  P.camera = { mount(win, ctx) {
    ctx.setTone();
    const view = h('div', { class: 'cam-view' });
    const thumb = h('span', { class: 'cam-thumb' });
    const last = (A.album || [])[(A.album || []).length - 1];
    if (last && last.src) thumb.style.backgroundImage = `url("${last.src}")`;
    win.append(h('div', { class: 'ios cam page' },
      h('div', { class: 'cam-top' }, homeBack(), h('button', { type: 'button', html: '<svg viewBox="0 0 24 24"><path d="M13 2L5 13h6l-1 9 8-11h-6z"/></svg>自动' }),
        h('button', { type: 'button', 'aria-label': '切换摄像头', html: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M9 13.5a3 3 0 0 1 5.6-1.5M15 13.5a3 3 0 0 1-5.6 1.5" fill="none" stroke="#fff" stroke-width="1.6"/></svg>' })),
      view,
      h('div', { class: 'cam-bot' }, thumb,
        h('button', { class: 'cam-shut', 'aria-label': '拍照', onclick: () => { view.classList.remove('flash'); void view.offsetWidth; view.classList.add('flash'); U.sound.tap(); }, html: '<svg viewBox="0 0 30 24"><path d="M4 5h5l2.5-3h7L21 5h5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm11 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>' }),
        h('span', { class: 'cam-mode', html: '<svg viewBox="0 0 18 14"><path d="M2 3h3l1.5-2h5L13 3h3a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 16 13H2A1.5 1.5 0 0 1 .5 11.5v-7A1.5 1.5 0 0 1 2 3z"/></svg><i></i><svg viewBox="0 0 18 14"><rect x="1" y="2" width="11" height="10" rx="1.5"/><path d="M12 6l5-3v8l-5-3z"/></svg>' }))));
    return { back: () => false };
  } };

  /* ============================================================
   * 音乐（iOS 6）：全局只有一个播放器，切到别的应用也接着放；放完一首就停
   * ============================================================ */
  const M = S.music || { tracks: [] };
  const Player = (() => {
    let audio = null, cur = null;
    const subs = new Set();
    const emit = () => subs.forEach((f) => f());
    function ensure() {
      if (audio) return audio;
      audio = new Audio(); audio.preload = 'none'; audio.volume = .85; audio.loop = true; // 单曲循环
      ['play', 'pause', 'timeupdate', 'loadedmetadata'].forEach((ev) => audio.addEventListener(ev, emit));
      audio.addEventListener('error', () => { alertBox('无法播放', '这首歌只能在正式网页版里播放。'); emit(); });
      return audio;
    }
    return {
      play(t) { const a = ensure(); if (!cur || cur.id !== t.id) { cur = t; a.src = t.src; } a.play().catch(() => {}); emit(); },
      toggle() { if (!audio || !cur) return; if (audio.paused) audio.play().catch(() => {}); else audio.pause(); },
      seek(r) { if (audio && audio.duration) audio.currentTime = r * audio.duration; },
      volume(v) { ensure().volume = v; },
      get track() { return cur; }, get playing() { return !!(audio && !audio.paused); },
      get time() { return audio ? audio.currentTime : 0; }, get duration() { return audio && audio.duration || 0; },
      get vol() { return audio ? audio.volume : .85; },
      on(f) { subs.add(f); return () => subs.delete(f); },
    };
  })();
  window.Music = Player;
  const fmt = (x) => `${Math.floor(x / 60)}:${U.pad(Math.floor(x % 60))}`;
  const COVER = {
    butterfly: '<svg viewBox="0 0 200 200"><defs><linearGradient id="bf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2f4a"/><stop offset=".6" stop-color="#4c3f6e"/><stop offset="1" stop-color="#c28aa8"/></linearGradient></defs><rect width="200" height="200" fill="url(#bf)"/><g fill="none" stroke="#f3e9f2" stroke-width="2" opacity=".9"><path d="M100 70c-12-28-48-34-52-10s26 40 52 34M100 70c12-28 48-34 52-10s-26 40-52 34M100 96c-10 18-36 30-40 14s18-22 40-14M100 96c10 18 36 30 40 14s-18-22-40-14M100 62v62"/></g><text x="100" y="168" text-anchor="middle" font-family="Helvetica Neue,Helvetica,sans-serif" font-size="14" letter-spacing="4" fill="#f3e9f2" opacity=".85">BUTTERFLY</text></svg>',
    none: '<svg viewBox="0 0 200 200"><defs><linearGradient id="nc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5f66"/><stop offset="1" stop-color="#2c2f33"/></linearGradient></defs><rect width="200" height="200" fill="url(#nc)"/><path d="M86 140V66l52-12v70" stroke="#9aa0a7" stroke-width="7" fill="none"/><ellipse cx="74" cy="141" rx="14" ry="11" fill="#9aa0a7"/><ellipse cx="126" cy="126" rx="14" ry="11" fill="#9aa0a7"/></svg>',
  };
  const CLOUD = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z" fill="none" stroke="#9a9a9a" stroke-width="1.6"/><path d="M12 10v6M9.5 13.5L12 16l2.5-2.5" fill="none" stroke="#9a9a9a" stroke-width="1.6"/></svg>';
  P.music = { mount(win, ctx) {
    const nav = Nav(win, ctx);
    let tab = 'songs';
    const root = h('div', { class: 'ios music' });
    nav.root(root);
    const nowBtn = () => Player.track ? bb('正在播放', { cls: 'now', onclick: () => nowPlaying() }) : null;
    function render() {
      root.innerHTML = '';
      const title = { songs: '歌曲', list: '播放列表', artists: '表演者' }[tab];
      root.append(navBar(nav, null, title, nowBtn(), homeBack()));
      const sc = h('div', { class: 'i-scroll i-plain' });
      if (tab === 'list') {
        sc.append(h('button', { class: 'i-row', onclick: () => { tab = 'songs'; render(); } }, h('div', { class: 'i-main' }, M.playlist || '播放列表'), html(CHEV)));
      } else if (tab === 'artists') {
        [...new Set(M.tracks.map((t) => t.artist))].forEach((a) => sc.append(h('div', { class: 'i-row' }, h('div', { class: 'i-main' }, a))));
      } else {
        sc.append(h('button', { class: 'mu-shuffle', type: 'button', style: 'width:100%', onclick: () => { const t = M.tracks.find((x) => x.src); if (t) { Player.play(t); nowPlaying(); } } }, '随机播放'));
        M.tracks.forEach((t) => {
          const ok = !!t.src;
          sc.append(h('button', { class: 'i-row mu-row' + (ok ? '' : ' cloud') + (Player.track && Player.track.id === t.id ? ' cur' : ''), onclick: () => {
            if (!ok) { alertBox('无法播放', '这首歌还没有下载到这部 iPhone。'); return; }
            Player.play(t); nowPlaying();
          } },
          h('div', { class: 'i-main' }, h('div', { class: 'i-t' }, t.title), h('div', { class: 'i-s' }, [t.artist, t.album].filter(Boolean).join(' – '))),
          ok ? h('span', { class: 'mu-time' }, t.time || '') : html(CLOUD)));
        });
        sc.append(h('div', { class: 'mu-count' }, `${M.tracks.length} 首歌曲 · 已下载 ${M.tracks.filter((t) => t.src).length} 首`));
      }
      root.append(sc, tabBar([
        ['list', '播放列表', '<path d="M4 6h12M4 11h12M4 16h8"/><circle cx="18" cy="17" r="2.2"/><path d="M20 17V9"/>'],
        ['artists', '表演者', '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1-3.5 3.8-5.3 7-5.3s6 1.8 7 5.3"/>'],
        ['songs', '歌曲', '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>']], tab, (id) => { tab = id; U.sound.tap(); render(); }));
    }
    function nowPlaying() {
      const t = Player.track; if (!t) return;
      const play = h('button', { class: 'np-btn np-play', 'aria-label': '播放或暂停', onclick: () => Player.toggle() });
      const bar = h('input', { type: 'range', min: 0, max: 1000, value: 0, class: 'np-seek', 'aria-label': '进度', oninput: (e) => Player.seek(e.target.value / 1000) });
      const tl = h('span', null, '0:00'), tr = h('span', null, '-0:00');
      const paint = () => {
        play.classList.toggle('on', Player.playing);
        const d = Player.duration, c = Player.time;
        if (document.activeElement !== bar) bar.value = d ? Math.round(c / d * 1000) : 0;
        tl.textContent = fmt(c); tr.textContent = '-' + fmt(Math.max(0, d - c));
      };
      const pg = h('div', { class: 'ios music np' },
        h('div', { class: 'i-nav np-nav' }, h('button', { class: 'i-back', type: 'button', onclick: () => nav.pop() }, h('span', null, '歌曲')),
          h('div', { class: 'i-title' }, h('small', null, t.artist), t.title, h('small', null, t.album || '')), h('span')),
        t.coverImg ? h('div', { class: 'np-art' }, h('img', { src: t.coverImg, alt: '' })) : h('div', { class: 'np-art', html: COVER[t.cover] || COVER.none }),
        h('div', { class: 'np-ctrl' },
          h('div', { class: 'np-time' }, tl, bar, tr),
          h('div', { class: 'np-btns' }, h('button', { class: 'np-btn np-prev', 'aria-label': '从头播放', onclick: () => Player.seek(0) }), play, h('button', { class: 'np-btn np-next', 'aria-label': '下一首', onclick: () => alertBox('无法播放', '下一首还没有下载到这部 iPhone。') })),
          h('input', { type: 'range', min: 0, max: 1, step: .05, value: Player.vol, class: 'np-vol', 'aria-label': '音量', oninput: (e) => Player.volume(Number(e.target.value)) })));
      const off = Player.on(paint); pg._onPop = () => { off(); render(); };
      nav.push(pg); paint();
    }
    render();
    if (Player.track) nowPlaying();
    return { back: () => nav.pop() };
  } };
})();
