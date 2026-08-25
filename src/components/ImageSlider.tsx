import { useEffect, useState } from "react";
import { publicImageUrl } from "../lib/supabase";
import type { Slide } from "../lib/types";

export default function ImageSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive((current) => Math.min(current, Math.max(slides.length - 1, 0)));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const move = (direction: number) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="slider-section shell" aria-label="สไลด์รูปภาพ">
      <div className="image-slider">
        <div className="slider-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide) => {
            const imageUrl = publicImageUrl(slide.image_path);
            const picture = (
              <div className="slide-frame">
                {imageUrl && <img src={imageUrl} alt={slide.title || "ภาพกิจกรรมห้องเรียนครูไต๋ กฤษณพล ทองอุ่น"} />}
                {(slide.title || slide.caption) && (
                  <div className="slide-caption">
                    {slide.title && <h2>{slide.title}</h2>}
                    {slide.caption && <p>{slide.caption}</p>}
                  </div>
                )}
              </div>
            );
            return (
              <div className="slide" key={slide.id} aria-hidden={slides[active]?.id !== slide.id}>
                {slide.link_url ? <a href={slide.link_url} target="_blank" rel="noreferrer">{picture}</a> : picture}
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <button className="slider-arrow previous" type="button" onClick={() => move(-1)} aria-label="ภาพก่อนหน้า">‹</button>
            <button className="slider-arrow next" type="button" onClick={() => move(1)} aria-label="ภาพถัดไป">›</button>
            <div className="slider-dots" aria-label="เลือกภาพสไลด์">
              {slides.map((slide, index) => (
                <button
                  className={index === active ? "active" : ""}
                  type="button"
                  key={slide.id}
                  onClick={() => setActive(index)}
                  aria-label={`แสดงภาพที่ ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
