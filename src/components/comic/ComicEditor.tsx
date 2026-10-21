import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, MessageCircle, Pencil, Plus, Save, Send, Trash2 } from "lucide-react";
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
  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</span>
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
    setJ((x) => ({ ...x, chapters: x.chapters.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const updatePanels = (fn: (p: Panel[]) => Panel[]) => chapter && updateChapter(chapter.id, { panels: fn(chapter.panels) });
  const updatePanel = (pid: string, patch: Partial<Panel>) =>
    updatePanels((ps) => ps.map((p) => (p.id === pid ? { ...p, ...patch } : p)));
  const updateBubble = (pid: string, bid: string, patch: Partial<Bubble>) =>
    updatePanels((ps) =>
      ps.map((p) => (p.id === pid ? { ...p, bubbles: p.bubbles.map((b) => (b.id === bid ? { ...b, ...patch } : b)) } : p)),
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
    updatePanels((ps) => ps.map((p) => (p.id === pid ? { ...p, bubbles: p.bubbles.filter((b) => b.id !== bid) } : p)));
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
    sel && chapter?.panels.find((p) => p.id === sel.panelId)?.bubbles.find((b) => b.id === sel.bubbleId);

  return (
    <div className="space-y-8">
      {/* Actions */}
      <div className="sticky top-[64px] z-30 flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 shadow-soft">
        <span className="mr-auto text-sm text-muted-foreground">
          {j.published ? "Đã xuất bản" : "Bản nháp"} · {j.privacy === "public" ? "Công khai" : "Riêng tư"}
        </span>
        {preview ? (
          <Button variant="outline" onClick={() => setPreview(false)}>
            <Pencil /> Quay lại chỉnh sửa
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setPreview(true)} disabled={!chapter}>
            <Eye /> Xem trước chương
          </Button>
        )}
        <Button variant="outline" onClick={() => save(false)}>
          <Save /> Lưu nháp
        </Button>
        <Button onClick={() => save(true)}>
          <Send /> Xuất bản
        </Button>
      </div>

      {errors.length > 0 && (
        <ul className="rounded-lg border border-destructive/40 bg-card p-4 text-sm text-destructive">
          {errors.map((e) => (
            <li key={e}>• {e}</li>
          ))}
        </ul>
      )}

      {preview && chapter ? (
        <article className="mx-auto max-w-3xl rounded-xl border bg-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{chapter.date}</p>
          <h2 className="mb-6 text-3xl font-semibold">{chapter.title}</h2>
          <div className="grid grid-cols-2 gap-4">
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
                <input className="input-field" value={j.title} onChange={(e) => set({ title: e.target.value })} placeholder="Ví dụ: Cách mà mình đã học bơi" />
              </label>
              <label className="block">
                <Label>Mô tả</Label>
                <textarea className="input-field min-h-24" value={j.description} onChange={(e) => set({ description: e.target.value })} />
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label>
                  <Label>Chủ đề</Label>
                  <select className="input-field" value={j.category} onChange={(e) => set({ category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label>
                  <Label>Quyền riêng tư</Label>
                  <select className="input-field" value={j.privacy} onChange={(e) => set({ privacy: e.target.value as Journey["privacy"] })}>
                    <option value="private">Riêng tư</option>
                    <option value="public">Công khai</option>
                  </select>
                </label>
                <label>
                  <Label>Trạng thái</Label>
                  <select className="input-field" value={j.status} onChange={(e) => set({ status: e.target.value as Journey["status"] })}>
                    {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ảnh bìa</Label>
              <CoverPlaceholder label={j.coverLabel} />
              <input className="input-field" value={j.coverLabel} onChange={(e) => set({ coverLabel: e.target.value })} placeholder="Ghi chú cho ảnh bìa" />
              <Button variant="outline" size="sm" className="w-full" onClick={() => toast("Tải ảnh lên sẽ có trong phiên bản sau")}>Chọn ảnh</Button>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr_280px]">
            {/* B. Chapters */}
            <aside className="space-y-2 rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Các chương</h3>
                <Button size="sm" variant="ghost" onClick={addChapter}><Plus /> Thêm</Button>
              </div>
              {j.chapters.length === 0 && <p className="text-sm text-muted-foreground">Chưa có chương nào.</p>}
              {j.chapters.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-1 rounded-md border p-2 text-sm ${c.id === activeId ? "border-accent bg-background" : ""}`}
                >
                  <button className="flex-1 truncate text-left" onClick={() => { setActiveId(c.id); setSel(null); }}>
                    {i + 1}. {c.title || "(chưa đặt tên)"}
                  </button>
                  <button aria-label="Lên" onClick={() => moveChapter(i, -1)} className="text-muted-foreground"><ArrowUp className="h-4 w-4" /></button>
                  <button aria-label="Xuống" onClick={() => moveChapter(i, 1)} className="text-muted-foreground"><ArrowDown className="h-4 w-4" /></button>
                  <button aria-label="Xoá chương" onClick={() => deleteChapter(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </aside>

            {/* C. Panels */}
            <section className="space-y-6">
              {!chapter ? (
                <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
                  Thêm một chương để bắt đầu kể chuyện.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_180px]">
                    <label><Label>Tên chương *</Label>
                      <input className="input-field" value={chapter.title} onChange={(e) => updateChapter(chapter.id, { title: e.target.value })} />
                    </label>
                    <label><Label>Ngày</Label>
                      <input type="date" className="input-field" value={chapter.date} onChange={(e) => updateChapter(chapter.id, { date: e.target.value })} />
                    </label>
                  </div>
                  {chapter.panels.map((p, i) => (
                    <div key={p.id} className="space-y-3 rounded-xl border bg-card p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-auto text-sm font-medium">Khung {i + 1}</span>
                        <select className="input-field w-auto" value={p.layout} onChange={(e) => updatePanel(p.id, { layout: e.target.value as Panel["layout"] })}>
                          <option value="wide">Ngang</option>
                          <option value="square">Vuông</option>
                          <option value="tall">Dọc</option>
                        </select>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Xoá khung tranh này?")) updatePanels((ps) => ps.filter((x) => x.id !== p.id)); }}>
                          <Trash2 /> Xoá khung
                        </Button>
                      </div>
                      <div className="grid grid-cols-2">
                        <ComicPanel
                          panel={{ ...p, layout: p.layout }}
                          selectedBubbleId={sel?.panelId === p.id ? sel.bubbleId : null}
                          onSelectBubble={(bid) => setSel({ panelId: p.id, bubbleId: bid })}
                          onPickImage={() => toast("Tải ảnh lên sẽ có trong phiên bản sau")}
                        />
                      </div>
                      <input className="input-field" placeholder="Chú thích dưới khung (tuỳ chọn)" value={p.caption} onChange={(e) => updatePanel(p.id, { caption: e.target.value })} />
                      <div className="flex flex-wrap gap-2">
                        {(["speech", "thought", "narration"] as BubbleType[]).map((t) => (
                          <Button key={t} size="sm" variant="outline" onClick={() => addBubble(p.id, t)}>
                            <MessageCircle /> {BUBBLE_LABEL[t]}
                          </Button>
                        ))}
                      </div>
                      {p.bubbles.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {p.bubbles.map((b) => (
                            <button key={b.id} onClick={() => setSel({ panelId: p.id, bubbleId: b.id })}
                              className={`rounded-full border px-2 py-1 ${sel?.bubbleId === b.id ? "border-accent text-accent" : "text-muted-foreground"}`}>
                              {BUBBLE_LABEL[b.type]}: {b.text.slice(0, 18)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => updatePanels((ps) => [...ps, makePanel()])}>
                    <Plus /> Thêm khung tranh
                  </Button>
                </>
              )}
            </section>

            {/* D. Bubble properties */}
            <aside className="h-fit space-y-3 rounded-xl border bg-card p-4 lg:sticky lg:top-36">
              <h3 className="font-semibold">Thuộc tính chữ</h3>
              {!selBubble || !sel ? (
                <p className="text-sm text-muted-foreground">Chọn một bong bóng thoại trong khung để chỉnh sửa.</p>
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

function BubbleProps({ bubble, onChange, onRemove }: { bubble: Bubble; onChange: (p: Partial<Bubble>) => void; onRemove: () => void }) {
  return (
    <div className="space-y-3 text-sm">
      <label className="block"><Label>Nội dung</Label>
        <textarea className="input-field min-h-20" value={bubble.text} onChange={(e) => onChange({ text: e.target.value })} />
      </label>
      <label className="block"><Label>Loại</Label>
        <select className="input-field" value={bubble.type} onChange={(e) => onChange({ type: e.target.value as BubbleType })}>
          {Object.entries(BUBBLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className="block"><Label>Cỡ chữ: {bubble.fontSize}px</Label>
        <input type="range" min={11} max={28} value={bubble.fontSize} onChange={(e) => onChange({ fontSize: +e.target.value })} className="w-full accent-accent" />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label><Label>Căn lề</Label>
          <select className="input-field" value={bubble.align} onChange={(e) => onChange({ align: e.target.value as Bubble["align"] })}>
            <option value="left">Trái</option><option value="center">Giữa</option><option value="right">Phải</option>
          </select>
        </label>
        <label><Label>Vị trí</Label>
          <select className="input-field" value={bubble.position} onChange={(e) => onChange({ position: e.target.value as Bubble["position"] })}>
            <option value="top">Trên</option><option value="center">Giữa</option><option value="bottom">Dưới</option>
          </select>
        </label>
        <label><Label>Màu chữ</Label>
          <input type="color" className="h-9 w-full rounded border" value={bubble.color} onChange={(e) => onChange({ color: e.target.value })} />
        </label>
        <label><Label>Màu nền</Label>
          <input type="color" className="h-9 w-full rounded border" value={bubble.background} onChange={(e) => onChange({ background: e.target.value })} />
        </label>
      </div>
      <Button variant="outline" size="sm" className="w-full text-destructive" onClick={onRemove}>
        <Trash2 /> Xoá bong bóng
      </Button>
    </div>
  );
}
