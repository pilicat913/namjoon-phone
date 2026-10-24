/* 聊天应用 */
(function () {
  const S = window.STORY, A = window.ASSETS, U = window.UI, { h } = U;

  /* ---------- 数据整理 ---------- */
  const rooms = S.rooms.map((r) => ({
    ...r,
    msgs: r.messages.map((m, i) => toMsg(r.id, m, i)),
  }));
  function toMsg(roomId, m, i, prefix = '') {
    const [t, from, content, opt = {}] = m;
    return { id: `${roomId}-${prefix}${i}`, roomId, p: U.parse(t), from, content, u: opt.u, unread: !!opt.unread };
  }
  const roomById = (id) => rooms.find((r) => r.id === id);
  const interaction = window.PhoneInteractionEngine.create(S.interactions, U.store);
  // Authored history stays intact; reader messages and replies live in a separate log.
  const interactiveLog = U.store.get('interactiveLog', []);
  interactiveLog.forEach((item) => {
    const room = roomById(item.roomId); if (!room) return;
    room.msgs.push({ id:item.id,roomId:item.roomId,p:U.parse(item.at),from:item.from,content:item.content,unread:item.from!=='me',interactive:true });
  });

  // 已读状态（会话内保留）
  const readIds = new Set(U.store.get('readIds', []));
  const isUnread = (m) => m.unread && !readIds.has(m.id);
  function markRead(room) {
    let changed = false;
    room.msgs.forEach((m) => { if (isUnread(m)) { readIds.add(m.id); changed = true; } });
    if (changed) { U.store.set('readIds', [...readIds]); emit(); }
  }
  const unreadCount = (room) => room.msgs.filter(isUnread).length;
  const totalUnread = () => rooms.reduce((n, r) => n + unreadCount(r), 0);

  // 实时消息（只发生一次）
  const liveDone = () => U.store.get('liveDone', 0);
  // 恢复已到达的实时消息
  (function restoreLive() {
    const g = roomById(S.liveRoomId); if (!g) return; const n = liveDone();
    const times = U.store.get('liveTimes', []);
    for (let i = 0; i < Math.min(n, g.live.length); i++) {
      const raw = times[i] ? [times[i], ...g.live[i].slice(1)] : g.live[i];
      g.msgs.push({ ...toMsg(g.id, raw, i, 'live'), unread: true });
    }
  })();

  let liveScheduled = false;
  let current = null; // 当前挂载的实例（实时消息投递用）
  const listeners = new Set();
  const emit = () => listeners.forEach((f) => f());
  const onChange = (f) => { listeners.add(f); return () => listeners.delete(f); };

  const lastMsg = (room) => room.msgs[room.msgs.length - 1];
  const RX = () => S.readerExtras || {};
  const won = (n) => '₩' + Number(n || 0).toLocaleString('en-US');
  const giftItem = (id) => (RX().giftItems || []).find((x) => x.id === id);
  const roomTitle = (room) => room.name || (room.members ? room.members.map(U.personName).join(', ') : U.personName(room.with));
  function preview(m) {
    const c = m.content;
    if (typeof c === 'string') return c.split('\n')[0];
    if (c.fail) return c.text;
    if (c.photo) return '照片';
    if (c.file) return '文件';
    if (c.sticker) return '表情';
    if (c.voice) return '语音消息';
    if (c.call) return c.outgoing ? `${c.kind==='video'?'视频':'语音'}通话 · ${c.outcome==='cancelled'?'已取消':'对方未接听'}` : c.call === 'missed' ? '未接语音通话' : '语音通话';
    if (c.link) return c.link.title;
    if (c.pay === 'transfer') return `转账 ${won(c.amount)}`;
    if (c.pay === 'refund') return `已退还 ${won(c.amount)}`;
    if (c.pay === 'gift') return `礼物 · ${(giftItem(c.item) || {}).name || '礼物券'}`;
    if (c.card) return c.card.title;
    if (c.deleted) return '已删除的消息';
    if (c.sys) return c.sys;
    return '';
  }

  /* ---------- 图标 ---------- */
  const I = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>',
    addChat: '<path d="M20 11.5c0 4-3.6 7-8 7-1 0-1.9-.1-2.7-.4L4.5 19.5l1.3-3.3C4.7 14.9 4 13.3 4 11.5c0-4 3.6-7 8-7s8 3 8 7z"/><path d="M12 8.5v6M9 11.5h6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5l1.4 1.1-1.8 3.1-1.7-.6a7.3 7.3 0 0 1-2 1.2l-.3 1.8h-3.6l-.3-1.8a7.3 7.3 0 0 1-2-1.2l-1.7.6-1.8-3.1 1.4-1.1a7 7 0 0 1 0-2.9L3.6 9.5l1.8-3.1 1.7.6a7.3 7.3 0 0 1 2-1.2L9.4 4h3.6l.3 1.8a7.3 7.3 0 0 1 2 1.2l1.7-.6 1.8 3.1-1.4 1.1a7 7 0 0 1 0 2.9z"/>',
    addFriend: '<circle cx="10" cy="8.5" r="3.6"/><path d="M3.5 19.5c.8-3.6 3.4-5.6 6.5-5.6 1.5 0 2.8.4 3.9 1.2M18 13v6M15 16h6"/>',
    person: '<circle cx="12" cy="8.3" r="4" class="nofill"/><path d="M4.5 20.5c.9-4.1 3.9-6.4 7.5-6.4s6.6 2.3 7.5 6.4z"/>',
    bubble: '<path d="M20.5 11.5c0 4.2-3.8 7.5-8.5 7.5-1 0-2-.2-2.9-.5L4 20.5l1.4-3.7C4.2 15.5 3.5 13.6 3.5 11.5 3.5 7.3 7.3 4 12 4s8.5 3.3 8.5 7.5z"/>',
    dots: '<circle cx="5.5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18.5" cy="12" r="1.3"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2"/><circle cx="9.3" cy="10" r=".6"/><circle cx="14.7" cy="10" r=".6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    img: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 16l-5-5-9 8.5"/>',
    mute: '<path d="M5 9h3l4-4v14l-4-4H5z" fill="currentColor"/>',
    call: '<path d="M20 16.2v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 2.3 4.8 1.8 1.8 0 0 1 4.1 3h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.8.3 1.6.6 2.4a1.8 1.8 0 0 1-.4 1.9L7.6 9.9a14.3 14.3 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.4.6a1.8 1.8 0 0 1 1.7 1.9z"/>',
    video: '<rect x="3" y="6.5" width="12.5" height="11" rx="2"/><path d="M15.5 10.5l5.5-3v9l-5.5-3"/>',
    won: '<circle cx="12" cy="12" r="8.5"/><path d="M7.5 9l1.8 6 2.7-6 2.7 6 1.8-6M7 11.5h10"/>',
    at: '<circle cx="12" cy="12" r="3.6"/><path d="M15.6 12v1.6a2.6 2.6 0 0 0 5.2 0V12a8.8 8.8 0 1 0-3.4 6.9"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5.5-4.5-6-2s4 2 6 2zM12 9c1.5-3.5 5.5-4.5 6-2s-4 2-6 2z"/>',
  };
  const ico = (k, cls = 'k-ico') => h('span', { class: cls, html: `<svg viewBox="0 0 24 24">${I[k]}</svg>` });

  function stamp() {
    const n=S.now;return `${n.y}-${U.pad(n.m)}-${U.pad(n.d)} ${U.pad(n.hh)}:${U.pad(n.mm)}`;
  }
  function latest(roomId) { U.store.set('jumpLatestRooms',{...U.store.get('jumpLatestRooms',{}),[roomId]:true}); }
  function appendInteractive(roomId,from,content) {
    const room=roomById(roomId);if(!room)return;
    const seq=U.store.get('interactionSeq',0)+1;U.store.set('interactionSeq',seq);
    const item={id:`reader-${seq}`,roomId,from,content,at:stamp()};
    interactiveLog.push(item);U.store.set('interactiveLog',interactiveLog);
    const m={...item,p:U.parse(item.at),unread:from!=='me',interactive:true};room.msgs.push(m);
    latest(roomId);
    if(current&&current.isVisible())current.deliver(m);
    else {
      emit();
      if(from!=='me')U.banner({appId:'chat',title:U.personName(from),text:preview(m),onOpen:()=>window.Phone.openApp('chat',{room:roomId,latest:true})});
    }
    return m;
  }
  let pending=U.store.get('pendingInteractiveReplies',[]),replyTimer;
  function armReplies() {
    clearTimeout(replyTimer);if(!pending.length)return;
    pending.sort((a,b)=>a.dueAt-b.dueAt);
    replyTimer=setTimeout(()=>{
      const now=Date.now(),ready=pending.filter(x=>x.dueAt<=now);
      pending=pending.filter(x=>x.dueAt>now);U.store.set('pendingInteractiveReplies',pending);
      ready.forEach(x=>{if(x.content!=null)appendInteractive(x.roomId,x.from,x.content);if(x.update)applyUpdate(x.roomId,x.update);});armReplies();
    },Math.max(0,pending[0].dueAt-Date.now()));
  }
  function enqueueReply(roomId,from,messages,update,firstDelay=1000) {
    let dueAt=Math.max(Date.now()+firstDelay,...pending.filter(x=>x.roomId===roomId).map(x=>x.dueAt+650));
    messages.forEach((content,i)=>{pending.push({roomId,from,content,dueAt,update:i===messages.length-1?update:undefined});dueAt+=650;});
    if(!messages.length&&update)pending.push({roomId,from,content:null,dueAt,update});
    U.store.set('pendingInteractiveReplies',pending);armReplies();
  }
  // 转账、礼物的卡片状态（等待 → 已收款 / 已退还 / 已领取）
  function applyUpdate(roomId,update) {
    const item=interactiveLog.find(x=>x.id===update.id);
    if(item&&item.content&&typeof item.content==='object'){item.content.status=update.status;U.store.set('interactiveLog',interactiveLog);}
    const room=roomById(roomId),m=room&&room.msgs.find(x=>x.id===update.id);
    if(m&&m.content&&typeof m.content==='object')m.content.status=update.status;
    if(current&&current.refreshRoom)current.refreshRoom(roomId);
  }
  function sendPay(roomId,to,content) {
    const m=appendInteractive(roomId,'me',{...content,status:'pending'});
    const reply=interaction.payReply(to,content.pay,content.item,{amount:content.amount,note:content.note});
    const status=content.pay==='gift'?'received':reply.outcome==='accepted'?'accepted':'returned';
    const tail=content.pay==='transfer'&&status==='returned'?[{pay:'refund',amount:content.amount}]:[];
    if(reply.giftBack)tail.push({pay:'gift',item:reply.giftBack,status:'pending'}); // 回礼：点一下就能领取
    enqueueReply(roomId,to,[...reply.messages,...tail],{id:m.id,status},2200);
  }
  armReplies();
  let readerBursts=U.store.get('readerBursts',{}),burstTimer;
  function armBursts(){
    clearTimeout(burstTimer);const entries=Object.entries(readerBursts);if(!entries.length)return;
    burstTimer=setTimeout(()=>{
      const now=Date.now();
      Object.entries(readerBursts).forEach(([roomId,b])=>{
        if(b.dueAt>now)return;
        delete readerBursts[roomId];
        if(b.group){const seq=groupReply(roomId,b.inputs);window.Feedback?.flush(roomId,roomTitle(roomById(roomId)),seq.map(x=>x[1]));enqueueSeq(roomId,seq);return;}
        const totalMessages=interactiveLog.filter(m=>m.roomId===roomId&&m.from==='me'&&typeof m.content==='string').length;
        const reply=interaction.respondBatch(b.from,b.inputs,{totalMessages,photo:U.store.get('viewedPhotos',{})[roomId]||null,debut:!!U.store.get('jumped',false)});
        window.Feedback?.flush(roomId,U.personName(b.from),reply.messages);
        enqueueReply(roomId,b.from,reply.messages);
      });
      U.store.set('readerBursts',readerBursts);armBursts();
    },Math.max(0,Math.min(...entries.map(([,b])=>b.dueAt))-Date.now()));
  }
  function queueReaderInput(roomId,from,text){
    const old=readerBursts[roomId];
    readerBursts[roomId]={from,inputs:[...(old?.inputs||[]),text].slice(-12),dueAt:Date.now()+1100};
    U.store.set('readerBursts',readerBursts);armBursts();
  }
  armBursts();
  function queueGroupInput(roomId,text){
    const old=readerBursts[roomId];
    readerBursts[roomId]={group:true,inputs:[...(old?.inputs||[]),text].slice(-12),dueAt:Date.now()+1100};
    U.store.set('readerBursts',readerBursts);armBursts();
  }
  // 一串不同人的消息，按顺序一条一条冒出来
  function enqueueSeq(roomId,seq){
    let dueAt=Math.max(Date.now()+1200,...pending.filter(x=>x.roomId===roomId).map(x=>x.dueAt+700));
    seq.forEach(([from,content,gap])=>{dueAt+=gap||0;pending.push({roomId,from,content,dueAt});dueAt+=800+Math.min(1400,String(content).length*70);});
    U.store.set('pendingInteractiveReplies',pending);armReplies();
  }
  /* 群聊：被 @ 的人（或最合适的人）先回一句相关的，然后可能有人开个新话题 */
  const SHORT={yq:'玧其',sx:'硕珍',hx:'号锡',jw:'智旻',ty:'泰亨',jy:'柾国'};
  function groupReply(roomId,inputs){
    const G=S.group,room=roomById(roomId);if(!G||!room)return [];
    const st=U.store.get('groupState',{used:{},scene:0,debut:0,lastLead:''});
    const text=(window.ZH?window.ZH.toSimp(inputs.join(' ')):inputs.join(' ')).replace(/[❤♥💕💗💖💓💘💞🫶]\uFE0F?/gu,'爱').replace(/[😭😢🥲🥺🥹]/gu,'哭'),low=text.toLowerCase(),members=room.members.filter(id=>G.lead[id]);
    const aliases=(S.nameReplies&&S.nameReplies.aliases)||{};
    const named=(str)=>members.find(id=>(aliases[id]||[SHORT[id]]).some(a=>a.length>=2&&str.toLowerCase().startsWith(a.toLowerCase())));
    let lead=null;const at=text.match(/@\s*([^\s@]+)/);
    if(at)lead=named(at[1]);
    if(!lead)lead=members.find(id=>(aliases[id]||[]).some(a=>a.length>=2&&!/^[a-z]+$/i.test(a)&&text.includes(a)))||null;
    const lowNoAt=low.replace(/@\s*[^\s@]+/g,'').trim()||low;
    const jumpedNow=!!U.store.get('jumped',false);
    const topic=G.topics.find(tp=>!(tp.beforeDebut&&jumpedNow)&&!(tp.afterDebut&&!jumpedNow)&&new RegExp(tp.re,'i').test(lowNoAt));
    if(!lead){const pool=(topic?topic.prefer:members).filter(id=>id!==st.lastLead&&members.includes(id));lead=pool[Math.floor(Math.random()*pool.length)]||members[0];}
    const bare=text.trim().toLowerCase().replace(/[啊呀！!~～。.]+$/,'').replace(/^(.+?)\1+$/,'$1');
    const nameOnly=!at&&lead&&(aliases[lead]||[]).some(a=>a.toLowerCase()===bare);
    const onlyAt=(at&&!text.replace(/@\s*[^\s@]+/g,'').trim())||nameOnly;
    // 话里点名了谁（不是随便挑的人），而且这个话题有“说的就是我”的版本，就用那一版
    const namedLead=!!(at||members.find(id=>(aliases[id]||[]).some(a=>a.length>=2&&!/^[a-z]+$/i.test(a)&&text.includes(a))));
    let key=onlyAt&&G.lead[lead].called?'called':topic&&G.lead[lead][topic.key]?topic.key:'any';
    if(topic&&namedLead&&G.lead[lead][topic.key+'Me'])key=topic.key+'Me';
    // 群里骂人：第一次有人回，第二次大家不接话，第三次起没人理
    if(key==='harshG'){st.harsh=(st.harsh||0)+1;if(st.harsh>=2){U.store.set('groupState',st);return st.harsh===2?[['sx','……南俊 先睡吧'],['yq','……']]:[];}}
    const rounds=G.lead[lead][key],n=st.used[lead+':'+key]||0;st.used[lead+':'+key]=n+1;
    // 同一个人这次要说的和他上次在群里说的一模一样：换成通用反应，不复读
    st.last=st.last||{};
    let leadLines=rounds[n%rounds.length];
    if(leadLines.join('|')===st.last[lead]&&G.follow&&G.follow[lead]){const fn=st.used[lead+':follow']||0;st.used[lead+':follow']=fn+1;leadLines=G.follow[lead][fn%G.follow[lead].length];}
    st.last[lead]=leadLines.join('|');
    const seq=leadLines.map(line=>[lead,line]);
    st.lastLead=lead;
    // 不只一个人理：再有一两个人接着回读者这句（同话题用自己的台词，没有就用通用反应），之后才可能岔开闲聊
    // 没接住（没有话题）时只让一个人回，不再有人跟着附和、也不岔开闲聊，免得像“已读乱回”
    if(key!=='any'&&(!onlyAt||Math.random()<.5)){
      const others=members.filter(id=>id!==lead);
      const pref=(topic?topic.prefer:[]).filter(id=>others.includes(id));
      const rest=others.filter(id=>!pref.includes(id)).sort(()=>Math.random()-.5);
      const count=onlyAt?1:(Math.random()<.55?2:1);
      [...pref,...rest].slice(0,count).forEach((f,i)=>{
        const ok=key.endsWith('Me')&&G.lead[f][topic.key+'Others']?topic.key+'Others':topic.key;
        const fk=topic&&!onlyAt&&G.lead[f][ok]?ok:null;
        const pool=fk?G.lead[f][fk]:(G.follow&&G.follow[f]);
        if(!pool||!pool.length)return;
        const uk=f+':'+(fk||'follow'),m=st.used[uk]||0;st.used[uk]=m+1;
        const fl=pool[m%pool.length];
        if(fl.join('|')===st.last[f])return; // 跟自己上次说的一样就这次不出声
        st.last[f]=fl.join('|');
        fl.forEach((line,j)=>seq.push([f,line,j?0:(i?500:700)]));
      });
    }
    const debut=!!U.store.get('jumped',false),list=debut?G.debutScenes:G.scenes,k=debut?'debut':'scene';
    // 闲聊小场景：每局随机顺序，用过的不再出现，用完就不再岔开
    const order=st[k+'Order']||(st[k+'Order']=(list||[]).map((_,i)=>i).sort(()=>Math.random()-.5));
    if(key!=='any'&&list&&order.length&&Math.random()<.35){
      const scene=list[order.shift()];
      scene.forEach(([from,line],i)=>seq.push([from,line,i?0:1500]));
    }
    U.store.set('groupState',st);
    return seq;
  }
  let activeCall=null;
  function startCall(id,kind) {
    if(activeCall||!interaction.hasContact(id))return;
    const room=rooms.find(r=>r.with===id&&!r.members);if(!room)return;
    document.querySelectorAll('.k-profile').forEach(el=>el.remove());
    U.sound.unlockAudio();U.sound.dial();
    const status=h('p',{class:'ki-call-status','aria-live':'polite'},'正在呼叫…');
    const end=h('button',{class:'ki-call-end','aria-label':'挂断通话',onclick:()=>finish(true)},ico('call'));
    const overlay=h('div',{class:'ki-call',role:'dialog','aria-modal':'true','aria-label':`${U.personName(id)}的${kind==='video'?'视频':'语音'}通话`},
      h('div',{class:'ki-call-mode'},ico(kind==='video'?'video':'call'),kind==='video'?'视频通话':'语音通话'),
      U.avatar(id,112),h('h2',null,U.personName(id)),status,end,h('span',{class:'ki-call-label'},'挂断'));
    window.Phone.screen.append(overlay);
    let finished=false,closeTimer;
    const dialTimer=setInterval(()=>U.sound.dial(),1200);
    const remoteTimer=setTimeout(()=>finish(false),2500);
    function close(){clearTimeout(closeTimer);overlay.remove();activeCall=null;document.removeEventListener('visibilitychange',onHide);}
    function onHide(){if(document.hidden&&!finished)finish(true);}
    function finish(cancelled) {
      if(finished)return;finished=true;clearInterval(dialTimer);clearTimeout(remoteTimer);U.sound.stop('dial');
      appendInteractive(room.id,'me',{call:'out',outgoing:true,kind,outcome:cancelled?'cancelled':'rejected'});
      if(cancelled){close();return;}
      status.textContent='对方已挂断';end.disabled=true;
      enqueueReply(room.id,id,interaction.callReply(id,kind).messages);
      closeTimer=setTimeout(()=>{close();window.Phone.openApp('chat',{room:room.id,latest:true});},750);
    }
    activeCall={close:()=>finish(true)};document.addEventListener('visibilitychange',onHide);
  }

  function groupAvatar(room, size) {
    const g = h('div', { class: 'av av-group', style: `width:${size}px;height:${size}px` });
    room.members.slice(0, 4).forEach((id) => g.append(U.avatar(id, size / 2)));
    return g;
  }
  const roomAvatar = (room, size) => (room.members ? groupAvatar(room, size) : U.avatar(room.with, size));

  /* ============================================================
   * 应用挂载
   * ============================================================ */
  function mount(win, ctx) {
    const stack = [];
    let tab = 'chats';
    const cleanups = [];

    const root = h('div', { class: 'page k-page' });
    win.append(root);
    stack.push({ el: root, tone: 'dark' });
    ctx.setTone('dark');

    function renderRoot() {
      root.innerHTML = '';
      if (tab === 'friends') root.append(...friendsView());
      else if (tab === 'chats') root.append(...chatsView());
      else if (tab === 'find') root.append(...findView());
      else root.append(...moreView());
      root.append(tabBar());
    }

    function tabBar() {
      const n = totalUnread();
      const t = (id, icon, label) => h('button', { class: 'k-tab' + (tab === id ? ' on' : ''), 'aria-label': label, onclick: () => { if (tab !== id) { tab = id; U.sound.tap(); renderRoot(); if (id === 'chats') maybeLive(); } } },
        h('span', { html: `<svg viewBox="0 0 24 24">${I[icon]}</svg>`, style: 'display:contents' }), label,
        id === 'chats' && n ? h('span', { class: 'k-tbadge' }, n > 99 ? '99+' : n) : null);
      return h('nav', { class: 'k-tabs' }, t('friends', 'person', '好友'), t('chats', 'bubble', '聊天'), t('find', 'search', '查找'), t('more', 'dots', '更多'));
    }

    /* ----- 好友 ----- */
    function friendsView() {
      const list = h('div', { class: 'k-scroll' });
      list.append(h('div', { class: 'k-me', role: 'button', tabindex: '0', onclick: () => openProfile('me'), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProfile('me'); } } }, U.avatar('me', 60),
        h('div', null, h('div', { class: 'k-name' }, S.me.name), S.me.status ? h('div', { class: 'k-status' }, S.me.status) : null)));
      const friends = Object.keys(S.people).filter((id) => S.people[id].kakao && !S.people[id].channel && S.isVisible(id)).sort((a, b) => U.personName(a).localeCompare(U.personName(b), 'zh'));
      const channels = Object.keys(S.people).filter((id) => S.people[id].channel && S.isVisible(id));
      list.append(h('div', { class: 'k-sec' }, `好友 ${friends.length}`));
      friends.forEach((id) => list.append(friendRow(id)));
      if (channels.length) { list.append(h('div', { class: 'k-sec' }, `频道 ${channels.length}`)); channels.forEach((id) => list.append(friendRow(id))); }
      return [h('header', { class: 'k-head' }, homeBack(), h('h1', null, '好友'), h('div', { class: 'k-icons' }, ico('addFriend'))), searchStrip('搜索好友'), list];
    }
    function friendRow(id) {
      const p = S.people[id];
      return h('button', { class: 'k-row', onclick: () => openProfile(id) }, U.avatar(id, 44),
        h('div', { class: 'k-mid' }, h('div', { class: 'k-name' }, p.name), p.status ? h('div', { class: 'k-st' }, p.status) : null));
    }

    /* ----- 聊天列表 ----- */
    function chatsView() {
      const list = h('div', { class: 'k-scroll' });
      const sorted = [...rooms].sort((a, b) => cmpP(lastMsg(b).p, lastMsg(a).p));
      sorted.forEach((r) => {
        const lm = lastMsg(r), n = unreadCount(r);
        const row = h('button', { class: 'k-row', 'data-room': r.id, onclick: () => openRoom(r.id) },
          roomAvatar(r, 48),
          h('div', { class: 'k-mid' },
            h('div', { class: 'k-name' }, h('span', null, roomTitle(r)), r.members ? h('em', null, r.members.length + 1) : null,
              r.channel ? h('span', { class: 'k-chtag' }, '频道') : null,
              r.channel ? h('span', { html: '<svg class="k-mute" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4zM16 9l5 6M21 9l-5 6" stroke="#c4c4c4" stroke-width="1.6" fill="#c4c4c4"/></svg>' }) : null),
            h('div', { class: 'k-prev' }, preview(lm))),
          h('div', { class: 'k-side' }, h('span', { class: 'k-time' }, U.listDate(lm.p)), n ? h('span', { class: 'k-unread' }, n) : null));
        list.append(row);
      });
      return [h('header', { class: 'k-head' }, homeBack(), h('h1', null, '聊天'), h('div', { class: 'k-icons' }, ico('addChat'))), searchStrip('搜索聊天'), list];
    }

    /* ----- 更多 ----- */
    function moreView() {
      const list = h('div', { class: 'k-scroll' },
        h('div', { class: 'k-me', role: 'button', tabindex: '0', onclick: () => openProfile('me'), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProfile('me'); } } }, U.avatar('me', 52), h('div', null, h('div', { class: 'k-name' }, S.me.name), h('div', { class: 'k-status' }, S.me.status || '我的资料'))),
        h('div', { class: 'k-more-list' },
          h('div', null, '公告', h('span', null, '')),
          h('div', null, '通知', h('span', null, '开')),
          h('div', null, '隐私', h('span', null, '')),
          h('div', null, '版本信息', h('span', null, (S.device || {}).kakaoVersion || ''))));
      return [h('header', { class: 'k-head' }, homeBack(), h('h1', null, '更多'), h('div', { class: 'k-icons' }, ico('gear'))), list];
    }
    const homeBack = () => h('button', { class: 'kr-back', type: 'button', 'aria-label': '回到主屏幕', onclick: () => window.Phone.home() }, '主屏幕');
    const searchStrip = (ph) => h('div', { class: 'k-searchbar' }, h('div', null, h('span', { html: `<svg viewBox="0 0 24 24">${I.search}</svg>`, style: 'display:contents' }), ph));
    /* ----- 查找：推荐频道 ----- */
    function findView() {
      const list = h('div', { class: 'k-scroll' });
      const channels = Object.keys(S.people).filter((id) => S.people[id].channel && S.isVisible(id));
      list.append(h('div', { class: 'k-sec' }, '推荐频道'));
      channels.forEach((id) => list.append(h('button', { class: 'k-row', onclick: () => openProfile(id) }, U.avatar(id, 44),
        h('div', { class: 'k-mid' }, h('div', { class: 'k-name' }, S.people[id].name, h('span', { class: 'k-chtag' }, '频道')), h('div', { class: 'k-st' }, S.people[id].status || '')))));
      list.append(h('div', { class: 'k-find' }, '用 ID 或电话号码查找好友', h('br'), '（这是别人的手机，就先不加好友了）'));
      return [h('header', { class: 'k-head' }, homeBack(), h('h1', null, '查找')), searchStrip('ID / 电话号码'), list];
    }

    /* ----- 个人资料 ----- */
    function openProfile(id) {
      U.sound.tap();
      const p = id === 'me' ? S.me : S.people[id];
      const sheet = h('div', { class: 'page k-profile sheet-in' },
        h('div', { class: 'kp-bg', style: (A.profileBg && A.profileBg[id]) ? `background-image:url("${A.profileBg[id]}")` : '' }),
        h('div', { class: 'kp-top' }, h('button', { 'aria-label': '关闭', onclick: () => closeSheet() }, h('span', { html: `<svg viewBox="0 0 24 24">${I.close}</svg>` })), h('span')),
        h('div', { class: 'kp-main' }, U.avatar(id, 96), h('div', { class: 'kp-name' }, p.name), h('div', { class: 'kp-status' }, p.status || '')),
        id === 'me' ? null : h('div', { class: 'kp-actions' },
          h('button', { onclick: () => { closeSheet(true); const r = rooms.find((x) => x.with === id); if (r) openRoom(r.id); } }, h('span', { html: `<svg viewBox="0 0 24 24">${I.bubble}</svg>` }), '聊天'),
          p.channel ? null : h('button', { disabled: !interaction.hasContact(id), onclick: () => startCall(id,'voice') }, h('span', { html: `<svg viewBox="0 0 24 24">${I.call}</svg>` }), '语音通话'),
          p.channel ? null : h('button', { disabled: !interaction.hasContact(id), onclick: () => startCall(id,'video') }, h('span', { html: `<svg viewBox="0 0 24 24">${I.video}</svg>` }), '视频通话')));
      win.append(sheet);
      ctx.setTone('light');
      function closeSheet(instant) {
        ctx.setTone('dark');
        if (instant) { sheet.remove(); return; }
        sheet.classList.remove('sheet-in'); sheet.classList.add('sheet-out');
        setTimeout(() => sheet.remove(), 280);
      }
    }

    /* ----- 聊天室 ----- */
    function openRoom(id, instant, options = {}) {
      const room = roomById(id);
      if (!room) return;
      if (room.id === S.group?.roomId) window.Feedback?.inviteOnce();
      if (!instant) U.sound.tap();
      const firstUnread = room.msgs.find(isUnread);
      const page = h('div', { class: 'page k-room' + (instant ? '' : ' push-in'), 'data-room': id });
      const others = () => totalUnread() - unreadCount(room);
      const backCount = h('span', null, others() ? `聊天 (${others()})` : '聊天');
      const head = h('header', { class: 'kr-head' },
        h('button', { class: 'kr-back', 'aria-label': '返回', onclick: () => pop() }, h('span', { html: `<svg viewBox="0 0 24 24">${I.back}</svg>` }), backCount),
        h('div', { class: 'kr-title' }, roomTitle(room), room.members ? h('em', null, room.members.length + 1) : null),
        h('div', { class: 'kr-icons' }, ...(room.with && interaction.hasContact(room.with) ? [
          h('button', {type:'button','aria-label':`给${U.personName(room.with)}打语音电话`,onclick:()=>startCall(room.with,'voice')}, h('span',{html:`<svg viewBox="0 0 24 24">${I.call}</svg>`})),
          h('button', {type:'button','aria-label':`给${U.personName(room.with)}打视频电话`,onclick:()=>startCall(room.with,'video')}, h('span',{html:`<svg viewBox="0 0 24 24">${I.video}</svg>`}))
        ] : [h('span', { html: `<svg viewBox="0 0 24 24">${I.search}</svg>` }), h('span', { html: `<svg viewBox="0 0 24 24">${I.menu}</svg>` })])));
      const msgs = h('div', { class: 'kr-msgs' });
      renderMsgs(msgs, room, firstUnread && firstUnread.id);
      const field = h('input', { class: 'kri-text', type: 'text', enterkeyhint: 'send', autocomplete: 'off', maxlength:'500', 'aria-label': '输入消息' });
      const sendBtn = h('button', { class: 'kri-send', type: 'button', 'aria-label': '发送', html: '<svg viewBox="0 0 24 24"><path d="M12 19V6M6.5 11.5L12 6l5.5 5.5"/></svg>' });
      // 发送键一直显示：没打字时是灰的，打了字变黄；手机键盘上的“发送”也能发
      const syncBtn = () => { sendBtn.classList.toggle('empty', field.value.trim().length === 0); };
      const feedbackBar = !room.channel && window.Feedback?.mountBar();
      if (feedbackBar) cleanups.push(() => feedbackBar.destroy());
      const send = () => {
        const text = field.value.trim(); if (!text) return;
        field.value = ''; syncBtn();
        setTimeout(() => { if (room.with === 'mom') momAfterDebut(); jumpHint(); }, 0);
        window.Feedback?.stage(room.id,text,feedbackBar?.take() === true);
        appendInteractive(room.id,'me',text);
        if(room.with && interaction.hasContact(room.with)) {
          queueReaderInput(room.id,room.with,text);
        } else if(room.members && S.group && room.id===S.group.roomId) queueGroupInput(room.id,text);
        else window.Feedback?.flush(room.id,roomTitle(room),[]);
      };
      field.addEventListener('input', syncBtn);
      field.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); send(); } });
      sendBtn.addEventListener('click', send);
      sendBtn.addEventListener('pointerdown',e=>e.preventDefault());
      // “+”面板：语音通话、视频通话、转账、礼物（只对能互动的私聊开放）
      const canCall = !!(room.with && interaction.hasContact(room.with));
      const canPay = !!(room.with && interaction.isMember(room.with));
      const panel = h('div', { class: 'kr-panel', hidden: true });
      const plus = h('button', { class: 'kri-plus', type: 'button', 'aria-label': '更多功能', 'aria-expanded': 'false', html: `<svg viewBox="0 0 24 24">${I.plus}</svg>` });
      const setPanel = (open) => {
        panel.hidden = !open; plus.classList.toggle('on', open); plus.setAttribute('aria-expanded', String(open));
        if (open) { field.blur(); requestAnimationFrame(() => { msgs.scrollTop = msgs.scrollHeight; }); }
      };
      const item = (icon, label, color, fn) => h('button', { class: 'krp-item', type: 'button', onclick: () => { U.sound.tap(); setPanel(false); fn(); } },
        h('span', { class: 'krp-ico', style: `--c:${color}`, html: `<svg viewBox="0 0 24 24">${I[icon]}</svg>` }), h('span', { class: 'krp-l' }, label));
      if (canCall) panel.append(item('call', '语音通话', '#4fb04a', () => startCall(room.with, 'voice')), item('video', '视频通话', '#3d8fd9', () => startCall(room.with, 'video')));
      if (canPay) panel.append(item('won', '转账', '#e4a11b', () => openTransfer(room)), item('gift', '礼物', '#e35d7d', () => openGift(room)));
      if (room.members && S.group && room.id === S.group.roomId) panel.append(item('at', '@成员', '#6a7fa6', () => openMention(room, field, syncBtn)));
      plus.addEventListener('click', () => { if (!panel.childElementCount) { plus.classList.remove('nudge'); void plus.offsetWidth; plus.classList.add('nudge'); return; } U.sound.tap(); setPanel(panel.hidden); });
      field.addEventListener('focus', () => setPanel(false));
      const input = h('div', { class: 'kr-input' },
        plus,
        h('div', { class: 'kri-field' }, field),
        sendBtn);
      syncBtn();
      if (room.channel) { input.style.display = 'none'; panel.remove(); }
      page.append(head, msgs);
      if (feedbackBar) page.append(feedbackBar.el);
      page.append(input, panel);
      const under = stack[stack.length - 1];
      win.append(page);
      if (!instant) { under.el.classList.add('under'); }
      else under.el.style.visibility = 'hidden';
      stack.push({ el: page, room, tone: 'dark' });
      const opened=U.store.get('openedRooms',{}), forced=U.store.get('jumpLatestRooms',{});
      const latest=!!(opened[id] || forced[id] || options.latest);
      U.store.set('openedRooms',{...opened,[id]:true});
      if(forced[id]){delete forced[id];U.store.set('jumpLatestRooms',forced);}
      requestAnimationFrame(() => { msgs.scrollTop = latest ? msgs.scrollHeight : 0; });
      setTimeout(() => { markRead(room); }, instant ? 0 : 400);
      const off = onChange(() => { backCount.textContent = others() ? `聊天 (${others()})` : '聊天'; });
      page._off = off;
      edgeSwipe(page);
    }

    function pop() {
      if (stack.length < 2) return;
      U.sound.tap();
      const top = stack.pop(), under = stack[stack.length - 1];
      top.el._off && top.el._off();
      top.el.classList.remove('push-in'); top.el.classList.add('push-out');
      under.el.style.visibility = '';
      under.el.classList.remove('under'); under.el.classList.add('under-back');
      setTimeout(() => { top.el.remove(); under.el.classList.remove('under-back'); }, 320);
      if (stack.length === 1) renderRoot();
    }

    function edgeSwipe(page) {
      let sx = null, dx = 0;
      page.addEventListener('pointerdown', (e) => {
        const r = page.getBoundingClientRect();
        if (e.target.closest('button, input, a, .kr-panel')) return; // 左边的“+”等按钮照常可点
        if (e.clientX - r.left < 24) { sx = e.clientX; dx = 0; page.setPointerCapture(e.pointerId); }
      });
      page.addEventListener('pointermove', (e) => {
        if (sx == null) return;
        dx = Math.max(0, e.clientX - sx) / (window.__scale || 1);
        page.style.transform = `translateX(${dx}px)`;
      });
      const end = () => {
        if (sx == null) return;
        sx = null;
        page.style.transition = 'transform .25s';
        if (dx > 110) { page.style.transform = ''; page.style.transition = ''; pop(); }
        else { page.style.transform = ''; setTimeout(() => (page.style.transition = ''), 260); }
      };
      page.addEventListener('pointerup', end); page.addEventListener('pointercancel', end);
    }

    /* ----- 实时消息 ----- */
    function maybeLive() {
      const g = roomById(S.liveRoomId);
      if (!g || liveDone() >= g.live.length || liveScheduled) return;
      liveScheduled = true;
      const step = () => {
        const i = liveDone();
        if (i >= g.live.length) return;
        // 实时消息用“现在”的时间
        const nowKey = `${U.pad(S.now.m)}-${U.pad(S.now.d)} ${U.pad(S.now.hh)}:${U.pad(S.now.mm)}`;
        const m = { ...toMsg(g.id, [nowKey, ...g.live[i].slice(1)], i, 'live'), unread: true };
        U.store.set('liveTimes', [...U.store.get('liveTimes', []).slice(0, i), nowKey]);
        g.msgs.push(m);
        U.store.set('liveDone', i + 1);
        if (current && current.isVisible()) current.deliver(m);
        else {
          emit();
          U.banner({ appId: 'chat', title: roomTitle(g), text: `${U.personName(m.from)}：${preview(m)}`, onOpen: () => window.Phone.openApp('chat', { room: m.roomId }) });
        }
        if (i + 1 < g.live.length) setTimeout(step, 1600);
      };
      setTimeout(step, 2600);
    }
    function deliver(m) {
      const top = stack[stack.length - 1];
      const room = roomById(m.roomId);
      if (top.room && top.room.id === m.roomId && ctx.isVisible()) {
        const box = top.el.querySelector('.kr-msgs');
        const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
        renderMsgs(box, room, null, m.id);
        if (nearBottom || m.interactive) requestAnimationFrame(()=>box.scrollTo({ top:box.scrollHeight,behavior:'smooth' }));
        readIds.add(m.id); U.store.set('readIds', [...readIds]);
        if(m.from!=='me')U.sound.msg();
        emit();
        return;
      }
      emit();
      if (stack.length === 1 && tab === 'chats' && ctx.isVisible()) {
        renderRoot();
        const row = root.querySelector(`[data-room="${m.roomId}"]`);
        row && row.classList.add('flash');
        if(m.from!=='me')U.sound.msg();
        return;
      }
      if(m.from==='me')return;
      U.banner({ appId: 'chat', title: room.members ? roomTitle(room) : U.personName(m.from), text: (room.members ? U.personName(m.from) + '：' : '') + preview(m), onOpen: () => window.Phone.openApp('chat', { room: m.roomId }) });
    }

    function refreshRoom(roomId) {
      const top = stack[stack.length - 1];
      if (!top.room || top.room.id !== roomId) return;
      const box = top.el.querySelector('.kr-msgs');
      const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
      renderMsgs(box, top.room);
      if (nearBottom) box.scrollTop = box.scrollHeight;
    }

    /* ----- 群聊里 @ 某人 ----- */
    function openMention(room, field, sync) {
      const { sheet, close } = sheetShell('@ 谁');
      sheet.append(h('div', { class: 'ks-body' }, h('div', { class: 'kg-list' }, room.members.filter((id) => SHORT[id]).map((id) =>
        h('button', { class: 'kg-row', type: 'button', onclick: () => { U.sound.tap(); close(); field.value = `@${SHORT[id]} ` + field.value.replace(/^@\S+\s*/, ''); sync(); field.focus(); } },
          U.avatar(id, 40), h('span', { class: 'kg-main' }, h('b', null, U.personName(id)), h('small', null, '@' + SHORT[id])))))));
    }

    /* ----- 转账（虚拟） ----- */
    function sheetShell(title, onCancel) {
      const sheet = h('div', { class: 'page k-sheet sheet-in', role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
      const close = () => { sheet.classList.remove('sheet-in'); sheet.classList.add('sheet-out'); setTimeout(() => sheet.remove(), 280); onCancel && onCancel(); };
      sheet.append(h('header', { class: 'ks-nav' }, h('button', { class: 'ks-cancel', type: 'button', onclick: close }, '取消'), h('div', { class: 'ks-title' }, title), h('span', { class: 'ks-gap' })));
      win.append(sheet);
      return { sheet, close };
    }
    function openTransfer(room) {
      const to = room.with, { sheet, close } = sheetShell('转账');
      let amount = 0;
      const shown = h('div', { class: 'kt-amount' }, won(0));
      const custom = h('input', { class: 'kt-input', type: 'text', inputmode: 'numeric', placeholder: '输入金额', maxlength: '7', 'aria-label': '转账金额' });
      const note = h('input', { class: 'kt-note', type: 'text', maxlength: '20', placeholder: '留言（选填）', 'aria-label': '转账留言' });
      const go = h('button', { class: 'kt-go', type: 'button', disabled: true }, '转账');
      const paint = () => { shown.textContent = won(amount); go.disabled = amount <= 0; custom.value = amount ? String(amount) : ''; };
      custom.addEventListener('input', () => { amount = Math.min(1000000, Number(custom.value.replace(/\D/g, '')) || 0); shown.textContent = won(amount); go.disabled = amount <= 0; });
      [custom, note].forEach((el) => el.addEventListener('keydown', (e) => e.stopPropagation()));
      const chip = (n, label) => h('button', { class: 'kt-chip', type: 'button', onclick: () => { U.sound.tap(); amount = Math.min(1000000, amount + n); paint(); } }, label);
      go.addEventListener('click', () => {
        if (amount <= 0) return;
        U.sound.tap(); close();
        sendPay(room.id, to, { pay: 'transfer', amount, note: note.value.trim() });
      });
      sheet.append(h('div', { class: 'ks-body' },
        h('div', { class: 'kt-to' }, U.avatar(to, 54), h('div', null, h('small', null, '转账给'), h('b', null, U.personName(to)))),
        shown,
        h('div', { class: 'kt-chips' }, chip(1000, '+1千'), chip(5000, '+5千'), chip(10000, '+1万'), chip(50000, '+5万'), h('button', { class: 'kt-chip clear', type: 'button', onclick: () => { amount = 0; paint(); } }, '清空')),
        custom, note,
        h('p', { class: 'kt-tip' }, '虚拟转账，只在这部手机里发生，不涉及真实金额。'),
        go));
    }

    /* ----- 礼物券 ----- */
    const GIFT_ICON = {
      milk: '<path d="M8 3h8v3l2 3v12H6V9l2-3z"/><path d="M6 12h12"/>',
      cup: '<path d="M6 8h12l-1.5 12h-9z"/><path d="M5 5h14v3H5zM12 2v3"/>',
      ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M9 7v10" stroke-dasharray="2 2"/>',
      chicken: '<path d="M14 4a5 5 0 0 1 4 8l-6 6-2-2-3 3-2-2 3-3-2-2 6-6a5 5 0 0 1 2-2z"/>',
      cake: '<path d="M4 20h16v-8H4zM4 15c2 1.5 4 1.5 5.3 0s4-1.5 5.4 0 4 1.5 5.3 0M12 12V8M12 5.5v.5"/>',
      can: '<path d="M8 4h8v16H8z"/><path d="M8 7h8M13 9l-2.5 4h3L11 17"/>',
      bowl: '<path d="M3 11h18a9 7 0 0 1-18 0z"/><path d="M8 8l3-5M13 8l4-4"/>',
      sock: '<path d="M8 3h7v9l3.5 3.5a2.5 2.5 0 0 1-3.5 3.5L8 12z"/><path d="M8 6h7"/>',
      ice: '<path d="M5 12h14l-2 8H7z"/><path d="M6 12a6 6 0 0 1 12 0"/><path d="M10 9h.01M14 9.5h.01"/>',
      book: '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/>',
      pizza: '<path d="M12 21L3.5 6a14 14 0 0 1 17 0z"/><path d="M5.5 9.5a11 11 0 0 1 13 0"/><path d="M10 12h.01M13.5 15h.01"/>',
      meat: '<path d="M5 9c2-5 12-6 14 0 1.5 5-4 10-9 9-4-1-6.5-4.5-5-9z"/><path d="M8 11c3 1 6 1 9-1M9 15c2 .8 4 .6 6-.5"/>',
    };
    const giftIcon = (it, size) => h('span', { class: 'kg-ico', style: `--c:${it.color};width:${size}px;height:${size}px`, html: `<svg viewBox="0 0 24 24">${GIFT_ICON[it.icon] || I.gift}</svg>` });
    function openGift(room) {
      const to = room.with, { sheet, close } = sheetShell('送礼物');
      let pick = null;
      const go = h('button', { class: 'kt-go', type: 'button', disabled: true }, '送出礼物');
      const list = h('div', { class: 'kg-list' }, (RX().giftItems || []).map((it) => {
        const row = h('button', { class: 'kg-row', type: 'button', onclick: () => { U.sound.tap(); pick = it; list.querySelectorAll('.kg-row').forEach((r) => r.classList.toggle('on', r === row)); go.disabled = false; go.textContent = `送出 ${it.name}`; } },
          giftIcon(it, 40), h('span', { class: 'kg-main' }, h('b', null, it.name), h('small', null, it.shop + ' · 礼物券')), h('span', { class: 'kg-price' }, won(it.price)));
        return row;
      }));
      go.addEventListener('click', () => { if (!pick) return; U.sound.tap(); close(); sendPay(room.id, to, { pay: 'gift', item: pick.id }); });
      sheet.append(h('div', { class: 'ks-body' },
        h('div', { class: 'kt-to' }, U.avatar(to, 54), h('div', null, h('small', null, '送给'), h('b', null, U.personName(to)))),
        list, h('p', { class: 'kt-tip' }, '虚拟礼物券，只在这部手机里发生。')),
        h('div', { class: 'kg-foot' }, go));
    }

    current = { deliver, isVisible: ctx.isVisible, refreshRoom };
    renderRoot();
    if (ctx.args && ctx.args.room) openRoom(ctx.args.room, true, ctx.args);
    else maybeLive();

    // 外部回调
    const off = onChange(() => { if (stack.length === 1) renderRoot(); });
    cleanups.push(off);
    return {
      back: () => { const sh = win.querySelector('.k-sheet, .k-profile'); if (sh) { sh.remove(); return true; } if (stack.length > 1) { pop(); return true; } return false; },
      openRoom: (id, options) => { while (stack.length > 1) { const t = stack.pop(); t.el._off && t.el._off(); t.el.remove(); } stack[0].el.style.visibility = ''; stack[0].el.classList.remove('under'); renderRoot(); openRoom(id, true, options); },
      destroy: () => { if(playing){playing.a.pause();playing.el.classList.remove('on');playing=null;} cleanups.forEach((f) => f()); stack.forEach((s) => s.el._off && s.el._off()); current = null; },
    };
  }

  function cmpP(a, b) { return a.t - b.t; }

  /* ---------- 消息渲染 ---------- */
  function renderMsgs(box, room, unreadFromId, arrivingId) {
    box.innerHTML = '';
    let lastDay = null;
    const ms = room.msgs;
    // 已读的“1”：读者发出的消息，对方回复之前一直挂着；群聊里显示还有几个人没读
    const readU = new Map();
    { const seen = new Set();
      for (let i = ms.length - 1; i >= 0; i--) {
        const x = ms[i];
        if (x.from !== 'me') { seen.add(x.from); continue; }
        if (!x.interactive) continue;
        const left = room.members ? room.members.filter((id) => !seen.has(id)).length : (seen.size ? 0 : 1);
        if (left) readU.set(x.id, left);
      } }
    ms.forEach((m, i) => {
      const day = `${m.p.y}-${m.p.m}-${m.p.d}`;
      if (day !== lastDay) {
        box.append(h('div', { class: 'kd-date' }, h('span', null, h('span', { html: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" stroke-width="1.8">${I.cal}</svg>` }), U.fullDate(m.p))));
        lastDay = day;
      }
      if (m.id === unreadFromId) box.append(h('div', { class: 'kd-newline' }, '以下为新消息'));
      const c = m.content;
      if (c && c.sys) { box.append(h('div', { class: 'kd-sys' }, h('span', null, c.sys))); return; }

      const prev = ms[i - 1], next = ms[i + 1];
      const sameRun = (a, b) => a && b && a.from === b.from && a.p.key === b.p.key && !(a.content && a.content.sys) && !(b.content && b.content.sys) && b.id !== unreadFromId;
      const first = !sameRun(prev, m);
      const last = !sameRun(m, next);
      const mine = m.from === 'me';

      let bubble;
      if (typeof c === 'string') {
        const at = c.match(/^@(\S+)\s?([\s\S]*)$/);
        bubble = at ? h('div', { class: 'bub' }, h('span', { class: 'k-at' }, '@' + at[1]), ' ' + at[2])
                    : h('div', { class: 'bub' + (room.channel ? ' channel' : '') }, c);
      }
      else if (c.fail) bubble = h('div', { class: 'bub' }, c.text);
      else if (c.deleted) bubble = h('div', { class: 'bub deleted' }, h('span', { html: `<svg viewBox="0 0 24 24">${I.info}</svg>` }), '已删除的消息。');
      else if (c.photo) bubble = photoEl(c.photo, m, room);
      else if (c.file) bubble = fileEl(c.file);
      else if (c.sticker) bubble = stickerEl(c.sticker);
      else if (c.voice) bubble = voiceEl(c);
      else if (c.call) bubble = h('div', { class: 'bub kcall' }, h('span', { html: `<svg viewBox="0 0 24 24">${c.kind==='video'?I.video:I.call}</svg>` }), c.outgoing ? `${c.kind==='video'?'视频':'语音'}通话 · ${c.outcome==='cancelled'?'已取消':'对方未接听'}` : c.call === 'missed' ? '未接语音通话' : `语音通话 ${c.dur}`);
      else if (c.link) bubble = h(c.link.url ? 'button' : 'div', {
        class: 'klink', type: c.link.url ? 'button' : null,
        onclick: c.link.url ? () => window.Phone.viewPost(c.link) : null,
        'aria-label': c.link.title + (c.link.url ? ' · 查看原帖' : '')
      }, h('div', { class: 'kl-thumb' }, c.link.image
        ? h('img', { src: c.link.image, alt: '', loading: 'lazy' })
        : h('span', { html: `<svg viewBox="0 0 24 24">${I.img}</svg>` })),
      h('div', { class: 'kl-body' }, h('div', { class: 'kl-title' }, c.link.title), h('div', { class: 'kl-site' }, c.link.site)));

      else if (c.pay) bubble = payEl(c, m, room);
      else if (c.card) bubble = cardEl(c.card);

      const meta = c && c.fail ? failMark(m, room, box)
        : h('div', { class: 'km-meta' }, (m.u || readU.get(m.id)) ? h('span', { class: 'km-u' }, m.u || readU.get(m.id)) : null, last ? h('span', null, U.ampm(m.p)) : null);
      const line = h('div', { class: 'km-line' }, bubble, meta);
      const row = h('div', { class: 'km' + (mine ? ' me' : '') + (first ? ' first tail' : '') + (m.id === arrivingId ? ' arrive' : '') });
      if (mine) row.append(h('div', { class: 'km-col' }, line));
      else {
        row.append(h('div', { class: 'km-av' }, first ? U.avatar(m.from, 40) : null));
        row.append(h('div', { class: 'km-col' }, first ? h('div', { class: 'km-name' }, U.personName(m.from)) : null, line));
      }
      box.append(row);
    });
  }

  // 发送失败：红色感叹号，点开可以重发（还是失败）或删除
  function failMark(m, room, box) {
    const btn = h('button', { class: 'km-fail', type: 'button', 'aria-label': '发送失败', html: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5h.01"/></svg>' });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const old = document.querySelector('.kf-menu'); if (old) old.remove();
      const close = () => menu.remove();
      const menu = h('div', { class: 'kf-menu' },
        h('div', { class: 'kf-box' },
          h('div', { class: 'kf-t' }, '消息发送失败'),
          h('button', { onclick: () => { close(); U.sound.tap(); btn.classList.add('kf-spin'); setTimeout(() => { btn.classList.remove('kf-spin'); U.sound.wrong && U.sound.wrong(); }, 1200); } }, '重新发送'),
          h('button', { onclick: () => { close(); const i = room.msgs.indexOf(m); if (i >= 0) room.msgs.splice(i, 1); renderMsgs(box, room); emit(); } }, '删除'),
          h('button', { class: 'kf-cancel', onclick: close }, '取消')));
      menu.addEventListener('click', (ev) => { if (ev.target === menu) close(); });
      window.Phone.screen.append(menu);
    });
    return h('div', { class: 'km-meta' }, btn);
  }

  function photoEl(slot, m, room) {
    const src = A.chatPhotos && A.chatPhotos[slot];
    if (!src) {
      return h('div', { class: 'kphoto-exp' }, h('span', { html: `<svg viewBox="0 0 24 24">${I.img}</svg>` }), '照片已过保存期限');
    }
    const source = A.photoSources && A.photoSources[slot];
    const scale = source && source.width && source.height ? Math.min(210 / source.width, 280 / source.height, 1) : null;
    const size = scale ? `width:${Math.round(source.width * scale)}px;height:${Math.round(source.height * scale)}px` : null;
    return h('div', { class: 'kphoto', onclick: () => { U.store.set('viewedPhotos',{...U.store.get('viewedPhotos',{}),[room.id]:{slot,title:source?.title||''}}); window.Phone.viewImage(src, U.personName(m.from), `${m.p.y}年${m.p.m}月${m.p.d}日 ${U.ampm(m.p)}`, source, { ending: slot === 'debutGroup' }); } }, h('img', { src, alt: (source && source.title) || '聊天照片', loading: 'lazy', style: size }));
  }

  function fileEl(slot) {
    const f = (A.files && A.files[slot]) || { name: slot, size: '' };
    const el = h('button', { class: 'bub kfile', type: 'button' },
      h('span', { class: 'kf-ico', html: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>' }),
      h('span', { class: 'kf-body' }, h('span', { class: 'kf-name' }, f.name), h('span', { class: 'kf-size' }, f.size || '文件')));
    el.addEventListener('click', () => {
      if (!f.src) { el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge'); return; }
      if (/\.(png|jpe?g|gif|webp)$/i.test(f.src)) window.Phone.viewImage(f.src, f.name, f.size || '');
      else window.Phone.viewFile ? window.Phone.viewFile(f) : window.open(f.src, '_blank');
    });
    return el;
  }

  function payEl(c, m, room) {
    const to = room.with ? U.personName(room.with) : '';
    if (c.pay === 'gift') {
      const it = giftItem(c.item) || { name: '礼物券', shop: '', color: '#e35d7d', icon: '' };
      const mine = m.from === 'me';
      const claimable = !mine && c.status !== 'received';
      const claim = () => { // 成员回送的礼物：点卡片领取，状态会保存
        if (!claimable) return;
        U.sound.tap(); c.status = 'received';
        const item = U.store.get('interactiveLog', []);
        const hit = item.find((x) => x.id === m.id); if (hit) { hit.content.status = 'received'; U.store.set('interactiveLog', item); }
        const log = interactiveLog.find((x) => x.id === m.id); if (log) log.content.status = 'received';
        el.classList.add('done'); el.querySelector('.kp-foot').textContent = '我已领取';
      };
      const el = h('div', { class: 'kpay gift' + (c.status === 'received' ? ' done' : '') + (claimable ? ' claim' : ''), role: claimable ? 'button' : null, onclick: claim },
        h('div', { class: 'kp-gift', style: `--c:${it.color};--ink:${it.ink || '#fff'}` }, h('span', { class: 'kp-gift-ico', html: `<svg viewBox="0 0 24 24">${I.gift}</svg>` }), h('b', null, it.name), h('small', null, it.shop + ' 礼物券')),
        h('div', { class: 'kp-foot' }, c.status === 'received' ? `${mine ? to : '我'}已领取` : mine ? `等待${to}领取` : '点击领取'));
      return el;
    }
    if (c.pay === 'refund') {
      return h('div', { class: 'kpay transfer refund' },
        h('div', { class: 'kp-top' }, h('span', { class: 'kp-ico', html: `<svg viewBox="0 0 24 24">${I.won}</svg>` }), h('div', null, h('b', null, won(c.amount)), h('small', null, '已退还'))),
        h('div', { class: 'kp-foot' }, '转账已退回'));
    }
    const label = { pending: '等待对方确认', accepted: '对方已收款', returned: '已退还' }[c.status || 'pending'];
    return h('div', { class: 'kpay transfer ' + (c.status || 'pending') },
      h('div', { class: 'kp-top' }, h('span', { class: 'kp-ico', html: `<svg viewBox="0 0 24 24">${I.won}</svg>` }),
        h('div', null, h('b', null, won(c.amount)), h('small', null, c.note || `转账给${to}`))),
      h('div', { class: 'kp-foot' }, label));
  }
  // 频道广告卡片
  function cardEl(card) {
    return h('div', { class: 'kcard' },
      card.badge ? h('div', { class: 'kc-badge', style: card.color ? `background:${card.color}` : '' }, card.badge) : null,
      h('div', { class: 'kc-title' }, card.title),
      card.body ? h('div', { class: 'kc-body' }, card.body) : null,
      card.coupon ? h('div', { class: 'kc-coupon' }, h('b', null, card.coupon), h('small', null, card.expire || '')) : null,
      card.button ? h('button', { class: 'kc-btn', type: 'button', onclick: (e) => { const b = e.currentTarget; b.textContent = card.done || '已领取'; b.disabled = true; } }, card.button) : null);
  }

  function stickerEl(slot) {
    const src = A.stickers && A.stickers[slot];
    if (src) return h('img', { class: 'ksticker', src, alt: '表情' });
    return h('div', { class: 'ksticker-empty', html: `<svg viewBox="0 0 24 24">${I.smile}</svg>` });
  }
  let playing = null;
  function voiceEl(c) {
    const src = A.voices && A.voices[c.voice];
    const icon = h('span', { class: 'kv-play', html: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>' });
    const bars = h('span', { class: 'kv-bars' }, ...Array.from({ length: 14 }, (_, i) => h('i', { style: `height:${[5,9,13,8,15,11,6,12,16,9,7,13,8,5][i]}px` })));
    const el = h('button', { class: 'bub kvoice' + (src ? '' : ' empty'), type: 'button' }, icon, bars, h('span', { class: 'kv-dur' }, c.dur));
    el.addEventListener('click', () => {
      if (!src) { el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge'); return; }
      if (playing) { playing.a.pause(); playing.el.classList.remove('on'); if (playing.el === el) { playing = null; return; } }
      const a = new Audio(src); a.play().catch(() => {});
      el.classList.add('on'); playing = { a, el };
      a.onended = () => { el.classList.remove('on'); playing = null; };
    });
    return el;
  }

  /* ---------- 对外：锁屏通知、角标 ---------- */
  function notifications() {
    const out = [];
    rooms.forEach((r) => {
      if (r.channel) return; // 频道已静音
      r.msgs.filter(isUnread).forEach((m) => out.push({
        id: m.id, app: 'chat', target: { room: r.id, latest:!!m.interactive }, p: m.p,
        title: r.members ? roomTitle(r) : U.personName(m.from),
        text: (r.members ? U.personName(m.from) + '：' : '') + preview(m),
      }));
    });
    return out;
  }

  /* 剧情事件推送的新消息 */
  let evSeq = 0;
  /* 跳到 6 月 13 日以后：给妈妈发过文字的，妈妈回一次（只回这一次，之后照旧不回） */
  function momAfterDebut() {
    if (!U.store.get('jumped', false) || U.store.get('momReplied', false) || !S.momDebut) return;
    const room = rooms.find((r) => r.with === 'mom' && !r.members); if (!room) return;
    const sent = interactiveLog.filter((x) => x.roomId === room.id && x.from === 'me' && typeof x.content === 'string').map((x) => String(x.content));
    if (!sent.length) return;
    U.store.set('momReplied', true);
    const M = S.momDebut, all = window.ZH ? window.ZH.toSimp(sent.join(' ')) : sent.join(' ');
    let lines = [...M.base];
    if (/想你|想妈|想家|想您/.test(all)) lines.splice(M.missAt, 0, ...M.miss);
    if (/睡不着|紧张|睡不著/.test(all)) lines = [...lines.slice(0, -1), ...M.sleep];
    enqueueReply(room.id, 'mom', lines, undefined, 5000);
  }
  /* 聊了不少还没跳转：设置推一条提示（只推一次） */
  function jumpHint() {
    if (U.store.get('jumped', false) || U.store.get('jumpHinted', false)) return;
    const n = interactiveLog.filter((x) => x.from === 'me').length;
    if (n < 25) return;
    U.store.set('jumpHinted', true);
    setTimeout(() => U.banner({ appId: 'settings', title: '设置', text: '跳转时间：想看看 6 月 13 日出道那晚吗？', onOpen: () => window.Phone.openApp('settings') }), 6000);
  }
  setTimeout(momAfterDebut, 1500);
  function pushMessage(roomId, raw, silent) {
    const room = roomById(roomId); if (!room) return;
    const m = { ...toMsg(roomId, raw, evSeq++, 'ev'), unread: true };
    room.msgs.push(m);
    if (silent) { emit(); return; }
    if (current && current.isVisible()) current.deliver(m);
    else {
      emit();
      U.banner({ appId: 'chat', title: room.members ? roomTitle(room) : U.personName(m.from), text: (room.members ? U.personName(m.from) + '：' : '') + preview(m), onOpen: () => window.Phone.openApp('chat', { room: roomId }) });
    }
  }
  // 跳转时间后补进来的消息按时间排好（同一时间保持原顺序）
  function resort() { rooms.forEach((r) => r.msgs.sort((a, b) => a.p.t - b.p.t)); emit(); }
  window.Chat = { mount, totalUnread, notifications, onChange, pushMessage, resort, momAfterDebut };
})();
