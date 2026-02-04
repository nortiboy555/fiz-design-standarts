// Pre-flight Checklist
// Source: FIZ Creative Playbook - Fintech-safe checklist

export const checklist = {
  adCopy: {
    title: 'Ad Copy',
    titlePt: 'Texto do Anúncio',
    items: [
      {
        id: 'no-guarantees',
        text: 'No "guarantees" of results/savings',
        textPt: 'Sem "garantias" de resultado/poupança',
        critical: true
      },
      {
        id: 'no-fearmongering',
        text: 'No fear-mongering or shaming',
        textPt: 'Sem táticas de medo ou vergonha',
        critical: true
      },
      {
        id: 'no-personal-attributes',
        text: 'No "you/your" + sensitive claims (debts, violations, fines)',
        textPt: 'Sem "tu/teu" + afirmações sensíveis (dívidas, violações, multas)',
        critical: true
      },
      {
        id: 'escudo-terms',
        text: '"Escudo Fiscal" always with "até" + "termos" (if applicable)',
        textPt: '"Escudo Fiscal" sempre com "até" + "termos" (se aplicável)',
        critical: true
      },
      {
        id: 'headline-length',
        text: 'Headline ≤ 7-9 words (PT) / ≤ 8-10 words (EN)',
        textPt: 'Headline ≤ 7-9 palavras (PT) / ≤ 8-10 palavras (EN)',
        critical: false
      },
      {
        id: 'single-message',
        text: '1 banner = 1 main message (0€ OR Autopilot OR Escudo OR WhatsApp)',
        textPt: '1 banner = 1 mensagem principal (0€ OU Autopiloto OU Escudo OU WhatsApp)',
        critical: false
      },
      {
        id: 'trust-marker',
        text: 'Has trust marker (certificada / termos / "até")',
        textPt: 'Tem marcador de confiança (certificada / termos / "até")',
        critical: false
      }
    ]
  },

  visual: {
    title: 'Visual',
    titlePt: 'Visual',
    items: [
      {
        id: 'no-official-symbols',
        text: 'No "official" seals/documents imitating government docs',
        textPt: 'Sem selos/documentos "oficiais" imitando docs do governo',
        critical: true
      },
      {
        id: 'no-fine-letters',
        text: 'No "fine letters" or AT-style notifications (looks like scam)',
        textPt: 'Sem "cartas de multa" ou notificações estilo AT (parece scam)',
        critical: true
      },
      {
        id: 'no-scare-visuals',
        text: 'No scare visuals (red alerts, warning signs)',
        textPt: 'Sem visuais de medo (alertas vermelhos, sinais de aviso)',
        critical: false
      },
      {
        id: 'premium-minimal',
        text: 'Premium minimal aesthetic (whitespace, contrast, grid)',
        textPt: 'Estética minimalista premium (espaço branco, contraste, grelha)',
        critical: false
      },
      {
        id: 'single-hero',
        text: 'Single hero element (shield / UI card / chat bubble)',
        textPt: 'Um elemento hero (escudo / UI card / chat bubble)',
        critical: false
      }
    ]
  },

  safezones: {
    title: 'Safe Zones',
    titlePt: 'Zonas Seguras',
    items: [
      {
        id: 'stories-margins',
        text: '9:16 Stories/Reels: ~250px top/bottom free from text/logos',
        textPt: '9:16 Stories/Reels: ~250px topo/base livre de texto/logos',
        critical: true
      },
      {
        id: 'key-content-center',
        text: 'Key content (headline, CTA, offer) in center safe zone',
        textPt: 'Conteúdo chave (headline, CTA, oferta) na zona central segura',
        critical: true
      },
      {
        id: 'safe-1-1',
        text: 'All essential content fits within Safe(1:1) area',
        textPt: 'Todo conteúdo essencial cabe na área Safe(1:1)',
        critical: false
      },
      {
        id: 'cta-not-bottom',
        text: 'CTA not at very bottom (may be cut in some placements)',
        textPt: 'CTA não no fundo (pode ser cortado em alguns posicionamentos)',
        critical: false
      }
    ]
  },

  landing: {
    title: 'Landing Page',
    titlePt: 'Página de Destino',
    items: [
      {
        id: 'offer-match',
        text: 'Offer and conditions match the ad (UBP risk otherwise)',
        textPt: 'Oferta e condições correspondem ao anúncio (risco UBP caso contrário)',
        critical: true
      },
      {
        id: 'gdpr-consent',
        text: 'Marketing consent is separate checkbox (not embedded in ToS)',
        textPt: 'Consentimento marketing é checkbox separado (não embutido em ToS)',
        critical: true
      },
      {
        id: 'clear-controller',
        text: 'Clear data controller, purposes, channels, how to withdraw consent',
        textPt: 'Controlador de dados claro, propósitos, canais, como retirar consentimento',
        critical: true
      },
      {
        id: 'cookie-banner',
        text: 'Cookie banner: marketing trackers only after consent',
        textPt: 'Banner de cookies: trackers de marketing só após consentimento',
        critical: true
      }
    ]
  },

  whatsapp: {
    title: 'WhatsApp (if used)',
    titlePt: 'WhatsApp (se usado)',
    items: [
      {
        id: 'wa-opt-in',
        text: 'Explicit opt-in for WhatsApp marketing ("Quero receber info no WhatsApp")',
        textPt: 'Opt-in explícito para marketing WhatsApp ("Quero receber info no WhatsApp")',
        critical: true
      },
      {
        id: 'wa-stop',
        text: 'Every promo message has: who you are + how to opt-out ("Responda STOP")',
        textPt: 'Cada mensagem promo tem: quem és + como sair ("Responda STOP")',
        critical: true
      },
      {
        id: 'wa-user-initiated',
        text: 'User-initiated conversations: can respond about product/onboarding',
        textPt: 'Conversas iniciadas pelo utilizador: pode responder sobre produto/onboarding',
        critical: false
      }
    ]
  }
};

// Checklist metadata
export const checklistMeta = {
  version: '1.0',
  lastUpdated: '2024',
  source: 'FIZ Creative Playbook',

  criticalCount: Object.values(checklist).reduce(
    (acc, section) => acc + section.items.filter(item => item.critical).length,
    0
  ),

  totalCount: Object.values(checklist).reduce(
    (acc, section) => acc + section.items.length,
    0
  )
};
