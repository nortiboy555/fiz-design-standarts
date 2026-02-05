import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const ctas = {
  pt: [
    { id: 1, text: "Começar grátis", type: "primary", action: "signup" },
    { id: 2, text: "Experimentar agora", type: "primary", action: "trial" },
    { id: 3, text: "Criar a minha primeira fatura", type: "primary", action: "invoice" },
    { id: 4, text: "Ativar Autopiloto", type: "primary", action: "autopilot" },
    { id: 5, text: "Ver como funciona", type: "secondary", action: "learn" },
    { id: 6, text: "Quero mais calma", type: "emotional", action: "signup" },
    { id: 7, text: "Configurar em 2 minutos", type: "primary", action: "setup" },
    { id: 8, text: "Usar no WhatsApp", type: "primary", action: "whatsapp" },
    { id: 9, text: "Ver planos", type: "secondary", action: "pricing" },
    { id: 10, text: "Abrir conta", type: "primary", action: "signup" },
    { id: 11, text: "Pedir demonstração", type: "secondary", action: "demo" },
    { id: 12, text: "Falar connosco", type: "secondary", action: "contact" },
    { id: 13, text: "Ver termos", type: "tertiary", action: "terms" },
    { id: 14, text: "Saiba mais", type: "secondary", action: "learn" },
    { id: 15, text: "Começar hoje", type: "primary", action: "signup" },
    { id: 16, text: "Simplificar agora", type: "emotional", action: "signup" },
    { id: 17, text: "Obter controlo", type: "emotional", action: "signup" },
    { id: 18, text: "Testar grátis", type: "primary", action: "trial" },
    { id: 19, text: "Gerar fatura", type: "primary", action: "invoice" },
    { id: 20, text: "Ativar proteção", type: "primary", action: "escudo" },
  ],
  en: [
    { id: 1, text: "Start free", type: "primary", action: "signup" },
    { id: 2, text: "Try it now", type: "primary", action: "trial" },
    { id: 3, text: "Create your first invoice", type: "primary", action: "invoice" },
    { id: 4, text: "Turn Autopilot on", type: "primary", action: "autopilot" },
    { id: 5, text: "See how it works", type: "secondary", action: "learn" },
    { id: 6, text: "Get tax calm", type: "emotional", action: "signup" },
    { id: 7, text: "Set up in minutes", type: "primary", action: "setup" },
    { id: 8, text: "Use WhatsApp", type: "primary", action: "whatsapp" },
    { id: 9, text: "View plans", type: "secondary", action: "pricing" },
    { id: 10, text: "Open an account", type: "primary", action: "signup" },
    { id: 11, text: "Book a demo", type: "secondary", action: "demo" },
    { id: 12, text: "Talk to us", type: "secondary", action: "contact" },
    { id: 13, text: "See terms", type: "tertiary", action: "terms" },
    { id: 14, text: "Learn more", type: "secondary", action: "learn" },
    { id: 15, text: "Start today", type: "primary", action: "signup" },
    { id: 16, text: "Simplify now", type: "emotional", action: "signup" },
    { id: 17, text: "Get control", type: "emotional", action: "signup" },
    { id: 18, text: "Try for free", type: "primary", action: "trial" },
    { id: 19, text: "Generate invoice", type: "primary", action: "invoice" },
    { id: 20, text: "Enable protection", type: "primary", action: "escudo" },
  ],
};

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "pt") as "pt" | "en";

  return NextResponse.json(ctas[lang] || ctas.pt);
}
