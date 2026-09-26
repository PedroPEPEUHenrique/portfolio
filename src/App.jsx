import { useEffect } from 'react';
import Abertura from './components/Abertura';
import Projetos from './components/Projetos';
import { Competencias, Processo, Sobre, Contato } from './components/Resto';
import { useReveal } from './components/bits';

export default function App() {
  useReveal();

  /* libera a entrada lateral da primeira dobra */
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => document.documentElement.classList.add('ready'))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
      <Abertura />
      <Projetos />
      <Competencias />
      <Processo />
      <Sobre />
      <Contato />
    </main>
  );
}
