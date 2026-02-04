"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TestVariable {
  id: string;
  name: string;
  description: string;
  priority: number;
  impact: string;
  options: Array<{ name: string; example: string }>;
}

interface PrebuiltMatrix {
  id: string;
  name: string;
  description: string;
  variables: string[];
  combinations: number;
  estimated: string;
}

interface SprintDay {
  name: string;
  tasks: string[];
  metrics: string[];
}

interface KpiBenchmark {
  good: string;
  great: string;
  unit: string;
}

interface TestPlannerData {
  variables: { [key: string]: TestVariable };
  prebuiltMatrices: PrebuiltMatrix[];
  sprintTemplate: { [key: string]: SprintDay };
  kpiBenchmarks: { [key: string]: KpiBenchmark };
}

interface MatrixResult {
  variables: Array<{ name: string }>;
  combinations: Array<{
    id: string;
    elements: Array<{ name: string; example: string }>;
  }>;
  total: number;
}

export default function TestPlannerPage() {
  const [data, setData] = useState<TestPlannerData | null>(null);
  const [selectedVars, setSelectedVars] = useState<string[]>([]);
  const [matrixResult, setMatrixResult] = useState<MatrixResult | null>(null);

  useEffect(() => {
    api.get<TestPlannerData>("/testmatrix").then(setData);
  }, []);

  const toggleVariable = (varId: string) => {
    setSelectedVars((prev) =>
      prev.includes(varId) ? prev.filter((v) => v !== varId) : [...prev, varId]
    );
  };

  const generateMatrix = async () => {
    if (selectedVars.length === 0) return;
    const result = await api.post<MatrixResult>("/testmatrix/generate", {
      variables: selectedVars,
    });
    setMatrixResult(result);
  };

  const clearMatrix = () => {
    setSelectedVars([]);
    setMatrixResult(null);
  };

  const useTemplate = (template: PrebuiltMatrix) => {
    setSelectedVars([...template.variables]);
    generateMatrix();
  };

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
        title="Test Planner"
        description="Generate A/B test matrices and plan creative sprints"
      />

      {/* Quick Start Templates */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Quick Start Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.prebuiltMatrices.map((matrix, index) => (
            <Card
              key={matrix.id}
              className={`group border-border/40 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                index === 0 ? "hover:border-indigo-500/50 hover:shadow-indigo-500/10" :
                index === 1 ? "hover:border-purple-500/50 hover:shadow-purple-500/10" :
                "hover:border-emerald-500/50 hover:shadow-emerald-500/10"
              }`}
              onClick={() => useTemplate(matrix)}
            >
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2 group-hover:text-indigo-400 transition-colors">{matrix.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{matrix.description}</p>
                <div className="text-sm">
                  <span className="text-muted-foreground">Variables: </span>
                  <span className="font-medium">{matrix.variables.join(", ")}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary">{matrix.combinations} combinations</Badge>
                  <span className="text-xs text-muted-foreground">{matrix.estimated}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Custom Matrix Builder */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Custom Matrix Builder</h2>
        <Card className="border-border/40">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Select variables to test. Recommended order: Offer+Hook → Proof → Visual → CTA
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.values(data.variables).map((variable) => (
                <div
                  key={variable.id}
                  onClick={() => toggleVariable(variable.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedVars.includes(variable.id)
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-border/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{variable.name}</h4>
                    <Badge
                      variant={variable.priority <= 2 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      Priority {variable.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{variable.description}</p>
                  <p className="text-xs text-emerald-400">Impact: {variable.impact}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={generateMatrix} disabled={selectedVars.length === 0}>
                Generate Matrix
              </Button>
              <Button variant="outline" onClick={clearMatrix}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Matrix Result */}
      {matrixResult && (
        <section className="mb-10">
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Generated Test Matrix</CardTitle>
                <div className="text-sm text-muted-foreground">
                  <span className="mr-4">
                    Variables:{" "}
                    <strong>{matrixResult.variables.map((v) => v.name).join(" × ")}</strong>
                  </span>
                  <span>
                    Total: <strong>{matrixResult.total} combinations</strong>
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="w-[60px]">ID</TableHead>
                    {matrixResult.variables.map((v, i) => (
                      <TableHead key={i}>{v.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrixResult.combinations.map((combo) => (
                    <TableRow key={combo.id} className="border-border/40">
                      <TableCell className="font-medium">{combo.id}</TableCell>
                      {combo.elements.map((el, i) => (
                        <TableCell key={i}>
                          <div className="font-medium text-sm">{el.name}</div>
                          <div className="text-xs text-muted-foreground">{el.example}</div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Sprint Template */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">7-Day Sprint Template</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(data.sprintTemplate).map(([key, day], index) => (
            <Card key={key} className="border-border/40">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Day {index + 1}</div>
                <div className="font-medium text-sm mb-3">{day.name}</div>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                  {day.tasks.slice(0, 2).map((task, i) => (
                    <li key={i}>• {task}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1">
                  {day.metrics.map((m, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {m}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* KPI Benchmarks */}
      <section>
        <h2 className="text-lg font-semibold mb-4">KPI Benchmarks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.kpiBenchmarks).map(([key, kpi]) => (
            <Card key={key} className="border-border/40">
              <CardContent className="p-5 text-center">
                <h4 className="text-sm font-medium uppercase text-muted-foreground mb-4">
                  {key}
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Good</div>
                    <div className="text-xl font-bold text-emerald-400">
                      {kpi.good}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {kpi.unit}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Great</div>
                    <div className="text-xl font-bold text-indigo-400">
                      {kpi.great}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {kpi.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
