// ICP (Ideal Customer Profile) Data
// Source: FIZ Creative Playbook

export const icpData = {
  trabalhador: {
    id: 'trabalhador',
    name: 'Trabalhador Independente / ENI',
    nameEn: 'Self-employed / Freelancer',
    description: 'Сервисники, "recibos verdes" — основная масса фрилансеров в Португалии',

    fears: [
      {
        pt: 'Vou esquecer/errar → multa/dor de cabeça',
        en: 'I\'ll forget/mess up → fine/headache',
        insight: 'Страх ошибки и последствий — главный драйвер'
      },
      {
        pt: 'IVA/SS — caos, prazos, não sei quanto pagar',
        en: 'VAT/Social Security — chaos, deadlines, don\'t know how much to pay',
        insight: 'Непонимание системы создаёт тревогу'
      },
      {
        pt: 'Contabilista = caro/lento/não responde',
        en: 'Accountant = expensive/slow/unresponsive',
        insight: 'Недоверие к традиционным решениям'
      }
    ],

    triggers: [
      { text: 'Tudo automático', en: 'Everything automatic' },
      { text: 'Sem stress', en: 'No stress' },
      { text: 'Proteção / escudo / cobertura', en: 'Protection / shield / coverage' },
      { text: 'WhatsApp: faço em 10 segundos', en: 'WhatsApp: done in 10 seconds' }
    ],

    keywords: {
      pt: [
        'recibos verdes', 'trabalhador independente', 'ENI',
        'IVA', 'Segurança Social', 'declaração', 'coimas',
        'fatura', 'faturação certificada', 'AT', 'SAF-T', 'e-fatura'
      ],
      en: [
        'green receipts', 'self-employed', 'freelancer',
        'VAT', 'Social Security', 'tax return', 'fines',
        'invoice', 'certified invoicing', 'tax authority'
      ]
    },

    trustVisuals: [
      'Бейдж "certificada" (compliance markers)',
      'Чёткая типографика, много воздуха',
      'Аккуратные "UI cards"',
      'Никаких "крикливых" красных предупреждений'
    ],

    tooGoodToBe: [
      { bad: 'Nunca mais pagas IVA', en: 'Never pay VAT again' },
      { bad: 'Garantimos que não tens multas', en: 'We guarantee no fines' },
      { bad: 'Любая "магия" без условий', en: 'Any "magic" without conditions' }
    ],

    recommendedOffers: ['autopilot', 'escudo', 'whatsapp'],
    recommendedStyle: 'minimal'
  },

  expat: {
    id: 'expat',
    name: 'Expats / Digital Nomads',
    nameEn: 'Expats / Digital Nomads',
    description: 'Англоговорящие, живут в Португалии, работают удалённо',

    fears: [
      {
        pt: 'Não percebo as regras fiscais portuguesas',
        en: 'I don\'t understand Portuguese tax rules',
        insight: 'Языковой и культурный барьер'
      },
      {
        pt: 'Vou errar com IVA/Segurança Social',
        en: 'I\'ll mess up VAT/Social Security',
        insight: 'Страх незнакомой системы'
      },
      {
        pt: 'Preciso de algo simples + em inglês',
        en: 'I need something simple + in English',
        insight: 'Потребность в доступности'
      }
    ],

    triggers: [
      { text: 'Tax calm in Portugal', en: 'Tax calm in Portugal' },
      { text: 'VAT + Social Security on autopilot', en: 'VAT + Social Security on autopilot' },
      { text: 'Create invoices via WhatsApp', en: 'Create invoices via WhatsApp' }
    ],

    keywords: {
      pt: [
        'impostos Portugal', 'IVA', 'Segurança Social', 'faturação',
        'freelancer', 'autónomo', 'NIF', 'conformidade fiscal'
      ],
      en: [
        'Portugal taxes', 'VAT', 'Social Security', 'invoicing',
        'freelancer', 'self-employed', 'NIF', 'tax compliance',
        'fine coverage'
      ]
    },

    trustVisuals: [
      '"Built for Portugal" + реальные PT-термины (IVA, Segurança Social)',
      'Очень "Stripe-like" ясность',
      'Без маркетинговой истерики',
      'Clean, professional, international feel'
    ],

    tooGoodToBe: [
      { bad: 'Guaranteed compliance', en: 'Guaranteed compliance' },
      { bad: 'No fines ever', en: 'No fines ever' }
    ],

    recommendedOffers: ['autopilot', 'free', 'whatsapp'],
    recommendedStyle: 'minimal'
  },

  dependente: {
    id: 'dependente',
    name: 'Dependente Self-employed',
    nameEn: 'Single-client Contractor',
    description: 'Один крупный клиент, фактически "скрытый сотрудник"',

    fears: [
      {
        pt: 'Faturas/pagamentos têm de ser perfeitos',
        en: 'Invoices/payments must be perfect',
        insight: 'Высокие стандарты из-за зависимости от клиента'
      },
      {
        pt: 'Não quero discutir com o cliente por causa de documentos errados',
        en: 'I don\'t want to argue with client over wrong documents',
        insight: 'Страх потерять отношения'
      },
      {
        pt: 'Inspeções/multas = risco de rendimento',
        en: 'Audits/fines = income risk',
        insight: 'Финансовая уязвимость'
      }
    ],

    triggers: [
      { text: 'Controlo', en: 'Control' },
      { text: 'Always ready: invoices + tax obligations', en: 'Always ready: invoices + tax obligations' },
      { text: 'Protection layer (Escudo Fiscal)', en: 'Protection layer (Escudo Fiscal)' }
    ],

    keywords: {
      pt: [
        'cliente único', 'faturação regular', 'controlo',
        'documentação', 'conformidade', 'proteção'
      ],
      en: [
        'single client', 'regular invoicing', 'control',
        'documentation', 'compliance', 'protection'
      ]
    },

    trustVisuals: [
      'Более "премиум" и "серьёзно"',
      'Щит как символ защиты',
      'Строгая сетка, минимум эмодзи',
      'Professional, corporate feel'
    ],

    tooGoodToBe: [
      { bad: 'Sem risco', en: 'No risk' },
      { bad: 'Garantia total', en: 'Total guarantee' }
    ],

    recommendedOffers: ['escudo', 'autopilot'],
    recommendedStyle: 'premium'
  }
};

// Trust building blocks (universal)
export const trustBlocks = [
  {
    id: 'certification',
    name: 'Certificação / Conformidade',
    examples: ['certificada pela AT', 'SAF-T PT', 'e-Fatura'],
    impact: 'high'
  },
  {
    id: 'protection',
    name: 'Proteção com condições',
    examples: ['até 1.500€', 'sujeito a termos'],
    impact: 'high'
  },
  {
    id: 'channel',
    name: 'Canal rápido e familiar',
    examples: ['WhatsApp-first', 'em segundos'],
    impact: 'medium'
  },
  {
    id: 'simplicity',
    name: 'Simplicidade confiante',
    examples: ['minimalismo', 'hierarquia clara'],
    impact: 'medium'
  },
  {
    id: 'transparency',
    name: 'Transparência',
    examples: ['preços claros', '0€ para sempre', 'sem letra pequena'],
    impact: 'high'
  }
];
