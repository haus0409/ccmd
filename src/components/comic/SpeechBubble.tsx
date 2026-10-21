import type { Bubble } from "@/types/journey";

/** Renders authentic DC/Marvel comic narration boxes, speech bubbles, thought bubbles, and action SFX. */
export function SpeechBubble({
  bubble,
  selected,
  onClick,
}: {
  bubble: Bubble;
  selected?: boolean;
  onClick?: () => void;
}) {
  // Classic comic caption vs dialogue bubble vs action SFX
  const isNarration = bubble.type === "narration";
  const isThought = bubble.type === "thought";
  const isAction = bubble.type === "action";

  const shapeClass = isAction
    ? "border-4 border-border -rotate-6 shadow-[5px_5px_0px_var(--comic-shadow)] scale-105"
    : isNarration
      ? "border-2 border-border rounded-none shadow-[3px_3px_0px_var(--comic-shadow)]"
      : isThought
        ? "border-2 border-dashed border-primary rounded-2xl shadow-[3px_3px_0px_var(--comic-shadow)]"
        : "border-2 border-border rounded-md shadow-[3px_3px_0px_var(--comic-shadow)]";

  const defaultBg = isAction
    ? "#FF2B4E"
    : isNarration
      ? "#FACC15"
      : isThought
        ? "#131722"
        : "#FFFFFF";
  const defaultColor = isAction
    ? "#FACC15"
    : isNarration
      ? "#000000"
      : isThought
        ? "#F0F4FC"
        : "#0A0D14";

  return (
    <div
      onClick={onClick}
      className={`relative max-w-[90%] px-3.5 py-2 transition-transform ${shapeClass} ${
        onClick ? "cursor-pointer hover:scale-[1.05]" : ""
      } ${selected ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
      style={{
        color: bubble.color || defaultColor,
        background: bubble.background || defaultBg,
        fontSize: `${bubble.fontSize || (isAction ? 22 : 14)}px`,
        textAlign: bubble.align || (isAction ? "center" : "left"),
      }}
    >
      {/* Content */}
      {isAction ? (
        <span className="font-comic tracking-widest uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] inline-block font-black">
          {bubble.text}
        </span>
      ) : isNarration ? (
        <span className="font-display font-bold uppercase tracking-wider text-[13px] leading-snug">
          {bubble.text}
        </span>
      ) : (
        <span className="font-sans font-semibold leading-relaxed">{bubble.text}</span>
      )}

      {/* Speech Pointer / Tail */}
      {bubble.type === "speech" && (
        <span
          className="absolute -bottom-2 left-5 h-3 w-3 rotate-45 border-r-2 border-b-2 border-border"
          style={{ background: bubble.background || defaultBg }}
        />
      )}

      {/* Thought tail bubbles */}
      {bubble.type === "thought" && (
        <>
          <span
            className="absolute -bottom-2 left-6 h-2 w-2 rounded-full border border-primary"
            style={{ background: bubble.background || defaultBg }}
          />
          <span
            className="absolute -bottom-4 left-4 h-1.5 w-1.5 rounded-full border border-primary"
            style={{ background: bubble.background || defaultBg }}
          />
        </>
      )}
    </div>
  );
}
