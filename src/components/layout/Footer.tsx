import { Link } from "@tanstack/react-router";
import { Sparkles, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-border bg-card/60 backdrop-blur-sm text-foreground transition-colors">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="comic-box inline-flex items-center gap-2 bg-primary px-2.5 py-1 text-primary-foreground font-comic text-xl font-bold">
              CMMD COMICS
            </div>
            <p className="font-display text-sm italic text-muted-foreground max-w-sm">
              “Không phải mọi câu chuyện đều có cái kết đẹp. Nhưng mọi hành trình đều đáng được kể
              lại.”
            </p>
            <div className="flex items-center gap-2 text-xs font-display font-bold tracking-wider text-primary">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>16-BIT ENGINE ACTIVE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="font-display font-bold text-xs uppercase tracking-wider text-primary">
              ĐIỀU HƯỚNG
            </p>
            <ul className="space-y-1.5 text-xs font-medium text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Trang chủ Archives
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition">
                  Kho tập truyện
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-primary transition">
                  Soạn thảo truyện mới
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary transition">
                  Hồ sơ cá nhân
                </Link>
              </li>
            </ul>
          </div>

          {/* Comic Code Seal */}
          <div className="space-y-2">
            <p className="font-display font-bold text-xs uppercase tracking-wider text-primary">
              COMIC ARCHIVES
            </p>
            <div className="comic-box inline-block rounded-sm bg-card p-3 text-[11px] text-muted-foreground max-w-xs">
              <span className="font-display block text-accent font-bold mb-1 tracking-wider uppercase">
                APPROVED BY CMMD
              </span>
              Lưu giữ những vấp ngã thật, những lần đứng dậy thật. Tự do sáng tạo dưới hình thức
              truyện tranh.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} CÁCH MÀ MÌNH ĐÃ · CMMD COMICS GROUP</p>
          <p className="font-display font-bold text-primary/80 tracking-wider">
            DESIGNED WITH PIXEL COMIC & RETRO SUPERHERO VIBE
          </p>
        </div>
      </div>
    </footer>
  );
}
