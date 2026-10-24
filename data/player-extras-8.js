/* 根据玩家分享的聊天补的语库（第八批，截至 2026-10-24 16:41:27 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };
  // 玩家给粉丝起名：在这部手机里，粉丝名是“读者”告诉他们的
  add('nameArmy', '粉丝就叫|叫army|叫阿米|粉丝名叫|粉丝叫army|粉丝叫阿米', {
    yq: same([['……army', '还行', '……挺好听的']]), sx: same([['army？', '好听！！哥记住了ㅋㅋ']]),
    hx: same([['army！！', '好好听！！我要告诉大家']]), jw: same([['army…', '好好听', '谢谢你帮我们想']]),
    ty: same([['army！', '我喜欢ㅋㅋ', '那以后我们就是防弹和army了']]), jy: same([['……army', '好听', '我记住了']])
  });
  add('knowArmy', '你知道阿米吗|知道army吗|你知道army|阿米是什么', {
    yq: same([['……那是什么']]), sx: same([['阿米？', '是什么ㅋㅋ']]), hx: same([['阿米？？', '是什么呀！！']]),
    jw: same([['阿米？', '没听过…']]), ty: same([['阿米！', '……是什么ㅋㅋ']]), jy: same([['……不知道']])
  });
  add('futureWarn', '解散|手术|肩膀|受伤了|差点', {
    yq: same([['……你在说什么', '我没事'], ['……别担心', '我会注意的']]), sx: same([['什么？？', '我们不会散的'], ['……好 哥记着了']]),
    hx: same([['不会的！！', '我们一直在一起']]), jw: same([['……你别吓我', '我们会好好的']]),
    ty: same([['不会的', '我们七个不会分开']]), jy: same([['……不会的']])
  });
  add('songLiked', '会有人喜欢|会不会没粉丝|会没粉丝|有人喜欢吗|会不会火', {
    yq: same([['……会的', '不然我们写干嘛']]), sx: same([['会的ㅋㅋ', '有哥这张脸在']]), hx: same([['一定会的！！']]),
    jw: same([['会的…吧', '我相信会的']]), ty: same([['会的！', '我已经很喜欢了ㅋㅋ']]), jy: same([['……会的']])
  });
  add('stageName', '艺名', {
    yq: same([['……suga']]), sx: same([['jin！', '简单好记ㅋㅋ']]), hx: same([['j-hope！！', '我是你们的希望ㅋㅋ']]),
    jw: same([['就是jimin呀ㅋㅋ']]), ty: same([['v！', '酷吧ㅋㅋ']]), jy: same([['……jungkook', '就是本名']])
  });
  if (M.fanName) M.fanName.re = '粉丝名(?:要)?叫什么|粉丝叫什么|粉丝名是什么';
  extend('shipQ', '交往|吵架|和好');
  extend('iNervous', '紧张的快死|紧张得快死|快紧张死');
  extend('stress', '迷惘|没有信心|没信心|状态不太好');
  extend('futureCheer', '时代广场|宇宙|superstar');
  extend('maknae', '长不高|长个');
  extend('eatUp', '热量|偷偷吃');
  extend('callAsk', '影通|视频通话吗');
  extend('offerFood', '什么味|吃炸鸡吗');
  extend('fanFuture', '去见你们|大粉丝|未来的粉丝|你们的粉丝(?!名)');
  extend('guessMe', '如果我不是那我是谁|你知道我是谁|你怎么知道我的名字|你为什么知道我的名字');

  const G = window.STORY.group; if (!G) return;
  G.topics.unshift(
    { key: 'gross', re: '大便|冲水|放屁|臭死', prefer: ['jy', 'sx', 'ty'] },
    { key: 'sleepTogetherG', re: '一起睡|七个人一起', prefer: ['ty', 'hx', 'jw'] }
  );
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('cry', '感性|状态不太好');
  extendG('together', '撑住|会不会没粉丝|superstar|十年后|10年后|世界各地|巡回|发光发热|骄傲|多亏|会很厉害|一起努力|多指教');
  extendG('familyG', '后盾');
  extendG('quiet', '那么吵|好吵');
  extendG('food', '热');
  extendG('funny', '开玩笑|不打自招|取笑');
  extendG('fanG', '未来的南俊|我是谁|有粉丝');
  extendG('happy', '太棒了|好高兴|兴奋');
  const lines = {
    yq: { gross: [['……田柾国']], sleepTogetherG: [['……不要']] },
    sx: { gross: [['柾国！！！', '冲水！！']], sleepTogetherG: [['客厅挤得下吗ㅋㅋ', '……行吧']] },
    hx: { gross: [['ㅋㅋㅋㅋㅋㅋ柾国！！']], sleepTogetherG: [['好！！我去拿被子']] },
    jw: { gross: [['ㅋㅋㅋㅋ']], sleepTogetherG: [['好呀ㅋㅋ', '我要睡中间']] },
    ty: { gross: [['ㅋㅋㅋㅋ我作证']], sleepTogetherG: [['好！我先占位置ㅋㅋ']] },
    jy: { gross: [['……不是我！！', '……这次是我']], sleepTogetherG: [['……好ㅋㅋ']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
