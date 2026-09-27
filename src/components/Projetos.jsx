import { Card, Chip, Button, Tabs, Alert } from '@heroui/react';
import { projetos } from '../content';
import { Marca } from './bits';

/* o escopo do projeto define a cor do selo */
const SELOS = {
  'Full stack': 'var(--color-green)',
  'Biblioteca': 'var(--color-red)',
  'Front': 'var(--color-yellow)'
};

function Campos({ campos }) {
  if (!campos.length) return null;
  return (
    <div className="mt-5 grid gap-px border border-rule bg-rule sm:grid-cols-2">
      {campos.map((c) => (
        <div key={c.chave} className="min-w-0 bg-surface p-4">
          <span className="tag-line block text-ink-faint">{c.chave}</span>
          <span
            className={
              c.mono
                ? 'mono mt-2 block text-[10.5px] leading-[2] break-words text-ink'
                : 'mt-2 block text-[.85rem] text-ink-soft'
            }
          >
            {c.valor}
          </span>
        </div>
      ))}
    </div>
  );
}

/* As três camadas do Lanche Expresso viram abas: cada uma conta
   o seu papel e em qual repositório mora. */
function Camadas({ camadas }) {
  return (
    <Tabs defaultSelectedKey={camadas[0].nome} className="mt-5">
      <Tabs.List aria-label="Camadas da arquitetura">
        {camadas.map((c) => (
          <Tabs.Tab key={c.nome} id={c.nome} style={{ '--accent': c.cor }}>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: c.cor }} aria-hidden="true" />
              {c.nome}
            </span>
            {/* o indicador vive dentro da aba e escorrega entre elas */}
            <Tabs.Indicator />
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {camadas.map((c) => (
        <Tabs.Panel key={c.nome} id={c.nome}>
          <div className="mt-4 border-l-2 pl-4" style={{ borderColor: c.cor }}>
            <p className="max-w-[70ch] text-[.88rem] leading-relaxed text-ink-soft">{c.oque}</p>
            <p className="mono mt-3 text-[10px] tracking-[.06em] text-ink-faint">{c.onde}</p>
          </div>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

function Ficha({ p }) {
  return (
    <Card variant="default" data-media className="overflow-hidden border-rule bg-surface">
      <Card.Header>
        <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
          <span className="mono pt-2 text-[10.5px] tracking-[.12em] text-ink-faint">{p.num}</span>
          <div className="min-w-0">
            <Card.Title className="display text-[1.35rem] sm:text-[1.7rem]">{p.nome}</Card.Title>
            <Card.Description className="tag-line pt-1">{p.tipo}</Card.Description>
          </div>
          <Chip
            variant="soft"
            size="sm"
            className="sm:ml-auto"
            style={{ '--accent': SELOS[p.selo] ?? 'var(--color-green)' }}
          >
            {p.selo}
          </Chip>
        </div>
      </Card.Header>

      <Card.Content>
        <p className="max-w-[70ch] text-[.92rem] leading-relaxed text-ink-soft">{p.resumo}</p>

        {/* o veredito de arquitetura é o que este dossiê existe para mostrar */}
        <Alert variant="soft" className="mt-6">
          <Alert.Content>
            <Alert.Title className="tag-line">Modelo arquitetural</Alert.Title>
            <Alert.Description className="max-w-[72ch] pt-1 text-[.88rem] leading-relaxed">
              {p.veredito}
            </Alert.Description>
          </Alert.Content>
        </Alert>

        {p.camadas && <Camadas camadas={p.camadas} />}

        {p.naoE && (
          <div className="mt-5 border-l-2 border-ink pl-4">
            <span className="tag-line block text-ink">O que ele não é</span>
            <p className="mt-2 max-w-[72ch] text-[.85rem] leading-relaxed text-ink-soft">{p.naoE}</p>
          </div>
        )}

        <Campos campos={p.campos} />

        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Chip key={s} variant="soft" size="sm">{s}</Chip>
          ))}
        </div>
      </Card.Content>

      <Card.Footer className="flex flex-wrap gap-2">
        {p.links.map((l) => (
          <Button
            key={l.href}
            as="a"
            href={l.href}
            target="_blank"
            rel="noopener"
            variant={p.destaque ? 'primary' : 'outline'}
            size="sm"
          >
            {l.texto}
          </Button>
        ))}
      </Card.Footer>
    </Card>
  );
}

export default function Projetos() {
  return (
    <section id="projetos" className="py-16 sm:py-24">
      <Marca num="02" titulo="Projetos" nota="quatro escopos, quatro arquiteturas" />
      <div className="grid gap-6">
        {projetos.map((p) => <Ficha key={p.id} p={p} />)}
      </div>
    </section>
  );
}
