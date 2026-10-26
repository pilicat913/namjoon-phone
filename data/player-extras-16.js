/* 根据玩家分享的聊天补的语库（第十六批，截至 2026-10-26 11:10:05 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };

  // 修正：单独一个“嗯”是答应，不是反问；“怎么了”是在关心人，另外回
  if (M.huhP) M.huhP.re = '^(?:啊|蛤|欸|诶|啥|什么|哪个|哪句|哪首|哪里|你说|然后呢|说话|回答我?|嗯什么)[?？!！~啦]*$';
  add('whatsWrong', '^(?:怎么了|怎么啦|咋了|咋啦|怎么了嘛|怎么了吗|干嘛啊?|蛤怎么了)[?？!！呀啊]*$', {
    yq: same([['……没事']]), sx: same([['没事啊ㅋㅋ', '就是无聊']]), hx: same([['没事！！', '就想找你聊天ㅋㅋ']]),
    jw: same([['没什么…', '就是有点累']]), ty: same([['没事ㅋㅋ', '叫叫你']]), jy: same([['……没事']])
  });
  add('quitP', '退出bts|退出防弹|退团|想退出|要不放弃|我要放弃|不想干了|不想做了', {
    yq: same([['……说什么胡话'], ['……先睡一觉', '明天再说']]), sx: same([['南俊', '你累了吧', '哥陪你出去走走']]),
    hx: same([['不行！！', '我们七个说好的！！']]), jw: same([['……不要', '{哥}不在我们怎么办']]),
    ty: same([['不准ㅋㅋ', '……真的不准']]), jy: same([['……不要', '{哥}别走']])
  });
  add('wwh', 'world ?wide ?handsome|^wwh$', {
    yq: same([['……？']]), sx: same([['world wide handsome？', '好名字 哥收下了ㅋㅋ']]), hx: same([['ㅋㅋㅋㅋ硕珍哥会喜欢的']]),
    jw: same([['ㅋㅋ这是在说硕珍哥吗']]), ty: same([['好酷ㅋㅋ']]), jy: same([['……硕珍哥？']])
  });
  add('fishing', '钓鱼', {
    yq: same([['……我不去']]), sx: same([['钓鱼？', '哥没钓过', '好像挺好玩ㅋㅋ']]), hx: same([['我怕虫！！']]),
    jw: same([['钓鱼…', '坐很久吧']]), ty: same([['我想去海边钓ㅋㅋ']]), jy: same([['……我想去']])
  });
  add('partTime', '外送|兼职|打工', {
    yq: same([['……已经不做了', '别担心']]), sx: same([['现在没时间打工了ㅋㅋ']]), hx: same([['现在只练习！！']]),
    jw: same([['没有啦', '一直在练习']]), ty: same([['我没打工ㅋㅋ']]), jy: same([['……我还小']])
  });
  add('chinese', '会说中文|会讲中文|说中文|会中文', {
    yq: same([['……不会']]), sx: same([['你好ㅋㅋ', '只会这个']]), hx: same([['你好！！谢谢！！', 'ㅋㅋㅋ就会这两个']]),
    jw: same([['不会…', '想学']]), ty: same([['你好ㅋㅋ', '我爱你ㅋㅋ']]), jy: same([['……不会']])
  });
  add('dateQ', '今天(?:是)?几(?:月几)?号|几月几号|明天是什么日子|今天是什么日子', {
    yq: same([['……看手机']]), sx: same([['你手机上不是有吗ㅋㅋ']]), hx: same([['我也忘了！！', '每天都在练习室ㅋㅋ']]),
    jw: same([['嗯…我看看']]), ty: same([['不知道ㅋㅋ', '练傻了']]), jy: same([['……看日历']])
  });
  extend('yeontan', '喜欢狗|养宠物|博美|宠物');
  extend('futureGroup', '\\bbam\\b|trampoline|txt|seventeen');
  extend('cookReq', '海带汤|炸年糕');
  extend('hobby', '兴趣|专长|擅长');
  extend('money', '借我');
  extend('eatPig', '太能吃|真能吃|吃这么多|三人份');

  const G = window.STORY.group; if (!G) return;
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('food', '咖啡|薯条|海带汤');
  extendG('together', '维持多久|八十岁|一百岁|一直是我们|一直都是7个人|一直都是七个人');
  G.topics.unshift(
    { key: 'lostThing', re: '我的(?:墨镜|太阳眼镜|外套|护手霜|耳机|衣服|书)|谁的外套|有人看到我', prefer: ['sx', 'jw', 'jy'] },
    { key: 'byeG', re: '^(?:再见|掰掰|拜拜|bye)|再见了各位', prefer: ['hx', 'ty', 'sx'] },
    { key: 'goWorkG', re: '出发|电视台|电台|放送台', prefer: ['sx', 'hx', 'jy'] },
    { key: 'yeontanG', re: '碳尼|炭尼|博美|养狗|狗狗', prefer: ['ty', 'jy', 'hx'] }
  );
  const lines = {
    yq: { lostThing: [['……没看见']], byeG: [['……嗯']], goWorkG: [['……好了']], yeontanG: [['……狗？']] },
    sx: { lostThing: [['沙发上那件是不是', '自己去看ㅋㅋ']], byeG: [['去哪？', '早点回来']], goWorkG: [['好了好了', '谁还没穿鞋']], yeontanG: [['宿舍不能养吧ㅋㅋ']] },
    hx: { lostThing: [['我帮你找！！']], byeG: [['拜拜！！', '早点回来！！']], goWorkG: [['好了！！', '出发出发！！']], yeontanG: [['狗狗！！好可爱！！']] },
    jw: { lostThing: [['好像在门口…', '我去看看']], byeG: [['去哪呀…']], goWorkG: [['等我一下！', '马上好']], yeontanG: [['好想养…']] },
    ty: { lostThing: [['……我好像穿了ㅋㅋ']], byeG: [['拜拜ㅋㅋ', '记得回来']], goWorkG: [['我好了！ㅋㅋ']], yeontanG: [['我以后一定要养！！', '博美最可爱ㅋㅋ']] },
    jy: { lostThing: [['……不是我拿的']], byeG: [['……去哪']], goWorkG: [['……好了']], yeontanG: [['……我也想养']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
