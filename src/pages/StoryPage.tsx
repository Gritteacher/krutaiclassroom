import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Seo, { SITE_NAME, SITE_URL } from "../components/Seo";
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

  if (post === undefined) return <Layout><Seo title={`กำลังโหลด | ${SITE_NAME}`} path={`/stories/${slug}`} noIndex /><main className="article-shell"><p>กำลังโหลดเรื่องราว...</p></main></Layout>;
  if (!post) return <NotFoundArticle />;

  const coverUrl = publicCoverUrl(post.cover_path);
  const articleUrl = `${SITE_URL}/stories/${encodeURIComponent(post.slug)}`;
  const articleData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    datePublished: post.published_at,
    dateModified: post.updated_at ?? post.published_at,
    inLanguage: "th-TH",
    author: { "@type": "Person", name: "กฤษณพล ทองอุ่น", alternateName: "ครูไต๋" },
    publisher: { "@type": "Person", name: "กฤษณพล ทองอุ่น", alternateName: "ครูไต๋" },
  };
  if (coverUrl) articleData.image = [coverUrl];

  return (
    <Layout>
      <Seo
        title={`${post.title} | ${SITE_NAME}`}
        description={post.excerpt}
        path={`/stories/${post.slug}`}
        image={coverUrl}
        type="article"
        structuredData={articleData}
      />
      <article className="article-shell">
        <Link className="back-link" to="/stories">← กลับไปหน้าเรื่องราว</Link>
        <p className="section-kicker">{post.category}</p>
        <h1>{post.title}</h1>
        <div className="story-meta article-meta"><time>{formatThaiDate(post.published_at, true)}</time><span>ครูไต๋ กฤษณพล ทองอุ่น</span></div>
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
      <Seo title={`ไม่พบเรื่องราว | ${SITE_NAME}`} path="/stories/not-found" noIndex />
      <main className="article-shell empty-state">
        <h1>ไม่พบเรื่องราว</h1>
        <p>เรื่องราวนี้อาจถูกย้ายหรือยังไม่ได้เผยแพร่</p>
        <Link className="button primary" to="/stories">ดูเรื่องราวทั้งหมด</Link>
      </main>
    </Layout>
  );
}
