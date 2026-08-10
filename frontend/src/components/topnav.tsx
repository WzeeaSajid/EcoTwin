"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Overview" },
  { href: "/digital-twin", label: "Digital Twin" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/pathway", label: "Environmental Pathway" },
  { href: "/recommendations", label: "AI Recommendations" },
  { href: "/reports", label: "Reports" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      <nav className="flex items-center gap-6">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Sun className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
