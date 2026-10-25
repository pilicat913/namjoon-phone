/* 第十二批里好笑的话，单独补的回复（2026-10-25）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };

  add('planet', '行星|照亮你', {
    yq: same([['……？', '你今天吃错什么了']]), sx: same([['ㅋㅋㅋㅋㅋ', '这句哥要偷来用']]), hx: same([['ㅋㅋㅋㅋㅋㅋ什么啊！！', '好肉麻！！']]),
    jw: same([['……{哥}', '你在哪学的这种话ㅋㅋ']]), ty: same([['那我是卫星ㅋㅋ', '绕着你转']]), jy: same([['……', '{哥}你没事吧ㅋㅋ']])
  });
  add('eatPig', '食量|吃得像猪|像猪一样|像猪的', {
    yq: same([['……我吃得不多']]), sx: same([['哥这叫正常食量', '是你们吃太少ㅋㅋ']]), hx: same([['我吃得很少啊！！']]),
    jw: same([['我最近吃很少了…']]), ty: same([['ㅋㅋㅋ我还能吃一碗']]), jy: same([['……在长身体', '不算']])
  });
  add('futureGroup', 'aespa|twice|newjeans|le ?sserafim|blackpink|riize|tws|\\bive\\b', {
    yq: same([['……那是谁']]), sx: same([['那是什么？', '新组合吗']]), hx: same([['是谁！！', '跳舞厉害吗']]),
    jw: same([['那是…谁呀']]), ty: same([['好酷的名字', '是谁ㅋㅋ']]), jy: same([['……？', '没听过']])
  });
  add('jntm', '鸡你太美|只因你', {
    yq: same([['？']]), sx: same([['？']]), hx: same([['？']]), jw: same([['？']]), ty: same([['？']]), jy: same([['？']])
  });
  add('abs', '腹肌', {
    yq: same([['……没有']]), sx: same([['哥有宽肩就够了ㅋㅋ']]), hx: same([['我还在练！！']]),
    jw: same([['ㅋㅋㅋ还在练', '出道前要练出来']]), ty: same([['我也想要ㅋㅋ', '可是我想吃炸鸡']]), jy: same([['……我有', '一点点']])
  });
  add('chooseQ', '你选谁|选谁|选我还是', {
    yq: same([['……不选']]), sx: same([['当然选哥自己ㅋㅋ']]), hx: same([['都选！！', '不能只选一个！！']]),
    jw: same([['……为什么要选', '我们都要']]), ty: same([['我选炸鸡ㅋㅋ']]), jy: same([['……不知道', '{哥}别问这个']])
  });
  add('whatRelation', '(?<!没)什么关系', {
    yq: same([['……室友']]), sx: same([['什么什么关系ㅋㅋ', '都是哥的弟弟']]), hx: same([['我们是家人！！']]),
    jw: same([['同岁的朋友啊ㅋㅋ']]), ty: same([['柾国？', '我的小弟ㅋㅋ']]), jy: same([['……就是哥', '没别的']])
  });
  add('namjoonGF', '南俊的女友|南俊的女朋友|南俊女友|南俊女朋友|我是他女友', {
    yq: same([['……？', '他没说过']]), sx: same([['南俊有女朋友？', '哥怎么不知道']]), hx: same([['什么？？', '南俊什么时候！！']]),
    jw: same([['啊…', '那…你好？ㅋㅋ']]), ty: same([['南俊{哥}有女朋友？！', '我要告诉大家ㅋㅋ']]), jy: same([['……真的吗']])
  });
  add('otherTime', '这个时空|不同时空|另一个时空|平行世界|来自未来', {
    yq: same([['……那你回去吧', '……开玩笑的']]), sx: same([['那你那边哥长什么样', '还是这么帅吧ㅋㅋ']]), hx: same([['真的吗！！', '那你那边我们怎么样了！！']]),
    jw: same([['……真的？', '那你别走太快']]), ty: same([['好酷', '能带我去吗ㅋㅋ']]), jy: same([['……不信', '……那以后的我长高了吗']])
  });
  add('faceDoubt', '(?:靠|我的|这张)脸.{0,8}(?:不太|不会|不行|不够|变不成)', {
    yq: same([['……脸没问题']]), sx: same([['南俊啊…', '你有酒窝啊ㅋㅋ']]), hx: same([['南俊的脸很好看！！', '还有酒窝！！']]),
    jw: same([['{哥}的脸很好看啊', '真的']]), ty: same([['{哥}很帅啊ㅋㅋ', '眼睛很有魅力']]), jy: same([['……{哥}很帅', '真的']])
  });
  add('byFace', '靠美貌|靠脸|靠我的脸|靠这张脸|美貌营业', {
    yq: same([['……行吧']]), sx: same([['那当然ㅋㅋ', '这张脸能撑很久'], ['世界明星靠的就是这张脸ㅋㅋ']]), hx: same([['硕珍哥的脸可以！！']]),
    jw: same([['ㅋㅋㅋ那我靠什么']]), ty: same([['我也靠脸ㅋㅋ']]), jy: same([['……不行', '还要练']])
  });
  add('danceBad', '大猩猩|像猩猩|跳舞很丑|跳得很丑|跳舞好丑', {
    yq: same([['……我也是']]), sx: same([['那哥是什么ㅋㅋ', '哥跳舞像稻草人']]), hx: same([['不是大猩猩！！', '明天早上来练习室 我教你']]),
    jw: same([['ㅋㅋㅋ没有那么差', '多练就好了']]), ty: same([['大猩猩也很帅ㅋㅋ']]), jy: same([['……ㅋㅋ', '多练']])
  });
  add('suspicious', '수상해|我很可疑|我可疑', {
    yq: same([['……我知道']]), sx: same([['你自己说的ㅋㅋ']]), hx: same([['你自己都承认了ㅋㅋ']]),
    jw: same([['ㅋㅋㅋ是有点']]), ty: same([['可疑ㅋㅋ', '我要告诉硕珍哥']]), jy: same([['……嗯', '很可疑']])
  });
  add('revealed', '露馅', {
    yq: same([['……早就露了']]), sx: same([['你以为藏得很好吗ㅋㅋ']]), hx: same([['ㅋㅋㅋㅋ我早就觉得怪怪的']]),
    jw: same([['……果然', '那你到底是谁']]), ty: same([['我就知道ㅋㅋ']]), jy: same([['……我早就知道了']])
  });

  const G = window.STORY.group; if (!G) return;
  G.topics.unshift(
    { key: 'taeName', re: '代哼|泰哼|金代', prefer: ['ty'] },
    { key: 'allReply', re: '同时回|一起回|都回我|6个.{0,6}回|六个.{0,6}回', prefer: ['hx', 'ty', 'jy'] },
    { key: 'phoneHostage', re: '别想要这部手机|手机不还|不还你手机|不还手机|手机在我这', prefer: ['sx', 'yq', 'hx'] },
    { key: 'escape', re: '逃亡|私奔|跑路', prefer: ['ty', 'hx', 'jw'] },
    { key: 'drunkG', re: '喝醉|送她回家|送他回家', prefer: ['sx', 'yq', 'jw'] },
    { key: 'datingG', re: '你们交往|在交往|交往了吗|(?<!没)什么关系', prefer: ['jw', 'ty', 'jy'] },
    { key: 'whoSleptG', re: '跟南俊哥睡|和南俊哥睡|跟南俊睡|和南俊睡', prefer: ['jw', 'jy', 'ty'] },
    { key: 'dreamG', re: '梦里见', prefer: ['ty', 'jw', 'sx'] },
    { key: 'jumbleG', re: '永防远弹|防远永弹', prefer: ['hx', 'sx', 'ty'] },
    { key: 'liarG', re: 'liar|骗子|骗人', prefer: ['jy', 'ty', 'hx'] }
  );
  const lines = {
    yq: { taeName: [['……ㅋ']], allReply: [['……']], phoneHostage: [['……还来']], escape: [['……我不去']], drunkG: [['……谁喝醉了']], datingG: [['……没有']], whoSleptG: [['……别提']], dreamG: [['……睡吧']], jumbleG: [['……打错了']], liarG: [['……谁骗你了']] },
    sx: { taeName: [['金代哼ㅋㅋㅋㅋ', '以后就这么叫了']], allReply: [['这不是都回了嘛ㅋㅋ']], phoneHostage: [['南俊', '你在威胁谁ㅋㅋ']], escape: [['逃去哪', '哥要带上电饭锅']], drunkG: [['谁喝醉了？', '我去接']], datingG: [['谁和谁？ㅋㅋ', '哥怎么不知道']], whoSleptG: [['ㅋㅋㅋ那是以前', '现在床够了']], dreamG: [['梦里也要见？', '你们够了ㅋㅋ']], jumbleG: [['南俊打字怎么了ㅋㅋ']], liarG: [['哥从不骗人ㅋㅋ']] },
    hx: { taeName: [['ㅋㅋㅋㅋㅋㅋ代哼！！']], allReply: [['来了来了！！', '大家都在！！']], phoneHostage: [['我们要手机！！']], escape: [['逃亡！！', '我去收拾行李ㅋㅋ']], drunkG: [['谁喝醉了！！', '送谁回家？']], datingG: [['ㅋㅋㅋㅋ谁？？']], whoSleptG: [['ㅋㅋㅋㅋ智旻！！']], dreamG: [['我也要在梦里见！！']], jumbleG: [['永防远弹！！', '好像也挺好听ㅋㅋ']], liarG: [['我没骗人！！']] },
    jw: { taeName: [['代哼ㅋㅋㅋ', '泰亨你看']], allReply: [['我在呢ㅋㅋ']], phoneHostage: [['……那哥怎么办']], escape: [['去哪？', '我也要去ㅋㅋ']], drunkG: [['我送吧', '……她是谁？']], datingG: [['没有啊ㅋㅋ', '我们是朋友']], whoSleptG: [['……那时候没床了嘛', '哥别说了ㅋㅋ']], dreamG: [['我不要在梦里见泰亨ㅋㅋ']], jumbleG: [['ㅋㅋㅋ什么呀']], liarG: [['不是我…']] },
    ty: { taeName: [['……谁是金代哼', '是金泰亨！！']], allReply: [['我先回！ㅋㅋ']], phoneHostage: [['那我们去抢回来ㅋㅋ']], escape: [['我先跑ㅋㅋ', '柾国跟上']], drunkG: [['我没喝！']], datingG: [['我和柾国？', 'ㅋㅋㅋ没有啦']], whoSleptG: [['我也跟南俊哥睡过ㅋㅋ']], dreamG: [['梦里见ㅋㅋ', '谁不来谁是小狗']], jumbleG: [['我看了三遍ㅋㅋ']], liarG: [['我没有！', '……有一点点ㅋㅋ']] },
    jy: { taeName: [['……ㅋㅋㅋ代哼哥']], allReply: [['……在']], phoneHostage: [['……那就不要了', '开玩笑的']], escape: [['……去哪', '要带炸鸡吗']], drunkG: [['……我还不能喝']], datingG: [['……没有', '泰亨哥别乱说']], whoSleptG: [['……我没有']], dreamG: [['……我不去']], jumbleG: [['……？']], liarG: [['……不是我', '是泰亨哥']] }
  };
  for (const [id, more] of Object.entries(lines)) if (G.lead[id]) Object.assign(G.lead[id], more);
})();
