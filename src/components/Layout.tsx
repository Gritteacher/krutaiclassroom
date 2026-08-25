import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookStack } from "./SvgArt";

export default function Layout({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" to="/" aria-label="ห้องเรียนครูไต๋ กฤษณพล ทองอุ่น หน้าแรก">
            <span className="brand-mark"><BookStack /></span>
            <span>ห้องเรียนครูไต๋ กฤษณพล ทองอุ่น</span>
          </Link>
          <nav aria-label="เมนูหลัก">
            <Link to="/#websites">เว็บไซต์</Link>
            <Link to="/stories">เรื่องราว</Link>
            <Link to="/#about">เกี่ยวกับ</Link>
          </nav>
        </div>
      </header>
      {children}
      {footer && (
        <footer>
          <div className="shell footer-wrap">
            <div className="footer-brand">
              <span className="brand-mark small"><BookStack /></span>
              <div>
                <strong>ห้องเรียนครูไต๋ กฤษณพล ทองอุ่น</strong>
                <p>เว็บไซต์ส่วนตัวของครูไต๋</p>
              </div>
            </div>
            <p>© {new Date().getFullYear()} ห้องเรียนครูไต๋ กฤษณพล ทองอุ่น</p>
          </div>
        </footer>
      )}
    </>
  );
}
