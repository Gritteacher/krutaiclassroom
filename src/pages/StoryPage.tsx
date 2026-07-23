import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { PencilSpark } from "../components/SvgArt";
import { getPostBySlug } from "../lib/content";
import { formatThaiDate } from "../lib/format";
import { publicCoverUrl } from "../lib/supabase";
import type { Post } from "../lib/types";

export default function StoryPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    getPostBySlug(slug).then(setPost).catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) return <Layout><main className="article-shell"><p>กำลังโหลดเรื่องราว...</p></main></Layout>;
  if (!post) return <NotFoundArticle />;

  const coverUrl = publicCoverUrl(post.cover_path);
  return (
    <Layout>
      <article className="article-shell">
        <Link className="back-link" to="/stories">← กลับไปหน้าเรื่องราว</Link>
        <p className="section-kicker">{post.category}</p>
        <h1>{post.title}</h1>
        <div className="story-meta article-meta"><time>{formatThaiDate(post.published_at, true)}</time><span>ห้องเรียนครูไต๋</span></div>
        <p className="article-excerpt">{post.excerpt}</p>
        {coverUrl ? <img className="article-cover" src={coverUrl} alt="" /> : <div className="article-placeholder"><PencilSpark /></div>}
        <div className="article-content">{post.content}</div>
      </article>
    </Layout>
  );
}

function NotFoundArticle() {
  return (
    <Layout>
      <main className="article-shell empty-state">
        <h1>ไม่พบเรื่องราว</h1>
        <p>เรื่องราวนี้อาจถูกย้ายหรือยังไม่ได้เผยแพร่</p>
        <Link className="button primary" to="/stories">ดูเรื่องราวทั้งหมด</Link>
      </main>
    </Layout>
  );
}
