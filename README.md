# LINE Daily Checklist Bot — Echo Bot เริ่มต้น

บอททดสอบพื้นฐาน: รับข้อความจากกลุ่มไลน์ แล้วตอบกลับข้อความเดิม (echo)
เป้าหมายคือพิสูจน์ว่า Webhook เชื่อมต่อได้ถูกต้อง ก่อนต่อยอดเป็นระบบสรุปรายงาน

## วิธีรันบนเครื่องตัวเอง (ทดสอบก่อน deploy)

```bash
npm install
cp .env.example .env
# แก้ไข .env ใส่ค่า token/secret จริง
npm start
```

Server จะรันที่ `http://localhost:3000`
(แต่ localhost อย่างเดียว LINE ยิง webhook มาไม่ถึง ต้อง deploy ขึ้น cloud ก่อน หรือใช้ ngrok เพื่อทดสอบ)

## วิธี Deploy ขึ้น Railway (แนะนำสำหรับมือใหม่ ฟรี)

1. สมัครบัญชีที่ https://railway.app (login ด้วย GitHub ได้เลย)
2. อัปโหลดโค้ดนี้ขึ้น GitHub repo (ถ้ายังไม่มี ให้สร้าง repo ใหม่แล้ว push โค้ดขึ้นไป)
3. ใน Railway กด **New Project → Deploy from GitHub repo** แล้วเลือก repo นี้
4. ไปที่แท็บ **Variables** ใส่ค่า 2 ตัว:
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
5. Railway จะ build และ deploy อัตโนมัติ พอเสร็จจะได้ URL เช่น
   `https://your-app-name.up.railway.app`
6. Webhook URL ที่ต้องเอาไปใส่ใน LINE Developers Console คือ:
   `https://your-app-name.up.railway.app/webhook`

## วิธีตั้งค่าใน LINE Developers Console

1. เข้า Channel (Messaging API) ของคุณ → แท็บ **Messaging API**
2. ช่อง **Webhook URL** ใส่ URL ข้างต้น (ต้องมี `/webhook` ต่อท้าย)
3. กด **Verify** ต้องขึ้น ✅ Success
4. เปิด toggle **Use webhook** เป็น ON
5. ปิด **Auto-reply messages** และ **Greeting messages** ใน LINE Official Account Manager
   (Settings → Response settings) เพื่อไม่ให้ตีกับบอทที่เราเขียนเอง

## ทดสอบ

1. เพิ่มบอทเป็นเพื่อนใน LINE (สแกน QR จาก OA Manager หรือ Console)
2. ลองพิมพ์ข้อความคุยกับบอท (แชทส่วนตัวก่อน) → ควรได้รับข้อความตอบกลับ echo
3. เชิญบอทเข้ากลุ่มทดสอบ แล้วลองพิมพ์ในกลุ่ม → ควรตอบกลับเหมือนกัน

ถ้าทำถึงข้อ 3 สำเร็จ แปลว่าโครงสร้างพื้นฐานพร้อมแล้ว
ขั้นตอนต่อไปคือเพิ่ม logic ตรวจจับ pattern รายงาน + เก็บ database + คำสั่งสรุปงาน
