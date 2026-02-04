import { NextResponse } from "next/server";

const formats = {
  "9:16": {
    id: "9:16",
    name: "Stories / Reels",
    ratio: "9:16",
    baseSize: { width: 1080, height: 1920 },
    hiResSize: { width: 1080, height: 1920 },
    placements: ["Stories", "Reels"],
    role: "Full-screen impact",
    isMaster: true,
    masterType: "A",
    safeZones: {
      uiTop: { height: 250, description: "UI overlay zone", rule: "No text/logos here" },
      uiBottom: { height: 250, description: "UI overlay zone", rule: "No text/logos here" },
      safe11: { width: 1080, height: 1080, offsetY: 420, description: "Safe for 1:1 crop" },
      safe45: { width: 1080, height: 1350, offsetY: 285, description: "Safe for 4:5 crop" },
    },
    gridSpec: { columns: 12, margins: 64, gutter: 16 },
  },
  "4:5": {
    id: "4:5",
    name: "Feed Portrait",
    ratio: "4:5",
    baseSize: { width: 1080, height: 1350 },
    hiResSize: { width: 1440, height: 1800 },
    placements: ["Feed (IG/FB)", "Mobile-optimized"],
    role: "Maximum feed area",
    isMaster: true,
    masterType: "B",
    gridSpec: { columns: 12, margins: 56, gutter: 16 },
  },
  "1:1": {
    id: "1:1",
    name: "Square",
    ratio: "1:1",
    baseSize: { width: 1080, height: 1080 },
    hiResSize: { width: 1440, height: 1440 },
    placements: ["Feed (FB/IG)", "Explore-like surfaces"],
    role: "Universal for feed",
    isMaster: false,
    derivedFrom: "9:16",
    gridSpec: { columns: 12, margins: 48, gutter: 16 },
  },
  "16:9": {
    id: "16:9",
    name: "Landscape",
    ratio: "16:9",
    baseSize: { width: 1920, height: 1080 },
    hiResSize: { width: 1920, height: 1080 },
    placements: ["In-stream video", "Video placements"],
    role: "Separate branch",
    isMaster: false,
    isOptional: true,
    gridSpec: { columns: 12, margins: 60, gutter: 16 },
  },
};

const masterStrategy = {
  description: "One master without pain into all placements",
  stepOne: { title: "Draw Master 9:16 as container", canvas: { width: 1080, height: 1920 } },
  stepTwo: { title: "Adaptation" },
};

const typography = {
  headline: { "9:16": { min: 44, max: 64 }, "4:5": { min: 40, max: 56 }, "1:1": { min: 36, max: 48 } },
  subline: { all: { min: 22, max: 28 } },
  microProof: { all: { min: 16, max: 18 } },
};

const layoutZones = [
  { id: "badge", name: "Badge zone", position: "top-left" },
  { id: "headline", name: "Headline zone", position: "top/center" },
  { id: "proof", name: "Proof zone", position: "below headline" },
  { id: "hero", name: "Hero zone", position: "center" },
  { id: "cta", name: "CTA zone", position: "bottom" },
  { id: "logo", name: "Logo lockup", position: "bottom-left" },
];

export async function GET() {
  return NextResponse.json({ formats, masterStrategy, typography, layoutZones });
}
