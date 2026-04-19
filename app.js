// ═══════════════════════════════════════════════════════
//  app.js  —  Tüm sayfalarda çalışan ortak sistem
//  Yeni sayfa eklerken sadece bu dosyayı yükle, başka
//  bir şey yazma. Tema, dil, nav, reveal hepsi buradan.
// ═══════════════════════════════════════════════════════

const APP = (() => {

  // ── DURUM ──────────────────────────────────────────
  const state = {
    theme: localStorage.getItem('pref_theme') || 'dark',
    lang:  localStorage.getItem('pref_lang')  || 'tr',
  };

  // ── TEMA ───────────────────────────────────────────
  function applyTheme(t) {
    state.theme = t;
    localStorage.setItem('pref_theme', t);
    document.documentElement.setAttribute('data-theme', t);
    // Tüm tema butonlarını güncelle (birden fazla olabilir)
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
    });
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  // ── DİL ────────────────────────────────────────────
  // Statik çeviriler: her sayfa kendi çevirilerini
  // APP.registerStrings() ile kaydeder
  let _strings = {};

  function registerStrings(strings) {
    _strings = strings;
    applyStrings();
  }

  function applyStrings() {
    const t = _strings[state.lang] || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t[el.getAttribute('data-i18n')];
      if (v !== undefined) el.innerHTML = v;
    });
    document.documentElement.lang = state.lang;
    // Dil butonlarını güncelle
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === state.lang);
    });
  }

  function setLang(l) {
    state.lang = l;
    localStorage.setItem('pref_lang', l);
    applyStrings();
    // Sayfa özel callback varsa çağır
    if (typeof window._onLangChange === 'function') window._onLangChange(l);
  }

  // ── NAV SCROLL ─────────────────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ── SCROLL REVEAL ──────────────────────────────────
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Dinamik olarak eklenen elemanlar için
    window.APP_observeReveal = (el) => observer.observe(el);
  }

  // ── BAŞLANGIÇ (DOM hazır olunca) ───────────────────
  function init() {
    // Temayı uygula (flash'ı önlemek için head'de de var ama burada butonları günceller)
    applyTheme(state.theme);

    // Dil butonları
    applyStrings();

    // Click handler'ları: data attribute ile tanımlanan butonlar
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-theme-btn]')) toggleTheme();
      const langBtn = e.target.closest('[data-lang-btn]');
      if (langBtn) setLang(langBtn.getAttribute('data-lang-btn'));
    });

    initNav();
    initReveal();
  }

  // DOM hazır olunca init et
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── PUBLIC API ─────────────────────────────────────
  return {
    get lang()  { return state.lang;  },
    get theme() { return state.theme; },
    setLang,
    toggleTheme,
    applyTheme,
    registerStrings,
    applyStrings,
  };

})();
