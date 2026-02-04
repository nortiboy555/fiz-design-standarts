import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Data imports
import { icpData, trustBlocks } from './data/icp.js';
import { competitors, fizPositioning, competitorPatterns } from './data/competitors.js';
import { headlines, offerTypes, emotionTypes } from './data/headlines.js';
import { subheads } from './data/subheads.js';
import { ctas, ctaPairings } from './data/cta.js';
import { banWords, complianceRules, severityLevels } from './data/banWords.js';
import { checklist, checklistMeta } from './data/checklist.js';
import { formats, masterStrategy, typography, layoutZones } from './data/formats.js';
import { styleDirections, premiumPrinciples, staticTemplates, motionScenarios } from './data/visualDirections.js';
import { testVariables, testOrder, sprintTemplate, kpiBenchmarks, prebuiltMatrices, generateMatrix } from './data/testMatrix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(join(__dirname, 'public')));

// ===== API Routes =====

// Get all data for initial load
app.get('/api/data', (req, res) => {
  res.json({
    icp: icpData,
    trustBlocks,
    competitors,
    fizPositioning,
    competitorPatterns,
    headlines,
    offerTypes,
    emotionTypes,
    subheads,
    ctas,
    ctaPairings,
    banWords,
    complianceRules,
    severityLevels,
    checklist,
    checklistMeta,
    formats,
    masterStrategy,
    typography,
    layoutZones,
    styleDirections,
    premiumPrinciples,
    staticTemplates,
    motionScenarios
  });
});

// ICP endpoints
app.get('/api/icp', (req, res) => {
  res.json(icpData);
});

app.get('/api/icp/:id', (req, res) => {
  const icp = icpData[req.params.id];
  if (!icp) {
    return res.status(404).json({ error: 'ICP not found' });
  }
  res.json(icp);
});

// Competitors
app.get('/api/competitors', (req, res) => {
  res.json({
    competitors,
    fizPositioning,
    patterns: competitorPatterns
  });
});

// Copy generation
app.get('/api/copy/generate', (req, res) => {
  const { lang = 'pt', offer = 'autopilot' } = req.query;

  // Filter headlines by offer
  const langHeadlines = headlines[lang] || headlines.pt;
  const filteredHeadlines = langHeadlines.filter(h => h.offer === offer);
  const headline = filteredHeadlines[Math.floor(Math.random() * filteredHeadlines.length)] || langHeadlines[0];

  // Random subhead
  const langSubheads = subheads[lang] || subheads.pt;
  const subhead = langSubheads[Math.floor(Math.random() * langSubheads.length)];

  // CTA matching offer
  const langCtas = ctas[lang] || ctas.pt;
  const pairings = ctaPairings[offer] || [];
  const matchingCtas = langCtas.filter(c =>
    pairings.some(p => p.toLowerCase().includes(c.text.toLowerCase().split(' ')[0]))
  );
  const cta = matchingCtas.length > 0
    ? matchingCtas[Math.floor(Math.random() * matchingCtas.length)]
    : langCtas[Math.floor(Math.random() * langCtas.length)];

  res.json({
    headline: headline?.text || '',
    subhead: subhead?.text || '',
    cta: cta?.text || '',
    meta: {
      headlineOffer: headline?.offer,
      headlineEmotion: headline?.emotion,
      ctaType: cta?.type
    }
  });
});

// Copy check
app.post('/api/copy/check', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const input = text.toLowerCase();
  const issues = [];

  // Check hard bans
  banWords.hardBan.forEach(ban => {
    ban.words.forEach(word => {
      if (input.includes(word.toLowerCase())) {
        issues.push({
          severity: 'high',
          type: 'hardBan',
          word,
          reason: ban.reason,
          suggestion: ban.suggestion
        });
      }
    });
  });

  // Check soft bans
  banWords.softBan.forEach(ban => {
    ban.words.forEach(word => {
      if (input.includes(word.toLowerCase())) {
        issues.push({
          severity: 'medium',
          type: 'softBan',
          word,
          reason: ban.reason,
          suggestion: ban.suggestion
        });
      }
    });
  });

  // Check patterns
  banWords.watchPatterns.forEach(pattern => {
    if (pattern.pattern.test(input)) {
      issues.push({
        severity: 'low',
        type: 'pattern',
        word: 'Pattern detected',
        reason: pattern.reason,
        suggestion: pattern.suggestion
      });
    }
  });

  res.json({
    isClean: issues.length === 0,
    issues,
    summary: {
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length
    }
  });
});

// Headlines/Subheads/CTAs
app.get('/api/headlines', (req, res) => {
  const { lang = 'pt', offer } = req.query;
  let result = headlines[lang] || headlines.pt;

  if (offer && offer !== 'all') {
    result = result.filter(h => h.offer === offer);
  }

  res.json(result);
});

app.get('/api/subheads', (req, res) => {
  const { lang = 'pt' } = req.query;
  res.json(subheads[lang] || subheads.pt);
});

app.get('/api/ctas', (req, res) => {
  const { lang = 'pt' } = req.query;
  res.json(ctas[lang] || ctas.pt);
});

// Ban words
app.get('/api/banwords', (req, res) => {
  res.json({
    hardBan: banWords.hardBan,
    softBan: banWords.softBan,
    watchPatterns: banWords.watchPatterns.map(p => ({
      ...p,
      pattern: p.pattern.toString()
    })),
    complianceRules,
    severityLevels
  });
});

// Checklist
app.get('/api/checklist', (req, res) => {
  res.json({
    sections: checklist,
    meta: checklistMeta
  });
});

// Formats
app.get('/api/formats', (req, res) => {
  res.json({
    formats,
    masterStrategy,
    typography,
    layoutZones
  });
});

app.get('/api/formats/:id', (req, res) => {
  const format = formats[req.params.id];
  if (!format) {
    return res.status(404).json({ error: 'Format not found' });
  }
  res.json(format);
});

// Visual directions
app.get('/api/visuals', (req, res) => {
  res.json({
    directions: styleDirections,
    principles: premiumPrinciples,
    staticTemplates,
    motionScenarios
  });
});

// Test Matrix
app.get('/api/testmatrix', (req, res) => {
  res.json({
    variables: testVariables,
    testOrder,
    sprintTemplate,
    kpiBenchmarks,
    prebuiltMatrices
  });
});

// Generate test matrix
app.post('/api/testmatrix/generate', (req, res) => {
  const { variables } = req.body;

  if (!variables || !Array.isArray(variables) || variables.length === 0) {
    return res.status(400).json({ error: 'Variables array is required' });
  }

  const matrix = generateMatrix(variables);
  res.json({
    variables: variables.map(v => testVariables[v]),
    combinations: matrix,
    total: matrix.length
  });
});

// ===== Figma API =====
const FIGMA_API = 'https://api.figma.com/v1';

async function figmaApi(endpoint) {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    throw new Error('FIGMA_ACCESS_TOKEN not configured');
  }

  const res = await fetch(`${FIGMA_API}${endpoint}`, {
    headers: { 'X-Figma-Token': token }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status}: ${text}`);
  }

  return res.json();
}

// Parse Figma URL to extract fileKey and nodeId
function parseFigmaUrl(url) {
  // URL formats:
  // https://www.figma.com/file/{fileKey}/{name}?node-id={nodeId}
  // https://www.figma.com/design/{fileKey}/{name}?node-id={nodeId}
  const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)(?:\/[^?]*)?(?:\?.*node-id=([^&]+))?/);
  if (!match) {
    throw new Error('Invalid Figma URL format');
  }

  return {
    fileKey: match[1],
    nodeId: match[2] ? match[2].replace('-', ':') : null
  };
}

// Standard ad format sizes to match against
const AD_FORMATS = {
  '9:16': { width: 1080, height: 1920, tolerance: 50 },
  '4:5': { width: 1080, height: 1350, tolerance: 50 },
  '1:1': { width: 1080, height: 1080, tolerance: 50 },
  '16:9': { width: 1920, height: 1080, tolerance: 50 }
};

function matchFormat(width, height) {
  for (const [name, spec] of Object.entries(AD_FORMATS)) {
    if (Math.abs(width - spec.width) <= spec.tolerance &&
        Math.abs(height - spec.height) <= spec.tolerance) {
      return name;
    }
  }
  return null;
}

function rgbToHex(r, g, b) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Extract ALL editable nodes from Figma node (TEXT, IMAGE, SHAPE)
function extractEditableNodes(node, parentBounds) {
  const results = [];
  let zIndex = 0;

  function walk(n) {
    const bounds = n.absoluteRenderBounds || n.absoluteBoundingBox;
    if (!bounds) return;

    const relX = bounds.x - parentBounds.x;
    const relY = bounds.y - parentBounds.y;

    // TEXT nodes
    if (n.type === 'TEXT') {
      const nameLower = n.name.toLowerCase().trim();
      let role = null;

      if (nameLower === 'headline') role = 'headline';
      else if (nameLower === 'subhead' || nameLower === 'subheadline') role = 'subhead';
      else if (nameLower === 'cta') role = 'cta';

      let color = '#000000';
      if (n.fills && n.fills.length > 0 && n.fills[0].color) {
        const c = n.fills[0].color;
        color = rgbToHex(c.r, c.g, c.b);
      }

      let lineHeight = null;
      if (n.style?.lineHeightPx) {
        lineHeight = n.style.lineHeightPx;
      } else if (n.style?.lineHeightPercentFontSize) {
        lineHeight = (n.style.lineHeightPercentFontSize / 100) * (n.style?.fontSize || 16);
      }

      // Check if text should wrap
      // If height is approximately one line height or less, it's single line - no wrap
      // Also check textAutoResize: WIDTH_AND_HEIGHT = auto-size, never wraps
      const textAutoResize = n.style?.textAutoResize || 'NONE';
      const isSingleLine = bounds.height <= (lineHeight || bounds.height) * 1.3;
      const shouldWrap = textAutoResize !== 'WIDTH_AND_HEIGHT' && !isSingleLine;

      // Get opacity from fills
      let opacity = 1;
      if (n.fills && n.fills.length > 0 && n.fills[0].opacity !== undefined) {
        opacity = n.fills[0].opacity;
      }

      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: 'TEXT',
        role,
        defaultValue: n.characters || '',
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++,
        // Font properties
        fontSize: n.style?.fontSize,
        fontFamily: n.style?.fontFamily,
        fontWeight: n.style?.fontWeight,
        fontStyle: n.style?.italic ? 'italic' : 'normal',
        // Text alignment
        textAlign: n.style?.textAlignHorizontal?.toLowerCase() || 'left',
        textAlignVertical: n.style?.textAlignVertical?.toLowerCase() || 'top',
        // Spacing
        lineHeight,
        letterSpacing: n.style?.letterSpacing || 0,
        paragraphSpacing: n.style?.paragraphSpacing || 0,
        // Text transforms
        textCase: n.style?.textCase || 'ORIGINAL', // UPPER, LOWER, TITLE, ORIGINAL
        textDecoration: n.style?.textDecoration || 'NONE', // UNDERLINE, STRIKETHROUGH, NONE
        // Color and opacity
        color,
        opacity,
        // Wrap settings
        textAutoResize,
        shouldWrap
      });
      return;
    }

    // Vector/Shape elements
    if (['VECTOR', 'STAR', 'LINE', 'POLYGON', 'BOOLEAN_OPERATION', 'ELLIPSE'].includes(n.type)) {
      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: 'SHAPE',
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++
      });
      return;
    }

    // Rectangles - IMAGE if has image fill, otherwise SHAPE
    if (n.type === 'RECTANGLE') {
      const hasImage = n.fills?.some(f => f.type === 'IMAGE');
      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: hasImage ? 'IMAGE' : 'SHAPE',
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++
      });
      return;
    }

    // Instance/Component - treat as SHAPE
    if (n.type === 'INSTANCE' || n.type === 'COMPONENT') {
      results.push({
        nodeId: n.id,
        nodeName: n.name,
        nodeType: 'SHAPE',
        x: relX,
        y: relY,
        width: bounds.width,
        height: bounds.height,
        zIndex: zIndex++
      });
      return;
    }

    // Frames/Groups with image fill
    if (['FRAME', 'GROUP'].includes(n.type)) {
      const hasImage = n.fills?.some(f => f.type === 'IMAGE');
      if (hasImage) {
        results.push({
          nodeId: n.id,
          nodeName: n.name,
          nodeType: 'IMAGE',
          x: relX,
          y: relY,
          width: bounds.width,
          height: bounds.height,
          zIndex: zIndex++
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

// Parse Figma file and find frames matching ad formats
app.post('/api/figma/parse', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const { fileKey, nodeId } = parseFigmaUrl(url);

    // If nodeId specified, get that specific node
    if (nodeId) {
      const data = await figmaApi(`/files/${fileKey}/nodes?ids=${nodeId}`);
      const nodeData = data.nodes[nodeId];

      if (!nodeData || !nodeData.document) {
        return res.status(404).json({ error: 'Node not found' });
      }

      const node = nodeData.document;
      const bounds = node.absoluteBoundingBox;

      if (!bounds) {
        return res.status(400).json({ error: 'Node has no bounds' });
      }

      const format = matchFormat(bounds.width, bounds.height);
      const editableNodes = extractEditableNodes(node, bounds);

      // Get background color
      let backgroundColor = null;
      if (node.fills && node.fills.length > 0) {
        const solidFill = node.fills.find(f => f.type === 'SOLID' && f.color);
        if (solidFill && solidFill.color) {
          backgroundColor = rgbToHex(solidFill.color.r, solidFill.color.g, solidFill.color.b);
        }
      }

      // Get preview image
      const imageData = await figmaApi(`/images/${fileKey}?ids=${nodeId}&format=png&scale=0.5`);
      const previewUrl = imageData.images[nodeId] || null;

      // Export PNGs for SHAPE/IMAGE nodes
      const shapeNodes = editableNodes.filter(n => n.nodeType === 'SHAPE' || n.nodeType === 'IMAGE');
      if (shapeNodes.length > 0) {
        const shapeIds = shapeNodes.map(n => n.nodeId).join(',');
        const shapeImages = await figmaApi(`/images/${fileKey}?ids=${shapeIds}&format=png&scale=2`);
        shapeNodes.forEach(n => {
          n.imageUrl = shapeImages.images[n.nodeId] || null;
        });
      }

      return res.json({
        fileKey,
        node: {
          id: nodeId,
          name: node.name,
          width: bounds.width,
          height: bounds.height,
          format,
          backgroundColor,
          previewUrl,
          nodes: editableNodes
        }
      });
    }

    // Get full file structure
    const data = await figmaApi(`/files/${fileKey}`);
    const templates = [];

    // Size patterns to match in page names (supports both x and × characters)
    const sizePatterns = {
      '1080x1920': '9:16',
      '1080×1920': '9:16',
      '1080x1350': '4:5',
      '1080×1350': '4:5',
      '1080x1080': '1:1',
      '1080×1080': '1:1',
      '1920x1080': '16:9',
      '1920×1080': '16:9',
      // Alternative naming
      '9:16': '9:16',
      '4:5': '4:5',
      '1:1': '1:1',
      '16:9': '16:9',
      'story': '9:16',
      'reels': '9:16',
      'feed': '4:5',
      'square': '1:1',
      'landscape': '16:9'
    };

    // Look through pages (CANVAS nodes in Figma)
    for (const page of data.document.children || []) {
      if (page.type !== 'CANVAS') continue;

      const pageName = page.name.toLowerCase();

      // Check if page name matches a size pattern
      let matchedFormat = null;
      for (const [pattern, format] of Object.entries(sizePatterns)) {
        if (pageName.includes(pattern.toLowerCase())) {
          matchedFormat = format;
          break;
        }
      }

      if (!matchedFormat) continue;

      // Find "Actual" layer inside this page
      function findActualLayer(node) {
        if (node.name.toLowerCase() === 'actual' && ['FRAME', 'COMPONENT', 'GROUP'].includes(node.type)) {
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
          const solidFill = actualNode.fills.find(f => f.type === 'SOLID' && f.color);
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
          nodes: editableNodes
        });
      }
    }

    // If no pages with size names found, fall back to finding frames by size
    if (templates.length === 0) {
      function findFramesBySize(node) {
        if (['FRAME', 'COMPONENT'].includes(node.type) && node.absoluteBoundingBox) {
          const { width, height } = node.absoluteBoundingBox;
          const format = matchFormat(width, height);

          if (format) {
            const editableNodes = extractEditableNodes(node, node.absoluteBoundingBox);

            let backgroundColor = null;
            if (node.fills && node.fills.length > 0) {
              const solidFill = node.fills.find(f => f.type === 'SOLID' && f.color);
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
              nodes: editableNodes
            });
          }
        }

        if (node.children) {
          node.children.forEach(findFramesBySize);
        }
      }

      findFramesBySize(data.document);
    }

    // Export PNG for SHAPE/IMAGE nodes in all templates
    if (templates.length > 0) {
      // Collect all SHAPE/IMAGE node IDs
      const allShapeIds = [];
      templates.forEach(t => {
        (t.nodes || []).forEach(n => {
          if (n.nodeType === 'SHAPE' || n.nodeType === 'IMAGE') {
            allShapeIds.push(n.nodeId);
          }
        });
      });

      // Export all shapes in one API call
      if (allShapeIds.length > 0) {
        const shapeImages = await figmaApi(`/images/${fileKey}?ids=${allShapeIds.join(',')}&format=png&scale=2`);
        templates.forEach(t => {
          (t.nodes || []).forEach(n => {
            if (n.nodeType === 'SHAPE' || n.nodeType === 'IMAGE') {
              n.imageUrl = shapeImages.images[n.nodeId] || null;
            }
          });
        });
      }

      // Get PNG previews for thumbnails
      const ids = templates.map(t => t.id).join(',');
      const pngData = await figmaApi(`/images/${fileKey}?ids=${ids}&format=png&scale=0.5`);

      templates.forEach(template => {
        template.previewUrl = pngData.images[template.id] || null;
      });
    }

    res.json({
      fileKey,
      fileName: data.name,
      frames: templates
    });

  } catch (error) {
    console.error('Figma parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export Figma node as image
app.get('/api/figma/export/:fileKey/:nodeId', async (req, res) => {
  try {
    const { fileKey, nodeId } = req.params;
    const { format = 'png', scale = '2' } = req.query;

    const normalizedId = nodeId.replace('-', ':');
    const data = await figmaApi(`/images/${fileKey}?ids=${normalizedId}&format=${format}&scale=${scale}`);

    const imageUrl = data.images[normalizedId];
    if (!imageUrl) {
      return res.status(404).json({ error: 'Failed to export image' });
    }

    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Figma export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch SVG content from Figma and return it
app.get('/api/figma/svg', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch SVG from Figma's S3
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status}`);
    }

    const svgContent = await response.text();

    res.set('Content-Type', 'image/svg+xml');
    res.send(svgContent);
  } catch (error) {
    console.error('SVG fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== Gemini API for Image Generation =====
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_IMAGE_MODEL = 'gemini-3-pro-image-preview';

// Generate single image with Gemini (internal helper)
async function generateSingleImage(apiKey, prompt, width, height, referenceImageUrl, referenceBase64) {
  // Build parts array
  const parts = [];

  // If reference image provided, include it
  if (referenceBase64) {
    parts.push({
      inlineData: {
        mimeType: referenceBase64.mimeType,
        data: referenceBase64.data
      }
    });
    parts.push({ text: prompt });
  } else {
    parts.push({ text: `Generate an image: ${prompt}` });
  }

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ['IMAGE']
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();

  // Extract generated image
  const candidates = data.candidates || [];
  for (const candidate of candidates) {
    const candidateParts = candidate.content?.parts || [];
    for (const part of candidateParts) {
      if (part.inlineData?.data) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png',
          width: width || 1024,
          height: height || 1024
        };
      }
    }
  }

  return null;
}

// Generate multiple images with Gemini
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured. Get it from https://aistudio.google.com/apikey' });
    }

    const { prompt, width, height, referenceImageUrl, useReference, count = 1 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get reference image once if needed
    let referenceBase64 = null;
    if (useReference && referenceImageUrl) {
      console.log('Reference URL type:', typeof referenceImageUrl);
      console.log('Reference URL starts with:', referenceImageUrl?.substring(0, 50));

      try {
        // Check if it's a data URL (from previously generated image)
        if (referenceImageUrl.startsWith('data:')) {
          const matches = referenceImageUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            console.log('Parsed data URL - mimeType:', matches[1], 'data length:', matches[2]?.length);
            referenceBase64 = {
              mimeType: matches[1],
              data: matches[2]
            };
          } else {
            console.log('Failed to parse data URL with regex');
          }
        } else {
          // Fetch from URL
          const imgResponse = await fetch(referenceImageUrl);
          if (imgResponse.ok) {
            const buffer = await imgResponse.arrayBuffer();
            referenceBase64 = {
              data: Buffer.from(buffer).toString('base64'),
              mimeType: imgResponse.headers.get('content-type') || 'image/png'
            };
          }
        }
      } catch (e) {
        console.warn('Failed to get reference image:', e);
      }
    }

    // Generate multiple images in parallel
    const numImages = Math.min(Math.max(1, count), 5);
    const promises = [];

    for (let i = 0; i < numImages; i++) {
      // Add slight variation to prompt for different results
      const variedPrompt = numImages > 1
        ? `${prompt} (variation ${i + 1}, unique composition and style)`
        : prompt;

      promises.push(
        generateSingleImage(apiKey, variedPrompt, width, height, referenceImageUrl, referenceBase64)
          .catch(err => {
            console.error(`Image ${i + 1} generation failed:`, err);
            return null;
          })
      );
    }

    const results = await Promise.all(promises);
    const images = results.filter(img => img !== null);

    if (images.length === 0) {
      throw new Error('No images generated');
    }

    res.json({
      success: true,
      images
    });

  } catch (error) {
    console.error('Gemini generate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     FIZ Creative Hub                  ║
  ║     http://localhost:${PORT}              ║
  ╚═══════════════════════════════════════╝
  `);
});
