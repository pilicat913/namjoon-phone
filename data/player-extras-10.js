/* 根据玩家分享的聊天补的语库（第十批，截至 2026-10-24 17:58:44 UTC）。格式同 player-extras.js。
 * 告白类保持“温柔但不接受、不暧昧升级”；抽烟、擦边话题岔开；倾诉类认真接住。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };
  add('confess', '我是你对象|还没分手|分手|marry me|嫁给我|娶我|抛弃我|不要我|离开我|喜欢什么样的女生|喜欢什么个性|149|那我去喜欢别人|我不喜欢你了|我在表白', {
    yq: same([['……你在说什么', '早点睡'], ['……我现在只想着明天', '别多想'], ['ㅋ', '……你这人']]),
    sx: same([['ㅋㅋ哥这么受欢迎吗', '先出道再说'], ['哥是大家的ㅋㅋ']]), hx: same([['ㅋㅋㅋㅋ什么呀！！', '我会害羞的']]),
    jw: same([['ㅋㅋ{哥}今天好奇怪', '……我会害羞的']]), ty: same([['ㅋㅋ秘密', '你猜']]), jy: same([['……{哥}？？', '你没事吧ㅋㅋ']])
  });
  add('comingOut', '喜欢的是男生|我喜欢男生|喜欢同性|我是gay|我是同性恋|被粉丝知道后|如果粉丝知道了', {
    yq: same([['……喜欢谁都没关系', '你还是你']]), sx: same([['喜欢谁都没关系', '哥在', '想说的时候再说']]),
    hx: same([['没关系的！！', '你就是你', '我们都在']]), jw: same([['……没关系的', '谢谢你愿意跟我说']]),
    ty: same([['没关系', '喜欢谁都很好']]), jy: same([['……没关系', '我不会跟别人说的']])
  });
  add('smoke', '抽吗|抽烟|烟$|^烟|抽一根', {
    yq: same([['……不抽', '明天要唱歌']]), sx: same([['不行ㅋㅋ', '嗓子要紧']]), hx: same([['不行不行！！']]),
    jw: same([['……不要吧', '明天要上台']]), ty: same([['不要ㅋㅋ']]), jy: same([['……不会']])
  });
  add('pain', '好痛苦|我哭爆|做了个梦|再也见不到|我好累|好累啊|最近好累', {
    yq: same([['……怎么了', '我在']]), sx: same([['怎么了', '哥听着 慢慢说']]), hx: same([['怎么了！！', '我陪你']]),
    jw: same([['……怎么了', '别一个人难过']]), ty: same([['怎么了', '我在这里']]), jy: same([['……怎么了', '我听着']])
  });
  add('tattoo', '刺青|纹身', {
    yq: same([['……刺青？']]), sx: same([['刺青？？', '公司会骂的ㅋㅋ']]), hx: same([['刺青！！好酷']]),
    jw: same([['ㅋㅋ我不敢']]), ty: same([['我也想ㅋㅋ']]), jy: same([['……刺青？', '好酷ㅋㅋ', '但是现在不行']])
  });
  add('toFans', '对粉丝说|想对粉丝|对阿米说|想对army', {
    yq: same([['……谢谢', '以后我们会用音乐回答']]), sx: same([['谢谢喜欢我们', '哥会一直帅下去ㅋㅋ']]), hx: same([['谢谢！！', '我们会一直努力的！！']]),
    jw: same([['……谢谢你们', '我会努力不让你们失望']]), ty: same([['谢谢', '我们会一直在']]), jy: same([['……谢谢', '我会更努力']])
  });
  add('callMeBaby', '叫(?:哥|我)宝贝|叫我宝宝|叫哥宝宝', {
    yq: same([['……不要']]), sx: same([['ㅋㅋ不要']]), hx: same([['ㅋㅋㅋㅋ不要！！']]), jw: same([['……不要ㅋㅋ', '好肉麻']]), ty: same([['宝贝ㅋㅋ', '……开玩笑的']]), jy: same([['……不要ㅋㅋ']])
  });
  add('autograph', '签名|签个名', {
    yq: same([['……还没练好']]), sx: same([['好啊ㅋㅋ', '哥的签名很帅的']]), hx: same([['好！！我练了好久']]),
    jw: same([['ㅋㅋ还在练签名', '明天给你签']]), ty: same([['我签一个v就好ㅋㅋ']]), jy: same([['……我还没练好ㅋㅋ']])
  });
  add('meetDate', '\\d{3,4}见|\\d+月\\d+.{0,3}见|到时候见', {
    yq: same([['……嗯']]), sx: same([['好 到时候见ㅋㅋ']]), hx: same([['好！！约好了']]), jw: same([['嗯？那天有什么吗ㅋㅋ', '好 约好了']]), ty: same([['好！']]), jy: same([['……好']])
  });
  add('walk', '散步|汉江|去走走', {
    yq: same([['……这个点？']]), sx: same([['汉江？', '明天还要早起ㅋㅋ']]), hx: same([['好啊！！']]), jw: same([['好呀 一起']]), ty: same([['好！走！', '我要去吃拉面ㅋㅋ']]), jy: same([['……好']])
  });
  add('myBday', '我的生日|我生日|是我生日', {
    yq: same([['……生日快乐']]), sx: same([['生日快乐！！ㅋㅋ']]), hx: same([['生日快乐！！！', '要吃蛋糕！！']]),
    jw: same([['生日快乐呀', '要开心哦']]), ty: same([['生日快乐！', '我给你唱歌ㅋㅋ']]), jy: same([['……生日快乐']])
  });
  add('whyIdol', '为什么.{0,4}当爱豆|为什么想当|为什么当歌手|为什么会想当|为什么做偶像', {
    yq: same([['……想做音乐', '就这么简单']]), sx: same([['在街上被发掘的ㅋㅋ', '因为太帅了']]), hx: same([['因为喜欢跳舞！！', '想一直跳下去']]),
    jw: same([['想站在舞台上', '……想让大家看到我']]), ty: same([['……秘密ㅋㅋ', '其实是陪朋友去的']]), jy: same([['……看了南俊哥的rap', '就想来这里']])
  });
  add('joke', '笑话', {
    yq: same([['……不讲']]), sx: same([['我给你讲一个', '企鹅为什么不会飞？', '……因为它太胖了ㅋㅋㅋㅋ', '好笑吧']]),
    hx: same([['硕珍哥的笑话最冷了ㅋㅋㅋㅋ']]), jw: same([['ㅋㅋ去找硕珍哥']]), ty: same([['我讲！', '……忘了ㅋㅋ']]), jy: same([['……去找硕珍哥ㅋㅋ']])
  });
  add('farewell', '明天还能|回到南俊手上|还能见面|还能聊吗|以后还能', {
    yq: same([['……不知道', '但今晚我记着']]), sx: same([['不知道ㅋㅋ', '但哥会记得今晚的']]), hx: same([['一定能的！！', '……就算不能 我也会记住你']]),
    jw: same([['……我也不知道', '但今晚我会记住的']]), ty: same([['能的', '……我觉得能ㅋㅋ']]), jy: same([['……不知道', '但谢谢你今晚陪我']])
  });
  add('momGift', '妈妈给你们|妈妈让我给|我妈给', {
    yq: same([['……谢谢阿姨']]), sx: same([['谢谢阿姨！！', '替我谢谢她']]), hx: same([['谢谢阿姨！！！']]), jw: same([['谢谢阿姨…', '好感动']]), ty: same([['谢谢阿姨！']]), jy: same([['……谢谢阿姨']])
  });
  extend('wish', '永远在一起|一直在一起|好想和你们');
  extend('fanFuture', '入坑|因为你才认识|世界巡回|世界巡迴|巡演|演唱会.{0,6}票|world tour');
  extend('secret', '不要跟其他成员说|先不要跟|答应我先');
  extend('didi', '叫你弟弟|好的 弟弟|好的弟弟');
  extend('harsh', '吃屎|种猪');
  extend('love', '有没有想我|사란헤|李依依永远爱');
  extend('maknae', '你才15|才15|别急着长大');
  extend('callAsk', '想听你的声音|方便电话|快接|你好了再回我');
  extend('comfort', '别自己扛|一个人扛|离乡|有哥真好|我会陪你的|还好有你|你们在我背后|没有你们我|有你在很好|你很珍贵|不是突然冒出来');
  extend('knowArmy', '阿米是谁|喜欢阿米吗');
  extend('fromAbroad', '不是韩国人');
  extend('futureWarn', '送外卖|别去送外卖');
  extend('handover', '把这个号给我');
  extend('frustrated', '每次都是这几句|文不对题|你先听我说');
  extend('sleepTogether', '去哥房间睡|去你房间睡|跟哥睡');
  extend('stress', '睡不好|放松不了|焦虑');
  extend('robot', '像ai|诡异');
  extend('animal', '宝猪');
  extend('sendMe', '跳舞影片|跳舞视频|视频给我');
  extend('wakeMe', '分叫我|二十分');
  extend('mistake', '跳不好|会做好吗');

  const G = window.STORY.group; if (!G) return;
  G.topics.unshift(
    { key: 'deflect', re: '多p|蕾丝|性感|女装', prefer: ['sx', 'yq', 'jw'] },
    { key: 'studentLife', re: '课业|社团|人际|考试|作业|学校好累', prefer: ['jw', 'sx', 'hx'] },
    { key: 'outNight', re: '不回宿舍|不回去了|在外面住|住酒店|偷约', prefer: ['sx', 'hx', 'yq'] },
    { key: 'chant', re: '应援', prefer: ['hx', 'ty', 'jw'] },
    { key: 'sign', re: '签名', prefer: ['ty', 'hx', 'jy'] },
    { key: 'dm', re: '私聊', prefer: ['jw', 'sx', 'jy'] }
  );
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('worryG', '焦虑|好不起来|拿不到奖|好害怕');
  extendG('together', '台湾|花路|成为怎样的人|优秀的七个人|全世界都知道|梦想能成真|身边有你们');
  extendG('futureSongG', 'forever we are young|young forever');
  extendG('game', '冒险岛');
  extendG('lost', '袜子|帽子');
  extendG('meta', '文不对题|莫名其妙|不要再ㅋ|很难懂|哪里不懂|刚刚好像一样');
  extendG('careful', '受伤');
  extendG('crush', '你爱');
  extendG('fanG', '毒唯');
  extendG('tsundere', '装傻');
  extendG('harshG', '种猪|滚出来|出来道歉|别打扰');
  // 补漏：文件没了、小猪、奶龙、闵运气；“不能出门”“真难带”优先归到对的话题
  G.topics.unshift(
    { key: 'fileLost', re: '(?:文件|文档|存档)(?:没了|不见|丢了)', prefer: ['yq', 'jw', 'sx'] },
    { key: 'piggy', re: '小猪|宝猪|猪', prefer: ['jy', 'ty', 'sx'] },
    { key: 'nailong', re: '奶龙', prefer: ['ty', 'hx', 'jy'] },
    { key: 'yqNick', re: '闵运气|运气', prefer: ['yq', 'sx', 'hx'] },
    { key: 'forbid', re: '不能出门|不准出门|不许出门', prefer: ['jy', 'ty', 'sx'] },
    { key: 'hardLead', re: '难带|带不动', prefer: ['sx', 'hx', 'jw'] }
  );
  const more10 = {
    yq: { fileLost: [['……？？？', '……什么文件', '……我去看看']], piggy: [['……ㅋ']], nailong: [['……什么东西']], yqNick: [['……谁是闵运气'], ['……再叫一次试试']] },
    sx: { fileLost: [['玧其！！', '快看看还在不在']], piggy: [['柾国是小猪ㅋㅋ']], nailong: [['奶龙是什么ㅋㅋ']], yqNick: [['ㅋㅋㅋㅋ闵运气']] },
    hx: { fileLost: [['啊啊啊！！', '玧其哥快看！！']], piggy: [['ㅋㅋㅋㅋ小猪！！']], nailong: [['奶龙！！ㅋㅋㅋㅋ', '是什么呀']], yqNick: [['ㅋㅋㅋㅋ运气好的玧其哥']] },
    jw: { fileLost: [['……哥别吓他ㅋㅋ']], piggy: [['ㅋㅋ谁是小猪']], nailong: [['……奶龙？ㅋㅋ']], yqNick: [['ㅋㅋㅋㅋ']] },
    ty: { fileLost: [['……玧其哥会哭的']], piggy: [['柾国！ㅋㅋ']], nailong: [['我是奶龙！ㅋㅋ']], yqNick: [['闵运气！ㅋㅋ', '好好听']] },
    jy: { fileLost: [['……？']], piggy: [['……不是我ㅋㅋ'], ['……我才不是猪']], nailong: [['……？ㅋㅋ']], yqNick: [['ㅋㅋ']] }
  };
  for (const [id, more] of Object.entries(more10)) if (G.lead[id]) Object.assign(G.lead[id], more);
  const lines = {
    yq: { deflect: [['……南俊 睡觉']], studentLife: [['……辛苦了', '早点睡']], outNight: [['……去哪', '明天六点']], chant: [['……什么口号']], sign: [['……还没练']], dm: [['……嗯']] },
    sx: { deflect: [['……南俊你在说什么ㅋㅋ', '快去睡']], studentLife: [['辛苦了', '累了就先休息', '哥在']], outNight: [['？？去哪', '明天六点要起啊']], chant: [['口号？', '我们还没有呢ㅋㅋ']], sign: [['哥的签名最帅ㅋㅋ']], dm: [['好 等我']] },
    hx: { deflect: [['ㅋㅋㅋㅋ南俊！！', '睡觉睡觉']], studentLife: [['辛苦了！！', '一定要好好休息']], outNight: [['南俊去哪！！', '早点回来']], chant: [['口号！！', '什么口号快说']], sign: [['我练了好久！！']], dm: [['好！！']] },
    jw: { deflect: [['……哥？ㅋㅋ', '早点睡吧']], studentLife: [['辛苦了…', '累的时候说出来就好', '我们都在']], outNight: [['哥去哪…', '早点回来']], chant: [['什么口号呀']], sign: [['ㅋㅋ我也在练']], dm: [['嗯 我等你']] },
    ty: { deflect: [['ㅋㅋㅋㅋ什么呀']], studentLife: [['辛苦了', '我给你唱首歌ㅋㅋ']], outNight: [['哥去哪！带我']], chant: [['我已经想好了！', '……忘了ㅋㅋ']], sign: [['我签一个v就好ㅋㅋ']], dm: [['好！']] },
    jy: { deflect: [['……？']], studentLife: [['……辛苦了']], outNight: [['……去哪']], chant: [['……口号？']], sign: [['……我还没练好']], dm: [['……好']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
