import { useEffect, useMemo, useState } from "react";
import type { LessonSlide } from "../data/religionLesson";

export default function LessonSlideViewer({ slides }: { slides: LessonSlide[] }) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const progress = useMemo(() => `${current + 1} / ${slides.length}`, [current, slides.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "PageDown") setCurrent((value) => Math.min(value + 1, slides.length - 1));
      if (event.key === "ArrowLeft" || event.key === "PageUp") setCurrent((value) => Math.max(value - 1, 0));
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  return (
    <div className="lesson-viewer" aria-label="ตัวแสดงสไลด์บทเรียน">
      <aside className="lesson-outline" aria-label="สารบัญสไลด์">
        <div className="lesson-outline-head"><span>สไลด์ในบทเรียน</span><strong>{progress}</strong></div>
        <div className="lesson-outline-list">
          {slides.map((item, index) => (
            <button type="button" className={index === current ? "active" : ""} key={item.title} onClick={() => setCurrent(index)} aria-label={`เปิดสไลด์ที่ ${index + 1}: ${item.title}`} aria-current={index === current ? "step" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </aside>
      <section className="lesson-stage" aria-live="polite">
        <div className="lesson-stage-top"><span>HTML SLIDE</span><span>{progress}</span></div>
        <article className="lesson-slide" key={current}>
          <div className="lesson-slide-accent" aria-hidden="true" />
          {slide.eyebrow && <p className="lesson-slide-eyebrow">{slide.eyebrow}</p>}
          <h3>{slide.title}</h3>
          {slide.paragraphs?.map((paragraph) => <p className="lesson-slide-paragraph" key={paragraph}>{paragraph}</p>)}
          {slide.bullets && <ul>{slide.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          {slide.columns && <div className="lesson-slide-columns">{slide.columns.map((column) => <div className="lesson-slide-column" key={column.heading}><h4>{column.heading}</h4><ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>}
          {slide.question && <div className="lesson-question"><strong>คำถามชวนคิด</strong><p>{slide.question}</p></div>}
          {slide.options && <ol className="lesson-options">{slide.options.map((option) => <li key={option}>{option}</li>)}</ol>}
          {slide.activity && <div className="lesson-activity">{slide.activity.map((step, index) => <div key={step}><span>STEP {index + 1}</span><strong>{step}</strong></div>)}</div>}
          {slide.note && <p className="lesson-slide-note">{slide.note}</p>}
        </article>
        <div className="lesson-stage-controls">
          <button type="button" className="button quiet" onClick={() => setCurrent((value) => Math.max(value - 1, 0))} disabled={current === 0}>← ก่อนหน้า</button>
          <div className="lesson-progress" aria-hidden="true"><span style={{ width: `${((current + 1) / slides.length) * 100}%` }} /></div>
          <button type="button" className="button primary" onClick={() => setCurrent((value) => Math.min(value + 1, slides.length - 1))} disabled={current === slides.length - 1}>ถัดไป →</button>
        </div>
        <p className="lesson-keyboard-hint">ใช้ปุ่ม ← → บนแป้นพิมพ์เพื่อเปลี่ยนสไลด์</p>
      </section>
    </div>
  );
}
