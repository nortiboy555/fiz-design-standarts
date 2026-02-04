import { NextResponse } from "next/server";

const competitors = {
  invoicexpress: {
    id: "invoicexpress",
    name: "InvoiceXpress",
    positioning: "Software de faturação online certificado",
    strengths: ["Established brand in PT market", "Simple positioning", "Certified invoicing focus"],
    weaknesses: ["Tool-focused, not emotion-focused", "No protection/shield angle"],
    fizAngle: "They sell a tool. FIZ sells peace of mind + protection.",
  },
  moloni: {
    id: "moloni",
    name: "Moloni",
    positioning: "38.000 empresas confiam — apoio 100% gratuito",
    strengths: ["Strong social proof", "Free support messaging", "Security emphasis"],
    weaknesses: ["B2B focused, not freelancer-first", "Feature-heavy messaging"],
    fizAngle: "They target businesses. FIZ targets independents with autopilot + protection.",
  },
  toconline: {
    id: "toconline",
    name: "TOConline / OCC",
    positioning: "Programa online da Ordem dos Contabilistas",
    strengths: ["Institutional trust", "Full accounting solution"],
    weaknesses: ['Too "accounting" for simple freelancers', "Intimidating"],
    fizAngle: "They're for accountants. FIZ is for people who don't want to think like accountants.",
  },
  phc: {
    id: "phc",
    name: "PHC (Cegid PHC)",
    positioning: "ERP/gestão com IA",
    strengths: ["Enterprise credibility", "AI/innovation messaging"],
    weaknesses: ["Too enterprise for independents", "Overkill for simple invoicing"],
    fizAngle: "PHC is enterprise software. FIZ is a personal tax companion.",
  },
  rauva: {
    id: "rauva",
    name: "Rauva",
    positioning: "Certified invoicing to tax compliance + fintech/payments",
    strengths: ["Modern fintech approach", "Banking + invoicing combo"],
    weaknesses: ["Broad positioning", "Less focused on freelancer pain"],
    fizAngle: "Rauva is a bank with invoicing. FIZ is tax peace with invoicing as entry point.",
  },
};

const competitorPatterns = {
  working: ["Certificates + simplicity messaging", "Social proof", "Product screenshots", "Certification badges"],
  boring: ["They sell a tool, not an emotion", "Too many features in one banner", "Generic positioning"],
};

const fizPositioning = {
  category: "Tax Peace + Shield",
  notCategory: "Invoicing App",
  commodity: { what: "0€ faturação", why: "Market minimum expectation" },
  differentiators: [
    { name: "Autopilot", description: "IVA + SS automated", emotion: "I don't have to think about it" },
    { name: "Protection", description: "Escudo Fiscal até 1.500€", emotion: "I'm covered if something goes wrong" },
    { name: "Trust", description: "Certificada + transparency", emotion: "I can trust this" },
  ],
};

export async function GET() {
  return NextResponse.json({ competitors, fizPositioning, patterns: competitorPatterns });
}
