import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const checklist = {
  adCopy: {
    title: "Ad Copy",
    titlePt: "Texto do Anúncio",
    items: [
      { id: "no-guarantees", text: 'No "guarantees" of results/savings', textPt: 'Sem "garantias" de resultado', critical: true },
      { id: "no-fearmongering", text: "No fear-mongering or shaming", textPt: "Sem táticas de medo", critical: true },
      { id: "no-personal-attributes", text: 'No "you/your" + sensitive claims', textPt: 'Sem "tu/teu" + afirmações sensíveis', critical: true },
      { id: "escudo-terms", text: '"Escudo Fiscal" always with "até" + "termos"', textPt: '"Escudo Fiscal" sempre com "até" + "termos"', critical: true },
      { id: "headline-length", text: "Headline ≤ 7-9 words (PT)", textPt: "Headline ≤ 7-9 palavras (PT)", critical: false },
      { id: "single-message", text: "1 banner = 1 main message", textPt: "1 banner = 1 mensagem principal", critical: false },
      { id: "trust-marker", text: "Has trust marker (certificada / termos)", textPt: "Tem marcador de confiança", critical: false },
    ],
  },
  visual: {
    title: "Visual",
    titlePt: "Visual",
    items: [
      { id: "no-official-symbols", text: 'No "official" seals imitating government', textPt: 'Sem selos "oficiais"', critical: true },
      { id: "no-fine-letters", text: 'No "fine letters" or AT-style notifications', textPt: 'Sem "cartas de multa"', critical: true },
      { id: "no-scare-visuals", text: "No scare visuals (red alerts)", textPt: "Sem visuais de medo", critical: false },
      { id: "premium-minimal", text: "Premium minimal aesthetic", textPt: "Estética minimalista premium", critical: false },
      { id: "single-hero", text: "Single hero element", textPt: "Um elemento hero", critical: false },
    ],
  },
  safezones: {
    title: "Safe Zones",
    titlePt: "Zonas Seguras",
    items: [
      { id: "stories-margins", text: "9:16: ~250px top/bottom free", textPt: "9:16: ~250px topo/base livre", critical: true },
      { id: "key-content-center", text: "Key content in center safe zone", textPt: "Conteúdo chave na zona central", critical: true },
      { id: "safe-1-1", text: "Essential content fits Safe(1:1)", textPt: "Conteúdo essencial cabe em Safe(1:1)", critical: false },
      { id: "cta-not-bottom", text: "CTA not at very bottom", textPt: "CTA não no fundo", critical: false },
    ],
  },
  landing: {
    title: "Landing Page",
    titlePt: "Página de Destino",
    items: [
      { id: "offer-match", text: "Offer and conditions match the ad", textPt: "Oferta corresponde ao anúncio", critical: true },
      { id: "gdpr-consent", text: "Marketing consent is separate checkbox", textPt: "Consentimento é checkbox separado", critical: true },
      { id: "clear-controller", text: "Clear data controller info", textPt: "Controlador de dados claro", critical: true },
      { id: "cookie-banner", text: "Cookie banner: trackers after consent", textPt: "Cookies só após consentimento", critical: true },
    ],
  },
  whatsapp: {
    title: "WhatsApp (if used)",
    titlePt: "WhatsApp (se usado)",
    items: [
      { id: "wa-opt-in", text: "Explicit opt-in for WhatsApp marketing", textPt: "Opt-in explícito para WhatsApp", critical: true },
      { id: "wa-stop", text: 'Every promo has opt-out ("Responda STOP")', textPt: 'Cada promo tem como sair ("STOP")', critical: true },
      { id: "wa-user-initiated", text: "User-initiated conversations OK", textPt: "Conversas iniciadas OK", critical: false },
    ],
  },
};

const checklistMeta = {
  version: "1.0",
  lastUpdated: "2024",
  source: "FIZ Creative Playbook",
  criticalCount: Object.values(checklist).reduce((acc, section) => acc + section.items.filter((item) => item.critical).length, 0),
  totalCount: Object.values(checklist).reduce((acc, section) => acc + section.items.length, 0),
};

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  return NextResponse.json({ sections: checklist, meta: checklistMeta });
}
