// Banned Words and Compliance Rules
// Source: FIZ Creative Playbook - Meta policies + fintech compliance

export const banWords = {
  // Hard bans - will likely cause rejection
  hardBan: [
    {
      words: ['garantido', 'garantimos', 'garantia', 'guaranteed', 'guarantee', 'we guarantee'],
      reason: 'Misleading / deceptive - cannot guarantee financial outcomes',
      severity: 'high',
      suggestion: 'Use "até" (up to) with terms reference'
    },
    {
      words: ['100%', 'sempre', 'nunca', 'always', 'never', '100 percent'],
      reason: 'Absolute claims are misleading in fintech context',
      severity: 'high',
      suggestion: 'Remove absolutes or add qualifying conditions'
    },
    {
      words: ['sem risco', 'zero risco', 'no risk', 'risk-free', 'risk free'],
      reason: 'Financial services always carry some risk',
      severity: 'high',
      suggestion: 'Focus on protection/coverage with terms'
    },
    {
      words: ['oficial', 'governo', 'official', 'government', 'government-approved'],
      reason: 'False affiliation claims unless actually affiliated',
      severity: 'high',
      suggestion: 'Use "certificada pela AT" if true, otherwise remove'
    }
  ],

  // Soft bans - may reduce delivery or trigger review
  softBan: [
    {
      words: ['evita multas agora', 'avoid fines now', 'último aviso', 'last warning', 'última chance', 'last chance'],
      reason: 'False urgency / scare tactics',
      severity: 'medium',
      suggestion: 'Use calm messaging like "proteção" or "calma fiscal"'
    },
    {
      words: ['tu estás atrasado', 'you are behind', 'tens dívidas', 'you have debts', 'não pagas', 'you don\'t pay'],
      reason: 'Personal attributes - Meta prohibits targeting/assuming personal financial status',
      severity: 'medium',
      suggestion: 'Use general benefits, not accusations'
    },
    {
      words: ['urgente', 'urgent', 'imediato', 'immediately', 'agora mesmo', 'right now'],
      reason: 'Pressure tactics reduce trust and may trigger review',
      severity: 'medium',
      suggestion: 'Focus on convenience, not urgency'
    },
    {
      words: ['vais poupar', 'you will save', 'economiza', 'save money'],
      reason: 'Savings claims need legal backing',
      severity: 'low',
      suggestion: 'Be specific with conditions or remove savings claims'
    }
  ],

  // Patterns to watch (not banned but risky)
  watchPatterns: [
    {
      pattern: /\d+€?\s*(garantido|certo|fixo)/i,
      reason: 'Amount + guarantee combination',
      suggestion: 'Add "até" before amount and "(ver termos)" after'
    },
    {
      pattern: /(multa|coima|penalidade).*(!|\?)/i,
      reason: 'Fine mention with emotional punctuation',
      suggestion: 'Keep fine mentions neutral and factual'
    },
    {
      pattern: /tu\s+(tens|estás|deves|precisas)/i,
      reason: 'Direct "you" statements about status',
      suggestion: 'Rephrase to general benefits'
    }
  ]
};

// Compliance recommendations
export const complianceRules = {
  escudoFiscal: {
    mustHave: ['"até" before amount', '"sujeito a termos" or "(ver termos)"'],
    mustNotHave: ['garantimos', 'sempre', '100%'],
    example: {
      good: 'Cobertura de coimas até 1.500€ (sujeito a termos)',
      bad: 'Garantimos cobertura de 1.500€ em multas'
    }
  },

  freeInvoicing: {
    mustHave: ['Plan specification if limited', 'Conditions if any'],
    mustNotHave: ['Hidden conditions in fine print'],
    example: {
      good: 'Faturação 0€ para sempre (plano básico)',
      bad: 'Faturação grátis*' // with hidden asterisk conditions
    }
  },

  autopilot: {
    mustHave: ['Clarity on what\'s automated'],
    mustNotHave: ['Claims of zero effort/work'],
    example: {
      good: 'IVA + Segurança Social no automático — lembretes e cálculos',
      bad: 'Nunca mais te preocupes com impostos'
    }
  }
};

// Quick check function helper data
export const severityLevels = {
  high: {
    label: 'High Risk',
    color: '#ef4444',
    icon: '🚫',
    action: 'Must change before publishing'
  },
  medium: {
    label: 'Medium Risk',
    color: '#f59e0b',
    icon: '⚠️',
    action: 'Recommended to change'
  },
  low: {
    label: 'Low Risk',
    color: '#3b82f6',
    icon: 'ℹ️',
    action: 'Consider reviewing'
  }
};
