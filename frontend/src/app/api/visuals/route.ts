import { NextResponse } from "next/server";

const styleDirections = {
  premium: {
    id: "premium",
    name: "Premium Protection",
    concept: 'FIZ = "shield" between you and tax chaos',
    colorApproach: {
      description: 'Dark base + one "metallic/light" accent',
      palette: { primary: "#1a1a2e", secondary: "#16213e", accent: "#e94560", text: "#ffffff" },
    },
    typography: { headline: "Large headline (bold), secondary text thinner", style: "High contrast, confident" },
    recommendedFor: ["escudo", "dependente"],
  },
  minimal: {
    id: "minimal",
    name: "Tax Autopilot Minimal",
    concept: "Calm clarity. You work — FIZ counts/reminds/prepares",
    colorApproach: {
      description: "Light base, soft neutrals, one accent color",
      palette: { primary: "#ffffff", secondary: "#f8fafc", accent: "#667eea", text: "#1e293b" },
    },
    typography: { headline: "Stripe-like clarity: short headline + 2 bullets max", style: "Clean, professional" },
    recommendedFor: ["autopilot", "free"],
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp-first Friendly",
    concept: "Fastest path to invoice — by voice/text",
    colorApproach: {
      description: "Warm neutral background + friendly shapes",
      palette: { primary: "#fefefe", secondary: "#f0f4f0", accent: "#25D366", text: "#1e293b" },
    },
    typography: { headline: "Slightly more human, but still fintech", style: "Approachable but professional" },
    recommendedFor: ["whatsapp"],
    warning: "Do not overuse WhatsApp branding",
  },
};

const premiumPrinciples = [
  { rule: 'Editorial grid + typography, not "art for art\'s sake"', result: '70% "silence", 30% "signal"' },
  { rule: 'One "expensive" hero element', elements: ["Shield", "UI card", "Chat bubble"] },
  { rule: "Premium gradients only as highlight", avoid: 'Background entirely "acid gradient"' },
  { rule: "Typography wins over illustrations", approach: "Bold headline + micro-proof" },
  { rule: 'No "financial screaming" triggers', avoid: ["Red warnings", "Fine letters", "Panic"] },
];

const staticTemplates = [
  { id: 1, name: "CALM HERO", type: "hook", description: "Mais calma. Menos burocracia." },
  { id: 2, name: "CONTROL SNAPSHOT", type: "hook", description: "Controlo real, todos os dias." },
  { id: 3, name: "FREE FOREVER BADGE", type: "offer", description: '0€ para sempre + 1 proof' },
  { id: 4, name: "SHIELD 1500", type: "offer", description: "Shield + até 1.500€ + termos" },
  { id: 5, name: "CERTIFIED STACK", type: "trust", description: "certificada / SAF-T / conformidade" },
  { id: 6, name: "BUILT FOR PORTUGAL", type: "trust", description: "Feito para Portugal: IVA + SS" },
  { id: 7, name: "SOCIAL PROOF CARD", type: "proof", description: "Review/short quote + badges" },
  { id: 8, name: "PROCESS PROOF", type: "proof", description: "Autopiloto ON + 2 statuses" },
  { id: 9, name: "AUTOPILOT TOGGLES", type: "feature", description: "Two toggles IVA ON / SS ON" },
  { id: 10, name: "WHATSAPP CHAT DEMO", type: "feature", description: "1 command → Fatura pronta" },
  { id: 11, name: "SPLIT: OFFER + PROOF", type: "hybrid", description: "Left badge, right UI card" },
  { id: 12, name: "EDITORIAL GRID", type: "hybrid", description: "Large headline + 2 micro-bullets + CTA" },
];

const motionScenarios = [
  { id: 1, name: "Autopilot ON", structure: [{ time: "0-2s", content: "IVA + SS no automático" }] },
  { id: 2, name: "Shield Layer", structure: [{ time: "0-2s", content: "Escudo Fiscal" }] },
  { id: 3, name: "0€ Forever", structure: [{ time: "0-2s", content: "0€ para sempre" }] },
  { id: 4, name: "WhatsApp Invoice", structure: [{ time: "0-2s", content: "Criar fatura 120€ + IVA" }] },
];

export async function GET() {
  return NextResponse.json({ directions: styleDirections, principles: premiumPrinciples, staticTemplates, motionScenarios });
}
