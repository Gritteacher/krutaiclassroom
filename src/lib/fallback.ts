import type { Post, Project } from "./types";

export const fallbackProjects: Project[] = [
  {
    id: "project-election",
    title: "ระบบเลือกตั้งประธานคณะสี",
    description: "เลือกตั้งออนไลน์ที่ใช้งานง่าย โปร่งใส และตรวจสอบสถิติได้",
    url: "https://vote26.grits.online/",
    category: "กิจกรรมนักเรียน",
    icon: "users",
    color: "#176b4c",
    sort_order: 1,
    published: true,
  },
  {
    id: "project-shirts",
    title: "ระบบกรอกไซซ์เสื้อกีฬา",
    description: "บันทึกและตรวจสอบไซซ์เสื้อของครูและนักเรียนได้ในที่เดียว",
    url: "https://dsnsize.grits.online",
    category: "ระบบโรงเรียน",
    icon: "shirt",
    color: "#d49b00",
    sort_order: 2,
    published: true,
  },
  {
    id: "project-clean",
    title: "ระบบตรวจความสะอาด",
    description: "ช่วยบันทึกคะแนน เหตุผล และสรุปผลการตรวจประจำวัน",
    url: "",
    category: "ระบบโรงเรียน",
    icon: "sparkle",
    color: "#3b8f78",
    sort_order: 3,
    published: true,
  },
  {
    id: "project-economics",
    title: "สื่อการเรียนรู้เศรษฐศาสตร์",
    description: "คลังเนื้อหา แบบฝึกหัด และกิจกรรมสำหรับห้องเรียน",
    url: "",
    category: "การเรียนรู้",
    icon: "browser",
    color: "#176b4c",
    sort_order: 4,
    published: true,
  },
];

export const fallbackPosts: Post[] = [
  {
    id: "post-welcome",
    slug: "welcome-to-krutaiclassroom",
    title: "ยินดีต้อนรับสู่ห้องเรียนครูไต๋",
    excerpt: "พื้นที่ใหม่ที่รวบรวมเว็บไซต์ ผลงาน และเรื่องราวจากห้องเรียนไว้ด้วยกัน",
    content:
      "ยินดีต้อนรับสู่ “ห้องเรียนครูไต๋”\n\nเว็บไซต์นี้เกิดขึ้นจากความตั้งใจที่จะรวบรวมระบบต่าง ๆ ที่สร้างขึ้นเพื่อโรงเรียน สื่อการเรียนรู้ และเรื่องราวจากประสบการณ์ทำงานไว้ในพื้นที่เดียว\n\nหวังว่าพื้นที่เล็ก ๆ แห่งนี้จะช่วยให้ทุกคนค้นหาสิ่งที่ต้องการได้ง่ายขึ้น และได้แลกเปลี่ยนเรียนรู้ไปด้วยกัน",
    category: "บันทึกของครู",
    cover_path: null,
    published: true,
    published_at: "2026-07-23T08:00:00.000Z",
  },
  {
    id: "post-tools",
    slug: "digital-tools-for-school",
    title: "เมื่อเทคโนโลยีช่วยให้งานโรงเรียนง่ายขึ้น",
    excerpt: "แนวคิดเบื้องหลังการสร้างระบบเล็ก ๆ เพื่อแก้ปัญหาในชีวิตประจำวัน",
    content:
      "หลายครั้งปัญหาในโรงเรียนไม่ได้ต้องการระบบที่ซับซ้อน แต่ต้องการเครื่องมือที่เข้าใจบริบทจริง\n\nจุดเริ่มต้นของแต่ละเว็บไซต์จึงมาจากคำถามง่าย ๆ ว่า เราจะลดงานซ้ำ ลดความคลาดเคลื่อน และทำให้ทุกคนใช้งานได้สะดวกขึ้นอย่างไร",
    category: "เทคโนโลยีการศึกษา",
    cover_path: null,
    published: true,
    published_at: "2026-07-20T08:00:00.000Z",
  },
  {
    id: "post-learning",
    slug: "learning-beyond-classroom",
    title: "การเรียนรู้เกิดขึ้นได้ทุกที่",
    excerpt: "ห้องเรียนที่ดีอาจไม่จำเป็นต้องถูกจำกัดไว้ด้วยโต๊ะ กระดาน หรือสี่ผนัง",
    content:
      "การเรียนรู้เกิดขึ้นได้ทั้งจากบทเรียน กิจกรรม การลงมือทำ และการพูดคุยแลกเปลี่ยน\n\nบทบาทของครูจึงไม่ใช่เพียงผู้ส่งต่อความรู้ แต่คือคนที่ออกแบบพื้นที่ให้ผู้เรียนกล้าคิด กล้าถาม และค้นพบคำตอบด้วยตนเอง",
    category: "การเรียนรู้",
    cover_path: null,
    published: true,
    published_at: "2026-07-18T08:00:00.000Z",
  },
];
