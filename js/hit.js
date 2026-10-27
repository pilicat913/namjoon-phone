/* 浏览量：每次打开记一次，只发一个数字，不带任何个人信息。 */
(function () {
  try {
    if (location.protocol !== 'https:' || sessionStorage.getItem('nj-hit')) return;
    sessionStorage.setItem('nj-hit', '1');
    let isNew = false;
    try { isNew = !localStorage.getItem('nj-visitor'); localStorage.setItem('nj-visitor', '1'); } catch (_) {}
    fetch('https://namjoon-feedback.1228088256.workers.dev/hit' + (isNew ? '?new=1' : ''), { method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true, referrerPolicy: 'no-referrer' }).catch(() => {});
  } catch (_) {}
})();
