/* ================================================================
 * 基本设置：时间、密码、机主、小组件、剧情事件开关
 * 这里和 data/ 里的其他文件都是纯数据，改完刷新页面即可。
 * 时间格式统一：'YYYY-MM-DD HH:MM'，或省略年份写 'MM-DD HH:MM'（默认 now.y 那一年）
 * ================================================================ */
window.STORY = window.STORY || {};
Object.assign(window.STORY, {
  /* 手机里的“现在”。时间会跟着现实一分钟一分钟往前走。 */
  now: { y: 2013, m: 6, d: 12, hh: 23, mm: 40 },

  passcode: '0613',            // 解锁密码（4 位）
  deviceName: '南俊的 iPhone', // 设置 → 关于本机 → 名称
  title: '金南俊的旧手机',          // 浏览器标签页标题
  storeKey: 'nj-phone-story-v10',    // 保存本轮互动对话、身份进度和阅读位置

  /* 预览模式：true = 所有联系人、聊天都显示（忽略 since）；正式版改成 false */
  previewAll: true,

  /* 设置 → 关于本机 / Wi-Fi 名称 / Safari 搜索结果下面的小字 / KakaoTalk 版本号 */
  device: {
    wifi: 'dorm_wifi', iosVersion: '6.1.4', model: 'iPhone 5',
    songs: '120', videos: '8', capacity: '16 GB', available: '2.3 GB',
    searchSite: 'search.example.kr', kakaoVersion: '3.6.0',
  },

  /* 桌面小组件 */
  widgets: {
    weather: { city: '首尔', temp: '21°', cond: '晴', range: '最高 27° 最低 18°' },
    calendar: { title: '出道', time: '全天' },   // 日历小组件上显示的下一件事
  },

  /* 设置 → 关于本机 最底下的小字（不需要就留空数组） */
  credit: ['根据公开经历进行同人创作，聊天及部分日期为虚构编排', 'made by 霹雳小猫', '抖音/小红书：霹雳小猫 · Threads：imyouryeon913'],

  /* 声音设置页的说明文字 */
  soundNote: '闹钟与来电跟随此处音量。请先点击页面启用声音。',

  /* ---------------- 剧情事件（框架阶段全部关闭） ----------------
   * call：某人打来电话。打开备忘录 noteId 那条后 delay 毫秒打来；或时间到 at 自动打来。
   *   { from: 'yq', at: '06-12 23:50', noteId: 'n1', delay: 5000, talkSeconds: 6,
   *     after: ['06-12 23:52', 'yq', '早点睡'] }   // 挂断后发来的一条消息（可省略）
   * ending：桌面 + Dock 的应用都打开过后，进入第二天的闹钟。
   *   { requiredApps: [...], alarmTime: '06:30', nextDay: { y: 2013, m: 6, d: 13 },
   *     messages: [['dorm', ['06-13 06:20', 'hx', '起床！！']]] }
   */
  plot: {
    call: null,
    ending: null,
  },
});
