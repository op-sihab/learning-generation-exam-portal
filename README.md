# 🎓 Learning Generation | Next-Gen CBT Exam Portal

A high-performance, responsive online examination and practice portal built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. Designed for SSC, HSC, and University Admission test prep with Bengali typography, KaTeX LaTeX math/chemistry rendering, anti-cheat mechanisms, and an admin question studio.

---

## ✨ Features

- 🖥️ **Live CBT Exam Room**:
  - Timed examination engine with visual countdown and pulsing alerts.
  - **Anti-Cheat Monitoring**: Window blur, fullscreen exit, and tab-switching tracking with 3-strike warning and auto-submission.
  - **Keyboard Navigation**: Press keys `1`–`4` for quick option selection and `M` to mark/unmark for review.
  - Interactive question palette with filters (All, Answered, Unanswered, Marked).
  - Auto-saving state: Resume interrupted exams seamlessly.
- 💡 **Practice Mode**: Instant question-by-question feedback, KaTeX math/chemistry explanations, and formula derivations.
- 📊 **Analytics & Mistake Bank**:
  - Accuracy gauge, SVG trendline charts, and a 14-day study activity grid.
  - Detailed historical attempts log with review modes.
- 🏆 **Leaderboard & Merit List**:
  - Top 3 podium display, personal user rank badge, and searchable merit list.
- 🛠️ **Admin Studio & Bulk Importer**:
  - Exam creation and question management.
  - **Bulk Import**: Directly import questions from DOCX (via Mammoth), CSV, TXT, or JSON.
  - Visual formula editor palette for Math, Physics, and Chemistry formulas.
  - System-wide announcement banner and maintenance mode controls.
- 🎨 **Bengali Typography & Theming**:
  - Native Bengali numbers and date/time formatting.
  - Clean light and dark mode with persistent user preferences.
  - Realistic Web Audio API synthesized sound effects.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Document Parsing**: [Mammoth](https://github.com/mwilliamson/mammoth.js), [JSZip](https://stuk.github.io/jszip/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Runtime**: [Bun](https://bun.sh/) / Node.js

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/op-sihab/learning-generation-exam-portal.git
cd learning-generation-exam-portal
```

### 2. Install dependencies
```bash
bun install
# or
npm install
```

### 3. Run development server
```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

```bash
bun run build
bun start
```

---

## 📄 License
MIT © Learning Generation
