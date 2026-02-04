"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface GeneratedCopy {
  headline: string;
  subhead: string;
  cta: string;
}

interface CheckResult {
  isClean: boolean;
  issues: Array<{
    word: string;
    severity: "high" | "medium";
    reason: string;
    suggestion: string;
  }>;
}

export default function CopyLabPage() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [offer, setOffer] = useState("autopilot");
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [checkInput, setCheckInput] = useState("");
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await api.get<GeneratedCopy>(`/copy/generate?lang=${lang}&offer=${offer}`);
      setGeneratedCopy(data);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheck = async () => {
    if (!checkInput.trim()) return;
    setIsChecking(true);
    try {
      const data = await api.post<CheckResult>("/copy/check", { text: checkInput });
      setCheckResult(data);
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Copy Lab"
        description="Generate compliant ad copy and check for issues"
      >
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setLang("pt")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              lang === "pt" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            PT
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              lang === "en" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            EN
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate Copy */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-base">Generate Copy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target ICP</Label>
                <Select defaultValue="trabalhador">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalhador">Trabalhador Independente</SelectItem>
                    <SelectItem value="expat">Expat / Digital Nomad</SelectItem>
                    <SelectItem value="dependente">Single Client Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Offer Type</Label>
                <Select value={offer} onValueChange={setOffer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autopilot">Autopilot (IVA + SS)</SelectItem>
                    <SelectItem value="escudo">Escudo Fiscal</SelectItem>
                    <SelectItem value="free">0 EUR Forever</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp-first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? "Generating..." : "Generate Combination"}
            </Button>

            {generatedCopy && (
              <div className="space-y-3 pt-4 border-t border-border/40">
                {[
                  { label: "Headline", value: generatedCopy.headline },
                  { label: "Subhead", value: generatedCopy.subhead },
                  { label: "CTA", value: generatedCopy.cta },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{item.label}</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <span className="flex-1 text-sm">{item.value || "-"}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.value)}
                        className="h-7 px-2 text-xs"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() =>
                    copyToClipboard(
                      `Headline: ${generatedCopy.headline}\nSubhead: ${generatedCopy.subhead}\nCTA: ${generatedCopy.cta}`
                    )
                  }
                >
                  Copy All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check Copy */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-base">Check Your Copy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Paste your ad copy here</Label>
              <Textarea
                value={checkInput}
                onChange={(e) => setCheckInput(e.target.value)}
                placeholder="Paste your headline, subhead, or full ad copy to check for compliance issues..."
                className="min-h-[120px]"
              />
            </div>

            <Button onClick={handleCheck} disabled={isChecking || !checkInput.trim()} className="w-full">
              {isChecking ? "Checking..." : "Check for Issues"}
            </Button>

            {checkResult && (
              <div className="pt-4 border-t border-border/40 space-y-3">
                {checkResult.isClean ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-emerald-500 text-xl">✓</span>
                    <div>
                      <p className="font-medium text-emerald-500">All clear!</p>
                      <p className="text-sm text-muted-foreground">
                        No banned words or risky patterns found.
                      </p>
                    </div>
                  </div>
                ) : (
                  checkResult.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        issue.severity === "high"
                          ? "bg-destructive/10 border-destructive/20"
                          : "bg-amber-500/10 border-amber-500/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={issue.severity === "high" ? "text-destructive" : "text-amber-500"}>
                          {issue.severity === "high" ? "✕" : "!"}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <Badge variant={issue.severity === "high" ? "destructive" : "outline"} className="mr-2">
                              {issue.severity === "high" ? "High Risk" : "Warning"}
                            </Badge>
                            Found "<strong>{issue.word}</strong>" — {issue.reason}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Suggestion: {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
