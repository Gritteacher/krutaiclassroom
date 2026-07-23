import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return setMessage("ยังไม่ได้เชื่อมต่อ Supabase");
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    navigate("/admin", { replace: true });
  }

  return (
    <Layout footer={false}>
      <main className="login-page">
        <section className="login-card">
          <p className="section-kicker">สำหรับผู้ดูแล</p>
          <h1>เข้าสู่ระบบหลังบ้าน</h1>
          <p>ใช้บัญชีที่สร้างไว้ใน Supabase เพื่อจัดการเว็บไซต์และเรื่องราว</p>
          {!isSupabaseConfigured && (
            <div className="notice warning">
              เวอร์ชันนี้ยังไม่ได้ใส่ Project URL และ Publishable Key ของ Supabase
            </div>
          )}
          <form onSubmit={submit}>
            <label>อีเมล<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            <label>รหัสผ่าน<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
            {message && <div className="notice error">{message}</div>}
            <button className="admin-primary full" type="submit" disabled={busy || !isSupabaseConfigured}>
              {busy ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
          <Link className="back-link login-back" to="/">← กลับหน้าเว็บไซต์</Link>
        </section>
      </main>
    </Layout>
  );
}
