# ห้องเรียนครูไต๋

เว็บไซต์รวมระบบ ผลงาน และเรื่องราวของครูไต๋

## สถาปัตยกรรม

- React + Vite
- GitHub เก็บ source code
- Netlify build และ host หน้าเว็บไซต์
- Supabase Database เก็บเว็บไซต์และบทความ
- Supabase Auth ป้องกันหน้า `/admin`
- Supabase Storage เก็บภาพปก
- Row Level Security จำกัดการเขียนข้อมูลเฉพาะผู้ดูแล

## ตั้งค่า Supabase

1. สร้าง Supabase Project ใหม่
2. เปิด **SQL Editor**
3. คัดลอกไฟล์ `supabase/migrations/001_initial_schema.sql` ไปรันทั้งหมดหนึ่งครั้ง
4. ไปที่ **Authentication → Users → Add user**
5. สร้างผู้ใช้ด้วยอีเมล `gritsana.th@gmail.com` และตั้งรหัสผ่านที่คาดเดายาก
6. อย่าส่งรหัสผ่านหรือ `service_role` key ให้บุคคลอื่น

Migration จะเพิ่มบัญชีอีเมลนี้เข้าสู่ตารางผู้ดูแลให้อัตโนมัติ

## ตัวแปรแวดล้อม

คัดลอก `.env.example` เป็น `.env.local` สำหรับการพัฒนา:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

ค่า Publishable/Anon key ถูกออกแบบให้ใช้ใน browser ได้ ความปลอดภัยของข้อมูลยังบังคับด้วย RLS ห้ามนำ `service_role` key ใส่ในโปรเจกต์นี้

## พัฒนาในเครื่อง

```bash
npm install
npm run dev
```

ตรวจสอบก่อนเผยแพร่:

```bash
npm run build
```

## เผยแพร่ผ่าน Netlify

1. Push โครงการนี้ไปยัง Public GitHub Repository
2. ใน Netlify เลือก **Add new site → Import an existing project → GitHub**
3. เลือก Repository นี้
4. Build command และ Publish directory จะอ่านจาก `netlify.toml`
5. เพิ่ม Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy site
7. นำโดเมน Netlify ไปเพิ่มใน Supabase ที่ **Authentication → URL Configuration**
   - Site URL: `https://YOUR-SITE.netlify.app`
   - Redirect URL: `https://YOUR-SITE.netlify.app/**`

## ความปลอดภัย

- คนทั่วไปอ่านเฉพาะข้อมูลที่ `published = true`
- ผู้ใช้ที่เข้าสู่ระบบแต่ไม่อยู่ใน `app_admins` แก้ไขข้อมูลไม่ได้
- รูปภาพรับเฉพาะ JPG, PNG, WEBP และ GIF ขนาดไม่เกิน 8 MB
- เฉพาะผู้ดูแลเท่านั้นที่อัปโหลด แก้ไข หรือลบภาพได้
