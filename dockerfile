
# เลือกฐานที่จะใช้สำหรับภาพ Docker
FROM node:19.5.0-alpine

# ก๊าซพื้นที่โปรเจค Next.js จากโฟลเดอร์ปัจจุบันไปยัง /app ในภาพ
WORKDIR /app
COPY . .

# ติดตั้ง dependencies และ build โปรเจ็ค Next.js
RUN npm install
RUN npm run build

# ระบุพอร์ตที่ Next.js จะใช้ในการเปิดใช้งาน
EXPOSE 3000

# คำสั่งที่ใช้ในการเริ่มต้นแอปพลิเคชัน Next.js เมื่อภาพถูกเริ่มต้นขึ้น
CMD ["npm", "start"]
