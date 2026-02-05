import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const banWords = {
  hardBan: [
    { words: ["garantido", "garantimos", "garantia", "guaranteed", "guarantee"], reason: "Misleading - cannot guarantee financial outcomes", severity: "high", suggestion: 'Use "até" (up to) with terms reference' },
    { words: ["100%", "sempre", "nunca", "always", "never"], reason: "Absolute claims are misleading in fintech context", severity: "high", suggestion: "Remove absolutes or add qualifying conditions" },
    { words: ["sem risco", "zero risco", "no risk", "risk-free"], reason: "Financial services always carry some risk", severity: "high", suggestion: "Focus on protection/coverage with terms" },
    { words: ["oficial", "governo", "official", "government"], reason: "False affiliation claims", severity: "high", suggestion: 'Use "certificada pela AT" if true' },
  ],
  softBan: [
    { words: ["evita multas agora", "avoid fines now", "último aviso", "last warning"], reason: "False urgency / scare tactics", severity: "medium", suggestion: 'Use calm messaging like "proteção"' },
    { words: ["tu estás atrasado", "you are behind", "tens dívidas"], reason: "Personal attributes prohibited", severity: "medium", suggestion: "Use general benefits, not accusations" },
    { words: ["urgente", "urgent", "imediato", "immediately"], reason: "Pressure tactics reduce trust", severity: "medium", suggestion: "Focus on convenience, not urgency" },
  ],
  watchPatterns: [
    { pattern: "\\d+€?\\s*(garantido|certo|fixo)", reason: "Amount + guarantee combination", suggestion: 'Add "até" before amount' },
    { pattern: "(multa|coima|penalidade).*(!|\\?)", reason: "Fine mention with emotional punctuation", suggestion: "Keep fine mentions neutral" },
  ],
};

const complianceRules = {
  escudoFiscal: {
    mustHave: ['"até" before amount', '"sujeito a termos"'],
    mustNotHave: ["garantimos", "sempre", "100%"],
    example: { good: "Cobertura de coimas até 1.500€ (sujeito a termos)", bad: "Garantimos cobertura de 1.500€" },
  },
  freeInvoicing: {
    mustHave: ["Plan specification if limited"],
    example: { good: "Faturação 0€ para sempre (plano básico)", bad: "Faturação grátis*" },
  },
  autopilot: {
    mustHave: ["Clarity on what's automated"],
    example: { good: "IVA + Segurança Social no automático — lembretes e cálculos", bad: "Nunca mais te preocupes" },
  },
};

const severityLevels = {
  high: { label: "High Risk", color: "#ef4444", action: "Must change before publishing" },
  medium: { label: "Medium Risk", color: "#f59e0b", action: "Recommended to change" },
  low: { label: "Low Risk", color: "#3b82f6", action: "Consider reviewing" },
};

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  return NextResponse.json({ hardBan: banWords.hardBan, softBan: banWords.softBan, watchPatterns: banWords.watchPatterns, complianceRules, severityLevels });
}
