import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function NotFoundPage() {
  return (
    <Layout>
      <main className="article-shell empty-state">
        <p className="section-kicker">404</p>
        <h1>ไม่พบหน้าที่ต้องการ</h1>
        <p>ลองกลับไปเลือกเว็บไซต์หรืออ่านเรื่องราวจากหน้าแรก</p>
        <Link className="button primary" to="/">กลับหน้าแรก</Link>
      </main>
    </Layout>
  );
}
