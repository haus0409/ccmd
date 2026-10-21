export type BubbleType = "speech" | "thought" | "narration";
export type BubblePosition = "top" | "center" | "bottom";
export type TextAlign = "left" | "center" | "right";
export type PanelLayout = "wide" | "square" | "tall";
export type JourneyStatus = "ongoing" | "completed" | "unresolved";
export type Privacy = "public" | "private";

export interface Bubble {
  id: string;
  type: BubbleType;
  text: string;
  fontSize: number;
  align: TextAlign;
  color: string;
  background: string;
  position: BubblePosition;
}

export interface Panel {
  id: string;
  layout: PanelLayout;
  /** Reserved for future uploads. Empty = render placeholder. */
  imageUrl?: string;
  caption: string;
  bubbles: Bubble[];
}

export interface Chapter {
  id: string;
  title: string;
  date: string;
  panels: Panel[];
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorId: string;
  coverLabel: string;
  privacy: Privacy;
  status: JourneyStatus;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

export interface Comment {
  id: string;
  journeyId: string;
  author: string;
  text: string;
  createdAt: string;
}

export const CATEGORIES = [
  "Học kỹ năng mới",
  "Thay đổi bản thân",
  "Thất bại",
  "Giai đoạn khó khăn",
  "Bắt đầu lại",
  "Khác",
] as const;

export const STATUS_LABEL: Record<JourneyStatus, string> = {
  ongoing: "Đang tiếp diễn",
  completed: "Đã khép lại",
  unresolved: "Chưa có lời giải",
};

export const BUBBLE_LABEL: Record<BubbleType, string> = {
  speech: "Lời thoại",
  thought: "Suy nghĩ",
  narration: "Dẫn truyện",
};
