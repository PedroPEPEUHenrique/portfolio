/* =========================================================
   Pedro Henrique · interações
   GSAP + ScrollTrigger + Lenis + Lucide.
   Regra: se as bibliotecas não carregarem, a página continua
   inteira e legível. Nada de conteúdo invisível.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const motion = hasGSAP && !reduced;
  const canHover = matchMedia('(hover: hover)').matches;

  const EASE = 'expo.out';

  /* ---------------------------------------------------------
     0 · Ícones (Lucide) — antes de qualquer medida de layout
     --------------------------------------------------------- */
  if (typeof window.lucide !== 'undefined') {
    lucide.createIcons();
  }

  if (motion) {
    document.documentElement.classList.add('js-motion');
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------------------------------------------------
     1 · Scroll com inércia
     --------------------------------------------------------- */
  let lenis = null;
  if (motion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = -(parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 74) - 10;
      if (lenis) lenis.scrollTo(target, { offset, duration: 1.25 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     2 · Quebra de palavras em máscara
     Percorre só nós de texto, então spans internos (como o
     gradiente do título) continuam existindo.
     --------------------------------------------------------- */
  function splitWords(el) {
    if (!el || el.dataset.split) return [];
    el.dataset.split = '1';

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      if (!node.nodeValue.trim()) return;
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const mask = document.createElement('span');
        mask.className = 'msk';
        const inner = document.createElement('i');
        inner.textContent = part;
        mask.appendChild(inner);
        frag.appendChild(mask);
      });
      node.parentNode.replaceChild(frag, node);
    });

    return $$('.msk > i', el);
  }

  /* ---------------------------------------------------------
     3 · Abertura
     --------------------------------------------------------- */
  if (motion) {
    /* precisa vir ANTES do timeline: um from() lê o valor final
       na criação, e o CSS deixa [data-reveal] em opacity 0 */
    gsap.set('.hero [data-reveal]', { opacity: 1 });

    const words = splitWords($('.hero-title'));
    const tl = gsap.timeline({ defaults: { ease: EASE } });

    tl.from('.nav-inner > *', { y: -20, opacity: 0, duration: .9, stagger: .06 })
      .fromTo('.hero .chip-live', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .1)
      .from(words, { yPercent: 118, duration: 1.1, stagger: .05 }, .16)
      .fromTo('.hero-visual', { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, .3)
      .fromTo('.hero-sub', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .9 }, .48)
      .fromTo('.hero-tabs', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, .56)
      .fromTo('.hero-actions', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, .64)
      .fromTo('.hero-stats', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .9 }, .72);
  }

  /* ---------------------------------------------------------
     4 · Revelações ao rolar
     --------------------------------------------------------- */
  if (motion) {
    $$('.section-title').forEach((title) => {
      if (title.closest('.hero, .sheet')) return;
      const words = splitWords(title);
      if (!words.length) return;
      gsap.from(words, {
        yPercent: 118, duration: 1.05, ease: EASE, stagger: .04,
        scrollTrigger: { trigger: title, start: 'top 88%', once: true }
      });
    });

    /* grupos escalonados — registrados antes para o reveal
       genérico não animar o mesmo elemento duas vezes */
    const grouped = new Set();
    [['.disc-row', '.disc'], ['.steps', '.step'], ['.tiles', '.tile'], ['.contacts', '.contact']]
      .forEach(([parent, child]) => {
        const wrap = $(parent);
        if (!wrap) return;
        const items = $$(child, wrap);
        items.forEach((i) => grouped.add(i));
        gsap.fromTo(items,
          { y: 34, opacity: 0 },
          {
            y: 0, opacity: 1, duration: .95, ease: EASE, stagger: .07,
            scrollTrigger: { trigger: wrap, start: 'top 85%', once: true }
          }
        );
      });

    $$('[data-reveal]').forEach((el) => {
      if (el.closest('.hero') || grouped.has(el)) return;
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }
      );
    });

    /* parallax nos visuais dos blocos */
    $$('.feature-visual').forEach((el) => {
      gsap.fromTo(el, { y: 38 }, {
        y: -38, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    /* o emblema do hero gira devagar conforme a página rola */
    const heroCore = $('.hero-visual .em-core');
    if (heroCore) {
      gsap.to(heroCore, {
        rotation: 120, transformOrigin: '50% 50%', ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
      });
    }
  }

  /* ---------------------------------------------------------
     5 · Navbar
     --------------------------------------------------------- */
  const nav = $('#nav');
  const progress = $('#progress');
  const links = $$('.nav-links a');
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  let lastY = 0;
  function onScroll() {
    const top = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (top / max) * 100 : 0}%`;

    if (nav) {
      nav.classList.toggle('is-stuck', top > 10);
      const menuOpen = $('.nav-links.is-open');
      nav.classList.toggle('is-hidden', top > lastY && top > 280 && !menuOpen);
    }
    lastY = top;

    const mark = top + innerHeight * 0.3;
    let current = null;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top + top <= mark) current = sec.id;
    }
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  }

  if (lenis) lenis.on('scroll', onScroll);
  else {
    let ticking = false;
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
    }, { passive: true });
  }
  onScroll();

  /* ---------------------------------------------------------
     6 · Menu mobile
     --------------------------------------------------------- */
  const burger = $('#burger');
  const navLinks = $('#navLinks');
  if (burger && navLinks) {
    const close = () => {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.start();
    };
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') close(); });
  }

  /* ---------------------------------------------------------
     7 · Contadores e barras
     --------------------------------------------------------- */
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      counter.unobserve(el);
      if (reduced) { el.textContent = end + suffix; return; }

      const dur = 1500, start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach((el) => counter.observe(el));

  const profile = $('.profile');
  if (profile) {
    const bars = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-filled'), 240);
        bars.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    bars.observe(profile);
  }

  /* ---------------------------------------------------------
     8 · Galeria: arrastar, rolar e progresso
     --------------------------------------------------------- */
  const rail = $('#rail');
  const railBar = $('#railBar');
  const railNow = $('#railNow');
  const cards = $$('.card');

  if (rail) {
    const maxScroll = () => Math.max(1, rail.scrollWidth - rail.clientWidth);

    function syncRail() {
      const p = rail.scrollLeft / maxScroll();
      if (railBar) railBar.style.transform = `translateX(${p * 300}%)`;
      if (railNow) {
        const idx = Math.min(cards.length, Math.round(p * (cards.length - 1)) + 1);
        railNow.textContent = String(idx).padStart(2, '0');
      }
    }
    rail.addEventListener('scroll', syncRail, { passive: true });
    syncRail();

    /* arrastar com o ponteiro */
    let down = false, startX = 0, startLeft = 0, moved = 0;
    rail.addEventListener('pointerdown', (e) => {
      down = true; moved = 0;
      startX = e.clientX; startLeft = rail.scrollLeft;
      rail.classList.add('is-drag');
      rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.abs(dx);
      rail.scrollLeft = startLeft - dx;
    });
    const endDrag = (e) => {
      if (!down) return;
      down = false;
      rail.classList.remove('is-drag');
      try { rail.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);

    /* roda vertical do mouse move o trilho na horizontal */
    rail.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = rail.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = rail.scrollLeft >= maxScroll() - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;   /* deixa a página rolar */
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }, { passive: false });

    /* guarda o arraste para não abrir a ficha sem querer */
    rail.dataset.moved = '0';
    rail.addEventListener('pointerup', () => { rail.dataset.moved = String(moved); });
  }

  /* inclinação 3D dos cartões */
  if (motion && canHover) {
    $$('[data-tilt]').forEach((el) => {
      const max = el.classList.contains('emblem-xl') ? 8 : 11;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        gsap.to(el, {
          rotationY: px * max * 2, rotationX: -py * max * 2,
          transformPerspective: 900, duration: .6, ease: 'power3.out'
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { rotationY: 0, rotationX: 0, duration: .9, ease: 'elastic.out(1, .5)' });
      });
    });
  }

  /* ---------------------------------------------------------
     9 · Ficha do projeto
     --------------------------------------------------------- */
  const PROJECTS = {
    conecta: {
      kicker: 'Projeto 01',
      title: 'Portal Conecta Escolar',
      text: 'Plataforma educacional com API REST para gestão de atividades escolares e da comunidade, reunindo alunos, responsáveis e instituição em um só lugar.',
      facts: [
        ['Arquitetura', 'Monolito full stack'],
        ['Camadas', 'Front + API no mesmo repositório'],
        ['Rotas', 'Next.js App Router']
      ],
      chips: ['Next.js', 'React', 'TypeScript', 'Node.js', 'API REST'],
      link: 'https://github.com/PedroPEPEUHenrique/PortalConectaEscolar'
    },
    lanche: {
      kicker: 'Projeto 02',
      title: 'Lanche Expresso',
      text: 'App de delivery com React Native, Expo e NativeWind, com backend próprio em Node.js, Express e MySQL. Catálogo, carrinho e fluxo de pedido pensados para o celular.',
      facts: [
        ['Arquitetura', 'Controller / Service / Repository'],
        ['Plataformas', 'Android e iOS'],
        ['Banco', 'MySQL']
      ],
      chips: ['React Native', 'Expo', 'NativeWind', 'Express', 'MySQL'],
      link: 'https://github.com/PedroPEPEUHenrique/lanche-expresso'
    },
    renderiz: {
      kicker: 'Projeto 03',
      title: 'Renderiz',
      text: 'Framework Python para interfaces web e mobile de alta performance, com Virtual DOM e componentes reutilizáveis. Um projeto para entender cada peça por dentro.',
      facts: [
        ['Arquitetura', 'Framework modular'],
        ['Núcleo', 'Virtual DOM próprio'],
        ['Modelo', 'Orientado a componentes']
      ],
      chips: ['Python', 'Framework', 'Virtual DOM'],
      link: 'https://github.com/PedroPEPEUHenrique/Renderiz'
    },
    guide: {
      kicker: 'Projeto 04',
      title: 'Back Guide',
      text: 'Página de vendas com foco em conversão, construída com HTML e CSS. Estrutura leve, rápida e direta ao ponto.',
      facts: [
        ['Objetivo', 'Conversão'],
        ['Funil', 'Upsell / Downsell'],
        ['Peso', 'Sem dependências']
      ],
      chips: ['HTML', 'CSS', 'Landing Page'],
      link: 'https://github.com/PedroPEPEUHenrique/PageVendas'
    }
  };

  const sheet = $('#sheet');
  if (sheet) {
    const elKicker = $('#sheetKicker');
    const elTitle = $('#sheetTitle');
    const elText = $('#sheetText');
    const elFacts = $('#sheetFacts');
    const elChips = $('#sheetChips');
    const elLink = $('#sheetLink');
    const elEmblem = $('#sheetEmblem');
    let lastFocus = null;

    function openSheet(card) {
      const data = PROJECTS[card.dataset.project];
      if (!data) return;
      lastFocus = card;

      elKicker.textContent = data.kicker;
      elTitle.textContent = data.title;
      elText.textContent = data.text;

      elFacts.innerHTML = data.facts
        .map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join('');
      elChips.innerHTML = data.chips
        .map((c) => `<span class="chip">${c}</span>`).join('');
      elLink.href = data.link;

      /* o emblema do cartão vai junto para a ficha */
      elEmblem.innerHTML = '';
      const svg = card.querySelector('.em-svg');
      if (svg) elEmblem.appendChild(svg.cloneNode(true));
      elEmblem.style.setProperty('--c1', card.style.getPropertyValue('--c1'));
      elEmblem.style.setProperty('--c2', card.style.getPropertyValue('--c2'));

      sheet.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      if (lenis) lenis.stop();
      $('.sheet-close', sheet).focus();
    }

    function closeSheet() {
      sheet.classList.remove('is-open');
      sheet.setAttribute('aria-hidden', 'true');
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus();
    }

    cards.forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.addEventListener('click', () => {
        /* um arraste no trilho não deve abrir a ficha */
        if (rail && Number(rail.dataset.moved || 0) > 6) return;
        openSheet(card);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(card); }
      });
    });

    $$('[data-sheet-close]', sheet).forEach((el) => el.addEventListener('click', closeSheet));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeSheet();
    });
  }

  /* ---------------------------------------------------------
     10 · Botões magnéticos
     --------------------------------------------------------- */
  if (motion && canHover) {
    $$('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - (r.left + r.width / 2)) * .28,
          y: (e.clientY - (r.top + r.height / 2)) * .28,
          duration: .5, ease: 'power3.out'
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .4)' });
      });
    });
  }

  /* ---------------------------------------------------------
     11 · Recalcula quando fontes e imagens terminarem
     --------------------------------------------------------- */
  if (motion) {
    /* Abrir a página já com âncora (link compartilhado, favorito,
       F5 com hash) faz o navegador saltar de forma nativa. Lenis
       fica achando que está no topo e o ScrollTrigger calcula os
       gatilhos contra a posição errada — a seção de destino
       ficaria presa no estado inicial, invisível. */
    function settleHash() {
      ScrollTrigger.refresh();
      if (!location.hash) return;

      const target = document.querySelector(location.hash);
      if (!target) return;

      const offset = -(parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 74) - 10;

      if (lenis) lenis.scrollTo(target, { offset, immediate: true });
      ScrollTrigger.refresh();

      /* rede de segurança: nada que já esteja na tela pode
         continuar transparente */
      $$('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.95) {
          gsap.set(el, { opacity: 1, y: 0 });
        }
      });
    }

    addEventListener('load', settleHash);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }
})();
