/* iOS 6 时代风格的应用图标（原创绘制的 SVG，非官方素材）。
 * 每个函数返回一段 SVG；日历、时钟、天气会根据手机里的“现在”变化。 */
(function () {
  const WD = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const svg = (inner, defs = '') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>${inner}</svg>`;
  const lg = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  let seq = 0; // 同一页面里多个图标的渐变 id 不能重复
  const uid = (k) => `${k}${++seq}`;

  const ICONS = {
    phone() {
      const g = uid('ph');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <path d="M21.5 13.5c1.6-1 3.4-.6 4.4 1l3 5c.8 1.4.5 3-.7 4l-2.2 1.8c1.6 3.9 4.4 7 8 9.2l2-2.1c1.1-1.1 2.8-1.3 4.1-.4l4.8 3.3c1.5 1 1.9 2.9 1 4.4l-1.5 2.5c-1.3 2.2-4 3.3-6.5 2.5-9.9-3.1-17-10.9-19.6-21-.6-2.4.4-4.9 2.6-6.2z" fill="#fff" stroke="rgba(0,60,0,.35)" stroke-width=".8"/>`,
        lg(g, '#93e66f', '#2a9a12'));
    },
    messages() {
      const g = uid('ms');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <path d="M30 13c-11 0-19.5 6.6-19.5 15 0 4.6 2.6 8.7 6.7 11.4-.5 2.6-2 5.3-4.2 7 4.5-.3 8.2-2 10.6-4 2 .5 4.2.7 6.4.7 11 0 19.5-6.7 19.5-15S41 13 30 13z" fill="#fff" stroke="rgba(0,70,0,.3)" stroke-width=".8"/>`,
        lg(g, '#97e86f', '#2fa31a'));
    },
    safari() {
      const g = uid('sf'), f = uid('sff');
      let ticks = '';
      for (let i = 0; i < 36; i++) { const a = i * 10 * Math.PI / 180, r1 = i % 3 ? 19 : 17.5; ticks += `<line x1="${30 + Math.sin(a) * r1}" y1="${30 - Math.cos(a) * r1}" x2="${30 + Math.sin(a) * 20.5}" y2="${30 - Math.cos(a) * 20.5}"/>`; }
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <circle cx="30" cy="30" r="23" fill="url(#${f})" stroke="#c7d6e6" stroke-width="1.2"/>
        <g stroke="#7e95ad" stroke-width=".8">${ticks}</g>
        <path d="M30 30l11-12-4.5 15z" fill="#e9eef3" stroke="#9aa9b8" stroke-width=".5"/><path d="M30 30L19 42l4.5-15z" fill="#e33b2e"/>
        <path d="M30 30l11-12-15.5 7z" fill="#e33b2e"/><path d="M30 30L19 42l15.5-7z" fill="#fff"/>
        <circle cx="30" cy="30" r="1.6" fill="#fff" stroke="#888" stroke-width=".5"/>`,
        lg(g, '#8ccfff', '#1e72d6') + lg(f, '#ffffff', '#dfe8f1'));
    },
    chat() {
      const g = uid('kt');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <path d="M30 13c-12 0-21 7-21 15.5 0 5.5 3.7 10.2 9.3 13l-2.3 8.4 9.5-6.3c1.5.2 3 .3 4.5.3 12 0 21-7 21-15.4S42 13 30 13z" fill="#3c2318"/>
        <text x="30" y="33" text-anchor="middle" font-family="Arial Black,Helvetica,Arial,sans-serif" font-weight="900" font-size="12" fill="#ffe33a" letter-spacing=".4">TALK</text>`,
        lg(g, '#fff060', '#f3c400'));
    },
    calendar(now) {
      const g = uid('ca'), r = uid('car');
      const wd = WD[new Date(now.y, now.m - 1, now.d).getDay()];
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <rect width="60" height="17" fill="url(#${r})"/><rect y="17" width="60" height=".8" fill="rgba(0,0,0,.25)"/>
        <text x="30" y="12.4" text-anchor="middle" font-family="Helvetica Neue,Helvetica,Heiti SC,PingFang SC,sans-serif" font-weight="700" font-size="9.5" fill="#fff">${wd}</text>
        <text x="30" y="50" text-anchor="middle" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-weight="700" font-size="31" fill="#222" letter-spacing="-1">${now.d}</text>`,
        lg(g, '#ffffff', '#e4e4e4') + lg(r, '#f0726a', '#b9261c'));
    },
    photos() {
      const g = uid('pt'), c = uid('ptc');
      let petals = '';
      for (let i = 0; i < 14; i++) { const a = i * 360 / 14; petals += `<ellipse cx="30" cy="17" rx="4.2" ry="10" fill="${i % 2 ? '#ffd21f' : '#ffbd0a'}" stroke="#d48a00" stroke-width=".5" transform="rotate(${a} 30 30)"/>`; }
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <path d="M30 40c2 6 1 12-1 20h3c2-8 2-14 0-20z" fill="#3d8c2a"/>${petals}
        <circle cx="30" cy="30" r="8.5" fill="url(#${c})"/>`,
        lg(g, '#a9dcff', '#3e8fd8') + `<radialGradient id="${c}"><stop offset="0" stop-color="#7a4a19"/><stop offset="1" stop-color="#3a2108"/></radialGradient>`);
    },
    camera() {
      const g = uid('cm'), l = uid('cml');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <rect x="7" y="17" width="46" height="30" rx="5" fill="#2b2d31" stroke="#16171a"/>
        <rect x="7" y="17" width="46" height="9" rx="4" fill="#4a4d53"/>
        <rect x="11" y="13.5" width="10" height="5" rx="1.5" fill="#3b3e43"/>
        <circle cx="30" cy="32" r="12" fill="#d9dde1" stroke="#1b1c1f"/>
        <circle cx="30" cy="32" r="9" fill="url(#${l})"/>
        <circle cx="30" cy="32" r="4" fill="#06101e"/><circle cx="27" cy="29" r="2" fill="#fff" opacity=".85"/>
        <circle cx="47" cy="22" r="1.8" fill="#fff4b0"/>`,
        lg(g, '#e8ebee', '#8f969d') + `<radialGradient id="${l}" cx=".4" cy=".35"><stop offset="0" stop-color="#4f8fd8"/><stop offset=".6" stop-color="#173f78"/><stop offset="1" stop-color="#060d19"/></radialGradient>`);
    },
    weather(now, story) {
      const g = uid('we'), s = uid('wes');
      const temp = ((story.widgets || {}).weather || {}).temp || '21°';
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <circle cx="23" cy="24" r="10" fill="url(#${s})"/>
        <path d="M24 44h20a7 7 0 0 0 0-14 9 9 0 0 0-17 2.5A6 6 0 0 0 24 44z" fill="#fff" opacity=".95"/>
        <text x="47" y="22" text-anchor="middle" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-weight="700" font-size="12.5" fill="#fff">${temp}</text>`,
        lg(g, '#69b6ff', '#1d5fc7') + `<radialGradient id="${s}"><stop offset="0" stop-color="#fff59a"/><stop offset="1" stop-color="#ffb400"/></radialGradient>`);
    },
    clock(now) {
      const g = uid('cl');
      const hA = ((now.hh % 12) + now.mm / 60) * 30, mA = now.mm * 6;
      let ticks = '';
      for (let i = 0; i < 12; i++) ticks += `<line x1="30" y1="10.5" x2="30" y2="${i % 3 ? 13 : 14.5}" transform="rotate(${i * 30} 30 30)"/>`;
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <circle cx="30" cy="30" r="22" fill="#fff" stroke="#bbb"/>
        <g stroke="#222" stroke-width="1.4" stroke-linecap="round">${ticks}</g>
        <line x1="30" y1="30" x2="30" y2="18.5" stroke="#111" stroke-width="2.6" stroke-linecap="round" transform="rotate(${hA} 30 30)"/>
        <line x1="30" y1="30" x2="30" y2="12.5" stroke="#111" stroke-width="1.8" stroke-linecap="round" transform="rotate(${mA} 30 30)"/>
        <line x1="30" y1="34" x2="30" y2="12" stroke="#e0281b" stroke-width=".8" transform="rotate(200 30 30)"/>
        <circle cx="30" cy="30" r="1.7" fill="#e0281b"/>`,
        lg(g, '#4a4a4a', '#0d0d0d'));
    },
    maps() {
      const g = uid('mp');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <path d="M0 0h24l-6 22L0 30z" fill="#bfe3a5"/><path d="M38 60l6-20 16-4v24z" fill="#a8d7ef"/>
        <path d="M-2 38L62 14" stroke="#fff" stroke-width="7"/><path d="M-2 38L62 14" stroke="#f7c843" stroke-width="4"/>
        <path d="M18 -2L34 62" stroke="#fff" stroke-width="5"/><path d="M48 -2L40 62" stroke="#fff" stroke-width="3"/>
        <path d="M26 40c3-7 9-11 16-12" stroke="#2e7cf6" stroke-width="2.6" fill="none" stroke-dasharray="0" stroke-linecap="round"/>
        <path d="M38 23.5l5.5 4.2-6.2 2.5z" fill="#2e7cf6"/>
        <path d="M10 9h13v6c0 4-3 6.5-6.5 8-3.5-1.5-6.5-4-6.5-8z" fill="#2465c8" stroke="#fff" stroke-width="1.2"/>
        <text x="16.5" y="17.2" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="6.5" fill="#fff">280</text>`,
        lg(g, '#f4f1e8', '#ddd7c6'));
    },
    videos() {
      const g = uid('vd');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <rect x="9" y="24" width="42" height="24" rx="2" fill="#1d1f22"/>
        <g transform="rotate(-14 9 22)"><rect x="9" y="15" width="42" height="8" fill="#26292d"/>
        <path d="M14 15l-4 8h5l4-8zM24 15l-4 8h5l4-8zM34 15l-4 8h5l4-8zM44 15l-4 8h5l4-8z" fill="#f2f2f2"/></g>
        <path d="M14 29h32M14 35h32M14 41h20" stroke="#4c5056" stroke-width="2"/>`,
        lg(g, '#b8e2ff', '#2f7fd0'));
    },
    notes() {
      const g = uid('nt'), t = uid('ntt');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <rect width="60" height="13" fill="url(#${t})"/><path d="M0 13h60" stroke="#5a3a18" stroke-width="1"/>
        <g stroke="#c9b58a" stroke-width=".9"><path d="M0 22h60M0 30h60M0 38h60M0 46h60M0 54h60"/></g>
        <path d="M11 13v47M13 13v47" stroke="#e8a3a0" stroke-width=".7"/>
        <path d="M17 27c3-2 5 2 8 0s5-2 8 0M17 35c4-2 6 1 10 0" stroke="#5b4a3a" stroke-width="1.1" fill="none" stroke-linecap="round"/>`,
        lg(g, '#fff6c4', '#f2df8a') + lg(t, '#9c6a3b', '#6b4321'));
    },
    reminders() {
      const g = uid('rm');
      const row = (y, c) => `<circle cx="15" cy="${y}" r="4" fill="none" stroke="${c}" stroke-width="1.6"/><path d="M23 ${y}h26" stroke="#bdbdbd" stroke-width="1.2"/>`;
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <rect x="0" y="0" width="60" height="8" fill="#e6e6e6"/>
        ${row(18, '#f08a24')}${row(30, '#3a8de0')}${row(42, '#66bb33')}
        <path d="M12.5 29.5l2 2.3 4-5" stroke="#3a8de0" stroke-width="1.6" fill="none"/>`,
        lg(g, '#ffffff', '#ececec'));
    },
    appstore() {
      const g = uid('as'), c = uid('asc');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <circle cx="30" cy="30" r="21" fill="url(#${c})" stroke="rgba(255,255,255,.7)" stroke-width="1.6"/>
        <path d="M21 41l11-22M39 41L28 19M19.5 34.5h21" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`,
        lg(g, '#82c8ff', '#1c63c9') + lg(c, '#4aa6f5', '#1758b8'));
    },
    itunes() {
      const g = uid('it');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <circle cx="30" cy="30" r="21" fill="none" stroke="#fff" stroke-width="2.4"/>
        <path d="M26 39V20l12-3v19" stroke="#fff" stroke-width="2.6" fill="none"/>
        <ellipse cx="23.2" cy="39.5" rx="3.6" ry="2.9" fill="#fff"/><ellipse cx="35.2" cy="36.5" rx="3.6" ry="2.9" fill="#fff"/>`,
        lg(g, '#e17bf2', '#7a23b8'));
    },
    music() {
      const g = uid('mu');
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>
        <path d="M24 42V19l19-4v22" stroke="#fff" stroke-width="3.4" fill="none" stroke-linejoin="round"/>
        <ellipse cx="19.5" cy="42.5" rx="5.6" ry="4.5" fill="#fff"/><ellipse cx="38.5" cy="37.5" rx="5.6" ry="4.5" fill="#fff"/>`,
        lg(g, '#ffae4a', '#e5541b'));
    },
    settings() {
      const g = uid('st');
      const gear = (cx, cy, r, teeth) => {
        let d = '';
        for (let i = 0; i < teeth; i++) { const a = i * 360 / teeth; d += `<rect x="${cx - r * .16}" y="${cy - r * 1.18}" width="${r * .32}" height="${r * .4}" rx="${r * .05}" transform="rotate(${a} ${cx} ${cy})"/>`; }
        return `<g fill="#55595e">${d}<circle cx="${cx}" cy="${cy}" r="${r}"/></g><circle cx="${cx}" cy="${cy}" r="${r * .55}" fill="#c9cdd1"/><circle cx="${cx}" cy="${cy}" r="${r * .25}" fill="#55595e"/>`;
      };
      return svg(`<rect width="60" height="60" fill="url(#${g})"/>${gear(25, 27, 13, 12)}${gear(42, 43, 8, 9)}`,
        lg(g, '#dfe2e5', '#8a9096'));
    },
  };

  const LABELS = {
    phone: '电话', messages: '信息', safari: 'Safari', chat: 'KakaoTalk', calendar: '日历', photos: '照片', camera: '相机',
    weather: '天气', clock: '时钟', maps: '地图', videos: '视频', notes: '备忘录', reminders: '提醒事项', appstore: 'App Store',
    itunes: 'iTunes', settings: '设置', music: '音乐',
  };
  window.RETRO_ICONS = { draw: (id, now, story) => (ICONS[id] ? ICONS[id](now, story) : ''), has: (id) => !!ICONS[id], LABELS };
})();
