import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { perfil } from '../content';
import { Contador } from './bits';

const CARGOS = ['Full Stack Júnior', 'Frontend com React', 'APIs em camadas', 'Docker e CI/CD'];

function CargoRotativo() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [apagando, setApagando] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(CARGOS[0].length); return; }
    const alvo = CARGOS[i];
    const pronto = n === alvo.length;
    const vazio = n === 0;

    let espera = apagando ? 45 : 80;
    if (pronto && !apagando) espera = 1600;
    if (vazio && apagando) espera = 260;

    const t = setTimeout(() => {
      if (pronto && !apagando) { setApagando(true); return; }
      if (vazio && apagando) { setApagando(false); setI((v) => (v + 1) % CARGOS.length); return; }
      setN((v) => v + (apagando ? -1 : 1));
    }, espera);
    return () => clearTimeout(t);
  }, [i, n, apagando]);

  return (
    <span>
      {CARGOS[i].slice(0, n)}
      <span className="cursor text-[var(--color-yellow)]" aria-hidden="true">|</span>
    </span>
  );
}

export default function Abertura() {
  return (
    <section id="inicio" className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16 lg:min-h-svh lg:py-20">

      <p className="tag-line text-ink-faint" data-x style={{ '--d': '0ms' }}>
        Olá, eu sou
      </p>

      <h1 className="mt-5" data-x style={{ '--d': '70ms' }}>
        <span className="block text-[2.1rem] font-light tracking-[.08em] text-ink-soft sm:text-[2.6rem]">
          PEDRO
        </span>
        <span className="display block text-[3.2rem] leading-[.95] sm:text-[4.6rem] lg:text-[5.6rem]">
          HENRIQUE
        </span>
      </h1>

      <p
        className="mono mt-5 text-[.95rem] tracking-[.04em] text-ink-soft sm:text-[1.1rem]"
        data-x style={{ '--d': '140ms' }}
      >
        <CargoRotativo />
      </p>

      <p className="mt-7 max-w-[56ch] text-[.95rem] leading-relaxed text-ink-soft" data-x style={{ '--d': '200ms' }}>
        {perfil.resumo}
      </p>

      <div className="mt-9 flex flex-wrap gap-3" data-x style={{ '--d': '260ms' }}>
        <Button as="a" href="#projetos" variant="primary">Ver projetos</Button>
        <Button
          as="a"
          href="mailto:flashpedro123@gmail.com"
          variant="outline"
          className="border-rule text-ink hover:border-[var(--color-yellow)]"
        >
          Falar comigo
        </Button>
      </div>

      <dl
        className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-rule pt-9 sm:grid-cols-4"
        data-x style={{ '--d': '320ms' }}
      >
        {perfil.numeros.map((v) => (
          <div key={v.rotulo}>
            <dt className="display text-[1.9rem] leading-none text-[var(--color-yellow)]">
              <Contador ate={v.valor} />
            </dt>
            <dd className="tag-line mt-2.5 leading-[1.7] text-ink-faint">{v.rotulo}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
