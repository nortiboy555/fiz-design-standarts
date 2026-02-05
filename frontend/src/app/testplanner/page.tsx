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
        <div className="space-y-3">
          {Object.entries(data.sprintTemplate).map(([key, day], index) => (
            <Card
              key={key}
              className={`border-border/40 overflow-hidden transition-all hover:shadow-md ${
                index === 0 ? "border-l-4 border-l-emerald-500" :
                index === 6 ? "border-l-4 border-l-indigo-500" :
                "border-l-4 border-l-border/60"
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Day Number */}
                  <div className={`w-20 flex-shrink-0 flex flex-col items-center justify-center py-4 ${
                    index === 0 ? "bg-emerald-500/10" :
                    index === 6 ? "bg-indigo-500/10" :
                    "bg-muted/30"
                  }`}>
                    <div className={`text-2xl font-bold ${
                      index === 0 ? "text-emerald-400" :
                      index === 6 ? "text-indigo-400" :
                      "text-foreground/60"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">Day</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 items-center">
                    {/* Phase Name */}
                    <div>
                      <div className={`text-lg font-semibold ${
                        index === 0 ? "text-emerald-400" :
                        index === 6 ? "text-indigo-400" : ""
                      }`}>
                        {day.name}
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      {day.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                          {task}
                        </div>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {day.metrics.map((m, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* KPI Benchmarks */}
      <section>
        <h2 className="text-lg font-semibold mb-4">KPI Benchmarks</h2>
        <Card className="border-border/40">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 bg-muted/30">
                  <TableHead className="w-[140px] font-semibold">Metric</TableHead>
                  <TableHead className="font-semibold text-center w-[120px]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Good
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-center w-[120px]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      Great
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold">Visual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(data.kpiBenchmarks).map(([key, kpi]) => {
                  const goodNum = parseFloat(String(kpi.good).replace(/[^\d.]/g, ''));
                  const greatNum = parseFloat(String(kpi.great).replace(/[^\d.]/g, ''));
                  const maxVal = Math.max(goodNum, greatNum);
                  const goodPercent = (goodNum / maxVal) * 100;
                  const greatPercent = (greatNum / maxVal) * 100;

                  return (
                    <TableRow key={key} className="border-border/40 hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            key === 'CTR' ? 'bg-blue-500/20 text-blue-400' :
                            key === 'CPC' ? 'bg-amber-500/20 text-amber-400' :
                            key === 'CVR' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {key.substring(0, 3)}
                          </div>
                          <span className="uppercase tracking-wide">{key}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-lg font-bold text-emerald-400">{kpi.good}</span>
                        <span className="text-xs text-muted-foreground ml-1">{kpi.unit}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-lg font-bold text-indigo-400">{kpi.great}</span>
                        <span className="text-xs text-muted-foreground ml-1">{kpi.unit}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-400 rounded-full transition-all"
                                style={{ width: `${goodPercent}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-400 rounded-full transition-all"
                                style={{ width: `${greatPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
