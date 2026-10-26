/* 兼容旧浏览器（比如小红书、微信里旧版本的内置浏览器）。只补缺的，不改新浏览器的行为。 */
(function () {
  if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (a, b) { return typeof a === 'string' ? this.split(a).join(b) : this.replace(a, b); };
  }
  if (!Array.prototype.at) {
    Array.prototype.at = function (i) { i = Math.trunc(i) || 0; if (i < 0) i += this.length; return this[i]; };
  }
  if (!Object.hasOwn) Object.hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  // 旧版 Safari 不认识 (?<!…) 这种写法：认不出就去掉那一段再用
  window.safeRe = function (s, f) {
    try { return new RegExp(s, f); } catch (e) { return new RegExp(String(s).replace(/\(\?<[!=](?:[^()\\]|\\.)*\)/g, ''), f); }
  };
  // 没有 <dialog> 的浏览器：给它一个最简单的弹窗行为
  const d = document.createElement('dialog');
  if (typeof d.showModal !== 'function') {
    const proto = Object.getPrototypeOf(d);
    proto.showModal = function () { this.setAttribute('open', ''); this.style.cssText += ';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;box-shadow:0 0 0 100vmax rgba(0,0,0,.6);'; };
    proto.close = function () { this.removeAttribute('open'); };
  }
})();
