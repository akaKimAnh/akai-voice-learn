# 🎙️ AKAI AI Voice Learning & Interview Partner

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E7CC3?logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **AKAI AI Voice Learning** là ứng dụng web di động tương tác giọng nói bằng trí tuệ nhân tạo (AI Voice Chat), hỗ trợ người học rèn luyện phản xạ giao tiếp tiếng Anh, luyện phỏng vấn xin việc theo kịch bản/Mô tả công việc (JD), tra cứu & lưu trữ từ vựng thông minh, và theo dõi tiến trình học tập mỗi ngày.

---

## ✨ Features / Tính Năng Nổi Bật

### 🎙️ 1. AI Voice Chat Room (Luyện Nói Thời Gian Thực)
- **Tương tác giọng nói trực tiếp**: Nói chuyện với AI bản xứ bằng tiếng Anh với phản hồi tự nhiên qua công nghệ Text-to-Speech (TTS).
- **Sửa lỗi & Gợi ý phản xạ (AI Feedback)**: Ngay sau mỗi câu thoại, AI tự động phân tích ngữ pháp, nhịp điệu và đưa ra gợi ý nâng cao câu trả lời.
- **Chế độ thoại linh hoạt**: Chuyển đổi qua lại mượt mà giữa nói qua Micro và nhập văn bản qua bàn phím.

### 📖 2. Tra Từ Nhanh & Kho Từ Vựng (Vocabulary Vault)
- **Tra từ 1-touch**: Nhấp trực tiếp vào bất kỳ từ tiếng Anh nào trong hội thoại để xem nghĩa Tiếng Việt, phiên âm IPA, loại từ và câu ví dụ.
- **Lưu từ vựng thông minh**: Lưu từ mới vào **Kho Từ Vựng (Vault)** cá nhân chỉ với một chạm.
- **Luyện đọc & Quản lý**: Lắng nghe âm mẫu chuẩn, quản lý danh sách từ vựng đã tích lũy và thêm từ mới thủ công.

### 💼 3. Kịch Bản Luyện Tập Đa Dạng (Practice Scenarios & Custom JD)
- **Kịch bản phong phú**:
  - 💼 Phỏng vấn xin việc (Job Interview Practice)
  - 🤝 Phỏng vấn hành vi (Behavioral Interview)
  - ☕ Gọi đồ uống & Small Talk (Coffee Shop Order)
  - ✈️ Thủ tục sân bay & Khách sạn (Airport & Hotel Check-in)
- **Tùy chỉnh JD (Upload Job Description)**: Nhập hoặc dán mô tả công việc (JD) để AI đóng vai nhà tuyển dụng và đặt các câu hỏi phỏng vấn chuẩn theo từng vị trí mong muốn.

### 🌐 4. Đa Ngôn Ngữ & Giao Diện Tối Ưu (UI & Localization)
- **Hỗ trợ Song ngữ Anh - Việt (EN / VI)**: Chuyển đổi ngôn ngữ hiển thị giao diện và hướng dẫn phản hồi AI nhanh chóng qua nút bấm quốc kỳ (🇺🇸 / 🇻🇳).
- **Phông chữ Quicksand**: Thiết kế bo tròn mềm mại, hiện đại, tối ưu trải nghiệm học tập trên cả điện thoại và máy tính.
- **Theo dõi Chuỗi Học Tập (Daily Streak)**: Tự động ghi nhận ngày luyện tập liên tục và tổng số từ vựng tích lũy.

### ☁️ 5. Đồng Bộ Đám Mây & Bảo Mật (Firebase Backend)
- **Lưu trữ dữ liệu Firestore**: Lưu lịch sử cuộc thoại, tiến trình học và kho từ vựng cá nhân an toàn trên đám mây.
- **Đăng nhập đơn giản**: Tạo tài khoản và đồng bộ dữ liệu dễ dàng.

---

## 🛠️ Tech Stack / Công Nghệ Sử Dụng

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Quicksand Font
- **AI Integration**: Google `@google/genai` SDK (Gemini 2.5 Flash Model)
- **Database & Auth**: Google Cloud Firestore & Firebase Auth
- **Audio & Speech**: Web Speech API (Speech Synthesis & Speech Recognition)
- **CI/CD & Hosting**: GitHub Actions, GitHub Pages / Cloud Run

---

## 📁 Project Structure / Cấu Trúc Dự Án

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD GitHub Actions Workflow
├── src/
│   ├── components/             # Các React UI component (Voice Chat, Vocabulary, Profile...)
│   ├── context/                # AuthContext & LanguageContext
│   ├── hooks/                  # Custom Hook useRealtimeVoiceChat
│   ├── services/               # Firestore Service & Gemini AI Client Service
│   ├── utils/                  # Speech Synthesis, Streak Tracker
│   ├── types.ts                # TypeScript Types & Interfaces
│   ├── App.tsx                 # App Root Component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global CSS & Quicksand font setup
├── server.ts                   # Express server fallback for API proxy
├── vite.config.ts              # Vite configuration
└── package.json                # Project dependencies and scripts
```

---

## 🚀 Local Development / Hướng Dẫn Chạy Cục Bộ

### 1. Yêu cầu hệ thống
- Node.js >= 18.x
- npm / yarn / bun

### 2. Cài đặt & Chạy ứng dụng

```bash
# 1. Clone repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Cài đặt thư viện
npm install

# 3. Tạo file cấu hình môi trường (.env)
cp .env.example .env

# Điền Gemini API Key của bạn vào .env:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 4. Chạy ứng dụng ở chế độ phát triển (Development)
npm run dev
```

Mở trình duyệt tại đường dẫn `http://localhost:3000`.

---

## 🌐 Deploy to GitHub Pages (Tự Động Với GitHub Actions)

Dự án đã tích hợp sẵn **GitHub Actions** tự động build và deploy lên **GitHub Pages**.

### Các bước thiết lập đơn giản:

1. **Thêm Gemini API Key vào GitHub Secret**:
   - Mở Repository của bạn trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
   - Bấm **New repository secret**.
   - **Name**: `GEMINI_API_KEY`
   - **Secret**: *(Dán Gemini API Key của bạn vào đây)*
   - Bấm **Add secret**.

2. **Kích hoạt GitHub Pages**:
   - Vào **Settings** -> **Pages**.
   - Tại mục **Source**, chọn **GitHub Actions**.

3. **Hoàn tất!**
   - Mỗi lần bạn push code mới lên nhánh `main` / `master`, GitHub Actions sẽ tự động kiểm tra, đóng gói ứng dụng và phát hành lên trang web GitHub Pages của bạn.

---

## 📝 License

Dự án được phân phối dưới giấy phép **MIT License**.
