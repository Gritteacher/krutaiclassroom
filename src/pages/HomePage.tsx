import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { BrowserWindow, PencilSpark, SiteIcon } from "../components/SvgArt";
import { getPublishedPosts, getPublishedProjects } from "../lib/content";
import { formatThaiDate } from "../lib/format";
import { publicCoverUrl } from "../lib/supabase";
import type { Post, Project } from "../lib/types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPublishedProjects(), getPublishedPosts(3)])
      .then(([projectRows, postRows]) => {
        setProjects(projectRows);
        setPosts(postRows);
      })
      .catch(() => setError("ไม่สามารถโหลดข้อมูลได้ในขณะนี้"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
    }
  }, []);

  return (
    <Layout>
      <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span />พื้นที่เล็ก ๆ ของคนเป็นครู</p>
              <h1>เรียนรู้ สร้างสรรค์<br /><em>และแบ่งปัน</em></h1>
              <p className="hero-lead">
                รวมเว็บไซต์เพื่อการศึกษา ระบบงานในโรงเรียน
                และเรื่องราวระหว่างทางของครูไต๋
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#websites">ดูเว็บไซต์ทั้งหมด <span>→</span></a>
                <a className="button quiet" href="#stories">อ่านเรื่องราว</a>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true"><BrowserWindow /></div>
          </div>
        </section>

        <section className="section shell" id="websites">
          <div className="section-head">
            <div>
              <p className="section-kicker">เว็บไซต์ของฉัน</p>
              <h2>เครื่องมือที่สร้างขึ้นเพื่อให้ทุกอย่างง่ายกว่าเดิม</h2>
            </div>
            <p className="section-note">เลือกเว็บไซต์หรือระบบที่ต้องการใช้งานได้เลย</p>
          </div>
          {error && <div className="notice error">{error}</div>}
          {loading ? (
            <div className="loading-grid"><span /><span /><span /><span /></div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => {
                const content = (
                  <>
                    <div className="project-icon" style={{ "--accent": project.color } as React.CSSProperties}>
                      <SiteIcon name={project.icon} />
                    </div>
                    <div className="project-copy">
                      <span className="tag">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                    <span className="project-link">{project.url ? "เปิดเว็บไซต์ ↗" : "เร็ว ๆ นี้"}</span>
                  </>
                );
                return project.url ? (
                  <a className="project-card" href={project.url} key={project.id} target="_blank" rel="noreferrer">{content}</a>
                ) : (
                  <div className="project-card disabled" key={project.id}>{content}</div>
                );
              })}
            </div>
          )}
        </section>

        <section className="stories-section" id="stories">
          <div className="section shell">
            <div className="section-head compact">
              <div><p className="section-kicker">สมุดบันทึก</p><h2>เรื่องราวล่าสุด</h2></div>
              <Link className="text-link" to="/stories">ดูเรื่องราวทั้งหมด →</Link>
            </div>
            <div className="story-grid">
              {posts.map((post, index) => {
                const coverUrl = publicCoverUrl(post.cover_path);
                return (
                  <Link className="story-card" to={`/stories/${post.slug}`} key={post.id}>
                    <div className={`story-cover cover-${(index % 3) + 1}`} style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}>
                      {!coverUrl && <PencilSpark variant={(index % 3) + 1} />}
                    </div>
                    <div className="story-body">
                      <div className="story-meta"><span>{post.category}</span><time>{formatThaiDate(post.published_at)}</time></div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <span className="read-more">อ่านต่อ →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="about-section shell" id="about">
          <div className="about-card">
            <div className="about-mark"><span>ค</span></div>
            <div>
              <p className="section-kicker">ยินดีที่ได้รู้จัก</p>
              <h2>ห้องเรียนที่ไม่ได้มีแค่สี่ผนัง</h2>
              <p>พื้นที่นี้รวบรวมสิ่งที่ครูไต๋ได้สร้าง ทดลอง และเรียนรู้ ทั้งระบบดิจิทัลเพื่อโรงเรียน สื่อการเรียนรู้ และบันทึกจากประสบการณ์ในห้องเรียน</p>
            </div>
            <a className="button quiet about-button" href="mailto:gritsn.th@gmail.com">ติดต่อครูไต๋</a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
