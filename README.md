# Surviant UI

> Modern, high-performance web experience for **Surviant** — software, AI engineering, and systems development firm based across the Bay Area and India.

---

## 🌟 Overview

Surviant UI is an architectural, state-of-the-art landing and portfolio platform engineered with high visual fidelity, custom WebGL shader art, precision typography, and inertia-driven physics scrolling.

### Key Highlights
- **WebGL & Three.js Shaders**: Dynamic procedural background wave distortion using `@react-three/fiber` and custom GLSL vertex/fragment shaders.
- **Inertia Smooth Scrolling**: Native GSAP ticker integration with `lenis` for 60fps smooth scrolling synchronized with ScrollTrigger.
- **Micro-interactions & Typography Masks**: Precision staggered reveals powered by GSAP `SplitText` with custom masks and metallic gradients.
- **Blueprint Industrial Aesthetic**: Deep monochrome palette (`#070708` void), subtle film grain, dynamic cursor spotlight lighting, and blueprint dot grid overlays.

---

## 🛠️ Tech Stack

- **Core Framework**: React 19, TypeScript
- **Bundler & Tooling**: Vite 8, Tailwind CSS v4
- **3D & WebGL**: Three.js, React Three Fiber
- **Animation & Motion**: GSAP 3.15, ScrollTrigger, SplitText, @gsap/react
- **Smooth Scrolling**: Lenis
- **Typography**: IBM Plex Sans, IBM Plex Mono, Instrument Serif
- **Icons**: Lucide React

---

## 📂 Project Structure

```text
surviant-ui/
├── public/                 # Static public assets
│   └── images/             # Web-optimized imagery and brand marks
├── src/
│   ├── components/         # Modular UI section components
│   │   ├── Contact.tsx     # Project inquiry and consultation
│   │   ├── Footer.tsx      # Global footer with live system indicator
│   │   ├── Header.tsx      # Sticky responsive navigation bar
│   │   ├── Hero.tsx        # Dynamic hero with 3D canvas integration
│   │   ├── HowWeWork.tsx   # Seven-stage engineering workflow
│   │   ├── Leadership.tsx  # Executive profiles and bios
│   │   ├── Marquee.tsx     # Infinite tech stack carousel
│   │   ├── RecentWork.tsx  # Interactive project portfolio
│   │   ├── Result.tsx      # Quantified business metrics
│   │   ├── Services.tsx    # Core practices and capabilities
│   │   ├── WhySurviant.tsx # Architectural pillars and values
│   │   └── ui.tsx          # Design system button and badge primitives
│   ├── data/
│   │   └── projects.ts     # Case studies and client projects data
│   ├── lib/
│   │   ├── motion.ts       # Lenis smooth scroll & GSAP ticker controller
│   │   └── useReveals.ts   # ScrollTrigger reveal animation hooks
│   ├── three/
│   │   └── ShaderBackdrop.tsx # WebGL procedural shader canvas
│   ├── App.tsx             # Root application assembly & edge rails
│   ├── content.ts          # Centralized copy and editorial content
│   ├── index.css           # Tailwind v4 theme, tokens & utilities
│   └── main.tsx            # Application entry & font imports
├── index.html              # HTML5 entry with SEO tags
├── package.json            # Project manifest & dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ishaansatapathy/surviant_ui.git

# Navigate into project directory
cd surviant_ui

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 📄 License

Private repository. Copyright © 2026 Surviant. All rights reserved.
