import { useEffect, useState } from 'react';
import TextoRolante from './TextoRolante';
import Icone from './Icones';

/* Trilho fixo à esquerda, no espírito das referências: marca em
   cima, navegação vertical no meio, canais e assinatura embaixo.
   No celular ele vira uma barra com menu que desliza. */

const SECOES = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'projetos', rotulo: 'Projetos' },
  { id: 'competencias', rotulo: 'Stack' },
  { id: 'processo', rotulo: 'Processo' },
  { id: 'contato', rotulo: 'Contato' }
];

const CANAIS = [
  { nome: 'GitHub', href: 'https://github.com/PedroPEPEUHenrique' },
  { nome: 'LinkedIn', href: 'https://www.linkedin.com/in/pedropepeuhenrique/' },
  { nome: 'Instagram', href: 'https://www.instagram.com/dev.pepeu/' }
];

export default function Trilho() {
  const [ativa, setAtiva] = useState('inicio');
  const [aberto, setAberto] = useState(false);

  /* marca a seção corrente pela posição, sem depender de observador */
  useEffect(() => {
    const alvos = SECOES.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!alvos.length) return;

    let pendente = false;
    const medir = () => {
      const linha = scrollY + innerHeight * 0.3;
      let atual = alvos[0];
      for (const el of alvos) {
        if (el.getBoundingClientRect().top + scrollY <= linha) atual = el;
      }
      setAtiva(atual.id);
    };
    const aoRolar = () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(() => { medir(); pendente = false; });
    };
    addEventListener('scroll', aoRolar, { passive: true });
    addEventListener('resize', aoRolar);
    medir();
    return () => { removeEventListener('scroll', aoRolar); removeEventListener('resize', aoRolar); };
  }, []);

  return (
    <aside className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-deep lg:inset-y-0 lg:right-auto lg:w-[248px] lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between px-5 lg:h-auto lg:flex-col lg:items-stretch lg:px-0 lg:py-9">

        {/* marca */}
        <a href="#inicio" className="flex items-center gap-3 lg:flex-col lg:gap-2 lg:px-7">
          <span className="display text-[1.35rem] leading-none">
            PEU<span className="text-[var(--color-yellow)]">.</span>
          </span>
          <span className="tag-line text-ink-faint lg:mt-1">Pedro Henrique</span>
        </a>

        <button
          className="grid size-10 place-items-center rounded-md border border-rule lg:hidden"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
        >
          <span className="relative block h-3 w-4">
            <i className={`absolute inset-x-0 block h-px bg-ink transition-transform duration-300 ${aberto ? 'top-1.5 rotate-45' : 'top-0.5'}`} />
            <i className={`absolute inset-x-0 block h-px bg-ink transition-transform duration-300 ${aberto ? 'top-1.5 -rotate-45' : 'top-2.5'}`} />
          </span>
        </button>

        {/* navegação */}
        <nav
          className={`absolute inset-x-0 top-16 border-b border-rule bg-deep px-5 py-3 transition-transform duration-400
                      lg:static lg:mt-12 lg:block lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:transition-none
                      ${aberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {SECOES.map((s) => {
            const on = ativa === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setAberto(false)}
                className={`rolante-alvo group relative flex items-center gap-3 py-2.5 text-[.88rem] transition-colors lg:px-7
                            ${on ? 'text-ink' : 'text-ink-faint hover:text-ink'}`}
              >
                <span
                  className={`h-4 w-[2px] shrink-0 transition-all duration-300
                              ${on ? 'bg-[var(--color-yellow)]' : 'bg-transparent group-hover:bg-rule'}`}
                  aria-hidden="true"
                />
                <TextoRolante intensidade="leve">{s.rotulo}</TextoRolante>
              </a>
            );
          })}

          {/* canais e assinatura, só no trilho largo */}
          <div className="mt-8 hidden px-7 lg:block">
            <span className="tag-line text-ink-faint">Siga</span>
            <div className="mt-3 flex gap-2">
              {CANAIS.map((c) => (
                <a
                  key={c.nome}
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={c.nome}
                  className="grid size-9 place-items-center rounded-md border border-rule text-ink-faint
                             transition-colors hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)]"
                >
                  <Icone nome={c.nome} className="size-4" />
                </a>
              ))}
            </div>
            <p className="mt-7 text-[10px] leading-relaxed text-ink-faint">
              © 2026 Pedro Henrique<br />Goiânia, GO
            </p>
          </div>
        </nav>
      </div>
    </aside>
  );
}
