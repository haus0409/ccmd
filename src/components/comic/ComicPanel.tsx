import { Sparkles } from "lucide-react";
import type { Panel } from "@/types/journey";
import { SpeechBubble } from "./SpeechBubble";

const aspect = { wide: "aspect-[16/9]", square: "aspect-square", tall: "aspect-[3/4]" };
const pos = { top: "justify-start", center: "justify-center", bottom: "justify-end" };

interface Props {
  panel: Panel;
  selectedBubbleId?: string | null;
  onSelectBubble?: (id: string) => void;
  onPickImage?: () => void;
}

export function ComicPanel({ panel, selectedBubbleId, onSelectBubble, onPickImage }: Props) {
  return (
    <figure className={panel.layout === "wide" ? "col-span-2" : "col-span-2 sm:col-span-1"}>
      <div
        className={`comic-box relative overflow-hidden rounded-sm border-4 border-border bg-card/60 shadow-[5px_5px_0px_var(--comic-shadow)] ${aspect[panel.layout]}`}
      >
        {panel.imageUrl ? (
          <img
            src={panel.imageUrl}
            alt={panel.caption || "Khung truyện"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="placeholder-art absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="h-6 w-6 text-primary/70 mb-2" />
            <span className="font-display font-bold text-xs text-primary tracking-wider uppercase">
              16-BIT COMIC CANVAS
            </span>
            {onPickImage ? (
              <button
                onClick={onPickImage}
                className="comic-box font-display mt-3 rounded-sm bg-primary px-3 py-1.5 text-[10px] font-bold tracking-wider text-primary-foreground hover:brightness-110 active:scale-95"
              >
                + THÊM HÌNH ẢNH
              </button>
            ) : (
              <span className="font-sans text-xs text-muted-foreground mt-1">
                Tranh minh hoạ sẽ xuất hiện tại đây
              </span>
            )}
          </div>
        )}

        {/* Bubbles Overlay */}
        {(["top", "center", "bottom"] as const).map((p) => {
          const items = panel.bubbles.filter((b) => b.position === p);
          if (!items.length) return null;
          return (
            <div
              key={p}
              className={`pointer-events-none absolute inset-0 flex flex-col gap-2 p-4 ${pos[p]} items-start z-10`}
            >
              {items.map((b) => (
                <div key={b.id} className="pointer-events-auto">
                  <SpeechBubble
                    bubble={b}
                    selected={selectedBubbleId === b.id}
                    onClick={onSelectBubble ? () => onSelectBubble(b.id) : undefined}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {panel.caption && (
        <figcaption className="mt-2.5 flex items-center gap-2 border-l-4 border-primary bg-card/60 px-3 py-1.5 text-xs font-sans italic text-foreground/90">
          <span className="font-display font-bold text-[10px] not-italic text-primary uppercase">
            Ghi chú:
          </span>
          {panel.caption}
        </figcaption>
      )}
    </figure>
  );
}
