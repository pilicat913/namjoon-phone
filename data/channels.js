/* 聊天软件里的两个广告频道（虚构店铺，非真实品牌）。
 * 频道默认静音：不弹横幅、不上锁屏，只在聊天列表里显示。 */
window.STORY = window.STORY || {};
(function () {
  const S = window.STORY;
  S.contacts = S.contacts || [];
  S.rooms = S.rooms || [];
  S.contacts.push(
    { id: 'ch_chicken', name: '咔滋炸鸡 新沙店', remark: '咔滋炸鸡 新沙店', role: '频道', index: '#', since: '2012-09-02 12:00', kakao: true, channel: true, status: '夜宵外卖 · 营业到凌晨3点' },
    { id: 'ch_emoji', name: '表情小铺', remark: '表情小铺', role: '频道', index: '#', since: '2012-03-15 12:00', kakao: true, channel: true, status: '每周四 新表情上架' }
  );
  S.rooms.push(
    {
      id: 'ch_chicken', with: 'ch_chicken', channel: true,
      messages: [
        ['2012-09-02 12:00', 'ch_chicken', '感谢添加咔滋炸鸡为好友！'],
        ['2012-09-02 12:00', 'ch_chicken', { card: { badge: '新朋友', title: '首单立减 ₩2,000', body: '下单时出示这条消息即可使用', coupon: 'KAZI-HELLO', expire: '有效期至 2012.09.30', button: '领取优惠券' } }],
        ['2013-05-24 18:00', 'ch_chicken', { card: { badge: '周五限定', color: '#e98b2f', title: '半半套餐 ₩16,000', body: '原味 + 甜辣各半只\n晚上10点以后下单 送可乐 1.25L', button: '查看菜单', done: '菜单已打开' } }],
        ['2013-06-07 17:30', 'ch_chicken', '这周末下雨 外卖可能会晚到20分钟左右'],
        ['2013-06-07 17:30', 'ch_chicken', '提前点单的朋友 送一份腌萝卜！'],
        ['2013-06-12 21:30', 'ch_chicken', { card: { badge: '今晚', color: '#d9534f', title: '今天也辛苦了', body: '加班 / 练习 / 学习到很晚的朋友\n夜宵交给我们吧\n凌晨1点前下单免配送费', coupon: '₩3,000 夜宵券', expire: '今天 23:59 前有效', button: '领取夜宵券' } }, { unread: true }]
      ]
    },
    {
      id: 'ch_emoji', with: 'ch_emoji', channel: true,
      messages: [
        ['2012-03-15 12:00', 'ch_emoji', '欢迎来到表情小铺！每周四都有新表情上架'],
        ['2012-12-20 12:00', 'ch_emoji', { card: { badge: '圣诞', color: '#3c9a5f', title: '圣诞节表情 限时免费', body: '戴红帽子的小企鹅 16个\n添加好友即可下载', button: '免费下载', done: '下载完成' } }],
        ['2013-04-04 12:00', 'ch_emoji', { card: { badge: '新上架', color: '#8a6bd1', title: '熬夜饭团', body: '眼睛快睁不开但还在努力的饭团\n24个动态表情', button: '查看', done: '已加入收藏' } }],
        ['2013-06-06 12:00', 'ch_emoji', '本周新表情：会跳舞的小熊'],
        ['2013-06-06 12:00', 'ch_emoji', { card: { badge: '本周', color: '#e5739b', title: '会跳舞的小熊 · 免费', body: '7天内下载永久可用\n转发给3位好友再送1套', button: '免费下载', done: '下载完成' } }, { unread: true }]
      ]
    }
  );
})();
window.ASSETS = window.ASSETS || {};
window.ASSETS.avatars = Object.assign(window.ASSETS.avatars || {}, { ch_chicken: 'assets/avatars/ch_chicken.svg', ch_emoji: 'assets/avatars/ch_emoji.svg' });
