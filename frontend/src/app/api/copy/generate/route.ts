import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const headlines = {
  pt: [
    { text: "IVA e Segurança Social no automático.", offer: "autopilot", emotion: "calm" },
    { text: "Faturação 0€ para sempre. Sem stress.", offer: "free", emotion: "calm" },
    { text: "Um escudo contra coimas (até 1.500€).", offer: "escudo", emotion: "protection" },
    { text: "Emite faturas pelo WhatsApp.", offer: "whatsapp", emotion: "speed" },
    { text: "Menos burocracia. Mais controlo.", offer: "autopilot", emotion: "control" },
    { text: "A tua vida fiscal, em piloto automático.", offer: "autopilot", emotion: "calm" },
    { text: "Fatura feita em segundos.", offer: "whatsapp", emotion: "speed" },
    { text: "Tudo em dia. Sem caos.", offer: "autopilot", emotion: "calm" },
  ],
  en: [
    { text: "Portugal taxes, on autopilot.", offer: "autopilot", emotion: "calm" },
    { text: "Free invoicing. Forever.", offer: "free", emotion: "calm" },
    { text: "VAT + Social Security—automated.", offer: "autopilot", emotion: "control" },
    { text: "Create invoices via WhatsApp.", offer: "whatsapp", emotion: "speed" },
  ],
};

const subheads = {
  pt: [
    { text: "Faturação certificada + rotina fiscal organizada." },
    { text: "IVA e SS com lembretes e automação." },
    { text: "Cobertura até 1.500€ (ver termos)." },
    { text: "Emite por texto ou voz no WhatsApp." },
    { text: "Tudo num só lugar, sem complicações." },
  ],
  en: [
    { text: "Certified invoicing + a calmer tax workflow." },
    { text: "VAT & Social Security—automated guidance." },
    { text: "Coverage up to €1,500 (terms apply)." },
  ],
};

const ctas = {
  pt: [
    { text: "Começar grátis", type: "primary" },
    { text: "Experimentar agora", type: "primary" },
    { text: "Ativar Autopiloto", type: "primary" },
    { text: "Ver como funciona", type: "secondary" },
    { text: "Usar no WhatsApp", type: "primary" },
  ],
  en: [
    { text: "Start free", type: "primary" },
    { text: "Try it now", type: "primary" },
    { text: "Turn Autopilot on", type: "primary" },
  ],
};

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "pt") as "pt" | "en";
  const offer = searchParams.get("offer") || "autopilot";

  const langHeadlines = headlines[lang] || headlines.pt;
  const filteredHeadlines = langHeadlines.filter((h) => h.offer === offer);
  const headline = filteredHeadlines[Math.floor(Math.random() * filteredHeadlines.length)] || langHeadlines[0];

  const langSubheads = subheads[lang] || subheads.pt;
  const subhead = langSubheads[Math.floor(Math.random() * langSubheads.length)];

  const langCtas = ctas[lang] || ctas.pt;
  const cta = langCtas[Math.floor(Math.random() * langCtas.length)];

  return NextResponse.json({
    headline: headline?.text || "",
    subhead: subhead?.text || "",
    cta: cta?.text || "",
    meta: { headlineOffer: headline?.offer, headlineEmotion: headline?.emotion, ctaType: cta?.type },
  });
}
