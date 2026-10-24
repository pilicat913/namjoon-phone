/* 本地关键词与上下文匹配。所有台词均为同人预写内容，不调用模型接口。 */
(function (root) {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
  function calledMember(raw){
    const text=normalize(raw).replace(/^(?:喂|诶|欸|哎|嘿)/,'');
    const tail=/^(?:哥|哥哥|欧巴|oppa|오빠|형|hyung)?(?:啊|呀|呐|呢|在吗|在嘛|在不在|人呢|出来)?$/;
    for(const [id,aliases] of Object.entries(root.STORY?.nameReplies?.aliases||{})){
      if(aliases.some(alias=>text.startsWith(normalize(alias))&&tail.test(text.slice(normalize(alias).length))))return id;
    }
    return null;
  }
  const shortReply = /^(?:嗯+|恩+|哦+|噢+|好+(?:的|呀|啊|哦|嘞|吧)?|行(?:吧|啊)?|知道(?:了|啦)|收到(?:了|啦)?|哈哈+|呵呵+|嘿嘿+|ㅋㅋ+|ㅎㅎ+|ok+|okay|yes|嗯嗯|在呢|在的|在啊|在|在这|我在|这样啊|原来如此|原来是这样|懂了|明白了?|了解)$/;
  // 接话用的肯定 / 否定开头
  const YES = /^(?:嗯|恩|对|是|在|要|会|有|当然|没错|yes|弄完|完了|好了|回来了|到了|快了|马上|真的|确定)/;
  const NO = /^(?:不|没|还没|别|no|才不)/;
  // 每人第几句开始起疑（读者说了不像南俊的话会提前）
  const SUSPECT_AT = { yq: 6, sx: 7, hx: 6, jw: 7, ty: 6, jy: 7 };
  const acknowledgements = {
    yq:['嗯 看见了','你说'], sx:['ㅋㅋ看见了','你接着说啊'], hx:['ㅋㅋㅋㅋ','我在看呢'],
    jw:['ㅋㅋ嗯','我看着呢'], ty:['ㅋㅋㅋㅋ','嗯 你说啊'], jy:['ㅋㅋ','嗯 看见了']
  };
  const repeated = {
    hello:{yq:['在 别一直叫ㅋㅋ'],sx:['在呢 没走'],hx:['ㅋㅋ来了来了'],jw:['在的ㅋㅋ'],ty:['在啊ㅋㅋ'],jy:['看见了ㅋㅋ']},
    activity:{yq:['还是刚才那个','还没弄完'],sx:['还没换地方ㅋㅋ'],hx:['还在这儿ㅋㅋ'],jw:['还没结束呢'],ty:['还在听啊'],jy:['还在练那句ㅋㅋ']},
    food:{yq:['吃了 真吃了'],sx:['吃过了啊ㅋㅋ'],hx:['吃了吃了ㅋㅋ'],jw:['吃过了ㅋㅋ'],ty:['吃过啦'],jy:['吃了的ㅋㅋ']},
    sleep:{yq:['没睡','你不是也没睡'],sx:['还醒着呢ㅋㅋ'],hx:['被你问得更不困了ㅋㅋ'],jw:['还没呢ㅋㅋ'],ty:['现在还醒着'],jy:['刚准备放下手机ㅋㅋ']},
    call:{yq:['看见你打了','先发消息'],sx:['别急 真的腾不开手'],hx:['知道啦ㅋㅋ','等一下'],jw:['看到了ㅋㅋ','稍等一下'],ty:['看见了哥','等一下啊'],jy:['刚才看见了ㅋㅋ']},
    photo:{yq:['你说的是哪张'],sx:['我看看 是之前那张吗'],hx:['ㅋㅋ你还在看这张'],jw:['那张我也看了好几遍ㅋㅋ'],ty:['ㅋㅋ你也喜欢这张'],jy:['ㅋㅋ我自己也还在看']},
    nervous:{yq:['你一问我又开始想了'],sx:['ㅋㅋ先不说这个了'],hx:['ㅋㅋ你也开始反复想了'],jw:['嗯 我也是一直想'],ty:['ㅋㅋ你问得我又想起来了'],jy:['我现在一想就紧张ㅋㅋ']},
    cheer:{yq:['嗯 记着了'],sx:['ㅋㅋ谢谢啊'],hx:['收到！！'],jw:['谢谢ㅋㅋ'],ty:['嗯！！'],jy:['记住了ㅋㅋ']},
    compliment:{yq:['ㅋㅋ行了行了'],sx:['ㅋㅋ再夸我真信了'],hx:['ㅋㅋㅋㅋ知道啦'],jw:['你别一直说ㅋㅋ'],ty:['ㅋㅋ那我信了'],jy:['ㅋㅋ谢谢']},
    affection:{yq:['知道了ㅋㅋ'],sx:['ㅋㅋ谢谢你'],hx:['看见啦ㅋㅋ'],jw:['ㅋㅋ谢谢你'],ty:['ㅋㅋ我看见了'],jy:['ㅋㅋ谢谢']},
    tired:{yq:['嗯','你接着说'],sx:['听着呢','后来呢'],hx:['嗯 然后呢'],jw:['嗯 我在看'],ty:['嗯 然后呢'],jy:['嗯','你慢慢说']},
    bye:{yq:['晚安'],sx:['晚安ㅋㅋ'],hx:['晚安！！'],jw:['晚安ㅋㅋ'],ty:['晚安啊'],jy:['晚安']}
  };
  function create(data, storage) {
    const getAll = () => storage.get('conversationState', {});
    function person(id) {
      return { identity:'unknown',turns:0,calls:{voice:0,video:0},used:{},name:'',lastTopic:'',lastInput:'',pendingIdentity:false,pendingName:false,...getAll()[id] };
    }
    function save(id,p) { storage.set('conversationState',{...getAll(),[id]:p}); }
    const extras=root.STORY?.chatExtras||{};
    function result(id,p,messages,topic='') {
      let lines=messages.filter(Boolean);
      if(p.schema!==2){p.pendingIdentity=false;p.pendingName=false;p.identityQuestion='';p.schema=2;}
      // 起疑分两步：先说一句“你今天怎么怪怪的”，再过两句才直接问
      if(data.members[id]&&p.identity==='unknown'&&topic!=='call'&&topic!=='identity'){
        const n=(p.readerMessages||0)-(p.base||0),score=n+(p.odd||0)*2,at=SUSPECT_AT[id]||6;
        if(p.hinted&&score>=at&&n>=(p.hintAt||0)+2&&topic!=='followup'){
          p.identity='suspect';p.pendingIdentity=true;p.identityQuestion='notNamjoon';
          lines=['等等',`你不是南俊${['jw','ty','jy'].includes(id)?'哥':''}吧？`];topic='identity';
        } else if(!p.hinted&&score>=at-2&&n>=1&&!['unmatched','ack','followup','no','yes'].includes(topic)){
          p.hinted=true;p.hintAt=n;
          lines=[...lines,...(rotate(id,p,'hint',root.STORY?.payExtras?.hints?.[id])||['你今天怎么怪怪的'])];
        }
      }
      // 记下这次回复里最后一个能接话的问题，下一句短回答由它接住
      p.awaiting='';
      const hooks=root.STORY?.followups?.[id];
      if(hooks)for(let i=lines.length-1;i>=0;i--){if(hooks[lines[i]]){p.awaiting=lines[i];break;}}
      // Only the latest outgoing question may interpret a short yes/no answer.
      p.lastReply=lines;
      // 问过“你不是南俊吧？”之后，没答清楚之前一直记着这个问题
      if(topic!=='identity'&&topic!=='guess'&&topic!=='future'&&topic!=='petName'&&p.identity!=='suspect')p.pendingIdentity=false;
      if(!p.pendingIdentity)p.identityQuestion='';
      if(topic!=='name'&&topic!=='identity')p.pendingName=false;
      if(topic!=='identity')p.claimedSelf=false;
      p.lastTopic=topic;
      save(id,p);return {messages:lines,identity:p.identity,topic,name:p.name};
    }
    function extra(id,key){return [...(extras[id]?.[key]||['嗯？','你再说一下'])];}
    const RX=()=>root.STORY?.readerExtras||{};
    // Rotate through a member's pool so the same round is not repeated back to back.
    function rotate(id,p,key,pool) {
      if(!pool||!pool.length)return null;
      const k='rx:'+key,n=p.used?.[k]||0;p.used={...p.used,[k]:n+1};
      return [...pool[n%pool.length]];
    }
    const fillName=(lines,name)=>lines.map(x=>x.replaceAll('{name}',name||''));
    const asksName=x=>/叫什么|怎么叫你|怎么称呼|名字/.test(x);
    function known(id,p,event) {
      p.identity='known';p.pendingIdentity=false;
      let lines=event==='fan'?(rotate(id,p,'fan',RX().fan?.[id])||[...(data.members[id].identity.fan||[])]):(rotate(id,p,'admit',RX().admit?.[id])||extra(id,'identify'));
      if(!p.name){
        if(!lines.some(asksName))lines=[...lines,...(rotate(id,p,'ask',RX().ask?.[id])||['你叫什么'])];
        p.pendingName=true;
      }
      return lines;
    }
    function getTopic(raw,p,context={}) {
      const t=normalize(raw);
      if(/^(?:宝宝|宝贝|宝|亲爱的|老婆|老公|亲亲|欧巴|欧っぱ|오빠|oppa)(?:啊|呀|呢)?$/.test(t))return 'petName';
      if(/猜猜我是谁|你猜我是谁|猜我是谁|知道我是谁吗|认出我了吗/.test(t))return 'guess';
      if(/想你|想死你|好想见你/.test(t))return 'miss';
      if(/抱抱|抱一下|抱我/.test(t))return 'hug';
      if(/谢谢|谢啦|感谢|多谢/.test(t))return 'thanks';
      if(/对不起|抱歉|不好意思|sorry/.test(t))return 'sorry';
      if(/骗你的|逗你的|开玩笑|逗你玩|骗到你了|哈哈你信了/.test(t))return 'tease';
      if(/^(?:真的(?:吗|啊|呀)?|真的假的|真假|当真|真的吗|不会吧|你没骗我吧|是吗)$/.test(t))return 'really';
      if(/^(?:为什么|为啥|怎么了|咋了|怎么回事|什么意思|啥意思)(?:啊|呀|呢)?$/.test(t))return 'why';
      if(/^(?:不知道|不晓得|不知道说什么|不知道聊什么|没想好|想不起来)(?:啊|呀|呢)?$/.test(t))return 'dontKnow';
      if(/你(?:是不是|是|在)?生气|别生气|生气了吗/.test(t))return 'angry';
      if(/等我|等一下|等下|稍等|我去一下|一会回来|待会聊/.test(t))return 'wait';
      if(/写作业|在学习|要考试|复习|考试好难|上课|上学|我在工作|加班|下班了/.test(t))return 'study';
      if(/我(?:好|很|太|有点)?困|我(?:要|想)休息|头好痛|头疼|不舒服|生病了/.test(t))return 'rest';
      if(/好无聊|无聊死了|陪我聊|陪陪我|没人陪|一个人好孤单|好孤独/.test(t))return 'lonely';
      if(/听什么歌|推荐.*歌|推荐.*音乐|我在听歌|喜欢什么歌|最近听什么/.test(t))return 'music';
      if(/你(?:现在)?在哪|你在哪里|回宿舍了吗|还在公司吗/.test(t))return 'where';
      if(/天气|下雨|好冷|好热|下雪|出太阳/.test(t))return 'weather';
      if(/^(?:我)?(?:不是|不是啊|不是呀|不是哦|不对|才不是|没有|没有啊|没有啦|没|no)$/.test(t))return 'no';
      if(/^(?:是|是呀|是啊|是的|对|对啊|对呀|没错|当然|嗯是的|yes)$/.test(t))return 'yes';
      if(/^(?:哈哈+|嘿嘿+|嘻嘻+|ㅋㅋ+|ㅎㅎ+|笑死|笑死我了)$/.test(t))return 'laugh';
      if(/怎么(?:不接|挂|没接)|为什么(?:不接|挂|没接)|干嘛(?:不接|挂)|接(?:我)?(?:的)?(?:电话|视频)|别挂|又挂|挂我|不接电话/.test(t))return 'call';
      if(/^(?:我(?:真的|很|好|特别|有点|太|最近)?(?:累|难过|不开心|心情不好|烦|不舒服|压力大)|今天(?:好累|不开心|很累|心情不好))/.test(t))return 'tired';
      if(/晚安|拜拜|再见|明天见|我(?:先)?(?:走了|睡了|去睡|要睡|下了)|下次聊/.test(t))return 'bye';
      if(/(?:我|我们)(?:已经|刚|刚刚)?(?:吃过了|吃了|吃饱了|睡醒了)|我不(?:困|饿)|我还没吃/.test(t))return 'self';
      if(/我(?:有点|好|很|太)?饿(?:了|啊|呀)?$/.test(t))return 'selfHungry';
      if(/(?:我|我们)(?:好|很|有点|特别|太)?(?:紧张|害怕|担心)/.test(t))return 'selfNervous';
      if(/(?:照片|自拍|相片|头像|这张|那张|拍得|拍的|拍照|帽子|小狗|猫咪)/.test(t))return 'photo';
      if(/(?:我|我们)(?:真的|很|好|特别|非常|超)?(?:喜欢|爱)(?:你们|你)(?:啊|呀|哦|呢|的声音|的歌)?$|^爱你(?:们)?$/.test(t))return 'affection';
      if(/帅|可爱|好看|漂亮|声音好听|唱得好|唱歌好听|跳得好|你(?:真|好|很|太|超)?(?:棒|厉害|温柔|有趣|好玩|聪明)/.test(t))return 'compliment';
      if(/加油|会成功|相信你|支持你|最棒|一定可以|好好做|祝你/.test(t))return 'cheer';
      if(/你(?:们)?(?:会|很|也|有点)?紧张|紧张(?:吗|不)|出道|准备好|明天(?:要)?(?:上台|表演)|怕不怕/.test(t))return 'nervous';
      if(/睡了[吗嘛没]|睡了没有|没睡|还醒|困不困|你(?:现在|也|很|不)?困|失眠|睡不着/.test(t))return 'sleep';
      if(/吃了[吗嘛没]|吃了没有|吃饭|吃什么|饿不饿|你(?:也|不|很)?饿|吃没/.test(t))return 'food';
      if(/干[嘛吗啥]|干什么|做什么|在忙|忙不忙|忙吗|练什么|录什么/.test(t))return 'activity';
      if(/^(?:在吗|在不在|人呢|喂+|出来|出来聊聊|在不|在嘛|有人吗|回我|理理我|你好(?:呀|啊)?|您好|嗨|hi|hello|哥|哥哥|玧其|硕珍|号锡|智旻|泰亨|柾国|闵玧其|金硕珍|郑号锡|朴智旻|金泰亨|田柾国)(?:哥)?$/.test(t))return 'hello';
      if(/你是谁|叫什么名字|你叫什么/.test(t))return 'who';
      if(shortReply.test(t)||!t)return 'ack';
      if(p.lastTopic==='tired' && raw.length>3 && !/吗|什么|是不是|怎么|为什么/.test(raw))return 'followup';
      return '';
    }
    function followUp(id,question,raw,t,p) {
      const hook=root.STORY?.followups?.[id]?.[question]; if(!hook)return null;
      const asking=/(?:吗|嘛|么)$|\?|？|什么|哪|谁|怎么|为什么|为啥/.test(String(raw).trim()); // 读者在反问时，只认写明的追问词
      const topic=getTopic(raw,{...p,lastTopic:''});
      const bare=t.replace(/^(?:嗯+|恩+|哥|我)+/,'');
      const negative=NO.test(t)||NO.test(bare);
      const tokenHit=(tok)=>{
        if(tok==='Y')return !asking&&!negative&&(YES.test(t)||YES.test(bare));
        if(tok==='N')return !asking&&negative;
        return new RegExp('^(?:'+tok+')').test(t)||new RegExp('^(?:'+tok+')').test(bare);
      };
      for(const [pat,lines] of hook){
        if(pat==='*'){if(topic===''&&!asking)return [...lines];continue;}
        if(t.length>14)continue;
        if(pat.split('|').some(tokenHit))return [...lines];
      }
      return null;
    }
    function respond(id,raw,context={}) {
      const p=person(id),t=normalize(raw);
      if(p.schema!==2){p.schema=2;p.pendingIdentity=false;p.pendingName=false;p.identityQuestion='';}
      if(data.minors[id]) {
        if(p.fixedUsed)return result(id,p,[],'fixed');
        p.fixedUsed=true;return result(id,p,data.minors[id],'fixed');
      }
      const member=data.members[id];if(!member)return result(id,p,[]);
      p.readerMessages=Math.max((p.readerMessages||0)+(context.messageCount||1),context.totalMessages||0);
      // 不像南俊会说的话：叫宝宝/欧巴、用“您”、问对方几岁、是谁
      if(p.identity==='unknown'&&(/您|你几岁|你多大|多大了|你是谁|你叫什么|你们是谁/.test(t)||/^(?:宝宝|宝贝|宝|亲爱的|老婆|老公|亲亲|欧巴|오빠|oppa)/.test(t)))p.odd=(p.odd||0)+1;
      const awaiting=p.awaiting;p.awaiting='';
      const claimSelf=/^(?:我(?:就是|是|真是|真的是)(?:金)?南(?:俊|菌)(?:啊|呀|哥|本人)?|真的是我|就是我|是本人)$/.test(t);
      const deniedFan=/(?:不是|不算|并非)(?:你们的|你的|个)?(?:粉丝|army|阿米)/.test(t);
      const fan=!deniedFan && /(?:我是|我也是|其实我是|作为)(?:你们的|你的|个|一名|南俊的|防弹的|bts的)?(?:粉丝|army|阿米)|^你们的粉丝$/.test(t);
      const notSelf=/(?:我(?:其实|真的|确实|并)?不是(?:金)?南(?:俊|菌)|我不是(?:他|本人)|我不是南俊哥)|^(?:被发现了|被认出来了|露馅了|你发现了|你认出来了|不是他|不是本人)$/.test(t);
      const foundPhone=/(?:捡到|捡了|拿到)(?:了)?(?:这部|这个|他的|南俊的|一部)?手机|手机不是我的/.test(t) && !/(?:没|没有|不是我)(?:捡到|拿到)/.test(t);
      const asksNamjoon=/南(?:俊|菌)(?:哥)?(?:在哪|呢|去哪|回来了吗|什么时候回来|现在在哪)/.test(t);
      // 成员已经起疑（说过“你今天怎么怪怪的”）时，单说一句“我不是”也算承认
      const bareDeny=(p.hinted||p.identity==='suspect')&&/^(?:嗯|对|其实)?我(?:真的|确实)?不是(?:啊|呀|啦|哦)?$/.test(t);
      if(p.identity!=='known' && (fan||notSelf||foundPhone||asksNamjoon||bareDeny) && !claimSelf) {
        return result(id,p,known(id,p,fan?'fan':'admit'),'identity');
      }
      const yes=/^(?:对|是|是呀|是啊|是的|没错|嗯是的)$/.test(t),no=/^(?:嗯|对|当然|肯定|其实)?(?:我)?(?:不是|真不是|当然不是)(?:啊|呀|哦|啦|的|呢)?(?:他|本人)?$|^(?:不对|没有|对我不是|不是我)$/.test(t);
      /* 已经问过“你不是南俊吧？”：
       *   不是 / 不 / 我不是 / 我不是南俊 / 你怎么知道……  → 被发现了（承认不是本人）
       *   是 / 我是 / 我是啊 / 我是南俊 / 我是金南俊……   → 对方信了，当作还是南俊 */
      if(p.pendingIdentity&&p.identityQuestion==='notNamjoon'){
        const admit=/^(?:嗯|对|对啊|对呀|其实)?(?:不|不是|我不是|我真不是|我真的不是|当然不是|不是我|我不是(?:金)?南(?:俊|菌)(?:哥)?|对我不是|被发现了|被你发现了|被认出来了)(?:啊|呀|啦|哦|的|呢)?$|^(?:对|对啊|对呀|没错)$/.test(t);
        const howKnow=/怎么知道|怎么看出来|怎么发现|怎么认出|哪里看出来|咋知道|你知道了/.test(t);
        const claim=/^(?:是|是啊|是呀|是的|我是|我是啊|我是呀|当然是|就是我|是我|我就是|我是(?:金)?南(?:俊|菌)(?:啊|呀|哥|本人)?|我就是(?:金)?南(?:俊|菌)|是我啊)$/.test(t);
        if(admit||howKnow){
          const lines=known(id,p,'admit');
          if(howKnow)lines.unshift(p.petNameUsed?'他不会这么叫我ㅋㅋ':'ㅋㅋ感觉你说话跟他不太一样');
          return result(id,p,lines,'identity');
        }
        if(claim){
          // 信了：回到“以为是南俊”，起疑从现在重新算
          p.identity='unknown';p.pendingIdentity=false;p.identityQuestion='';p.hinted=false;p.odd=0;p.claimedSelf=false;p.base=p.readerMessages||0;
          return result(id,p,[...(member.identity.deny||['ㅋㅋ行','你接着说'])],'identity');
        }
      }
      if(p.pendingIdentity&&(claimSelf||yes||no)){
        // “你不是南俊吧？”——答“不是／对”= 我不是南俊；答“是”= 自称是本人。
        const claims=claimSelf||(p.identityQuestion==='isNamjoon'?yes:p.identityQuestion==='notNamjoon'?/^(?:是|是呀|是啊|是的)$/.test(t):false);
        if(claims){p.claimedSelf=true;p.pendingIdentity=false;return result(id,p,extra(id,'claim'),'identity');}
        if(p.identityQuestion==='who'&&yes)return result(id,p,['ㅋㅋ','那你倒是说呀'],'identity');
        if(p.identityQuestion==='who'&&no)return result(id,p,extra(id,'no'),'identity');
        return result(id,p,known(id,p,'admit'),'identity');
      }
      if(p.claimedSelf&&no){p.claimedSelf=false;p.identity='suspect';p.pendingIdentity=true;p.identityQuestion='who';return result(id,p,extra(id,'retract'),'identity');}
      if(claimSelf){p.claimedSelf=true;return result(id,p,extra(id,'claim'),'identity');}
      if(p.pendingIdentity && /你猜|不告诉你|保密/.test(t))return result(id,p,['ㅋㅋ','那你接着说'],'identity');
      if(p.identity==='suspect'&&/怎么知道|怎么看出来|怎么认出来|哪里看出来|如何知道/.test(t)){
        const reason=p.petNameUsed?'他不会这么叫我ㅋㅋ':'ㅋㅋ感觉你说话跟他不太一样';
        return result(id,p,[reason],'identity');
      }
      const called=calledMember(raw);
      if(called){
        const kind=called===id?'own':'wrong',mode=p.identity==='known'?'after':'before';
        const pool=root.STORY.nameReplies[kind][id][mode];
        const key=`${kind}:${mode}`,n=p.nameCallRounds?.[key]||0;
        p.nameCallRounds={...p.nameCallRounds,[key]:n+1};
        const names={me:'南俊',yq:'玧其',sx:'硕珍',hx:'号锡',jw:'智旻',ty:'泰亨',jy:'柾国'};
        const messages=pool[n%pool.length].map(line=>line.replaceAll('{name}',names[called]));
        return result(id,p,messages,kind==='own'?'calledSelf':'calledOther');
      }
      if(p.identity==='known'&&/^(?:我叫什么|我叫啥|我的名字(?:是什么|叫什么)?|你?(?:还)?记得我(?:的名字|叫什么)?(?:吗|嘛|不)?|你知道我叫什么(?:吗)?)$/.test(t)){
        if(p.name)return result(id,p,fillName(rotate(id,p,'recall',RX().recallName?.[id])||[p.name],p.name),'recall');
        p.pendingName=true;return result(id,p,rotate(id,p,'recallNo',RX().recallNoName?.[id])||['你还没说呢'],'name');
      }
      const nameMatch=!/^我叫你/.test(String(raw).trim()) && String(raw).trim().match(/^(?:我叫|你可以叫我|叫我|我是)([\p{L}\p{N}_\-]{1,12})(?:就行|吧|呀|啊)?[。！!～~]?$/u);
      const plainName=/^[\p{L}\p{N}_\-]{2,6}$/u.test(String(raw).trim()) && !getTopic(raw,p,context) && !/^(?:我|你|他|她|怎么|什么|为啥|以后|未来)|电话|视频|明天|出道/.test(t);
      if(p.identity!=='known' && nameMatch && /^(?:我叫|叫我|你可以叫我)/.test(String(raw).trim())) {
        const name=nameMatch[1].replace(/(?:就行|吧|呀|啊)$/,'');
        if(!/南俊|南菌|什么|^啥$/.test(name)){
          p.identity='known';p.pendingIdentity=false;p.name=name;p.pendingName=false;
          const first=(rotate(id,p,'admit',RX().admit?.[id])||[]).filter(x=>!asksName(x));
          return result(id,p,[...first.slice(0,2),...fillName(rotate(id,p,'greet',RX().greet?.[id])||['好 {name}'],name)],'name');
        }
      }
      if(p.identity==='known' && (p.pendingName || /^(?:我叫|叫我|你可以叫我)/.test(String(raw).trim())) && (nameMatch || plainName)) {
        const name=(nameMatch?nameMatch[1]:String(raw).trim()).replace(/(?:就行|吧|呀|啊)$/,'');
        if(!/叫你|在吗|干嘛|你好|你猜|哈哈|ㅋㅋ|不知道|不告诉|不接|不是|南俊|什么|^啥$|^好$|^嗯$|加油|晚安|喜欢|爱你/.test(name)) {
          p.name=name;p.pendingName=false;
          return result(id,p,fillName(rotate(id,p,'greet',RX().greet?.[id])||['好 {name}','我记住了'],name),'name');
        }
      }
      if(p.pendingName && /不告诉|保密|不想说|不说/.test(t)){p.pendingName=false;return result(id,p,rotate(id,p,'decline',RX().decline?.[id])||['好ㅋㅋ','那先不问了'],'name');}
      if(awaiting){ // 接着成员上一句的问题往下说
        const hookLines=followUp(id,awaiting,raw,t,p);
        if(hookLines){p.unmatchedCount=0;p.ackCount=0;return result(id,p,hookLines,'followup');}
      }
      const future=/你(?:们)?以后|你(?:们)?将来|未来|20(?:1[4-9]|[2-9]\d)年|格莱美|dynamite|butter/.test(t);
      if(future) {
        if(p.identity!=='known'){return result(id,p,['你说的是以后？','我现在还不知道呢'],'future');}
        return result(id,p,['你说的是以后？','我现在还不知道呢'],'future');
      }
      const topic=getTopic(raw,p,context);
      if(topic==='guess'){
        if(p.identity==='known')return result(id,p,p.name?[`ㅋㅋ你不是${p.name}吗`]:['ㅋㅋ刚才不是说不是南俊了吗','还让我猜'],'guess');
        return result(id,p,['ㅋㅋ','给点提示'],'guess');
      }
      if(topic==='petName'&&p.identity!=='known'){
        const repeated=!!p.petNameUsed;p.petNameUsed=true;
        return result(id,p,repeated?['ㅋㅋ还叫']:extra(id,'petName'),'petName');
      }
      if(topic==='no'||topic==='yes')return result(id,p,extra(id,topic),topic);
      if(topic==='affection')return result(id,p,extra(id,'affection'),topic);
      if(topic==='why'&&p.lastTopic==='activity')return result(id,p,['刚才那个还没弄完呢'],'why');
      if(topic==='why'&&p.lastTopic==='sleep')return result(id,p,['刚才一直看手机','还没睡着'],'why');
      if(p.identity==='known'&&p.name&&(topic==='hello'||topic==='bye')){
        const k='named:'+topic,n=p.used[k]||0;p.used={...p.used,[k]:n+1};
        if(n%2===0){
          const pool=RX()[topic==='hello'?'namedHello':'namedBye']?.[id];
          const lines=rotate(id,p,'named'+topic,pool);
          if(lines)return result(id,p,fillName(lines,p.name),topic);
        }
      }
      if(extras[id]?.[topic]){p.lastTopic=topic;p.lastInput=t;p.unmatchedCount=0;return result(id,p,extra(id,topic),topic);}
      if(topic==='ack') {
        const n=p.ackCount||0;p.ackCount=n+1;
        const pool=root.STORY?.payExtras?.acks?.[id]||acknowledgements[id];
        return result(id,p,[pool[n%pool.length]],'ack');
      }
      p.ackCount=0;
      if(!topic) {
        const n=p.unmatchedCount||0;p.unmatchedCount=n+1;
        // 没看懂的话：换着说，不总是同一句
        const pool=root.STORY?.payExtras?.unknown?.[id];
        if(n%2===0&&pool)return result(id,p,rotate(id,p,'unknown',pool),'unmatched');
        return result(id,p,extra(id,n%2?'clarify':'unknown'),'unmatched');
      }
      p.unmatchedCount=0;
      if(topic==='self')return result(id,p,['嗯ㅋㅋ'],'self');
      if(topic==='selfHungry')return result(id,p,['那先去吃点东西吧'],'selfHungry');
      if(topic==='selfNervous')return result(id,p,p.identity==='known'?['怎么了','你明天也有事？']:['ㅋㅋ我也是','你别一直想了'],'selfNervous');
      if(topic==='followup') {
        const n=p.followups||0;p.followups=n+1;
        return result(id,p,[acknowledgements[id][n%2]],'followup');
      }
      p.followups=0;
      p.turns++;
      if(topic==='who') {
        const names={yq:'玧其',sx:'硕珍',hx:'号锡',jw:'智旻',ty:'泰亨',jy:'柾国'};
        return result(id,p,[`我是${names[id]}啊`],topic);
      }
      if(topic==='call' && !p.lastCall) return result(id,p,['我这边没看见来电','你找我什么事？'],topic);
      const key=`${p.identity==='known'?'after':'before'}:${topic}`;
      const n=p.used[key]||0;p.used[key]=n+1;
      p.lastTopic=topic;p.lastInput=t;
      let lines=[];
      if(n===0)lines=[...(member.topics[topic]?.[p.identity==='known'?'after':'before']||[])];
      else if(n===1) {
        lines=[...(repeated[topic]?.[id]||[])];
        if(p.identity==='known')lines=lines.map(x=>x.replace(/哥/g,''));
      }
      // The fourth reader message prompts suspicion; confirmation stays explicit.
      if(!lines.length)lines=extra(id,'repeat');
      return result(id,p,lines,topic);
    }
    function callReply(id,kind) {
      const p=person(id);p.lastCall=kind;p.calls={...p.calls,[kind]:(p.calls?.[kind]||0)+1};
      if(data.minors[id]) {
        if(p.fixedUsed)return result(id,p,[],'call');
        p.fixedUsed=true;return result(id,p,data.minors[id],'call');
      }
      const row=data.members[id]?.calls?.[kind]?.[p.calls[kind]-1];
      return result(id,p,row?.[p.identity==='known'?'after':'before']||[],'call');
    }
    function respondBatch(id,inputs,context={}) {
      // Reply to a burst together, but count every actual reader message.
      const meaningful=inputs.filter(x=>!['ack','hello','laugh'].includes(getTopic(x,person(id),context)));
      const explicit=inputs.filter(x=>/我不是(?:金)?南俊|我是.*(?:粉丝|army|阿米)|我是(?:金)?南俊|捡到.*手机/.test(normalize(x)));
      const guess=inputs.find(x=>getTopic(x,person(id),context)==='guess');
      return respond(id,explicit.at(-1)||guess||meaningful.at(-1)||inputs.at(-1)||'',{...context,messageCount:inputs.length});
    }
    /* 虚拟转账与礼物券：只有六位成员会回；返回台词、结果（收下 / 退回）以及偶尔的回礼 */
    const tierOf=(amount)=>amount<5000?'tiny':amount<50000?'small':amount<200000?'big':'huge';
    function payReply(id,kind,itemId,opts={}) {
      const p=person(id),rx=RX(),px=root.STORY?.payExtras||{},mode=p.identity==='known'?'after':'before';
      if(!data.members[id])return {messages:[],outcome:'returned'};
      if(kind==='transfer'){
        const tier=tierOf(Number(opts.amount)||10000);
        const rounds=tier==='small'?rx.transfer?.[id]?.[mode]:px.transferTiers?.[id]?.[mode]?.[tier];
        if(!rounds||!rounds.length){save(id,p);return {messages:['？'],outcome:'returned'};}
        const k='pay:transfer:'+mode+(tier==='small'?'':':'+tier),n=p.used[k]||0;p.used={...p.used,[k]:n+1};
        const round=rounds[n%rounds.length];
        let lines=[...round.lines];
        const note=String(opts.note||'').trim();
        if(note){const tpl=rotate(id,p,'note',(px.noteLines?.[id]||[]).map(x=>[x]));if(tpl)lines.splice(1,0,tpl[0].replaceAll('{note}',note));}
        save(id,p);
        return {messages:lines,outcome:round.outcome};
      }
      const g=px.gifts?.[id]||{};
      const cKey='pay:gift:'+itemId,count=p.used[cKey]||0,total=p.used['pay:gift:total']||0;
      p.used={...p.used,[cKey]:count+1,'pay:gift:total':total+1};
      const variants=g.items?.[itemId]||[];
      let lines=count<variants.length?[...variants[count]]:(rotate(id,p,'giftAgain',g.again)||['谢谢ㅋㅋ']);
      if(mode==='before'&&!p.used['pay:gift:opener']&&g.opener){p.used={...p.used,'pay:gift:opener':1};lines=[...g.opener,...lines];}
      // 第 2 次、之后每隔 4 次，会回送一样东西
      let giftBack=null;
      if(g.back&&(total===1||(total>1&&(total-1)%4===0))){lines=[...lines,...g.back.lines];giftBack=g.back.item;}
      save(id,p);
      return {messages:lines,outcome:'accepted',giftBack};
    }
    return {respond,respondBatch,callReply,payReply,getState:person,hasContact:id=>!!(data.members[id]||data.minors[id]),isMember:id=>!!data.members[id]};
  }
  root.PhoneInteractionEngine={create,normalize,calledMember};
})(window);
