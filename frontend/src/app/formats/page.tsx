"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormatData {
  id: string;
  name: string;
  ratio: string;
  baseSize: { width: number; height: number };
  hiResSize: { width: number; height: number };
  placements: string[];
  role: string;
  gridSpec: { margins: number };
  note?: string;
}

interface FormatsData {
  formats: {
    [key: string]: FormatData;
  };
}

export default function FormatsPage() {
  const [data, setData] = useState<FormatsData | null>(null);

  useEffect(() => {
    api.get<FormatsData>("/formats").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const formats = Object.values(data.formats);

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Format Guide"
        description="Specifications and safe zones for Meta placements"
      />

      <Tabs defaultValue={formats[0]?.id} className="w-full">
        <TabsList className="mb-6">
          {formats.map((format) => (
            <TabsTrigger key={format.id} value={format.id}>
              {format.ratio} {format.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {formats.map((format) => {
          const scale = format.id === "16:9" ? 0.25 : 0.2;
          const previewWidth = format.baseSize.width * scale;
          const previewHeight = format.baseSize.height * scale;

          return (
            <TabsContent key={format.id} value={format.id}>
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Preview */}
                    <div className="flex justify-center">
                      <div
                        className="relative bg-muted/50 rounded-lg flex items-center justify-center border border-border/40"
                        style={{ width: previewWidth, height: previewHeight }}
                      >
                        <span className="text-2xl font-bold text-muted-foreground/50">
                          {format.ratio}
                        </span>

                        {format.id === "9:16" && (
                          <>
                            <div
                              className="absolute top-0 left-0 right-0 bg-destructive/20 border-b border-destructive/40 flex items-center justify-center text-xs text-destructive"
                              style={{ height: 250 * scale }}
                            >
                              UI Zone
                            </div>
                            <div
                              className="absolute bottom-0 left-0 right-0 bg-destructive/20 border-t border-destructive/40 flex items-center justify-center text-xs text-destructive"
                              style={{ height: 250 * scale }}
                            >
                              UI Zone
                            </div>
                            <div
                              className="absolute left-0 right-0 border border-amber-500/40 pointer-events-none"
                              style={{ top: 285 * scale, height: 1350 * scale }}
                            />
                            <div
                              className="absolute left-0 right-0 border border-emerald-500/40 pointer-events-none"
                              style={{ top: 420 * scale, height: 1080 * scale }}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="flex-1 space-y-6">
                      <h3 className="text-xl font-semibold">{format.name}</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-border/40">
                          <span className="text-muted-foreground">Base Size</span>
                          <span className="font-medium">
                            {format.baseSize.width} x {format.baseSize.height}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/40">
                          <span className="text-muted-foreground">Hi-Res Size</span>
                          <span className="font-medium">
                            {format.hiResSize.width} x {format.hiResSize.height}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/40">
                          <span className="text-muted-foreground">Placements</span>
                          <span className="font-medium text-right">
                            {format.placements.join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/40">
                          <span className="text-muted-foreground">Role</span>
                          <span className="font-medium">{format.role}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/40">
                          <span className="text-muted-foreground">Grid Margins</span>
                          <span className="font-medium">{format.gridSpec.margins}px</span>
                        </div>
                      </div>

                      {format.id === "9:16" && (
                        <div className="space-y-3 pt-4">
                          <h4 className="font-semibold">Safe Zones</h4>
                          <div className="flex justify-between py-2 border-b border-border/40">
                            <span className="text-destructive">UI Zones (avoid)</span>
                            <span className="font-medium">250px top/bottom</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border/40">
                            <span className="text-amber-500">Safe 4:5</span>
                            <span className="font-medium">285px offset</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border/40">
                            <span className="text-emerald-500">Safe 1:1 (critical)</span>
                            <span className="font-medium">420px offset</span>
                          </div>
                        </div>
                      )}

                      {format.note && (
                        <p className="text-sm text-amber-400 mt-4">
                          <strong>Note:</strong> {format.note}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
