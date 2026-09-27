import { Button } from '@heroui/react';
import { perfil } from '../content';
import { Contador } from './bits';

export default function Abertura() {
  return (
    <header id="perfil" className="pt-10 sm:pt-16">

      {/* cartão de apresentação: painel escuro à esquerda com a
          identidade, texto e números no claro à direita */}
      <div className="grid overflow-hidden rounded-lg border border-rule bg-surface lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">

        <div className="relative bg-deep p-8 text-white sm:p-10 lg:p-12" data-x style={{ '--d': '0ms' }}>
          {/* as quatro cores do short assinam o topo do painel */}
          <span className="absolute inset-x-0 top-0 flex h-1" aria-hidden="true">
            <i className="flex-1 bg-[var(--color-yellow)]" />
            <i className="flex-1 bg-[var(--color-green)]" />
            <i className="flex-1 bg-[var(--color-cyan)]" />
            <i className="flex-1 bg-[var(--color-red)]" />
          </span>
          <div className="flex items-center gap-3.5">
            <span className="mono grid h-11 w-11 shrink-0 place-items-center rounded-md border border-white/25 text-[12px] tracking-[.06em]">
              PEU
            </span>
            <div className="leading-tight">
              <strong className="block text-[15px] font-bold tracking-[-.01em]">{perfil.nome}</strong>
              <span className="tag-line text-white/55">{perfil.papel}</span>
            </div>
          </div>

          <p className="mt-8 text-[.92rem] leading-relaxed text-white/70">{perfil.resumo}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* chip próprio: o "soft" da HeroUI some sobre o escuro */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.06] px-3 py-1 text-[11.5px] text-white/85">
              <span className="size-1.5 rounded-full bg-[var(--color-yellow)]" />
              {perfil.status}
            </span>
            <span className="tag-line text-white/40">Goiânia, GO</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Button as="a" href="#projetos" variant="primary" size="sm">Ver projetos</Button>
            <Button
              as="a"
              href="mailto:flashpedro123@gmail.com"
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Falar comigo
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-12" data-x style={{ '--d': '90ms' }}>
          <h1 className="display text-[1.85rem] leading-[1.1] sm:text-[2.5rem] lg:text-[2.8rem]">
            {perfil.frase}
          </h1>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-rule pt-8 sm:grid-cols-4 lg:gap-x-4">
            {perfil.numeros.map((n) => (
              <div key={n.rotulo}>
                <dt className="display text-[1.7rem] leading-none">
                  <Contador ate={n.valor} />
                </dt>
                <dd className="tag-line mt-2 leading-[1.7] text-ink-faint">{n.rotulo}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  );
}
