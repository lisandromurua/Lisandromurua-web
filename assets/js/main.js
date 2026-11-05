(function () {
  var root = document.documentElement;

  // ---------- idioma ES / EN ----------
  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });
    var t = document.body.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    var d = document.body.getAttribute('data-desc-' + lang);
    var meta = document.querySelector('meta[name="description"]');
    if (d && meta) meta.setAttribute('content', d);
  }

  // ---------- contador de visitas (GoatCounter) ----------
  function initVisitCounter() {
    var tag = document.querySelector('script[data-goatcounter]');
    var box = document.getElementById('visit-count');
    if (!tag || !box) return;
    var base = tag.getAttribute('data-goatcounter').replace(/\/count$/, '');
    fetch(base + '/counter/TOTAL.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        var raw = String(d.count != null ? d.count : (d.count_unique || '')).replace(/\D/g, '');
        if (!raw || Number(raw) === 0) return; // con 0 visitas no se muestra
        box.querySelector('strong').textContent = Number(raw).toLocaleString('es-AR');
        box.hidden = false;
      })
      .catch(function () {}); // si falla, el pie queda sin contador
  }

  // ---------- videos en bucle: se reproducen solo cuando están en pantalla ----------
  function initLoopVideos() {
    var vids = document.querySelectorAll('video[data-loop]');
    if (!vids.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    vids.forEach(function (v) {
      v.muted = true; v.loop = true; v.playsInline = true;
      if (reduce) { v.controls = true; }
    });
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
  }

  // ---------- proyectos: se muestran 3 filas con difuminado y botón "ver todos" ----------
  function initProjectClamp() {
    var wrap = document.querySelector('.projects-wrap[data-clamp-rows]');
    if (!wrap) return;
    var list = wrap.querySelector('.projects');
    var btn = wrap.querySelector('.projects-more button');
    var rows = Number(wrap.getAttribute('data-clamp-rows')) || 3;
    var open = false;
    function layout() {
      if (open) return;
      wrap.classList.remove('is-clamped');
      var cards = Array.prototype.slice.call(list.children);
      cards.forEach(function (c) { c.removeAttribute('inert'); });
      var tops = [];
      cards.forEach(function (c) { if (tops.indexOf(c.offsetTop) < 0) tops.push(c.offsetTop); });
      if (tops.length <= rows) return; // entran todos: no se recorta
      var last = cards.filter(function (c) { return c.offsetTop === tops[rows - 1]; })[0];
      var rowTop = last.offsetTop - list.offsetTop;
      var visible = Math.round(last.offsetHeight * 0.55);
      list.style.setProperty('--clamp-h', (rowTop + visible) + 'px');
      list.style.setProperty('--fade-h', (visible + 120) + 'px');
      cards.forEach(function (c) { if (c.offsetTop >= tops[rows - 1]) c.setAttribute('inert', ''); });
      wrap.classList.add('is-clamped');
    }
    btn.addEventListener('click', function () {
      open = true;
      wrap.classList.remove('is-clamped');
      Array.prototype.forEach.call(list.children, function (c) { c.removeAttribute('inert'); });
      btn.setAttribute('aria-expanded', 'true');
    });
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(layout, 150); });
    window.addEventListener('load', layout);
    layout();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProjectClamp();
    initLoopVideos();
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')); });
    });
    setLang(root.getAttribute('data-lang') || 'es');
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
    initVisitCounter();
  });
})();
