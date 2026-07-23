import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { PencilSpark } from "../components/SvgArt";
import { getPublishedPosts } from "../lib/content";
import { formatThaiDate } from "../lib/format";
import { publicCoverUrl } from "../lib/supabase";
import type { Post } from "../lib/types";

export default function StoriesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <main className="stories-section">
        <div className="section shell">
          <div className="section-head">
            <div><p className="section-kicker">สมุดบันทึก</p><h1 className="listing-title">เรื่องราวทั้งหมด</h1></div>
            <p className="section-note">บันทึกจากห้องเรียน เทคโนโลยี และสิ่งที่ได้เรียนรู้ระหว่างทาง</p>
          </div>
          {loading ? (
            <div className="loading-grid"><span /><span /><span /></div>
          ) : (
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
          )}
        </div>
      </main>
    </Layout>
  );
}
