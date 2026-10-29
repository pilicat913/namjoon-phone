/* 根据玩家分享的聊天补的语库（第十九批，截至 2026-10-28 23:41:03 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };

  // 真人绯闻：角色不接
  add('rumor', 'jennie|拍拖|绯闻|恋爱传闻', {
    yq: same([['……那是谁']]), sx: same([['那是谁？ㅋㅋ', '别乱说']]), hx: same([['什么呀ㅋㅋ', '不认识！！']]),
    jw: same([['……谁？']]), ty: same([['我不认识ㅋㅋ', '我只认识练习室']]), jy: same([['……？']])
  });
  add('crude', '打手枪|开黄腔|黄色|色色', {
    yq: same([['……']]), sx: same([['……南俊', '你在说什么']]), hx: same([['……？？', '早点睡吧']]),
    jw: same([['……{哥}？']]), ty: same([['……？']]), jy: same([['……']])
  });
  add('salesLow', '销量|惨淡|才\\d+张|卖得不好|没人买', {
    yq: same([['……第一张而已', '会好起来的']]), sx: same([['买了的人哥都记住了', '一个都不会忘']]), hx: same([['没关系！！', '下一张会更好的！！']]),
    jw: same([['……有点难过', '但是我们会继续的']]), ty: same([['我一张一张签名送给他们ㅋㅋ']]), jy: same([['……下次会更多']])
  });
  add('underwear', '内裤', {
    yq: same([['……不是我']]), sx: same([['我的也少了ㅋㅋ', '肯定是泰亨']]), hx: same([['ㅋㅋㅋㅋㅋ不是我！！']]),
    jw: same([['……不是我ㅋㅋ']]), ty: same([['……可能是我ㅋㅋ', '它们长得都一样嘛']]), jy: same([['……哥', '我的又不见了']])
  });
  add('disappointed', '(?:对|让)你(?:们)?(?:很|太)?失望|好失望', {
    yq: same([['……对不起']]), sx: same([['……怎么了', '哥哪里做错了']]), hx: same([['啊…', '对不起 我会改的']]),
    jw: same([['……对不起', '我会更努力的']]), ty: same([['……对不起嘛']]), jy: same([['……对不起']])
  });
  add('antiFan', '黑粉|不是粉丝的人|网上那些人|别在意那些', {
    yq: same([['……不看', '没时间看']]), sx: same([['哥心很大的ㅋㅋ', '谢谢你']]), hx: same([['嗯！！', '我们只看爱我们的人']]),
    jw: same([['……嗯', '谢谢你这么说']]), ty: same([['我不看ㅋㅋ', '我只看你发的']]), jy: same([['……嗯', '知道了']])
  });
  add('emergency', '进医院|住院|出事了|车祸|摔倒了', {
    yq: same([['……哪里', '我马上过去']]), sx: same([['什么？？', '在哪 哥马上去']]), hx: same([['什么？！', '严重吗！！']]),
    jw: same([['什么？？', '哪个医院', '我马上去']]), ty: same([['真的假的？？', '我去找他']]), jy: same([['……？？', '我去']])
  });
  add('pdCall', 'pd(?:님)?(?:说|找)|找pd|房pd|方pd', {
    yq: same([['……知道了']]), sx: same([['PD找我？', '……是不是又要减肥']]), hx: same([['什么事啊！！', '好紧张']]),
    jw: same([['……什么事啊', '我是不是哪里做得不好']]), ty: same([['好ㅋㅋ', '我去']]), jy: same([['……好', '……好紧张']])
  });
  add('fatTease', '你好胖|好胖|你胖了|变胖了', {
    yq: same([['……我没胖']]), sx: same([['这是宽肩ㅋㅋ']]), hx: same([['真的吗！！', '那我多跳一会']]),
    jw: same([['……真的吗', '那我不吃了']]), ty: same([['……真的吗ㅋㅋ', '那我少吃一个鸡腿']]), jy: same([['……在长身体']])
  });
  extend('comfort', '一个人.{0,3}扛|自己.{0,3}扛|一个人.{0,3}撑|逞强|硬撑|外壳|勉强自己|怕失去');
  extend('frustrated', '多回我|回我一点');
  extend('timeTravel', '意识进入|进入南俊身体');

  const G = window.STORY.group; if (!G) return;
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('futureG', '世界杯|火到全世界|飞的比飞机还高|世界第一男团');
  extendG('food', '草莓蛋糕|萝卜糕|辣炒年糕|喝什么');
  extendG('fanG', '粉丝');
  G.topics.unshift(
    { key: 'rumorG', re: 'jennie|拍拖|绯闻', prefer: ['ty', 'sx', 'hx'] },
    { key: 'crudeG', re: '打手枪|开黄腔', prefer: ['sx', 'yq'] },
    { key: 'sunriseG', re: '日出', prefer: ['ty', 'hx', 'jw'] },
    { key: 'rpsG', re: '剪刀石头布|石头剪刀布', prefer: ['ty', 'jy', 'hx'] },
    { key: 'breakUpG', re: '绝交', prefer: ['hx', 'jw', 'ty'] },
    { key: 'underwearG', re: '内裤', prefer: ['jy', 'ty', 'sx'] },
    { key: 'giftG', re: '红包|零用钱|送你们', prefer: ['hx', 'ty', 'jy'] },
    { key: 'bathG', re: '洗澡', prefer: ['sx', 'jw', 'jy'] }
  );
  const lines = {
    yq: { rumorG: [['……谁']], crudeG: [['……']], sunriseG: [['……我睡觉']], rpsG: [['……布']], breakUpG: [['……行']], underwearG: [['……不是我']], giftG: [['……不用']], bathG: [['……快点洗']] },
    sx: { rumorG: [['别乱说ㅋㅋ', '泰亨每天都在练习室']], crudeG: [['……南俊', '你在说什么']], sunriseG: [['看日出？', '那得四点起ㅋㅋ']], rpsG: [['石头！', '哥赢了ㅋㅋ']], breakUpG: [['又怎么了ㅋㅋ']], underwearG: [['我的也少了ㅋㅋ']], giftG: [['南俊你哪来的钱ㅋㅋ']], bathG: [['热水给后面的人留一点']] },
    hx: { rumorG: [['那是谁！！ㅋㅋ']], crudeG: [['……？？']], sunriseG: [['好啊！！', '我想去看海边的日出！！']], rpsG: [['剪刀！！']], breakUpG: [['不要！！', '我们不绝交！！']], underwearG: [['ㅋㅋㅋㅋㅋ不是我！！']], giftG: [['谢谢！！', '但你自己留着！！']], bathG: [['我第二个！！']] },
    jw: { rumorG: [['……谁？']], crudeG: [['……？']], sunriseG: [['好浪漫…', '我要去']], rpsG: [['布ㅋㅋ']], breakUpG: [['……为什么嘛']], underwearG: [['……不是我ㅋㅋ']], giftG: [['{哥}不用啦…']], bathG: [['我洗完了ㅋㅋ']] },
    ty: { rumorG: [['我不认识ㅋㅋ', '我只认识你们']], crudeG: [['……？']], sunriseG: [['去！！', '我开车ㅋㅋ……我没有驾照']], rpsG: [['石头！ㅋㅋ', '再来一次']], breakUpG: [['不要ㅋㅋ']], underwearG: [['……可能是我ㅋㅋ']], giftG: [['哇！！ㅋㅋ', '我要买冰淇淋']], bathG: [['我要最后洗ㅋㅋ']] },
    jy: { rumorG: [['……？']], crudeG: [['……']], sunriseG: [['……我起不来']], rpsG: [['……剪刀', '……输了']], breakUpG: [['……？']], underwearG: [['……我的又不见了']], giftG: [['……谢谢']], bathG: [['……我先洗']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
