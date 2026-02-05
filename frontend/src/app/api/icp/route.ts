import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const icpData = {
  trabalhador: {
    id: "trabalhador",
    name: "Trabalhador Independente / ENI",
    nameEn: "Self-employed / Freelancer",
    description: "Сервисники, recibos verdes — основная масса фрилансеров в Португалии",
    fears: [
      { pt: "Vou esquecer/errar → multa/dor de cabeça", en: "I'll forget/mess up → fine/headache", insight: "Anxiety about deadlines and complexity" },
      { pt: "IVA/SS — caos, prazos, não sei quanto pagar", en: "VAT/Social Security — chaos, deadlines", insight: "Confusion about obligations" },
      { pt: "Contabilista = caro/lento/não responde", en: "Accountant = expensive/slow/unresponsive", insight: "Distrust of traditional solutions" },
    ],
    triggers: [
      { text: "Tudo automático", en: "Everything automatic" },
      { text: "Sem stress", en: "No stress" },
      { text: "Proteção / escudo / cobertura", en: "Protection / shield / coverage" },
    ],
    keywords: {
      pt: ["automático", "calma", "sem stress", "proteção", "faturação", "IVA", "Segurança Social"],
      en: ["automatic", "calm", "stress-free", "protection", "invoicing", "VAT", "Social Security"],
    },
    trustVisuals: ["AT certification badge", "Shield/protection icons", "Clean minimal UI", "WhatsApp familiar interface"],
    tooGoodToBe: [
      { bad: "Garantimos 100% proteção", en: "We guarantee 100% protection" },
      { bad: "Nunca mais te preocupes", en: "Never worry again" },
      { bad: "Zero risco", en: "Zero risk" },
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
      { pt: "Não percebo as regras fiscais portuguesas", en: "I don't understand Portuguese tax rules", insight: "Language and system barrier" },
      { pt: "Vou errar com IVA/Segurança Social", en: "I'll mess up VAT/Social Security", insight: "Fear of non-compliance" },
    ],
    triggers: [
      { text: "Tax calm in Portugal", en: "Tax calm in Portugal" },
      { text: "VAT + Social Security on autopilot", en: "VAT + Social Security on autopilot" },
    ],
    keywords: {
      pt: ["Portugal", "expat", "freelancer", "digital nomad", "impostos"],
      en: ["Portugal", "expat", "freelancer", "digital nomad", "taxes", "VAT", "compliance"],
    },
    trustVisuals: ["English-first interface", "Portugal flag/reference", "Modern SaaS look", "Clear pricing"],
    tooGoodToBe: [
      { bad: "No Portuguese needed", en: "No Portuguese needed" },
      { bad: "100% compliant guaranteed", en: "100% compliant guaranteed" },
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
      { pt: "Faturas/pagamentos têm de ser perfeitos", en: "Invoices/payments must be perfect", insight: "Precision anxiety" },
      { pt: "Inspeções/multas = risco de rendimento", en: "Audits/fines = income risk", insight: "Financial vulnerability" },
    ],
    triggers: [
      { text: "Controlo", en: "Control" },
      { text: "Protection layer (Escudo Fiscal)", en: "Protection layer (Escudo Fiscal)" },
    ],
    keywords: {
      pt: ["controlo", "proteção", "escudo", "segurança", "conformidade"],
      en: ["control", "protection", "shield", "security", "compliance"],
    },
    trustVisuals: ["Premium dark UI", "Shield imagery", "Professional certifications", "Coverage amounts"],
    tooGoodToBe: [
      { bad: "Cobertura total garantida", en: "Full coverage guaranteed" },
      { bad: "Sem limites", en: "No limits" },
    ],
    recommendedOffers: ["escudo", "autopilot"],
    recommendedStyle: "premium",
  },
};

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  return NextResponse.json(icpData);
}
