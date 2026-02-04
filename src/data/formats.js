// Format Specifications and Safe Zones
// Source: FIZ Creative Playbook - Meta creative specs

export const formats = {
  '9:16': {
    id: '9:16',
    name: 'Stories / Reels',
    ratio: '9:16',
    baseSize: { width: 1080, height: 1920 },
    hiResSize: { width: 1080, height: 1920 },
    placements: ['Stories', 'Reels'],
    role: 'Full-screen impact',
    isMaster: true,
    masterType: 'A',

    safeZones: {
      uiTop: {
        height: 250,
        description: 'UI overlay zone (username, close button)',
        rule: 'No text/logos here'
      },
      uiBottom: {
        height: 250,
        description: 'UI overlay zone (CTA button, swipe up, reactions)',
        rule: 'No text/logos here'
      },
      safe11: {
        width: 1080,
        height: 1080,
        offsetY: 420, // (1920-1080)/2
        description: 'Safe for 1:1 crop',
        rule: 'All "must-have" content (headline, offer, CTA, certificate)'
      },
      safe45: {
        width: 1080,
        height: 1350,
        offsetY: 285, // (1920-1350)/2
        description: 'Safe for 4:5 crop',
        rule: 'All "nice-to-have" content (icons, UI cards, decor)'
      },
      centralSafe: {
        width: 1010,
        height: 1280,
        offsetX: 35,
        offsetY: 320,
        description: 'Performance safe zone (avoid all UI)',
        rule: 'Key text/CTA strongly recommended here'
      }
    },

    gridSpec: {
      columns: 12,
      margins: 64,
      gutter: 16
    }
  },

  '4:5': {
    id: '4:5',
    name: 'Feed Portrait',
    ratio: '4:5',
    baseSize: { width: 1080, height: 1350 },
    hiResSize: { width: 1440, height: 1800 },
    placements: ['Feed (IG/FB)', 'Mobile-optimized'],
    role: 'Maximum feed area',
    isMaster: true,
    masterType: 'B',

    safeZones: {
      bottomMargin: {
        height: 80,
        description: 'Placement UI zone',
        rule: 'Don\'t push CTA to very bottom'
      }
    },

    gridSpec: {
      columns: 12,
      margins: 56,
      gutter: 16
    }
  },

  '1:1': {
    id: '1:1',
    name: 'Square',
    ratio: '1:1',
    baseSize: { width: 1080, height: 1080 },
    hiResSize: { width: 1440, height: 1440 },
    placements: ['Feed (FB/IG)', 'Explore-like surfaces'],
    role: 'Universal for feed',
    isMaster: false,
    derivedFrom: '9:16',

    safeZones: {
      // 1:1 is itself a safe zone, so minimal restrictions
      margins: {
        all: 48,
        description: 'Content margins',
        rule: 'Keep text away from edges'
      }
    },

    gridSpec: {
      columns: 12,
      margins: 48,
      gutter: 16
    }
  },

  '16:9': {
    id: '16:9',
    name: 'Landscape',
    ratio: '16:9',
    baseSize: { width: 1920, height: 1080 },
    hiResSize: { width: 1920, height: 1080 },
    placements: ['In-stream video', 'Video placements'],
    role: 'Separate branch (rarely needed)',
    isMaster: false,
    isOptional: true,
    note: 'Either disable placements where this is critical, or make separate export',

    safeZones: {
      margins: {
        all: 60,
        description: 'Content margins',
        rule: 'Keep critical content in center third'
      }
    },

    gridSpec: {
      columns: 12,
      margins: 60,
      gutter: 16
    }
  }
};

// Master layout strategy
export const masterStrategy = {
  description: 'One master without pain into all placements',

  stepOne: {
    title: 'Draw Master 9:16 as "container"',
    canvas: { width: 1080, height: 1920 },
    nestedWindows: [
      {
        name: 'Safe(1:1)',
        size: '1080×1080',
        offsetTop: 420,
        offsetBottom: 420,
        content: 'All "must-have" (headline, "0€", "1.500€", CTA, certificate)'
      },
      {
        name: 'Safe(4:5)',
        size: '1080×1350',
        offsetTop: 285,
        offsetBottom: 285,
        content: 'All "nice-to-have" (icons, UI cards, decor)'
      },
      {
        name: 'Safe(Stories UI)',
        rule: '250px top/bottom free',
        content: 'Text/logo safe from UI overlay'
      }
    ],
    bleed: 'Atmosphere (gradients, patterns, large shapes) can go to 9:16 edges'
  },

  stepTwo: {
    title: 'Adaptation',
    exports: [
      {
        format: '4:5',
        method: 'Crop from 9:16 by Safe(4:5), or use Master B (better)'
      },
      {
        format: '1:1',
        method: 'Crop Safe(1:1)'
      },
      {
        format: '16:9',
        method: 'Either disable placements, or make separate template (don\'t squeeze from vertical)'
      }
    ]
  },

  cpaLogic: 'Systematically protect offer/meaning from crops → more stable CVR'
};

// Typography specifications
export const typography = {
  headline: {
    '9:16': { min: 44, max: 64 },
    '4:5': { min: 40, max: 56 },
    '1:1': { min: 36, max: 48 }
  },
  subline: {
    all: { min: 22, max: 28 }
  },
  microProof: {
    all: { min: 16, max: 18 }
  }
};

// Layout zones (always the same)
export const layoutZones = [
  { id: 'badge', name: 'Badge zone', position: 'top-left', content: '"0€" or "Autopilot" or "Escudo"' },
  { id: 'headline', name: 'Headline zone', position: 'top/center', content: '1-2 lines' },
  { id: 'proof', name: 'Proof zone', position: 'below headline', content: '1 line (certificada, termos, WhatsApp-first)' },
  { id: 'hero', name: 'Hero zone', position: 'center', content: 'UI card / shield / chat bubble' },
  { id: 'cta', name: 'CTA zone', position: 'bottom', content: 'Button + microcopy' },
  { id: 'logo', name: 'Logo lockup', position: 'bottom-left', content: 'Logo always in same place' }
];
