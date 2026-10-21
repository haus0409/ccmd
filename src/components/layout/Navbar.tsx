import { Link } from "@tanstack/react-router";
import { BookOpen, Menu, PenTool, Sparkles, User, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "TRANG CHỦ", icon: BookOpen },
  { to: "/explore", label: "KHÁM PHÁ", icon: Sparkles },
  { to: "/profile", label: "HỒ SƠ", icon: User },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/95 backdrop-blur-md transition-colors">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-2.5">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2.5 shrink-0">
          <div className="comic-box flex items-center gap-1.5 bg-primary px-2.5 py-1 text-primary-foreground transition-transform group-hover:scale-105">
            <span className="font-comic text-xl font-bold tracking-wider text-black">CMMD</span>
            <span className="font-display rounded bg-black px-1.5 py-0.5 text-[9px] font-black tracking-wider text-primary">
              COMICS
            </span>
          </div>
          <div>
            <div className="font-display text-sm sm:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-none">
              CÁCH MÀ MÌNH ĐÃ
            </div>
            <div className="font-sans text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mt-0.5">
              COMIC ARCHIVES
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="font-display font-bold flex items-center gap-1.5 text-xs tracking-wider text-muted-foreground transition hover:text-primary data-[status=active]:text-primary data-[status=active]:underline data-[status=active]:underline-offset-8"
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right CTA & Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/create"
            className="comic-box font-display inline-flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1.5 text-xs font-bold tracking-wider text-white hover:brightness-110 active:scale-95"
          >
            <PenTool className="h-3 w-3" />
            <span className="hidden xs:inline">TẠO TRUYỆN</span>
          </Link>

          {/* Mobile toggle */}
          <button
            className="comic-box border-2 border-border p-1.5 text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Mở menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <ul className="space-y-1.5 border-t-2 border-border bg-card px-5 py-4 md:hidden">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display font-bold flex items-center gap-2 py-2 text-xs tracking-wider text-muted-foreground data-[status=active]:text-primary"
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
