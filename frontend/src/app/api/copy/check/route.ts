import { NextRequest, NextResponse } from "next/server";

const banWords = {
  hardBan: [
    { words: ["garantido", "garantimos", "garantia", "guaranteed", "guarantee", "we guarantee"], reason: "Misleading - cannot guarantee financial outcomes", severity: "high", suggestion: 'Use "até" (up to) with terms reference' },
    { words: ["100%", "sempre", "nunca", "always", "never", "100 percent"], reason: "Absolute claims are misleading in fintech context", severity: "high", suggestion: "Remove absolutes or add qualifying conditions" },
    { words: ["sem risco", "zero risco", "no risk", "risk-free", "risk free"], reason: "Financial services always carry some risk", severity: "high", suggestion: "Focus on protection/coverage with terms" },
    { words: ["oficial", "governo", "official", "government", "government-approved"], reason: "False affiliation claims unless actually affiliated", severity: "high", suggestion: 'Use "certificada pela AT" if true, otherwise remove' },
  ],
  softBan: [
    { words: ["evita multas agora", "avoid fines now", "último aviso", "last warning", "última chance", "last chance"], reason: "False urgency / scare tactics", severity: "medium", suggestion: 'Use calm messaging like "proteção" or "calma fiscal"' },
    { words: ["tu estás atrasado", "you are behind", "tens dívidas", "you have debts", "não pagas", "you don't pay"], reason: "Personal attributes - Meta prohibits targeting personal financial status", severity: "medium", suggestion: "Use general benefits, not accusations" },
    { words: ["urgente", "urgent", "imediato", "immediately", "agora mesmo", "right now"], reason: "Pressure tactics reduce trust and may trigger review", severity: "medium", suggestion: "Focus on convenience, not urgency" },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const input = text.toLowerCase();
    const issues: Array<{ severity: string; type: string; word: string; reason: string; suggestion: string }> = [];

    // Check hard bans
    banWords.hardBan.forEach((ban) => {
      ban.words.forEach((word) => {
        if (input.includes(word.toLowerCase())) {
          issues.push({ severity: "high", type: "hardBan", word, reason: ban.reason, suggestion: ban.suggestion });
        }
      });
    });

    // Check soft bans
    banWords.softBan.forEach((ban) => {
      ban.words.forEach((word) => {
        if (input.includes(word.toLowerCase())) {
          issues.push({ severity: "medium", type: "softBan", word, reason: ban.reason, suggestion: ban.suggestion });
        }
      });
    });

    return NextResponse.json({
      isClean: issues.length === 0,
      issues,
      summary: {
        high: issues.filter((i) => i.severity === "high").length,
        medium: issues.filter((i) => i.severity === "medium").length,
        low: issues.filter((i) => i.severity === "low").length,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
