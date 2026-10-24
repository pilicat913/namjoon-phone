/* 第二十轮：骂人的底线、“谁先走谁是小猪”不点名。 */
(function () {
  const S = window.STORY, M = S.moreTopics || {};
  // 真骂人的词都归到 harsh（“笨蛋 / 小傻子”这类亲昵的仍在 insult）
  if (M.harsh) M.harsh.re = '大便|傻逼|煞笔|滚|封锁|拉黑|皮痒|臭小子|臭柾国|去死|讨厌死|吃屎|种猪|畜生|畜牲|废物|垃圾|白痴|脑残|贱|鸡歪|妈的|操你|你妈';
  S.harshBoundary = {
    yq: ['……行', '你今天心情不好的话', '我先不回了'],
    sx: ['……这样说话哥会难过的', '你今天心情不好的话', '我们明天再聊'],
    hx: ['……我有点难过', '你今天心情不好的话', '我先不打扰了'],
    jw: ['……{哥}这样说我会难过的', '心情不好的话', '我先不打扰了'],
    ty: ['……我不想听这个', '你心情不好的话', '我们明天再说'],
    jy: ['……我先不回了', '{哥}早点休息']
  };
  const G = S.group; if (!G) return;
  // “先离开的人是小猪”：大家抢着说自己不走，不点名谁
  const piggy = {
    yq: [['……那我是小猪', '我睡了']], sx: [['那哥不走ㅋㅋ'], ['哥最后一个走']], hx: [['我不走！！ㅋㅋㅋㅋ']],
    jw: [['ㅋㅋ那我也不走']], ty: [['我最后一个走ㅋㅋ']], jy: [['……那我也不走']]
  };
  // 三种“小猪”：谁先走谁是小猪（piggyLeave）/ 点名某人是小猪（piggyMe 本人回，piggyOthers 旁人起哄）/ 只说小猪（piggy）
  const piggyAny = {
    yq: [['……谁是小猪']], sx: [['ㅋㅋ谁是小猪'], ['反正不是哥']], hx: [['小猪！！ㅋㅋㅋㅋ', '谁呀']],
    jw: [['ㅋㅋ谁是小猪呀']], ty: [['ㅋㅋㅋㅋ谁']], jy: [['……不是我ㅋㅋ']]
  };
  const piggyMe = {
    yq: [['……你才是']], sx: [['哥这么帅', '怎么会是猪ㅋㅋ']], hx: [['我不是猪！！', '我是松鼠！！']],
    jw: [['ㅋㅋ我才不是', '我在减肥呢']], ty: [['我不是小猪！ㅋㅋ', '我是小熊']], jy: [['……我才不是猪', '……就吃得多一点ㅋㅋ']]
  };
  const piggyOthers = {
    yq: [['ㅋ']], sx: [['ㅋㅋㅋㅋ']], hx: [['ㅋㅋㅋㅋㅋㅋ']], jw: [['ㅋㅋ好可爱']], ty: [['ㅋㅋㅋㅋ同意']], jy: [['ㅋㅋ']]
  };
  for (const id of Object.keys(piggy)) if (G.lead[id]) Object.assign(G.lead[id], { piggyLeave: piggy[id], piggy: piggyAny[id], piggyMe: piggyMe[id], piggyOthers: piggyOthers[id] });
  // 群里问粉丝叫什么 / 告诉他们叫阿米
  G.topics.unshift(
    { key: 'fanNameG', re: '粉丝(?:名)?(?:要)?叫什么|粉丝名|粉丝怎么叫', prefer: ['sx', 'hx', 'jw'] },
    { key: 'armyG', re: '粉丝(?:就)?叫(?:阿米|army)|叫(?:阿米|army)|阿米是|army是', prefer: ['hx', 'ty', 'jw'] }
  );
  const fanLines = {
    yq: { fanNameG: [['……还没定']], armyG: [['……army', '还行'], ['……记住了']] },
    sx: { fanNameG: [['还没定呢', '你觉得叫什么好？'], ['南俊你有想法吗ㅋㅋ']], armyG: [['阿米？', '好听！哥记住了ㅋㅋ'], ['阿米ㅋㅋ', '就这个吧']] },
    hx: { fanNameG: [['还没想好！！', '要好听的'], ['大家一起想！！']], armyG: [['阿米！！', '好好听！！'], ['阿米阿米！！ㅋㅋ', '我已经喜欢上了']] },
    jw: { fanNameG: [['还没定呢…'], ['想要个好听的ㅋㅋ']], armyG: [['阿米…', '好好听'], ['ㅋㅋ阿米', '好可爱']] },
    ty: { fanNameG: [['还没定！', '我想叫他们宝贝ㅋㅋ']], armyG: [['阿米！', '我喜欢ㅋㅋ'], ['那以后我们就是防弹和阿米了']] },
    jy: { fanNameG: [['……还没定']], armyG: [['……阿米', '好听'], ['……记住了ㅋㅋ']] }
  };
  for (const [id, more] of Object.entries(fanLines)) if (G.lead[id]) Object.assign(G.lead[id], more);
  G.topics.unshift({ key: 'together', re: '会有粉丝|会有人喜欢|有粉丝吗|会不会有粉丝', prefer: ['hx', 'jw', 'sx'] });
  G.topics.unshift({ key: 'piggyLeave', re: '先(?:离开|走|睡|下线)的?(?:人)?是(?:小)?猪|谁先.{0,4}谁是(?:小)?猪', prefer: ['sx', 'hx', 'ty'] });
  const hg = G.topics.find((t) => t.key === 'harshG'); if (hg) hg.re = '废物|鸡歪|垃圾|种猪|滚出来|出来道歉|别打扰|傻逼|滚|去死|畜生|畜牲|白痴';
})();
