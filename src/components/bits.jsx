import { useEffect, useRef, useState } from 'react';

/* Cabeçalho de seção. No lugar do número dentro de um quadrado
   preto, o número fica em versalete na cor da marca e a régua
   corre até o fim da linha. */
export function Marca({ num, titulo, nota }) {
  return (
    <header className="mb-8 sm:mb-10" data-reveal>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="mono text-[11px] tracking-[.14em] text-[var(--accent)]">{num}</span>
        <h2 className="tag-line text-ink">{titulo}</h2>
        <span className="hidden h-px flex-1 bg-rule sm:block" aria-hidden="true" />
        {nota && <span className="tag-line text-ink-faint">{nota}</span>}
      </div>
    </header>
  );
}

/* Marcador de item. Um traço fino vertical, não um quadrado. */
export function Bala({ className = '' }) {
  return (
    <span
      className={`mt-[.55rem] h-3 w-px shrink-0 bg-[var(--accent)] opacity-70 ${className}`}
      aria-hidden="true"
    />
  );
}

/* Conta de zero até o valor quando entra na tela. */
export function Contador({ ate }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(ate); return; }

    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const dur = 1100, t0 = performance.now();
        const passo = (agora) => {
          const p = Math.min((agora - t0) / dur, 1);
          setN(Math.round(ate * (1 - Math.pow(1 - p, 4))));
          if (p < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      });
    }, { threshold: 0.4 });

    io.observe(alvo);
    return () => io.disconnect();
  }, [ate]);

  return <span ref={ref}>{n}</span>;
}

/* Revela os blocos conforme entram na tela.
   O IntersectionObserver é o caminho principal, mas ele não dispara
   em todo contexto, então a checagem por geometria no scroll corre
   junto como rede. Sem ela, um observador silencioso deixaria a
   seção invisível para sempre. */
export function useReveal() {
  useEffect(() => {
    const raiz = document.documentElement;
    const alvos = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!alvos.length) return;

    /* só agora escondemos: se este código não rodasse, tudo ficaria à mostra */
    raiz.classList.add('armed');

    let pendente = false;
    let io = null;

    const desligar = () => {
      removeEventListener('scroll', aoRolar);
      removeEventListener('resize', aoRolar);
    };

    const porGeometria = () => {
      let faltam = 0;
      for (const el of alvos) {
        if (el.classList.contains('in')) continue;
        if (el.getBoundingClientRect().top < innerHeight * 0.94) el.classList.add('in');
        else faltam++;
      }
      if (!faltam) desligar();
    };

    function aoRolar() {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(() => { porGeometria(); pendente = false; });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
      alvos.forEach((el) => io.observe(el));
    }

    addEventListener('scroll', aoRolar, { passive: true });
    addEventListener('resize', aoRolar);
    porGeometria();
    const t = setTimeout(porGeometria, 600);

    return () => { if (io) io.disconnect(); desligar(); clearTimeout(t); };
  }, []);
}
