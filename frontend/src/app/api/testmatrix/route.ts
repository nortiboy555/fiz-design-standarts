import { NextRequest, NextResponse } from "next/server";

const testVariables = {
  hook: {
    id: "hook",
    name: "Hook",
    description: "Opening message/angle",
    impact: "CTR + CVR",
    priority: 1,
    options: [
      { id: "calm", name: "Calm", example: "Mais calma. Menos burocracia." },
      { id: "control", name: "Control", example: "Controlo total, sem ser contabilista." },
      { id: "speed", name: "Speed", example: "Fatura feita em segundos." },
      { id: "protection", name: "Protection", example: "Um escudo contra coimas." },
    ],
  },
  offer: {
    id: "offer",
    name: "Offer",
    description: "Main value proposition",
    impact: "CVR (strongest)",
    priority: 1,
    options: [
      { id: "autopilot", name: "Autopilot", example: "IVA + SS no automático" },
      { id: "escudo", name: "Escudo Fiscal", example: "Cobertura até 1.500€" },
      { id: "free", name: "0€ Forever", example: "Faturação grátis para sempre" },
      { id: "whatsapp", name: "WhatsApp-first", example: "Cria faturas pelo WhatsApp" },
    ],
  },
  visual: {
    id: "visual",
    name: "Visual Style",
    description: "Design direction",
    impact: "CTR (click quality)",
    priority: 3,
    options: [
      { id: "premium", name: "Premium Protection", example: "Dark + shield + metallic" },
      { id: "minimal", name: "Minimal Autopilot", example: "Light + clean + Stripe-like" },
      { id: "whatsapp", name: "WhatsApp Friendly", example: "Chat bubbles + warm" },
    ],
  },
  proof: {
    id: "proof",
    name: "Proof Layer",
    description: "Trust element",
    impact: "CVR",
    priority: 2,
    options: [
      { id: "certified", name: "Certificada", example: "Certificada pela AT / SAF-T" },
      { id: "terms", name: "Escudo + Termos", example: "até 1.500€ (ver termos)" },
      { id: "whatsapp-demo", name: "WhatsApp Demo", example: "Chat screenshot" },
      { id: "built-pt", name: "Built for PT", example: "Feito para Portugal" },
    ],
  },
  cta: {
    id: "cta",
    name: "CTA",
    description: "Call to action text",
    impact: "CVR (micro)",
    priority: 4,
    options: [
      { id: "start-free", name: "Start Free", example: "Começar grátis" },
      { id: "autopilot-on", name: "Enable Autopilot", example: "Ativar Autopiloto" },
      { id: "use-whatsapp", name: "Use WhatsApp", example: "Usar no WhatsApp" },
      { id: "see-how", name: "See How", example: "Ver como funciona" },
    ],
  },
};

const testOrder = [
  { step: 1, variables: ["offer", "hook"], reason: "Biggest CPA impact" },
  { step: 2, variables: ["proof"], reason: "Reduces doubts" },
  { step: 3, variables: ["visual"], reason: "Balance trendy vs clear" },
  { step: 4, variables: ["cta"], reason: "Micro optimization" },
];

const sprintTemplate = {
  day1: { name: "Launch", tasks: ["Launch 6-8 creatives", "Set up tracking", "Document baseline"], metrics: ["Impressions", "Reach"] },
  day2: { name: "First Cut", tasks: ["Review CTR/CPC", "Kill losers", "Note top 2 performers"], metrics: ["CTR", "CPC"] },
  day3: { name: "Iterate", tasks: ["Create 6 new variations", "Change only 1 variable", "Launch new batch"], metrics: ["CTR", "CPM"] },
  day4: { name: "Proof Test", tasks: ["Add proof variants", "Test against winners"], metrics: ["CVR", "CPA"] },
  day5: { name: "Consolidate", tasks: ["Identify winning combos", "Scale production"], metrics: ["CVR", "CPA"] },
  day6: { name: "Scale", tasks: ["Increase budget on winners", "Pause underperformers"], metrics: ["ROAS", "CPA"] },
  day7: { name: "Review & Plan", tasks: ["Fix champion template set", "Plan next sprint"], metrics: ["ROAS", "CAC"] },
};

const kpiBenchmarks = {
  ctr: { good: 1.5, great: 2.5, unit: "%" },
  cpc: { good: 0.3, great: 0.15, unit: "€" },
  cpm: { good: 5.0, great: 3.0, unit: "€" },
  cvr: { good: 2.0, great: 4.0, unit: "%" },
  cpa: { good: 15.0, great: 8.0, unit: "€" },
};

const prebuiltMatrices = [
  { id: "starter", name: "Starter Pack", description: "Test core offer angles", variables: ["hook", "offer"], combinations: 8, estimated: "2-3 days" },
  { id: "full", name: "Full Matrix", description: "Comprehensive test", variables: ["hook", "offer", "visual", "proof"], combinations: 48, estimated: "5-7 days" },
  { id: "visual-focus", name: "Visual Focus", description: "Test visuals", variables: ["visual", "proof"], combinations: 9, estimated: "2-3 days" },
];

export async function GET() {
  return NextResponse.json({ variables: testVariables, testOrder, sprintTemplate, kpiBenchmarks, prebuiltMatrices });
}
