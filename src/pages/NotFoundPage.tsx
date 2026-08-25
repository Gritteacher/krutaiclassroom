import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Seo, { SITE_NAME } from "../components/Seo";

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo title={`ไม่พบหน้าที่ต้องการ | ${SITE_NAME}`} path={window.location.pathname} noIndex />
      <main className="article-shell empty-state">
        <p className="section-kicker">404</p>
        <h1>ไม่พบหน้าที่ต้องการ</h1>
        <p>ลองกลับไปเลือกเว็บไซต์หรืออ่านเรื่องราวจากหน้าแรก</p>
        <Link className="button primary" to="/">กลับหน้าแรก</Link>
      </main>
    </Layout>
  );
}
