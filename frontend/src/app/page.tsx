"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

const quickActions = [
  { title: "Generate Copy", href: "/copylab", icon: "✍️", description: "Create compliant ad copy", color: "from-indigo-500/20 to-indigo-500/5" },
  { title: "Creative Preview", href: "/preview", icon: "🖼️", description: "Preview across formats", color: "from-purple-500/20 to-purple-500/5" },
  { title: "Pre-flight Check", href: "/checklist", icon: "✅", description: "Validate before publish", color: "from-emerald-500/20 to-emerald-500/5" },
  { title: "Format Specs", href: "/formats", icon: "📐", description: "Meta ad specifications", color: "from-amber-500/20 to-amber-500/5" },
];

const referenceLinks = [
  { title: "ICP Cards", href: "/icp", icon: "👤", description: "Target audience segments" },
  { title: "Competitors", href: "/competitors", icon: "🎯", description: "Market positioning" },
  { title: "Copy Formulas", href: "/headlines", icon: "📝", description: "Pre-approved headlines" },
  { title: "Compliance", href: "/compliance", icon: "🚫", description: "Banned words guide" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="Marketing creative tools and references for FIZ campaigns"
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 text-foreground/80">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className={`group h-full border-border/40 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer overflow-hidden bg-gradient-to-br ${item.color} hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10`}>
                <CardContent className="p-5">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h3 className="font-semibold mb-1 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-foreground/80">Reference Library</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {referenceLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="group h-full border-border/40 hover:border-border transition-all duration-200 cursor-pointer hover:bg-muted/30">
                <CardContent className="p-5">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
                  <h3 className="font-medium text-sm mb-1 group-hover:text-foreground transition-colors">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-12 pt-8 border-t border-border/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">60+</div>
            <div className="text-sm text-muted-foreground">Copy Formulas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">3</div>
            <div className="text-sm text-muted-foreground">ICP Segments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">4</div>
            <div className="text-sm text-muted-foreground">Ad Formats</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">33+</div>
            <div className="text-sm text-muted-foreground">Ban Words</div>
          </div>
        </div>
      </section>
    </div>
  );
}
