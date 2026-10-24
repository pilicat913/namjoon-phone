/* 把 data/ 里的数据整理成界面需要的样子。一般不用改这个文件。 */
(function () {
  const S = window.STORY, A = window.ASSETS || (window.ASSETS = {});
  const NOW = S.now;
  const toTime = (t) => {
    const [md, hm = '00:00'] = String(t).split(' ');
    const p = md.split('-').map(Number);
    const [y, m, d] = p.length === 3 ? p : [NOW.y, ...p];
    const [hh, mm] = hm.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm).getTime();
  };
  const nowT = () => new Date(NOW.y, NOW.m - 1, NOW.d, NOW.hh, NOW.mm).getTime();
  const byId = {};
  (S.contacts || []).forEach((c) => (byId[c.id] = c));

  /* 某个联系人 / 聊天室现在是否已经出现 */
  S.isVisible = (idOrSince) => {
    if (S.previewAll) return true;
    const since = byId[idOrSince] ? byId[idOrSince].since : idOrSince;
    return !since || toTime(since) <= nowT();
  };

  /* 聊天、头像、通知里用的人物表：显示名 = 备注 */
  S.people = {};
  (S.contacts || []).forEach((c) => {
    S.people[c.id] = { name: c.remark || c.name, fullName: c.name, role: c.role, status: c.status || '', since: c.since, kakao: !!c.kakao, channel: !!c.channel };
  });

  /* 通讯录：只保留已经出现的人，名字显示备注 */
  S.contacts = (S.contacts || []).filter((c) => !c.channel && S.isVisible(c.id)).map((c) => ({ ...c, fullName: c.name, name: c.remark || c.name }));

  // A newline in authored chat text is a new bubble, never an HTML line break.
  const separateMessages = (messages = []) => messages.flatMap((m) =>
    typeof m[2] === 'string'
      ? m[2].split(/\r?\n+/).filter((line) => line.trim()).map((line) => [m[0], m[1], line, ...m.slice(3)])
      : [m]
  );
  /* 聊天室：人还没出现的私聊、还没建的群隐藏；晚于“现在”的消息不显示 */
  const notFuture = (m) => toTime(m[0]) <= nowT();
  S.rooms = (S.rooms || [])
    .filter((r) => (r.with ? S.isVisible(r.with) : true) && (!r.since || S.isVisible(r.since)))
    .map((r) => ({ ...r, messages: separateMessages(r.messages).filter(notFuture), live: separateMessages(r.live || []) }))
    .filter((r) => r.messages.length);
  S.liveRoomId = (S.rooms.find((r) => r.live && r.live.length) || {}).id || null;

  S.sms = (S.sms || [])
    .filter((t) => !t.with || S.isVisible(t.with))
    .map((t) => ({ ...t, name: t.with && byId[t.with] ? (byId[t.with].remark || t.name) : t.name, messages: separateMessages(t.messages).filter(notFuture) }))
    .filter((t) => t.messages.length);
  S.calls = (S.calls || []).filter((c) => notFuture(c) && (!byId[c[1]] || S.isVisible(c[1])));

  S.plot = S.plot || {};
  S.widgets = S.widgets || {};
  A.files = A.files || {};
  if (S.title) document.title = S.title;
})();
