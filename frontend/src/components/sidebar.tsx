"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  SlidersHorizontal,
  GitBranch,
  Brain,
  FileText,
  MapPin,
  Calendar,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/digital-twin", label: "Digital Twin", icon: Layers },
  { href: "/scenarios", label: "Scenarios", icon: SlidersHorizontal },
  { href: "/pathway", label: "Environmental Pathway", icon: GitBranch },
  { href: "/recommendations", label: "AI Recommendations", icon: Brain },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg">🌿</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Eco<span className="text-primary">Twin</span> GIKI
            </h1>
            <p className="text-[10px] leading-tight text-muted-foreground">
              Digital Twin for a<br />
              Sustainable Future
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Our Mission */}
      <div className="mx-3 mb-3 rounded-xl bg-primary/5 p-4">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <span className="text-sm">🌱</span>
        </div>
        <h3 className="mb-1 text-xs font-semibold text-foreground">
          Our Mission
        </h3>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          To visualize, simulate and optimize today&apos;s decisions for a
          resilient and sustainable tomorrow.
        </p>
      </div>

      {/* Footer info */}
      <div className="border-t border-border px-5 py-3">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>GIKI, Topi, Swabi, KPK, Pakistan</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Last Updated: 25 May 2025</span>
        </div>
      </div>
    </aside>
  );
}
