# Resume Tracker & ATS Analyzer

A modern web application for tracking job applications and analyzing resume compatibility with Applicant Tracking Systems (ATS). Get AI-powered feedback on your resumes and improve your chances of landing interviews.

## ✨ Features

- 📄 **Resume Upload & Management** - Upload and store multiple resumes
- 🎯 **ATS Score Analysis** - Get detailed ATS compatibility scores for your resumes
- 🤖 **AI-Powered Feedback** - Receive intelligent suggestions to improve your resume
- 📊 **Visual Analytics** - View scores with interactive charts and gauges
- 🔐 **Secure Authentication** - Built with Puter authentication system
- 🌓 **Dark Mode** - Beautiful UI with full dark mode support
- 💾 **Cloud Storage** - Resumes stored securely using Puter KV store
- 📱 **Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Authentication & Storage:** [Puter](https://puter.com/)
- **PDF Processing:** PDF.js
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd next-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
next-app/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication page
│   ├── resume/[id]/       # Individual resume details
│   ├── settings/          # User settings
│   ├── upload/            # Resume upload page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── NavBar.tsx        # Navigation component
│   ├── ResumeCard.tsx    # Resume display card
│   ├── ScoreGauge.tsx    # ATS score visualization
│   └── ...
├── lib/                   # Utility functions
│   ├── puter-store.ts    # Puter integration
│   ├── pdf2img.ts        # PDF processing
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions
```

## 🎨 Features in Detail

### Resume Analysis
- Upload resumes in various formats
- Automatic ATS scoring
- Detailed breakdown of strengths and weaknesses
- Actionable improvement suggestions

### Dashboard
- View all uploaded resumes at a glance
- Quick access to scores and feedback
- Sort and filter resumes
- Beautiful grid background with fade effects

### User Experience
- Smooth animations and transitions
- Loading states with visual feedback
- Toast notifications for user actions
- Intuitive navigation

## 🧩 Key Components

- **GridBackground** - Animated grid background pattern
- **ScoreGauge** - Visual ATS score display
- **FileUploader** - Drag-and-drop resume upload
- **ResumeCard** - Resume preview cards
- **NavBar** - Navigation with theme toggle

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Authentication

This app uses Puter for authentication and data storage. Users need to sign in to:
- Upload resumes
- View their resume history
- Access ATS scores and feedback

## 🌐 Deployment

The app can be deployed on any platform that supports Next.js:

- [Vercel](https://vercel.com/) (Recommended)
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- Self-hosted

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [Puter](https://puter.com/)
