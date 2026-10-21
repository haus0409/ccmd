import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import appleSketch from "@/assets/apple-sketch.jpg";
import failedExam from "@/assets/failed-exam.jpg";
import heroCover from "@/assets/hero-cover.jpg";
import leavingCity from "@/assets/leaving-city.jpg";

export interface HeroCardData {
  id: string;
  issue: string;
  hero: string;
  alias: string;
  archetype: string;
  quote: string;
  tagline: string;
  image: string;
  accentBg: string;
  accentText: string;
  icon: string;
  filter?: string;
}

export const HERO_CARDS: HeroCardData[] = [
  {
    id: "batman",
    issue: "#01",
    hero: "THE DARK KNIGHT",
    alias: "BATMAN · CHẠM ĐÁY & NỖI SỢ",
    archetype: "VƯỢT LÊN BÓNG TỐI",
    quote: "“Dưới đáy vực sâu nhất, mình mới học được cách leo lên mà không cần dây bảo hộ.”",
    tagline: "GOTHAM NIGHTS · CHƯƠNG ĐẶC BIỆT",
    image: heroCover,
    accentBg: "bg-amber-400 text-black border-amber-500",
    accentText: "text-amber-400",
    icon: "🦇",
  },
  {
    id: "spiderman",
    issue: "#02",
    hero: "THE WALL CRAWLER",
    alias: "SPIDER-MAN · ÁP LỰC TUỔI TRẺ",
    archetype: "TRÁCH NHIỆM & VẤP NGÃ",
    quote:
      "“Ai cũng thấy lúc mình bay lượn trên cao, chẳng ai thấy những lần mình đập mặt vào tường gạch.”",
    tagline: "QUEENS CHRONICLES · MƯA NỬA ĐÊM",
    image: failedExam,
    accentBg: "bg-red-500 text-white border-red-600",
    accentText: "text-red-400",
    icon: "🕷️",
  },
  {
    id: "ironman",
    issue: "#03",
    hero: "THE ARMORED FORGE",
    alias: "IRON MAN · TỰ TAY TÁI TẠO",
    archetype: "ĐỨNG LÊN TỪ ĐỐNG ĐỔ NÁT",
    quote:
      "“Bộ giáp mạnh nhất không phải thứ mua được bằng tiền, mà là thứ bạn tự tay gõ từng nhát búa trong hang tối.”",
    tagline: "MARK I FORGE · PHÁC THẢO ĐẦU TIÊN",
    image: appleSketch,
    accentBg: "bg-amber-500 text-black border-amber-600",
    accentText: "text-amber-400",
    icon: "⚡",
  },
  {
    id: "daredevil",
    issue: "#04",
    hero: "MAN WITHOUT FEAR",
    alias: "DAREDEVIL · MẤT MÁT & ÁNH SÁNG",
    archetype: "VƯỢT QUA KHIẾM KHUYẾT",
    quote:
      "“Khi một cánh cửa đóng lại trong bóng tối, giác quan thật sự bên trong bạn mới bắt đầu thức tỉnh.”",
    tagline: "HELL'S KITCHEN · ĐỘC HÀNH TÁI SINH",
    image: leavingCity,
    accentBg: "bg-rose-600 text-white border-rose-700",
    accentText: "text-rose-400",
    icon: "👁️",
  },
  {
    id: "joker",
    issue: "#05",
    hero: "THE CHAOS CLOWN",
    alias: "ANTI-HERO · ĐỐI DIỆN THẤT BẠI",
    archetype: "CƯỜI TRƯỚC SÓNG GIÓ",
    quote:
      "“Đời đã cho một cú tát đau điếng, việc của mình là đứng dậy và biến nó thành một màn biểu diễn để đời.”",
    tagline: "CARNIVAL NOIR · BẢN LĨNH TÁI SINH",
    image: heroCover,
    filter: "hue-rotate-180 saturate-150 contrast-125",
    accentBg: "bg-purple-600 text-white border-purple-400",
    accentText: "text-purple-400",
    icon: "🃏",
  },
];

export function HeroComicStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotation every 6 seconds, pauses when user hovers
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_CARDS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_CARDS.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_CARDS.length) % HERO_CARDS.length);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambience Glow */}
      <div className="absolute -inset-4 rounded-2xl bg-primary/15 blur-2xl opacity-70 pointer-events-none" />

      {/* 3D Stack Container */}
      <div className="relative h-[480px] sm:h-[510px] w-full perspective-[1200px]">
        {HERO_CARDS.map((card, idx) => {
          // Calculate relative position in stack (0 = top, 1 = behind right, 2 = behind left, etc.)
          const offset = (idx - activeIndex + HERO_CARDS.length) % HERO_CARDS.length;

          let styleTransform = "";
          let zIndex = 10;
          let opacity = 1;
          let pointerEvents: "auto" | "none" = "none";

          if (offset === 0) {
            // Front Active Card
            styleTransform = "translate3d(0px, 0px, 0px) rotate(0deg) scale(1)";
            zIndex = 30;
            opacity = 1;
            pointerEvents = "auto";
          } else if (offset === 1) {
            // Peeking Behind Right
            styleTransform = "translate3d(16px, -12px, -30px) rotate(3.5deg) scale(0.96)";
            zIndex = 20;
            opacity = 0.85;
            pointerEvents = "auto";
          } else if (offset === HERO_CARDS.length - 1) {
            // Peeking Behind Left
            styleTransform = "translate3d(-16px, -12px, -30px) rotate(-3.5deg) scale(0.96)";
            zIndex = 19;
            opacity = 0.85;
            pointerEvents = "auto";
          } else if (offset === 2) {
            // Deeper Behind Right
            styleTransform = "translate3d(24px, -22px, -60px) rotate(6deg) scale(0.92)";
            zIndex = 10;
            opacity = 0.55;
            pointerEvents = "auto";
          } else {
            // Deepest in stack
            styleTransform = "translate3d(0px, -28px, -90px) rotate(0deg) scale(0.88)";
            zIndex = 5;
            opacity = 0.25;
            pointerEvents = "none";
          }

          return (
            <div
              key={card.id}
              onClick={() => setActiveIndex(idx)}
              style={{
                transform: styleTransform,
                zIndex,
                opacity,
                pointerEvents,
              }}
              className={`comic-box absolute inset-0 overflow-hidden rounded-sm border-4 border-border bg-card transition-all duration-500 ease-out cursor-pointer ${
                offset === 0
                  ? "shadow-[8px_8px_0px_var(--comic-shadow)] ring-2 ring-primary/40"
                  : "hover:brightness-105"
              }`}
            >
              {/* Comic Book Top Header */}
              <div className="flex items-center justify-between border-b-2 border-border bg-primary px-3 py-1.5 text-primary-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg font-black tracking-wider text-black">
                    CMMD
                  </span>
                  <span className="font-display rounded bg-black px-1.5 py-0.5 text-[9px] font-black text-primary tracking-wider">
                    ISSUE {card.issue}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-black">
                  <span className="text-xs">{card.icon}</span>
                  <span className="font-display text-[10px] font-bold tracking-wider">
                    ORIGIN VARIANT
                  </span>
                </div>
              </div>

              {/* Artwork Container */}
              <div className="relative h-[calc(100%-42px)] w-full overflow-hidden bg-black/60">
                <img
                  src={card.image}
                  alt={card.hero}
                  className={`h-full w-full object-cover transition-transform duration-700 ${card.filter || ""}`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                {/* Top Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="font-display rounded border border-white/20 bg-black/80 px-2 py-0.5 text-[9px] font-bold text-white tracking-wider backdrop-blur-sm">
                    {card.hero}
                  </span>
                  <span className="font-display rounded border border-primary/40 bg-black/80 px-2 py-0.5 text-[9px] font-bold text-primary tracking-wider backdrop-blur-sm">
                    {card.archetype}
                  </span>
                </div>

                {/* Quote Box Overlay (Narrator Caption) */}
                <div className="absolute bottom-3 left-3 right-3 space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-sm border border-primary/60 bg-black/90 px-2 py-0.5 text-[10px] font-display font-bold tracking-wider text-primary shadow-sm backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                    <span>{card.tagline}</span>
                  </div>

                  <div className="rounded-sm border-l-4 border-primary bg-black/85 p-2.5 backdrop-blur-md shadow-md">
                    <p className="font-sans text-xs sm:text-[13px] font-medium text-white/95 leading-snug italic">
                      {card.quote}
                    </p>
                    <p className="font-display text-[10px] font-bold text-primary/90 mt-1 uppercase tracking-wider not-italic">
                      — {card.alias}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls & Character Selector */}
      <div className="mt-4 space-y-2.5">
        {/* Next / Prev Controls */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={prevCard}
            aria-label="Thẻ trước"
            className="comic-box flex h-7 w-7 items-center justify-center rounded-sm bg-card text-foreground hover:bg-primary hover:text-black transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 font-display text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            <span>THẺ ANH HÙNG</span>
            <span className="text-primary font-black">{HERO_CARDS[activeIndex]?.issue ?? "#01"} / #05</span>
          </div>

          <button
            type="button"
            onClick={nextCard}
            aria-label="Thẻ kế tiếp"
            className="comic-box flex h-7 w-7 items-center justify-center rounded-sm bg-card text-foreground hover:bg-primary hover:text-black transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 5 Hero Quick Select Pills */}
        <div className="flex items-center justify-center gap-1.5">
          {HERO_CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              title={card.hero}
              className={`comic-box font-display flex items-center gap-1 rounded-sm px-2 py-1 text-[11px] font-bold tracking-wider transition-all ${
                i === activeIndex
                  ? "bg-primary text-black scale-105 shadow-[2px_2px_0px_var(--comic-shadow)]"
                  : "bg-card text-muted-foreground hover:text-foreground hover:border-primary"
              }`}
            >
              <span>{card.icon}</span>
              <span className="hidden sm:inline">
                {card.id === "batman"
                  ? "BATMAN"
                  : card.id === "spiderman"
                    ? "SPIDEY"
                    : card.id === "ironman"
                      ? "IRON MAN"
                      : card.id === "daredevil"
                        ? "DAREDEVIL"
                        : "JOKER"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
