"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Headline { text: string; offer: string; }
interface Subhead { text: string; }
interface Cta { text: string; }

interface FigmaNode {
  nodeId: string;
  nodeName: string;
  nodeType: "TEXT" | "SHAPE" | "IMAGE";
  role?: "headline" | "subhead" | "cta" | null;
  defaultValue?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  textAlign?: string;
  textAlignVertical?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textCase?: string;
  color?: string;
  opacity?: number;
  shouldWrap?: boolean;
  imageUrl?: string;
}

interface FigmaFrame {
  id: string;
  name: string;
  format: string;
  width: number;
  height: number;
  backgroundColor: string;
  nodes: FigmaNode[];
}

interface ImageVariant {
  type: "original" | "generated";
  dataUrl: string | null;
  label: string;
  prompt?: string;
}

interface SharedPicture {
  name: string;
  nodes: Record<string, FigmaNode>;
}

const formatSpecs: Record<string, { width: number; height: number; ratio: string; name: string; previewHeight: number }> = {
  "9:16": { width: 1080, height: 1920, ratio: "9:16", name: "Story/Reels", previewHeight: 280 },
  "4:5": { width: 1080, height: 1350, ratio: "4:5", name: "Feed", previewHeight: 240 },
  "1:1": { width: 1080, height: 1080, ratio: "1:1", name: "Square", previewHeight: 220 },
  "16:9": { width: 1920, height: 1080, ratio: "16:9", name: "Landscape", previewHeight: 150 },
};

export default function PreviewPage() {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [mode, setMode] = useState<"manual" | "library">("manual");
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [subheads, setSubheads] = useState<Subhead[]>([]);
  const [ctas, setCtas] = useState<Cta[]>([]);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [figmaTemplates, setFigmaTemplates] = useState<Record<string, FigmaFrame>>({});
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  const [copy, setCopy] = useState({ headline: "", subhead: "", cta: "" });
  const [bgColor, setBgColor] = useState("#FFFFFF");

  // Gemini Image Generation State
  const [sharedPictures, setSharedPictures] = useState<SharedPicture[]>([]);
  const [imageVariants, setImageVariants] = useState<ImageVariant[]>([]);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<{ name: string; dataUrl: string } | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [useReference, setUseReference] = useState(true);
  const [variantCount, setVariantCount] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupImages, setPopupImages] = useState<string[]>([]);
  const [exportScale, setExportScale] = useState<1 | 2>(1);

  useEffect(() => {
    Promise.all([
      api.get<Headline[]>(`/headlines?lang=${lang}`),
      api.get<Subhead[]>(`/subheads?lang=${lang}`),
      api.get<Cta[]>(`/ctas?lang=${lang}`),
    ]).then(([h, s, c]) => {
      setHeadlines(h);
      setSubheads(s);
      setCtas(c);
    });
  }, [lang]);

  // Find shared IMAGE nodes across formats
  const findSharedPictures = useCallback((templates: Record<string, FigmaFrame>) => {
    const loadedFormats = Object.entries(templates).filter(([, t]) => t && t.nodes);
    if (loadedFormats.length < 2) return [];

    const imagesByName: Record<string, Record<string, FigmaNode>> = {};

    for (const [format, template] of loadedFormats) {
      const imageNodes = template.nodes.filter((n) => n.nodeType === "IMAGE");
      for (const node of imageNodes) {
        const name = node.nodeName.toLowerCase();
        if (!imagesByName[name]) imagesByName[name] = {};
        imagesByName[name][format] = node;
      }
    }

    const formatCount = loadedFormats.length;
    const shared: SharedPicture[] = [];
    for (const [name, nodes] of Object.entries(imagesByName)) {
      if (Object.keys(nodes).length >= formatCount) {
        shared.push({ name: Object.values(nodes)[0].nodeName, nodes });
      }
    }
    return shared;
  }, []);

  const handleFigmaImport = async () => {
    if (!figmaUrl.trim()) return;
    setIsImporting(true);
    setImportStatus(null);

    try {
      const data = await api.post<{ frames?: FigmaFrame[]; error?: string }>("/figma/parse", { url: figmaUrl });
      if (data.error) throw new Error(data.error);

      const templates: Record<string, FigmaFrame> = {};
      for (const frame of data.frames || []) {
        if (frame.format && frame.nodes) {
          templates[frame.format] = frame;
          if (frame.backgroundColor && bgColor === "#FFFFFF") {
            setBgColor(frame.backgroundColor);
          }
        }
      }

      setFigmaTemplates(templates);
      const shared = findSharedPictures(templates);
      setSharedPictures(shared);

      // Initialize variants with original image
      if (shared.length > 0) {
        const firstNode = Object.values(shared[0].nodes)[0];
        setImageVariants([{ type: "original", dataUrl: firstNode?.imageUrl || null, label: "Original" }]);
        setCurrentVariantIndex(0);
      }

      setImportStatus(`Imported ${Object.keys(templates).length} templates: ${Object.keys(templates).join(", ")}`);
    } catch (error) {
      setImportStatus(`Error: ${error instanceof Error ? error.message : "Failed to import"}`);
    } finally {
      setIsImporting(false);
    }
  };

  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  }, []);

  const renderCanvas = useCallback(async (format: string) => {
    const canvas = canvasRefs.current[format];
    const template = figmaTemplates[format];
    if (!canvas || !template) return;

    const spec = formatSpecs[format];
    const aspectRatio = spec.width / spec.height;
    const previewWidth = Math.round(spec.previewHeight * aspectRatio);

    canvas.width = previewWidth;
    canvas.height = spec.previewHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = previewWidth / template.width;

    ctx.fillStyle = bgColor || template.backgroundColor || "#FFFFFF";
    ctx.fillRect(0, 0, previewWidth, spec.previewHeight);

    const sortedNodes = [...template.nodes].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (const node of sortedNodes) {
      const x = node.x * scale;
      const y = node.y * scale;
      const w = node.width * scale;
      const h = node.height * scale;

      if (node.nodeType === "SHAPE" || node.nodeType === "IMAGE") {
        let imageUrl = node.imageUrl;

        // Check if this is a shared picture with generated image
        if (node.nodeType === "IMAGE" && generatedImage) {
          if (node.nodeName.toLowerCase() === generatedImage.name.toLowerCase()) {
            imageUrl = generatedImage.dataUrl;
          }
        }

        if (imageUrl) {
          try {
            const img = await loadImage(imageUrl);
            ctx.drawImage(img, x, y, w, h);
          } catch (e) {
            console.warn("Failed to load image:", node.nodeName);
          }
        }
      } else if (node.nodeType === "TEXT") {
        let textValue = node.defaultValue || "";
        if (node.role === "headline" && copy.headline) textValue = copy.headline;
        else if (node.role === "subhead" && copy.subhead) textValue = copy.subhead;
        else if (node.role === "cta" && copy.cta) textValue = copy.cta;

        if (!textValue) continue;

        if (node.textCase === "UPPER") textValue = textValue.toUpperCase();
        else if (node.textCase === "LOWER") textValue = textValue.toLowerCase();

        const fontSize = (node.fontSize || 16) * scale;
        const fontFamily = node.fontFamily || "Inter";
        const fontWeight = node.fontWeight || 400;
        const lineHeight = node.lineHeight ? node.lineHeight * scale : fontSize * 1.2;

        ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
        ctx.globalAlpha = node.opacity !== undefined ? node.opacity : 1;
        ctx.fillStyle = node.color || "#000000";
        ctx.textBaseline = "top";

        let textX = x;
        if (node.textAlign === "center") { ctx.textAlign = "center"; textX = x + w / 2; }
        else if (node.textAlign === "right") { ctx.textAlign = "right"; textX = x + w; }
        else { ctx.textAlign = "left"; }

        const lines = node.shouldWrap === false ? [textValue] : wrapText(ctx, textValue, w);
        const totalTextHeight = lines.length * lineHeight;

        let startY = y;
        if (node.textAlignVertical === "center") startY = y + (h - totalTextHeight) / 2;
        else if (node.textAlignVertical === "bottom") startY = y + h - totalTextHeight;

        lines.forEach((line, i) => ctx.fillText(line, textX, startY + i * lineHeight));
        ctx.globalAlpha = 1;
      }
    }
  }, [figmaTemplates, copy, bgColor, generatedImage, loadImage, wrapText]);

  useEffect(() => {
    Object.keys(figmaTemplates).forEach((format) => renderCanvas(format));
  }, [figmaTemplates, copy, bgColor, generatedImage, renderCanvas]);

  // Carousel navigation
  const navigateCarousel = (direction: number) => {
    const newIdx = currentVariantIndex + direction;
    if (newIdx >= 0 && newIdx < imageVariants.length) {
      setCurrentVariantIndex(newIdx);
      const variant = imageVariants[newIdx];
      if (variant.type === "generated" && variant.dataUrl && sharedPictures.length > 0) {
        setGeneratedImage({ name: sharedPictures[0].name, dataUrl: variant.dataUrl });
      } else {
        setGeneratedImage(null);
      }
    }
  };

  // Generate images with Gemini
  const handleGenerateImages = async () => {
    if (!imagePrompt.trim() || sharedPictures.length === 0) return;

    setIsGenerating(true);
    const firstPicture = sharedPictures[0];
    const firstNode = Object.values(firstPicture.nodes)[0];
    const width = Math.round(firstNode.width || 1024);
    const height = Math.round(firstNode.height || 1024);

    const referenceUrl = useReference ? imageVariants[currentVariantIndex]?.dataUrl : null;

    setPopupImages([]);
    setShowPopup(true);

    try {
      const response = await fetch("http://localhost:3001/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          width,
          height,
          referenceImageUrl: referenceUrl,
          useReference,
          count: parseInt(variantCount),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate");

      if (data.success && data.images?.length > 0) {
        const images = data.images.map((img: { mimeType: string; base64: string }) =>
          `data:${img.mimeType};base64,${img.base64}`
        );
        setPopupImages(images);
      } else {
        throw new Error("No images generated");
      }
    } catch (error) {
      console.error("Gemini error:", error);
      setShowPopup(false);
      alert(`Generation error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
      setVariantCount("1");
    }
  };

  // Select generated image from popup
  const selectGeneratedImage = (dataUrl: string, index: number) => {
    const genCount = imageVariants.filter((v) => v.type === "generated").length;
    const newVariant: ImageVariant = {
      type: "generated",
      dataUrl,
      label: `Gen ${genCount + 1}`,
      prompt: imagePrompt,
    };

    setImageVariants((prev) => [...prev, newVariant]);
    setCurrentVariantIndex(imageVariants.length);
    setGeneratedImage({ name: sharedPictures[0].name, dataUrl });
    setShowPopup(false);

    // Download
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `gemini-variant-${index + 1}.png`;
    a.click();
  };

  const randomize = (field: "headline" | "subhead" | "cta") => {
    const data = field === "headline" ? headlines : field === "subhead" ? subheads : ctas;
    if (data.length > 0) {
      setCopy((prev) => ({ ...prev, [field]: data[Math.floor(Math.random() * data.length)].text }));
    }
  };

  const randomizeAll = () => {
    setCopy({
      headline: headlines.length ? headlines[Math.floor(Math.random() * headlines.length)].text : "",
      subhead: subheads.length ? subheads[Math.floor(Math.random() * subheads.length)].text : "",
      cta: ctas.length ? ctas[Math.floor(Math.random() * ctas.length)].text : "",
    });
  };

  const downloadPreview = async (format: string) => {
    const template = figmaTemplates[format];
    if (!template) return;

    const spec = formatSpecs[format];
    const exportCanvas = document.createElement("canvas");
    const canvasWidth = spec.width * exportScale;
    const canvasHeight = spec.height * exportScale;
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    const scale = (spec.width / template.width) * exportScale;
    ctx.fillStyle = bgColor || "#FFFFFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const sortedNodes = [...template.nodes].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (const node of sortedNodes) {
      const x = node.x * scale, y = node.y * scale, w = node.width * scale, h = node.height * scale;

      if (node.nodeType === "SHAPE" || node.nodeType === "IMAGE") {
        let imageUrl = node.imageUrl;
        if (node.nodeType === "IMAGE" && generatedImage && node.nodeName.toLowerCase() === generatedImage.name.toLowerCase()) {
          imageUrl = generatedImage.dataUrl;
        }
        if (imageUrl) {
          try {
            const img = await loadImage(imageUrl);
            ctx.drawImage(img, x, y, w, h);
          } catch (e) { console.warn("Failed:", node.nodeName); }
        }
      } else if (node.nodeType === "TEXT") {
        let textValue = node.defaultValue || "";
        if (node.role === "headline" && copy.headline) textValue = copy.headline;
        else if (node.role === "subhead" && copy.subhead) textValue = copy.subhead;
        else if (node.role === "cta" && copy.cta) textValue = copy.cta;
        if (!textValue) continue;

        if (node.textCase === "UPPER") textValue = textValue.toUpperCase();
        const fontSize = (node.fontSize || 16) * scale;
        ctx.font = `${node.fontWeight || 400} ${fontSize}px "${node.fontFamily || "Inter"}", sans-serif`;
        ctx.globalAlpha = node.opacity ?? 1;
        ctx.fillStyle = node.color || "#000";
        ctx.textBaseline = "top";

        let textX = x;
        if (node.textAlign === "center") { ctx.textAlign = "center"; textX = x + w / 2; }
        else if (node.textAlign === "right") { ctx.textAlign = "right"; textX = x + w; }
        else { ctx.textAlign = "left"; }

        const lineHeight = node.lineHeight ? node.lineHeight * scale : fontSize * 1.2;
        const lines = node.shouldWrap === false ? [textValue] : wrapText(ctx, textValue, w);
        let startY = y;
        if (node.textAlignVertical === "center") startY = y + (h - lines.length * lineHeight) / 2;
        lines.forEach((line, i) => ctx.fillText(line, textX, startY + i * lineHeight));
        ctx.globalAlpha = 1;
      }
    }

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fiz-${format.replace(":", "x")}@${exportScale}x.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const currentVariant = imageVariants[currentVariantIndex];
  const pictureNode = sharedPictures.length > 0 ? Object.values(sharedPictures[0].nodes)[0] : null;
  const hasTemplates = Object.keys(figmaTemplates).length > 0;

  const resetImport = () => {
    setFigmaTemplates({});
    setFigmaUrl("");
    setImportStatus(null);
    setSharedPictures([]);
    setImageVariants([]);
    setCurrentVariantIndex(0);
    setGeneratedImage(null);
  };

  // Figma Logo component
  const FigmaLogo = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size * 1.5} viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  );

  return (
    <div className="max-w-7xl">
      <PageHeader title="Creative Preview" description="Preview and generate creatives with AI">
        {hasTemplates && (
          <Button variant="outline" size="sm" onClick={resetImport} className="flex items-center gap-2">
            <FigmaLogo size={14} />
            <span>New Import</span>
          </Button>
        )}
      </PageHeader>

      {/* Figma Import - показываем только если нет шаблонов */}
      {!hasTemplates && (
        <Card className="border-border/40 mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <FigmaLogo size={24} />
              <div>
                <h3 className="font-semibold">Import from Figma</h3>
                <p className="text-sm text-muted-foreground">Paste a Figma URL to import templates</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Input value={figmaUrl} onChange={(e) => setFigmaUrl(e.target.value)} placeholder="https://www.figma.com/design/..." className="flex-1" />
              <Button onClick={handleFigmaImport} disabled={isImporting}>{isImporting ? "Importing..." : "Import"}</Button>
            </div>
            {importStatus && <p className={`mt-3 text-sm ${importStatus.startsWith("Error") ? "text-destructive" : "text-emerald-400"}`}>{importStatus}</p>}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Settings</CardTitle>
              <div className="flex gap-1 bg-muted rounded-md p-0.5">
                {["pt", "en"].map((l) => (
                  <button key={l} onClick={() => setLang(l as "pt" | "en")}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${lang === l ? "bg-background shadow-sm" : "hover:bg-background/50"}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "manual" | "library")}>
              <TabsList className="w-full">
                <TabsTrigger value="library" className="flex-1">Library</TabsTrigger>
                <TabsTrigger value="manual" className="flex-1">Manual</TabsTrigger>
              </TabsList>

              <TabsContent value="library" className="space-y-4 mt-4">
                {[{ label: "Headline", field: "headline" as const, data: headlines },
                  { label: "Subhead", field: "subhead" as const, data: subheads },
                  { label: "CTA", field: "cta" as const, data: ctas }].map((item) => (
                  <div key={item.field} className="space-y-2">
                    <Label>{item.label}</Label>
                    <div className="flex gap-2">
                      <select className="flex-1 min-w-0 h-9 rounded-md border border-input bg-background px-3 text-sm truncate"
                        value={copy[item.field]} onChange={(e) => setCopy((prev) => ({ ...prev, [item.field]: e.target.value }))}>
                        <option value="">Select...</option>
                        {item.data.map((d, i) => <option key={i} value={d.text}>{d.text.substring(0, 35)}...</option>)}
                      </select>
                      <Button variant="outline" size="sm" className="shrink-0" onClick={() => randomize(item.field)}>Rnd</Button>
                    </div>
                  </div>
                ))}
                <Button onClick={randomizeAll} className="w-full">Random All</Button>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4 mt-4">
                <div className="space-y-2"><Label>Headline</Label>
                  <Input value={copy.headline} onChange={(e) => setCopy((prev) => ({ ...prev, headline: e.target.value }))} placeholder="Main headline..." /></div>
                <div className="space-y-2"><Label>Subhead</Label>
                  <Input value={copy.subhead} onChange={(e) => setCopy((prev) => ({ ...prev, subhead: e.target.value }))} placeholder="Subheadline..." /></div>
                <div className="space-y-2"><Label>CTA</Label>
                  <Input value={copy.cta} onChange={(e) => setCopy((prev) => ({ ...prev, cta: e.target.value }))} placeholder="Call to action..." /></div>
              </TabsContent>
            </Tabs>

            {/* Background Color */}
            <div className="space-y-2 pt-4 border-t border-border/40">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-9 rounded border border-input cursor-pointer" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
              </div>
            </div>

            {/* Picture (Gemini AI) - показываем только если есть shared pictures */}
            {sharedPictures.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border/40">
                <Label>Picture (Gemini AI)</Label>

                {pictureNode && (
                  <p className="text-xs text-muted-foreground">
                    Figma size: <span className="text-indigo-400">{Math.round(pictureNode.width)}×{Math.round(pictureNode.height)}</span>
                  </p>
                )}

                {/* Variants Carousel */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={currentVariantIndex === 0} onClick={() => navigateCarousel(-1)}>&lt;</Button>
                  <div className="flex-1 h-24 rounded-lg border border-border/40 overflow-hidden bg-muted/30 flex items-center justify-center">
                    {currentVariant?.dataUrl ? (
                      <img src={currentVariant.dataUrl} alt={currentVariant.label} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" disabled={currentVariantIndex === imageVariants.length - 1} onClick={() => navigateCarousel(1)}>&gt;</Button>
                </div>

                {/* Carousel Indicator */}
                <div className="flex justify-center gap-1">
                  {imageVariants.map((v, i) => (
                    <button key={i} onClick={() => {
                      setCurrentVariantIndex(i);
                      if (v.type === "generated" && v.dataUrl) {
                        setGeneratedImage({ name: sharedPictures[0].name, dataUrl: v.dataUrl });
                      } else {
                        setGeneratedImage(null);
                      }
                    }}
                      className={`w-2 h-2 rounded-full transition-colors ${i === currentVariantIndex ? "bg-indigo-500" : v.type === "original" ? "bg-muted-foreground/50" : "bg-emerald-500/50"}`}
                      title={v.label}
                    />
                  ))}
                </div>

                <p className="text-xs text-center text-muted-foreground">{currentVariant?.label || "No variant"}</p>

                {/* Prompt */}
                <Textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe the image to generate...&#10;&#10;Example: Professional photo of a person using banking app"
                  rows={3}
                  className="text-sm"
                />

                {/* Options */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="use-ref" checked={useReference} onCheckedChange={(c) => setUseReference(!!c)} />
                    <Label htmlFor="use-ref" className="text-xs cursor-pointer">Use as reference</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Variants:</Label>
                    <Select value={variantCount} onValueChange={setVariantCount}>
                      <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleGenerateImages} disabled={isGenerating || !imagePrompt.trim()} variant="secondary" className="w-full">
                  {isGenerating ? "Generating..." : "Generate with Gemini"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previews */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formatSpecs).map(([format, spec]) => {
              const template = figmaTemplates[format];
              const aspectRatio = spec.width / spec.height;
              const previewWidth = Math.round(spec.previewHeight * aspectRatio);

              return (
                <Card key={format} className="border-border/40 cursor-pointer hover:border-indigo-500/50 transition-colors"
                  onClick={() => template && downloadPreview(format)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{spec.ratio} {spec.name}</span>
                      <span className="text-xs text-muted-foreground">{spec.width}×{spec.height}</span>
                    </div>
                    <div className="flex justify-center" style={{ minHeight: spec.previewHeight }}>
                      {template ? (
                        <canvas ref={(el) => { canvasRefs.current[format] = el; }} className="rounded-lg" style={{ maxWidth: "100%" }} />
                      ) : (
                        <div className="flex items-center justify-center rounded-lg bg-muted/30" style={{ width: previewWidth, height: spec.previewHeight }}>
                          <div className="text-center text-muted-foreground">
                            <p className="text-sm">Import from Figma</p>
                            <p className="text-xs">to see design</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-md p-1">
              {([1, 2] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setExportScale(s)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    exportScale === s ? "bg-background shadow-sm" : "hover:bg-background/50"
                  }`}
                >
                  x{s}
                </button>
              ))}
            </div>
            <Button onClick={async () => {
              for (const format of Object.keys(figmaTemplates)) {
                await downloadPreview(format);
                await new Promise((r) => setTimeout(r, 300));
              }
            }} disabled={Object.keys(figmaTemplates).length === 0}>
              Download All PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Generated Images Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select variant (click to select and download)</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {popupImages.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center h-48">
                <div className="animate-pulse text-muted-foreground">Generating images...</div>
              </div>
            ) : (
              popupImages.map((url, i) => (
                <div key={i} onClick={() => selectGeneratedImage(url, i)}
                  className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-colors">
                  <img src={url} alt={`Variant ${i + 1}`} className="w-full h-auto" />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
