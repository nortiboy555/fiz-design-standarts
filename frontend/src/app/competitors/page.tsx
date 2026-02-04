"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <div className="max-w-7xl">
      <PageHeader
        title="Competitor Analysis"
        description="Market positioning and FIZ differentiation angles"
      />

      {/* FIZ Positioning */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">FIZ Positioning</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Category: <span className="text-emerald-400 font-medium">{data.fizPositioning.category}</span>
          <span className="text-muted-foreground/60"> (not "{data.fizPositioning.notCategory}")</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.fizPositioning.differentiators.map((diff) => (
            <Card key={diff.name} className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{diff.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{diff.description}</p>
                <p className="text-sm text-emerald-400 italic">"{diff.emotion}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Competitor Table */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Competitor Comparison</h2>
        <Card className="border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="w-[140px]">Competitor</TableHead>
                <TableHead className="max-w-[280px]">Positioning</TableHead>
                <TableHead>Key Strengths</TableHead>
                <TableHead className="w-[200px]">FIZ Angle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(data.competitors).map((comp) => (
                <TableRow key={comp.name} className="border-border/40">
                  <TableCell className="font-medium">{comp.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{comp.positioning}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {comp.strengths.slice(0, 2).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-sm text-indigo-400 font-medium">{comp.fizAngle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </Card>
      </section>
    </div>
  );
}
