/* =========================================================
   Pedro Henrique · interações
   Sem biblioteca de animação. O movimento é lateral e nasce
   de interação (clique, hover, arraste), não da rolagem.
   Se algo aqui falhar, a página continua inteira e legível.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.add('js');

  if (typeof window.lucide !== 'undefined') lucide.createIcons();

  /* ---------------------------------------------------------
     1 · Entrada lateral da primeira dobra
     --------------------------------------------------------- */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
  });

  /* ---------------------------------------------------------
     2 · Faixa corrida
     A animação translada 50%, então o conteúdo precisa estar
     duplicado para o laço não mostrar buraco.
     --------------------------------------------------------- */
  const marquee = $('#marquee');
  if (marquee) {
    const set = $('.marquee-set', marquee);
    if (set) marquee.appendChild(set.cloneNode(true)).setAttribute('aria-hidden', 'true');
  }

  /* ---------------------------------------------------------
     3 · Navegação
     --------------------------------------------------------- */
  const navLinks = $('#navLinks');
  const burger = $('#burger');

  if (burger && navLinks) {
    const close = () => {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') close(); });
  }

  /* marca o link da seção visível */
  const links = $$('.nav-links a');
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  let ticking = false;
  function onScroll() {
    const mark = scrollY + innerHeight * 0.3;
    let current = null;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top + scrollY <= mark) current = sec.id;
    }
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  }
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     4 · Os dois lados: troca lateral
     O painel escondido volta a existir antes do slide e só
     recebe hidden depois, para o leitor de tela acompanhar.
     --------------------------------------------------------- */
  const sideTrack = $('#sideTrack');
  const tabFront = $('#tabFront');
  const tabBack = $('#tabBack');

  /* Mantém o quadro do slider na altura do painel que está à mostra.
     O slider tem overflow hidden, então uma medida defasada cortaria
     conteúdo: um ResizeObserver refaz a conta a cada mudança real. */
  function fitSlider(slider, panel) {
    if (!slider || !panel) return;
    slider.style.height = `${panel.offsetHeight}px`;
  }

  function watchPanels(slider, panels, current) {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => fitSlider(slider, panels[current()]));
    panels.forEach((p) => { if (p) ro.observe(p); });
  }

  if (sideTrack && tabFront && tabBack) {
    const slider = $('#sideSlider');
    const switchEl = $('.switch');
    const panels = [$('#sideFront'), $('#sideBack')];
    const tabs = [tabFront, tabBack];
    let at = 0;

    function showSide(i) {
      at = i;
      /* os dois ficam visíveis durante o deslize */
      panels.forEach((p) => { if (p) p.classList.remove('is-off'); });
      sideTrack.style.transform = `translateX(${-i * 100}%)`;
      switchEl.classList.toggle('is-back', i === 1);
      tabs.forEach((t, n) => {
        t.classList.toggle('is-on', n === i);
        t.setAttribute('aria-selected', String(n === i));
      });
      fitSlider(slider, panels[i]);
      /* o que saiu só desaparece depois que o deslize termina */
      setTimeout(() => {
        panels.forEach((p, n) => { if (p) p.classList.toggle('is-off', n !== i); });
      }, reduced ? 0 : 600);
    }

    tabs.forEach((t, i) => t.addEventListener('click', () => showSide(i)));
    showSide(0);
    watchPanels(slider, panels, () => at);
  }

  /* ---------------------------------------------------------
     5 · Processo: stepper lateral
     --------------------------------------------------------- */
  const stepTrack = $('#stepTrack');
  const stepLine = $('#stepLine');
  const stepTabs = $$('.step-tab');

  if (stepTrack && stepTabs.length) {
    const stepSlider = stepTrack.parentElement;
    const stepPanels = $$('.step-panel', stepTrack);
    let atStep = 0;

    function showStep(i) {
      atStep = i;
      stepPanels.forEach((p) => p.classList.remove('is-off'));
      stepTrack.style.transform = `translateX(${-i * 100}%)`;
      if (stepLine) stepLine.style.transform = `translateX(${i * 100}%)`;
      stepTabs.forEach((t, n) => {
        t.classList.toggle('is-on', n === i);
        t.setAttribute('aria-selected', String(n === i));
      });
      fitSlider(stepSlider, stepPanels[i]);
      setTimeout(() => {
        stepPanels.forEach((p, n) => p.classList.toggle('is-off', n !== i));
      }, reduced ? 0 : 600);
    }
    stepTabs.forEach((t, i) => t.addEventListener('click', () => showStep(i)));
    watchPanels(stepSlider, stepPanels, () => atStep);

    /* setas do teclado andam de lado entre as etapas */
    $('#stepper').addEventListener('keydown', (e) => {
      const at = stepTabs.findIndex((t) => t.classList.contains('is-on'));
      if (e.key === 'ArrowRight') { e.preventDefault(); const n = (at + 1) % stepTabs.length; showStep(n); stepTabs[n].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); const n = (at - 1 + stepTabs.length) % stepTabs.length; showStep(n); stepTabs[n].focus(); }
    });
    showStep(0);
  }

  /* ---------------------------------------------------------
     6 · Trilho dos projetos: setas, arraste e progresso
     --------------------------------------------------------- */
  const rail = $('#rail');
  const railBar = $('#railBar');
  const prev = $('#railPrev');
  const next = $('#railNext');
  const cards = $$('.card');

  if (rail) {
    const maxScroll = () => Math.max(1, rail.scrollWidth - rail.clientWidth);
    const stepBy = () => {
      const card = cards[0];
      if (!card) return 320;
      const gap = parseFloat(getComputedStyle($('.rail-track')).gap) || 18;
      return card.getBoundingClientRect().width + gap;
    };

    function sync() {
      const p = rail.scrollLeft / maxScroll();
      if (railBar) railBar.style.transform = `translateX(${p * 233}%)`;
      if (prev) prev.disabled = rail.scrollLeft < 4;
      if (next) next.disabled = rail.scrollLeft > maxScroll() - 4;
    }
    rail.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();

    if (prev) prev.addEventListener('click', () => rail.scrollBy({ left: -stepBy() }));
    if (next) next.addEventListener('click', () => rail.scrollBy({ left: stepBy() }));

    /* arraste com o ponteiro */
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

    /* a roda vertical empurra o trilho para o lado */
    rail.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = rail.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = rail.scrollLeft >= maxScroll() - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }, { passive: false });

    rail.addEventListener('pointerup', () => { rail.dataset.moved = String(moved); });
  }

  /* ---------------------------------------------------------
     7 · Ficha do projeto: gaveta que entra pela direita
     --------------------------------------------------------- */
  const PROJECTS = {
    conecta: {
      num: '01',
      title: 'Portal Conecta Escolar',
      text: 'Plataforma educacional com API REST para gestão de atividades escolares e da comunidade, reunindo alunos, responsáveis e instituição em um só lugar.',
      facts: [
        ['Arquitetura', 'Monolito full stack'],
        ['Camadas', 'Front e API no mesmo repositório'],
        ['Rotas', 'Next.js App Router']
      ],
      chips: ['Next.js', 'React', 'TypeScript', 'Node.js', 'API REST'],
      link: 'https://github.com/PedroPEPEUHenrique/PortalConectaEscolar'
    },
    lanche: {
      num: '02',
      title: 'Lanche Expresso',
      text: 'App de delivery com React Native, Expo e NativeWind, com backend próprio em Node.js, Express e MySQL. Catálogo, carrinho e fluxo de pedido pensados para o celular.',
      facts: [
        ['Arquitetura', 'Controller, Service e Repository'],
        ['Plataformas', 'Android e iOS'],
        ['Banco', 'MySQL']
      ],
      chips: ['React Native', 'Expo', 'NativeWind', 'Express', 'MySQL'],
      link: 'https://github.com/PedroPEPEUHenrique/lanche-expresso'
    },
    renderiz: {
      num: '03',
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
      num: '04',
      title: 'Back Guide',
      text: 'Página de vendas com foco em conversão, construída com HTML e CSS. Estrutura leve, rápida e direta ao ponto.',
      facts: [
        ['Objetivo', 'Conversão'],
        ['Funil', 'Upsell e Downsell'],
        ['Peso', 'Sem dependências']
      ],
      chips: ['HTML', 'CSS', 'Landing Page'],
      link: 'https://github.com/PedroPEPEUHenrique/PageVendas'
    }
  };

  const drawer = $('#drawer');
  if (drawer) {
    const elNum = $('#drawerNum');
    const elTitle = $('#drawerTitle');
    const elText = $('#drawerText');
    const elFacts = $('#drawerFacts');
    const elChips = $('#drawerChips');
    const elLink = $('#drawerLink');
    let lastFocus = null;

    function open(card) {
      const data = PROJECTS[card.dataset.project];
      if (!data) return;
      lastFocus = card;

      elNum.textContent = data.num;
      elTitle.textContent = data.title;
      elText.textContent = data.text;
      elFacts.innerHTML = data.facts.map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join('');
      elChips.innerHTML = data.chips.map((c) => `<span class="chip">${c}</span>`).join('');
      elLink.href = data.link;

      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      $('.drawer-close', drawer).focus();
    }

    function close() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        /* um arraste no trilho não deve abrir a ficha */
        if (rail && Number(rail.dataset.moved || 0) > 6) return;
        open(card);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });

    $$('[data-close]', drawer).forEach((el) => el.addEventListener('click', close));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  /* ---------------------------------------------------------
     8 · Contadores e barras do perfil
     --------------------------------------------------------- */
  const counters = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      counters.unobserve(el);
      if (reduced) { el.textContent = end + suffix; return; }

      const dur = 1200, t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach((el) => counters.observe(el));

  const bars = $('#bars');
  if (bars) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-filled');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    io.observe(bars);
  }

  /* ---------------------------------------------------------
     9 · A única revelação por rolagem: um deslize curto
     --------------------------------------------------------- */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
  $$('[data-reveal]').forEach((el) => reveal.observe(el));

  /* rede de segurança: nada que já esteja na tela fica invisível */
  addEventListener('load', () => {
    $$('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in');
    });
  });
})();
