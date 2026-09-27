const INTENSIDADE = {
  leve:  { '--rol-skew': '1deg', '--rol-escala': '1.01' },
  media: { '--rol-skew': '2deg', '--rol-escala': '1.025' },
  forte: { '--rol-skew': '3deg', '--rol-escala': '1.04' }
};

function Face({ texto, classe }) {
  return (
    <span className={`rolante-face ${classe}`} aria-hidden="true">
      {Array.from(texto).map((ch, i) => (
        <span key={i} className="rolante-letra" style={{ '--i': i }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

export default function TextoRolante({ children, intensidade = 'media', className = '' }) {
  const texto = String(children);
  return (
    <span className={`rolante ${className}`} style={INTENSIDADE[intensidade]}>
      <span className="sr-only">{texto}</span>
      <Face texto={texto} classe="rolante-a" />
      <Face texto={texto} classe="rolante-b" />
    </span>
  );
}
