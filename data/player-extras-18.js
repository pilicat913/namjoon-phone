/* 根据玩家分享的聊天补的语库（第十八批，截至 2026-10-27 23:57:10 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };

  add('whyNotTake', '为什么不收|怎么不收|为什么不拿|为什么不能要|为什么不要|这是我的钱|把钱还我|又送给我|反送给我|退回来|你收啦|收了吧|收下吧', {
    yq: same([['……不要', '你自己留着'], ['……真的不用']]), sx: same([['哥怎么能收你的钱ㅋㅋ', '自己买好吃的']]), hx: same([['不行不行！！', '心意我收到了！！']]),
    jw: same([['不用啦…', '你留着吧']]), ty: same([['我不要ㅋㅋ', '你给自己买零食']]), jy: same([['……不用', '……谢谢']])
  });
  add('callMyName', '喊一下我的名字|喊我(?:的)?名字|叫我一声|叫一声我|叫我的名字|叫一下我的名字', {
    yq: same([['……{name}']]), sx: same([['{name}ㅋㅋ', '满意了吗']]), hx: same([['{name}！！', '{name}！！']]),
    jw: same([['{name}…', 'ㅋㅋ好害羞']]), ty: same([['{name}ㅋㅋ', '好听']]), jy: same([['……{name}']])
  });
  add('nickname', '取(?:个)?绰号|起(?:个)?外号|可以叫你|叫你.{1,6}可以吗', {
    yq: same([['……随便']]), sx: same([['叫哥就行ㅋㅋ', '……或者世界第一帅哥']]), hx: same([['好啊！！', '叫什么！！']]),
    jw: same([['好呀ㅋㅋ', '别太奇怪就行']]), ty: same([['可以ㅋㅋ', '我喜欢']]), jy: same([['……可以', '……别告诉哥们']])
  });
  add('whereMe', '^我在(?:便利店|便利商店|cu|gs25|外面|家|宿舍|公司|路上|超市|学校)', {
    yq: same([['……早点回来']]), sx: same([['买点吃的回来ㅋㅋ']]), hx: same([['给我带个冰淇淋！！']]),
    jw: same([['那我等你ㅋㅋ']]), ty: same([['我也要！ㅋㅋ', '香蕉牛奶']]), jy: same([['……路上小心']])
  });
  add('height', '身高|多高|几公分|一米几', {
    yq: same([['……不告诉你']]), sx: same([['179！', '宿舍最高之一ㅋㅋ']]), hx: same([['177！！']]),
    jw: same([['……别问这个ㅋㅋ']]), ty: same([['179ㅋㅋ', '和硕珍哥一样']]), jy: same([['……还在长', '以后会比哥们都高']])
  });
  add('sixSeven', '^6\\s*7$|^67$|six ?seven', {
    yq: same([['？']]), sx: same([['？']]), hx: same([['？']]), jw: same([['？']]), ty: same([['？']]), jy: same([['？']])
  });
  extend('futureSong', 'winter ?bear|dimple|\\bsea\\b|swim|arirang|hooligan|super ?tuna|billboard');
  extend('futureGroup', 'gucci|\\bmp3\\b');
  extend('cookReq', '大酱汤|部队锅|煎蛋|拌饭|吐司|金枪鱼|鲔鱼');
  extend('howAbout', '对(?:我|金泰亨|田柾国|泰亨|柾国|智旻|号锡|硕珍|玧其)(?:有)?什么想法|对我的看法|你对我');
  extend('yeontan', 'yeontan|金碳');
  extend('timeTravel', '穿越过来|从未来来的|从未来过来|来自26年|来自未来');

  const G = window.STORY.group; if (!G) return;
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('futureSongG', 'fire|i need you|dimple|\\bsea\\b|swim|arirang|hooligan');
  extendG('quit', '不要当队长|不当队长');
  extendG('what', '^蛤[?？]*$|发什么问号|干嘛问号');
  extendG('silentG', '说话啊|你们说|人都不见了|都出来');
  extendG('food', '便当|煮点东西');
  G.topics.unshift(
    { key: 'hurtG', re: '扭到|烫伤|受伤了|头好痛|头痛|感冒了', prefer: ['sx', 'jw', 'hx'] },
    { key: 'sixSevenG', re: '^6\\s*7$|^67$|six ?seven', prefer: ['jy', 'ty', 'yq'] }
  );
  const lines = {
    yq: { hurtG: [['……药在柜子里']], sixSevenG: [['？']] },
    sx: { hurtG: [['哪里？', '哥去拿药', '别乱动']] , sixSevenG: [['？']] },
    hx: { hurtG: [['没事吧！！', '我去拿冰袋！！']], sixSevenG: [['？？']] },
    jw: { hurtG: [['{哥}没事吧…', '我去买药']], sixSevenG: [['？']] },
    ty: { hurtG: [['疼吗', '我给你吹吹ㅋㅋ']], sixSevenG: [['6…7？']] },
    jy: { hurtG: [['……我去拿药']], sixSevenG: [['……？']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
