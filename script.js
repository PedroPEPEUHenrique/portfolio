/* =========================================================
   Pedro Henrique · interações
   Sem efeitos de cursor: só scroll, reveal e a troca de abas.
   ========================================================= */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ---------------------------------------------------------
     1 · Barra de progresso, navbar e link ativo
     --------------------------------------------------------- */
  const nav = $('#nav');
  const progress = $('#progress');
  const links = $$('.nav-links a');
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  let ticking = false;
  function onScroll() {
    const top = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;

    if (progress) progress.style.width = `${max > 0 ? (top / max) * 100 : 0}%`;
    if (nav) nav.classList.toggle('is-stuck', top > 12);

    const mark = top + innerHeight * 0.32;
    let current = null;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top + top <= mark) current = sec.id;
    }
    links.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
    });
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     2 · Menu mobile
     --------------------------------------------------------- */
  const burger = $('#burger');
  const navLinks = $('#navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------
     3 · Reveal ao rolar + contadores + barras
     --------------------------------------------------------- */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  $$('[data-reveal]').forEach((el) => revealer.observe(el));

  const counter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      counter.unobserve(el);

      if (reduced) { el.textContent = end + suffix; return; }

      const dur = 1100;
      const start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach((el) => counter.observe(el));

  const card = $('.profile-card');
  if (card) {
    const bars = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-filled'), 200);
        bars.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    bars.observe(card);
  }

  /* ---------------------------------------------------------
     4 · Marquee infinito (duplica o conteúdo)
     --------------------------------------------------------- */
  const track = $('#marqueeTrack');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------------------------------------------------------
     5 · Efeito de digitação no comentário do código
     --------------------------------------------------------- */
  function startTyping(el) {
    if (!el) return;
    const phrases = (el.dataset.typing || '').split('|').filter(Boolean);
    if (!phrases.length) return;

    if (reduced) { el.textContent = phrases[0]; return; }

    let p = 0, i = 0, deleting = false;

    (function tick() {
      if (!document.body.contains(el)) return;
      const text = phrases[p];
      i += deleting ? -1 : 1;
      el.textContent = text.slice(0, i);

      let wait = deleting ? 40 : 75;
      if (!deleting && i === text.length) { wait = 2200; deleting = true; }
      else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; wait = 320; }

      setTimeout(tick, wait);
    })();
  }
  startTyping($('.typing'));

  /* ---------------------------------------------------------
     6 · Abas da janela do hero (front ↔ back)
     --------------------------------------------------------- */
  const tabs = $$('.window-tabs .tab');
  const codeEl = $('.hero-visual .code code');
  if (tabs.length && codeEl) {
    const views = [codeEl.innerHTML, `<span class="c-key">import</span> { Router } <span class="c-key">from</span> <span class="c-str">"express"</span>;

<span class="c-key">const</span> router = <span class="c-fn">Router</span>();

router.<span class="c-fn">get</span>(<span class="c-str">"/api/pedidos"</span>, <span class="c-key">async</span> (req, res) =&gt; {
  <span class="c-key">const</span> pedidos = <span class="c-key">await</span> pedidoService.<span class="c-fn">listar</span>();

  <span class="c-key">return</span> res.<span class="c-fn">status</span>(<span class="c-ok">200</span>).<span class="c-fn">json</span>({
    <span class="c-attr">itens</span>: pedidos,
    <span class="c-attr">camadas</span>: [<span class="c-str">"controller"</span>, <span class="c-str">"service"</span>, <span class="c-str">"repository"</span>],
    <span class="c-attr">banco</span>: <span class="c-str">"postgres"</span>,
    <span class="c-attr">deploy</span>: <span class="c-str">"docker + jenkins"</span>
  });
});

<span class="c-com">// a mesma tela, do outro lado.</span>`];

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('is-on')) return;
        tabs.forEach((t) => t.classList.remove('is-on'));
        tab.classList.add('is-on');
        codeEl.innerHTML = views[idx];
        if (idx === 0) startTyping(codeEl.querySelector('.typing'));
      });
    });
  }
})();
