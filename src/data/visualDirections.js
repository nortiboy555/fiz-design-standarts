// Visual Style Directions
// Source: FIZ Creative Playbook - 3 style directions

export const styleDirections = {
  premium: {
    id: 'premium',
    name: 'Premium Protection',
    concept: 'FIZ = "shield" between you and tax chaos, but without fearmongering',

    colorApproach: {
      description: 'Dark base + one "metallic/light" accent; gradients as "highlight", not "acid"',
      palette: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#e94560',
        highlight: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        text: '#ffffff',
        textMuted: '#a0a0a0'
      }
    },

    typography: {
      headline: 'Large headline (bold), secondary text thinner, short lines',
      style: 'High contrast, confident'
    },

    iconography: [
      'Shield-mark',
      'Thin lines',
      'Micro-pattern "security grid"'
    ],

    layoutGrammar: 'Center of gravity: "shield + amount" + 1 line of benefit',

    whatMakesExpensive: [
      'Lots of whitespace',
      'Even margins',
      'Restrained contrast',
      'Precise radii/strokes'
    ],

    referenceFrame: 'Dark background, left large "Escudo Fiscal até 1.500€" as premium badge, right small UI card "IVA: automático"',

    recommendedFor: ['escudo', 'dependente'],
    bestIcp: 'dependente'
  },

  minimal: {
    id: 'minimal',
    name: 'Tax Autopilot Minimal',
    concept: 'Calm clarity. "You work — FIZ counts/reminds/prepares"',

    colorApproach: {
      description: 'Light base, soft neutrals, one accent color for "Autopilot"',
      palette: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        accent: '#667eea',
        highlight: '#4ECDC4',
        text: '#1e293b',
        textMuted: '#64748b'
      }
    },

    typography: {
      headline: '"Stripe-like clarity": short headline + 2 bullets max',
      style: 'Clean, professional, readable'
    },

    iconography: [
      '"Autopilot" as stamp/toggle',
      'Small pictograms IVA/SS',
      'Minimal decoration'
    ],

    layoutGrammar: 'Strict 12-column grid, UI card as proof',

    whatMakesExpensive: [
      'Perfect typographic hierarchy',
      'Careful micro-typography',
      'Precise alignment',
      'Elegant simplicity'
    ],

    referenceFrame: 'White/light background, top "IVA + Segurança Social no automático", below — UI card with toggles ON',

    recommendedFor: ['autopilot', 'free'],
    bestIcp: 'trabalhador'
  },

  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp-first Friendly',
    concept: '"Fastest path to invoice" — by voice/text',

    colorApproach: {
      description: 'Warm neutral background + friendly shapes; accent — "chat"',
      palette: {
        primary: '#fefefe',
        secondary: '#f0f4f0',
        accent: '#25D366', // WhatsApp green (use carefully)
        highlight: '#128C7E',
        text: '#1e293b',
        textMuted: '#64748b'
      }
    },

    typography: {
      headline: 'Slightly more "human", but still fintech (no cartoonishness)',
      style: 'Approachable but professional'
    },

    iconography: [
      'Chat bubble',
      'Microphone',
      'Lightning (speed)',
      'Very clean execution'
    ],

    layoutGrammar: 'Main object: "chat scene" (1-2 messages) + CTA',

    whatMakesExpensive: [
      'Minimalism but with character',
      'No "messenger kindergarten"',
      'Sophisticated simplicity',
      'Clean chat UI representation'
    ],

    referenceFrame: 'Large chat bubble: "Criar fatura 120€ + IVA" → below "Fatura pronta ✅"',

    recommendedFor: ['whatsapp'],
    bestIcp: 'trabalhador',

    warning: 'Do not overuse WhatsApp branding — keep it subtle'
  }
};

// Universal frame concepts (can use with any direction)
export const universalFrames = [
  {
    id: 'frame4',
    name: '0€ Badge + Proof',
    description: '"0€ para sempre" as premium badge + 2 micro-proof: "certificada" + "Autopiloto IVA/SS"',
    offer: 'free'
  },
  {
    id: 'frame5',
    name: 'Split Screen',
    description: 'Left: "calma" (clean card), Right: "controlo" (numbers/IVA status)',
    offer: 'autopilot'
  }
];

// What makes FIZ visuals "expensive"
export const premiumPrinciples = [
  {
    rule: 'Editorial grid + typography, not "art for art\'s sake"',
    result: '70% "silence", 30% "signal"',
    cpaLogic: 'Less visual noise → better offer understanding'
  },
  {
    rule: 'One "expensive" hero element',
    elements: ['Shield', 'UI card', 'Chat bubble'],
    cpaLogic: 'Focus → higher CVR'
  },
  {
    rule: 'Premium gradients only as highlight',
    avoid: 'Background entirely "acid gradient"',
    cpaLogic: 'Readability preserved → less scroll loss'
  },
  {
    rule: 'Typography wins over illustrations',
    approach: 'Bold headline + micro-proof',
    cpaLogic: 'Text reads faster in feed'
  },
  {
    rule: 'No "financial screaming" triggers',
    avoid: ['Red warnings', 'Fine letters', 'Panic'],
    cpaLogic: 'Less rejection/reports → more stable delivery'
  },
  {
    rule: 'Micro-disclaimers as part of design',
    examples: ['"até"', '"termos"', 'Elegantly integrated'],
    cpaLogic: 'Trust without aesthetic degradation'
  }
];

// Static template types (12 templates)
export const staticTemplates = [
  // Hook-first
  { id: 1, name: 'CALM HERO', type: 'hook', description: '"Mais calma. Menos burocracia." (emotion → product)' },
  { id: 2, name: 'CONTROL SNAPSHOT', type: 'hook', description: '"Controlo real, todos os dias." + UI card' },

  // Offer-first
  { id: 3, name: 'FREE FOREVER BADGE', type: 'offer', description: 'Large "0€ para sempre" + 1 proof' },
  { id: 4, name: 'SHIELD 1500', type: 'offer', description: 'Shield + "até 1.500€" + termos microcopy' },

  // Trust-first
  { id: 5, name: 'CERTIFIED STACK', type: 'trust', description: '"certificada / SAF-T / conformidade" 3 badges' },
  { id: 6, name: 'BUILT FOR PORTUGAL', type: 'trust', description: '"Feito para Portugal: IVA + SS" + strict grid' },

  // Proof-first
  { id: 7, name: 'SOCIAL PROOF CARD', type: 'proof', description: 'Review/short quote + badges (not "too sweet")' },
  { id: 8, name: 'PROCESS PROOF', type: 'proof', description: '"Autopiloto ON" + 2 statuses (IVA/SS)' },

  // Feature-first
  { id: 9, name: 'AUTOPILOT TOGGLES', type: 'feature', description: 'Two toggles "IVA ON / SS ON"' },
  { id: 10, name: 'WHATSAPP CHAT DEMO', type: 'feature', description: '1 command → "Fatura pronta ✅"' },

  // Hybrid (for scaling)
  { id: 11, name: 'SPLIT: OFFER + PROOF', type: 'hybrid', description: 'Left badge, right UI card' },
  { id: 12, name: 'EDITORIAL GRID', type: 'hybrid', description: 'Large headline + 2 micro-bullets + CTA (most "expensive" look)' }
];

// Motion scenarios (6 scenarios for Reels/Stories 6-10s)
export const motionScenarios = [
  {
    id: 1,
    name: 'Autopilot ON',
    structure: [
      { time: '0-2s', content: '"IVA + SS no automático"', type: 'hook' },
      { time: '2-5s', content: 'Toggle animation ON + micro-proof "certificada"', type: 'proof' },
      { time: '5-8s', content: '"Começar grátis"', type: 'cta' },
      { time: '8-10s', content: 'Logo + "WhatsApp-first"', type: 'brand' }
    ]
  },
  {
    id: 2,
    name: 'Shield Layer',
    structure: [
      { time: '0-2s', content: '"Escudo Fiscal"', type: 'hook' },
      { time: '2-5s', content: 'Shield appears + "até 1.500€" + "termos"', type: 'proof' },
      { time: '5-8s', content: '"Ativar proteção"', type: 'cta' },
      { time: '8-10s', content: 'Calm gradient, logo', type: 'brand' }
    ]
  },
  {
    id: 3,
    name: '0€ Forever (no clickbait)',
    structure: [
      { time: '0-2s', content: '"0€ para sempre"', type: 'hook' },
      { time: '2-5s', content: '"Faturação certificada"', type: 'proof' },
      { time: '5-8s', content: 'CTA "Começar grátis"', type: 'cta' },
      { time: '8-10s', content: '"IVA + SS no automático"', type: 'brand' }
    ]
  },
  {
    id: 4,
    name: 'WhatsApp Invoice',
    structure: [
      { time: '0-2s', content: 'Bubble "Criar fatura 120€ + IVA"', type: 'hook' },
      { time: '2-5s', content: '"Fatura pronta ✅" (micro-UI)', type: 'proof' },
      { time: '5-8s', content: 'CTA "Usar no WhatsApp"', type: 'cta' },
      { time: '8-10s', content: 'Proof "Feito para Portugal"', type: 'brand' }
    ]
  },
  {
    id: 5,
    name: 'From Chaos to Calm (no fear)',
    structure: [
      { time: '0-2s', content: 'Quick montage "papéis" (neutral, no red alerts)', type: 'hook' },
      { time: '2-5s', content: '"Tudo em dia" + clean status card', type: 'proof' },
      { time: '5-8s', content: 'CTA "Ver como funciona"', type: 'cta' },
      { time: '8-10s', content: 'Logo', type: 'brand' }
    ]
  },
  {
    id: 6,
    name: '3 Reasons',
    structure: [
      { time: '0-2s', content: '"Calma fiscal"', type: 'hook' },
      { time: '2-5s', content: '3 words one by one: "0€" → "Autopiloto" → "Escudo"', type: 'proof' },
      { time: '5-8s', content: 'CTA "Começar grátis"', type: 'cta' },
      { time: '8-10s', content: 'Micro-proof "certificada"', type: 'brand' }
    ]
  }
];
