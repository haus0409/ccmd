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
      <div className={`relative overflow-hidden rounded-md border-2 border-primary bg-card ${aspect[panel.layout]}`}>
        {panel.imageUrl ? (
          <img src={panel.imageUrl} alt={panel.caption} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="placeholder-art absolute inset-2 flex items-center justify-center rounded-sm">
            {onPickImage ? (
              <button onClick={onPickImage} className="rounded-md border bg-card px-3 py-1 text-xs text-muted-foreground">
                Thêm ảnh sau
              </button>
            ) : (
              <span className="text-xs text-muted-foreground">Tranh minh hoạ sẽ được thêm sau</span>
            )}
          </div>
        )}
        {(["top", "center", "bottom"] as const).map((p) => {
          const items = panel.bubbles.filter((b) => b.position === p);
          if (!items.length) return null;
          return (
            <div
              key={p}
              className={`pointer-events-none absolute inset-0 flex flex-col gap-2 p-4 ${pos[p]} items-start`}
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
      {panel.caption && <figcaption className="mt-2 text-sm italic text-muted-foreground">{panel.caption}</figcaption>}
    </figure>
  );
}
