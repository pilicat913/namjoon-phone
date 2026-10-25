# 南俊的手机：在现有网站上继续修改

这是当前已上线版本的完整静态网站源码，HTML、CSS、JavaScript、照片、头像和音效都在 dist 文件夹。请在这些文件上修改，不要重新搭一个不同框架的网站。

## 这是什么作品

中文的 BTS 出道前练习生时期“捡手机”同人互动网页，以金南俊的手机为视角，主要阅读 2010—2013 年出道前的群聊、私聊、照片等。氛围温馨、有趣、自然，偶尔感动。内容是依据公开经历进行的同人创作，聊天和部分日期为虚构编排。

手机密码：0613。

## 我希望你帮我改什么

重点检查自动回复为什么生硬、重复、答非所问，然后改善回复文案和匹配逻辑。

1. 不接 AI API，不需要后端，也不产生模型调用费用。使用预写回复、关键词和本地上下文来实现。
2. 一句话一个消息气泡。想连续说两句，就发成两条消息，不能在一个气泡里人为换行塞两句。
3. 语言像真人发消息，不要每句都讲完整、不要机械说教，也不要给所有成员同一套口气。
4. 同一类输入应有多个合适的回复版本，近期用过的别马上复读。要记住自己刚刚说过什么，不是无关联地随机抽一句。
5. 通用回复也尽量根据关键词和上一轮话题接住。比如“你怎么知道”如果接在身份被怀疑之后，应解释怎么看出来的，而不是回“我没看懂”。
6. 分清主语、否定和上下文。“我不是很饿”不等于“我不是南俊”；“吃药”不等于问吃饭；“不是”要看上句在问什么。
7. 既可以问他们吃没吃、在做什么，也可以分享自己的日常、撒娇、开玩笑、表达喜欢、问照片和出道前的紧张。尽量多准备自然的接话，而不只是独立问答。
8. 更丰富的预设可以先写给我看，再按我的反馈调整。不要凭空声称已经实现无限聊天。

之前出现的实际问题：

- 在玧其对话里先叫“宝宝”再叫“老公”，同一整组台词连续重复。
- 对方问过是不是南俊之后，我问“你怎么知道”，却进入不相关的兜底追问。
- 之前直接按关键词“不是”确认身份，导致对话跳跃。这个必须结合前一轮问题。
- 不能没识别到几句话就突然怀疑或确认身份。

## 已经确定的交互规则

- 六位成员各自累计用户发送的文字消息，通常在第 4 条消息后开始问“等等”“你不是南俊／南俊哥吧？”。连续快速发出的多条气泡合起来回复，但每条都计数。
- 明确说“我不是南俊”“我是粉丝”“捡到了手机”等，可以提前确认身份。
- 怀疑和确认不是同一个状态。用户可以否认、装作本人、改口、岔开话题。确认不是本人后应记住，不能刷新或重新打开就又叫“南俊哥”。
- 各成员状态互不相通，别自动拿别的房间的信息来推断用户。
- 在私聊里直接喊对方的名字、全名、小名、艺名、外号或中韩英文写法，对方会接话；如果直接喊别的成员的名字，则会提醒找错人。目前这两类每人各有 4 组回复轮换。
- 名字出现在完整句子里，例如“我在听 SUGA 的歌”，不能直接当成找错人。
- “欧巴／오빠／oppa”也能识别。
- 六位成员语音通话、视频通话各有 3 轮不同的拒接后消息。响约 2.5 秒后对方挂断，随后打开对应聊天的最新消息。用户自己提前取消，不消耗回复次数。
- 语音和视频只模拟通话，不获取真实相机或麦克风。
- 妈妈、经纪人、方 PD 每人只保留一条固定回复，文字、语音和视频共用一次。
- 第一次进入一个聊天，从最早消息读起；之后再进从最新消息开始。通话后直接定位新消息。
- 用户自己发消息不响提示音，对方发来才响。
- iPhone 键盘展开时输入栏要在键盘上方，不能盲打。当前版本已根据 visualViewport 调整可见高度和偏移，模拟缩高检查通过，还需注意真实 iOS WebView 行为。

当前代码有一个边界：第 4 条如果落在电话追问的 call 分支，身份问句可能顺延到下一条普通消息。请在解释或修改时以实际代码为准。

## 保留的内容与风格

- 沿用当前手机框架、中文界面、头像、照片、原帖跳转和已经确认的历史聊天。
- 主角是 BTS 七人，可以有妈妈、经纪人、方时赫，不加其他练习生，也不加妹妹支线。
- 早期推特照片用来引出群聊或私聊，不要把同一张群聊照片又逐个私发给南俊。
- 不新增需要我后期 AI 生图才能完成的情节；也不要自行加回已经删掉的袜子、垃圾袋、胶带等开头情节。
- 第四面墙方向曾讨论过，但后面那批“被我抓到了”等玩笑方案已经否决。不要擅自加惊悚、监视用户或悬疑设定。
- 设置里保留：
  根据公开经历进行同人创作，聊天及部分日期为虚构编排
  made by 霹雳小猫

## 从哪些文件开始读

- `dist/js/interaction-engine.js`：匹配规则、身份状态、次数与回复选择。
- `dist/data/interactions.js`：原有聊天话题、身份和通话回复数据。有的旧数据已被程序中的新分支覆盖，不能只看数据就认定都会发出。
- `dist/data/chat-extras.js`：新增情景回复和通用追问。大多数情景目前每人仍只有一组固定台词，这是重复的主要来源之一。
- `dist/data/name-replies.js`：成员别名、叫本人和叫错人的回复池。
- `dist/js/chat.js`：发送、连续消息合并、回复排队、通话、历史记录和提示音。
- `dist/js/app.js`：手机外壳与可见区域调整。
- `dist/css/phone.css`、`dist/css/chat.css`：手机和聊天布局。
- `dist/data/chats.js`：历史剧情聊天，内容很多，别在改回复时顺手重写。
- `聊天互动代码_合并阅读.txt`：把相关代码合到一个文本里，方便一次阅读。修改请落回原文件，而不是把这个文本当网页运行。

## 怎么运行和检查

这是纯静态网页，没有 npm 安装或构建步骤。将 dist 作为静态网站根目录预览即可。解锁密码是 0613。

如需本地服务器，可在 dist 目录运行 `python3 -m http.server 8000`，再打开 `http://localhost:8000`。

项目根目录可执行：

```text
node tests/interactions.cjs
node tests/viewport.cjs
```

保存身份、消息、计数等使用浏览器本地存储。请不要改存储命名导致旧进度直接丢失，除非先说明并征得我的同意。

## 请怎样交付

先说明你发现哪些具体问题、打算怎样改。请给完整修改后的相关文件或完整项目压缩包，保持路径结构。改完要检查各成员身份、连续消息、中文输入法、提示音和键盘布局，不要只给一句“已经优化”。

导出于 2026 年 10 月 24 日，源版本 12bdb6e244a8973221a60bef5f00e1dcfe43a64f。

## 2026-10-24 这一轮做了什么

- 外观：整体改为白色 iPhone 5 · iOS 6。状态栏 20pt、滑动来解锁、四格密码、图标 + 玻璃 Dock、拟物导航栏与条纹分组表格。电脑端是实体 Home 键，手机端是可拖动的 AssistiveTouch。图标在 `js/retro-icons.js`（原创 SVG），壁纸 `assets/wallpaper/drops.jpg`（程序生成）。
- 身份确认后会问名字：不论是答“不是”、说“我不是南俊”、自称粉丝还是说捡到手机，都会接一句问名字。告诉名字后每人按性格打招呼；之后“在吗”“晚安”会隔一次带上名字；问“我叫什么”会答出来。台词在 `data/reader-extras.js`。
- 修正：对“你不是南俊吧？”答“不是／对”，现在算作承认不是本人；答“是”才算自称南俊（之前是反的）。
- 聊天输入框左边的“+”：语音通话、视频通话、转账、礼物。转账和礼物只在六位成员的私聊里出现，妈妈、经纪人、方PD 只有通话。转账在知道身份前后台词不同（之前会以为是南俊转的），知道身份后一律退回；礼物券有每人一个“最喜欢”的特别反应。卡片状态（等待 → 已收款 / 已退还 / 已领取）会保存。
- 两个广告频道、备忘录 15 条、地图（图钉、气泡、步行路线、书签）、Safari（停在上次看的网页，书签里有历史记录）、天气应用。
- 存储键名没有改，旧进度不会丢。

## 2026-10-24 第二轮

- 外框去掉，电脑上只显示屏幕；每个应用最外层左上角有“主屏幕”返回键（颜色跟着各应用）。小白点去掉了，密码界面左下角是“取消”，下面有“提示：出道日”。
- 主屏幕只留有内容的应用；“设置”图标挂 1，设置里第一行“跳转时间”有红点，点开过就消失。
- 跳转时间（`data/debut.js` + `js/debut.js`）：跳到 6 月 13 日 23:02，六个人给南俊的私聊、宿舍群的庆祝，进度会保存。跳转时已经知道“手机不在南俊手里”的成员，会先加一句“这段是给南俊的”。
- 接话（`data/followups.js`）：成员带问句的台词配好了读者短回答（在呢 / 没有 / 吃了……）后的接话。
- 起疑改成两步：先一句“你今天怎么怪怪的”，至少隔两句才问“你不是南俊吧？”。普通聊天第 6～7 句左右，叫宝宝/欧巴、用“您”、问对方几岁/是谁会提前。
- 转账按金额分四档、会念出留言；礼物每人每样都有反应，第 2 次和之后每 4 次会回礼（点卡片领取）。台词在 `data/pay-extras.js`。
- 群聊（`data/group.js`）：@ 的人或按话题挑一个人先回，七成概率再有人开一个小闲聊；群里不做识破。“+”里有“@成员”。
- 已读“1”、发送键常驻、短信能发不回、地图拖动/双指/滚轮缩放并加了地点、天气 7 个城市、加载慢时显示提示页、照片转成 JPEG（体积约减半）。

## 2026-10-24 第三轮

- “哥们”统一改成“哥哥们”。出道日心里话不再区分是否已识破，所有人都看到同一版。
- 跳转后锁屏上的消息按时间一条一条弹出来（群里的快一点，私聊慢一点），锁屏改成 iOS 6 那样每条单独一行、最新在上；刷新页面会接着弹没弹完的。
- 宿舍群最后：泰亨问合照、号锡手机没电、柾国发出后台合照（`assets/early/debut-group.jpg`）并说“南俊哥 你点开看看”。点开这张照片约两秒后，照片暗下来依次浮现两段话（文字在 `data/debut.js` 的 ending），点一下屏幕可以跳到下一段。

## 2026-10-24 音乐

- 主屏幕加了“音乐”（`data/music.js`）。只有 Butterfly (demo) 已下载（`assets/music/butterfly.m4a` 与封面 `butterfly-cover.jpg` 均为作者提供），其余显示云朵、点了提示未下载：Epik High《Fly》（金南俊说过小学五年级听到这首开始接触嘻哈）、Eminem、Nas、San E《Rap Genius》（艺名来源相关）、2Pac。
- 播放器全局只有一个：切到其他应用继续放，锁屏上显示歌名和暂停键；放完一首自动停在开头，不循环。
- 单文件版不带音乐文件，点播放会提示只能在正式网页版播放。

## 2026-10-24 第四轮

- 网站名改为“金南俊的旧手机”，准备发布到 GitHub 仓库 pilicat913/namjoon-phone（GitHub Pages，网站文件在仓库根目录）。
- 备忘录只保留：明天、采访、买、单词、ㅇ、书、wifi、回家拿。
- 回复修正：小怀疑那句之后问“哪里不一样了”会接着解释；“我不是”能回答“你不是南俊吧？”，并且没答清楚之前一直记着这个问题；“你很可爱”等夸奖都能识别；看不懂时的回应每人 4 种轮换；问名字后的问句（“你是不是觉得我很奇怪”等）也能接话。
- 合照文字浮现加快；Butterfly 改为单曲循环。

## 2026-10-24 第五轮：“你不是南俊吧？”的回答

- 回 不是 / 不 / 我不是 / 我不是南俊 / 我不是金南俊 / 对 / 你怎么知道 …… → 被发现（“你怎么知道”会先说一句怎么看出来的）。
- 回 是 / 我是 / 我是啊 / 我是南俊（啊）/ 我是金南俊 …… → 对方信了，回到“以为是南俊”，起疑从这一句之后重新计算（还会再起疑）。

## 2026-10-24 第六轮：转账留言、礼物、三位非成员

- 转账留言会先判断意思（`interaction-engine.js` 的 `noteIntent`）：买东西（取出要买的东西，如“买个水”→水）/ 吃饭 / 谢谢 / 道歉 / 生日 / 加油 / 零花钱。看懂了且是小额（5万以下），就整段换成 `pay-extras.js` 里 `noteIntents` 的回复，不再问“要买什么”；金额大时在第一句后插一句 `noteBig`（如“买水的话 不用这么多的”）。看不懂的留言仍按原来的方式复述留言。同一样东西连续转两次才说“又是…”。
- 礼物券从 5 样增加到 12 样（能量饮料、辣炒年糕、运动袜、红豆刨冰、书店券、披萨、烤五花肉），六人各有反应；礼物页面“送出”按钮固定在底部。
- 妈妈 / 经纪人 / 方PD：文字消息一律不回，一直显示“1”；只有打电话没接时回一句（每人一次）。

## 2026-10-24 第七轮：重新开始

- 进度存在 sessionStorage（同一个浏览器标签页里刷新也不会清空）。设置第二组加了“重新开始”，确认后调用 `U.store.reset()`：删掉 `nj-phone-story-v10` 这一项、之后的写入全部忽略，然后刷新页面，回到 6 月 12 日锁屏。存储键名没有改。
- 礼物列表修正：`.ks-body` 里的内容不再被压扁，矮屏幕上可以滑到最后一个。

## 2026-10-24 第八轮（在别处完成，已合并）

- 锁屏密码第一位要按两次：`js/app.js` 数字键改为 `pointerdown` 立刻记录，随后的普通 `click` 忽略；`detail === 0` 的键盘 / 辅助功能点击仍然有效。已在模拟 iPhone 上验证点一次即记一位。
- 自愿分享语库（默认关闭）：`js/feedback.js`，在 `chat.js` 前加载。聊天输入框上方有“语库分享：关/开”和“本条不分享”。同意状态单独存在 sessionStorage 的 `namjoon-feedback-consent-v1`（“重新开始”不会清掉它）。只上传开启后新发的文字 + 角色名 + 游戏生成的回复；不补传历史。
- 后端：Cloudflare Worker `https://namjoon-feedback.1228088256.workers.dev/`，D1 数据库 `namjoon-feedback`（绑定名 `DB`），源码与建表 SQL 在 `feedback/`（仓库里是 `_dev/feedback/`）。允许来源 `https://pilicat913.github.io`。没有公开读取接口，在 D1 Console 用 `SELECT * FROM feedback ORDER BY created_at DESC LIMIT 100;` 查看。

## 2026-10-24 第九轮：简体 / 繁體，按玩家数据补语库

- 简繁：`vendor/opencc/`（opencc-js 1.0.5，MIT）+ `js/zh.js`。
  - 输入：`t2cn.js`（约 70KB）所有人都载入，`ZH.toSimp()` 在 `normalize()`、`respond()` 和群聊里把繁体先转简体，规则只写简体。
  - 显示：繁体模式才懒加载 `cn2t.js`（约 1MB），只做字形转换（`cn → tw`），再加一小张界面用语表（设定、視訊通話、簡訊、轉帳……）；不用台湾词汇整句改写，所以“打开这部旧手机”不会变成“開啟”。转换靠 MutationObserver 处理新出现的文字；输入框不转；带 `data-zh-keep` 的不转；CSS 伪元素里的字（发送、结束通话）在 `chat.css` 末尾按 `:root[lang^="zh-Hant"]` 另写。
  - 默认：浏览器语言是 zh-TW / zh-HK / zh-Hant 时为繁体，否则简体；设置 → 通用 → 多语言环境 可切换，选择存在 localStorage `namjoon-zh`。切回简体会重新载入页面（进度不丢）。
- 新数据文件 `data/player-extras.js`（在 group.js 之后载入）：
  - `moreTopics`：私聊新话题，`getTopic()` 最先匹配。love、busted、didi、practice、downstairs、songwriting、callAsk、complain、goSleep、nothing、askIsMember（会让对方更快起疑）、proud、dream、takeCare、worry、wakeMe、insult。每人 before / after 轮换，`{哥}` 规则同转账。
  - `nameSpam`：连着叫同一个人的名字，第三次起换着回；叫名字不再触发“你不是南俊吧？”。
  - 群聊新话题：ignored、love、plan、buy、ok、funny、me，以及只 @ 某人时的 `called`。
- 引擎另改：“我是小猫”这类也算报名字（排除 我是认真的 / 粉丝 / 学生 等）；“被你发现了”算承认；短句 ack 补了 可以 / 好吧好吧 / 行行行 / 我看看。

## 2026-10-24 第十轮：语库第二批（玩家数据截至 13:54:27 UTC）

- 新文件 `data/player-extras-2.js`（在 player-extras.js 之后载入）：私聊新增 phoneBack、youWeird、denyOdd、excited、dorm、waitYou、goodJob、wakeUp、youToo、give、mistake、eatOut、offerFood、hungry、charge、whenBack、likeIt、family、youKnow、awkward、pleaseLook、sappy、comfort、noThanks、meToo、thin、go、lookingFor、noteFix、tiredQ、crush；放宽 love / goSleep / askIsMember / proud 的匹配。群聊新增 sleepNag、happy、cry、praise、together、greet、what、yogurt、bug、peace、news、photoGo、crush、interj。
- 引擎：短句 ack 认 喔 / 內 / 네 / ok / 前面带ㅋ；“睡觉了吗”“舞台”“好好练”“陪哥聊天”能认；“这是南俊的手机吗 / 手机还给南俊”算承认不是本人；号锡别名加“厚比兄”。
- 以后的流程：作者发来新导出的消息，只针对接不住的话补各人回复，不整批重跑；补完推到 GitHub，再给一句从这批最后一条之后开始查的 SQL。

## 2026-10-24 第十一轮：语库第三批（玩家数据截至 14:13:54 UTC）

- 新文件 `data/player-extras-3.js`：私聊新增 futureCheer（“你以后一定会成为世界巨星”这类不再回“你说的是以后？”）、timeTravel、insistSelf、robot、maknae、careBody、secret、coming、pocketMoney、outfit、never、chores、pdSaid、danceGod、debutYay、nonsense、ready、goodIntent、slump、iNervous、drink、socks、sendMe、careful、tellYou、leader；放宽 eatOut / give / comfort / insult / songwriting / excited / crush / callAsk / offerFood / love。群聊新增 forbid、notMe、worryG、careful、chores、exercise、wakeG、bored、concert、today、alcohol、lost、scold、maknaeG，放宽若干旧话题。
- 引擎：任何 moreTopics 命中时跳过“你说的是以后？”；“我❤️你”的爱心当成“爱”；“你有看到他吗”算问南俊在哪（承认不是本人）；“吃饱了吗”“在做些什么”“你还在吗”“你现在觉得我是谁”能认；短句 ack 补 是的是的 / 喔喔好 / 当然；ㄎㄎ 算笑。
- 群聊：只发一个成员名字（“泰亨”“柾国柾国”）时按被 @ 处理（called）。

## 2026-10-24 第十二轮：群聊多人回复；语库第四批（玩家数据截至 14:42:15 UTC）

- 群聊（`chat.js` 的 `groupReply`）：第一个人回完后，再有 1～2 个人接着回读者这句（话题优先人选先上；同话题用他们自己的台词，没有就用 `group.follow` 的通用反应），之后才以 35% 的概率岔开闲聊（原来 70%）。只 @ 一个人时，一半概率再有一个人插一句。群里的 ❤️ 也当成“爱”。
- 新文件 `data/player-extras-4.js`：私聊新增 distress（说“想死”时成员会担心、劝对方找身边的人说，不再回“ㅋㅋ”）、sad、cryComfort、didWell、noisy、cook、remind、promise、brain、askAbout、guessMe、eatUp、checkBag、treatMe、back、listen、homesick、sleepTogether、ateAlready、okQ、chickenLove、rude；放宽若干旧话题。群聊新增 distressG、hug、roach、broke、photoReq、cute、ready、inspire，放宽 together / lost / chores / sleepNag / wakeG / love。
- 引擎：😭🥺 等哭脸当“呜”；单发“阿米”算粉丝承认；“不是南俊 / 我不是rm / 你认识金南俊吗”算承认；“什么 / 怎么说 / 你说啥”等归到 why；短句 ack 再补一批。

## 2026-10-25 第十三轮：语库第五批（玩家数据截至 2026-10-24 14:58:10 UTC）

- 新文件 `data/player-extras-5.js`：私聊新增 notAgain（已识破后再说“我不是南俊”→“知道啦 你说过了”）、howUsually（“那我平时怎么叫你”）、kiss、letGo、comeHere、frustrated（“你好难沟通”→成员道歉请对方再说一遍）、whyHappy、wantGift、favor、friend、stillUp、morning、earlySleep，放宽若干旧话题。群聊新增 foundPhone（在群里说捡到手机 / 找失主：大家照旧以为是南俊，但会接这个话，如“南俊你手机丢了？？”）、quiet、kissG、pet、game，扩充 happy / together / food / yogurt / plan / ignored / wakeG / bye / greet / me。
- 引擎：名字里带“猜”或单字“阿 / 啊”不当名字；“猜猜看”算猜我是谁；“在哪儿”“为什么奇怪”能认。群聊判断话题前先去掉 @某人。柾国别名加 国儿 / 小国 / 柾guo / 小果。

## 2026-10-25 第十四轮：语库第六批（玩家数据截至 2026-10-24 15:32:42 UTC）

- 新文件 `data/player-extras-6.js`：私聊新增 fanFuture（“我是13年后的粉丝 / 你们会在体育场开演唱会”等，回复认真不玩笑）、fanName（粉丝名还没定）、loveQ、shipQ、harsh（骂人时成员委屈地问“我做错什么了吗”）、handover（约时间地点归还手机）、bath、apologize、address、lottery、scared、firstMeet、whatDiff、errand、believe、grownUp、wish，扩充若干旧话题。群聊新增 shutUp、comeG、date、age、borrow、light、spam、hardLead，扩充 happy / together / crush / food / wakeG / photoGo / foundPhone / bye / today / cry / sleep / game。
- 引擎：“你叫我X就好”也算报名字；说要把手机交给 / 转交 也算承认不是本人。群聊里 😭 当“哭”。

## 2026-10-25 第十五轮：五项打磨（`data/polish.js` + 引擎 / chat.js / debut.js）

1. 减少重复：私聊里和上一条回复一字不差时，换成 `dupLines`；群聊闲聊小场景每局随机顺序、用过不再出现、用完就不再岔开；出道前小场景 20→32 段，出道当晚 6→20 段。
2. “你不是南俊吧？”：只有读者说了不像南俊会说的话（`ODD_TOPICS`：夸人、我爱你、叫宝宝、未来的粉丝……或看不懂的话），或在小怀疑之后又聊了 7 句以上才问；晚安、好吧、早点睡等（`CALM_TOPICS`）不会触发。问的时候先回原话的第一句，再“等等 / 你不是南俊吧？”。
3. 识破、知道名字后再聊 9 句：成员主动说一段收尾的话（`closings`，出道前问“明天的舞台你会看吗”，跳转后问“今天的舞台你看了吗”），回答能接上。每人一次。
4. 妈妈：跳到 6 月 13 日以后（弹完消息时 / 之后再给妈妈发消息时），只要读者给妈妈发过文字，妈妈回一次（`momDebut`，说过“想你”会多一句“妈妈也想你”，说过睡不着 / 紧张会换成“睡不着就躺着…妈妈在呢”）。之后照旧不回。存储键 `momReplied`。
5. 出道前说“出道快乐”：私聊回“明天才是呢”这类，跳转后改成真的庆祝（moreTopics 可带 `debutLines`）；群聊话题 `notYet` 只在跳转前生效（话题可带 `beforeDebut` / `afterDebut`）。读者一共发了 25 条还没跳转时，设置推一次横幅“跳转时间：想看看 6 月 13 日出道那晚吗？”（`jumpHinted`）。
- 引擎的 respond 现在会收到 `context.debut`（chat.js 传入是否已跳转）。

## 2026-10-25 第十六轮：群聊不再“已读乱回”；语库第七批

- 玩家反馈群聊“已读乱回”。原因是没接住的话也有第二、三个人用通用附和（“南俊说得对ㅋㅋ”）接，再岔开闲聊。现在：没有话题（key 为 any）时只有一个人回，不跟附和、不岔开；`group.follow` 也改成不带“同意”语气。
- 新文件 `data/player-extras-7.js`：私聊新增 money、wantToTalk、whereQ、tellWhenDone、aboutNamjoon、cookReq（找硕珍做饭）、animal、expressLove、noona、bday、gameConsole、stress，放宽大量旧话题；群聊新增 meta（玩家说“乱回”时道歉）、bts、quit、goOut、english、wow、harshG、tsundere、familyG、interview、whenBackG、fanG。引擎 food 认“吃晚餐 / 早饭 / 吃啥”。
- 数据导出：以后用“只看没接住的话”的 SQL（按兜底回复筛、按句子去重计数），见 `feedback/查看新消息.sql`。

## 2026-10-25 第十七轮：导出改成下载文件；语库第八批

- 后端 `feedback/worker.js` 新增 `/export?key=密码`：下载 CSV，默认只含“上次下载以后、没接住的话”（按句子去重计数），下载后自动记录截到哪里（表 `export_state`，按 rowid）。参数：`&again=1` 重下上一批，`&all=1` 全部消息，`&since=UTC时间` / `&from=rowid` 指定起点。需要 Worker Secret `EXPORT_KEY`。作者已部署并下载成功。
- 新文件 `data/player-extras-8.js`：nameArmy（玩家给粉丝起名叫 army 时成员记住）、knowArmy、futureWarn（解散 / 肩膀受伤等未来剧透：担心但不点破）、songLiked、stageName，放宽若干；群聊新增 gross、sleepTogetherG。

## 2026-10-25 第十八轮：语库第九批（玩家数据截至 2026-10-24 17:00:42 UTC）

- 引擎：被识破、正在问名字时，“我是小喵（是army喔）”也算报名字（取“是 / ，”前面那段）；“叫哥就行 / 叫我怒那”把这个称呼当名字；夸人认“萌”；加油认 화이팅 / 파이팅 / fighting。
- 新文件 `data/player-extras-9.js`：diet、wishReq、tiredMe、worryWhat、hair、futureSong（玩家说出未来的歌名：成员觉得是好名字、记下来）、yeontan（碳尼）、firstWin（拿一位）、cantGo、fromAbroad（我在台湾）、intro，放宽若干；群聊新增 futureSongG、dietG、youngG。

## 2026-10-25 第十九轮：语库第十批（玩家数据截至 2026-10-24 17:58:44 UTC）

- 新文件 `data/player-extras-10.js`。原则：告白（“我是你对象”“149的女生”“marry me”）温柔带过、不升级暧昧；有人说“我喜欢的是男生 / 怕被粉丝知道”时成员接纳、不开玩笑（comingOut）；抽烟一律拒绝；群里擦边话（多P、蕾丝）岔开（deflect）；学生说课业好累、焦虑时认真安慰（studentLife / worryG）。
- 另有 tattoo、toFans、callMeBaby、autograph、meetDate（如“11/22见”）、walk、myBday、whyIdol（柾国：看了南俊哥的rap就想来）、joke（硕珍的冷笑话）、farewell（“明天还能见面吗”）、momGift、pain 等；群聊 studentLife、outNight、chant、sign、dm，放宽若干。
- 引擎：名字后面可以带多个感叹号 / ㅋ（“我叫jae!!”）；玧其别名加“闵运气”。

## 2026-10-25 第二十轮：骂人的底线；小猪不点名

- 私聊：真骂人（`harsh`：畜生、滚、去死、傻逼、废物……）第一次委屈地问“我做错什么了吗”，第二次说“你今天心情不好的话 我先不打扰了”（`harshBoundary`），第三次起不再回复、消息一直挂“1”（计数 `harshCount`，每人分开）。“笨蛋 / 小傻子”这类亲昵的仍归 `insult`，照常回。
- 群聊：骂人（`harshG`）第一次有人回，第二次硕珍说“……南俊 先睡吧”，第三次起没人接（`groupState.harsh`）。
- “先离开的人是小猪”：大家抢着说自己不走，不再点名谁（`data/player-extras-11.js`）。
- 补充：“小猪”拆成三种——`piggyLeave`（谁先走谁是小猪：大家说自己不走）、点名某人是小猪（被点名的人用 `piggyMe` 自己反驳，其他人用 `piggyOthers` 起哄）、只说小猪（`piggy`：谁是小猪）。chat.js 通用规则：话里点名了某人、且该话题有 `<key>Me` 版本时，被点名的人用 Me 版，跟着回的人用 `<key>Others`（没有就用原话题）。
- 群聊再补：问“粉丝叫什么”（`fanNameG`：还没定）、说“粉丝叫阿米”（`armyG`：好听、记住了）、“我们会有粉丝吗”（归到 together 安慰）。chat.js：同一个成员这次的回复和他上次在群里说的一字不差时，带头的人换成通用反应，跟着回的人这次不出声（`groupState.last`）。

## 第二十一轮（2026-10-25）
- 南俊本人照片 10 张：data/rm-photos.js（按时间插入聊天 + 相册 + 原推链接），图片在 assets/early/early-<推文id>.jpg。
- 404.html：网址打错或更新中自动回首页。
- 群聊征求意见弹窗底下加作者账号；设置水印加抖音/小红书/Threads。
- 语库第十二批 player-extras-12.js：笑、反问、我是谁、香蕉牛奶、上镜、教跳舞、一起走下去、年龄、炸鸡、请客、心情、没关系、不行、我要睡了等；群里“？”、“某某呢”、“一定会有的”、“看到了”、“好累”、“笨蛋”。
- 修正：输入经 NFKC 后 ㅋ/ㅎ/ㅠ 会变成另一种字符，导致“ㅋㅋㅋ”之类永远匹配不上；normalize 里转回来了。
