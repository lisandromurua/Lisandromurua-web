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
        if (!raw) return;
        box.querySelector('strong').textContent = Number(raw).toLocaleString('es-AR');
        box.hidden = false;
      })
      .catch(function () {}); // si falla, el pie queda sin contador
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')); });
    });
    setLang(root.getAttribute('data-lang') || 'es');
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
    initVisitCounter();
  });
})();
