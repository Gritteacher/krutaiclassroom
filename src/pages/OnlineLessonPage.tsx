import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LessonSlideViewer from "../components/LessonSlideViewer";
import Seo, { SITE_NAME, SITE_URL } from "../components/Seo";
import { religionLesson, religionLessonPath } from "../data/religionLesson";

export default function OnlineLessonPage() {
  const url = `${SITE_URL}${religionLessonPath}`;
  return (
    <Layout>
      <Seo title={`${religionLesson.title} | บทเรียนออนไลน์ | ${SITE_NAME}`} description={religionLesson.summary} path={religionLessonPath} structuredData={{ "@context": "https://schema.org", "@type": "LearningResource", name: religionLesson.title, description: religionLesson.summary, url, inLanguage: "th-TH", educationalLevel: "มัธยมศึกษาปีที่ 6", isAccessibleForFree: true, learningResourceType: "บทเรียนออนไลน์", author: { "@type": "Person", name: "กฤษณพล ทองอุ่น" } }} />
      <main className="lesson-page">
        <section className="lesson-hero">
          <div className="shell">
            <Link className="back-link" to="/">← กลับหน้าแรก</Link>
            <div className="lesson-badge">บทเรียนออนไลน์</div>
            <p className="section-kicker">บทเรียนออนไลน์ · {religionLesson.category}</p>
            <h1>{religionLesson.title}</h1>
            <p className="lesson-subtitle">{religionLesson.subtitle}</p>
          </div>
        </section>
        <section className="lesson-overview shell">
          <div className="lesson-summary-card"><p className="section-kicker">สรุปความรู้</p><h2>ศาสนา ความเชื่อ และการอยู่ร่วมกัน</h2><p>{religionLesson.summary}</p></div>
          <div className="lesson-info-card"><p className="section-kicker">เป้าหมายการเรียนรู้</p><ul>{religionLesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div>
          <div className="lesson-info-card lesson-terms"><p className="section-kicker">คำสำคัญ</p><div>{religionLesson.keyTerms.map((term) => <span key={term}>{term}</span>)}</div></div>
        </section>
        <section className="lesson-slides shell" aria-labelledby="lesson-slides-title">
          <div className="section-head compact"><div><p className="section-kicker">สไลด์ต้นฉบับ</p><h2 id="lesson-slides-title">สไลด์บทเรียน</h2></div><p className="section-note">เลือกสไลด์จากสารบัญ หรือใช้ปุ่มลูกศรเพื่อเดินหน้าและย้อนกลับ</p></div>
          <LessonSlideViewer slides={religionLesson.slides} />
        </section>
        <section className="lesson-review shell"><div><p className="section-kicker">ทบทวนความรู้</p><h2>เรียนรู้จากสไลด์และแลกเปลี่ยนความคิดเห็น</h2><p>เนื้อหานี้เรียบเรียงจากสไลด์ประกอบการสอน พร้อมคำถามชวนคิดและกิจกรรมท้ายบท เพื่อใช้ทบทวนและอภิปรายร่วมกันในชั้นเรียน</p></div><span>บทเรียนออนไลน์</span></section>
      </main>
    </Layout>
  );
}
