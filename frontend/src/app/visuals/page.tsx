"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VisualDirection {
  name: string;
  concept: string;
  colorApproach: {
    palette: { [key: string]: string };
  };
  iconography: string[];
  recommendedFor: string[];
  bestIcp: string;
}

interface StaticTemplate {
  id: number;
  name: string;
  type: string;
  description: string;
}

interface VisualsData {
  directions: {
    [key: string]: VisualDirection;
  };
  staticTemplates: StaticTemplate[];
}

export default function VisualsPage() {
  const [data, setData] = useState<VisualsData | null>(null);

  useEffect(() => {
    api.get<VisualsData>("/visuals").then(setData);
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
        title="Visual Directions"
        description="Style guides, color palettes, and template references"
      />

      {/* Style Directions */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Style Directions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.values(data.directions).map((dir) => (
            <Card key={dir.name} className="border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{dir.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{dir.concept}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Color Palette */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Color Palette
                  </p>
                  <div className="flex gap-1">
                    {Object.entries(dir.colorApproach.palette)
                      .slice(0, 5)
                      .map(([name, color]) => (
                        <div
                          key={name}
                          className="w-10 h-10 rounded-md border border-border/40"
                          style={{ backgroundColor: color }}
                          title={`${name}: ${color}`}
                        />
                      ))}
                  </div>
                </div>

                {/* Iconography */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Iconography
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {dir.iconography.map((icon, i) => (
                      <li key={i}>• {icon}</li>
                    ))}
                  </ul>
                </div>

                {/* Best For */}
                <div className="p-3 bg-muted/30 rounded-lg text-sm space-y-2">
                  <div>
                    <span className="text-emerald-400 font-medium">Best for: </span>
                    <span className="text-muted-foreground">
                      {dir.recommendedFor.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-medium">ICP: </span>
                    <span className="text-muted-foreground">{dir.bestIcp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Static Templates */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Static Templates</h2>
        <Card className="border-border/40">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.staticTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-muted/30 rounded-lg border-l-2 border-indigo-500"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">
                      {template.id}. {template.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {template.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
