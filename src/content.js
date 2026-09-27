/* Todo o conteúdo do dossiê num lugar só, para as telas
   ficarem apenas com a composição. */

export const perfil = {
  nome: 'Pedro Henrique',
  papel: 'Desenvolvedor Full Stack Júnior',
  status: 'Disponível para novos projetos',
  frase: 'Escrevo a tela, a API, o banco e o pipeline que coloca tudo no ar.',
  resumo:
    'Sou Pedro Henrique, desenvolvedor full stack júnior em Goiânia. Trabalho no ciclo ' +
    'inteiro de uma aplicação: monto a interface, escrevo a API em camadas, modelo o banco ' +
    'antes de codar, conteinerizo e publico por pipeline. Júnior no tempo de estrada, ' +
    'completo no escopo que fecho sozinho.',
  numeros: [
    { valor: 15, rotulo: 'repositórios públicos' },
    { valor: 4, rotulo: 'projetos detalhados aqui' },
    { valor: 2, rotulo: 'formações em andamento' },
    { valor: 11, rotulo: 'tabelas no maior modelo' }
  ]
};

export const projetos = [
  {
    id: 'lanche',
    num: '01',
    nome: 'Lanche Expresso',
    tipo: 'Aplicativo de delivery · dois repositórios, um sistema',
    selo: 'Full stack',
    destaque: true,
    resumo:
      'Comércio eletrônico de comida para celular, com catálogo por loja, favoritos, carrinho, ' +
      'endereço e acompanhamento de pedido. O cliente é um app Expo em TypeScript e o servidor ' +
      'é uma API REST própria em Node.js com MySQL. Os dois vivem em repositórios separados, ' +
      'mas respondem como um produto só.',
    veredito:
      'Cliente e servidor em três camadas, com backend monolítico organizado em camadas e ' +
      'cliente móvel desacoplado. A separação em dois repositórios é de código, não de ' +
      'execução: continua sendo um único servidor e um único banco.',
    camadas: [
      {
        cor: 'var(--color-yellow)',
        nome: 'Apresentação',
        oque:
          'App Expo, React Native e NativeWind. Rotas por arquivo, estado em stores de auth, ' +
          'carrinho, favoritos e pedidos.',
        onde: 'repo lanche-expresso · TypeScript'
      },
      {
        cor: 'var(--color-green)',
        nome: 'Aplicação',
        oque:
          'API REST em Express. Toda requisição desce por Rota, Controller, Service e Repository. ' +
          'Joi valida a entrada, JWT autentica, um handler central trata o erro.',
        onde: 'repo RassiExpressApi · JavaScript'
      },
      {
        cor: 'var(--color-red)',
        nome: 'Dados',
        oque:
          'MySQL 8 em contêiner, com schema versionado e carga inicial. Onze tabelas, de usuário ' +
          'e empresa a pedido e itens do pedido.',
        onde: 'docker compose · schema.sql'
      }
    ],
    naoE:
      'Não é microsserviços, porque existe um único processo servindo todas as rotas e um banco ' +
      'só. Não é monorepo, porque cada lado tem o próprio versionamento. O corte entre os ' +
      'repositórios segue o destino de publicação, loja de aplicativos de um lado e servidor do ' +
      'outro, e não o domínio do negócio.',
    campos: [
      {
        chave: 'Fluxo de uma requisição',
        valor: 'tela → service do app → HTTP → rota → controller → service → repository → MySQL',
        mono: true
      },
      {
        chave: 'Domínios no servidor',
        valor:
          'Usuário, empresa, categoria, produto, pedido, itens do pedido, favorito, banner e destaque'
      }
    ],
    stack: [
      'React Native', 'Expo', 'TypeScript', 'NativeWind', 'Node.js',
      'Express', 'JWT', 'Joi', 'MySQL', 'Docker'
    ],
    links: [
      { texto: 'Repositório do app', href: 'https://github.com/PedroPEPEUHenrique/lanche-expresso' },
      { texto: 'Repositório da API', href: 'https://github.com/PedroPEPEUHenrique/RassiExpressApi' }
    ]
  },
  {
    id: 'conecta',
    num: '02',
    nome: 'Portal Conecta Escolar',
    tipo: 'Plataforma escolar · web',
    selo: 'Full stack',
    resumo:
      'Ambiente único para atividades, calendário, eventos e comunidade escolar, reunindo alunos, ' +
      'responsáveis e instituição. Inclui as áreas de institucional, feedback, atendimento e as ' +
      'páginas de termos, cookies e LGPD.',
    veredito:
      'Monolito full stack. Interface e API moram no mesmo projeto Next.js, com as rotas de ' +
      'servidor ao lado das páginas e o Supabase como camada de dados gerenciada. Uma base, ' +
      'uma publicação.',
    campos: [
      { chave: 'Organização', valor: 'App Router, uma pasta por área do produto e rotas de API no mesmo espaço' },
      { chave: 'Dados', valor: 'Supabase, com PostgreSQL gerenciado' }
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Supabase'],
    links: [{ texto: 'Ver repositório', href: 'https://github.com/PedroPEPEUHenrique/PortalConectaEscolar' }]
  },
  {
    id: 'renderiz',
    num: '03',
    nome: 'Renderiz',
    tipo: 'Framework de interface · Python',
    selo: 'Biblioteca',
    resumo:
      'Framework para montar interfaces web e mobile em Python, com Virtual DOM próprio, ' +
      'componentes reutilizáveis, carregamento preguiçoso e animações. Foi o projeto que me ' +
      'obrigou a entender por dentro o que um framework de interface faz.',
    veredito:
      'Modular, com núcleo e subsistemas. O Core cuida de VNode, Virtual DOM, comparação de ' +
      'árvores e renderização. Em volta dele ficam Components, com ciclo de vida e propriedades, ' +
      'e Animation, com motor, easing, keyframes e transições.',
    campos: [
      { chave: 'Núcleo', valor: 'VNode → VirtualDOM → DiffPatcher → Renderer', mono: true },
      { chave: 'Distribuição', valor: 'Pacote instalável, com exemplos de uso no repositório' }
    ],
    stack: ['Python', 'Virtual DOM', 'Orientação a componentes'],
    links: [{ texto: 'Ver repositório', href: 'https://github.com/PedroPEPEUHenrique/Renderiz' }]
  },
  {
    id: 'guide',
    num: '04',
    nome: 'Back Guide',
    tipo: 'Página de vendas · funil',
    selo: 'Front',
    resumo:
      'Funil de vendas completo em HTML e CSS, sem nenhuma dependência. A oferta principal, o ' +
      'upsell, o downsell e a página de obrigado ficam em rotas próprias, o que deixa cada etapa ' +
      'leve e fácil de medir.',
    veredito:
      'Páginas estáticas servidas direto, uma por etapa do funil. Sem build, sem runtime e sem ' +
      'estado no servidor, então o custo de hospedar é praticamente zero e a página abre instantânea.',
    campos: [],
    stack: ['HTML', 'CSS', 'Conversão'],
    links: [{ texto: 'Ver repositório', href: 'https://github.com/PedroPEPEUHenrique/PageVendas' }]
  }
];

export const competencias = [
  {
    id: 'interface',
    cor: 'var(--color-yellow)',
    titulo: 'Interface',
    nota: 'Web e mobile na mesma cabeça',
    nivel: 82,
    itens: [
      'React, Next.js e App Router, com componentes reutilizáveis',
      'React Native, Expo e NativeWind, um código para Android e iOS',
      'TypeScript para pegar erro na escrita, não em produção',
      'Estado de carregamento, erro e feedback tratados como parte da tela'
    ],
    logos: [
      'devicon-html5-plain colored', 'devicon-css3-plain colored',
      'devicon-javascript-plain colored', 'devicon-typescript-plain colored',
      'devicon-react-original colored', 'devicon-nextjs-plain colored',
      'devicon-tailwindcss-original colored'
    ]
  },
  {
    id: 'servidor',
    cor: 'var(--color-green)',
    titulo: 'Servidor',
    nota: 'API que outra pessoa consegue ler',
    nivel: 78,
    itens: [
      'APIs REST em Node.js e Express, e também em Python com Django',
      'Separação em Controller, Service e Repository, sempre na mesma ordem',
      'Validação de entrada, autenticação por token e erro tratado em um ponto só',
      'Contrato de rota pensado antes da primeira linha de implementação'
    ],
    logos: [
      'devicon-nodejs-plain colored', 'devicon-express-original colored',
      'devicon-python-plain colored', 'devicon-django-plain colored'
    ]
  },
  {
    id: 'dados',
    cor: 'var(--color-red)',
    titulo: 'Dados',
    nota: 'Modelagem antes de codar',
    nivel: 74,
    itens: [
      'PostgreSQL, MySQL, SQL Server, MongoDB e Supabase',
      'Schema versionado em arquivo, com carga inicial para subir do zero',
      'Relacionamento e integridade definidos no banco, não só no código'
    ],
    logos: [
      'devicon-postgresql-plain colored', 'devicon-mysql-original colored',
      'devicon-mongodb-plain colored', 'devicon-microsoftsqlserver-plain colored'
    ]
  },
  {
    id: 'infra',
    cor: 'var(--color-cyan)',
    titulo: 'Infra e entrega',
    nota: 'Do meu terminal até o ar',
    nivel: 70,
    itens: [
      'Docker e Docker Compose para subir aplicação e banco juntos',
      'Jenkins e GitHub Actions para testar, construir e publicar',
      'Automação com n8n e prática de DevSecOps',
      'Git e GitHub com commits pequenos e histórico legível'
    ],
    logos: [
      'devicon-docker-plain colored', 'devicon-jenkins-plain colored',
      'devicon-githubactions-plain colored', 'devicon-git-plain colored'
    ]
  }
];

export const processo = [
  { num: '01', titulo: 'Conversa', texto: 'Entendo o problema, o público e o prazo antes de falar de tecnologia.' },
  { num: '02', titulo: 'Escopo', texto: 'Defino telas, rotas e prioridades. Você aprova o que vai ser feito antes de eu começar.' },
  { num: '03', titulo: 'Build', texto: 'Front e servidor em paralelo, com commits pequenos e entregas visíveis a cada etapa.' },
  { num: '04', titulo: 'Revisão', texto: 'Testes manuais, ajuste de responsividade e correção das pontas soltas.' },
  { num: '05', titulo: 'Deploy', texto: 'Docker, pipeline de entrega e a aplicação no ar, com suporte depois da entrega.' }
];

export const sobre = {
  paragrafos: [
    'Sou júnior e não escondo isso. O que eu entrego é um júnior que cobre o ciclo inteiro: ' +
      'monta a interface, escreve a API, modela o banco, conteineriza e coloca no ar por ' +
      'pipeline, sem depender de outra pessoa para fechar a ponta.',
    'Minha base vem do suporte técnico, onde treinei o olhar para diagnóstico, estabilidade e ' +
      'causa raiz. Isso virou um jeito de programar: entender o problema antes de escrever a ' +
      'primeira linha e deixar o código legível para quem vem depois.'
  ],
  marcas: ['Clean Code', 'Arquitetura em camadas', 'DevSecOps', 'n8n', 'Figma', 'Vercel'],
  fatos: [
    { chave: 'Formação', valor: 'Análise e Desenvolvimento de Sistemas, cursando' },
    { chave: 'Técnico', valor: 'Desenvolvimento Web e Mobile' },
    { chave: 'Base', valor: 'Suporte técnico, diagnóstico e causa raiz' },
    { chave: 'Local', valor: 'Goiânia, GO, aberto a remoto' }
  ]
};

export const contatos = [
  { chave: 'Email', valor: 'flashpedro123@gmail.com', href: 'mailto:flashpedro123@gmail.com' },
  { chave: 'LinkedIn', valor: '/in/pedropepeuhenrique', href: 'https://www.linkedin.com/in/pedropepeuhenrique/' },
  { chave: 'GitHub', valor: '@PedroPEPEUHenrique', href: 'https://github.com/PedroPEPEUHenrique' },
  { chave: 'Instagram', valor: '@dev.pepeu', href: 'https://www.instagram.com/dev.pepeu/' }
];
