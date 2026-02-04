"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Headline {
  text: string;
  offer: string;
}

interface Subhead {
  text: string;
}

interface Cta {
  text: string;
}

export default function HeadlinesPage() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [filter, setFilter] = useState("all");
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [subheads, setSubheads] = useState<Subhead[]>([]);
  const [ctas, setCtas] = useState<Cta[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<Headline[]>(`/headlines?lang=${lang}&offer=${filter}`),
      api.get<Subhead[]>(`/subheads?lang=${lang}`),
      api.get<Cta[]>(`/ctas?lang=${lang}`),
    ]).then(([h, s, c]) => {
      setHeadlines(h);
      setSubheads(s);
      setCtas(c);
    });
  }, [lang, filter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Copy Formulas"
        description="Pre-approved headlines, subheads, and CTAs"
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

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="autopilot">Autopilot</TabsTrigger>
          <TabsTrigger value="escudo">Escudo</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-8">
        {/* Headlines */}
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Headlines ({headlines.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {headlines.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{h.text}</span>
                    <Badge variant="outline" className="text-xs">
                      {h.offer}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(h.text)}
                    className="h-7 px-2 text-xs"
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subheads */}
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Subheads ({subheads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subheads.slice(0, 15).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{s.text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(s.text)}
                    className="h-7 px-2 text-xs"
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">CTAs ({ctas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ctas.map((c, i) => (
                <Button
                  key={i}
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(c.text)}
                  className="text-sm"
                >
                  {c.text}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
