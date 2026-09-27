import { useEffect } from 'react';
import Cortina from './components/Cortina';
import Mosaico from './components/Mosaico';
import Trilho from './components/Trilho';
import Abertura from './components/Abertura';
import Projetos from './components/Projetos';
import { Sobre, Competencias, Processo, Contato } from './components/Resto';
import { useReveal } from './components/bits';

export default function App() {
  useReveal();

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => document.documentElement.classList.add('ready'))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <Cortina />
      <Mosaico />
      <Trilho />

      <main className="relative z-10 px-5 pt-16 sm:px-8 lg:ml-[248px] lg:px-14 lg:pt-0 xl:px-20">
        <div className="mx-auto max-w-[980px]">
          <Abertura />
          <Sobre />
          <Projetos />
          <Competencias />
          <Processo />
          <Contato />
        </div>
      </main>
    </>
  );
}
