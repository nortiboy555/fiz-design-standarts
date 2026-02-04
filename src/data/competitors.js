// Competitor Data
// Source: FIZ Creative Playbook - Competitive Audit

export const competitors = {
  invoicexpress: {
    id: 'invoicexpress',
    name: 'InvoiceXpress',
    positioning: 'Software de faturação online certificado — lado simples e automático da faturação',
    positioningEn: 'Certified online invoicing software — simple and automatic invoicing',

    strengths: [
      'Established brand in PT market',
      'Simple positioning',
      'Certified invoicing focus'
    ],

    weaknesses: [
      'Tool-focused, not emotion-focused',
      'No protection/shield angle',
      'Generic fintech messaging'
    ],

    typicalCreative: {
      hook: 'Software de faturação certificado',
      proof: 'Certificado AT',
      features: ['emita faturas', 'apps', 'suporte'],
      visual: 'Product screenshots + badges'
    },

    fizAngle: 'They sell a tool. FIZ sells peace of mind + protection.'
  },

  moloni: {
    id: 'moloni',
    name: 'Moloni',
    positioning: '38.000 empresas confiam — apoio 100% gratuito, seguro, certificado e atualizado',
    positioningEn: '38,000 companies trust us — 100% free support, secure, certified and updated',

    strengths: [
      'Strong social proof (38k companies)',
      'Free support messaging',
      'Security/certification emphasis'
    ],

    weaknesses: [
      'B2B focused (empresas), not freelancer-first',
      'Feature-heavy messaging',
      'No emotional differentiation'
    ],

    typicalCreative: {
      hook: 'X empresas confiam',
      proof: '38.000 empresas, certificado AT',
      features: ['faturação', 'gestão', 'suporte grátis'],
      visual: 'Social proof numbers + product UI'
    },

    fizAngle: 'They target businesses. FIZ targets independents with autopilot + protection.'
  },

  toconline: {
    id: 'toconline',
    name: 'TOConline / OCC',
    positioning: 'Programa online da Ordem dos Contabilistas — contabilidade, faturação e gestão',
    positioningEn: 'Online program from Accountants Association — accounting, invoicing and management',

    strengths: [
      'Institutional trust (OCC backing)',
      'Full accounting solution',
      'Professional credibility'
    ],

    weaknesses: [
      'Too "accounting" for simple freelancers',
      'Intimidating for non-accountants',
      'Complex product perception'
    ],

    typicalCreative: {
      hook: 'Da Ordem dos Contabilistas',
      proof: 'OCC institutional backing',
      features: ['contabilidade', 'faturação', 'gestão'],
      visual: 'Professional/institutional imagery'
    },

    fizAngle: 'They\'re for accountants. FIZ is for people who don\'t want to think like accountants.'
  },

  phc: {
    id: 'phc',
    name: 'PHC (Cegid PHC)',
    positioning: 'ERP/gestão com IA — mais controlo, menos esforço',
    positioningEn: 'ERP/management with AI — more control, less effort',

    strengths: [
      'Enterprise credibility',
      'AI/innovation messaging',
      'Comprehensive solution'
    ],

    weaknesses: [
      'Too enterprise for independents',
      'ERP = complex perception',
      'Overkill for simple invoicing'
    ],

    typicalCreative: {
      hook: 'Gestão com IA',
      proof: 'Enterprise features',
      features: ['ERP', 'gestão', 'controlo'],
      visual: 'Corporate/tech imagery'
    },

    fizAngle: 'PHC is enterprise software. FIZ is a personal tax companion.'
  },

  rauva: {
    id: 'rauva',
    name: 'Rauva',
    positioning: 'Navigating strict rules — certified invoicing to tax compliance, aligned with Portuguese legislation + fintech/payments',
    positioningEn: 'Navigating strict rules — certified invoicing to tax compliance + fintech/payments',

    strengths: [
      'Modern fintech approach',
      'Compliance-first messaging',
      'Banking + invoicing combo'
    ],

    weaknesses: [
      'Broad positioning (too many things)',
      'Less focused on freelancer pain points',
      'Newer, less established'
    ],

    typicalCreative: {
      hook: 'Tax compliance + payments',
      proof: 'Portuguese legislation aligned',
      features: ['invoicing', 'payments', 'compliance'],
      visual: 'Modern fintech aesthetic'
    },

    fizAngle: 'Rauva is a bank with invoicing. FIZ is tax peace with invoicing as entry point.'
  }
};

// What competitors do that works
export const competitorPatterns = {
  working: [
    'Certificates + "simplicity" messaging',
    'Social proof ("X empresas confiam")',
    'Product screenshots as proof',
    'Certification badges'
  ],

  boring: [
    'They sell a tool, not an emotion',
    'Too many features in one banner',
    'Generic "invoicing software" positioning',
    'No differentiation on protection/calm'
  ]
};

// FIZ differentiation
export const fizPositioning = {
  category: 'Tax Peace + Shield',
  notCategory: 'Invoicing App',

  commodity: {
    what: '0€ faturação',
    why: 'Market minimum expectation'
  },

  differentiators: [
    {
      name: 'Autopilot',
      description: 'IVA + SS automated',
      emotion: 'I don\'t have to think about it'
    },
    {
      name: 'Protection',
      description: 'Escudo Fiscal até 1.500€',
      emotion: 'I\'m covered if something goes wrong'
    },
    {
      name: 'Trust',
      description: 'Certificada + transparency',
      emotion: 'I can trust this'
    }
  ],

  cpaLogic: 'Hit the real purchase driver (fear of chaos/error) without fearmongering → higher CVR'
};
