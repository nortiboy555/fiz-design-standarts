"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChecklistItem {
  id: string;
  text: string;
  textPt: string;
  critical?: boolean;
}

interface ChecklistSection {
  title: string;
  titlePt: string;
  items: ChecklistItem[];
}

interface ChecklistData {
  sections: {
    [key: string]: ChecklistSection;
  };
}

export default function ChecklistPage() {
  const [data, setData] = useState<ChecklistData | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.get<ChecklistData>("/checklist").then(setData);
  }, []);

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    setChecked({});
  };

  const getProgress = (section: ChecklistSection) => {
    const total = section.items.length;
    const done = section.items.filter((item) => checked[item.id]).length;
    return { done, total };
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Pre-flight Checklist"
        description="Verify your creative before publishing to Meta"
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

      <div className="space-y-6">
        {Object.entries(data.sections).map(([key, section]) => {
          const progress = getProgress(section);
          return (
            <Card key={key} className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {lang === "pt" ? section.titlePt : section.title}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {progress.done} / {progress.total}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        checked[item.id] ? "bg-emerald-500/10" : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        id={item.id}
                        checked={checked[item.id] || false}
                        onCheckedChange={() => toggleCheck(item.id)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer flex-1 ${
                          item.critical ? "text-amber-400 font-medium" : ""
                        } ${checked[item.id] ? "line-through text-muted-foreground" : ""}`}
                      >
                        {lang === "pt" ? item.textPt : item.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <Button variant="outline" onClick={resetAll}>
          Reset All Checkboxes
        </Button>
      </div>
    </div>
  );
}
