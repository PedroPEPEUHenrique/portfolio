/* Fundo em mosaico cubista com as cores do short.

   O ladrilho encaixa sem emenda porque as bordas opostas cortam nos
   mesmos pontos: as laterais em y = 0, 35, 75, 120 e o topo e a base
   em x = 0, 55, 120. Assim a peça se repete em qualquer direção sem
   costura aparente.

   Os cacos ficam translúcidos e o conteúdo mora em cartões opacos
   por cima, então o padrão aparece nas margens e nos vãos entre as
   seções sem nunca disputar com o texto.

   A classe "respira" dá um ciclo lento de escala e saturação, o que
   tira do padrão o ar de papel de parede parado.

   No tema escuro a opacidade cai bastante: as cores cheias contra o
   quase preto saltam muito mais do que saltavam sobre o creme, e no
   nível anterior o padrão disputava com o texto. */

const CACOS = [
  { p: '0,0 55,0 42,40 0,35', c: 'var(--color-yellow)' },
  { p: '55,0 120,0 120,35 88,48 42,40', c: 'var(--color-cyan)' },
  { p: '0,35 42,40 32,84 0,75', c: 'var(--color-red)' },
  { p: '42,40 88,48 78,88 32,84', c: 'var(--color-ink)' },
  { p: '88,48 120,35 120,75 78,88', c: 'var(--color-green)' },
  { p: '0,75 32,84 55,120 0,120', c: 'var(--color-cyan)' },
  { p: '32,84 78,88 120,120 55,120', c: 'var(--color-yellow)' },
  { p: '78,88 120,75 120,120', c: 'var(--color-red)' }
];

export default function Mosaico() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <svg className="respira h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="mosaico" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="var(--color-canvas)" />
            {CACOS.map((k, i) => (
              <polygon
                key={i}
                points={k.p}
                fill={k.c}
                stroke="var(--color-canvas)"
                strokeWidth="2.5"
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="var(--color-canvas)" />
        <rect width="100%" height="100%" fill="url(#mosaico)" opacity=".035" />
      </svg>
    </div>
  );
}
