import { Chip, Button, Meter } from '@heroui/react';
import { competencias, processo, sobre, contatos } from '../content';
import { Marca, Bala } from './bits';

/* As três cores se revezam ao longo das etapas, mas só na barra
   do topo: o âmbar tem 1.8:1 sobre branco e reprovaria como texto. */
const CICLO = [
  'var(--color-yellow)', 'var(--color-green)',
  'var(--color-cyan)', 'var(--color-red)'
];

/* ---------------------------------------------------------
   02 · Competências
   Formato de ficha técnica: rótulo à esquerda, conteúdo à
   direita, uma linha por camada.
   --------------------------------------------------------- */
export function Competencias() {
  return (
    <section id="competencias" className="py-14 sm:py-20">
      <Marca num="02" titulo="Competências" nota="o que eu opero em cada camada" />

      <div className="overflow-hidden rounded-lg border border-rule bg-surface">
        {competencias.map((c, i) => (
          <article
            key={c.id}
            data-reveal
            style={{ '--accent': c.cor }}
            className={`grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10
                        ${i ? 'border-t border-rule' : ''}`}
          >
            <div>
              <h3 className="display flex items-center gap-2.5 text-[1.1rem]">
                <span className="h-4 w-1 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                {c.titulo}
              </h3>
              <p className="tag-line mt-1.5 leading-[1.7] text-ink-faint">{c.nota}</p>

              <Meter value={c.nivel} aria-label={`Domínio em ${c.titulo}`} className="mt-5 max-w-[220px]">
                <div className="flex items-baseline justify-between">
                  <span className="tag-line text-ink-faint">domínio</span>
                  <Meter.Output className="mono text-[10px] text-ink-soft" />
                </div>
                <Meter.Track className="mt-2"><Meter.Fill /></Meter.Track>
              </Meter>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[18px]">
                {c.logos.map((l) => <i key={l} className={l} />)}
              </div>
            </div>

            <ul className="grid gap-y-3 self-center sm:grid-cols-2 sm:gap-x-8">
              {c.itens.map((t) => (
                <li key={t} className="flex gap-3 text-[.87rem] leading-relaxed text-ink-soft">
                  <Bala />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   03 · Processo
   Formato de trilha horizontal, cinco etapas lado a lado.
   --------------------------------------------------------- */
export function Processo() {
  return (
    <section id="processo" className="py-14 sm:py-20">
      <Marca num="03" titulo="Processo" nota="do primeiro contato ao link no ar" />

      {/* um único gatilho de revelação no bloco todo: com um por
          etapa, uma falha deixaria a moldura cinza sem os itens */}
      <ol
        data-reveal
        className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5"
      >
        {processo.map((p, i) => (
          <li
            key={p.num}
            className="relative bg-surface p-6 pt-7"
            style={{ '--accent': CICLO[i % CICLO.length] }}
          >
            <span className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)]" aria-hidden="true" />
            <span className="mono text-[11px] tracking-[.14em] text-ink-faint">{p.num}</span>
            <h3 className="display mt-3 text-[1rem]">{p.titulo}</h3>
            <p className="mt-2 text-[.84rem] leading-relaxed text-ink-soft">{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------
   04 · Sobre
   --------------------------------------------------------- */
export function Sobre() {
  return (
    <section id="sobre" className="py-14 sm:py-20">
      <Marca num="04" titulo="Sobre" nota="de onde vem o meu jeito de programar" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]" data-reveal>
        <div className="rounded-lg border border-rule bg-surface p-7 sm:p-9">
          {sobre.paragrafos.map((p, i) => (
            <p key={i} className="mb-4 max-w-[64ch] text-[.93rem] leading-relaxed text-ink-soft last:mb-0">{p}</p>
          ))}
          <div className="mt-7 flex flex-wrap gap-2">
            {sobre.marcas.map((m) => <Chip key={m} variant="soft" size="sm">{m}</Chip>)}
          </div>
        </div>

        <dl className="h-fit overflow-hidden rounded-lg border border-rule bg-surface">
          {sobre.fatos.map((f, i) => (
            <div key={f.chave} className={`px-7 py-4 ${i ? 'border-t border-rule' : ''}`}>
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
   05 · Contato
   Faixa escura para fechar a página com peso.
   --------------------------------------------------------- */
export function Contato() {
  return (
    <section id="contato" className="pb-12 pt-14 sm:pb-16 sm:pt-20">
      <Marca num="05" titulo="Contato" nota="email, LinkedIn e GitHub" />

      <div className="overflow-hidden rounded-lg bg-deep text-white" data-reveal>
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:p-12">
          <div>
            <h3 className="display max-w-[16ch] text-[1.6rem] sm:text-[2.1rem]">
              Me conta a ideia. Eu respondo com o caminho.
            </h3>
            <p className="mt-4 max-w-[46ch] text-[.9rem] leading-relaxed text-white/60">
              Disponível para novos projetos, em Goiânia ou remoto. Respondo o mais rápido possível.
            </p>
          </div>

          <ul className="self-center">
            {contatos.map((c, i) => (
              <li key={c.chave} className={i ? 'border-t border-white/12' : ''}>
                <a
                  href={c.href}
                  target={c.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener"
                  className="group flex items-center gap-5 py-3.5 transition-colors hover:text-white"
                >
                  <span className="tag-line w-20 shrink-0 text-white/40">{c.chave}</span>
                  <span className="min-w-0 flex-1 truncate text-[.95rem] font-semibold text-white/85 transition-colors group-hover:text-white">
                    {c.valor}
                  </span>
                  <span className="mono shrink-0 text-white/35 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/12 px-8 py-5 sm:px-10 lg:px-12">
          <span className="mono grid size-9 place-items-center rounded-md border border-white/25 text-[11px]">PEU</span>
          <span className="flex-1 text-[11.5px] text-white/45">
            © 2026 Pedro Henrique · Desenvolvedor Full Stack Júnior
          </span>
          <a href="#perfil" className="tag-line text-white/55 transition-colors hover:text-white">Voltar ao topo</a>
        </div>
      </div>
    </section>
  );
}
