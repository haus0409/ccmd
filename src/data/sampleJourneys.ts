import type { Bubble, BubbleType, Chapter, Journey, Panel } from "@/types/journey";

export const DEMO_USER = { id: "me", name: "Minh An", bio: "Viết lại những lần mình vấp ngã để nhớ rằng mình đã đứng dậy." };

let n = 0;
const uid = (p: string) => `${p}-seed-${++n}`;

export const newId = (p = "id") => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function makeBubble(type: BubbleType = "speech", text = ""): Bubble {
  return {
    id: newId("b"),
    type,
    text: text || (type === "narration" ? "Lời dẫn truyện..." : type === "thought" ? "Mình đang nghĩ..." : "Lời thoại..."),
    fontSize: 15,
    align: type === "narration" ? "left" : "center",
    color: "#252B35",
    background: type === "narration" ? "#F4EBDD" : "#FFFFFF",
    position: type === "narration" ? "top" : "bottom",
  };
}

export function makePanel(): Panel {
  return { id: newId("p"), layout: "wide", caption: "", bubbles: [] };
}

export function makeChapter(index: number): Chapter {
  return { id: newId("c"), title: `Chương ${index}`, date: new Date().toISOString().slice(0, 10), panels: [makePanel()] };
}

const b = (type: BubbleType, text: string, position: Bubble["position"] = "bottom"): Bubble => ({
  ...makeBubble(type, text),
  id: uid("b"),
  position,
});
const p = (caption: string, bubbles: Bubble[], layout: Panel["layout"] = "wide"): Panel => ({
  id: uid("p"),
  layout,
  caption,
  bubbles,
});

export const sampleJourneys: Journey[] = [
  {
    id: "hoc-ve-o-tuoi-30",
    title: "Học vẽ ở tuổi 30",
    description: "Mình từng nghĩ đã quá muộn để cầm bút chì. Đây là 6 tháng đầu tiên, với rất nhiều bức vẽ xấu.",
    category: "Học kỹ năng mới",
    author: "Thu Hà",
    authorId: "u1",
    coverLabel: "Một cuốn sổ phác thảo mở trên bàn gỗ",
    privacy: "public",
    status: "ongoing",
    published: true,
    createdAt: "2026-03-02",
    updatedAt: "2026-09-12",
    chapters: [
      {
        id: "c1",
        title: "Cây bút chì đầu tiên",
        date: "2026-03-02",
        panels: [
          p("Tối thứ Hai, sau giờ làm.", [b("narration", "Mình mua một cuốn sổ 40 nghìn ở tiệm gần nhà.", "top")]),
          p("", [b("thought", "Người ta bắt đầu từ lúc 5 tuổi. Mình thì 30.")], "square"),
          p("", [b("speech", "Thôi kệ. Vẽ một quả táo trước đã.")], "square"),
        ],
      },
      {
        id: "c2",
        title: "Một trăm quả táo",
        date: "2026-05-18",
        panels: [
          p("Sau hai tháng.", [b("narration", "Quả táo thứ 100 vẫn méo. Nhưng bóng đổ đã đúng.", "top")]),
          p("", [b("speech", "Hôm nay mình vẽ cái cốc nhé!", "center")], "tall"),
        ],
      },
    ],
  },
  {
    id: "lan-truot-dai-hoc",
    title: "Năm mình trượt đại học",
    description: "Không ai dạy mình cách đối diện với một tờ giấy báo điểm. Mình tự học, chậm và đau.",
    category: "Thất bại",
    author: "Quốc Bảo",
    authorId: "u2",
    coverLabel: "Tờ giấy báo điểm gấp đôi",
    privacy: "public",
    status: "completed",
    published: true,
    createdAt: "2025-07-20",
    updatedAt: "2026-01-10",
    chapters: [
      {
        id: "c1",
        title: "Ngày có điểm",
        date: "2025-07-20",
        panels: [
          p("", [b("narration", "Mẹ hỏi: 'Được bao nhiêu con?'", "top"), b("speech", "...Con xin lỗi.")]),
          p("Đêm đó mình không ngủ.", [b("thought", "Mọi người sẽ nghĩ gì?", "center")], "square"),
        ],
      },
      {
        id: "c2",
        title: "Một năm ôn lại",
        date: "2026-01-10",
        panels: [p("", [b("narration", "Lần này mình học vì mình, không phải vì ai.", "top")])],
      },
    ],
  },
  {
    id: "roi-thanh-pho",
    title: "Rời Sài Gòn về quê",
    description: "Bỏ một công việc ổn định để về Đà Lạt trồng rau. Không lãng mạn như trên mạng.",
    category: "Bắt đầu lại",
    author: "Lan Chi",
    authorId: "u3",
    coverLabel: "Con dốc đất đỏ giữa vườn rau",
    privacy: "public",
    status: "unresolved",
    published: true,
    createdAt: "2026-02-14",
    updatedAt: "2026-08-01",
    chapters: [
      {
        id: "c1",
        title: "Chuyến xe đêm",
        date: "2026-02-14",
        panels: [p("", [b("thought", "Mình có đang chạy trốn không?", "center")])],
      },
    ],
  },
  {
    id: "mua-dong-trong-dau",
    title: "Mùa đông ở trong đầu",
    description: "Ghi lại một năm sống cùng trầm cảm, những ngày tệ và những ngày bớt tệ hơn.",
    category: "Giai đoạn khó khăn",
    author: "Hoàng Nam",
    authorId: "u4",
    coverLabel: "Cửa sổ phòng trọ lúc 3 giờ sáng",
    privacy: "public",
    status: "ongoing",
    published: true,
    createdAt: "2025-11-01",
    updatedAt: "2026-09-30",
    chapters: [
      {
        id: "c1",
        title: "Không muốn dậy",
        date: "2025-11-01",
        panels: [
          p("", [b("narration", "Có những sáng, đánh răng là một chiến thắng.", "top")]),
          p("", [b("speech", "Em ổn mà. Thật đấy.")], "square"),
        ],
      },
    ],
  },
  {
    id: "nhap-cua-minh",
    title: "Tập chạy bộ (bản nháp)",
    description: "Từ không chạy nổi 500m đến 5km.",
    category: "Thay đổi bản thân",
    author: DEMO_USER.name,
    authorId: DEMO_USER.id,
    coverLabel: "Đôi giày chạy cũ",
    privacy: "private",
    status: "ongoing",
    published: false,
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
    chapters: [{ id: "c1", title: "Vòng hồ đầu tiên", date: "2026-10-01", panels: [p("", [b("thought", "Sao mọi người chạy nhẹ nhàng thế?")])] }],
  },
];
