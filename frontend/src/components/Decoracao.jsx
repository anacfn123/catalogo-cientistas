const cor = (nome) => ({ fill: `var(--${nome})` });
  
const traco = (nome, largura) => ({
  fill: 'none',
  stroke: `var(--${nome})`,
  strokeWidth: largura,
  strokeLinecap: 'round',
});

export function Paisagem() {
  return (
    <svg viewBox="0 0 520 380" width="100%" role="img" aria-label="Ilustração de ciência: átomo, frasco, microscópio e DNA entre folhas e colinas">
      <circle cx="350" cy="95" r="58" style={cor('amarelo')} />


      <path d="M45 305C25 235 55 180 95 165C110 220 95 275 45 305Z" style={cor('verde')} />
      <path d="M85 305C68 260 90 228 118 218C126 258 114 288 85 305Z" style={cor('verde')} />
      <path d="M500 310C480 265 490 225 508 205C514 250 510 280 500 310Z" style={cor('verde')} />


      {[0, 60, 120].map((giro) => (
        <ellipse key={giro} cx="150" cy="100" rx="62" ry="20" transform={`rotate(${giro} 150 100)`} style={traco('azul', 3)} />
      ))}
      <circle cx="150" cy="100" r="12" style={cor('amarelo')} />
      <circle cx="212" cy="100" r="7" style={cor('rosa')} />
      <circle cx="181" cy="154" r="7" style={cor('azul')} />
      <circle cx="181" cy="46" r="7" style={cor('verde')} />
      <circle cx="62" cy="128" r="6" style={cor('verde')} />
      <circle cx="232" cy="130" r="5" style={cor('rosa')} />


      <rect x="168" y="164" width="44" height="8" rx="3" style={cor('azul')} />
      <path d="M176 172V220L125 300Q116 318 138 318H242Q264 318 255 300L204 220V172Z" style={{ ...cor('azul'), fillOpacity: 0.25, stroke: 'var(--azul)', strokeWidth: 4, strokeLinejoin: 'round' }} />
      <path d="M134 285Q160 273 190 285T246 285L255 300Q264 318 242 318H138Q116 318 125 300Z" style={cor('rosa')} />
      <circle cx="165" cy="298" r="5" style={cor('creme')} />
      <circle cx="184" cy="292" r="4" style={cor('creme')} />
      <circle cx="204" cy="306" r="3" style={cor('creme')} />


      <g style={cor('azul')}>
        <g transform="rotate(33 335 180)">
          <rect x="325" y="118" width="20" height="14" rx="2" />
          <rect x="323" y="132" width="24" height="80" rx="3" />
          <rect x="328" y="212" width="14" height="14" rx="2" />
        </g>
        <rect x="288" y="238" width="60" height="7" rx="3" />
        <rect x="330" y="245" width="16" height="58" />
        <rect x="300" y="302" width="100" height="16" rx="7" />
      </g>
      <path d="M356 224C408 230 414 290 372 304" style={traco('azul', 16)} />
      <circle cx="352" cy="222" r="11" style={{ ...cor('azul'), stroke: 'var(--creme)', strokeWidth: 3 }} />


      <path d="M448 170C448 207 482 207 482 244C482 281 448 281 448 318" style={traco('rosa', 7)} />
      <path d="M482 170C482 207 448 207 448 244C448 281 482 281 482 318" style={traco('azul', 7)} />
      <path d="M455 184H475M455 200H475M458 214H472M458 274H472M455 288H475M455 304H475" style={traco('azul', 3)} />


      <path d="M0 316C85 284 170 296 255 318S440 322 520 296V380H0Z" style={cor('verde')} />
      <path d="M0 336C95 310 180 324 265 338S440 342 520 322V380H0Z" style={cor('laranja')} />
      <path d="M0 360C105 334 200 348 295 357S455 357 520 345V380H0Z" style={cor('azul')} />
    </svg>
  );
}

export function Colinas() {
  return (
    <svg viewBox="0 0 1280 70" width="100%" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', height: 70 }}>
      <path d="M0 40C160 0 320 60 520 30S900 0 1100 35 1230 50 1280 30V70H0Z" style={cor('verde')} />
      <path d="M0 55C200 25 400 65 640 45S1040 25 1280 55V70H0Z" style={cor('laranja')} />
    </svg>
  );
}

export function Marca() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <circle cx="11" cy="11" r="9" style={cor('amarelo')} />
      <path d="M12 28C8 18 16 8 28 8C28 20 22 28 12 28Z" style={cor('rosa')} />
    </svg>
  );
}