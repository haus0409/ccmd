import { Link } from "@tanstack/react-router";
import { Menu, PenLine, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/explore", label: "Khám phá" },
  { to: "/create", label: "Viết hành trình" },
  { to: "/profile", label: "Hồ sơ" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl italic">
          <PenLine className="h-5 w-5 text-accent" /> Cách mà mình đã
        </Link>
        <ul className="hidden gap-7 text-sm md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="opacity-80 transition hover:opacity-100 data-[status=active]:text-accent data-[status=active]:opacity-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Mở menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <ul className="space-y-1 border-t border-secondary px-5 pb-4 md:hidden">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setOpen(false)} className="block py-2 data-[status=active]:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
