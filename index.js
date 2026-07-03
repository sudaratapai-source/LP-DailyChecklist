// index.js
// LINE Echo Bot - จุดเริ่มต้นสำหรับทดสอบว่า Webhook เชื่อมต่อได้จริง
// หลังจากทดสอบผ่านแล้ว ค่อยต่อยอดเป็นระบบตรวจจับ/สรุปรายงาน

const express = require('express');
const line = require('@line/bot-sdk');

// ตั้งค่าจาก LINE Developers Console (Messaging API tab)
// อย่า hardcode ค่าจริงในโค้ด ให้ตั้งเป็น Environment Variables ตอน deploy
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

// LINE middleware จะตรวจสอบลายเซ็น (signature) ให้อัตโนมัติ
// ป้องกันไม่ให้คนอื่นปลอมแปลง request มาที่ webhook ของเรา
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// จัดการแต่ละ event ที่ LINE ส่งมา
async function handleEvent(event) {
  // สนใจแค่ event ประเภท "ข้อความ" ที่เป็นข้อความตัวอักษร
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const receivedText = event.message.text;
  const sourceType = event.source.type; // 'user', 'group', หรือ 'room'

  console.log(`ได้รับข้อความ: "${receivedText}" จาก ${sourceType}`);

  // ตอบกลับข้อความเดิม (echo) เพื่อพิสูจน์ว่าเชื่อมต่อสำเร็จ
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `บอทได้รับข้อความแล้ว: ${receivedText}`,
  });
}

// endpoint สำหรับเช็คว่า server ยังทำงานอยู่ (ใช้ทดสอบผ่าน browser ได้)
app.get('/', (req, res) => {
  res.send('LINE Bot server กำลังทำงานอยู่ครับ');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
