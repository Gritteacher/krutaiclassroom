import type { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo, { SITE_NAME } from "../components/Seo";
import { supabase } from "../lib/supabase";
import type { Post, Project, Slide } from "../lib/types";

type Tab = "posts" | "projects" | "slides";

export default function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [authorized, setAuthorized] = useState<boolean | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [tab, setTab] = useState<Tab>("posts");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) navigate("/login", { replace: true });
    if (!session || !supabase) return;
    Promise.all([
      supabase.rpc("is_admin"),
      supabase.from("projects").select("*").order("sort_order").order("created_at"),
      supabase.from("posts").select("*").order("published_at", { ascending: false }),
      supabase.from("slides").select("*").order("sort_order").order("created_at"),
    ]).then(([adminResult, projectsResult, postsResult, slidesResult]) => {
      const isAdmin = adminResult.data === true;
      setAuthorized(isAdmin);
      if (isAdmin) {
        setProjects((projectsResult.data ?? []) as Project[]);
        setPosts((postsResult.data ?? []) as Post[]);
        setSlides((slidesResult.data ?? []) as Slide[]);
      }
    });
  }, [session, navigate]);

  const counts = useMemo(() => ({
    posts: posts.length,
    published: posts.filter((post) => post.published).length,
    projects: projects.length,
    slides: slides.length,
  }), [posts, projects, slides]);

  async function signOut() {
    await supabase?.auth.signOut();
    navigate("/login", { replace: true });
  }

  if (session === undefined || authorized === undefined && session) {
    return <><Seo title={`จัดการเว็บไซต์ | ${SITE_NAME}`} path="/admin" noIndex /><main className="admin-page"><section className="admin-message"><h1>กำลังตรวจสอบสิทธิ์...</h1></section></main></>;
  }

  if (!authorized) {
    return (
      <>
        <Seo title={`จัดการเว็บไซต์ | ${SITE_NAME}`} path="/admin" noIndex />
        <main className="admin-page">
          <section className="admin-message">
            <h1>บัญชีนี้ไม่มีสิทธิ์</h1>
            <p>ผู้ใช้ {session?.user.email} ไม่ได้อยู่ในรายชื่อผู้ดูแลเว็บไซต์</p>
            <button className="admin-secondary" onClick={signOut}>ออกจากระบบ</button>
          </section>
        </main>
      </>
    );
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setStatus("กำลังบันทึก...");
    const form = new FormData(event.currentTarget);
    const values = {
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      url: String(form.get("url") ?? "").trim(),
      category: String(form.get("category") ?? "").trim(),
      icon: String(form.get("icon") ?? "browser"),
      color: String(form.get("color") ?? "#176b4c"),
      sort_order: Number(form.get("sort_order") ?? 0),
      published: form.get("published") === "on",
    };
    const result = editingProject
      ? await supabase.from("projects").update(values).eq("id", editingProject.id).select().single()
      : await supabase.from("projects").insert(values).select().single();
    if (result.error) return setStatus(`บันทึกไม่สำเร็จ: ${result.error.message}`);
    const row = result.data as Project;
    setProjects((current) => editingProject
      ? current.map((item) => item.id === row.id ? row : item)
      : [...current, row].sort((a, b) => a.sort_order - b.sort_order));
    setEditingProject(null);
    event.currentTarget.reset();
    setStatus("บันทึกเว็บไซต์เรียบร้อยแล้ว");
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !session) return;
    setStatus("กำลังบันทึก...");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    let coverPath = editingPost?.cover_path ?? null;
    const cover = form.get("cover");
    if (cover instanceof File && cover.size) {
      const extension = cover.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("post-images").upload(path, cover, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (upload.error) return setStatus(`อัปโหลดภาพไม่สำเร็จ: ${upload.error.message}`);
      coverPath = path;
    }
    const values = {
      title: String(form.get("title") ?? "").trim(),
      slug: slugify(String(form.get("slug") ?? "")),
      excerpt: String(form.get("excerpt") ?? "").trim(),
      content: String(form.get("content") ?? "").trim(),
      category: String(form.get("category") ?? "").trim(),
      cover_path: coverPath,
      published: form.get("published") === "on",
      published_at: new Date().toISOString(),
    };
    const result = editingPost
      ? await supabase.from("posts").update(values).eq("id", editingPost.id).select().single()
      : await supabase.from("posts").insert(values).select().single();
    if (result.error) return setStatus(`บันทึกไม่สำเร็จ: ${result.error.message}`);
    const row = result.data as Post;
    setPosts((current) => editingPost
      ? current.map((item) => item.id === row.id ? row : item)
      : [row, ...current]);
    setEditingPost(null);
    formElement.reset();
    setStatus(values.published ? "เผยแพร่เรื่องราวแล้ว" : "บันทึกฉบับร่างแล้ว");
  }

  async function saveSlide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !session) return;
    setStatus("กำลังอัปโหลดและบันทึกสไลด์...");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    let imagePath = editingSlide?.image_path ?? "";
    const image = form.get("image");

    if (image instanceof File && image.size) {
      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${session.user.id}/slides/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("post-images").upload(path, image, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (upload.error) return setStatus(`อัปโหลดภาพไม่สำเร็จ: ${upload.error.message}`);
      imagePath = path;
    }

    if (!imagePath) return setStatus("กรุณาเลือกรูปภาพสำหรับสไลด์");

    const values = {
      title: String(form.get("title") ?? "").trim(),
      caption: String(form.get("caption") ?? "").trim(),
      image_path: imagePath,
      link_url: String(form.get("link_url") ?? "").trim(),
      sort_order: Number(form.get("sort_order") ?? 0),
      published: form.get("published") === "on",
    };
    const result = editingSlide
      ? await supabase.from("slides").update(values).eq("id", editingSlide.id).select().single()
      : await supabase.from("slides").insert(values).select().single();
    if (result.error) return setStatus(`บันทึกไม่สำเร็จ: ${result.error.message}`);

    const row = result.data as Slide;
    setSlides((current) => (editingSlide
      ? current.map((item) => item.id === row.id ? row : item)
      : [...current, row]
    ).sort((a, b) => a.sort_order - b.sort_order));
    setEditingSlide(null);
    formElement.reset();
    setStatus(values.published ? "เพิ่มภาพในสไลด์แล้ว" : "บันทึกสไลด์แบบซ่อนไว้แล้ว");
  }

  async function remove(kind: Tab, id: string) {
    if (!supabase || !window.confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) return;
    const table = kind;
    const slideImage = kind === "slides" ? slides.find((item) => item.id === id)?.image_path : null;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return setStatus(`ลบไม่สำเร็จ: ${error.message}`);
    if (kind === "posts") setPosts((current) => current.filter((item) => item.id !== id));
    else if (kind === "projects") setProjects((current) => current.filter((item) => item.id !== id));
    else {
      setSlides((current) => current.filter((item) => item.id !== id));
      if (slideImage) await supabase.storage.from("post-images").remove([slideImage]);
    }
    setStatus("ลบรายการเรียบร้อยแล้ว");
  }

  return (
    <>
      <Seo title={`จัดการเว็บไซต์ | ${SITE_NAME}`} path="/admin" noIndex />
      <main className="admin-page">
      <header className="admin-topbar">
        <div><p>ห้องเรียนครูไต๋</p><strong>จัดการเว็บไซต์</strong></div>
        <div className="admin-account">
          <span>{session?.user.email}</span>
          <Link to="/">ดูหน้าเว็บไซต์</Link>
          <button onClick={signOut}>ออกจากระบบ</button>
        </div>
      </header>
      <div className="admin-shell">
        <section className="admin-hero">
          <div><p>ภาพรวม</p><h1>สวัสดีครับ ครูไต๋ 👋</h1><span>จัดการเว็บไซต์ เรื่องราว และสไลด์รูปภาพได้จากหน้านี้</span></div>
          <button className="admin-primary" onClick={() => { setTab("posts"); setEditingPost(null); }}>+ เขียนเรื่องราวใหม่</button>
        </section>
        <section className="admin-stats">
          <div><strong>{counts.posts}</strong><span>เรื่องราวทั้งหมด</span></div>
          <div><strong>{counts.published}</strong><span>เผยแพร่แล้ว</span></div>
          <div><strong>{counts.projects}</strong><span>เว็บไซต์ทั้งหมด</span></div>
          <div><strong>{counts.slides}</strong><span>รูปในสไลด์</span></div>
        </section>
        <div className="admin-tabs">
          <button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>เรื่องราว</button>
          <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>เว็บไซต์ของฉัน</button>
          <button className={tab === "slides" ? "active" : ""} onClick={() => setTab("slides")}>สไลด์รูปภาพ</button>
        </div>
        {status && <div className="admin-status">{status}</div>}
        {tab === "posts" ? (
          <div className="admin-grid">
            <AdminList
              title="เรื่องราวทั้งหมด"
              items={posts.map((post) => ({ id: post.id, title: post.title, meta: `${post.category} • /${post.slug}`, live: post.published }))}
              onEdit={(id) => setEditingPost(posts.find((post) => post.id === id) ?? null)}
              onRemove={(id) => remove("posts", id)}
            />
            <PostForm key={editingPost?.id ?? "new"} post={editingPost} onSubmit={savePost} onCancel={() => setEditingPost(null)} />
          </div>
        ) : tab === "projects" ? (
          <div className="admin-grid">
            <AdminList
              title="เว็บไซต์ทั้งหมด"
              items={projects.map((project) => ({ id: project.id, title: project.title, meta: project.category, live: project.published }))}
              onEdit={(id) => setEditingProject(projects.find((project) => project.id === id) ?? null)}
              onRemove={(id) => remove("projects", id)}
            />
            <ProjectForm key={editingProject?.id ?? "new"} project={editingProject} onSubmit={saveProject} onCancel={() => setEditingProject(null)} />
          </div>
        ) : (
          <div className="admin-grid">
            <AdminList
              title="รูปภาพในสไลด์"
              items={slides.map((slide) => ({ id: slide.id, title: slide.title || "รูปภาพไม่มีชื่อ", meta: `ลำดับ ${slide.sort_order}${slide.link_url ? " • มีลิงก์" : ""}`, live: slide.published }))}
              onEdit={(id) => setEditingSlide(slides.find((slide) => slide.id === id) ?? null)}
              onRemove={(id) => remove("slides", id)}
            />
            <SlideForm key={editingSlide?.id ?? "new"} slide={editingSlide} onSubmit={saveSlide} onCancel={() => setEditingSlide(null)} />
          </div>
        )}
      </div>
      </main>
    </>
  );
}

function AdminList({ title, items, onEdit, onRemove }: {
  title: string;
  items: Array<{ id: string; title: string; meta: string; live: boolean }>;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="admin-panel">
      <div className="panel-title"><h2>{title}</h2><span>{items.length} รายการ</span></div>
      <div className="admin-list">
        {!items.length && <p className="admin-empty">ยังไม่มีข้อมูล เริ่มเพิ่มรายการแรกได้เลย</p>}
        {items.map((item) => (
          <article className="admin-list-item" key={item.id}>
            <div><span className={`status-pill ${item.live ? "live" : ""}`}>{item.live ? "แสดงผล" : "ฉบับร่าง"}</span><h3>{item.title}</h3><p>{item.meta}</p></div>
            <div className="item-actions"><button onClick={() => onEdit(item.id)}>แก้ไข</button><button className="danger" onClick={() => onRemove(item.id)}>ลบ</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PostForm({ post, onSubmit, onCancel }: {
  post: Post | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form className="admin-panel editor-panel" onSubmit={onSubmit}>
      <div className="panel-title"><h2>{post ? "แก้ไขเรื่องราว" : "เรื่องราวใหม่"}</h2></div>
      <label>ชื่อเรื่อง<input name="title" defaultValue={post?.title} required /></label>
      <div className="form-row">
        <label>ลิงก์ภาษาอังกฤษ<input name="slug" defaultValue={post?.slug} placeholder="my-first-story" required /></label>
        <label>หมวดหมู่<input name="category" defaultValue={post?.category ?? "บันทึกของครู"} required /></label>
      </div>
      <label>ข้อความเกริ่น<textarea name="excerpt" rows={3} defaultValue={post?.excerpt} required /></label>
      <label>เนื้อหา<textarea name="content" rows={9} defaultValue={post?.content} required /></label>
      <label>ภาพปก<input name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /></label>
      <label className="check-label"><input name="published" type="checkbox" defaultChecked={post?.published} /> เผยแพร่บนหน้าเว็บไซต์</label>
      <div className="form-actions">{post && <button type="button" className="admin-secondary" onClick={onCancel}>ยกเลิก</button>}<button className="admin-primary" type="submit">บันทึกเรื่องราว</button></div>
    </form>
  );
}

function ProjectForm({ project, onSubmit, onCancel }: {
  project: Project | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form className="admin-panel editor-panel" onSubmit={onSubmit}>
      <div className="panel-title"><h2>{project ? "แก้ไขเว็บไซต์" : "เพิ่มเว็บไซต์"}</h2></div>
      <label>ชื่อเว็บไซต์<input name="title" defaultValue={project?.title} required /></label>
      <label>คำอธิบาย<textarea name="description" rows={3} defaultValue={project?.description} required /></label>
      <label>ลิงก์เว็บไซต์<input name="url" type="url" defaultValue={project?.url} placeholder="https://" /></label>
      <div className="form-row">
        <label>หมวดหมู่<input name="category" defaultValue={project?.category ?? "ระบบโรงเรียน"} /></label>
        <label>ไอคอน<select name="icon" defaultValue={project?.icon ?? "browser"}><option value="browser">หน้าต่างเว็บ</option><option value="users">ผู้ใช้งาน</option><option value="shirt">เสื้อ</option><option value="sparkle">ประกาย</option></select></label>
      </div>
      <div className="form-row">
        <label>สีประจำการ์ด<input name="color" type="color" defaultValue={project?.color ?? "#176b4c"} /></label>
        <label>ลำดับ<input name="sort_order" type="number" min="0" defaultValue={project?.sort_order ?? 0} /></label>
      </div>
      <label className="check-label"><input name="published" type="checkbox" defaultChecked={project?.published ?? true} /> แสดงบนหน้าเว็บไซต์</label>
      <div className="form-actions">{project && <button type="button" className="admin-secondary" onClick={onCancel}>ยกเลิก</button>}<button className="admin-primary" type="submit">บันทึกเว็บไซต์</button></div>
    </form>
  );
}

function SlideForm({ slide, onSubmit, onCancel }: {
  slide: Slide | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form className="admin-panel editor-panel" onSubmit={onSubmit}>
      <div className="panel-title"><h2>{slide ? "แก้ไขสไลด์" : "เพิ่มรูปในสไลด์"}</h2></div>
      <label>
        รูปภาพ {slide ? "(เว้นไว้หากไม่ต้องการเปลี่ยน)" : ""}
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required={!slide} />
      </label>
      <label>หัวข้อบนภาพ<input name="title" defaultValue={slide?.title} placeholder="เว้นว่างได้" maxLength={180} /></label>
      <label>คำอธิบาย<textarea name="caption" rows={3} defaultValue={slide?.caption} placeholder="เว้นว่างได้" maxLength={400} /></label>
      <label>ลิงก์เมื่อกดรูป<input name="link_url" type="url" defaultValue={slide?.link_url} placeholder="https:// (เว้นว่างได้)" /></label>
      <label>ลำดับ<input name="sort_order" type="number" min="0" defaultValue={slide?.sort_order ?? 0} /></label>
      <label className="check-label"><input name="published" type="checkbox" defaultChecked={slide?.published ?? true} /> แสดงในสไลด์หน้าเว็บไซต์</label>
      <div className="form-actions">
        {slide && <button type="button" className="admin-secondary" onClick={onCancel}>ยกเลิก</button>}
        <button className="admin-primary" type="submit">บันทึกสไลด์</button>
      </div>
    </form>
  );
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9ก-๙]+/g, "-").replace(/^-+|-+$/g, "");
}
