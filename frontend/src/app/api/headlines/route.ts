import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const headlines = {
  pt: [
    { id: 1, text: "IVA e Segurança Social no automático.", offer: "autopilot", emotion: "calm" },
    { id: 2, text: "Faturação 0€ para sempre. Sem stress.", offer: "free", emotion: "calm" },
    { id: 3, text: "Um escudo contra coimas (até 1.500€).", offer: "escudo", emotion: "protection" },
    { id: 4, text: "Emite faturas pelo WhatsApp.", offer: "whatsapp", emotion: "speed" },
    { id: 5, text: "Menos burocracia. Mais controlo.", offer: "autopilot", emotion: "control" },
    { id: 6, text: "A tua vida fiscal, em piloto automático.", offer: "autopilot", emotion: "calm" },
    { id: 7, text: "Fatura feita em segundos.", offer: "whatsapp", emotion: "speed" },
    { id: 8, text: "Tudo em dia. Sem caos.", offer: "autopilot", emotion: "calm" },
    { id: 9, text: "Proteção fiscal, sem complicações.", offer: "escudo", emotion: "protection" },
    { id: 10, text: "Faturação certificada. Paz mental.", offer: "free", emotion: "calm" },
    { id: 11, text: "Do WhatsApp para a fatura — pronto.", offer: "whatsapp", emotion: "speed" },
    { id: 12, text: "Autopiloto ON: IVA + SS.", offer: "autopilot", emotion: "control" },
    { id: 13, text: "Trabalha. O resto fica com o FIZ.", offer: "autopilot", emotion: "calm" },
    { id: 14, text: "Controlo total, sem ser contabilista.", offer: "autopilot", emotion: "control" },
    { id: 15, text: "O escudo fiscal que te dá calma.", offer: "escudo", emotion: "protection" },
    { id: 16, text: "Faturas e impostos, sem ansiedade.", offer: "autopilot", emotion: "calm" },
    { id: 17, text: "Simples por fora. Forte por dentro.", offer: "escudo", emotion: "protection" },
    { id: 18, text: "Um sistema que te protege.", offer: "escudo", emotion: "protection" },
    { id: 19, text: "A forma moderna de lidar com impostos.", offer: "autopilot", emotion: "control" },
    { id: 20, text: "Faturação grátis. Proteção incluída.", offer: "free", emotion: "protection" },
    { id: 21, text: "Sem correr atrás de prazos.", offer: "autopilot", emotion: "calm" },
    { id: 22, text: "Menos erros. Mais confiança.", offer: "autopilot", emotion: "control" },
    { id: 23, text: "A tua faturação, certificada e simples.", offer: "free", emotion: "calm" },
    { id: 24, text: "Autopiloto fiscal para independentes.", offer: "autopilot", emotion: "control" },
    { id: 25, text: "Fizeste a fatura? Já está.", offer: "whatsapp", emotion: "speed" },
    { id: 26, text: "WhatsApp-first. Tempo ganho.", offer: "whatsapp", emotion: "speed" },
    { id: 27, text: "Calma fiscal começa aqui.", offer: "autopilot", emotion: "calm" },
    { id: 28, text: "A tua rotina fiscal, organizada.", offer: "autopilot", emotion: "control" },
    { id: 29, text: "Protege-te do caos fiscal.", offer: "escudo", emotion: "protection" },
    { id: 30, text: "Fatura + IVA + SS: tudo em ordem.", offer: "autopilot", emotion: "control" },
  ],
  en: [
    { id: 1, text: "Portugal taxes, on autopilot.", offer: "autopilot", emotion: "calm" },
    { id: 2, text: "Free invoicing. Forever.", offer: "free", emotion: "calm" },
    { id: 3, text: "VAT + Social Security—automated.", offer: "autopilot", emotion: "control" },
    { id: 4, text: "Create invoices via WhatsApp.", offer: "whatsapp", emotion: "speed" },
    { id: 5, text: "Tax calm. Real control.", offer: "autopilot", emotion: "control" },
    { id: 6, text: "Your fiscal safety layer (up to €1,500).", offer: "escudo", emotion: "protection" },
    { id: 7, text: "Invoices in seconds, not hours.", offer: "whatsapp", emotion: "speed" },
    { id: 8, text: "Stay compliant—without the stress.", offer: "autopilot", emotion: "calm" },
    { id: 9, text: "The modern way to handle PT taxes.", offer: "autopilot", emotion: "control" },
    { id: 10, text: "Less paperwork. More peace.", offer: "autopilot", emotion: "calm" },
    { id: 11, text: "Autopilot ON: VAT + SS.", offer: "autopilot", emotion: "control" },
    { id: 12, text: "From WhatsApp to invoice—done.", offer: "whatsapp", emotion: "speed" },
    { id: 13, text: "A shield for your tax routine.", offer: "escudo", emotion: "protection" },
    { id: 14, text: "Clear, simple, built for Portugal.", offer: "free", emotion: "calm" },
    { id: 15, text: "Stop guessing VAT.", offer: "autopilot", emotion: "control" },
    { id: 16, text: "Protection + automation, together.", offer: "escudo", emotion: "protection" },
    { id: 17, text: "Get invoices right—fast.", offer: "whatsapp", emotion: "speed" },
    { id: 18, text: "Stay on track, stay calm.", offer: "autopilot", emotion: "calm" },
    { id: 19, text: "Invoicing is free. The rest is smarter.", offer: "free", emotion: "calm" },
    { id: 20, text: "Tax admin, simplified.", offer: "autopilot", emotion: "control" },
    { id: 21, text: "Designed for freelancers in Portugal.", offer: "free", emotion: "calm" },
    { id: 22, text: "One app. Total clarity.", offer: "autopilot", emotion: "control" },
    { id: 23, text: "No chaos. Just control.", offer: "autopilot", emotion: "control" },
    { id: 24, text: "Compliance made simple.", offer: "autopilot", emotion: "calm" },
    { id: 25, text: "Your invoices, Portugal-ready.", offer: "free", emotion: "calm" },
    { id: 26, text: "Automate what drains your time.", offer: "autopilot", emotion: "speed" },
    { id: 27, text: "Peace of mind for self-employed.", offer: "escudo", emotion: "protection" },
    { id: 28, text: "A calmer tax workflow.", offer: "autopilot", emotion: "calm" },
    { id: 29, text: "Do the work. We handle the admin.", offer: "autopilot", emotion: "calm" },
    { id: 30, text: "Your tax routine—protected.", offer: "escudo", emotion: "protection" },
  ],
};

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "pt") as "pt" | "en";
  const offer = searchParams.get("offer");

  let result = headlines[lang] || headlines.pt;

  if (offer && offer !== "all") {
    result = result.filter((h) => h.offer === offer);
  }

  return NextResponse.json(result);
}
