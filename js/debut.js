/* 跳转时间：跳到 6 月 13 日晚上。锁屏上，群里的庆祝和六个人的消息一条接一条弹出来。 */
(function () {
  const S = window.STORY, U = window.UI, { h } = U, D = S.debut;
  if (!D) return;
  const jumped = () => !!U.store.get('jumped', false);
  // 按时间排好的全部消息：[房间, 原始消息]
  function queue() {
    const roomId = (S.group && S.group.roomId) || 'dorm';
    const list = D.group.map(([at, from, text], i) => ({ room: roomId, raw: [at, from, text], k: `0${at}${String(i).padStart(3, '0')}` }));
    Object.entries(D.letters).forEach(([id, l]) => {
      // 一段话要打好几分钟：每三句往后挪一分钟
      const [md, hm] = l.at.split(' '), [hh, mm] = hm.split(':').map(Number);
      l.lines.forEach((text, i) => {
        const t = hh * 60 + mm + Math.floor(i / 3), at = `${md} ${U.pad(Math.floor(t / 60))}:${U.pad(t % 60)}`;
        list.push({ room: id, raw: [at, id, text], k: `0${at}${id}${String(i).padStart(3, '0')}` });
      });
    });
    return list.sort((a, b) => a.k.localeCompare(b.k));
  }
  let timer = null;
  function deliver(item) {
    const onLock = window.Phone.mode === 'lock' || window.Phone.mode === 'passcode';
    window.Chat.pushMessage(item.room, item.raw, onLock); // 锁屏时静默加入，由锁屏刷新显示；打开着手机时照常弹横幅
    if (onLock) { window.Phone.refresh(); U.sound.msg(); U.haptic(30); }
  }
  function run(from) {
    const list = queue();
    let i = from;
    const step = () => {
      if (i >= list.length) { timer = null; window.Chat.momAfterDebut && window.Chat.momAfterDebut(); return; }
      deliver(list[i]); i++; U.store.set('jumpIdx', i);
      // 群里的消息快一点，私聊的话慢一点，像是一条条打出来的
      timer = setTimeout(step, list[i] && list[i].room === list[i - 1].room ? (list[i].room === 'dorm' ? 380 : 650) : 1100);
    };
    timer = setTimeout(step, 900);
  }
  function jump() {
    if (jumped()) return;
    U.store.set('jumped', true); U.store.set('jumpIdx', 0);
    const fade = h('div', { class: 'jump-fade' }, h('div', null, '2013年6月13日'), h('small', null, '出道舞台结束以后'));
    window.Phone.screen.append(fade);
    setTimeout(() => {
      window.Phone.closeApp(true);
      window.Phone.setNow(D.now);
      window.Phone.lock();
      setTimeout(() => { fade.classList.add('out'); setTimeout(() => fade.remove(), 800); run(0); }, 1500);
    }, 900);
  }
  function restore() {
    if (!jumped()) return;
    const list = queue(), done = Math.min(U.store.get('jumpIdx', list.length), list.length);
    list.slice(0, done).forEach((item) => window.Chat.pushMessage(item.room, item.raw, true));
    window.Chat.resort && window.Chat.resort();
    const n = S.now, cur = new Date(n.y, n.m - 1, n.d, n.hh, n.mm).getTime();
    if (cur < new Date(D.now.y, D.now.m - 1, D.now.d, D.now.hh, D.now.mm).getTime()) window.Phone.setNow(D.now);
    if (done < list.length) run(done); // 刷新时还没弹完的接着弹
  }
  window.Debut = { jump, restore, get jumped() { return jumped(); } };
})();
