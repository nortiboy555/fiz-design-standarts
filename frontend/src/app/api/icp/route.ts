import { NextResponse } from "next/server";

const icpData = {
  trabalhador: {
    id: "trabalhador",
    name: "Trabalhador Independente / ENI",
    nameEn: "Self-employed / Freelancer",
    description: "Сервисники, recibos verdes — основная масса фрилансеров в Португалии",
    fears: [
      { pt: "Vou esquecer/errar → multa/dor de cabeça", en: "I'll forget/mess up → fine/headache" },
      { pt: "IVA/SS — caos, prazos, não sei quanto pagar", en: "VAT/Social Security — chaos, deadlines" },
      { pt: "Contabilista = caro/lento/não responde", en: "Accountant = expensive/slow/unresponsive" },
    ],
    triggers: [
      { text: "Tudo automático", en: "Everything automatic" },
      { text: "Sem stress", en: "No stress" },
      { text: "Proteção / escudo / cobertura", en: "Protection / shield / coverage" },
    ],
    recommendedOffers: ["autopilot", "escudo", "whatsapp"],
    recommendedStyle: "minimal",
  },
  expat: {
    id: "expat",
    name: "Expats / Digital Nomads",
    nameEn: "Expats / Digital Nomads",
    description: "Англоговорящие, живут в Португалии, работают удалённо",
    fears: [
      { pt: "Não percebo as regras fiscais portuguesas", en: "I don't understand Portuguese tax rules" },
      { pt: "Vou errar com IVA/Segurança Social", en: "I'll mess up VAT/Social Security" },
    ],
    triggers: [
      { text: "Tax calm in Portugal", en: "Tax calm in Portugal" },
      { text: "VAT + Social Security on autopilot", en: "VAT + Social Security on autopilot" },
    ],
    recommendedOffers: ["autopilot", "free", "whatsapp"],
    recommendedStyle: "minimal",
  },
  dependente: {
    id: "dependente",
    name: "Dependente Self-employed",
    nameEn: "Single-client Contractor",
    description: "Один крупный клиент, фактически скрытый сотрудник",
    fears: [
      { pt: "Faturas/pagamentos têm de ser perfeitos", en: "Invoices/payments must be perfect" },
      { pt: "Inspeções/multas = risco de rendimento", en: "Audits/fines = income risk" },
    ],
    triggers: [
      { text: "Controlo", en: "Control" },
      { text: "Protection layer (Escudo Fiscal)", en: "Protection layer (Escudo Fiscal)" },
    ],
    recommendedOffers: ["escudo", "autopilot"],
    recommendedStyle: "premium",
  },
};

const trustBlocks = [
  { id: "certification", name: "Certificação / Conformidade", examples: ["certificada pela AT", "SAF-T PT"], impact: "high" },
  { id: "protection", name: "Proteção com condições", examples: ["até 1.500€", "sujeito a termos"], impact: "high" },
  { id: "channel", name: "Canal rápido e familiar", examples: ["WhatsApp-first", "em segundos"], impact: "medium" },
  { id: "simplicity", name: "Simplicidade confiante", examples: ["minimalismo", "hierarquia clara"], impact: "medium" },
  { id: "transparency", name: "Transparência", examples: ["preços claros", "0€ para sempre"], impact: "high" },
];

export async function GET() {
  return NextResponse.json(icpData);
}
