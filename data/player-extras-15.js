/* 根据玩家分享的聊天补的语库（第十五批，截至 2026-10-26 05:17:17 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };

  add('whyYouSay', '(?:怎么|为什么|为何|干嘛)(?:会)?(?:这样|这么)(?:说|问|讲|想|觉得|认为)|何出此言|怎么会这样想', {
    yq: same([['……就是觉得']]), sx: same([['你今天说话怪怪的ㅋㅋ', '哥随便问问']]), hx: same([['没什么！！', '就是突然想到ㅋㅋ']]),
    jw: same([['嗯…', '{哥}今天有点不一样']]), ty: same([['我也不知道ㅋㅋ', '感觉嘛']]), jy: same([['……没什么']])
  });
  add('youNotYou', '你不是(?:号锡|柾国|泰亨|智旻|硕珍|玧其)吧|你真的是(?:bts的)?(?:田柾国|柾国|号锡|泰亨|智旻|硕珍|玧其)吗|你真的柾国吗', {
    yq: same([['……我不是我是谁']]), sx: same([['那你说我是谁ㅋㅋ']]), hx: same([['是我啊！！', '你才奇怪吧ㅋㅋ']]),
    jw: same([['……是我啊？', '{哥}怎么了']]), ty: same([['ㅋㅋㅋ我是金泰亨', '你要验证吗']]), jy: same([['……是我', '{哥}才奇怪']])
  });
  add('futureQ', '年后的我们|以后的我们|变成很有名|冲出国际|很有名的团体|会走多远|走到巅峰|以后会怎么样', {
    yq: same([['……不知道', '先把歌做好']]), sx: same([['那哥就是世界最帅的歌手ㅋㅋ']]), hx: same([['会很好的！！', '我们七个一起']]),
    jw: same([['嗯…', '我想站在很大很大的舞台上']]), ty: same([['住大房子ㅋㅋ', '大家住一起']]), jy: same([['……想去国外表演', '很多很多国家']])
  });
  add('singForMe', '唱歌给我听|唱给我听|唱首歌|唱一首', {
    yq: same([['……不要']]), sx: same([['哥唱歌很贵的ㅋㅋ', '……那就一句']]), hx: same([['我唱rap给你听！！']]),
    jw: same([['现在吗…', '那我小声唱']]), ty: same([['好！', '低音那段给你唱ㅋㅋ']]), jy: same([['……现在吗', '等我回去']])
  });
  add('recording', '录好了|录完|还在录|录好叫我', {
    yq: same([['……还没']]), sx: same([['还在录', '哥那段一直不满意']]), hx: same([['还差一点！！']]),
    jw: same([['快好了', '再录两遍']]), ty: same([['录完了ㅋㅋ']]), jy: same([['……还在录', '高音那里']])
  });
  add('hobby', '动漫|最近在追|最近在看什么|喜欢看什么', {
    yq: same([['……没时间看']]), sx: same([['马里奥算吗ㅋㅋ']]), hx: same([['最近没看！！', '都在练舞']]),
    jw: same([['最近没怎么看…']]), ty: same([['火影ㅋㅋ']]), jy: same([['……海贼王']])
  });
  add('shutUpP', '闭嘴|闭上你的嘴', {
    yq: same([['……']]), sx: same([['……好', '哥不说了']]), hx: same([['啊…', '好吧']]),
    jw: same([['……对不起']]), ty: same([['……哦']]), jy: same([['……']])
  });
  add('hateMe', '讨厌我吗|你讨厌我|是不是讨厌我', {
    yq: same([['……没有']]), sx: same([['讨厌你还理你吗ㅋㅋ']]), hx: same([['怎么可能！！']]),
    jw: same([['不讨厌啊…', '为什么这么问']]), ty: same([['不讨厌ㅋㅋ', '喜欢']]), jy: same([['……不讨厌']])
  });
  add('mintHair', '薄荷绿|染(?:个|成)?.{0,4}(?:色|颜色)|想过染', {
    yq: same([['……薄荷绿？', '……考虑一下'], ['……染了会被骂吧']]), sx: same([['哥染粉色怎么样ㅋㅋ']]), hx: same([['染什么颜色！！', '我想染红色']]),
    jw: same([['我想染橘色ㅋㅋ']]), ty: same([['我想染蓝色！']]), jy: same([['……公司不让吧']])
  });
  extend('callAsk', '可以打了吗|几点可以打|什么时候回拨|接个电话|需要电话|给你打电话|^接$|视讯');
  extend('songLiked', '会成功吗|能成功吗|会受欢迎|喜欢我们的歌|台下会有|台下没有|会有人应援|粉丝会喜欢我们');
  extend('scared', '失败怎么办|我怕明天|我好怕|有点怕|跳错怎么办|唱不好');
  extend('robot', 'siri|固定回复|是机器人');
  extend('money', '转点钱|转个|买股票|有钱人|豪车|大别墅');
  extend('sleepTogether', '跟我睡|和我睡');
  extend('cookReq', '紫菜包饭|海苔包饭|辣炒年糕|做点好吃|想吃你做|吃哥做');
  extend('bday', '生日是什么时候|你生日');
  extend('animal', '像小猫|像小羊|猫猫|小馋猫');
  extend('songwriting', 'beat|给意见|词写|下一次的专辑|下一张专辑');

  const G = window.STORY.group; if (!G) return;
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('sleepNag', '^睡觉|^睡$|我现在就睡');
  extendG('wakeG', '起床|起来了吗');
  extendG('food', '草莓牛奶|寿司|汉堡|冰淇淋|宵夜');
  extendG('crush', '女友');
  G.topics.unshift(
    { key: 'emojiG', re: '^(?:[\\u2600-\\u27BF]|\\uD83C[\\uDF00-\\uDFFF]|\\uD83D[\\uDC00-\\uDEFF]|\\uD83E[\\uDD00-\\uDEFF]|\\uFE0F|\\u200D)+$', prefer: ['hx', 'ty', 'jw'] },
    { key: 'futureG', re: '从未来|来自未来|未来人|穿越|来自2026|从2026|2026年|26年|格莱美|世巡|巡演|红到|世界级|全世界都', prefer: ['sx', 'hx', 'yq'] },
    { key: 'countG', re: '报数|报备', prefer: ['sx', 'hx', 'jw'] },
    { key: 'treatG', re: '请客|买单|请第二轮', prefer: ['ty', 'jy', 'hx'] },
    { key: 'firstShowG', re: '第一场演出|第一次亮相|出道舞台', prefer: ['jw', 'hx', 'jy'], afterDebut: true },
    { key: 'silentG', re: '其他人.{0,4}(?:不说话|不见了|呢)|不说话|有人醒着|怎么只有|都在干什么', prefer: ['sx', 'ty', 'jy'] },
    { key: 'tooManyG', re: '太多讯息|讯息太多|太多信息|信息太多|传太多|发太多|消息太多', prefer: ['hx', 'sx', 'ty'] },
    { key: 'muteG', re: '禁言', prefer: ['yq', 'sx', 'hx'] }
  );
  const lines = {
    yq: { emojiG: [['……']], futureG: [['……又来了']], countG: [['……2']], treatG: [['……谁请？']], firstShowG: [['……还行', '下次更好']], silentG: [['……在']], tooManyG: [['……确实']], muteG: [['……试试']] },
    sx: { emojiG: [['ㅋㅋㅋ']], futureG: [['南俊今天看了什么电影ㅋㅋ'], ['要是真的就好了']], countG: [['1！', '哥是老大ㅋㅋ']], treatG: [['好！', '哥要点贵的ㅋㅋ']], firstShowG: [['腿还在抖ㅋㅋ', '但是很好']], silentG: [['在呢在呢', '刚才在洗澡']], tooManyG: [['南俊看不过来了ㅋㅋ']], muteG: [['ㅋㅋㅋ谁敢禁玧其']] },
    hx: { emojiG: [['ㅋㅋㅋㅋ']], futureG: [['真的吗！！', '我信！！']], countG: [['3！！']], treatG: [['我要炸鸡！！']], firstShowG: [['太好了！！', '我还想再上一次！！']], silentG: [['我在！！']], tooManyG: [['ㅋㅋㅋ慢慢看！！']], muteG: [['ㅋㅋㅋㅋ玧其哥本来就不说话']] },
    jw: { emojiG: [['ㅋㅋ']], futureG: [['……真的会那样吗']], countG: [['5！']], treatG: [['谢谢{哥}ㅋㅋ']], firstShowG: [['我好像哭了…', '还好没跳错']], silentG: [['我在呢ㅋㅋ']], tooManyG: [['ㅋㅋ对不起']], muteG: [['不要ㅋㅋ']] },
    ty: { emojiG: [['ㅋㅋㅋ']], futureG: [['好酷！', '那我们有大房子吗ㅋㅋ']], countG: [['4！ㅋㅋ']], treatG: [['好耶！！']], firstShowG: [['好爽！！ㅋㅋ']], silentG: [['我刚才在地板上睡着了ㅋㅋ']], tooManyG: [['我发的最多ㅋㅋ']], muteG: [['禁我吧ㅋㅋ']] },
    jy: { emojiG: [['……ㅋ']], futureG: [['……不信', '……想信']], countG: [['……7']], treatG: [['……谢谢']], firstShowG: [['……还想再上一次']], silentG: [['……在']], tooManyG: [['……']], muteG: [['……ㅋㅋ']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
