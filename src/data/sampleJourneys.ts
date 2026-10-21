import type { Bubble, BubbleType, Chapter, Journey, Panel } from "@/types/journey";
import appleSketch from "@/assets/apple-sketch.jpg";
import failedExam from "@/assets/failed-exam.jpg";
import heroCover from "@/assets/hero-cover.jpg";
import leavingCity from "@/assets/leaving-city.jpg";

export const DEMO_USER = {
  id: "me",
  name: "Minh An",
  bio: "Viết lại những lần mình vấp ngã để nhớ rằng mình đã đứng dậy.",
};

let n = 0;
const uid = (p: string) => `${p}-seed-${++n}`;

export const newId = (p = "id") =>
  `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function makeBubble(type: BubbleType = "speech", text = ""): Bubble {
  return {
    id: newId("b"),
    type,
    text:
      text ||
      (type === "narration"
        ? "Lời dẫn truyện..."
        : type === "thought"
          ? "Mình đang nghĩ..."
          : type === "action"
            ? "POW!!"
            : "Lời thoại..."),
    fontSize: type === "action" ? 22 : 14,
    align: type === "narration" ? "left" : "center",
    color: type === "narration" ? "#0A0D14" : type === "action" ? "#FACC15" : "#F0F4FC",
    background: type === "narration" ? "#FACC15" : type === "action" ? "#FF2B4E" : "#141824",
    position: type === "narration" ? "top" : type === "action" ? "center" : "bottom",
  };
}

export function makePanel(): Panel {
  return { id: newId("p"), layout: "wide", caption: "", bubbles: [] };
}

export function makeChapter(index: number): Chapter {
  return {
    id: newId("c"),
    title: `Chương ${index}`,
    date: new Date().toISOString().slice(0, 10),
    panels: [makePanel()],
  };
}

const b = (
  type: BubbleType,
  text: string,
  position: Bubble["position"] = "bottom",
  bg?: string,
  color?: string,
): Bubble => ({
  ...makeBubble(type, text),
  id: uid("b"),
  position,
  background: bg || (type === "narration" ? "#FACC15" : "#141824"),
  color: color || (type === "narration" ? "#0A0D14" : "#F0F4FC"),
});

const p = (
  caption: string,
  bubbles: Bubble[],
  layout: Panel["layout"] = "wide",
  imageUrl?: string,
): Panel => ({
  id: uid("p"),
  layout,
  caption,
  bubbles,
  imageUrl,
});

export const sampleJourneys: Journey[] = [
  {
    id: "hoc-ve-o-tuoi-30",
    title: "Học vẽ ở tuổi 30: Bản phác thảo đầu tiên",
    description:
      "Mình từng nghĩ đã quá muộn để cầm bút chì. Đây là 6 tháng đầu tiên trong bóng tối của phòng làm việc, với một cuốn sổ và cây bút chì 2B.",
    category: "Học kỹ năng mới",
    author: "Thu Hà",
    authorId: "u1",
    coverLabel: "Bản vẽ quả táo đầu tiên dưới ánh đèn",
    coverImage: appleSketch,
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
          p(
            "Tối thứ Hai, sau giờ làm đêm.",
            [
              b(
                "narration",
                "Ca làm đêm kết thúc. Mình mua cuốn sổ 40 nghìn ở tiệm tạp hoá cũ.",
                "top",
              ),
            ],
            "wide",
            appleSketch,
          ),
          p("", [b("thought", "Người ta bắt đầu từ lúc 5 tuổi. Mình thì đã 30.")], "square"),
          p("", [b("speech", "Thôi kệ. Vẽ một quả táo trước đã.")], "square"),
        ],
      },
      {
        id: "c2",
        title: "Một trăm quả táo",
        date: "2026-05-18",
        panels: [
          p("Sau hai tháng rèn luyện.", [
            b(
              "narration",
              "Quả táo thứ 100 vẫn còn méo. Nhưng bóng đổ và ánh sáng đã đúng hướng.",
              "top",
            ),
          ]),
          p("", [b("speech", "Hôm nay mình vẽ cái cốc nhé!", "center")], "tall"),
        ],
      },
    ],
  },
  {
    id: "lan-truot-dai-hoc",
    title: "Năm mình ngã ngựa: Dưới ánh đèn Nocturne's",
    description:
      "Không ai dạy một đứa trẻ cách nuốt trôi một tờ giấy báo trượt. Mình đã ngồi dưới mưa, học cách chấp nhận sự sụp đổ.",
    category: "Thất bại",
    author: "Quốc Bảo",
    authorId: "u2",
    coverLabel: "Ngồi dưới mưa trước quán Nocturne's",
    coverImage: failedExam,
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
          p(
            "Trời đổ mưa tầm tã trước hiên phố cũ.",
            [
              b("narration", "Mẹ gọi qua điện thoại: 'Được bao nhiêu điểm con?'", "top"),
              b("speech", "...Con xin lỗi mẹ."),
            ],
            "wide",
            failedExam,
          ),
          p(
            "Đêm đó thành phố không ngủ.",
            [b("thought", "Mọi người sẽ nhìn mình thế nào từ ngày mai?", "center")],
            "square",
          ),
        ],
      },
      {
        id: "c2",
        title: "Một năm ôn lại",
        date: "2026-01-10",
        panels: [
          p("Khởi đầu lại từ đống tro tàn.", [
            b(
              "narration",
              "Lần này mình chiến đấu vì chính mình, không phải vì ánh mắt của ai khác.",
              "top",
            ),
          ]),
        ],
      },
    ],
  },
  {
    id: "roi-thanh-pho",
    title: "Rời xa ánh đèn neon: Tìm lại bản ngã",
    description:
      "Từ bỏ guồng quay cao ốc công nghệ để vác balo lên con đường đất đỏ mù sương. Một bước ngoặt không hề lãng mạn như phim.",
    category: "Bắt đầu lại",
    author: "Lan Chi",
    authorId: "u3",
    coverLabel: "Bỏ lại ánh đèn rực rỡ của thành phố",
    coverImage: leavingCity,
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
        panels: [
          p(
            "Rời thành phố trong một đêm mưa lạnh.",
            [b("thought", "Mình đang tiến bước hay chỉ là kẻ chạy trốn?", "center")],
            "wide",
            leavingCity,
          ),
        ],
      },
    ],
  },
  {
    id: "mua-dong-trong-dau",
    title: "Mùa đông ở trong đầu: Đêm đen Gotham",
    description:
      "Nhật ký của một năm vật lộn trong bóng tối tâm lý. Khi mỗi buổi sáng thức dậy là một trận chiến sinh tử nội tâm.",
    category: "Giai đoạn khó khăn",
    author: "Hoàng Nam",
    authorId: "u4",
    coverLabel: "Bóng đêm trùm lên thành phố",
    coverImage: heroCover,
    privacy: "public",
    status: "ongoing",
    published: true,
    createdAt: "2025-11-01",
    updatedAt: "2026-09-30",
    chapters: [
      {
        id: "c1",
        title: "Không muốn thức dậy",
        date: "2025-11-01",
        panels: [
          p(
            "Bóng tối bao trùm khắp căn gác.",
            [
              b(
                "narration",
                "Có những ngày, mở mắt và bước ra khỏi giường đã là một chiến thắng.",
                "top",
              ),
            ],
            "wide",
            heroCover,
          ),
          p("", [b("speech", "Mình vẫn ổn... ít nhất là qua được đêm nay.")], "square"),
        ],
      },
    ],
  },
  {
    id: "nhap-cua-minh",
    title: "Tập chạy bộ: Vượt qua giới hạn (Draft)",
    description: "Từ một kẻ không thở nổi sau 500 mét đến cột mốc 5km đầu tiên.",
    category: "Thay đổi bản thân",
    author: DEMO_USER.name,
    authorId: DEMO_USER.id,
    coverLabel: "Đôi giày cũ trên đường chạy",
    privacy: "private",
    status: "ongoing",
    published: false,
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
    chapters: [
      {
        id: "c1",
        title: "Vòng hồ đầu tiên",
        date: "2026-10-01",
        panels: [
          p("", [b("thought", "Sao mọi người lướt đi nhẹ nhàng còn mình thì như kiệt sức?")]),
        ],
      },
    ],
  },
];
