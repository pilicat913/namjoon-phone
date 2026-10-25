/* 根据玩家分享的聊天补的语库（第十四批，截至 2026-10-25 14:59:43 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };

  add('whatIsBTS', 'bts是什么|防弹是什么|你是什么团|你们是什么团|你是bts|团名是什么', {
    yq: same([['……防弹少年团']]), sx: same([['防弹少年团啊', '你怎么不知道ㅋㅋ']]), hx: same([['防弹少年团！！', '以后要记住哦ㅋㅋ']]),
    jw: same([['防弹少年团呀', '{哥}怎么了？']]), ty: same([['防弹少年团！', '名字是不是很酷ㅋㅋ']]), jy: same([['……防弹少年团', '还没出道']])
  });
  add('military', '退伍|入伍|当兵|服兵役|兵役|军队', {
    yq: same([['……还早'], ['……那是很久以后的事']]), sx: same([['当兵？', '哥是老大 要先去吗ㅋㅋ']]), hx: same([['当兵！！', '还很远吧']]),
    jw: same([['还很远吧…', '先出道']]), ty: same([['当兵好可怕ㅋㅋ']]), jy: same([['……我最后一个']])
  });
  add('howAbout', '你觉得(?:柾国|泰亨|智旻|号锡|硕珍|玧其|南俊)(?:儿|哥)?怎么样', {
    yq: same([['……还行'], ['……挺好']]), sx: same([['都挺好ㅋㅋ', '就是有点吵']]), hx: same([['很好啊！！', '我们的人都很好']]),
    jw: same([['很好呀', '怎么突然问ㅋㅋ']]), ty: same([['好！', '虽然有时候很烦ㅋㅋ']]), jy: same([['……很好', '{哥}问这个干嘛']])
  });
  add('howWith', '你和(?:柾国|泰亨|智旻|号锡|硕珍|玧其)(?:儿|哥)?(?:怎样|怎么样)了', {
    yq: same([['……没怎样']]), sx: same([['就那样ㅋㅋ']]), hx: same([['很好啊！！']]),
    jw: same([['和好了ㅋㅋ', '本来也没吵']]), ty: same([['还是那样ㅋㅋ']]), jy: same([['……没事了']])
  });
  add('howKnow', '为什么知道我不是|怎么知道我不是|怎么看出来|怎么发现的|不像南俊', {
    yq: same([['……说话不一样']]), sx: same([['南俊不会这么说话ㅋㅋ']]), hx: same([['感觉！！', '南俊不会发这么多表情ㅋㅋ']]),
    jw: same([['就是…感觉', '{哥}平时不这样']]), ty: same([['我直觉很准的ㅋㅋ']]), jy: same([['……语气不一样']])
  });
  add('school', '下课|上课|放学|作业|考试|学校', {
    yq: same([['……我没上课']]), sx: same([['哥今天没课ㅋㅋ']]), hx: same([['我早就毕业啦ㅋㅋ']]),
    jw: same([['刚下课', '现在去练习室']]), ty: same([['下课了！', '肚子好饿ㅋㅋ']]), jy: same([['……刚放学', '作业好多']])
  });
  add('englishP', '^(?:hi+|hello+|hey+|where ?are ?you|how ?are ?you|good ?morning|what)', {
    yq: same([['……说韩语']]), sx: same([['又说英语ㅋㅋ', '哥听得懂一点']]), hx: same([['hello！！ㅋㅋ', '南俊英语真好']]),
    jw: same([['……{哥}说什么ㅋㅋ']]), ty: same([['hi！！', '我只会这个ㅋㅋ']]), jy: same([['……hello']])
  });
  add('favSong', '最喜欢的歌|最喜欢哪首|喜欢什么歌|喜欢听什么|平时听什么', {
    yq: same([['……太多了', '不说']]), sx: same([['抒情歌', '哥唱给你听ㅋㅋ']]), hx: same([['能跳舞的都喜欢！！']]),
    jw: same([['嗯…', '最近一直在听R&B']]), ty: same([['爵士！', '很有感觉ㅋㅋ']]), jy: same([['……很多', '最近在听流行']])
  });
  add('admire', '榜样|白马王子|好善良|最爱的偶像|我的偶像|你是最好的', {
    yq: same([['……别这么说']]), sx: same([['那当然ㅋㅋ', '……谢谢']]), hx: same([['ㅋㅋㅋㅋ我吗！！', '好害羞']]),
    jw: same([['……谢谢', '我会更努力的']]), ty: same([['我吗？ㅋㅋ', '好开心']]), jy: same([['……谢谢']])
  });
  add('sureP', '^(?:一定|一定会的?|会的|当然会|当然啦?)[!！~～啊呀]*$', {
    yq: same([['……嗯']]), sx: same([['你这么肯定？ㅋㅋ']]), hx: same([['对吧！！']]),
    jw: same([['嗯…', '我也这么觉得']]), ty: same([['好！', '那我信了ㅋㅋ']]), jy: same([['……嗯']])
  });
  add('swapped', '调包|掉包|偷换', {
    yq: same([['……什么？']]), sx: same([['调包？？', '那真的南俊去哪了ㅋㅋ']]), hx: same([['什么！！', '快把南俊还回来！！']]),
    jw: same([['……{哥}别吓我']]), ty: same([['好酷ㅋㅋ', '那你是谁']]), jy: same([['……真的假的']])
  });
  extend('teachDance', '怎么练|踢背|no ?more ?dream的舞|动作怎么');
  extend('offerFood', '泡面');
  extend('gameConsole', '打电动|玩游戏|打游戏');
  extend('hair', '染发|染什么');
  extend('howAbout', '对你来说是怎样的存在|对你来说是什么');
  extend('englishP', '^(?:wake ?up|come|english ?please)');
  extend('love', 'love ?u$|loveyou');
  extend('futureGroup', 'chimmy|bt21|koya|tata|cooky|shooky|\\bmang\\b|\\brj\\b');
  extend('offerFood', '你吃吗|你吃不吃|吃不吃|叫外卖');
  extend('careBody', '不要再练|别再练|练到几点|减那么狠');
  extend('goOnTogether', '永远在|永远陪');

  const G = window.STORY.group; if (!G) return;
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('love', '想念');
  extendG('sleepNag', '早点休息|快点睡|练太晚|不睡觉吗');
  extendG('quit', '退群');
  extendG('dance', '🕺|💃');
  extendG('alcohol', '喝到天亮');
  extendG('crush', '认识了一个女孩|认识了一个女生');
  extendG('music', '主打|旋律');
  G.topics.unshift(
    { key: 'kidsG', re: '^孩子们', prefer: ['sx', 'hx', 'yq'] },
    { key: 'nothingG', re: '^没(?:什么|事)[啦了啊呀]*$', prefer: ['jw', 'hx', 'sx'] },
    { key: 'militaryG', re: '退伍|入伍|当兵|服兵役|兵役', prefer: ['sx', 'yq', 'jy'] },
    { key: 'bigbangG', re: 'big ?bang|bigbang|权志龙|g-?dragon', prefer: ['jy', 'ty', 'hx'] }
  );
  const lines = {
    yq: { kidsG: [['……我不是孩子']], nothingG: [['……那就别说']], militaryG: [['……还早']], bigbangG: [['……前辈']] },
    sx: { kidsG: [['在呢ㅋㅋ', '孩子们都在']], nothingG: [['没什么还叫我们ㅋㅋ']], militaryG: [['当兵？', '哥最大 先去的是我ㅋㅋ']], bigbangG: [['BIGBANG前辈！', '我们什么时候也能那样']] },
    hx: { kidsG: [['在！！']], nothingG: [['什么呀ㅋㅋ', '说一半']], militaryG: [['我们还没出道呢ㅋㅋ']], bigbangG: [['前辈们的舞台！！', '我都看了好多遍']] },
    jw: { kidsG: [['在的ㅋㅋ']], nothingG: [['嗯？', '好奇死了ㅋㅋ']], militaryG: [['退伍…', '那是好久以后吧']], bigbangG: [['好想上同一个舞台…']] },
    ty: { kidsG: [['我在！ㅋㅋ']], nothingG: [['那我也没什么ㅋㅋ']], militaryG: [['当兵好可怕ㅋㅋ']], bigbangG: [['好酷！！']] },
    jy: { kidsG: [['……在']], nothingG: [['……？']], militaryG: [['……我最后一个']], bigbangG: [['……我也想像前辈们一样']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
