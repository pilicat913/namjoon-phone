const {readFileSync}=require('node:fs');
const vm=require('node:vm'),assert=require('node:assert/strict');
const window={STORY:{}};
vm.runInNewContext(readFileSync('dist/data/interactions.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/chat-extras.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/name-replies.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/reader-extras.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/pay-extras.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/followups.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/group.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-2.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-3.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-4.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-5.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-6.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-7.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-8.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-9.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-10.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-11.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-12.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/player-extras-13.js','utf8'),{window});
vm.runInNewContext(readFileSync('dist/data/polish.js','utf8'),{window});
{const c={};c.globalThis=c;vm.createContext(c);vm.runInContext(readFileSync('dist/vendor/opencc/t2cn.js','utf8'),c);const cv=c.OpenCC.Converter({from:'twp',to:'cn'});window.ZH={toSimp:s=>cv(String(s))};}
vm.runInNewContext(readFileSync('dist/js/interaction-engine.js','utf8'),{window});
let db={};const storage={get:(k,d)=>JSON.parse(JSON.stringify(db[k]??d)),set:(k,v)=>db[k]=JSON.parse(JSON.stringify(v))};
const create=()=>window.PhoneInteractionEngine.create(window.STORY.interactions,storage);
let e=create();
assert.equal(e.respond('yq','在吗').identity,'unknown');
assert.equal(e.respond('yq','在干嘛').identity,'unknown');
assert.equal(e.respond('yq','我不是南俊').identity,'known');
assert.equal(e.getState('sx').identity,'unknown');
e=create();assert.equal(e.getState('yq').identity,'known');
assert.equal(e.respond('sx','我不是粉丝').identity,'unknown');
assert.equal(e.respond('sx','我是BTS的粉丝').identity,'known');
assert.equal(e.respond('hx','嗯').identity,'unknown');
assert.equal(e.getState('hx').turns,0);
assert.ok(e.respond('hx','这是完全不相关的一段测试文本').messages.length);
assert.equal(e.respond('jw','我很紧张').topic,'selfNervous');
assert.equal(e.respond('jw','你紧张吗').topic,'nervous');
assert.equal(e.respond('ty','怎么不接电话').messages[0],'我这边没看见来电');
for(const id of Object.keys(window.STORY.interactions.members)){
  e.respond(id,'我不是南俊');
  for(const kind of ['voice','video']){
    for(let i=0;i<3;i++){
      const r=e.callReply(id,kind);assert.ok(r.messages.length);assert.ok(!r.messages.some(x=>/南俊|哥/.test(x)),id+': '+r.messages);
    }
    assert.equal(e.callReply(id,kind).messages.length,0);
  }
}
for(const id of ['mom','mgr','pd']){
  assert.ok(e.callReply(id,'video').messages.length);
  assert.equal(e.respond(id,'在吗').messages.length,0);
  assert.equal(e.callReply(id,'voice').messages.length,0);
}
// 三个非成员：文字消息一律不回（先发文字也不影响之后打电话那一句）
db={};e=create();
for(const id of ['mom','mgr','pd']){
  assert.equal(e.respond(id,'hi').messages.length,0);
  assert.ok(e.callReply(id,'voice').messages.length);
  assert.equal(e.respond(id,'在吗').messages.length,0);
}
// 转账留言：看懂意思就不再问“要买什么”
db={};e=create();
for(const id of Object.keys(window.STORY.interactions.members)){
  const r=e.payReply(id,'transfer',null,{amount:1000,note:'买个水'}).messages.join('/');
  assert.ok(r.includes('水')&&!/买什么|什么意思|干嘛|这是什么/.test(r),id+': '+r);
  const r2=e.payReply(id,'transfer',null,{amount:1000,note:'买杯咖啡'}).messages.join('/');
  assert.ok(r2.includes('咖啡')&&!r2.includes('又是'),id+': '+r2);
  for(const n of ['吃点好吃的','谢谢你','对不起','生日快乐','加油','零花钱']){
    const m=e.payReply(id,'transfer',null,{amount:3000,note:n}).messages;
    assert.ok(m.length&&!m.some(x=>/\{|买什么/.test(x)),id+' '+n+': '+m);
  }
  const big=e.payReply(id,'transfer',null,{amount:300000,note:'买个水'}).messages.join('/');
  assert.ok(big.includes('买水'),id+': '+big);
}
for(const it of window.STORY.readerExtras.giftItems)for(const id of Object.keys(window.STORY.interactions.members))
  assert.ok(window.STORY.payExtras.gifts[id].items[it.id]?.length,id+' 缺礼物 '+it.id);
console.log('转账留言 / 新礼物 / 非成员不回文字 检查通过');
db={};e=create();e.respond('ty','我是粉丝');
assert.notEqual(e.respond('ty','我叫你别打了').topic,'name');
assert.equal(e.respond('ty','我叫小猫').name,'小猫');
assert.equal(e.respond('jy','你们以后会怎样').topic,'future');
assert.equal(e.getState('jy').identity,'unknown');
for(const id of Object.keys(window.STORY.interactions.members)){
  db={};e=create();
  for(const input of ['宝宝','欧巴','吃了嘛']){
    const r=e.respond(id,input);assert.ok(r.messages.length,input);assert.equal(r.identity,'unknown',input);
  }
  // 晚安、睡了没这类普通的话不会突然问；说了不像南俊的话（夸人）才问，而且先回一句再问
  assert.equal(e.respond(id,'睡了没有').identity,'unknown');
  const fourth=e.respond(id,'你好可爱');
  assert.equal(fourth.identity,'suspect');assert.equal(fourth.messages.at(-2),'等等');assert.ok(fourth.messages.length>=3);
  assert.equal(fourth.messages.at(-1),`你不是南俊${['jw','ty','jy'].includes(id)?'哥':''}吧？`);
  assert.equal(e.getState(id).readerMessages,5);
  // 被问“你不是南俊吧？”时回“你怎么知道”= 承认，并先解释怎么看出来的
  const explanation=e.respond(id,'你怎么知道');assert.ok(explanation.messages[0].includes('不会这么叫'));assert.equal(explanation.identity,'known');
  // 另起一局：回“我是南俊”= 对方信了，回到“以为是南俊”
  db={};e=create();for(const input of ['宝宝','欧巴','吃了嘛','你好可爱'])e.respond(id,input);
  assert.equal(e.getState(id).identity,'suspect');
  assert.equal(e.respond(id,'我是南俊').identity,'unknown');
  const fallback=e.respond(id,'橘子飞过四十七个玻璃房间');
  assert.equal(fallback.topic,'unmatched');assert.ok(fallback.messages.length);
  assert.equal(e.respond(id,'不是').identity,'unknown'); // 没被问的时候，单说“不是”不算承认
  assert.equal(e.respond(id,'我不是南俊').identity,'known');
  for(const input of ['我叫小猫','爱你','想你了','抱抱','谢谢','对不起','骗你的','真的假的','为什么','不知道','你生气了吗','等我一下','我在写作业','我想休息','好无聊','推荐一首歌','你在哪','下雨了','这句话没有任何匹配']){
    const r=e.respond(id,input);assert.ok(r.messages.length,`${id}: ${input}`);assert.equal(r.identity,'known');
    assert.ok(!r.messages.some(x=>/南俊|是哥吗/.test(x)),r.messages.join('/'));
    assert.ok(!r.messages.some(x=>/\n/.test(x)));
  }
  const state=e.getState(id);e=create();assert.equal(e.getState(id).identity,state.identity);
}
db={};e=create();
assert.equal(e.respondBatch('jy',['宝宝','喂','在不在']).topic,'petName');
assert.equal(e.getState('jy').identity,'unknown');assert.equal(e.getState('jy').readerMessages,3);
// 起疑分两步：先有一句小怀疑，之后至少隔两句才直接问
assert.ok(e.getState('jy').hinted);
assert.equal(e.respond('jy','吃了吗').identity,'unknown');
assert.equal(e.respond('jy','睡了没').identity,'unknown');
assert.equal(e.respond('jy','你好可爱').identity,'suspect');
assert.equal(e.respond('jy','我是南俊').identity,'unknown');
db={conversationState:{jy:{identity:'suspect',pendingIdentity:true,turns:3,used:{}}}};e=create();
assert.equal(e.respond('jy','不是').identity,'suspect'); // 旧存档里含糊的待答问题不直接当承认
db={};e=create();
assert.equal(e.respondBatch('sx',['喂','吃了吗','嗯','晚安']).identity,'unknown'); // 普通聊天不会第 4 句就起疑
const hint=e.respond('sx','在干嘛');assert.equal(hint.identity,'unknown');assert.ok(e.getState('sx').hinted);
assert.equal(e.respond('sx','睡了没').identity,'unknown');
assert.equal(e.respond('sx','真的吗').identity,'unknown');
assert.equal(e.respond('sx','你好帅').identity,'suspect');
assert.equal(e.getState('yq').readerMessages,undefined);
e=create();assert.equal(e.getState('sx').readerMessages,8);
assert.ok(!e.respond('sx','在吗').messages.some(x=>x.includes('不是南俊')));
db={};e=create();assert.equal(e.respond('yq','我不是南俊').identity,'known');
for(let i=0;i<5;i++)assert.equal(e.respond('yq','在吗').identity,'known');
console.log('互动匹配、独立身份、刷新恢复、通话次数及固定回复检查通过');
for(const [target,aliases] of Object.entries(window.STORY.nameReplies.aliases)){
 for(const alias of aliases){
  assert.equal(window.PhoneInteractionEngine.calledMember(alias),target,alias);
  assert.equal(window.PhoneInteractionEngine.calledMember(alias+'哥在吗'),target,alias);
 }
}
for(const [id,member] of Object.entries(window.STORY.interactions.members)){
 db={};e=create();
 const own=window.STORY.nameReplies.aliases[id][0];
 const wrong=window.STORY.nameReplies.aliases[id==='yq'?'jy':'yq'][0];
 assert.equal(e.respond(id,own).topic,'calledSelf');
 assert.equal(e.respond(id,wrong).topic,'calledOther');
 assert.equal(e.getState(id).identity,'unknown');
 e.respond(id,'嗯');assert.equal(e.respond(id,own).topic,'calledSelf');
 e.respond(id,'我不是南俊');
 const lines=[];
 for(let i=0;i<4;i++){
  const response=e.respond(id,own);assert.equal(response.topic,'calledSelf');
  assert.ok(!response.messages.some(x=>x.includes('哥')));lines.push(response.messages.join('/'));
 }
 assert.equal(new Set(lines).size,4);
 e=create();assert.equal(e.getState(id).nameCallRounds['own:after'],4);
 for(let i=0;i<4;i++)assert.ok(!e.respond(id,wrong).messages.some(x=>/哥|南俊/.test(x)));
}
assert.equal(window.PhoneInteractionEngine.calledMember('你认识闵玧其吗'),null);
assert.equal(window.PhoneInteractionEngine.calledMember('我在听SUGA的歌'),null);
assert.equal(window.PhoneInteractionEngine.calledMember('金硕珍今天吃什么'),null);
assert.equal(window.PhoneInteractionEngine.calledMember('Vitamins'),null);
console.log('成员别名、叫错人、回复轮换、身份称呼及非喊人句检查通过');

// 身份确认后会问名字，告诉名字后按性格打招呼，并在之后的招呼里用上名字。
for(const id of Object.keys(window.STORY.interactions.members)){
 for(const path of ['我是粉丝','我不是南俊','我捡到了这部手机']){
  db={};e=create();
  const r=e.respond(id,path);assert.equal(r.identity,'known');
  assert.ok(r.messages.some(x=>/叫什么|怎么叫你|怎么称呼|名字/.test(x)),id+' '+path+': '+r.messages.join('/'));
  assert.ok(e.getState(id).pendingName);
  const g=e.respond(id,'小雪');assert.equal(g.name,'小雪');assert.equal(g.topic,'name');
  assert.ok(g.messages.some(x=>x.includes('小雪')),g.messages.join('/'));
  assert.ok(!g.messages.some(x=>/\{name\}/.test(x)));
 }
 db={};e=create();e.respond(id,'我是粉丝');
 assert.equal(e.respond(id,'不告诉你').topic,'name');assert.equal(e.getState(id).name,'');
 assert.equal(e.respond(id,'我叫什么').topic,'name');assert.ok(e.getState(id).pendingName);
 assert.equal(e.respond(id,'阿月').name,'阿月');
 assert.ok(e.respond(id,'你还记得我叫什么吗').messages.some(x=>x.includes('阿月')));
 assert.ok(e.respond(id,'在吗').messages.some(x=>x.includes('阿月')));
 assert.ok(e.respond(id,'晚安').messages.some(x=>x.includes('阿月')));
 // 转账和礼物：知道身份前后台词不同，并且一定有结果。
 db={};e=create();
 const before=e.payReply(id,'transfer');assert.ok(before.messages.length);assert.ok(['accepted','returned'].includes(before.outcome));
 e.respond(id,'我不是南俊');
 const after=e.payReply(id,'transfer');assert.equal(after.outcome,'returned');assert.notDeepEqual(after.messages,before.messages);
 for(const item of window.STORY.readerExtras.giftItems){const r=e.payReply(id,'gift',item.id);assert.ok(r.messages.length);assert.equal(r.outcome,'accepted');}
}
console.log('问名字、按性格打招呼、记住名字、转账与礼物回复检查通过');

const toSuspect=(id)=>{for(const m of ['在吗','吃了吗','在干嘛','睡了没','真的吗','哈哈哈','我也是','你好可爱','你好帅']){if(e.respond(id,m).identity==='suspect')return true;}return false;};
for(const id of Object.keys(window.STORY.interactions.members)){
 for(const answer of ['不是','对','不是啊']){
  db={};e=create();
  assert.ok(toSuspect(id),id);
  const r=e.respond(id,answer);assert.equal(r.identity,'known',id+answer);assert.ok(e.getState(id).pendingName);
 }
 db={};e=create();assert.ok(toSuspect(id));
 assert.equal(e.respond(id,'是').identity,'unknown'); // 答“是”= 对方信了
}
console.log('“你不是南俊吧？”的是／不是回答检查通过');

// 接话：成员问了问题，读者回短句时接着他自己的话说
db={};e=create();
e.respond('jw','在干嘛');assert.equal(e.getState('jw').awaiting,'哥还在上面吗');
let f=e.respond('jw','在呢');assert.equal(f.topic,'followup');assert.ok(f.messages.some(x=>x.includes('上去找哥')),f.messages.join('/'));
db={};e=create();e.respond('jw','在干嘛');f=e.respond('jw','不在');assert.ok(f.messages.some(x=>x.includes('在哪')),f.messages.join('/'));
db={};e=create();e.respond('yq','吃了吗');f=e.respond('yq','没吃');assert.ok(f.messages.some(x=>/冰箱|泡面/.test(x)),f.messages.join('/'));
db={};e=create();e.respond('yq','吃了吗');f=e.respond('yq','吃了');assert.equal(f.messages[0],'那行');
// 回了别的话题时不会被接话抢走
db={};e=create();e.respond('jw','在干嘛');assert.equal(e.respond('jw','你紧张吗').topic,'nervous');
// 通用短句轮换
db={};e=create();const acks=new Set();for(let i=0;i<6;i++)acks.add(e.respond('hx',['好的','嗯嗯','行','知道了','在呢','ok'][i]).messages.join('/'));assert.ok(acks.size>=5,[...acks].join(' | '));
// 转账按金额分档、留言会被接住；礼物回礼
db={};e=create();
const tiny=e.payReply('yq','transfer',null,{amount:1000});assert.ok(tiny.messages.join('').includes('一千'));
const huge=e.payReply('sx','transfer',null,{amount:500000,note:'买炸鸡'});assert.ok(huge.messages.some(x=>x.includes('买炸鸡')));assert.equal(huge.outcome,'returned');
assert.ok(e.payReply('jy','gift','banana').messages.join('/').includes('香蕉牛奶'));
assert.ok(e.payReply('jy','gift','banana').giftBack);
assert.ok(e.payReply('jy','gift','banana').messages.length);
console.log('接话、通用短句、两步起疑、金额分档与回礼检查通过');
// 截图里的那段对话：问“哪里不一样了”能接上；“我不是”能确认身份；夸可爱能接住
db={};e=create();
e.respond('ty','在干嘛');e.respond('ty','宝宝');
assert.ok(e.respond('ty','哪里不一样了').messages.some(x=>x.includes('不会这么叫')));
assert.equal(e.respond('ty','老公').identity,'suspect');
assert.equal(e.respond('ty','我不是').identity,'known');
e.respond('ty','我叫霹雳小猫');
assert.ok(e.respond('ty','没有啦 你很可爱').messages.some(x=>x.includes('可爱')));
console.log('“哪里不一样了”、“我不是”、夸人接话检查通过');

// 被问“你不是南俊吧？”后的各种回答
for(const id of Object.keys(window.STORY.interactions.members)){
 for(const [ans,want] of [['不是','known'],['不','known'],['我不是','known'],['我不是金南俊','known'],['我不是南俊','known'],['你怎么知道','known'],['我是啊','unknown'],['我是','unknown'],['是','unknown'],['我是南俊啊','unknown'],['我是金南俊','unknown']]){
  db={};e=create();assert.ok(toSuspect(id));
  assert.equal(e.respond(id,ans).identity,want,id+' '+ans);
 }
}
console.log('“你不是南俊吧？”各种回答（承认 / 自称本人）检查通过');
// 第九轮：繁体输入、玩家数据补的话题、连叫名字
{
  db={};let e=create();
  e.respond('jw','在吗');
  assert.equal(e.respond('jw','被你發現了').identity,'known');
  db={};e=create();
  assert.equal(e.respond('ty','我是小貓').name,'小猫');
  assert.equal(e.respond('ty','我愛你').topic,'love');
  for(const [id,msg,topic] of [['yq','在寫歌嗎','songwriting'],['jy','你一會下樓嗎','downstairs'],['jw','弟弟','didi'],['hx','敷衍我','complain'],['hx','沒事趕快去睡覺','goSleep'],['sx','你是金碩珍嗎','askIsMember'],['hx','好明天早上要記得叫我啊哈哈哈','wakeMe'],['jy','不是在練舞嗎','practice'],['sx','是我們照顧哥吧ㅋㅋㅋ','takeCare'],['hx','我也不敢相信','dream'],['jw','不會拖大家後腿的','worry'],['yq','打電話吧','callAsk']]){
    const r=e.respond(id,msg);assert.ok(r.topic===topic||r.topic==='identity',id+' '+msg+' → '+r.topic);assert.ok(r.messages.length&&!r.messages.some(x=>x.includes('{')),msg);
  }
  db={};e=create();const seen=new Set();
  for(let i=0;i<6;i++){const r=e.respond('jw','朴智旻');assert.equal(r.topic,'calledSelf');seen.add(r.messages.join('/'));}
  assert.ok(seen.size>=4,'连叫名字要换着回');
  assert.equal(e.getState('jw').identity,'unknown');
  // 不会把“我是认真的 / 我是粉丝”当名字
  db={};e=create();assert.notEqual(e.respond('sx','我是认真的').topic,'name');
  console.log('繁体输入 / 玩家数据补的话题 / 连叫名字 检查通过');
}

