/* 手机外壳：锁屏、密码、主屏幕、应用窗口 */
(function () {
  const S = window.STORY, A = window.ASSETS, U = window.UI, { h } = U;
  const layers = document.getElementById('layers');
  const bar = document.getElementById('statusbar');
  // 旧代码里的“主屏幕指示条”已换成实体 Home 键；保留一个空壳对象避免改动别处
  const indicator = { classList: { add() {}, remove() {}, toggle() {} } };
  const screenEl = document.getElementById('screen');

  /* ---------- 尺寸 ---------- */
  let restingViewportHeight=window.innerHeight,viewportFrame;
  function fit() {
    const full = window.innerWidth <= 600;
    document.body.classList.toggle('fullscreen', full);
    if (full) {
      const viewport=window.visualViewport;
      const height=viewport?viewport.height:window.innerHeight;
      const editing=!!document.activeElement?.matches('input,textarea,[contenteditable="true"]');
      if(!editing)restingViewportHeight=Math.max(restingViewportHeight,window.innerHeight,height);
      document.documentElement.style.setProperty('--phone-visible-height',`${height}px`);
      document.documentElement.style.setProperty('--phone-visible-top',`${viewport?.offsetTop||0}px`);
      document.body.classList.toggle('keyboard-open',editing&&restingViewportHeight-height>100);
      window.__scale = 1; document.getElementById('device').style.setProperty('--scale',1);
      if(editing){
        const messages=document.activeElement.closest('.k-room')?.querySelector('.kr-msgs');
        if(messages)requestAnimationFrame(()=>{messages.scrollTop=messages.scrollHeight;});
      }
      return;
    }
    document.body.classList.remove('keyboard-open');
    const s = Math.min(1.25, (window.innerHeight - 40) / 640, (window.innerWidth - 40) / 360);
    window.__scale = s;
    document.getElementById('device').style.setProperty('--scale', s);
  }
  function scheduleFit(){cancelAnimationFrame(viewportFrame);viewportFrame=requestAnimationFrame(fit);}
  window.addEventListener('resize',scheduleFit);
  window.visualViewport?.addEventListener('resize',scheduleFit);
  window.visualViewport?.addEventListener('scroll',scheduleFit);
  window.addEventListener('orientationchange',()=>{restingViewportHeight=window.innerHeight;setTimeout(scheduleFit,350);});
  document.addEventListener('focusin',()=>{scheduleFit();setTimeout(scheduleFit,350);});
  document.addEventListener('focusout',()=>{scheduleFit();setTimeout(scheduleFit,350);});
  fit();

  function paintClock() {
    document.querySelectorAll('[data-clock="short"]').forEach((el) => (el.textContent = U.clock()));
    const lt = document.querySelector('.lock-time'); if (lt) lt.textContent = U.clock();
    const ld = document.querySelector('.lock-date'); if (ld) ld.textContent = U.lockDate();
  }
  paintClock();

  /* ---------- 状态 ---------- */
  let mode = 'lock'; // lock | passcode | home | app
  let pending = null; // 解锁后要打开的目标
  let appWin = null, appInst = null, appId = null;
  const APPS = { chat: window.Chat, ...window.APPS };
  // iOS 6 的状态栏一直是白字：锁屏、主屏幕半透明，应用里是纯黑
  function setTone() { bar.classList.toggle('sb-trans', mode === 'lock' || mode === 'passcode' || mode === 'home'); }

  /* ---------- 通知汇总 ---------- */
  function smsNotifs() {
    const read = new Set(U.store.get('readSms', []));
    const out = [];
    S.sms.forEach((t) => t.messages.forEach((m, i) => {
      const id = `${t.id}-${i}`;
      if (m[3] && m[3].unread && !read.has(id)) out.push({ app: 'messages', target: { thread: t.id }, p: U.parse(m[0]), title: t.name, text: m[2] });
    }));
    return out;
  }
  function callNotifs() {
    return S.calls.filter((c) => c.fresh && !c.seen && c[2] === 'missed').map((c) => {
      const ct = S.contacts.find((x) => x.id === c[1]);
      return { app: 'phone', target: { tab: 'recents' }, p: U.parse(c[0]), title: '未接来电', text: ct ? ct.name : c[1] };
    });
  }
  const allNotifs = () => [...window.Chat.notifications(), ...smsNotifs(), ...callNotifs()];
  const cmp = (a, b) => b.p.t - a.p.t;
  const badgeOf = (id) => (id === 'chat' ? window.Chat.totalUnread() : id === 'messages' ? smsNotifs().length : id === 'phone' ? callNotifs().length : id === 'settings' ? (U.store.get('jumpSeen', false) ? 0 : 1) : 0);

  /* ---------- 壁纸 ---------- */
  function wallpaper(kind) {
    const src = A.wallpaper && A.wallpaper[kind];
    const el = h('div', { class: 'wallpaper' + (src ? '' : ' is-empty') });
    if (src) el.style.backgroundImage = `url("${src}")`;
    return el;
  }

  /* ============ 锁屏（iOS 6：滑动来解锁） ============ */
  let lockLayer = null;
  const ARROW = '<svg viewBox="0 0 34 22"><defs><linearGradient id="ka" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6a6a6"/><stop offset="1" stop-color="#6b6b6b"/></linearGradient></defs><path d="M2 8h18V2l12 9-12 9v-6H2z" fill="url(#ka)" stroke="#5a5a5a" stroke-width=".8"/></svg>';
  function renderLock() {
    clear();
    mode = 'lock';
    bar.classList.add('on-lock');
    setTone();
    const knob = h('div', { class: 'slider-knob', role: 'button', tabindex: '0', 'aria-label': '滑动来解锁', html: ARROW });
    const text = h('div', { class: 'slider-text' }, '滑动来解锁');
    const track = h('div', { class: 'slider' }, text, knob);
    const inner = h('div', { class: 'lock-inner' },
      h('div', { class: 'lock-top' }, h('div', { class: 'lock-time' }, U.clock()), h('div', { class: 'lock-date' }, U.lockDate())),
      notifArea(),
      h('div', { class: 'lock-bottom' }, track,
        h('div', { class: 'lock-cam', 'aria-hidden': 'true' }, h('i'), h('i'), h('span', { html: '<svg viewBox="0 0 26 20"><path d="M3 5.5h4.5L9.6 2.5h6.8l2.1 3H23a1.5 1.5 0 0 1 1.5 1.5v10.5A1.5 1.5 0 0 1 23 19H3a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 3 5.5z" fill="rgba(255,255,255,.75)"/><circle cx="13" cy="11.8" r="4.4" fill="#2a2a2c"/><circle cx="13" cy="11.8" r="2.6" fill="rgba(255,255,255,.55)"/></svg>' }))));
    lockLayer = h('div', { class: 'layer lock' }, wallpaper('lock'), inner);
    layers.append(lockLayer);
    slideToUnlock(track, knob, text);
    knob.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toPasscode(); } });
  }

  // iOS 6 的锁屏：每条消息单独一行，最新的在最上面；新来的那条滑进来
  const seenNotifs = new Set();
  let notifPrimed = false;
  function notifArea() {
    const box = h('div', { class: 'lock-notifs' });
    const snz = window.Events && window.Events.snoozeCard && window.Events.snoozeCard();
    if (snz) box.append(snz);
    // 锁屏上正在播放的歌（可以暂停 / 继续）
    const mu = window.Music;
    if (mu && mu.track) box.append(h('div', { class: 'ncard mu-lock' }, h('div', { class: 'napp' }, U.iconEl('music')),
      h('div', { class: 'nbody' }, h('div', { class: 'nhead' }, h('span', null, mu.track.title)), h('div', { class: 'ntext' }, mu.track.artist)),
      h('button', { class: 'mu-lock-btn' + (mu.playing ? ' on' : ''), type: 'button', 'aria-label': '播放或暂停', onclick: (e) => { e.stopPropagation(); mu.toggle(); } })));
    const ns = allNotifs().map((n, i) => ({ ...n, i })).sort((a, b) => (b.p.t - a.p.t) || (b.i - a.i));
    ns.forEach((n) => {
      const key = n.id || `${n.app}|${n.title}|${n.text}|${n.p.key}`;
      const el = card(n);
      if (notifPrimed && !seenNotifs.has(key)) el.classList.add('ncard-in');
      seenNotifs.add(key);
      box.append(el);
    });
    notifPrimed = true;
    return box;
  }
  function card(n, onTap) {
    return h('button', { class: 'ncard', type: 'button', onclick: (e) => { e.stopPropagation(); if (onTap) return onTap(); pending = { app: n.app, args: n.target }; toPasscode(); } },
      h('div', { class: 'napp' }, U.iconEl(n.app)),
      h('div', { class: 'nbody' },
        h('div', { class: 'nhead' }, h('span', null, n.title), h('span', { class: 'ntime' }, U.notifTime(n.p))),
        h('div', { class: 'ntext' }, n.text)));
  }
  function stack(app, list) {
    const el = h('div', { class: 'nstack', 'data-count': list.length });
    const collapsed = () => {
      el.className = 'nstack';
      el.innerHTML = '';
      el.append(card(list[0], list.length > 1 ? () => { U.sound.tap(); expanded(); } : null));
      if (list.length > 1) el.append(h('span', { class: 'nmore' }, `还有 ${list.length - 1} 条`));
    };
    const expanded = () => {
      el.className = 'nstack nstack-enter';
      el.innerHTML = '';
      el.append(h('div', { class: 'nstack-head' }, h('span', null, U.iconLabel(app)),
        h('button', { onclick: (e) => { e.stopPropagation(); U.sound.tap(); collapsed(); } }, '收起')));
      list.forEach((n) => el.append(card(n)));
    };
    collapsed();
    return el;
  }

  // 锁屏通知跟着时间和新消息刷新（“34分钟前”会变）
  function refreshLock() {
    if (mode !== 'lock' || !lockLayer) return;
    const old = lockLayer.querySelector('.lock-notifs');
    if (old && !old.querySelector('.nstack-head')) old.replaceWith(notifArea());
  }
  window.Chat.onChange(() => refreshLock());
  setTimeout(() => window.Music && window.Music.on(() => { const b = lockLayer && lockLayer.querySelector('.mu-lock-btn'); if (b) b.classList.toggle('on', window.Music.playing); else if (window.Music.track) refreshLock(); }), 0);

  function slideToUnlock(track, knob, text) {
    let sx = null, dx = 0, max = 0;
    knob.addEventListener('pointerdown', (e) => {
      sx = e.clientX; dx = 0; max = track.clientWidth - knob.offsetWidth - 6;
      knob.classList.remove('snap'); try { knob.setPointerCapture(e.pointerId); } catch (_) {}
    });
    knob.addEventListener('pointermove', (e) => {
      if (sx == null) return;
      dx = Math.max(0, Math.min(max, (e.clientX - sx) / (window.__scale || 1)));
      knob.style.transform = `translateX(${dx}px)`; text.style.opacity = String(Math.max(0, 1 - dx / (max * .6)));
    });
    const end = () => {
      if (sx == null) return;
      sx = null;
      if (dx >= max * .82) { knob.style.transform = `translateX(${max}px)`; setTimeout(toPasscode, 120); return; }
      knob.classList.add('snap'); knob.style.transform = ''; text.style.opacity = '';
      if (dx < 6) { knob.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(18px)' }, { transform: 'translateX(0)' }], { duration: 380, easing: 'ease-out' }); }
    };
    knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
  }

  /* ============ 密码（iOS 6 四格简易密码） ============ */
  let code = '';
  let pcDots = null, cancelPasscode = null;
  function toPasscode() {
    if (mode !== 'lock') return;
    mode = 'passcode';
    U.sound.tap();
    const inner = lockLayer.querySelector('.lock-inner');
    inner.style.opacity = '0';
    code = '';
    pcDots = h('div', { class: 'pc-dots' }, h('i'), h('i'), h('i'), h('i'));
    const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']];
    // Record pointer presses directly; keep keyboard/assistive clicks.
    function digitEvents(d) {
      return {
        onpointerdown: (e) => {
          if (e.isPrimary === false || (e.button != null && e.button !== 0)) return;
          e.preventDefault();
          press(d);
        },
        onclick: (e) => { if (e.detail === 0) press(d); }
      };
    }
    const pad = h('div', { class: 'pc-pad' }, keys.map(([d, l]) =>
      h('button', { class: 'pc-key', 'data-d': d, 'aria-label': d, ...digitEvents(d) }, h('b', null, d), l ? h('small', null, l) : null)),
      h('button', { class: 'pc-key fn', onclick: () => cancel() }, '取消'),
      h('button', { class: 'pc-key', 'data-d': '0', 'aria-label': '0', ...digitEvents('0') }, h('b', null, '0')),
      h('button', { class: 'pc-key fn', 'aria-label': '删除', onclick: () => erase(), html: '<svg viewBox="0 0 30 20"><path d="M9 2h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9L1 10z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 6l8 8M22 6l-8 8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>' }));
    const layer = h('div', { class: 'layer passcode' }, wallpaper('lock'),
      h('div', { class: 'pc-inner' }, h('div', { class: 'pc-head' }, h('div', { class: 'pc-title' }, '输入密码'), pcDots, h('div', { class: 'pc-hint' }, '提示：出道日')), pad));
    layer.style.opacity = '0'; layer.style.transition = 'opacity .25s';
    layers.append(layer);
    requestAnimationFrame(() => (layer.style.opacity = '1'));
    bar.classList.remove('on-lock');

    function paint() { [...pcDots.children].forEach((d, i) => d.classList.toggle('on', i < code.length)); }
    function press(d) {
      if (code.length >= 4) return;
      U.sound.tap(); U.haptic(8);
      const k = pad.querySelector(`[data-d="${d}"]`); k.classList.add('pressed'); setTimeout(() => k.classList.remove('pressed'), 120);
      code += d; paint();
      if (code.length === 4) setTimeout(check, 160);
    }
    function erase() { code = code.slice(0, -1); paint(); }
    function cancel() {
      layer.remove();
      mode = 'lock'; cancelPasscode = null;
      const inn = lockLayer.querySelector('.lock-inner'); inn.style.transform = ''; inn.style.opacity = '';
      const knob = lockLayer.querySelector('.slider-knob'); if (knob) { knob.style.transform = ''; }
      const text = lockLayer.querySelector('.slider-text'); if (text) text.style.opacity = '';
      bar.classList.add('on-lock'); setTone();
      pending = null;
      document.removeEventListener('keydown', onKey);
    }
    cancelPasscode = cancel;
    function check() {
      if (code === S.passcode) {
        U.sound.unlock(); cancelPasscode = null;
        document.removeEventListener('keydown', onKey);
        U.store.set('unlocked', true);
        window.Events && window.Events.onUnlock();
        renderHome(true);
        if (pending) { const p = pending; pending = null; setTimeout(() => openApp(p.app, p.args), 380); }
      } else {
        U.sound.wrong(); U.haptic([60, 40, 60]);
        pcDots.classList.add('shake');
        setTimeout(() => { pcDots.classList.remove('shake'); code = ''; paint(); }, 520);
      }
    }
    function onKey(e) {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') erase();
      else if (e.key === 'Escape') cancel();
    }
    document.addEventListener('keydown', onKey);
  }

  /* ============ 主屏幕（iOS 6：图标 + 玻璃 Dock） ============ */
  const GRID = ['calendar', 'photos', 'camera', 'weather', 'clock', 'maps', 'notes', 'music', 'settings'];
  const DOCK = ['phone', 'safari', 'messages', 'chat'];
  let homeLayer = null;
  function appIcon(id, inDock) {
    const n = badgeOf(id);
    return h('button', { class: 'app', 'data-app': id, 'aria-label': U.iconLabel(id) + (n ? `，${n}条未读` : ''), onclick: (e) => openApp(id, null, e.currentTarget) },
      h('div', { class: 'app-icon' }, U.iconEl(id), n ? h('span', { class: 'badge' }, n > 99 ? '99+' : n) : null),
      h('span', { class: 'app-label' }, U.iconLabel(id)));
  }
  function renderHome(animate) {
    clear();
    mode = 'home';
    bar.classList.remove('on-lock');
    setTone();
    const grid = h('div', { class: 'home-grid' }, GRID.map((id) => appIcon(id)));
    homeLayer = h('div', { class: 'layer home' + (animate ? ' home-enter' : '') }, wallpaper('home'),
      h('div', { class: 'home-pages' }, grid),
      h('div', { class: 'page-dots', 'aria-hidden': 'true' }, h('i', { class: 'pd-search' }), h('i', { class: 'on' }), h('i')),
      h('div', { class: 'dock' }, DOCK.map((id) => appIcon(id, true))));
    layers.append(homeLayer);
  }
  function refreshBadges() {
    if (!homeLayer) return;
    homeLayer.querySelectorAll('.app').forEach((el) => {
      const id = el.dataset.app, n = badgeOf(id);
      const icon = el.querySelector('.app-icon');
      let b = icon.querySelector('.badge');
      if (n && !b) { b = h('span', { class: 'badge' }); icon.append(b); }
      if (b) { if (n) b.textContent = n > 99 ? '99+' : n; else b.remove(); }
      el.setAttribute('aria-label', U.iconLabel(id) + (n ? `，${n}条未读` : ''));
    });
  }
  window.Chat.onChange(refreshBadges);

  /* ============ 应用窗口 ============ */
  function openApp(id, args, fromEl) {
    const mod = APPS[id];
    if (mode === 'lock' || mode === 'passcode') { pending = { app: id, args }; toPasscode(); return; }
    if (!mod) { // 尚未开放的应用：图标轻弹一下
      const el = fromEl || (homeLayer && homeLayer.querySelector(`[data-app="${id}"]`));
      if (el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
      return;
    }
    if (appWin && appId === id) { appInst.openRoom && args && args.room && appInst.openRoom(args.room,args); return; }
    if (appWin) closeApp(true);
    const src = fromEl || (homeLayer && homeLayer.querySelector(`[data-app="${id}"] .app-icon`));
    const sr = screenEl.getBoundingClientRect();
    let ox = 0, oy = 0;
    if (src) {
      const r = src.getBoundingClientRect(), sc = window.__scale || 1;
      ox = ((r.left + r.width / 2) - (sr.left + sr.width / 2)) / sc;
      oy = ((r.top + r.height / 2) - (sr.top + sr.height / 2)) / sc;
    }
    appWin = h('div', { class: 'layer appwin opening', style: `--ox:${ox}px;--oy:${oy}px;z-index:20` });
    bar.classList.remove('sb-trans');
    appWin.addEventListener('animationend', () => appWin && appWin.classList.remove('opening'), { once: true });
    layers.append(appWin);
    appId = id; mode = 'app'; setTone();
    const win = appWin;
    appInst = mod.mount(appWin, { args, setTone, isVisible: () => appWin === win && mode === 'app' }, args || {});
    rootEdgeSwipe(win);
    try { if (!(history.state && history.state.inApp)) history.pushState({ inApp: 1 }, ''); } catch (_) {}
    U.sound.tap();
    window.Events && window.Events.onAppOpened(id);
  }
  let ignorePop = false;
  function closeApp(instant, fromPop) {
    if (!appWin) return;
    if (!fromPop) { try { if (history.state && history.state.inApp) { ignorePop = true; history.back(); } } catch (_) {} }
    const w = appWin;
    appInst && appInst.destroy && appInst.destroy();
    appWin = null; appInst = null; appId = null;
    mode = 'home';
    setTone();
    refreshBadges();
    if (instant) { w.remove(); return; }
    w.classList.remove('opening'); w.classList.add('closing');
    setTimeout(() => w.remove(), 320);
  }

  /* 浏览器 / 手机系统的“返回”：先退一页，退到底就回主屏幕 */
  window.addEventListener('popstate', () => {
    if (ignorePop) { ignorePop = false; return; }
    if (mode !== 'app') return;
    if (appInst && appInst.back && appInst.back()) { try { history.pushState({ inApp: 1 }, ''); } catch (_) {} }
    else closeApp(false, true);
  });
  /* 在应用最外层从左边缘往右滑，也能回到主屏幕 */
  function atRoot(win) {
    if (win.querySelector('.pv, .k-profile, .k-sheet, .viewer')) return false;
    return [...win.children].filter((el) => el.classList.contains('page') && !el.classList.contains('push-out')).length <= 1;
  }
  function rootEdgeSwipe(win) {
    let sx = null, dx = 0, page = null;
    win.addEventListener('pointerdown', (e) => {
      const r = win.getBoundingClientRect();
      if ((e.clientX - r.left) / (window.__scale || 1) > 24 || !atRoot(win)) return;
      sx = e.clientX; dx = 0; page = win.querySelector('.page');
    }, true);
    win.addEventListener('pointermove', (e) => {
      if (sx == null) return;
      dx = Math.max(0, (e.clientX - sx) / (window.__scale || 1));
      if (page) { page.style.transition = 'none'; page.style.transform = `translateX(${dx * 0.35}px) scale(${1 - Math.min(dx, 300) / 2000})`; }
    }, true);
    const end = () => {
      if (sx == null) return;
      sx = null;
      if (page) { page.style.transition = ''; page.style.transform = ''; }
      if (dx > 90 && appWin === win) closeApp();
    };
    win.addEventListener('pointerup', end, true); win.addEventListener('pointercancel', end, true);
  }

  /* Home 键：应用里回主屏幕；密码界面回锁屏；浮动小白点（手机端）同理 */
  function pressHome() {
    U.sound.tap();
    document.querySelectorAll('.viewer, .kf-menu, .rest-dialog').forEach((v) => v.remove());
    if (mode === 'app') closeApp();
    else if (mode === 'passcode' && cancelPasscode) cancelPasscode();
  }
  document.addEventListener('keydown', (e) => {
    if (mode === 'lock' && (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toPasscode(); }
    else if (mode === 'app' && e.key === 'Escape') { if (!(appInst && appInst.back && appInst.back())) closeApp(); }
  });

  /* 图片查看器 */
  function viewImage(src, title, sub, source, opts = {}) {
    const v = h('div', { class: 'viewer' },
      h('div', { class: 'viewer-top' },
        h('button', { onclick: () => { stopEnding && stopEnding(); v.remove(); } }, '完成'),
        h('div', { class: 'vt-title' }, title, h('small', null, sub)),
        source && source.url ? h('button', { class: 'viewer-source', onclick: () => viewPost({ ...source, image: src }), 'aria-label': '查看照片原帖' }, '原帖 ↗') : h('span', { style: 'width:34px' })),
      h('div', { class: 'viewer-img' }, h('img', { src, alt: '' })));
    screenEl.append(v);
    let stopEnding = null;
    if (opts.ending) stopEnding = playEnding(v);
  }
  /* 出道合照：点开约两秒后，照片暗下来，依次浮现两段话（点一下屏幕可以跳到下一段） */
  function playEnding(v) {
    const parts = (S.debut && S.debut.ending) || [];
    const layer = h('div', { class: 'ending', 'aria-live': 'polite' });
    v.append(layer);
    let i = -1, timers = [], over = false;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    function next() {
      clear(); i++;
      const old = layer.querySelector('.ending-text');
      if (old) { old.classList.add('out'); setTimeout(() => old.remove(), 900); }
      if (i >= parts.length) { over = true; layer.classList.remove('dim'); later(() => layer.remove(), 1400); return; }
      const p = parts[i];
      const box = h('div', { class: 'ending-text' }, p.lines.map((t) => h('p', null, t)), p.sign ? h('small', null, p.sign) : null);
      later(() => { layer.append(box); }, old ? 950 : 0);
      later(next, (old ? 950 : 0) + 2200 + p.lines.join('').length * 80);
    }
    later(() => { layer.classList.add('dim'); later(next, 700); }, 1500);
    layer.addEventListener('click', () => { if (!over && i >= 0) next(); });
    return () => { over = true; clear(); };
  }

  /* 原帖先在手机内展开；外部打开和复制链接分别可用。 */
  function viewPost(input) {
    const match = Object.values(A.photoSources || {}).find((item) => item.url === input.url);
    const source = { ...(match || {}), ...input };
    let url;
    try {
      url = new URL(source.url);
      if (url.protocol !== 'https:' || !['x.com', 'twitter.com'].includes(url.hostname)) return;
    } catch (_) { return; }
    const previousFocus = document.activeElement;
    const previousTone = null;
    const close = () => { panel.remove(); setTone(previousTone); if (previousFocus && previousFocus.isConnected) previousFocus.focus(); };
    const address = h('input', { class: 'post-url', type: 'text', value: url.href, readonly: true,
      'aria-label': '原帖链接', onclick: (event) => event.currentTarget.select() });
    const copyStatus = h('div', { class: 'post-copy-status', role: 'status', 'aria-live': 'polite' });
    const copy = h('button', { class: 'post-copy', type: 'button', onclick: async () => {
      let copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url.href);
          copied = true;
        }
      } catch (_) { /* Older embedded browsers can still use the selected URL below. */ }
      if (!copied) {
        address.focus(); address.select(); address.setSelectionRange(0, address.value.length);
        try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
      }
      copyStatus.textContent = copied ? '链接已复制' : '长按下方链接即可复制';
    } }, '复制链接');
    const panel = h('div', { class: 'viewer post-viewer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Twitter 原帖' },
      h('div', { class: 'viewer-top' },
        h('button', { type: 'button', onclick: close, 'aria-label': '关闭原帖' }, '返回'),
        h('div', { class: 'vt-title' }, 'Twitter 原帖'), h('span', { style: 'width:34px' })),
      h('div', { class: 'post-scroll' },
        h('div', { class: 'post-author' }, '방탄소년단', h('small', null, '@BTS_twt')),
        source.publishedAt ? h('div', { class: 'post-date' }, source.publishedAt + ' · 韩国时间') : null,
        source.caption ? h('p', { class: 'post-caption' }, h('small', null, '原帖内容大意'), source.caption) : h('p', { class: 'post-caption' }, source.title || ''),
        source.image ? h('img', { class: 'post-image', src: source.image, alt: source.title || '原帖照片' }) : null,
        h('div', { class: 'post-actions' },
          h('a', { class: 'post-open', href: url.href, target: '_blank', rel: 'noopener noreferrer' }, '打开原帖 ↗'), copy),
        copyStatus, address));
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); close(); }
    });
    screenEl.append(panel);
    panel.querySelector('button').focus();
  }

  /* 文件查看：文本类文件显示内容，其他显示文件名 */
  function viewFile(f) {
    const body = h('div', { class: 'viewer-file' }, h('div', { class: 'vf-empty' }, '正在打开…'));
    const v = h('div', { class: 'viewer viewer-doc' },
      h('div', { class: 'viewer-top' },
        h('button', { onclick: () => { v.remove(); setTone(prevTone); } }, '完成'),
        h('div', { class: 'vt-title' }, f.name, h('small', null, f.size || '')),
        h('span', { style: 'width:34px' })),
      body);
    const prevTone = null;
    screenEl.append(v);
    if (/\.(txt|md|csv|json)$/i.test(f.src || '')) {
      fetch(f.src).then((r) => r.text()).then((t) => { body.innerHTML = ''; body.append(h('pre', { class: 'vf-text' }, t)); })
        .catch(() => { body.innerHTML = ''; body.append(h('div', { class: 'vf-empty' }, '无法打开文件')); });
    } else { body.innerHTML = ''; body.append(h('div', { class: 'vf-empty' }, '此文件无法预览')); }
  }

  function clear() {
    if (appWin) closeApp(true);
    layers.innerHTML = '';
    homeLayer = null; lockLayer = null;
  }

  document.getElementById('side-btn')?.addEventListener('click', () => {
    if (mode === 'lock') return;
    U.sound.tap();
    document.querySelectorAll('.viewer').forEach((v) => v.remove());
    if (mode === 'passcode' && cancelPasscode) cancelPasscode();
    renderLock();
  });

  const nowMs = () => new Date(S.now.y, S.now.m - 1, S.now.d, S.now.hh, S.now.mm).getTime();
  function setNow(t) { Object.assign(S.now, t); paintClock(); U.store.set('clk', { y: S.now.y, m: S.now.m, d: S.now.d, hh: S.now.hh, mm: S.now.mm }); }
  // 时间会走：现实每过一分钟，手机上也过一分钟（上限由剧情决定，见 js/events.js 的 clockCap）
  setInterval(() => {
    const cap = window.Events && window.Events.clockCap ? window.Events.clockCap() : Infinity;
    if (cap == null) return;
    const next = nowMs() + 60000;
    if (next > cap) return;
    const dt = new Date(next), prevDay = S.now.d;
    setNow({ y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate(), hh: dt.getHours(), mm: dt.getMinutes() });
    if (mode === 'home') { // 时钟图标的指针、过了零点的日历图标跟着变
      ['clock', ...(S.now.d !== prevDay ? ['calendar'] : [])].forEach((id) => {
        const box = homeLayer && homeLayer.querySelector(`[data-app="${id}"] .app-icon`);
        if (box) box.firstChild.replaceWith(U.iconEl(id));
      });
    }
    refreshLock();
    window.Events && window.Events.onMinute && window.Events.onMinute();
  }, 60000);
  function lockNow() { document.querySelectorAll('.viewer').forEach((v) => v.remove()); renderLock(); }
  window.Phone = { openApp, closeApp, home: pressHome, viewImage, viewPost, viewFile, refresh: () => { refreshBadges(); refreshLock(); }, setNow, lock: lockNow, get mode() { return mode; }, screen: screenEl, setTone };
  // 闹钟开关（会话内记住）
  const al = U.store.get('alarms', null); if (al) S.alarms.forEach((a, i) => (a.on = al[i]));
  const savedClk = U.store.get('clk', null);
  window.Events && window.Events.restore();
  window.Debut && window.Debut.restore();
  (function () { // 刷新后接着刚才的时间走
    const c = savedClk; if (!c || !c.y) return;
    const cur = nowMs(), saved = new Date(c.y, c.m - 1, c.d, c.hh, c.mm).getTime();
    const cap = window.Events && window.Events.clockCap ? window.Events.clockCap() : cur;
    if (saved > cur && saved <= Math.max(cap == null ? cur : cap, cur)) setNow(c);
  })();
  renderLock();
})();
