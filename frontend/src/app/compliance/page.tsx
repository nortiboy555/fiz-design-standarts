"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BanWordsData {
  hardBan: Array<{
    words: string[];
    reason: string;
    suggestion: string;
  }>;
  softBan: Array<{
    words: string[];
    reason: string;
    suggestion: string;
  }>;
  complianceRules: {
    [key: string]: {
      example: {
        good: string;
        bad: string;
      };
    };
  };
}

export default function CompliancePage() {
  const [data, setData] = useState<BanWordsData | null>(null);

  useEffect(() => {
    api.get<BanWordsData>("/banwords").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Compliance Guide"
        description="Banned words, risky patterns, and safe alternatives"
      />

      {/* Hard Bans */}
      <section className="mb-8">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-destructive">Hard Bans — High Risk</CardTitle>
            <p className="text-sm text-muted-foreground">
              These will likely cause rejection or severely throttle delivery
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.hardBan.map((ban, i) => (
              <div key={i} className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {ban.words.map((word, j) => (
                    <Badge key={j} variant="destructive" className="text-xs">
                      {word}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{ban.reason}</p>
                <p className="text-xs text-emerald-400">Suggestion: {ban.suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Soft Bans */}
      <section className="mb-8">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-500">Soft Bans — Medium Risk</CardTitle>
            <p className="text-sm text-muted-foreground">
              May reduce delivery or trigger manual review
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.softBan.map((ban, i) => (
              <div key={i} className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {ban.words.map((word, j) => (
                    <Badge key={j} variant="outline" className="text-xs border-amber-500/50 text-amber-500">
                      {word}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{ban.reason}</p>
                <p className="text-xs text-emerald-400">Suggestion: {ban.suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Compliance Examples */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Compliance Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.complianceRules).map(([key, rule]) => (
            <Card key={key} className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/50 mb-2 text-xs">
                    Good
                  </Badge>
                  <p className="text-sm">{rule.example.good}</p>
                </div>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <Badge variant="outline" className="text-destructive border-destructive/50 mb-2 text-xs">
                    Bad
                  </Badge>
                  <p className="text-sm">{rule.example.bad}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
