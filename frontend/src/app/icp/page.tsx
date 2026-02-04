"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface IcpData {
  [key: string]: {
    name: string;
    nameEn: string;
    fears: Array<{ pt: string; en: string; insight: string }>;
    triggers: Array<{ text: string; en: string }>;
    keywords: { pt: string[]; en: string[] };
    trustVisuals: string[];
    tooGoodToBe: Array<{ bad: string; en: string }>;
  };
}

export default function IcpPage() {
  const [data, setData] = useState<IcpData | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    api.get<IcpData>("/icp").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="ICP Cards"
        description="Target audience segments — fears, triggers, keywords, and visual preferences"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.values(data).map((icp) => (
          <Card key={icp.name} className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{icp.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{icp.nameEn}</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="fears" className="w-full">
                <TabsList className="w-full grid grid-cols-5 h-8 bg-muted/50 p-0.5 gap-0.5">
                  <TabsTrigger value="fears" className="text-[11px] px-1 py-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-sm">Fears</TabsTrigger>
                  <TabsTrigger value="triggers" className="text-[11px] px-1 py-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-sm">Triggers</TabsTrigger>
                  <TabsTrigger value="keywords" className="text-[11px] px-1 py-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-sm">Keys</TabsTrigger>
                  <TabsTrigger value="visuals" className="text-[11px] px-1 py-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-sm">Visuals</TabsTrigger>
                  <TabsTrigger value="avoid" className="text-[11px] px-1 py-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-sm">Avoid</TabsTrigger>
                </TabsList>

                <TabsContent value="fears" className="mt-4 space-y-3">
                  {icp.fears.map((fear, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-medium text-sm">
                        {lang === "pt" ? fear.pt : fear.en}
                      </p>
                      <p className="text-xs text-muted-foreground">{fear.insight}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="triggers" className="mt-4">
                  <ul className="space-y-2">
                    {icp.triggers.map((trigger, i) => (
                      <li key={i} className="text-sm">
                        {lang === "pt" ? trigger.text : trigger.en}
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="keywords" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {icp.keywords[lang].map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="visuals" className="mt-4">
                  <ul className="space-y-2">
                    {icp.trustVisuals.map((visual, i) => (
                      <li key={i} className="text-sm">{visual}</li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="avoid" className="mt-4">
                  <ul className="space-y-2">
                    {icp.tooGoodToBe.map((item, i) => (
                      <li key={i} className="text-sm text-destructive">
                        {lang === "pt" ? item.bad : item.en}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
