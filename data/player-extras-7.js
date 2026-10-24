/* 根据玩家分享的聊天补的语库（第七批，截至 2026-10-24 16:2x UTC，按“没接住的话”筛过）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };
  add('money', '借我钱|借钱|^钱$|给我钱|^借我$|借我点|没钱了', {
    yq: same([['……我也没钱'], ['……要多少']]), sx: same([['哥也穷ㅋㅋ'], ['……要多少 说吧']]), hx: same([['我只有五千ㅋㅋ'], ['要多少！！']]),
    jw: same([['我也没多少…ㅋㅋ']]), ty: same([['我比你还穷ㅋㅋ']]), jy: same([['……我只有零花钱']])
  });
  add('wantToTalk', '只想跟你说说话|想跟你聊天|就是想聊天|有点想聊天|突然想看看你|好久没有见到你|好久没见|陪我聊', {
    yq: same([['……嗯 说吧']]), sx: same([['好啊ㅋㅋ', '哥陪你聊']]), hx: same([['好！！', '我也想跟你聊']]),
    jw: same([['嗯 我在', '聊吧ㅋㅋ']]), ty: same([['好！', '聊什么']]), jy: same([['……嗯', '聊吧']])
  });
  add('whereQ', '哥在哪|在外面吗|回家了吗|回宿舍了吗|在宿舍了吗|不在宿舍|在房间里吗|你在客厅|房间里吗|你在哪儿', {
    yq: same([['……工作室'], ['宿舍']]), sx: same([['在宿舍呢', '客厅']]), hx: same([['在练习室！！', '马上回']]),
    jw: same([['在宿舍呀']]), ty: same([['在房间ㅋㅋ']]), jy: same([['……在宿舍']])
  });
  add('tellWhenDone', '录完了告诉我|录音完|好了跟我说|好了告诉我|弄完告诉我|弄完跟我说|录完告诉', {
    yq: same([['……嗯']]), sx: same([['好 弄完跟你说']]), hx: same([['好！！']]), jw: same([['好 我弄完告诉你']]), ty: same([['好ㅋㅋ']]), jy: same([['……好']])
  });
  add('aboutNamjoon', '对(?:金)?南俊有什么看法|南俊哥会说你|南俊(?:哥)?(?:怎么样|是什么样的人|人怎么样)', {
    yq: same([['……他挺好的', '别跟他说']]), sx: same([['南俊啊', '是个很靠谱的队长ㅋㅋ', '就是总弄坏东西']]),
    hx: same([['南俊最棒了！！', '我们的队长！！']]), jw: same([['南俊哥…', '是我很尊敬的人']]),
    ty: same([['南俊哥很聪明', '就是有点笨手笨脚ㅋㅋ']]), jy: same([['……南俊哥是最好的队长']])
  });
  add('cookReq', '水拌生鱼片|想吃哥做|你做的饭|做给我吃|明天早饭|早饭还想吃|鸡蛋', {
    yq: same([['……去找硕珍哥']]), sx: same([['好！！哥给你做', '明天早上起来就有'], ['想吃就说ㅋㅋ', '哥的手艺你放心']]),
    hx: same([['去找硕珍哥！！ㅋㅋ']]), jw: same([['硕珍哥做的最好吃ㅋㅋ']]), ty: same([['我也要吃！']]), jy: same([['……我也想吃']])
  });
  add('animal', '像羊|羊驼|小猪|是猪|你是猪|猪果|熊宝宝|外星人|像小狗|像兔子|像猫', {
    yq: same([['……']]), sx: same([['羊？？', '哥这么帅的羊ㅋㅋ']]), hx: same([['ㅋㅋㅋㅋ我是松鼠！！']]),
    jw: same([['ㅋㅋ我才不是']]), ty: same([['外星人！我喜欢ㅋㅋ']]), jy: same([['……我不是猪ㅋㅋ'], ['……兔子还行']])
  });
  add('expressLove', '坦率一点|多表露|表达爱|表达感情', {
    yq: same([['……我会试试']]), sx: same([['哥一直很坦率ㅋㅋ']]), hx: same([['我每天都在表达！！']]),
    jw: same([['嗯…我会的']]), ty: same([['我爱你们！', '这样吗ㅋㅋ']]), jy: same([['……难']])
  });
  add('noona', '欧尼|怒那|姐姐我', {
    yq: same([['……？']]), sx: same([['怒那？？ㅋㅋ']]), hx: same([['怒那！！ㅋㅋ']]),
    jw: same([['……怒那？ㅋㅋ']]), ty: same([['怒那！', '你好ㅋㅋ']]), jy: same([['……怒那？？']])
  });
  add('bday', '生日快乐|生快', {
    yq: same([['……我生日早过了']]), sx: same([['我生日是12月ㅋㅋ']]), hx: same([['我生日早过了！！ㅋㅋ']]),
    jw: same([['我生日是10月呀ㅋㅋ']]), ty: same([['我生日是12月！', '提前收下了ㅋㅋ']]), jy: same([['……我生日是9月ㅋㅋ']])
  });
  add('gameConsole', '游戏机', {
    yq: same([['……']]), sx: same([['游戏机？']]), hx: same([['什么游戏机！！']]), jw: same([['ㅋㅋ']]), ty: same([['我也要玩！']]), jy: same([['记得！！', '哥要买给我吗']])
  });
  add('stress', '压力|好多事|心情不太好|好想哭|想哭', {
    yq: same([['……怎么了', '说吧']]), sx: same([['哎哟 怎么了', '哥听着']]), hx: same([['怎么了！！', '我陪你']]),
    jw: same([['怎么了…', '我在听']]), ty: same([['怎么了', '我在']]), jy: same([['……怎么了', '我听着']])
  });
  // 放宽旧话题
  extend('didWell', '最努力|很努力|唱的很好|唱得很好|闪闪发光|表现很好|变得更好|rap唱|做的很棒|做得很棒|特别棒');
  extend('comfort', '多出来|一个都不能少|大树|一直都在|跟你一起解决|有什么困难|跟哥说|有什么事|别憋着|跟我说|认识你真好|会被很多人爱|很多人来爱你');
  extend('careBody', '别累坏|节食|要健康|健健康康|再坚持|好好睡');
  extend('maknae', '好好长|平安长大|成为的大人|小朋友|长成');
  extend('love', '最爱你|超级爱你|全世界最喜欢|撒浪嘿|사랑|爱防弹|爱大家|爱哥|不可以爱你');
  extend('give', '当作奖励|奖励|券|卷');
  extend('tellYou', '坦白|有件事|有急事|真心话');
  extend('whatDiff', '为什么觉得我不是|怎么不一样|哪有不一样|怎么一直怀疑|你才不是真的|为什么这么问');
  extend('iNervous', '有点儿紧张|能不能做好|真的能做到|会有意外|^紧张$|我们真的能');
  extend('callAsk', '能讲电话|讲电话吧|可以讲电话|能通话|^电话吗|快点接|让我给你打电话');
  extend('handover', '不用给手机|联络到南俊|联系到南俊|南俊说可以|手机主人');
  extend('fanFuture', '周边|花了.{0,4}万|世界天团|全球都认识|很多人喜欢你们|很爱防弹');
  extend('timeTravel', '十年后|rap monster|rapmonster');
  extend('busted', '被发现了|怎么猜到|答对了|答对啦');
  extend('frustrated', '句点我|不要问号|要说什么你才懂|看不懂我说');
  extend('insult', '是猪|你是猪');
  extend('didWell', '真的很棒|已经很好|足够优秀|很好了|别太逼自己');
  extend('iNervous', '状况会怎么样|会怎么样呢|接下来会怎么样');
  extend('comeHere', '我去找你|去你那边|我现在过去');
  extend('love', '想我吗');
  extend('whyHappy', '为什么😭|为什么哭');

  /* ---------- 宿舍群聊（第七批） ---------- */
  const G = window.STORY.group; if (!G) return;
  G.topics.unshift(
    { key: 'meta', re: '乱回|奇怪的回答|随便回|已读不回|不看别人说', prefer: ['sx', 'hx', 'jw'] },
    { key: 'bts', re: '防弹|nomoredream|no more dream|bts', prefer: ['hx', 'ty', 'sx'] },
    { key: 'quit', re: '离职|不干了|退团|不做了', prefer: ['hx', 'sx', 'jw'] },
    { key: 'goOut', re: '跟我去|一起下去|下去了|出门|看夜景|走走走|来来来|工作室', prefer: ['jy', 'ty', 'hx'] },
    { key: 'english', re: '英文|英语|四级', prefer: ['yq', 'jw', 'ty'] },
    { key: 'wow', re: '牛逼|不愧是|尖叫|我的妈呀|卧槽|太厉害', prefer: ['hx', 'ty', 'sx'] },
    { key: 'harshG', re: '废物|鸡歪|垃圾', prefer: ['sx', 'yq', 'jw'] },
    { key: 'tsundere', re: '傲娇|话好少|怎么不回我', prefer: ['yq', 'sx', 'ty'] },
    { key: 'familyG', re: '妈妈|爸妈|我妈|调试电视|守在电视', prefer: ['jw', 'jy', 'hx'] },
    { key: 'interview', re: '采访', prefer: ['yq', 'sx', 'hx'] },
    { key: 'whenBackG', re: '什么时候回来|几点回来|还不回来', prefer: ['sx', 'hx', 'jw'] },
    { key: 'fanG', re: '13年后|十三年后|粉丝|阿米', prefer: ['sx', 'hx', 'ty'] }
  );
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('foundPhone', '不是(?:金)?南俊|掉手机|手机主人');
  extendG('cry', 'ㅠ|ㅜ|感伤|感慨|实感');
  extendG('date', '6月13|今天了');
  extendG('together', '很红|会顺利|做得很好|想过未来|一直好好的|抛弃|健健康康');
  extendG('love', '爱大家|爱哥|撒浪嘿|사랑|喜欢田柾国|不爱我');
  extendG('thanks', '수고');
  extendG('lost', '内裤');
  extendG('maknaeG', '柾国儿|田柾国|吸尘器');
  extendG('broke', '打碎|碎了');
  extendG('photoReq', '自拍');
  extendG('sleep', '失眠|睡不觉');
  extendG('greet', '^hey|^来啦|^回来了');
  extendG('ok', '^(?:okok|好啦|行啦|当然|of course|ye ?s|嗯嗯是真的|我们一起|一起|我也是呢|走)$');
  extendG('age', '没成年|成年');
  const lines = {
    yq: { meta: [['……刚才在说别的', '你说']], bts: [['……嗯']], quit: [['……？？', '南俊']], goOut: [['……不去'], ['……几点回来']], english: [['……问南俊']],
      wow: [['……ㅋ']], harshG: [['……南俊 你今天怎么了']], tsundere: [['……'], ['……我一直这样']], familyG: [['……我家也是']], interview: [['……准备了']],
      whenBackG: [['……马上']], fanG: [['……什么粉丝']] },
    sx: { meta: [['ㅋㅋ对不起', '刚才大家在说别的', '你说你说']], bts: [['防弹少年团ㅋㅋ', '我们的名字真好听']], quit: [['南俊？？？', '你在说什么']],
      goOut: [['这个点去哪ㅋㅋ', '早点回来']], english: [['英语找南俊ㅋㅋ']], wow: [['那当然ㅋㅋ']], harshG: [['……南俊你今天心情不好吗']],
      tsundere: [['玧其本来就这样ㅋㅋ']], familyG: [['我爸妈也是', '一直在调台ㅋㅋ']], interview: [['哥准备了自我介绍ㅋㅋ']], whenBackG: [['快了快了']], fanG: [['什么粉丝ㅋㅋ', '我们还没出道呢']] },
    hx: { meta: [['我们太吵了ㅋㅋㅋㅋ', '你说！！我在看']], bts: [['防弹！！！'], ['防弹少年团 加油！！']], quit: [['南俊！！！', '不可以！！']],
      goOut: [['我也去！！']], english: [['南俊教我们！！']], wow: [['ㅋㅋㅋㅋ我们最棒！！']], harshG: [['南俊…', '是不是太累了']],
      tsundere: [['ㅋㅋㅋㅋ玧其哥害羞了']], familyG: [['我妈也在电视前面了！！']], interview: [['我练了好多遍！！']], whenBackG: [['马上到！！']], fanG: [['粉丝！！', '我们会有粉丝吗ㅋㅋ']] },
    jw: { meta: [['啊…对不起ㅋㅋ', '刚才没看到']], bts: [['嗯！防弹']], quit: [['哥？？', '你别吓我']], goOut: [['我跟你去']], english: [['我也想学ㅋㅋ']],
      wow: [['ㅋㅋㅋㅋ']], harshG: [['……哥']], tsundere: [['ㅋㅋ玧其哥一直这样']], familyG: [['我妈刚才打电话了…', '她说会一直看']], interview: [['我有点怕采访…']], whenBackG: [['快到了']], fanG: [['ㅋㅋ哥说什么呢']] },
    ty: { meta: [['ㅋㅋㅋㅋ我们在聊别的', '你说什么？']], bts: [['防弹！！ㅋㅋ']], quit: [['哥？？？', '不行！']], goOut: [['我去！！']], english: [['hello！ㅋㅋ']],
      wow: [['我知道ㅋㅋ']], harshG: [['……哥？']], tsundere: [['ㅋㅋㅋㅋ玧其哥']], familyG: [['我家里人说要给全村看ㅋㅋ']], interview: [['我要说我最帅ㅋㅋ']], whenBackG: [['在路上！']], fanG: [['粉丝！我要第一个签名ㅋㅋ']] },
    jy: { meta: [['……对不起ㅋㅋ']], bts: [['……防弹']], quit: [['……哥？？']], goOut: [['我去！'], ['我跟你一起']], english: [['……我也不会']],
      wow: [['ㅋㅋ']], harshG: [['……']], tsundere: [['ㅋㅋ']], familyG: [['……我妈也是']], interview: [['……我不太会说话']], whenBackG: [['……快了']], fanG: [['……？ㅋㅋ']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
  // 第二、三个人的通用反应改成不带“同意”的语气，避免像在附和自己没看懂的话
  G.follow = {
    yq: [['ㅋ'], ['……嗯'], ['……']],
    sx: [['ㅋㅋㅋㅋ'], ['ㅋㅋ南俊'], ['嗯嗯']],
    hx: [['ㅋㅋㅋㅋ'], ['南俊ㅋㅋㅋㅋ'], ['嗯嗯！！']],
    jw: [['ㅋㅋ'], ['嗯嗯'], ['ㅋㅋ哥']],
    ty: [['ㅋㅋㅋㅋ'], ['嗯！'], ['ㅋㅋ']],
    jy: [['……ㅋㅋ'], ['嗯'], ['ㅋㅋ']]
  };
})();
