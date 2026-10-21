import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  MessageCircle,
  Pencil,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  BUBBLE_LABEL,
  CATEGORIES,
  STATUS_LABEL,
  type Bubble,
  type BubbleType,
  type Chapter,
  type Journey,
  type Panel,
} from "@/types/journey";
import { makeBubble, makeChapter, makePanel } from "@/data/sampleJourneys";
import { ComicPanel } from "./ComicPanel";
import { CoverPlaceholder } from "@/components/journeys/JourneyCard";
import { Button } from "@/components/ui/button";

interface Props {
  initial: Journey;
  onSave: (j: Journey) => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
    {children}
  </span>
);

export function validateJourney(j: Journey, forPublish: boolean): string[] {
  const errs: string[] = [];
  if (!j.title.trim()) errs.push("Hãy đặt tên cho hành trình.");
  if (forPublish) {
    if (!j.description.trim()) errs.push("Cần một đoạn mô tả ngắn trước khi xuất bản.");
    if (j.chapters.length === 0) errs.push("Hành trình cần ít nhất một chương.");
    if (j.chapters.some((c) => !c.title.trim())) errs.push("Mọi chương đều cần có tên.");
  }
  return errs;
}

export function ComicEditor({ initial, onSave }: Props) {
  const [j, setJ] = useState<Journey>(initial);
  const [activeId, setActiveId] = useState(initial.chapters[0]?.id ?? null);
  const [sel, setSel] = useState<{ panelId: string; bubbleId: string } | null>(null);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const chapter = j.chapters.find((c) => c.id === activeId) ?? null;
  const set = (patch: Partial<Journey>) => setJ((x) => ({ ...x, ...patch }));
  const updateChapter = (id: string, patch: Partial<Chapter>) =>
    setJ((x) => ({
      ...x,
      chapters: x.chapters.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  const updatePanels = (fn: (p: Panel[]) => Panel[]) =>
    chapter && updateChapter(chapter.id, { panels: fn(chapter.panels) });
  const updatePanel = (pid: string, patch: Partial<Panel>) =>
    updatePanels((ps) => ps.map((p) => (p.id === pid ? { ...p, ...patch } : p)));
  const updateBubble = (pid: string, bid: string, patch: Partial<Bubble>) =>
    updatePanels((ps) =>
      ps.map((p) =>
        p.id === pid
          ? { ...p, bubbles: p.bubbles.map((b) => (b.id === bid ? { ...b, ...patch } : b)) }
          : p,
      ),
    );

  const addChapter = () => {
    const c = makeChapter(j.chapters.length + 1);
    set({ chapters: [...j.chapters, c] });
    setActiveId(c.id);
  };
  const deleteChapter = (id: string) => {
    if (!confirm("Xoá chương này? Hành động không thể hoàn tác.")) return;
    const rest = j.chapters.filter((c) => c.id !== id);
    set({ chapters: rest });
    if (activeId === id) setActiveId(rest[0]?.id ?? null);
  };
  const moveChapter = (i: number, d: -1 | 1) => {
    const arr = [...j.chapters];
    const t = i + d;
    if (t < 0 || t >= arr.length) return;
    [arr[i], arr[t]] = [arr[t], arr[i]];
    set({ chapters: arr });
  };

  const addBubble = (pid: string, type: BubbleType) => {
    const b = makeBubble(type);
    updatePanels((ps) => ps.map((p) => (p.id === pid ? { ...p, bubbles: [...p.bubbles, b] } : p)));
    setSel({ panelId: pid, bubbleId: b.id });
  };
  const removeBubble = (pid: string, bid: string) => {
    updatePanels((ps) =>
      ps.map((p) => (p.id === pid ? { ...p, bubbles: p.bubbles.filter((b) => b.id !== bid) } : p)),
    );
    setSel(null);
  };

  const save = (publish: boolean) => {
    const errs = validateJourney(j, publish);
    setErrors(errs);
    if (errs.length) {
      toast.error("Còn vài chỗ cần hoàn thiện");
      return;
    }
    const next = { ...j, published: publish ? true : j.published };
    setJ(next);
    onSave(next);
    toast.success(publish ? "Đã xuất bản hành trình" : "Đã lưu bản nháp");
  };

  const selBubble =
    sel &&
    chapter?.panels.find((p) => p.id === sel.panelId)?.bubbles.find((b) => b.id === sel.bubbleId);

  return (
    <div className="space-y-8">
      {/* Actions */}
      <div className="comic-box sticky top-[60px] z-30 flex flex-wrap items-center gap-2.5 rounded-sm bg-background/95 p-3 backdrop-blur-md">
        <div className="mr-auto flex items-center gap-2">
          <span className="font-pixel rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
            {j.published ? "ĐÃ XUẤT BẢN" : "BẢN NHÁP"}
          </span>
          <span className="font-pixel text-[10px] text-muted-foreground">
            · {j.privacy === "public" ? "CÔNG KHAI" : "RIÊNG TƯ"}
          </span>
        </div>
        {preview ? (
          <button
            onClick={() => setPreview(false)}
            className="comic-box font-pixel inline-flex items-center gap-1.5 rounded-sm bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary"
          >
            <Pencil className="h-3.5 w-3.5" /> QUAY LẠI SỬA
          </button>
        ) : (
          <button
            onClick={() => setPreview(true)}
            disabled={!chapter}
            className="comic-box font-pixel inline-flex items-center gap-1.5 rounded-sm bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary disabled:opacity-50"
          >
            <Eye className="h-3.5 w-3.5" /> XEM TRƯỚC
          </button>
        )}
        <button
          onClick={() => save(false)}
          className="comic-box font-pixel inline-flex items-center gap-1.5 rounded-sm bg-card px-3.5 py-1.5 text-xs font-bold text-foreground hover:border-primary"
        >
          <Save className="h-3.5 w-3.5" /> LƯU NHÁP
        </button>
        <button
          onClick={() => save(true)}
          className="comic-box font-pixel inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 active:scale-95"
        >
          <Send className="h-3.5 w-3.5" /> XUẤT BẢN
        </button>
      </div>

      {errors.length > 0 && (
        <ul className="rounded-lg border border-destructive/40 bg-card p-4 text-sm text-destructive">
          {errors.map((e) => (
            <li key={e}>• {e}</li>
          ))}
        </ul>
      )}

      {preview && chapter ? (
        <article className="comic-box mx-auto max-w-4xl rounded-sm border-2 border-primary/40 bg-card p-6 md:p-8 shadow-[6px_6px_0px_var(--comic-shadow)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <span className="font-pixel text-[11px] uppercase tracking-wider text-primary">
                CMMD ARCHIVES · {chapter.date || "HÔM NAY"}
              </span>
              <h2 className="font-comic text-4xl md:text-5xl tracking-wide uppercase text-primary drop-shadow-[2px_2px_0px_var(--comic-shadow)] mt-1">
                {chapter.title || "TẬP TRUYỆN MỚI"}
              </h2>
            </div>
            <span className="comic-badge font-pixel text-xs bg-primary/20 text-primary border-primary">
              {chapter.panels.length} KHUNG TRANH
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {chapter.panels.map((p) => (
              <ComicPanel key={p.id} panel={p} />
            ))}
          </div>
        </article>
      ) : (
        <>
          {/* A. Settings */}
          <section className="grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-[1fr_240px]">
            <div className="space-y-4">
              <label className="block">
                <Label>Tên hành trình *</Label>
                <input
                  className="input-field"
                  value={j.title}
                  onChange={(e) => set({ title: e.target.value })}
                  placeholder="Ví dụ: Cách mà mình đã học bơi"
                />
              </label>
              <label className="block">
                <Label>Mô tả</Label>
                <textarea
                  className="input-field min-h-24"
                  value={j.description}
                  onChange={(e) => set({ description: e.target.value })}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label>
                  <Label>Chủ đề</Label>
                  <select
                    className="input-field"
                    value={j.category}
                    onChange={(e) => set({ category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <Label>Quyền riêng tư</Label>
                  <select
                    className="input-field"
                    value={j.privacy}
                    onChange={(e) => set({ privacy: e.target.value as Journey["privacy"] })}
                  >
                    <option value="private">Riêng tư</option>
                    <option value="public">Công khai</option>
                  </select>
                </label>
                <label>
                  <Label>Trạng thái</Label>
                  <select
                    className="input-field"
                    value={j.status}
                    onChange={(e) => set({ status: e.target.value as Journey["status"] })}
                  >
                    {Object.entries(STATUS_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Ảnh bìa</Label>
              <CoverPlaceholder label={j.coverLabel} imageUrl={j.coverImage} />
              <input
                className="input-field text-xs font-pixel"
                value={j.coverImage || ""}
                onChange={(e) => set({ coverImage: e.target.value })}
                placeholder="URL hình ảnh bìa (hoặc chọn bên dưới)"
              />
              <div className="flex flex-wrap gap-1.5 text-[10px] font-pixel">
                <button
                  type="button"
                  onClick={() => set({ coverImage: "/hero-cover.jpg" })}
                  className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                >
                  Bìa Gotham
                </button>
                <button
                  type="button"
                  onClick={() => set({ coverImage: "/apple-sketch.jpg" })}
                  className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                >
                  Bìa Phác Thảo
                </button>
                <button
                  type="button"
                  onClick={() => set({ coverImage: "/failed-exam.jpg" })}
                  className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                >
                  Bìa Nocturne
                </button>
                <button
                  type="button"
                  onClick={() => set({ coverImage: "/leaving-city.jpg" })}
                  className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                >
                  Bìa Rời Phố
                </button>
              </div>
              <input
                className="input-field text-xs"
                value={j.coverLabel}
                onChange={(e) => set({ coverLabel: e.target.value })}
                placeholder="Ghi chú ảnh bìa"
              />
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr_280px]">
            {/* B. Chapters */}
            <aside className="comic-box space-y-2 rounded-sm bg-card p-4 h-fit">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-pixel text-xs font-bold text-primary uppercase">CÁC CHƯƠNG</h3>
                <button
                  onClick={addChapter}
                  className="comic-box font-pixel flex items-center gap-1 rounded bg-primary px-2 py-1 text-[10px] font-bold text-black"
                >
                  <Plus className="h-3 w-3" /> THÊM
                </button>
              </div>
              {j.chapters.length === 0 && (
                <p className="font-pixel text-[11px] text-muted-foreground py-2">
                  Chưa có chương nào.
                </p>
              )}
              {j.chapters.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-1 rounded-sm border p-2 text-xs ${
                    c.id === activeId
                      ? "border-primary bg-secondary/80 font-bold"
                      : "border-border bg-card"
                  }`}
                >
                  <button
                    className="flex-1 truncate text-left"
                    onClick={() => {
                      setActiveId(c.id);
                      setSel(null);
                    }}
                  >
                    #{i + 1}. {c.title || "(chưa đặt tên)"}
                  </button>
                  <button
                    aria-label="Lên"
                    onClick={() => moveChapter(i, -1)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Xuống"
                    onClick={() => moveChapter(i, 1)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Xoá chương"
                    onClick={() => deleteChapter(c.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </aside>

            {/* C. Panels */}
            <section className="space-y-6">
              {!chapter ? (
                <div className="comic-box rounded-sm bg-card p-10 text-center font-pixel text-xs text-muted-foreground">
                  Thêm một chương để bắt đầu kể chuyện.
                </div>
              ) : (
                <>
                  <div className="comic-box grid gap-4 rounded-sm bg-card p-4 sm:grid-cols-[1fr_180px]">
                    <label>
                      <Label>Tên chương *</Label>
                      <input
                        className="input-field"
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                      />
                    </label>
                    <label>
                      <Label>Ngày ghi nhận</Label>
                      <input
                        type="date"
                        className="input-field font-pixel text-xs"
                        value={chapter.date}
                        onChange={(e) => updateChapter(chapter.id, { date: e.target.value })}
                      />
                    </label>
                  </div>

                  {chapter.panels.map((p, i) => (
                    <div key={p.id} className="comic-box space-y-3 rounded-sm bg-card p-4">
                      <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-2">
                        <span className="font-pixel mr-auto text-xs font-bold text-primary">
                          KHUNG TRANH #{i + 1}
                        </span>
                        <select
                          className="input-field w-auto py-1 font-pixel text-[11px]"
                          value={p.layout}
                          onChange={(e) =>
                            updatePanel(p.id, { layout: e.target.value as Panel["layout"] })
                          }
                        >
                          <option value="wide">NGANG (WIDE)</option>
                          <option value="square">VUÔNG (SQUARE)</option>
                          <option value="tall">DỌC (TALL)</option>
                        </select>
                        <button
                          className="font-pixel flex items-center gap-1 text-[11px] text-destructive hover:underline"
                          onClick={() => {
                            if (confirm("Xoá khung tranh này?"))
                              updatePanels((ps) => ps.filter((x) => x.id !== p.id));
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> XOÁ KHUNG
                        </button>
                      </div>

                      {/* Comic Panel Preview */}
                      <div className="w-full">
                        <ComicPanel
                          panel={{ ...p, layout: p.layout }}
                          selectedBubbleId={sel?.panelId === p.id ? sel.bubbleId : null}
                          onSelectBubble={(bid) => setSel({ panelId: p.id, bubbleId: bid })}
                          onPickImage={() => {
                            const url = prompt(
                              "Nhập đường dẫn ảnh cho khung này:",
                              "/apple-sketch.jpg",
                            );
                            if (url) updatePanel(p.id, { imageUrl: url });
                          }}
                        />
                      </div>

                      {/* Image URL input & Quick Presets */}
                      <div className="space-y-1.5">
                        <Label>URL Tranh minh hoạ khung này</Label>
                        <input
                          className="input-field text-xs font-pixel"
                          placeholder="Ví dụ: /apple-sketch.jpg hoặc link ảnh trên mạng"
                          value={p.imageUrl || ""}
                          onChange={(e) => updatePanel(p.id, { imageUrl: e.target.value })}
                        />
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-pixel">
                          <span className="text-muted-foreground mr-0.5">Tranh mẫu:</span>
                          <button
                            type="button"
                            onClick={() => updatePanel(p.id, { imageUrl: "/hero-cover.jpg" })}
                            className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                          >
                            Gotham
                          </button>
                          <button
                            type="button"
                            onClick={() => updatePanel(p.id, { imageUrl: "/apple-sketch.jpg" })}
                            className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                          >
                            Bàn vẽ
                          </button>
                          <button
                            type="button"
                            onClick={() => updatePanel(p.id, { imageUrl: "/failed-exam.jpg" })}
                            className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                          >
                            Hẻm mưa
                          </button>
                          <button
                            type="button"
                            onClick={() => updatePanel(p.id, { imageUrl: "/leaving-city.jpg" })}
                            className="rounded border border-border px-2 py-0.5 hover:border-primary text-muted-foreground hover:text-primary"
                          >
                            Rời phố
                          </button>
                        </div>
                      </div>

                      <input
                        className="input-field text-xs"
                        placeholder="Chú thích dưới khung truyện (tuỳ chọn)"
                        value={p.caption}
                        onChange={(e) => updatePanel(p.id, { caption: e.target.value })}
                      />

                      {/* Add Bubble buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {(["speech", "thought", "narration", "action"] as BubbleType[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`comic-box font-pixel inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] font-bold ${
                              t === "action"
                                ? "bg-accent text-white hover:bg-red-600"
                                : t === "narration"
                                  ? "bg-primary text-black hover:bg-yellow-400"
                                  : "bg-secondary text-foreground hover:border-primary hover:text-primary"
                            }`}
                            onClick={() => addBubble(p.id, t)}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />{" "}
                            {BUBBLE_LABEL[t].toUpperCase()}
                          </button>
                        ))}
                      </div>

                      {p.bubbles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.bubbles.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSel({ panelId: p.id, bubbleId: b.id })}
                              className={`comic-badge rounded px-2 py-1 text-[10px] ${
                                sel?.bubbleId === b.id
                                  ? "border-primary bg-primary text-black"
                                  : "border-border bg-card text-muted-foreground"
                              }`}
                            >
                              {BUBBLE_LABEL[b.type]}: {b.text.slice(0, 16)}...
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    className="comic-box font-pixel flex w-full items-center justify-center gap-2 rounded-sm bg-secondary py-3 text-xs font-bold text-primary hover:bg-primary hover:text-black"
                    onClick={() => updatePanels((ps) => [...ps, makePanel()])}
                  >
                    <Plus className="h-4 w-4" /> THÊM KHUNG TRANH MỚI
                  </button>
                </>
              )}
            </section>

            {/* D. Bubble properties */}
            <aside className="h-fit space-y-3 rounded-xl border bg-card p-4 lg:sticky lg:top-36">
              <h3 className="font-semibold">Thuộc tính chữ</h3>
              {!selBubble || !sel ? (
                <p className="text-sm text-muted-foreground">
                  Chọn một bong bóng thoại trong khung để chỉnh sửa.
                </p>
              ) : (
                <BubbleProps
                  bubble={selBubble}
                  onChange={(patch) => updateBubble(sel.panelId, sel.bubbleId, patch)}
                  onRemove={() => removeBubble(sel.panelId, sel.bubbleId)}
                />
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function BubbleProps({
  bubble,
  onChange,
  onRemove,
}: {
  bubble: Bubble;
  onChange: (p: Partial<Bubble>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-3 text-sm">
      <label className="block">
        <Label>Nội dung</Label>
        <textarea
          className="input-field min-h-20"
          value={bubble.text}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>
      {bubble.type === "action" && (
        <div className="space-y-1">
          <Label>Mẫu âm thanh hành động (SFX)</Label>
          <div className="flex flex-wrap gap-1 font-comic text-sm">
            {["POW!", "BOOM!", "WHAM!", "CRASH!", "KABOOM!", "ZAP!", "SLAM!"].map((sfx) => (
              <button
                key={sfx}
                type="button"
                onClick={() => onChange({ text: sfx })}
                className="rounded border border-accent bg-accent/20 px-2 py-0.5 text-accent hover:bg-accent hover:text-white"
              >
                {sfx}
              </button>
            ))}
          </div>
        </div>
      )}
      <label className="block">
        <Label>Loại</Label>
        <select
          className="input-field"
          value={bubble.type}
          onChange={(e) => onChange({ type: e.target.value as BubbleType })}
        >
          {Object.entries(BUBBLE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <Label>Cỡ chữ: {bubble.fontSize}px</Label>
        <input
          type="range"
          min={11}
          max={28}
          value={bubble.fontSize}
          onChange={(e) => onChange({ fontSize: +e.target.value })}
          className="w-full accent-accent"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label>
          <Label>Căn lề</Label>
          <select
            className="input-field"
            value={bubble.align}
            onChange={(e) => onChange({ align: e.target.value as Bubble["align"] })}
          >
            <option value="left">Trái</option>
            <option value="center">Giữa</option>
            <option value="right">Phải</option>
          </select>
        </label>
        <label>
          <Label>Vị trí</Label>
          <select
            className="input-field"
            value={bubble.position}
            onChange={(e) => onChange({ position: e.target.value as Bubble["position"] })}
          >
            <option value="top">Trên</option>
            <option value="center">Giữa</option>
            <option value="bottom">Dưới</option>
          </select>
        </label>
        <label>
          <Label>Màu chữ</Label>
          <input
            type="color"
            className="h-9 w-full rounded border"
            value={bubble.color}
            onChange={(e) => onChange({ color: e.target.value })}
          />
        </label>
        <label>
          <Label>Màu nền</Label>
          <input
            type="color"
            className="h-9 w-full rounded border"
            value={bubble.background}
            onChange={(e) => onChange({ background: e.target.value })}
          />
        </label>
      </div>
      <Button variant="outline" size="sm" className="w-full text-destructive" onClick={onRemove}>
        <Trash2 /> Xoá bong bóng
      </Button>
    </div>
  );
}
