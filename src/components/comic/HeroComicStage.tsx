import { Sparkles, Volume2, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import batmanMotion from "@/assets/motion-test/batman-motion.webp";
import daredevilMotion from "@/assets/motion-test/daredevil-motion.webp";
import ironmanMotion from "@/assets/motion-test/ironman-motion.webp";
import jokerMotion from "@/assets/motion-test/joker-motion.webp";
import spidermanMotion from "@/assets/motion-test/spiderman-motion.webp";

export interface HeroStageData {
  id: string;
  issue: string;
  hero: string;
  alias: string;
  signatureAction: string;
  sfx: string;
  sfxColor: string;
  greeting: string;
  quote: string;
  archetype: string;
  image: string;
  filter?: string;
  icon: string;
  accent: string;
}

export const HERO_STAGES: HeroStageData[] = [
  {
    id: "batman",
    issue: "#01",
    hero: "BATMAN",
    alias: "Bruce Wayne",
    signatureAction: "Bay qua màn mưa Gotham và đáp xuống mỏm đá...",
    sfx: "*SWOOSH!*",
    sfxColor: "bg-amber-400 text-black border-amber-600",
    greeting: "Này bạn... nghe tôi nói điều này:",
    quote: "“Dưới đáy vực sâu nhất, mình mới học được cách leo lên mà không cần dây bảo hộ.”",
    archetype: "CHẠM ĐÁY & TÁI SINH",
    image: batmanMotion,
    icon: "🦇",
    accent: "text-amber-400 border-amber-400",
  },
  {
    id: "spiderman",
    issue: "#02",
    hero: "SPIDER-MAN",
    alias: "Peter Parker",
    signatureAction: "Bắn tơ lộn nhào qua ngõ hẻm Queens...",
    sfx: "*THWIP!*",
    sfxColor: "bg-red-500 text-white border-red-700",
    greeting: "Chào người anh em! Bạn ổn chứ?",
    quote:
      "“Ai cũng thấy lúc mình bay lượn trên cao, chẳng ai thấy những lần mình đập mặt vào tường gạch cả...”",
    archetype: "ÁP LỰC & TRƯỞNG THÀNH",
    image: spidermanMotion,
    icon: "🕷️",
    accent: "text-red-400 border-red-400",
  },
  {
    id: "ironman",
    issue: "#03",
    hero: "IRON MAN",
    alias: "Tony Stark",
    signatureAction: "Kích hoạt lò phản ứng hồ quang và đáp đất...",
    sfx: "*CLANG-BOOM!*",
    sfxColor: "bg-amber-500 text-black border-amber-700",
    greeting: "Nhìn tôi đây này... nhớ lấy điều này:",
    quote:
      "“Bộ giáp mạnh nhất không phải thứ mua được bằng tiền, mà là thứ bạn tự tay gõ từng nhát búa trong hang tối.”",
    archetype: "TỰ TAY TÁI TẠO",
    image: ironmanMotion,
    icon: "⚡",
    accent: "text-amber-400 border-amber-400",
  },
  {
    id: "daredevil",
    issue: "#04",
    hero: "DAREDEVIL",
    alias: "Matt Murdock",
    signatureAction: "Lắng nghe nhịp tim thành phố trong đêm tĩnh mịch...",
    sfx: "*RADAR-PING!*",
    sfxColor: "bg-rose-600 text-white border-rose-800",
    greeting: "Tôi biết bạn đang thấy tăm tối, nhưng...",
    quote:
      "“Khi một cánh cửa đóng lại trong bóng tối, giác quan thật sự bên trong bạn mới bắt đầu thức tỉnh.”",
    archetype: "MẤT MÁT & ÁNH SÁNG",
    image: daredevilMotion,
    icon: "👁️",
    accent: "text-rose-400 border-rose-400",
  },
  {
    id: "joker",
    issue: "#05",
    hero: "ANTI-HERO",
    alias: "The Joker",
    signatureAction: "Cười lớn và bước ra giữa vũ đài hỗn loạn...",
    sfx: "*HA-HA-HA!*",
    sfxColor: "bg-purple-600 text-white border-purple-400",
    greeting: "Chào buổi tối, người bạn đồng hành!",
    quote:
      "“Đời đã cho một cú tát đau điếng, việc của mình là đứng dậy và biến nó thành một màn biểu diễn để đời.”",
    archetype: "CƯỜI TRƯỚC SÓNG GIÓ",
    image: jokerMotion,
    icon: "🃏",
    accent: "text-purple-400 border-purple-400",
  },
];

export function HeroComicStage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);

  const hero = HERO_STAGES[currentIdx] ?? HERO_STAGES[0]!;
  const DURATION = 8000; // 8s per hero
  const TICK = 100;

  // Auto-run loop with timeline progression
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) {
          setCurrentIdx((c) => (c + 1) % HERO_STAGES.length);
          return 0;
        }
        return prev + (TICK / DURATION) * 100;
      });
    }, TICK);

    return () => clearInterval(timer);
  }, [isPaused, currentIdx]);

  const selectHero = (idx: number) => {
    setCurrentIdx(idx);
    setStageProgress(0);
  };

  const nextHero = () => {
    selectHero((currentIdx + 1) % HERO_STAGES.length);
  };

  const prevHero = () => {
    selectHero((currentIdx - 1 + HERO_STAGES.length) % HERO_STAGES.length);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[360px] sm:max-w-[410px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dramatic Comic Ambience Glow */}
      <div className="absolute -inset-3 rounded-xl bg-primary/20 blur-xl opacity-70 pointer-events-none" />

      {/* Main Comic Stage Box */}
      <div className="comic-box relative overflow-hidden rounded-sm border-4 border-border bg-card shadow-[8px_8px_0px_var(--comic-shadow)]">
        {/* Top Comic Book Header */}
        <div className="flex items-center justify-between border-b-2 border-border bg-primary px-3 py-1.5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-black tracking-wider text-black">CMMD</span>
            <span className="font-display rounded bg-black px-1.5 py-0.5 text-[9px] font-black text-primary tracking-wider">
              ISSUE {hero.issue}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-black">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            <span className="font-display text-[10px] font-black tracking-wider uppercase">
              LIVE BROADCAST
            </span>
          </div>
        </div>

        {/* Stage Viewport */}
        <div className="relative h-[460px] sm:h-[500px] w-full overflow-hidden bg-black">
          {/* Hero Real Motion Clip */}
          <img
            key={hero.id}
            src={hero.image}
            alt={hero.hero}
            className={`h-full w-full object-cover ${hero.filter || ""}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Top Stage Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-10">
            <div className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 bg-black/85 px-2 py-0.5 text-[10px] font-display font-bold text-white backdrop-blur-md">
              <span>{hero.icon}</span>
              <span className="tracking-wider uppercase">{hero.hero}</span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-sm border border-primary/50 bg-black/85 px-2 py-0.5 text-[9px] font-display font-bold text-primary tracking-wider backdrop-blur-md uppercase">
              <span>{hero.archetype}</span>
            </div>
          </div>

          {/* ACT 1: Dynamic Comic SFX Burst (Punchy & Compact) */}
          <div className="absolute top-12 right-2.5 z-10 transition-all duration-300">
            <div
              className={`comic-box inline-block rotate-6 rounded px-2 py-0.5 font-display text-[11px] font-black tracking-widest uppercase shadow-[3px_3px_0px_#000] animate-pulse ${hero.sfxColor}`}
            >
              {hero.sfx}
            </div>
          </div>

          {/* ACT 2 & 3: Direct Eye-Contact Greeting & Sleek Comic Speech Bubble */}
          <div className="absolute bottom-3 left-3 right-3 space-y-1.5 z-10">
            {/* Greeting Pill */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-black/85 px-2 py-0.5 text-[10px] font-display font-bold text-primary border border-primary/40 backdrop-blur-md shadow-sm">
                <Volume2 className="h-3 w-3 animate-bounce" />
                <span>{hero.hero}:</span>
                <span className="text-white/90 font-normal italic font-sans">{hero.greeting}</span>
              </span>
            </div>

            {/* Authentic Comic Speech Bubble */}
            <div className="relative rounded-sm border-2 border-black bg-amber-50/95 dark:bg-card/95 backdrop-blur-md p-2.5 shadow-[5px_5px_0px_var(--comic-shadow)]">
              {/* Speech Tail pointing toward character */}
              <div className="absolute -top-1.5 left-7 h-2.5 w-2.5 rotate-45 border-l-2 border-t-2 border-black bg-amber-50 dark:bg-card" />

              <p className="font-sans text-xs sm:text-[13px] font-semibold text-stone-900 dark:text-foreground leading-snug">
                {hero.quote}
              </p>

              <div className="mt-1.5 flex items-center justify-between border-t border-border/50 pt-1 text-[10px]">
                <span className="font-display font-bold uppercase tracking-wider text-muted-foreground">
                  — {hero.alias}
                </span>
                <span className="font-display font-bold text-accent tracking-wider">
                  ORIGIN SAGA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Step Segmented Progress Bar (Cinematic Storyline Tracker) */}
        <div className="grid grid-cols-5 gap-1 border-t-2 border-border bg-card p-1.5">
          {HERO_STAGES.map((h, i) => (
            <div
              key={h.id}
              onClick={() => selectHero(i)}
              className="h-1.5 rounded-full bg-border overflow-hidden cursor-pointer"
              title={`Xem ${h.hero}`}
            >
              <div
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{
                  width: i < currentIdx ? "100%" : i === currentIdx ? `${stageProgress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stage Bottom Helper & Direct Selectors */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-display font-medium">
          {isPaused ? (
            <span className="inline-flex items-center gap-1 text-primary font-bold">
              <Pause className="h-3 w-3" /> ĐÃ TẠM DỪNG (ĐỂ BẠN ĐỌC)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Play className="h-3 w-3 text-primary animate-pulse" /> TỰ ĐỘNG CHUYỂN (RÊ CHUỘT ĐỂ
              DỪNG)
            </span>
          )}
        </div>

        {/* Quick Hero Selectors */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevHero}
            className="comic-box p-1 text-foreground hover:bg-primary hover:text-black transition-colors"
            aria-label="Nhân vật trước"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={nextHero}
            className="comic-box p-1 text-foreground hover:bg-primary hover:text-black transition-colors"
            aria-label="Nhân vật kế tiếp"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
