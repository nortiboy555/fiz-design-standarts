"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const exportToPdf = () => {
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Figma Guide — FIZ Creative Hub</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; padding: 40px 50px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h1 + p { color: #666; font-size: 13px; margin-bottom: 28px; }
  h2 { font-size: 16px; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #e5e5e5; }
  h3 { font-size: 13px; font-weight: 600; margin: 16px 0 6px; }
  .tree { background: #f8f8f8; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px 20px; font-family: "SF Mono", "Fira Code", monospace; font-size: 12px; line-height: 1.8; margin-bottom: 8px; }
  .tree .comment { color: #888; }
  .tree .file { color: #5b5fc7; font-weight: 600; }
  .tree .page { color: #b58900; font-weight: 600; }
  .tree .frame { color: #2aa198; font-weight: 700; }
  .tree .text { color: #268bd2; }
  .tree .image { color: #8b5cf6; }
  .tree .shape { color: #d97706; }
  .tree .badge { background: #e8e8e8; border-radius: 3px; padding: 1px 5px; font-size: 10px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0; }
  th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid #e5e5e5; }
  th { font-weight: 600; background: #f5f5f5; font-size: 12px; }
  td code { background: #f0f0f0; padding: 1px 5px; border-radius: 3px; font-size: 11px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .card { border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; }
  .card h3 { margin-top: 0; }
  .numbered { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
  .num { width: 22px; height: 22px; border-radius: 4px; background: #e6f7f0; color: #2aa198; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .numbered .label { font-weight: 600; font-size: 13px; }
  .numbered .desc { color: #666; font-size: 11px; }
  .props { display: flex; flex-wrap: wrap; gap: 6px; }
  .prop { background: #f0f0f0; border: 1px solid #e0e0e0; border-radius: 4px; padding: 2px 8px; font-family: monospace; font-size: 11px; }
  .tip { display: flex; gap: 8px; margin-bottom: 6px; font-size: 12px; color: #555; }
  .tip::before { content: "•"; color: #b58900; font-weight: bold; flex-shrink: 0; }
  .tips-box { background: #fffbf0; border: 1px solid #f0d88a; border-radius: 6px; padding: 16px; }
  .tips-box h3 { color: #b58900; margin-top: 0; }
  @media print { body { padding: 20px; } }
</style></head><body>
<h1>Figma Guide</h1>
<p>How to prepare a Figma file for import into FIZ Creative Preview</p>

<div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:6px;padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
<div style="font-size:20px;">&#128196;</div>
<div><strong style="font-size:13px;">Figma Template</strong><br/><a href="https://www.figma.com/design/vvDS2E1m0KEan9ZcK9ngo8/FIZ-ADS1?t=OrqxhFMYMDPac0bX-1" style="color:#5b5fc7;font-size:12px;word-break:break-all;">Open FIZ-ADS1 in Figma</a> — duplicate to your project and use as a starting template.</div>
</div>

<h2>Required File Structure</h2>
<div class="tree">
<div class="comment"># Figma File</div>
<div><span class="file">File</span> "My Ad Designs"</div>
${[
  { page: "1080×1920", format: "9:16", size: "1080×1920", prefix: "├──" },
  { page: "1080x1350", format: "4:5", size: "1080×1350", prefix: "├──" },
  { page: "1080×1080", format: "1:1", size: "1080×1080", prefix: "├──" },
  { page: "1920×1080", format: "16:9", size: "1920×1080", prefix: "└──" },
].map(p => `<div>${p.prefix} <span class="page">Page</span> "${p.page}" <span class="badge">${p.format}</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;└── <span class="frame">Frame</span> "Actual" (${p.size})</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── <span class="text">TEXT</span> "Headline" <span class="badge">headline</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── <span class="text">TEXT</span> "Subhead" <span class="badge">subhead</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── <span class="text">TEXT</span> "CTA" <span class="badge">cta</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── <span class="image">IMAGE</span> "Picture"</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── <span class="image">IMAGE</span> "LOGO"</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── <span class="shape">SHAPE</span> "Button BG"</div>`).join("\n")}
</div>

<h2>Page Naming Convention</h2>
<table>
<tr><th>Format</th><th>Accepted Keywords (case-insensitive)</th></tr>
<tr><td><strong>9:16</strong></td><td><code>1080x1920</code> <code>9:16</code> <code>story</code> <code>reels</code></td></tr>
<tr><td><strong>4:5</strong></td><td><code>1080x1350</code> <code>4:5</code> <code>feed</code></td></tr>
<tr><td><strong>1:1</strong></td><td><code>1080x1080</code> <code>1:1</code> <code>square</code></td></tr>
<tr><td><strong>16:9</strong></td><td><code>1920x1080</code> <code>16:9</code> <code>landscape</code></td></tr>
</table>

<div class="grid" style="margin-top:24px;">
<div class="card">
<h3>The "Actual" Frame</h3>
<p style="color:#666;font-size:12px;margin-bottom:12px;">Inside each page, place a frame named <strong>Actual</strong> (case-insensitive).</p>
<div class="numbered"><div class="num">1</div><div><div class="label">Frame, Component, or Group</div><div class="desc">Other types (sections) are skipped</div></div></div>
<div class="numbered"><div class="num">2</div><div><div class="label">Size within ±50px tolerance</div><div class="desc">e.g. 1080×1920 for 9:16</div></div></div>
<div class="numbered"><div class="num">3</div><div><div class="label">BG color from solid fill</div><div class="desc">First SOLID fill → canvas background</div></div></div>
<div class="numbered"><div class="num">4</div><div><div class="label">Children → editable nodes</div><div class="desc">TEXT, IMAGE, SHAPE parsed recursively</div></div></div>
</div>

<div class="card">
<h3>Text Layer Roles</h3>
<p style="color:#666;font-size:12px;margin-bottom:12px;">Name layers exactly for auto-role assignment.</p>
<table>
<tr><th>Layer Name</th><th>Role</th><th>Behavior</th></tr>
<tr><td><code>Headline</code></td><td>headline</td><td>Connected to headline library</td></tr>
<tr><td><code>Subhead</code></td><td>subhead</td><td>Also accepts "Subheadline"</td></tr>
<tr><td><code>CTA</code></td><td>cta</td><td>Connected to CTA library</td></tr>
<tr><td><em>Any other</em></td><td>—</td><td>Default text from Figma. If shared across all formats — editable via "Other Text" in Preview</td></tr>
</table>
</div>
</div>

<h2>Image & Shape Layers</h2>
<table>
<tr><th>Type</th><th>Detection</th><th>Behavior</th></tr>
<tr><td><strong>IMAGE</strong></td><td>Rectangle / Frame with image fill</td><td>Exported PNG @2x. Editable with Gemini AI + Remove.bg</td></tr>
<tr><td><strong>SHAPE</strong></td><td>Vector, Ellipse, Line, Polygon, etc.</td><td>Exported PNG @2x. Static overlay on canvas</td></tr>
<tr><td><strong>SHARED</strong></td><td>Same name across format pages</td><td>Edit once in Preview → updates all formats</td></tr>
</table>

<h2>Supported Formats</h2>
<table>
<tr><th>Ratio</th><th>Name</th><th>Size (px)</th></tr>
<tr><td><strong>9:16</strong></td><td>Story / Reels</td><td>1080 × 1920</td></tr>
<tr><td><strong>4:5</strong></td><td>Feed</td><td>1080 × 1350</td></tr>
<tr><td><strong>1:1</strong></td><td>Square</td><td>1080 × 1080</td></tr>
<tr><td><strong>16:9</strong></td><td>Landscape</td><td>1920 × 1080</td></tr>
</table>

<h2>Fonts</h2>
<p style="font-size:12px;color:#666;">The canvas renders text using <code>fontFamily</code> from Figma. Fonts are <strong>not</strong> loaded dynamically — only fonts available in the browser will render correctly.</p>
<table>
<tr><th>Font</th><th>Status</th><th>Notes</th></tr>
<tr><td><strong>Inter</strong></td><td>Default / always available</td><td>Loaded via Next.js. Used as fallback when Figma font is missing.</td></tr>
<tr><td><strong>Google Fonts</strong></td><td>Recommended</td><td>Use fonts from <a href="https://fonts.google.com/" style="color:#5b5fc7;">fonts.google.com</a> in Figma for best cross-browser compatibility.</td></tr>
</table>

<h2>Multi-line Text</h2>
<p style="font-size:12px;color:#666;">Use <code>\\n</code> in text input for forced line breaks. Works in headline, subhead, CTA, and other text fields.</p>
<div class="tree" style="font-size:11px;">First line<span style="color:#b58900;font-weight:bold;">\\n</span>Second line<span style="color:#b58900;font-weight:bold;">\\n</span>Third line</div>

<h2>Locked Layers</h2>
<p style="font-size:12px;color:#666;">Lock any layer in Figma (<kbd>Ctrl/Cmd + Shift + L</kbd>) to protect it from editing in Preview.</p>
<table>
<tr><th>Layer Type</th><th>When Locked</th></tr>
<tr><td><strong>TEXT</strong></td><td>Renders with original Figma text. Not affected by copy substitution or Other Text editing.</td></tr>
<tr><td><strong>IMAGE</strong></td><td>Renders with original Figma image. Not available for AI generation or Remove.bg.</td></tr>
<tr><td><strong>Unlocked</strong></td><td>Fully editable — text substitution, AI generation, shared detection all work.</td></tr>
</table>

<h2>Extracted Text Properties</h2>
<div class="props">
${["fontSize","fontFamily","fontWeight","fontStyle","textAlign","textAlignVertical","lineHeight","letterSpacing","paragraphSpacing","textCase","textDecoration","color","opacity"].map(p => `<span class="prop">${p}</span>`).join("")}
</div>

<div class="tips-box" style="margin-top:24px;">
<h3>Tips for Best Results</h3>
<div class="tip">Use the same layer names across all format pages for shared picture detection.</div>
<div class="tip">Keep the "Actual" frame as a direct child of the page — nested sections may not be found.</div>
<div class="tip">For multi-line text, use <code>\\n</code> in text inputs or set auto-resize to "Height" in Figma to preserve wrapping.</div>
<div class="tip">Lock layers in Figma to protect them from editing in Preview — locked text and images stay as-is.</div>
<div class="tip">Decorative text that shouldn't be swapped — name it anything except Headline, Subhead, or CTA.</div>
<div class="tip">Prefer <strong>Google Fonts</strong> in Figma — they render reliably across all browsers.</div>
<div class="tip">Background colors come from the Actual frame's fill, not from a background rectangle inside it.</div>
<div class="tip">Fallback: if no page names match, the parser scans all frames by pixel size (±50px).</div>
</div>

</body></html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Format Guide"
        description="Specifications and safe zones for Meta placements"
      />

      <Tabs defaultValue="figma-template" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="figma-template" className="gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17.5A3.5 3.5 0 0 1 8.5 14H12v3.5A3.5 3.5 0 0 1 5 17.5z"/><path d="M12 14H8.5A3.5 3.5 0 0 1 12 7h0v7z"/><path d="M12 7H8.5A3.5 3.5 0 0 1 12 .5h0V7z"/><path d="M12 .5h3.5A3.5 3.5 0 0 1 12 7h0V.5z"/><circle cx="15.5" cy="10.5" r="3.5"/></svg>
            Figma
          </TabsTrigger>
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
        {/* Figma Template Tab */}
        <TabsContent value="figma-template">
          <div className="space-y-6">
            {/* Intro */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Figma File Format for Creative Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow this structure to prepare a Figma file that imports correctly into the Creative Preview editor.
                      The parser auto-detects formats, text roles, and shared images across sizes.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={exportToPdf} className="shrink-0">
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Figma Template Link */}
            <Card className="border-indigo-500/30 bg-indigo-500/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-lg shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M5 17.5A3.5 3.5 0 0 1 8.5 14H12v3.5A3.5 3.5 0 0 1 5 17.5z"/><path d="M12 14H8.5A3.5 3.5 0 0 1 12 7h0v7z"/><path d="M12 7H8.5A3.5 3.5 0 0 1 12 .5h0V7z"/><path d="M12 .5h3.5A3.5 3.5 0 0 1 12 7h0V.5z"/><circle cx="15.5" cy="10.5" r="3.5"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">Figma Template — FIZ-ADS1</div>
                    <div className="text-xs text-muted-foreground">Duplicate to your project and use as a starting template</div>
                  </div>
                  <a
                    href="https://www.figma.com/design/vvDS2E1m0KEan9ZcK9ngo8/FIZ-ADS1?t=OrqxhFMYMDPac0bX-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
                  >
                    Open in Figma
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* File Structure */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Required File Structure</h4>

                {/* Layer tree */}
                <div className="bg-muted/30 rounded-lg p-5 font-mono text-sm leading-relaxed border border-border/40">
                  <div className="text-muted-foreground">{`# Figma File`}</div>
                  <div className="mt-2">
                    <span className="text-indigo-400">File</span> <span className="text-muted-foreground">&quot;My Ad Designs&quot;</span>
                  </div>
                  {[
                    { page: "1080×1920", format: "9:16", size: "1080×1920" },
                    { page: "1080x1350", format: "4:5", size: "1080×1350" },
                    { page: "1080×1080", format: "1:1", size: "1080×1080" },
                    { page: "1920×1080", format: "16:9", size: "1920×1080" },
                  ].map((p, i) => (
                    <div key={i} className={`${i === 0 ? "mt-3" : "mt-4"}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground/60 select-none">{i < 3 ? "├──" : "└──"}</span>
                        <span className="text-amber-400">Page</span>
                        <span className="text-foreground">&quot;{p.page}&quot;</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{p.format}</Badge>
                      </div>
                      <div className="ml-8">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground/60 select-none">└──</span>
                          <span className="text-emerald-400 font-bold">Frame</span>
                          <span className="text-foreground">&quot;Actual&quot;</span>
                          <span className="text-muted-foreground text-xs">({p.size})</span>
                        </div>
                        <div className="ml-8 space-y-0.5 mt-1">
                          {[
                            { type: "TEXT", name: "Headline", role: "headline", color: "text-blue-400" },
                            { type: "TEXT", name: "Subhead", role: "subhead", color: "text-blue-400" },
                            { type: "TEXT", name: "CTA", role: "cta", color: "text-blue-400" },
                            { type: "IMAGE", name: "Picture", role: null, color: "text-purple-400" },
                            { type: "IMAGE", name: "LOGO", role: null, color: "text-purple-400" },
                            { type: "SHAPE", name: "Button BG", role: null, color: "text-orange-400" },
                          ].map((node, j, arr) => (
                            <div key={j} className="flex items-center gap-2">
                              <span className="text-muted-foreground/60 select-none">{j < arr.length - 1 ? "├──" : "└──"}</span>
                              <span className={node.color}>{node.type}</span>
                              <span>&quot;{node.name}&quot;</span>
                              {node.role && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{node.role}</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Page Naming */}
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Page Naming Convention</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Page names must contain a size or keyword. Case-insensitive.
                  </p>
                  <div className="space-y-2">
                    {[
                      { format: "9:16", keywords: ["1080x1920", "9:16", "story", "reels"], color: "bg-indigo-500/20 text-indigo-400" },
                      { format: "4:5", keywords: ["1080x1350", "4:5", "feed"], color: "bg-purple-500/20 text-purple-400" },
                      { format: "1:1", keywords: ["1080x1080", "1:1", "square"], color: "bg-emerald-500/20 text-emerald-400" },
                      { format: "16:9", keywords: ["1920x1080", "16:9", "landscape"], color: "bg-amber-500/20 text-amber-400" },
                    ].map((row) => (
                      <div key={row.format} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                        <div className={`w-12 text-center text-xs font-bold rounded px-1.5 py-1 ${row.color}`}>
                          {row.format}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {row.keywords.map((kw) => (
                            <code key={kw} className="text-xs bg-muted px-1.5 py-0.5 rounded">{kw}</code>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* The "Actual" Frame */}
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">The &quot;Actual&quot; Frame</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Inside each page, place a single top-level frame named <code className="bg-muted px-1.5 py-0.5 rounded text-emerald-400">Actual</code> (case-insensitive).
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                      <div>
                        <div className="text-sm font-medium">Must be a Frame, Component, or Group</div>
                        <div className="text-xs text-muted-foreground">Other types (sections, etc.) are skipped</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                      <div>
                        <div className="text-sm font-medium">Size within ±50px tolerance</div>
                        <div className="text-xs text-muted-foreground">e.g. 1080×1920 for 9:16 (1030–1130 × 1870–1970)</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                      <div>
                        <div className="text-sm font-medium">Background color extracted from solid fill</div>
                        <div className="text-xs text-muted-foreground">The first SOLID fill becomes the canvas background</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                      <div>
                        <div className="text-sm font-medium">All children become editable nodes</div>
                        <div className="text-xs text-muted-foreground">TEXT, IMAGE, and SHAPE nodes are parsed recursively</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Supported Formats */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Supported Formats</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The parser recognizes these 4 standard ad formats. Each page in your Figma file should contain one format.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { ratio: "9:16", name: "Story / Reels", size: "1080 × 1920", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
                    { ratio: "4:5", name: "Feed", size: "1080 × 1350", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
                    { ratio: "1:1", name: "Square", size: "1080 × 1080", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
                    { ratio: "16:9", name: "Landscape", size: "1920 × 1080", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
                  ].map((f) => (
                    <div key={f.ratio} className={`p-3 rounded-lg border ${f.color}`}>
                      <div className="text-lg font-bold">{f.ratio}</div>
                      <div className="text-sm font-medium mt-1">{f.name}</div>
                      <div className="text-xs opacity-70 mt-0.5">{f.size}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fonts */}
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Fonts</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The canvas renders text using the <code className="bg-muted px-1.5 py-0.5 rounded">fontFamily</code> from Figma. Fonts are <strong>not</strong> loaded dynamically — only fonts available in the browser will render correctly.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-emerald-400">Inter</span>
                        <Badge variant="secondary" className="text-[10px]">default</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Always available — loaded via Next.js. If Figma font is missing, falls back to Inter.</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold">Google Fonts</span>
                        <Badge variant="outline" className="text-[10px]">recommended</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Prefer using fonts from{" "}
                        <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                          Google Fonts
                        </a>
                        {" "}in your Figma designs — they are widely available across browsers and devices.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Multi-line Text */}
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Multi-line Text</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Text wrapping in Preview is controlled by the node width and <code className="bg-muted px-1.5 py-0.5 rounded">shouldWrap</code> property. For forced line breaks, use the escape sequence:
                  </p>
                  <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm border border-border/40 mb-3">
                    <div className="text-muted-foreground text-xs mb-2"># In Manual text input or Copy Library:</div>
                    <div>First line<span className="text-amber-400 font-bold">\n</span>Second line<span className="text-amber-400 font-bold">\n</span>Third line</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span className="text-muted-foreground"><code className="bg-muted px-1 py-0.5 rounded text-amber-400">\n</code> — forced line break, works in both headline/subhead/CTA and other text fields</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span className="text-muted-foreground">Auto-wrapping is based on text node width from Figma — long text wraps automatically</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span className="text-muted-foreground">In Figma, set text auto-resize to &quot;Height&quot; (not &quot;Width and Height&quot;) to preserve wrapping width</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Layer Roles */}
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Text Layer Roles</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Name TEXT layers exactly to auto-assign roles for copy substitution.
                  </p>
                  <div className="space-y-3">
                    {[
                      { name: "Headline", role: "headline", desc: "Main attention-grabbing text. Connected to headline library.", color: "text-blue-400" },
                      { name: "Subhead", role: "subhead", desc: "Supporting message. Also accepts \"Subheadline\".", color: "text-cyan-400" },
                      { name: "CTA", role: "cta", desc: "Call-to-action button text. Connected to CTA library.", color: "text-pink-400" },
                    ].map((item) => (
                      <div key={item.name} className="p-3 rounded-lg border border-border/30 bg-muted/20">
                        <div className="flex items-center gap-2 mb-1">
                          <code className={`text-sm font-bold ${item.color}`}>&quot;{item.name}&quot;</code>
                          <Badge variant="secondary" className="text-[10px]">{item.role}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                    <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-bold text-muted-foreground">&quot;Any other name&quot;</code>
                        <Badge variant="outline" className="text-[10px]">no role</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Rendered with original Figma text by default. If the same name appears in all formats, editable via &quot;Other Text&quot; tab in Preview.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image & Shape Layers */}
              <Card className="border-border/40">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Image & Shape Layers</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    How visual elements are detected and rendered.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">IMAGE</Badge>
                        <span className="text-sm font-medium">Rectangle / Frame with image fill</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Exported as PNG at 2x. Editable with Gemini AI and Remove.bg in Preview.</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">SHAPE</Badge>
                        <span className="text-sm font-medium">Vector, Ellipse, Line, Polygon, etc.</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Exported as PNG at 2x. Rendered as static overlay on canvas.</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[10px]">SHARED</Badge>
                        <span className="text-sm font-medium">Same name across formats</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        IMAGE nodes with identical names (e.g. &quot;Picture&quot;) across pages become shared.
                        Edit once in Preview — updates all formats.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Locked Layers */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Locked Layers</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Lock any layer in Figma (<kbd className="bg-muted px-1.5 py-0.5 rounded text-xs border border-border/30">Ctrl/Cmd + Shift + L</kbd>) to protect it from editing in Preview.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span className="text-sm font-bold text-amber-400">Locked TEXT</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Renders with original Figma text. Not affected by copy substitution (Main Text) or Other Text editing. Excluded from shared text detection.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/30 bg-muted/20">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span className="text-sm font-bold text-amber-400">Locked IMAGE</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Renders with original Figma image. Not available for Gemini AI generation or Remove.bg. Excluded from shared pictures detection.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9 1"/></svg>
                      <span className="text-sm font-bold text-emerald-400">Unlocked (default)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Fully editable in Preview — text substitution, AI image generation, and shared detection all work normally.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Properties */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Extracted Text Properties</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  These Figma text properties are preserved when rendering on canvas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "fontSize", "fontFamily", "fontWeight", "fontStyle",
                    "textAlign", "textAlignVertical", "lineHeight",
                    "letterSpacing", "paragraphSpacing", "textCase",
                    "textDecoration", "color", "opacity",
                  ].map((prop) => (
                    <code key={prop} className="text-xs bg-muted px-2 py-1 rounded border border-border/30">
                      {prop}
                    </code>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-6">
                <h4 className="font-semibold text-amber-400 mb-3">Tips for Best Results</h4>
                <div className="space-y-2.5 text-sm">
                  {[
                    "Use the same layer names across all format pages for consistent shared picture and text detection.",
                    "Keep the \"Actual\" frame as a direct child of the page — nested sections may not be found.",
                    "For forced line breaks in text, use \\n in the input field. Auto-wrapping uses the node width from Figma.",
                    "Prefer Google Fonts in Figma — they render reliably across all browsers. Inter is always available as fallback.",
                    "Lock layers in Figma to protect them from editing in Preview — locked text and images stay as-is.",
                    "Decorative text that shouldn't be swapped from the library — name it anything except Headline, Subhead, or CTA.",
                    "Background colors come from the Actual frame's fill, not from a background rectangle inside it.",
                    "Fallback: if no page names match, the parser scans all frames by pixel dimensions (±50px tolerance).",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
