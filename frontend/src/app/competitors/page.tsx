"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";

interface CompetitorData {
  fizPositioning: {
    category: string;
    notCategory: string;
    differentiators: Array<{
      name: string;
      description: string;
      emotion: string;
    }>;
  };
  competitors: {
    [key: string]: {
      name: string;
      positioning: string;
      strengths: string[];
      weaknesses?: string[];
      fizAngle: string;
    };
  };
}

export default function CompetitorsPage() {
  const [data, setData] = useState<CompetitorData | null>(null);

  useEffect(() => {
    api.get<CompetitorData>("/competitors").then(setData);
  }, []);

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
        title="Competitors"
        description="Market positioning and differentiation"
      />

      {/* FIZ Positioning - Compact */}
      <div className="mb-8 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-emerald-400">FIZ Position</span>
        </div>
        <p className="text-lg font-semibold mb-2">{data.fizPositioning.category}</p>
        <p className="text-xs text-muted-foreground mb-4">Not "{data.fizPositioning.notCategory}"</p>

        <div className="flex flex-wrap gap-2">
          {data.fizPositioning.differentiators.map((diff) => (
            <div key={diff.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/40">
              <span className="text-sm font-medium">{diff.name}</span>
              <span className="text-xs text-muted-foreground">→ {diff.emotion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Competitors - Block List */}
      <div className="space-y-3">
        {Object.values(data.competitors).map((comp) => (
          <div
            key={comp.name}
            className="p-4 rounded-lg border border-border/40 hover:border-border/60 transition-colors"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base">{comp.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{comp.positioning}</p>
              </div>
            </div>

            {/* Content Row */}
            <div className="flex items-start gap-6">
              {/* Strengths */}
              <div className="flex-1">
                <span className="text-xs text-muted-foreground/70 uppercase tracking-wide">Strengths</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {comp.strengths.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* FIZ Angle */}
              <div className="flex-1 max-w-[280px]">
                <span className="text-xs text-indigo-400/70 uppercase tracking-wide">FIZ Angle</span>
                <p className="mt-1 text-sm text-indigo-400">{comp.fizAngle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
