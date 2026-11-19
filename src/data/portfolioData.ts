export type GalleryCategory =
  | 'Todas'
  | 'Fachadas'
  | 'Interiores'
  | 'Efeitos Decorativos'
  | 'Execução & Proteção';

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: Exclude<GalleryCategory, 'Todas'>;
  description: string;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  project: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const WHATSAPP_NUMBER_DISPLAY = '62 8200-2505';
export const WHATSAPP_NUMBER_E164 = '556282002505';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Todas',
  'Fachadas',
  'Interiores',
  'Efeitos Decorativos',
  'Execução & Proteção',
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'fachada-moderna-grafite',
    src: '/images/fachada-moderna-grafite.jpeg',
    alt: 'Fachada residencial moderna pintada em cinza grafite e textura arenosa',
    title: 'Fachada Moderna em Grafite & Textura',
    category: 'Fachadas',
    description:
      'Pintura externa completa com tinta acrílica premium resistente ao sol e chuva, aliada à textura decorativa no volume frontal.',
  },
  {
    id: 'sala-pe-direito-duplo',
    src: '/images/sala-pe-direito-duplo.jpeg',
    alt: 'Sala residencial com pé-direito duplo, escada plissada e pintura branca acetinada',
    title: 'Sala com Pé-Direito Duplo',
    category: 'Interiores',
    description:
      'Nivelamento com massa corrida, lixamento fino e acabamento acetinado uniforme em paredes altas e escada escultural.',
  },
  {
    id: 'cimento-queimado-gourmet',
    src: '/images/cimento-queimado-gourmet.jpeg',
    alt: 'Parede com efeito cimento queimado marmorizado ao lado de marcenaria escura',
    title: 'Efeito Cimento Queimado Acetinado',
    category: 'Efeitos Decorativos',
    description:
      'Aplicação artesanal em múltiplas demãos com proteção em resina acetinada, realçando profundidade e brilho suave sob iluminação direcionada.',
  },
  {
    id: 'parede-textura-cristais-sala',
    src: '/images/parede-textura-cristais-sala.jpeg',
    alt: 'Parede texturizada com efeito mineral e cristais em sala de estar com painel de TV',
    title: 'Textura Mineral com Cristais na Sala',
    category: 'Efeitos Decorativos',
    description:
      'Revestimento decorativo de alto relevo suave que valoriza o painel principal da sala e cria contraste elegante com o teto liso.',
  },
  {
    id: 'fachada-residencial-finalizada',
    src: '/images/fachada-residencial-finalizada.jpeg',
    alt: 'Fachada residencial moderna finalizada ao entardecer com muros e platibandas em tom neutro',
    title: 'Fachada Residencial & Muros Finalizados',
    category: 'Fachadas',
    description:
      'Acabamento externo completo em tons neutros contemporâneos com recortes precisos junto a esquadrias e portão.',
  },
  {
    id: 'efeito-decorativo-corredor',
    src: '/images/efeito-decorativo-corredor.jpeg',
    alt: 'Detalhe de parede com revestimento decorativo texturizado próximo às portas de madeira',
    title: 'Revestimento Decorativo em Área Social',
    category: 'Efeitos Decorativos',
    description:
      'Recortes limpos ao redor de alizares de madeira, rodapés e iluminação arandela sem respingos.',
  },
  {
    id: 'protecao-piso-lona-apartamento',
    src: '/images/protecao-piso-lona-apartamento.jpeg',
    alt: 'Piso e bancada totalmente protegidos com lona azul e fita crepe antes da pintura',
    title: 'Proteção Completa de Piso e Bancadas',
    category: 'Execução & Proteção',
    description:
      'Isolamento criterioso de porcelanatos, bancadas, esquadrias e luminárias antes de iniciar qualquer aplicação.',
  },
  {
    id: 'pintura-andaime-pe-direito',
    src: '/images/pintura-andaime-pe-direito.jpeg',
    alt: 'Profissional em andaime realizando pintura de parede e teto em pé-direito duplo',
    title: 'Execução em Pé-Direito Duplo',
    category: 'Execução & Proteção',
    description:
      'Estrutura segura de andaimes para alcançar tetos altos e vãos amplos com uniformidade de rolo e iluminação rasante.',
  },
  {
    id: 'fachada-equipe-andaime',
    src: '/images/fachada-equipe-andaime.jpeg',
    alt: 'Pintores trabalhando em andaime na fachada superior e muro de residência moderna',
    title: 'Pintura Externa com Andaimes',
    category: 'Execução & Proteção',
    description:
      'Preparação de base, selador e demãos externas executadas com segurança em pavimentos superiores e platibandas.',
  },
  {
    id: 'acabamento-platibanda-altura',
    src: '/images/acabamento-platibanda-altura.jpeg',
    alt: 'Aplicação de acabamento e massa em beiral e platibanda alta usando andaime',
    title: 'Acabamento de Beiral e Platibanda',
    category: 'Execução & Proteção',
    description:
      'Correção de cantos vivos, emassamento externo e proteção contra infiltrações nas áreas mais expostas ao clima.',
  },
  {
    id: 'pintura-externa-sobrado',
    src: '/images/pintura-externa-sobrado.jpeg',
    alt: 'Sobrado residencial pintado em cinza claro com molduras brancas ao redor das janelas',
    title: 'Renovação Externa de Sobrado',
    category: 'Fachadas',
    description:
      'Repintura integral de fachada residencial com destaque para molduras de janelas em branco neve de alta lavabilidade.',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    number: '01',
    title: 'Pintura Residencial & Alto Padrão',
    description:
      'Preparação meticulosa de superfícies com massa corrida, lixamento fino e demãos uniformes em tintas foscas, acetinadas ou semibrilho para salas, quartos e pé-direito duplo.',
    highlights: ['Massa corrida e nivelamento fino', 'Recortes precisos em rodapés e sancas', 'Acabamento sem marcas de rolo'],
    image: '/images/sala-pe-direito-duplo.jpeg',
    imageAlt: 'Pintura interna de alto padrão em sala com pé-direito duplo',
  },
  {
    number: '02',
    title: 'Fachadas & Trabalho em Altura',
    description:
      'Pintura e repintura de fachadas modernas, muros e platibandas com seladores e tintas elastoméricas ou acrílicas premium, preparadas para resistir ao sol forte e à chuva.',
    highlights: ['Tintas de alta resistência UV', 'Andaimes seguros para pavimentos superiores', 'Correção de fissuras e impermeabilização'],
    image: '/images/fachada-moderna-grafite.jpeg',
    imageAlt: 'Fachada residencial moderna pintada com tinta grafite',
  },
  {
    number: '03',
    title: 'Cimento Queimado & Texturas Decorativas',
    description:
      'Efeitos artesanais que transformam paredes em pontos focais do projeto: cimento queimado aveludado, marmorizado, lamato e texturas minerais com cristais.',
    highlights: ['Cimento queimado e marmorizado', 'Textura com cristais e efeito pedra', 'Aplicação artesanal personalizada'],
    image: '/images/cimento-queimado-gourmet.jpeg',
    imageAlt: 'Parede com efeito cimento queimado acetinado em área gourmet',
  },
  {
    number: '04',
    title: 'Proteção Total & Entrega Limpa',
    description:
      'Cuidado rigoroso com o seu imóvel desde o primeiro dia: lonamento completo de pisos, bancadas, móveis e esquadrias para uma obra organizada e sem respingos.',
    highlights: ['Pisos e móveis protegidos com lona', 'Isolamento de tomadas e metais', 'Limpeza fina na entrega da obra'],
    image: '/images/protecao-piso-lona-apartamento.jpeg',
    imageAlt: 'Ambiente residencial protegido com lona azul antes da pintura',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'dep-1',
    name: 'Ricardo Mendes',
    project: 'Fachada Moderna & Pé-Direito Duplo · Residencial',
    rating: 5,
    text: 'Contratei o Charles para pintar toda a fachada da nossa casa e a sala com pé-direito duplo. O cuidado com a proteção do porcelanato e a perfeição dos recortes nos impressionaram do início ao fim.',
  },
  {
    id: 'dep-2',
    name: 'Camila Ferreira',
    project: 'Cimento Queimado & Pintura Interna · Apartamento',
    rating: 5,
    text: 'O efeito cimento queimado na área gourmet ficou exatamente como eu imaginava. Cumpriram o prazo combinado à risca, trabalharam com muita organização e entregaram tudo limpo.',
  },
  {
    id: 'dep-3',
    name: 'Eduardo & Patrícia Alves',
    project: 'Textura Cristais & Repintura Geral · Casa Térrea',
    rating: 5,
    text: 'Já tivemos outras experiências ruins com obra, mas o trabalho do Charles Pintor foi outro nível. A parede com textura na sala de TV valorizou todo o ambiente e não ficou um único respingo no piso.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Como funciona o orçamento com o Charles Pintor?',
    answer:
      'O orçamento é rápido e sem compromisso. Você pode enviar fotos, medidas aproximadas ou o tipo de serviço desejado diretamente pelo WhatsApp (62) 8200-2505 ou pelo formulário desta página para agendar uma visita técnica ou receber uma estimativa detalhada.',
  },
  {
    id: 'faq-2',
    question: 'Os pisos, móveis e bancadas ficam protegidos durante a pintura?',
    answer:
      'Sim. Antes de abrir qualquer lata de tinta, realizamos o isolamento completo do ambiente com lonas resistentes, papelão ondulado quando necessário e fita automotiva/crepe em rodapés, esquadrias, interruptores e bancadas.',
  },
  {
    id: 'faq-3',
    question: 'Vocês atendem serviços em pé-direito duplo e fachadas altas?',
    answer:
      'Sim. Possuímos estrutura com andaimes e equipamentos adequados para executar pintura interna em pé-direito duplo, escadas, beirais, platibandas e fachadas de sobrados com segurança e uniformidade.',
  },
  {
    id: 'faq-4',
    question: 'Qual a diferença entre tinta fosca, acetinada e cimento queimado?',
    answer:
      'A tinta fosca disfarça pequenas imperfeições da parede e traz visual elegante e aveludado. A acetinada oferece leve brilho e excelente lavabilidade, ideal para áreas de circulação. Já o cimento queimado é um efeito decorativo artesanal que cria textura visual sofisticada em paredes de destaque.',
  },
  {
    id: 'faq-5',
    question: 'Os materiais e tintas já estão inclusos ou o cliente escolhe?',
    answer:
      'Trabalhamos das duas formas conforme sua preferência: podemos fornecer o orçamento completo com mão de obra e tintas de primeira linha especificadas, ou apenas a mão de obra especializada orientando exatamente a quantidade e o tipo de material necessário.',
  },
  {
    id: 'faq-6',
    question: 'Qual o prazo médio para pintura de um apartamento ou fachada?',
    answer:
      'Apartamentos já desocupados costumam levar de 3 a 7 dias úteis dependendo do estado das paredes e da necessidade de massa corrida. Fachadas residenciais variam de 5 a 12 dias conforme metragem e clima. Definimos o cronograma exato antes de iniciar.',
  },
];
