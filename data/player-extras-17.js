/* 根据玩家分享的聊天补的语库（第十七批，截至 2026-10-27 06:31:39 UTC）。格式同 player-extras.js。 */
(function () {
  const M = window.STORY.moreTopics = window.STORY.moreTopics || {};
  const same = (rounds) => ({ before: rounds, after: rounds.map((r) => r.map((x) => x.replace(/\{哥\}/g, ''))) });
  const add = (key, re, lines) => { M[key] = { re, lines }; };
  const extend = (k, more) => { if (M[k]) M[k].re += '|' + more; };

  add('chatWithMe', '^(?:跟|和|陪)我聊天|^聊天[吗吧嘛]?$|^来聊天|想(?:跟|和)你聊天|可以一直跟你聊天', {
    yq: same([['……聊什么']]), sx: same([['好啊', '哥正好闲着ㅋㅋ']]), hx: same([['好！！', '聊什么！！']]),
    jw: same([['好呀', '{哥}想聊什么']]), ty: same([['好！ㅋㅋ', '我先说', '今天练习室的空调坏了']]), jy: same([['……好', '{哥}先说']])
  });
  add('praiseShort', '^(?:很棒|好棒|真棒|超棒|很好|很完美|你们很棒|你们好努力|你很棒)[!！~啊呀ㅋ]*$', {
    yq: same([['……嗯']]), sx: same([['那当然ㅋㅋ']]), hx: same([['谢谢！！', 'ㅋㅋㅋ突然夸我']]),
    jw: same([['……谢谢ㅋㅋ']]), ty: same([['嘿嘿ㅋㅋ']]), jy: same([['……谢谢']])
  });
  add('goSeeYou', '去看你|看你(?:们)?(?:的)?(?:表演|演唱会)|第一排|台下看', {
    yq: same([['……来吧', '别挤']]), sx: same([['来！', '哥会往你那边看ㅋㅋ']]), hx: same([['一定要来！！', '我会挥手的！！']]),
    jw: same([['真的吗…', '那我更要好好跳了']]), ty: same([['来！ㅋㅋ', '我找你']]), jy: same([['……来吧', '我会认真唱']])
  });
  add('missHome', '想回家|想妈妈|妈妈.{0,4}没回', {
    yq: same([['……我也是']]), sx: same([['哥也想', '这周末打个电话吧']]), hx: same([['想光州了…', '我们一起熬过去']]),
    jw: same([['我也想釜山…']]), ty: same([['我也想大邱ㅋㅋ', '想奶奶']]), jy: same([['……我也想', '……不说了']])
  });
  extend('yeontan', '煤炭|연탄|连炭');
  extend('harsh', '智障');
  extend('nervous', '紧不紧张|紧张的嘛');
  extend('scared', '超紧张|非常紧张|我更紧张|还是紧张');

  const G = window.STORY.group; if (!G) return;
  const extendG = (k, more) => { const t = G.topics.find((x) => x.key === k); if (t) t.re += '|' + more; };
  extendG('quit', '解散');
  extendG('harshG', '智障');
  extendG('fanG', '^army$|第一批粉丝');
  extendG('yeontanG', '煤炭');
})();
