# ห้องเรียนครูไต๋

เว็บไซต์รวมระบบ ผลงาน และเรื่องราวของครูไต๋

## สถาปัตยกรรม

- React + Vite
- GitHub เก็บ source code
- Cloudflare Pages build และ host หน้าเว็บไซต์
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

## เผยแพร่ผ่าน Cloudflare Pages

1. Push โครงการนี้ไปยัง Public GitHub Repository
2. ใน Cloudflare เลือก **Workers & Pages → Create → Pages → Connect to Git**
3. เลือก Repository นี้และ branch `main`
4. ตั้ง Build command เป็น `npm run build` และ Build output directory เป็น `dist`
5. เพิ่ม Environment variables สำหรับ Production และ Preview:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy site
7. เพิ่ม Custom domain `gritspace.cc`
8. เพิ่มโดเมนใน Supabase ที่ **Authentication → URL Configuration**
   - Site URL: `https://gritspace.cc`
   - Redirect URL: `https://gritspace.cc/**`

Cloudflare Pages ใช้ไฟล์ใน `functions/` สำหรับ Pages Functions, ใช้
`public/_headers` สำหรับ response headers และใช้ `public/_routes.json` เพื่อให้
เฉพาะ `/sitemap.xml` เรียก Pages Function

## ความปลอดภัย

- คนทั่วไปอ่านเฉพาะข้อมูลที่ `published = true`
- ผู้ใช้ที่เข้าสู่ระบบแต่ไม่อยู่ใน `app_admins` แก้ไขข้อมูลไม่ได้
- รูปภาพรับเฉพาะ JPG, PNG, WEBP และ GIF ขนาดไม่เกิน 8 MB
- เฉพาะผู้ดูแลเท่านั้นที่อัปโหลด แก้ไข หรือลบภาพได้
