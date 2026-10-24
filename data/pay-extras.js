/* 转账按金额分档、礼物逐个反应、回礼。均为同人预写台词，每句一个气泡。
 * 金额分档：tiny < 5,000 ≤ small < 50,000 ≤ big < 200,000 ≤ huge
 * small 档沿用 reader-extras.js 里原来的 transfer。 */
window.STORY = window.STORY || {};
window.STORY.payExtras = {
  transferTiers: {
    yq: {
      before: {
        tiny: [{ lines: ['……一千块？', '这是什么意思'], outcome: 'returned' }, { lines: ['ㅋ', '你这是在给我零花钱？'], outcome: 'returned' }],
        big: [{ lines: ['？？', '你哪来这么多钱', '退了 别乱转'], outcome: 'returned' }],
        huge: [{ lines: ['金南俊', '你脑子是不是坏了', '马上退'], outcome: 'returned' }]
      },
      after: {
        tiny: [{ lines: ['……一千块', '你是在逗我吧ㅋ'], outcome: 'returned' }],
        big: [{ lines: ['……', '你疯了吗', '退了'], outcome: 'returned' }],
        huge: [{ lines: ['……这是南俊全部的钱吧', '退了', '别再碰他的卡'], outcome: 'returned' }]
      }
    },
    sx: {
      before: {
        tiny: [{ lines: ['一千ㅋㅋ', '行 哥收下了', '明天买根冰棍'], outcome: 'accepted' }],
        big: [{ lines: ['哇', '南俊你发财了？？', '不行 这么多哥不能要'], outcome: 'returned' }],
        huge: [{ lines: ['？？？？', '南俊你中彩票了？？', '你先给哥打个电话 我害怕'], outcome: 'returned' }]
      },
      after: {
        tiny: [{ lines: ['ㅋㅋ一千块', '这个我就收了', '就当南俊请我吃冰棍ㅋㅋ'], outcome: 'accepted' }],
        big: [{ lines: ['哎哟哟', '这么多？', '南俊知道了会哭的 退了'], outcome: 'returned' }],
        huge: [{ lines: ['你哪来这么多', '……该不会是南俊的全部存款吧', '马上退回去！！'], outcome: 'returned' }]
      }
    },
    hx: {
      before: {
        tiny: [{ lines: ['ㅋㅋㅋㅋ一千块', '南俊你是在试转账功能吗'], outcome: 'returned' }],
        big: [{ lines: ['哇！！', '这么多？？', '你别吓我ㅋㅋ 退了'], outcome: 'returned' }],
        huge: [{ lines: ['？？？？？', '南俊！！！', '你在哪 我现在去找你'], outcome: 'returned' }]
      },
      after: {
        tiny: [{ lines: ['ㅋㅋㅋㅋ一千块！！', '好可爱', '退回去啦'], outcome: 'returned' }],
        big: [{ lines: ['啊啊不行不行', '这么多钱！！', '退回去了！！'], outcome: 'returned' }],
        huge: [{ lines: ['天啊', '这个绝对不行', '快点还给南俊ㅋㅋ'], outcome: 'returned' }]
      }
    },
    jw: {
      before: {
        tiny: [{ lines: ['哥？', '一千块…是要我帮你买什么吗'], outcome: 'returned' }],
        big: [{ lines: ['哥…', '这么多我不能收的', '退回去了'], outcome: 'returned' }],
        huge: [{ lines: ['哥！！', '是不是按错了', '我吓了一跳'], outcome: 'returned' }]
      },
      after: {
        tiny: [{ lines: ['ㅋㅋ一千块', '好可爱', '但还是退回去吧'], outcome: 'returned' }],
        big: [{ lines: ['这个太多了', '我真的不能收', '退回去了哦'], outcome: 'returned' }],
        huge: [{ lines: ['……', '这个太吓人了ㅋㅋ', '南俊哥知道了会晕倒的'], outcome: 'returned' }]
      }
    },
    ty: {
      before: {
        tiny: [{ lines: ['一千块！', '哥这是我的零花钱吗ㅋㅋ', '收了'], outcome: 'accepted' }],
        big: [{ lines: ['哇', '哥你是不是有事求我', '太多了 退了ㅋㅋ'], outcome: 'returned' }],
        huge: [{ lines: ['哥？？？', '这是什么？？', '哥是不是被盗号了'], outcome: 'returned' }]
      },
      after: {
        tiny: [{ lines: ['一千块ㅋㅋ', '我可以买一个鱼饼', '……开玩笑的 退了'], outcome: 'returned' }],
        big: [{ lines: ['哇', '我第一次收到这么多钱', '……可惜不能要 退了'], outcome: 'returned' }],
        huge: [{ lines: ['？？？', '你是不是在把南俊哥的钱全转给我', '我不要 我不想被骂ㅋㅋ'], outcome: 'returned' }]
      }
    },
    jy: {
      before: {
        tiny: [{ lines: ['一千块ㅋㅋ', '谢谢哥', '我去买个面包'], outcome: 'accepted' }],
        big: [{ lines: ['哥 这么多？', '我不能要', '退回去了'], outcome: 'returned' }],
        huge: [{ lines: ['哥？？', '你是不是转错人了', '吓死我了'], outcome: 'returned' }]
      },
      after: {
        tiny: [{ lines: ['ㅋㅋ一千块', '……退回去了'], outcome: 'returned' }],
        big: [{ lines: ['这么多…', '不行的', '退了'], outcome: 'returned' }],
        huge: [{ lines: ['……', '这个绝对不行', '我要告诉哥哥们'], outcome: 'returned' }]
      }
    }
  },
  /* 转账留言：{note} 换成读者写的留言，插在第一句后面 */
  noteLines: {
    yq: ['「{note}」？', '……还写「{note}」'],
    sx: ['还写了「{note}」ㅋㅋ', '「{note}」是吧ㅋㅋ'],
    hx: ['「{note}」ㅋㅋㅋㅋ', '看到留言了「{note}」ㅋㅋ'],
    jw: ['看到你写的「{note}」了', '「{note}」ㅋㅋ'],
    ty: ['「{note}」是什么ㅋㅋ', '留言我截图了「{note}」'],
    jy: ['……「{note}」', '「{note}」ㅋㅋ']
  },

  /* 看懂了留言的意思（小额转账）：按意思回，不再问“干嘛的”。{item} 是要买的东西，{哥} 只在没发现身份时出现 */
  noteIntents: {
    buy: {
      yq: [{ lines: ['……{item}？', '行 收了', '剩下的还你'], outcome: 'accepted' }, { lines: ['又让我买{item}', '……知道了'], outcome: 'accepted' }],
      sx: [{ lines: ['ㅋㅋ{item}', '行 这就去买', '顺便给你也带一个'], outcome: 'accepted' }, { lines: ['又是{item}ㅋㅋ', '好好 去买'], outcome: 'accepted' }],
      hx: [{ lines: ['{item}！！', '好 我现在就去便利店ㅋㅋ', '谢谢！'], outcome: 'accepted' }, { lines: ['又是{item}ㅋㅋㅋㅋ', '好的好的！！'], outcome: 'accepted' }],
      jw: [{ lines: ['啊 原来是买{item}ㅋㅋ', '好 那我收下了', '谢谢{哥}'], outcome: 'accepted' }, { lines: ['又是{item}ㅋㅋ', '好 我记住了'], outcome: 'accepted' }],
      ty: [{ lines: ['{item}！', '我要去买最贵的那种ㅋㅋ', '……开玩笑的 谢谢{哥}'], outcome: 'accepted' }, { lines: ['又是{item}？', '我开始怀疑你是{item}的代言人了ㅋㅋ'], outcome: 'accepted' }],
      jy: [{ lines: ['{item}…', '好 我去买', '谢谢{哥}ㅋㅋ'], outcome: 'accepted' }, { lines: ['ㅋㅋ又是{item}', '……好'], outcome: 'accepted' }]
    },
    eat: {
      yq: [{ lines: ['让我吃饭？', '……知道了 收了'], outcome: 'accepted' }],
      sx: [{ lines: ['给我饭钱ㅋㅋ', '好 今天吃顿好的'], outcome: 'accepted' }],
      hx: [{ lines: ['吃饭钱！！', '那我去吃拉面ㅋㅋ', '谢谢！'], outcome: 'accepted' }],
      jw: [{ lines: ['{哥}怕我饿着吗ㅋㅋ', '谢谢', '我会好好吃饭的'], outcome: 'accepted' }],
      ty: [{ lines: ['吃饭钱！', '我要去吃炸酱面ㅋㅋ'], outcome: 'accepted' }],
      jy: [{ lines: ['ㅋㅋ饭钱', '……我现在就饿了', '谢谢{哥}'], outcome: 'accepted' }]
    },
    thanks: {
      yq: [{ lines: ['谢什么', '……收了 别有下次'], outcome: 'accepted' }],
      sx: [{ lines: ['谢什么ㅋㅋ', '应该的', '那我就收下了'], outcome: 'accepted' }],
      hx: [{ lines: ['哎呀 谢什么呀！！', '不过我收下了ㅋㅋ'], outcome: 'accepted' }],
      jw: [{ lines: ['没有啦…', '我也没做什么', '谢谢{哥}'], outcome: 'accepted' }],
      ty: [{ lines: ['ㅋㅋ突然这么客气', '那我收下了'], outcome: 'accepted' }],
      jy: [{ lines: ['……没什么的', '但谢谢{哥}'], outcome: 'accepted' }]
    },
    sorry: {
      yq: [{ lines: ['……没生气', '钱退了', '不用这样'], outcome: 'returned' }],
      sx: [{ lines: ['道歉还转钱ㅋㅋ', '我没往心里去', '退给你了'], outcome: 'returned' }],
      hx: [{ lines: ['哎呀 我没生气！！', '钱退回去啦'], outcome: 'returned' }],
      jw: [{ lines: ['不用道歉的', '我真的没事', '退回去了哦'], outcome: 'returned' }],
      ty: [{ lines: ['ㅋㅋ那我原谅你了', '钱我收了'], outcome: 'accepted' }],
      jy: [{ lines: ['……没事', '退了'], outcome: 'returned' }]
    },
    birthday: {
      yq: [{ lines: ['我生日早过了', '……收了 当补的'], outcome: 'accepted' }],
      sx: [{ lines: ['我生日是12月ㅋㅋ', '不过先收着'], outcome: 'accepted' }],
      hx: [{ lines: ['我生日早过了ㅋㅋ', '不过谢谢！！'], outcome: 'accepted' }],
      jw: [{ lines: ['我生日是10月呀ㅋㅋ', '记错了吧', '退回去啦'], outcome: 'returned' }],
      ty: [{ lines: ['我生日是12月！', '……不过可以提前过ㅋㅋ'], outcome: 'accepted' }],
      jy: [{ lines: ['我生日是9月…', '先收着ㅋㅋ'], outcome: 'accepted' }]
    },
    cheer: {
      yq: [{ lines: ['……嗯', '你也是'], outcome: 'accepted' }],
      sx: [{ lines: ['ㅋㅋ加油加油', '收下了 去买点吃的'], outcome: 'accepted' }],
      hx: [{ lines: ['加油！！！', '我们一起加油ㅋㅋ'], outcome: 'accepted' }],
      jw: [{ lines: ['嗯！', '我会加油的', '你也是'], outcome: 'accepted' }],
      ty: [{ lines: ['加油！', '我收下了 当能量费ㅋㅋ'], outcome: 'accepted' }],
      jy: [{ lines: ['……嗯', '我会加油的'], outcome: 'accepted' }]
    },
    pocket: {
      yq: [{ lines: ['零花钱？', '……我又不是小孩', '退了'], outcome: 'returned' }],
      sx: [{ lines: ['给我零花钱ㅋㅋ', '你真是', '好 收了'], outcome: 'accepted' }],
      hx: [{ lines: ['零花钱！！ㅋㅋ', '谢谢！'], outcome: 'accepted' }],
      jw: [{ lines: ['零花钱…', '你自己留着吧', '退回去了'], outcome: 'returned' }],
      ty: [{ lines: ['零花钱！', '我要存起来ㅋㅋ'], outcome: 'accepted' }],
      jy: [{ lines: ['ㅋㅋ零花钱', '谢谢{哥}'], outcome: 'accepted' }]
    }
  },
  /* 看懂了留言但金额太大：插在第一句后面 */
  noteBig: {
    yq: '{reason}也用不着这么多', sx: '{reason}要这么多？ㅋㅋ', hx: '{reason}也太多了吧！！',
    jw: '{reason}的话 不用这么多的', ty: '{reason}要这么多钱吗？', jy: '{reason}…也太多了'
  },

  /* 礼物：每人每样东西自己的反应（同一样送第二次用第二组，再多就用 again） */
  gifts: {
    yq: {
      opener: ['你给我送这个干嘛'],
      items: {
        energy: [['能量饮料', '……知道我今晚要熬夜啊', '谢了']],
        tteok: [['辣炒年糕', '……这个可以']],
        socks: [['袜子？', '……行 正好缺']],
        bingsu: [['刨冰？', '……天热 收了']],
        book: [['书店券？', '……我去买本乐理书', '谢了']],
        pizza: [['披萨', '……分给他们 我吃一块就行']],
        meat: [['五花肉？', '……这个不错', '下次一起去']],
        banana: [['香蕉牛奶', '……行'], ['又是甜的ㅋ', '放冰箱了']],
        coffee: [['……美式', '这个可以', '谢了'], ['刚好困', '谢了']],
        store: [['便利店券', '……买水用了']],
        chicken: [['炸鸡？', '……这个点吃会被说的', '先收了']],
        cake: [['蛋糕？', '谁过生日', '……算了 收了 分给他们']]
      },
      again: [['又是这个', '……你是不是只会送这个']],
      back: { item: 'coffee', lines: ['……回你一个'] }
    },
    sx: {
      opener: ['南俊给我送礼物？', '今天太阳从西边出来了ㅋㅋ'],
      items: {
        energy: [['能量饮料ㅋㅋ', '我不熬夜的', '我要睡美容觉']],
        tteok: [['辣炒年糕！', '要配鱼饼才完整ㅋㅋ']],
        socks: [['袜子ㅋㅋ', '宿舍里的袜子总是少一只', '谢谢啊']],
        bingsu: [['刨冰ㅋㅋ', '夏天就要吃这个', '分你一勺']],
        book: [['书店券ㅋㅋ', '我买本菜谱']],
        pizza: [['披萨！', '饼边都留给我ㅋㅋ']],
        meat: [['五花肉！！', '烤肉交给我', '我烤得最好ㅋㅋ']],
        banana: [['香蕉牛奶ㅋㅋ', '好久没喝了', '谢谢啊']],
        coffee: [['咖啡啊', '哥晚上喝了会睡不着的ㅋㅋ', '明天早上喝']],
        store: [['便利店券！', '我要去买泡面和三角饭团ㅋㅋ']],
        chicken: [['炸鸡！！', '你怎么知道我饿了', '这个我收下了ㅋㅋ'], ['又是炸鸡ㅋㅋ', '你是真的懂我']],
        cake: [['蛋糕？', '我切给大家', '我拿最大的那块ㅋㅋ']]
      },
      again: [['ㅋㅋ又是这个', '你是不是觉得我很喜欢']],
      back: { item: 'chicken', lines: ['礼尚往来ㅋㅋ', '这个给你'] }
    },
    hx: {
      opener: ['南俊你怎么了ㅋㅋ'],
      items: {
        energy: [['能量饮料！！', '明天练习靠它了ㅋㅋ']],
        tteok: [['辣炒年糕！！', '我要辣的那种ㅋㅋ']],
        socks: [['袜子！！', '练舞最费袜子了ㅋㅋ', '谢谢！！']],
        bingsu: [['刨冰！！', '我要多加年糕ㅋㅋ']],
        book: [['书店券！', '我买本漫画可以吗ㅋㅋ']],
        pizza: [['披萨！！！', '我去叫大家ㅋㅋ']],
        meat: [['五花肉！！！', '今天是什么好日子ㅋㅋ', '谢谢！！']],
        banana: [['香蕉牛奶！！', '我小时候最爱喝这个ㅋㅋ']],
        coffee: [['咖啡！！', '明天早上靠它了ㅋㅋ', '谢谢！！']],
        store: [['哇 便利店券', '我去买冰淇淋！！']],
        chicken: [['炸鸡！！！', '我去叫大家', '谢谢谢谢ㅋㅋ']],
        cake: [['蛋糕？？', '我们七个人分着吃ㅋㅋ', '谢谢！！']]
      },
      again: [['又是这个！！ㅋㅋ', '谢谢谢谢']],
      back: { item: 'cake', lines: ['我也送你一个！！'] }
    },
    jw: {
      opener: ['哥？'],
      items: {
        energy: [['能量饮料…', '是让我多练一会儿的意思吗ㅋㅋ']],
        tteok: [['辣炒年糕ㅋㅋ', '我最近好像吃得有点多…', '但还是谢谢！']],
        socks: [['袜子ㅋㅋ', '好实用', '谢谢呀']],
        bingsu: [['刨冰！', '好想现在就吃ㅋㅋ', '谢谢呀']],
        book: [['书店券…', '我好久没看书了', '谢谢呀']],
        pizza: [['披萨ㅋㅋ', '宿舍要开派对了']],
        meat: [['五花肉！', '好久没吃肉了ㅠ', '谢谢呀']],
        banana: [['香蕉牛奶ㅋㅋ', '谢谢呀', '我一口气喝完了']],
        coffee: [['冰美式…', '我其实有点怕苦ㅋㅋ', '但谢谢你！']],
        store: [['便利店券ㅋㅋ', '我拿去给大家买饮料']],
        chicken: [['炸鸡…', '这个点吃好像有点罪恶ㅋㅋ', '但谢谢！！']],
        cake: [['蛋糕！！', '好漂亮', '舍不得切ㅋㅋ']]
      },
      again: [['ㅋㅋ又送这个', '谢谢你呀']],
      back: { item: 'banana', lines: ['我也想送你一个ㅋㅋ'] }
    },
    ty: {
      opener: ['哥送我礼物！'],
      items: {
        energy: [['能量饮料', '喝了我会一直跳舞的ㅋㅋ']],
        tteok: [['辣炒年糕', '我要蘸着炸物吃ㅋㅋ']],
        socks: [['袜子！', '我要左右穿不一样的ㅋㅋ']],
        bingsu: [['刨冰', '我把红豆挑出来给柾国ㅋㅋ']],
        book: [['书店券', '我要买画册ㅋㅋ']],
        pizza: [['披萨！', '我要最中间那块ㅋㅋ']],
        meat: [['肉！', '我要包生菜吃一大口ㅋㅋ']],
        banana: [['香蕉牛奶', '我要插两根吸管ㅋㅋ']],
        coffee: [['咖啡', '我喝了会一直说话的', '……谢谢ㅋㅋ']],
        store: [['便利店券！', '我要买那个会发光的棒棒糖']],
        chicken: [['炸鸡！', '鸡腿是我的ㅋㅋ']],
        cake: [['蛋糕！', '今天谁过生日吗？', '那就当我过生日了ㅋㅋ']]
      },
      again: [['又是这个ㅋㅋ', '我要攒起来']],
      back: { item: 'store', lines: ['给你 不许拒绝ㅋㅋ'] }
    },
    jy: {
      opener: ['哥…'],
      items: {
        energy: [['能量饮料', '……我喝了会睡不着', '明天早上喝']],
        tteok: [['辣炒年糕！', '……我现在就想去吃']],
        socks: [['袜子', '……我的袜子确实都破了ㅋㅋ']],
        bingsu: [['刨冰…', '泰亨哥会来抢的', '我先藏起来ㅋㅋ']],
        book: [['书店券', '……可以买漫画吗']],
        pizza: [['披萨…', '我一个人能吃半个ㅋㅋ']],
        meat: [['肉……', '谢谢', '真的谢谢ㅋㅋ']],
        banana: [['香蕉牛奶！！', '我最喜欢这个ㅋㅋ'], ['又是香蕉牛奶ㅋㅋ', '……还是喜欢']],
        coffee: [['咖啡…', '我还是更喜欢香蕉牛奶ㅋㅋ', '谢谢']],
        store: [['便利店券', '我去买三角饭团ㅋㅋ']],
        chicken: [['炸鸡', '……我能一个人吃吗ㅋㅋ']],
        cake: [['蛋糕！', '我要先拍一张ㅋㅋ', '谢谢']]
      },
      again: [['ㅋㅋ又是这个', '……谢谢']],
      back: { item: 'banana', lines: ['……这个给你ㅋㅋ'] }
    }
  },

  /* 怀疑前的小提示：说到一半觉得不对劲 */
  hints: {
    yq: [['……你今天怎么了']],
    sx: [['你今天说话怎么怪怪的ㅋㅋ']],
    hx: [['南俊你今天好奇怪ㅋㅋ']],
    jw: [['哥今天打字好客气啊']],
    ty: [['哥你今天有点不一样']],
    jy: [['哥今天怎么了…']]
  },
  /* 没看懂读者在说什么时的回应（轮着用） */
  unknown: {
    yq: [['？'], ['……什么'], ['没懂', '你再说一遍'], ['嗯？']],
    sx: [['嗯？ㅋㅋ', '什么意思'], ['ㅋㅋ哥没跟上'], ['你说啥呢ㅋㅋ'], ['啊？']],
    hx: [['ㅋㅋㅋㅋ什么呀'], ['啊？？', '再说一遍！！'], ['我没看懂ㅋㅋ'], ['嗯？？']],
    jw: [['嗯？', '是我理解错了吗'], ['ㅋㅋ什么意思呀'], ['啊…我没看懂'], ['嗯？ㅋㅋ']],
    ty: [['？？ㅋㅋ'], ['我没听懂但是好像很有意思ㅋㅋ'], ['啥？'], ['嗯…你再说一遍']],
    jy: [['？'], ['……什么ㅋㅋ'], ['啊？'], ['没看懂ㅋㅋ']]
  },
  /* 读者回“好的 / 嗯嗯 / 在呢”这类短句 */
  acks: {
    yq: ['嗯', '嗯 你说', 'ㅋ', '看见了', '……然后', '行'],
    sx: ['ㅋㅋ看见了', '你接着说啊', '嗯嗯', '好ㅋㅋ', '然后呢', 'ㅋㅋ就这样？'],
    hx: ['ㅋㅋㅋㅋ', '我在看呢！！', '好！！', '嗯嗯ㅋㅋ', '然后然后', 'ㅋㅋ好的好的'],
    jw: ['ㅋㅋ嗯', '我看着呢', '嗯嗯', '好呀', 'ㅋㅋ然后呢', '嗯！'],
    ty: ['ㅋㅋㅋㅋ', '嗯 你说啊', '好！', 'vV', 'ㅋㅋ然后呢', '嗯嗯'],
    jy: ['ㅋㅋ', '嗯 看见了', '嗯', '好ㅋㅋ', '……嗯', 'ㅋㅋ然后呢']
  }
};
