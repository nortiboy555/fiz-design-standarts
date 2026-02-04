import { NextRequest, NextResponse } from "next/server";

const testVariables: Record<string, { id: string; options: Array<{ id: string; name: string; example: string }> }> = {
  hook: {
    id: "hook",
    options: [
      { id: "calm", name: "Calm", example: "Mais calma. Menos burocracia." },
      { id: "control", name: "Control", example: "Controlo total, sem ser contabilista." },
      { id: "speed", name: "Speed", example: "Fatura feita em segundos." },
      { id: "protection", name: "Protection", example: "Um escudo contra coimas." },
    ],
  },
  offer: {
    id: "offer",
    options: [
      { id: "autopilot", name: "Autopilot", example: "IVA + SS no automático" },
      { id: "escudo", name: "Escudo Fiscal", example: "Cobertura até 1.500€" },
      { id: "free", name: "0€ Forever", example: "Faturação grátis para sempre" },
      { id: "whatsapp", name: "WhatsApp-first", example: "Cria faturas pelo WhatsApp" },
    ],
  },
  visual: {
    id: "visual",
    options: [
      { id: "premium", name: "Premium Protection", example: "Dark + shield + metallic" },
      { id: "minimal", name: "Minimal Autopilot", example: "Light + clean + Stripe-like" },
      { id: "whatsapp", name: "WhatsApp Friendly", example: "Chat bubbles + warm" },
    ],
  },
  proof: {
    id: "proof",
    options: [
      { id: "certified", name: "Certificada", example: "Certificada pela AT / SAF-T" },
      { id: "terms", name: "Escudo + Termos", example: "até 1.500€ (ver termos)" },
      { id: "whatsapp-demo", name: "WhatsApp Demo", example: "Chat screenshot" },
      { id: "built-pt", name: "Built for PT", example: "Feito para Portugal" },
    ],
  },
  cta: {
    id: "cta",
    options: [
      { id: "start-free", name: "Start Free", example: "Começar grátis" },
      { id: "autopilot-on", name: "Enable Autopilot", example: "Ativar Autopiloto" },
      { id: "use-whatsapp", name: "Use WhatsApp", example: "Usar no WhatsApp" },
      { id: "see-how", name: "See How", example: "Ver como funciona" },
    ],
  },
};

function cartesian<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>((acc, arr) => acc.flatMap((x) => arr.map((y) => [...x, y])), [[]]);
}

function generateMatrix(selectedVariables: string[]) {
  const vars = selectedVariables.map((v) => testVariables[v]).filter(Boolean);
  const optionArrays = vars.map((v) => v.options.map((o) => ({ variable: v.id, ...o })));
  const combinations = cartesian(optionArrays);

  return combinations.map((combo, i) => ({
    id: `V${String(i + 1).padStart(2, "0")}`,
    elements: combo,
    status: "pending",
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { variables } = await request.json();

    if (!variables || !Array.isArray(variables) || variables.length === 0) {
      return NextResponse.json({ error: "Variables array is required" }, { status: 400 });
    }

    const matrix = generateMatrix(variables);
    return NextResponse.json({
      variables: variables.map((v: string) => testVariables[v]),
      combinations: matrix,
      total: matrix.length,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
