import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LessonSlideViewer from "../components/LessonSlideViewer";
import Seo, { SITE_NAME, SITE_URL } from "../components/Seo";
import { religionLesson } from "../data/religionLesson";

export default function OnlineLessonPage() {
  const url = `${SITE_URL}/lessons/${religionLesson.slug}`;
  return (
    <Layout>
      <Seo title={`${religionLesson.title} | บทเรียนออนไลน์ | ${SITE_NAME}`} description={religionLesson.summary} path={`/lessons/${religionLesson.slug}`} noIndex structuredData={{ "@context": "https://schema.org", "@type": "LearningResource", name: religionLesson.title, description: religionLesson.summary, url, inLanguage: "th-TH", educationalLevel: "มัธยมศึกษาปีที่ 6", isAccessibleForFree: true, learningResourceType: "บทเรียนออนไลน์", author: { "@type": "Person", name: "กฤษณพล ทองอุ่น" } }} />
      <main className="lesson-page">
        <section className="lesson-hero">
          <div className="shell">
            <Link className="back-link" to="/">← กลับหน้าแรก</Link>
            <div className="lesson-draft-badge">ฉบับร่างสำหรับตรวจทาน</div>
            <p className="section-kicker">บทเรียนออนไลน์ · {religionLesson.category}</p>
            <h1>{religionLesson.title}</h1>
            <p className="lesson-subtitle">{religionLesson.subtitle}</p>
            <div className="lesson-meta"><span>16 สไลด์ HTML</span><span>อ่านและนำเสนอได้บนมือถือ</span><span>เวอร์ชันตัวอย่าง</span></div>
          </div>
        </section>
        <section className="lesson-overview shell">
          <div className="lesson-summary-card"><p className="section-kicker">สรุปความรู้</p><h2>ศาสนา ความเชื่อ และการอยู่ร่วมกัน</h2><p>{religionLesson.summary}</p></div>
          <div className="lesson-info-card"><p className="section-kicker">เป้าหมายการเรียนรู้</p><ul>{religionLesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>
          <div className="lesson-info-card lesson-terms"><p className="section-kicker">คำสำคัญ</p><div>{religionLesson.keyTerms.map((term) => <span key={term}>{term}</span>)}</div></div>
        </section>
        <section className="lesson-slides shell" aria-labelledby="lesson-slides-title">
          <div className="section-head compact"><div><p className="section-kicker">HTML SLIDES</p><h2 id="lesson-slides-title">สไลด์บทเรียน</h2></div><p className="section-note">เลือกสไลด์จากสารบัญ หรือใช้ปุ่มลูกศรเพื่อเดินหน้าและย้อนกลับ</p></div>
          <LessonSlideViewer slides={religionLesson.slides} />
        </section>
        <section className="lesson-review shell"><div><p className="section-kicker">ก่อนเผยแพร่</p><h2>จุดที่รอตรวจทาน</h2><p>ฉบับนี้เรียบเรียงจากสไลด์ PDF เพื่อทดลองโครงสร้างหน้าเว็บ ควรตรวจคำจำกัดความ ตารางเปรียบเทียบ และเฉลยคำถามกับต้นฉบับก่อนเปิดเป็นบทเรียนสาธารณะ</p></div><span>ยังไม่เผยแพร่</span></section>
      </main>
    </Layout>
  );
}
