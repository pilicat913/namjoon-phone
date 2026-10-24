/* 根据玩家分享的聊天补的语库（第九批，截至 2026-10-24 17:00:42 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };
  add('diet', '减肥|要瘦|节食', {
    yq: same([['……别减了']]), sx: same([['不许减！！', '明天要吃饱才有力气']]), hx: same([['不行！！', '你已经很好了']]),
    jw: same([['我也想减…ㅋㅋ', '但明天先吃饱']]), ty: same([['减什么ㅋㅋ', '一起吃炸鸡']]), jy: same([['……不用减']])
  });
  add('wishReq', '愿望|帮我实现', {
    yq: same([['……说']]), sx: same([['什么愿望？', '哥听听']]), hx: same([['什么愿望！！', '说吧说吧']]),
    jw: same([['嗯？什么愿望', '我能做到的话']]), ty: same([['说！我帮你ㅋㅋ']]), jy: same([['……什么愿望']])
  });
  add('tiredMe', '^有点累|^好累|^累了|^我累', {
    yq: same([['……早点睡']]), sx: same([['辛苦了', '早点休息']]), hx: same([['辛苦了！！', '快去睡']]),
    jw: same([['辛苦了…', '早点休息吧']]), ty: same([['那快睡', '我给你唱摇篮曲ㅋㅋ']]), jy: same([['……辛苦了']])
  });
  add('worryWhat', '担心什么|担心啥|你担心', {
    yq: same([['……没什么']]), sx: same([['怕明天说错话ㅋㅋ']]), hx: same([['怕明天跳错！！']]),
    jw: same([['就是…', '怕明天出错', '怕让大家失望']]), ty: same([['怕自己笑场ㅋㅋ']]), jy: same([['……怕高音上不去']])
  });
  add('hair', '长发|头发|发型', {
    yq: same([['……明天要弄']]), sx: same([['哥的发型最好看ㅋㅋ']]), hx: same([['明天要弄好看！！']]),
    jw: same([['ㅋㅋ明天会弄好的', '长发很奇怪吗']]), ty: same([['我想染头发！']]), jy: same([['……头发好难弄']])
  });
  add('futureSong', 'butterfly|i need u|spring day|dynamite|fake love|血汗泪|花样年华|春日|fire|idol|boy with luv|permission to dance', {
    yq: same([['……那是什么', '好名字 记下来了']]), sx: same([['新歌？', '哥怎么不知道ㅋㅋ']]), hx: same([['什么歌！！', '听起来好帅']]),
    jw: same([['那是…新歌吗？', '好好听的名字']]), ty: same([['那是什么ㅋㅋ', '我喜欢这个名字']]), jy: same([['……是新歌吗']])
  });
  add('yeontan', '碳尼|狗狗|养狗|小狗', {
    yq: same([['……狗']]), sx: same([['狗狗！', '宿舍不能养吧ㅋㅋ']]), hx: same([['狗狗好可爱！！']]),
    jw: same([['狗狗！', '好想养']]), ty: same([['狗狗！！', '碳尼？好可爱的名字', '以后我一定要养ㅋㅋ']]), jy: same([['……想养']])
  });
  add('firstWin', '第一名|拿一位|一位|一等|能成功吗|真的能成功', {
    yq: same([['……会的', '不会太久'], ['……我们会拿到的']]), sx: same([['一定会的', '到时候哥第一个哭ㅋㅋ']]), hx: same([['会的！！', '我们一起拿']]),
    jw: same([['会的…', '我也好想']]), ty: same([['拿了一位我就请大家吃炸鸡ㅋㅋ']]), jy: same([['……会拿到的']])
  });
  add('cantGo', '没办法去|去不了|不能去你们', {
    yq: same([['……没事', '以后我们去找你']]), sx: same([['没关系', '我们会去很多地方的']]), hx: same([['没关系！！', '我们去找你！！']]),
    jw: same([['没关系的', '以后一定会见到的']]), ty: same([['那我们去你那里ㅋㅋ']]), jy: same([['……没关系', '以后会见到的']])
  });
  add('fromAbroad', '我在台湾|在台湾|我在香港|在国外', {
    yq: same([['……这么远']]), sx: same([['台湾？', '那么远也来跟哥聊天ㅋㅋ']]), hx: same([['哇！！好远', '以后我们去台湾！！']]),
    jw: same([['好远啊…', '以后想去看看']]), ty: same([['台湾！我想去吃夜市ㅋㅋ']]), jy: same([['……好远']])
  });
  add('intro', '自我介绍', {
    yq: same([['……闵玧其']]), sx: same([['我是金硕珍！', '宿舍里最帅的那个ㅋㅋ', '该你了']]), hx: same([['我是郑号锡！！', '你的希望！！ㅋㅋ']]),
    jw: same([['我是朴智旻ㅋㅋ', '你呢']]), ty: same([['我是金泰亨！', '该你了']]), jy: same([['……田柾国']])
  });
  extend('timeTravel', '互换身体|灵魂互换');
  extend('fanFuture', '阿米以后|有多少阿米|以后有多少');
  extend('wakeMe', '早起吗|最晚起|叫我 我不要|我不要早起');
  extend('comfort', '没有自信|无限的潜力|人真的好好|靠山|陪着你|知己|认识你我好幸运|能够认识你|很感激|会顺利的|不要没有自信');
  extend('maknae', '小宝宝|帕布|果儿|哭鼻子');
  extend('cryComfort', '躲在厕所|哭鼻子');
  extend('frustrated', '怎么跟你聊天|都说你看不懂|又看不懂|发什么问号');
  extend('wantToTalk', '来聊天吧|我们来聊天');
  extend('careBody', '记得休息');
  extend('promise', '说到做到');
  extend('grownUp', '十年过后|十年后会');
  extend('tellWhenDone', '有空记得回我|等等给我打|等下给我打');
  extend('sad', '正在哭|在哭');
  extend('love', '太爱你|啾咪');
  extend('cookReq', '煮什么都好吃|手艺|三明治|早餐想吃');
  extend('give', '破费');
  extend('stress', '不安');

  const G = window.STORY.group; if (!G) return;
  G.topics.unshift(
    { key: 'futureSongG', re: 'butterfly|i need u|spring day|dynamite|fake love|血汗泪|花样年华|春日', prefer: ['ty', 'yq', 'hx'] },
    { key: 'dietG', re: '减肥|节食', prefer: ['sx', 'hx', 'jw'] },
    { key: 'youngG', re: '青涩|好嫩|好小', prefer: ['sx', 'ty', 'hx'] }
  );
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('happy', '生日快乐|庆生');
  extendG('together', '联合国|顶流|更好的以后|越来越好|会更好|还有很长的路|说不定真的可以');
  extendG('spam', '几十条|聊了这么多');
  extendG('cry', '安慰我|不行了');
  extendG('love', '想你|见你们|看到你们|i love you|啾咪');
  extendG('fanG', '我是army|我是小|捡到南俊手机');
  const lines = {
    yq: { futureSongG: [['……好名字', '记下来了']], dietG: [['……别减']], youngG: [['……？']] },
    sx: { futureSongG: [['那是什么歌ㅋㅋ', '南俊又在想新歌了？']], dietG: [['不许减！！', '明天要吃饱']], youngG: [['我们现在也很成熟好吗ㅋㅋ']] },
    hx: { futureSongG: [['什么歌！！', '听起来好帅']], dietG: [['不行不行！！']], youngG: [['ㅋㅋㅋㅋ南俊你在说什么']] },
    jw: { futureSongG: [['好好听的名字…']], dietG: [['我也想减…ㅋㅋ']], youngG: [['ㅋㅋ哥说什么呢']] },
    ty: { futureSongG: [['butterfly…', '我喜欢这个ㅋㅋ']], dietG: [['一起吃炸鸡ㅋㅋ']], youngG: [['我们本来就嫩ㅋㅋ']] },
    jy: { futureSongG: [['……新歌吗']], dietG: [['……不用减']], youngG: [['……？ㅋㅋ']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
