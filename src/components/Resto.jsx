import { Chip, Button } from '@heroui/react';
import { competencias, processo, sobre, contatos } from '../content';
import { Marca } from './bits';
import TextoRolante from './TextoRolante';
import Icone from './Icones';

/* ---------------------------------------------------------
   Sobre: texto à esquerda, ficha à direita
   --------------------------------------------------------- */
export function Sobre() {
  return (
    <section id="sobre" className="py-16 sm:py-24">
      <Marca num="01" titulo="Sobre" nota="de onde vem o meu jeito de programar" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-14" data-reveal>
        <div>
          {sobre.paragrafos.map((p, i) => (
            <p key={i} className="mb-4 max-w-[64ch] text-[.94rem] leading-relaxed text-ink-soft last:mb-0">{p}</p>
          ))}
          <div className="mt-7 flex flex-wrap gap-2">
            {sobre.marcas.map((m) => <Chip key={m} variant="soft" size="sm">{m}</Chip>)}
          </div>
          <Button as="a" href="#contato" variant="primary" className="mt-9">Vamos conversar</Button>
        </div>

        <dl className="h-fit overflow-hidden rounded-lg border border-rule bg-surface">
          {sobre.fatos.map((f, i) => (
            <div key={f.chave} className={`px-6 py-4 ${i ? 'border-t border-rule' : ''}`}>
              <dt className="tag-line text-ink-faint">{f.chave}</dt>
              <dd className="mt-1.5 text-[.88rem] font-semibold">{f.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Competências: barras de domínio, como nas fichas de currículo
   --------------------------------------------------------- */
export function Competencias() {
  return (
    <section id="competencias" className="py-16 sm:py-24">
      <Marca num="03" titulo="Stack" nota="o que eu opero em cada camada" />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-16">
        {competencias.map((c) => (
          <article key={c.id} data-reveal style={{ '--accent': c.cor }}>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="display flex items-center gap-2.5 text-[1.05rem]">
                <span className="h-4 w-1 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                {c.titulo}
              </h3>
              <span className="mono text-[11px] text-ink-faint">{c.nivel}%</span>
            </div>
            <p className="tag-line mt-2 text-ink-faint">{c.nota}</p>

            {/* barra fina, no estilo das fichas das referências */}
            <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-rule">
              <span
                className="block h-full rounded-full bg-[var(--accent)] transition-[width] duration-1000 ease-out"
                style={{ width: `${c.nivel}%` }}
              />
            </div>

            <ul className="mt-5 grid gap-y-2.5">
              {c.itens.map((t) => (
                <li key={t} className="flex gap-3 text-[.86rem] leading-relaxed text-ink-soft">
                  <span className="mt-[.55rem] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-[18px] opacity-80">
              {c.logos.map((l) => <i key={l} className={l} />)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Processo: linha do tempo vertical
   --------------------------------------------------------- */
export function Processo() {
  return (
    <section id="processo" className="py-16 sm:py-24">
      <Marca num="04" titulo="Processo" nota="do primeiro contato ao link no ar" />

      <ol className="relative ml-3 border-l border-rule pl-8 sm:ml-4 sm:pl-10">
        {processo.map((p) => (
          <li key={p.num} className="relative pb-9 last:pb-0" data-reveal>
            {/* marco sobre a linha */}
            <span
              className="absolute -left-[calc(2rem+1px)] top-1 grid size-[26px] -translate-x-1/2 place-items-center
                         rounded-full border border-rule bg-canvas sm:-left-[calc(2.5rem+1px)]"
              aria-hidden="true"
            >
              <span className="size-1.5 rounded-full bg-[var(--color-yellow)]" />
            </span>
            <span className="mono text-[11px] tracking-[.14em] text-[var(--color-yellow)]">{p.num}</span>
            <h3 className="display mt-2 text-[1.05rem]">{p.titulo}</h3>
            <p className="mt-2 max-w-[60ch] text-[.88rem] leading-relaxed text-ink-soft">{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------
   Contato: cartões de canal e rodapé
   --------------------------------------------------------- */
export function Contato() {
  return (
    <section id="contato" className="py-16 sm:py-24">
      <Marca num="05" titulo="Contato" nota="email, LinkedIn e GitHub" />

      <h2 className="display max-w-[18ch] text-[1.7rem] sm:text-[2.4rem]" data-reveal>
        Me conta a ideia.{' '}
        <span className="text-[var(--color-yellow)]">Eu respondo com o caminho.</span>
      </h2>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2" data-reveal>
        {contatos.map((c) => (
          <li key={c.chave}>
            <a
              href={c.href}
              target={c.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener"
              className="rolante-alvo group flex items-center gap-4 rounded-lg border border-rule bg-surface px-5 py-4
                         transition-colors hover:border-[var(--color-yellow)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md border border-rule text-ink-faint
                               transition-colors group-hover:border-[var(--color-yellow)] group-hover:text-[var(--color-yellow)]">
                <Icone nome={c.chave} />
              </span>
              <span className="min-w-0">
                <span className="tag-line block text-ink-faint">{c.chave}</span>
                <span className="mt-1 block truncate text-[.92rem] font-semibold">
                  <TextoRolante intensidade="forte">{c.valor}</TextoRolante>
                </span>
              </span>
              <span className="mono ml-auto shrink-0 text-ink-faint transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-16 flex flex-wrap items-center gap-4 border-t border-rule pt-7">
        <span className="display text-[1.1rem]">PEU<span className="text-[var(--color-yellow)]">.</span></span>
        <span className="flex-1 text-[11.5px] text-ink-faint">
          © 2026 Pedro Henrique · Desenvolvedor Full Stack Júnior
        </span>
        <a href="#inicio" className="rolante-alvo tag-line text-ink-faint transition-colors hover:text-ink">
          <TextoRolante intensidade="leve">Voltar ao topo</TextoRolante>
        </a>
      </footer>
    </section>
  );
}
