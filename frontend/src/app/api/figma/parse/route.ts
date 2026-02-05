import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const FIGMA_API = "https://api.figma.com/v1";
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

// Standard ad format sizes
const AD_FORMATS: Record<string, { width: number; height: number; tolerance: number }> = {
  "9:16": { width: 1080, height: 1920, tolerance: 50 },
  "4:5": { width: 1080, height: 1350, tolerance: 50 },
  "1:1": { width: 1080, height: 1080, tolerance: 50 },
  "16:9": { width: 1920, height: 1080, tolerance: 50 },
};

async function figmaApi(endpoint: string) {
  if (!FIGMA_ACCESS_TOKEN) {
    throw new Error("FIGMA_ACCESS_TOKEN not configured");
  }

  const res = await fetch(`${FIGMA_API}${endpoint}`, {
    headers: { "X-Figma-Token": FIGMA_ACCESS_TOKEN },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status}: ${text}`);
  }

  return res.json();
}

function parseFigmaUrl(url: string) {
  const match = url.match(
    /figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)(?:\/[^?]*)?(?:\?.*node-id=([^&]+))?/
  );
  if (!match) {
    throw new Error("Invalid Figma URL format");
  }

  return {
    fileKey: match[1],
    nodeId: match[2] ? match[2].replace("-", ":") : null,
  };
}

function matchFormat(width: number, height: number): string | null {
  for (const [name, spec] of Object.entries(AD_FORMATS)) {
    if (
      Math.abs(width - spec.width) <= spec.tolerance &&
      Math.abs(height - spec.height) <= spec.tolerance
    ) {
      return name;
    }
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  locked?: boolean;
  absoluteRenderBounds?: { x: number; y: number; width: number; height: number };
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  children?: FigmaNode[];
  fills?: Array<{ type: string; color?: { r: number; g: number; b: number }; opacity?: number }>;
  characters?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number;
    italic?: boolean;
    textAlignHorizontal?: string;
    textAlignVertical?: string;
    lineHeightPx?: number;
    lineHeightPercentFontSize?: number;
    letterSpacing?: number;
    paragraphSpacing?: number;
    textCase?: string;
    textDecoration?: string;
    textAutoResize?: string;
  };
}

interface EditableNode {
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
  lineHeight?: number | null;
  letterSpacing?: number;
  paragraphSpacing?: number;
  textCase?: string;
  textDecoration?: string;
  color?: string;
  opacity?: number;
  textAutoResize?: string;
  shouldWrap?: boolean;
  imageUrl?: string | null;
  locked?: boolean;
}

function extractEditableNodes(
  node: FigmaNode,
  parentBounds: { x: number; y: number }
): EditableNode[] {
  const results: EditableNode[] = [];
  let zIndex = 0;

  function walk(n: FigmaNode) {
    const bounds = n.absoluteRenderBounds || n.absoluteBoundingBox;
    if (!bounds) return;

    const relX = bounds.x - parentBounds.x;
    const relY = bounds.y - parentBounds.y;

    // TEXT nodes
    if (n.type === "TEXT") {
      const nameLower = n.name.toLowerCase().trim();
      let role: "headline" | "subhead" | "cta" | null = null;

      if (nameLower === "headline") role = "headline";
      else if (nameLower === "subhead" || nameLower === "subheadline") role = "subhead";
      else if (nameLower === "cta") role = "cta";

      let color = "#000000";
      if (n.fills && n.fills.length > 0 && n.fills[0].color) {
        const c = n.fills[0].color;
        color = rgbToHex(c.r, c.g, c.b);
      }

      let lineHeight: number | null = null;
      if (n.style?.lineHeightPx) {
        lineHeight = n.style.lineHeightPx;
      } else if (n.style?.lineHeightPercentFontSize) {
        lineHeight = (n.style.lineHeightPercentFontSize / 100) * (n.style?.fontSize || 16);
      }

      const textAutoResize = n.style?.textAutoResize || "NONE";
      const isSingleLine = bounds.height <= (lineHeight || bounds.height) * 1.3;
      const shouldWrap = textAutoResize !== "WIDTH_AND_HEIGHT" && !isSingleLine;

      let opacity = 1;
      if (n.fills && n.fills.length > 0 && n.fills[0].opacity !== undefined) {
        opacity = n.fills[0].opacity;
      }

      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: "TEXT",
        role,
        defaultValue: n.characters || "",
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++,
        fontSize: n.style?.fontSize,
        fontFamily: n.style?.fontFamily,
        fontWeight: n.style?.fontWeight,
        fontStyle: n.style?.italic ? "italic" : "normal",
        textAlign: n.style?.textAlignHorizontal?.toLowerCase() || "left",
        textAlignVertical: n.style?.textAlignVertical?.toLowerCase() || "top",
        lineHeight,
        letterSpacing: n.style?.letterSpacing || 0,
        paragraphSpacing: n.style?.paragraphSpacing || 0,
        textCase: n.style?.textCase || "ORIGINAL",
        textDecoration: n.style?.textDecoration || "NONE",
        color,
        opacity,
        textAutoResize,
        shouldWrap,
        locked: !!n.locked,
      });
      return;
    }

    // Vector/Shape elements
    if (["VECTOR", "STAR", "LINE", "POLYGON", "BOOLEAN_OPERATION", "ELLIPSE"].includes(n.type)) {
      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: "SHAPE",
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++,
        locked: !!n.locked,
      });
      return;
    }

    // Rectangles - IMAGE if has image fill, otherwise SHAPE
    if (n.type === "RECTANGLE") {
      const hasImage = n.fills?.some((f) => f.type === "IMAGE");
      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: hasImage ? "IMAGE" : "SHAPE",
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++,
        locked: !!n.locked,
      });
      return;
    }

    // Instance/Component - treat as SHAPE
    if (n.type === "INSTANCE" || n.type === "COMPONENT") {
      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: "SHAPE",
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++,
        locked: !!n.locked,
      });
      return;
    }

    // Frames/Groups with image fill
    if (["FRAME", "GROUP"].includes(n.type)) {
      const hasImage = n.fills?.some((f) => f.type === "IMAGE");
      if (hasImage) {
        results.push({
          nodeId: n.id,
          nodeName: n.name,
          nodeType: "IMAGE",
          x: relX,
          y: relY,
          width: bounds.width,
          height: bounds.height,
          zIndex: zIndex++,
          locked: !!n.locked,
        });
        return;
      }
    }

    // Recurse into children
    if (n.children) {
      n.children.forEach(walk);
    }
  }

  walk(node);
  return results;
}

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const { fileKey, nodeId } = parseFigmaUrl(url);

    // If nodeId specified, get that specific node
    if (nodeId) {
      const data = await figmaApi(`/files/${fileKey}/nodes?ids=${nodeId}`);
      const nodeData = data.nodes[nodeId];

      if (!nodeData || !nodeData.document) {
        return NextResponse.json({ error: "Node not found" }, { status: 404 });
      }

      const node = nodeData.document;
      const bounds = node.absoluteBoundingBox;

      if (!bounds) {
        return NextResponse.json({ error: "Node has no bounds" }, { status: 400 });
      }

      const format = matchFormat(bounds.width, bounds.height);
      const editableNodes = extractEditableNodes(node, bounds);

      let backgroundColor = null;
      if (node.fills && node.fills.length > 0) {
        const solidFill = node.fills.find(
          (f: { type: string; color?: { r: number; g: number; b: number } }) =>
            f.type === "SOLID" && f.color
        );
        if (solidFill && solidFill.color) {
          backgroundColor = rgbToHex(solidFill.color.r, solidFill.color.g, solidFill.color.b);
        }
      }

      const imageData = await figmaApi(`/images/${fileKey}?ids=${nodeId}&format=png&scale=0.5`);
      const previewUrl = imageData.images[nodeId] || null;

      const shapeNodes = editableNodes.filter((n) => n.nodeType === "SHAPE" || n.nodeType === "IMAGE");
      if (shapeNodes.length > 0) {
        const shapeIds = shapeNodes.map((n) => n.nodeId).join(",");
        const shapeImages = await figmaApi(`/images/${fileKey}?ids=${shapeIds}&format=png&scale=2`);
        shapeNodes.forEach((n) => {
          n.imageUrl = shapeImages.images[n.nodeId] || null;
        });
      }

      return NextResponse.json({
        fileKey,
        node: {
          id: nodeId,
          name: node.name,
          width: bounds.width,
          height: bounds.height,
          format,
          backgroundColor,
          previewUrl,
          nodes: editableNodes,
        },
      });
    }

    // Get full file structure
    const data = await figmaApi(`/files/${fileKey}`);
    const templates: Array<{
      id: string;
      name: string;
      pageName?: string;
      width: number;
      height: number;
      format: string;
      backgroundColor: string | null;
      nodes: EditableNode[];
      previewUrl?: string | null;
    }> = [];

    const sizePatterns: Record<string, string> = {
      "1080x1920": "9:16",
      "1080×1920": "9:16",
      "1080x1350": "4:5",
      "1080×1350": "4:5",
      "1080x1080": "1:1",
      "1080×1080": "1:1",
      "1920x1080": "16:9",
      "1920×1080": "16:9",
      "9:16": "9:16",
      "4:5": "4:5",
      "1:1": "1:1",
      "16:9": "16:9",
      story: "9:16",
      reels: "9:16",
      feed: "4:5",
      square: "1:1",
      landscape: "16:9",
    };

    for (const page of data.document.children || []) {
      if (page.type !== "CANVAS") continue;

      const pageName = page.name.toLowerCase();

      let matchedFormat: string | null = null;
      for (const [pattern, format] of Object.entries(sizePatterns)) {
        if (pageName.includes(pattern.toLowerCase())) {
          matchedFormat = format;
          break;
        }
      }

      if (!matchedFormat) continue;

      function findActualLayer(node: FigmaNode): FigmaNode | null {
        if (
          node.name.toLowerCase() === "actual" &&
          ["FRAME", "COMPONENT", "GROUP"].includes(node.type)
        ) {
          return node;
        }
        for (const child of node.children || []) {
          const found = findActualLayer(child);
          if (found) return found;
        }
        return null;
      }

      const actualNode = findActualLayer(page);

      if (actualNode && actualNode.absoluteBoundingBox) {
        const bounds = actualNode.absoluteBoundingBox;
        const editableNodes = extractEditableNodes(actualNode, bounds);

        let backgroundColor = null;
        if (actualNode.fills && actualNode.fills.length > 0) {
          const solidFill = actualNode.fills.find((f) => f.type === "SOLID" && f.color);
          if (solidFill && solidFill.color) {
            backgroundColor = rgbToHex(solidFill.color.r, solidFill.color.g, solidFill.color.b);
          }
        }

        templates.push({
          id: actualNode.id,
          name: actualNode.name,
          pageName: page.name,
          width: bounds.width,
          height: bounds.height,
          format: matchedFormat,
          backgroundColor,
          nodes: editableNodes,
        });
      }
    }

    // Fallback: find frames by size
    if (templates.length === 0) {
      function findFramesBySize(node: FigmaNode) {
        if (["FRAME", "COMPONENT"].includes(node.type) && node.absoluteBoundingBox) {
          const { width, height } = node.absoluteBoundingBox;
          const format = matchFormat(width, height);

          if (format) {
            const editableNodes = extractEditableNodes(node, node.absoluteBoundingBox);

            let backgroundColor = null;
            if (node.fills && node.fills.length > 0) {
              const solidFill = node.fills.find((f) => f.type === "SOLID" && f.color);
              if (solidFill && solidFill.color) {
                backgroundColor = rgbToHex(solidFill.color.r, solidFill.color.g, solidFill.color.b);
              }
            }

            templates.push({
              id: node.id,
              name: node.name,
              width,
              height,
              format,
              backgroundColor,
              nodes: editableNodes,
            });
          }
        }

        if (node.children) {
          node.children.forEach(findFramesBySize);
        }
      }

      findFramesBySize(data.document);
    }

    // Export PNG for SHAPE/IMAGE nodes
    if (templates.length > 0) {
      const allShapeIds: string[] = [];
      templates.forEach((t) => {
        (t.nodes || []).forEach((n) => {
          if (n.nodeType === "SHAPE" || n.nodeType === "IMAGE") {
            allShapeIds.push(n.nodeId);
          }
        });
      });

      if (allShapeIds.length > 0) {
        const shapeImages = await figmaApi(
          `/images/${fileKey}?ids=${allShapeIds.join(",")}&format=png&scale=2`
        );
        templates.forEach((t) => {
          (t.nodes || []).forEach((n) => {
            if (n.nodeType === "SHAPE" || n.nodeType === "IMAGE") {
              n.imageUrl = shapeImages.images[n.nodeId] || null;
            }
          });
        });
      }

      const ids = templates.map((t) => t.id).join(",");
      const pngData = await figmaApi(`/images/${fileKey}?ids=${ids}&format=png&scale=0.5`);

      templates.forEach((template) => {
        template.previewUrl = pngData.images[template.id] || null;
      });
    }

    return NextResponse.json({
      fileKey,
      fileName: data.name,
      frames: templates,
    });
  } catch (error) {
    console.error("Figma parse error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Parse failed" },
      { status: 500 }
    );
  }
}
