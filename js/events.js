/* 剧情事件：来电 → 第二天的闹钟 → 早上的锁屏。
 * 是否启用、谁打来、几点响，全部在 data/config.js 的 plot 里设置；都为 null 时什么也不发生，时间自由往前走。 */
(function () {
  const S = window.STORY, U = window.UI, { h } = U;
  const CALL = S.plot.call || null, END = S.plot.ending || null;
  const st = () => U.store.get('ev', {});
  const save = (patch) => U.store.set('ev', { ...st(), ...patch });
  let scheduled = false, afterCall = false;
  const mins = (t) => { const [a, b] = t.split(':').map(Number); return a * 60 + b; };
  const parse = (t) => U.parse(t);
  const callP = CALL && CALL.at ? parse(CALL.at) : null;
  const callStamp = () => (CALL.at ? CALL.at : `${U.pad(S.now.m)}-${U.pad(S.now.d)} ${U.pad(S.now.hh)}:${U.pad(S.now.mm)}`);

  /* ---------- 刷新后恢复 ---------- */
  function restore() {
    const e = st();
    if (CALL && e.call) {
      S.calls.push(Object.assign([e.callAt || callStamp(), CALL.from, e.call === 'answered' ? 'in' : 'missed', e.call === 'answered' ? (CALL.talkSeconds || 6) : 0], { fresh: true, seen: true }));
    }
    if (CALL && CALL.after && e.msg) window.Chat.pushMessage(CALL.after[1], CALL.after, true);
    if (END && e.end) applyEnding(true);
    window.Phone.setNow({});
    if (END && e.snoozeUntil && !e.end) { const w = e.wakeMinutes - 9; window.Phone.setNow({ ...END.nextDay, hh: Math.floor(w / 60), mm: w % 60 }); armSnooze(); }
    else if (END && !e.end && allOpened()) scheduleMorning();
  }

  /* ---------- 触发 ---------- */
  function onNoteOpened(id) {
    if (!CALL || !CALL.noteId || id !== CALL.noteId || st().call || scheduled) return;
    scheduled = true;
    setTimeout(incomingCall, CALL.delay || 5000);
  }
  function onUnlock() { U.sound.unlockAudio(); }
  function onMinute() {
    if (!CALL || !callP || st().call || scheduled || st().end) return;
    const now = new Date(S.now.y, S.now.m - 1, S.now.d, S.now.hh, S.now.mm).getTime();
    if (now >= callP.t) { scheduled = true; incomingCall(); }
  }

  /* ---------- 铃声 ---------- */
  let ringTimer = null;
  function ring(on) {
    clearInterval(ringTimer);
    if (!on) { U.sound.stop('ring'); return; }
    const once = () => { if (document.hidden || U.sound.muted) return; U.sound.ring(); U.haptic([400, 200, 400]); };
    once(); ringTimer = setInterval(once, 2200);
  }

  /* ---------- 来电 ---------- */
  const PHONE = '<path d="M20 16.2v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 2.3 4.8 1.8 1.8 0 0 1 4.1 3h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.8.3 1.6.6 2.4a1.8 1.8 0 0 1-.4 1.9L7.6 9.9a14.3 14.3 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.4.6a1.8 1.8 0 0 1 1.7 1.9z"/>';
  function incomingCall() {
    if (!CALL || st().call || st().end || document.querySelector('.fs-alarm')) return;
    if (callP) window.Phone.setNow({ y: callP.y, m: callP.m, d: callP.d, hh: callP.hh, mm: callP.mm });
    const stamp = callStamp();
    const name = U.personName(CALL.from);
    const scr = window.Phone.screen;
    const prevTone = document.getElementById('statusbar').classList.contains('sb-dark') ? 'dark' : 'light';
    window.Phone.setTone('light');
    let timeout;
    const ui = h('div', { class: 'fs-call', role: 'dialog', 'aria-label': name + '来电' },
      h('div', { class: 'fc-head' }, h('div', { class: 'fc-name' }, name), h('div', { class: 'fc-sub' }, '移动电话')),
      h('div', { class: 'fc-btns' },
        h('button', { class: 'fc-no', onclick: () => finish('missed') }, h('span', { html: `<svg viewBox="0 0 24 24">${PHONE}</svg>` }), '拒绝'),
        h('button', { class: 'fc-yes', onclick: () => answer() }, h('span', { html: `<svg viewBox="0 0 24 24">${PHONE}</svg>` }), '接听')));
    scr.append(ui);
    ring(true);
    timeout = setTimeout(() => finish('missed'), 28000);

    function answer() {
      clearTimeout(timeout); ring(false); U.sound.tap();
      let s = 0; const total = CALL.talkSeconds || 6;
      const timer = h('div', { class: 'fc-sub' }, '00:00');
      ui.innerHTML = '';
      const g = (l, ic) => h('div', null, h('i', { html: `<svg viewBox="0 0 24 24">${ic}</svg>` }), l);
      ui.append(h('div', { class: 'fc-head' }, h('div', { class: 'fc-name' }, name), timer),
        h('div', { class: 'fc-grid' }, g('静音', '<path d="M9 9v3a3 3 0 0 0 5 2.2M15 10V6a3 3 0 0 0-6 0M5 11a7 7 0 0 0 11.7 5.2M19 11a7 7 0 0 1-.4 2.3M12 18v3M4 4l16 16"/>'), g('拨号键盘', '<circle cx="7" cy="6" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="17" cy="6" r="1"/><circle cx="7" cy="11" r="1"/><circle cx="12" cy="11" r="1"/><circle cx="17" cy="11" r="1"/><circle cx="7" cy="16" r="1"/><circle cx="12" cy="16" r="1"/><circle cx="17" cy="16" r="1"/>'), g('扬声器', '<path d="M5 10h3l5-4v12l-5-4H5z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 7a7 7 0 0 1 0 10"/>'),
          g('添加通话', '<path d="M12 5v14M5 12h14"/>'), g('视频通话', '<rect x="3" y="6.5" width="12.5" height="11" rx="2"/><path d="M15.5 10.5l5.5-3v9l-5.5-3"/>'), g('通讯录', '<circle cx="12" cy="9" r="3.5"/><path d="M5 20c1-3.5 3.8-5.3 7-5.3s6 1.8 7 5.3"/>')),
        h('button', { class: 'fc-end', 'aria-label': '挂断通话', onclick: () => end() }, h('span', { html: `<svg viewBox="0 0 24 24">${PHONE}</svg>`, style: 'display:contents' }), '结束通话'));
      const iv = setInterval(() => { s++; timer.textContent = `${U.pad(Math.floor(s / 60))}:${U.pad(s % 60)}`; if (s >= total) end(); }, 1000);
      let ended = false;
      function end() { if (ended) return; ended = true; clearInterval(iv); timer.textContent = '通话结束'; setTimeout(() => finish('answered'), 900); }
    }

    function finish(kind) {
      if (ui._done) return; ui._done = true;
      clearTimeout(timeout); ring(false);
      ui.style.transition = 'opacity .3s'; ui.style.opacity = '0';
      setTimeout(() => ui.remove(), 300);
      window.Phone.setTone(prevTone);
      S.calls.push(Object.assign([stamp, CALL.from, kind === 'answered' ? 'in' : 'missed', kind === 'answered' ? (CALL.talkSeconds || 6) : 0], { fresh: true, seen: kind === 'answered' }));
      save({ call: kind, callAt: stamp });
      window.Phone.refresh();
      if (!CALL.after) return;
      afterCall = true;
      setTimeout(() => {
        afterCall = false;
        if (st().end) return;
        const p = parse(CALL.after[0]);
        window.Phone.setNow({ y: p.y, m: p.m, d: p.d, hh: p.hh, mm: p.mm });
        window.Chat.pushMessage(CALL.after[1], CALL.after);
        save({ msg: true });
      }, 7000);
    }
  }

  /* ---------- 第二天的闹钟 ---------- */
  const REQUIRED = (END && END.requiredApps) || [];
  const opened = () => U.store.get('opened', []);
  const allOpened = () => REQUIRED.length > 0 && REQUIRED.every((id) => opened().includes(id));
  let morningTimer = null, snoozeTimer = null;
  function onAppOpened(id) {
    if (!END || !REQUIRED.includes(id) || st().end) return;
    if (!opened().includes(id)) U.store.set('opened', [...opened(), id]);
    if (allOpened()) scheduleMorning();
  }
  function scheduleMorning() {
    if (morningTimer || st().end || st().snoozeUntil) return;
    const tryNow = () => {
      if (document.querySelector('.fs-call') || afterCall) { morningTimer = setTimeout(tryNow, 1000); return; }
      morningTimer = null; ending();
    };
    morningTimer = setTimeout(tryNow, END.delay || 3000);
  }
  function armSnooze() {
    clearTimeout(snoozeTimer);
    const until = st().snoozeUntil; if (!until || st().end) return;
    snoozeTimer = setTimeout(() => { save({ snoozeUntil: null }); ending(true); }, Math.max(0, until - Date.now()));
  }
  function snoozeCard() {
    const e = st();
    if (!END || !e.snoozeUntil || e.end) return null;
    const m = e.wakeMinutes;
    const stopIt = (ev) => { ev.stopPropagation(); clearTimeout(snoozeTimer); U.sound.tap(); save({ snoozeUntil: null }); applyEnding(false, m - 8); };
    return h('div', { class: 'ncard snz-card' },
      h('div', { class: 'napp' }, U.iconEl('clock')),
      h('div', { class: 'nbody' }, h('div', { class: 'nhead' }, h('span', null, '闹钟')), h('div', { class: 'ntext' }, `稍后提醒 · ${U.pad(Math.floor(m / 60))}:${U.pad(m % 60)}`)),
      h('button', { class: 'snz-stop', type: 'button', onclick: stopIt }, '停止'));
  }
  function ending(snoozed = false) {
    if (!END || st().end || document.querySelector('.fs-alarm')) return;
    const label = END.alarmLabel || '闹钟';
    document.querySelectorAll('.fs-call,.pv,.viewer').forEach((x) => x.remove());
    document.getElementById('banner-layer').innerHTML = '';
    window.Phone.closeApp(true);
    const wake = snoozed ? (st().wakeMinutes || mins(END.alarmTime) + 9) : mins(END.alarmTime);
    window.Phone.setNow({ ...END.nextDay, hh: Math.floor(wake / 60), mm: wake % 60 });
    window.Phone.lock();
    U.sound.alarm();
    const stop = () => { U.sound.stop('alarm'); U.haptic(0); ui.remove(); applyEnding(false, wake + 1); };
    const snooze = () => {
      U.sound.stop('alarm'); U.haptic(0); ui.remove();
      save({ snoozeUntil: Date.now() + 9 * 60 * 1000, wakeMinutes: wake + 9 });
      window.Phone.lock();
      U.banner({ appId: 'clock', title: label, text: '9分钟后再次提醒' });
      armSnooze();
    };
    const ui = h('div', { class: 'fs-alarm', role: 'dialog', 'aria-label': '闹钟' },
      h('div', { class: 'fa-in' }, h('div', { class: 'fa-time' }, `${U.pad(Math.floor(wake / 60))}:${U.pad(wake % 60)}`), h('div', { class: 'fa-label' }, label),
        h('button', { class: 'fa-snooze', onclick: snooze }, '稍后提醒（9分钟）'),
        h('button', { class: 'fa-stop', onclick: stop }, '停止')));
    window.Phone.screen.append(ui);
    window.Phone.setTone('light');
  }
  function applyEnding(silent, minute) {
    (END.messages || []).forEach(([room, raw]) => window.Chat.pushMessage(room, raw, true));
    const m = silent ? (st().endMinute || mins(END.alarmTime) + 1) : minute;
    window.Phone.setNow({ ...END.nextDay, hh: Math.floor(m / 60), mm: m % 60 });
    if (!silent) {
      save({ end: true, snoozeUntil: null, endMinute: m });
      window.Phone.lock();
      setTimeout(sleep, 7000);
    }
  }
  function sleep() {
    if (window.Phone.mode !== 'lock' || document.querySelector('.screen-off')) return;
    const off = h('div', { class: 'screen-off' });
    off.addEventListener('click', () => { off.classList.add('wake'); setTimeout(() => off.remove(), 400); });
    window.Phone.screen.append(off);
  }

  /* 时钟能走到哪一分钟（返回绝对毫秒；null = 不走） */
  function clockCap() {
    const e = st();
    if (document.querySelector('.fs-alarm')) return null;
    if (END && e.snoozeUntil) { const w = e.wakeMinutes - 1; return new Date(END.nextDay.y, END.nextDay.m - 1, END.nextDay.d, Math.floor(w / 60), w % 60).getTime(); }
    if (CALL && callP && !e.call) return callP.t;
    if (END && !e.end) { const w = mins(END.alarmTime) - 1; return new Date(END.nextDay.y, END.nextDay.m - 1, END.nextDay.d, Math.floor(w / 60), w % 60).getTime(); }
    return Infinity;
  }

  document.addEventListener('visibilitychange', () => { if (!document.hidden && document.querySelector('.fs-alarm')) U.sound.alarm(); });
  window.Events = { onMinute, clockCap, snoozeCard, onNoteOpened, onUnlock, onAppOpened, restore, _call: incomingCall, _end: ending };
})();
