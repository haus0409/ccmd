import type { Bubble } from "@/types/journey";

/** Renders speech, thought or narration. Colors come from user data, hence inline style. */
export function SpeechBubble({ bubble, selected, onClick }: { bubble: Bubble; selected?: boolean; onClick?: () => void }) {
  const shape =
    bubble.type === "narration"
      ? "rounded-sm border-2 border-primary"
      : bubble.type === "thought"
        ? "rounded-[2rem] border-2 border-dashed border-primary"
        : "rounded-2xl border-2 border-primary";
  return (
    <div
      onClick={onClick}
      className={`relative max-w-[85%] px-4 py-2 shadow-soft ${shape} ${onClick ? "cursor-pointer" : ""} ${
        selected ? "ring-2 ring-accent ring-offset-2" : ""
      }`}
      style={{ color: bubble.color, background: bubble.background, fontSize: bubble.fontSize, textAlign: bubble.align }}
    >
      {bubble.type === "narration" ? <span className="font-display italic">{bubble.text}</span> : bubble.text}
      {bubble.type === "speech" && (
        <span
          className="absolute -bottom-2 left-6 h-3 w-3 rotate-45 border-r-2 border-b-2 border-primary"
          style={{ background: bubble.background }}
        />
      )}
    </div>
  );
}
