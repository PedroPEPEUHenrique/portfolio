import { useEffect, useState } from 'react';

const ESPERA = 900;
const SAIDA = 980;

export default function Cortina() {
  const [saindo, setSaindo] = useState(false);
  const [fim, setFim] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setFim(true); return; }

    const t1 = setTimeout(() => setSaindo(true), ESPERA);
    const t2 = setTimeout(() => setFim(true), ESPERA + SAIDA);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = fim ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [fim]);

  if (fim) return null;

  return (
    <div className={`cortina ${saindo ? 'sai' : ''}`} aria-hidden="true">
      <div className="w-[min(280px,72vw)] text-center">
        <span className="mono mx-auto grid h-12 w-12 place-items-center rounded-md border border-white/25 text-[13px] tracking-[.06em] text-white">
          PEU
        </span>

        <p className="tag-line mt-5 text-white/55">Pedro Henrique</p>

        <span className="cortina-barra mt-5 block h-px w-full bg-white/15">
          <i className="bg-[var(--color-yellow)]" />
        </span>

        <span className="cortina-ponto mx-auto mt-6 block size-1.5 rounded-full bg-[var(--color-yellow)]" />
      </div>
    </div>
  );
}
