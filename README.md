# UTSAVPILOT

> **"Plan the celebration. We’ll handle the complexity."**

UtsavPilot is a GenAI-powered planning assistant built for the **Virtual PromptWars 2026** competition by **Hack2Skill**. It transforms celebration requirements (weddings, birthdays, community festivals, and social gatherings) into personalized, budget-aware event plans in seconds.

---

## 🌟 Key Features

1. **Intelligent Event Creation Wizard**:
   - Captures Event Type, Celebration Date, City/Location, Guest Count, Budget in INR (₹), Style/Vibe, and Food Preferences.
   - Built-in real-time cost-per-guest metrics and feasibility checks.
   - 1-click competition presets (`50k Birthday`, `2 Lakh Wedding`, `80k Community`, `10k Edge Case`).

2. **Server-Side Gemini Generation**:
   - Multi-step loading state communicating real-time AI progression (*Understanding event...* ➔ *Building budget...* ➔ *Creating timeline...* ➔ *Preparing vendor checklist...*).
   - Generates structured JSON matching celebration parameters and market standards.

3. **Complete Celebration Dashboard**:
   - **Overview**: Concept description, tailored fit explanation, and contingency risks.
   - **Budget**: Total Budget, Estimated Spending, Buffer Reserve, visual segmented allocation bar, line-item rationale, and actionable saving suggestions.
   - **Timeline**: Milestone preparation schedules mapped to reverse-engineered calendar dates with interactive checkable tasks.
   - **Vendors**: Checklist covering Venue, Catering, Decor, Photography, Entertainment, and Cake with interactive status toggles (`Not Started` ➔ `In Contact` ➔ `Booked`) and live booked counters.
   - **Ideas**: Curated aesthetic themes, decor palettes, culinary highlights, and guest activities.

4. **Dynamic AI Refinement ("Ask Utsav AI")**:
   - Live Gemini refinement area allowing users to adjust budgets (e.g., *"Actually, my budget is only ₹40,000. Adjust the plan."*), switch culinary menus, or modify entertainment.
   - Recalculates the entire structured plan and displays a prominent **"AI Refinement Applied"** banner explaining the exact changes made.

5. **Edge-Case Feasibility Handling**:
   - Detects mathematically unrealistic constraints (e.g. ₹10,000 for 200 guests).
   - Displays clear caution alerts with 5 practical strategic alternatives.

6. **Browser LocalStorage & Print Ready**:
   - Automatically saves generated plans locally with full page-reload persistence.
   - Clean `@media print` styling for clean, physical judging handouts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Version 16)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Intelligence**: [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai` v2.30.0)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Persistence**: Browser `localStorage` (No external database required)

---

## 🔑 Environment Variables

To run with live Gemini AI generation, create a `.env.local` file in the project root:

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

### 🔒 Security Guarantee:
- `GEMINI_API_KEY` is accessed **strictly on the server-side** in API routes (`src/app/api/generate-plan/route.ts` and `src/app/api/refine-plan/route.ts`).
- It is **never** exposed to client-side code and has **no** `NEXT_PUBLIC` prefix.
- `.env*` files are included in `.gitignore`.

---

## 🚀 Local Setup & Running Locally

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and add your Google Gemini API key:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build & Local Production Run

To build and run the production bundle locally:

```bash
# 1. Build optimized production bundle
npm run build

# 2. Start production server
npm run start
```

---

## ☁️ Vercel Deployment Instructions

Deploying UtsavPilot to Vercel is seamless:

1. **Push your repository** to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" ➔ "Project"**.
3. **Import** your `utsavpilot-promptwars-2026` repository.
4. **Configure Environment Variables**:
   Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *Your Gemini API Key from Google AI Studio*
   - Check all environments (**Production**, **Preview**, **Development**).
5. Click **"Deploy"**.

Vercel will run `npm run build` and deploy the application with zero additional configuration needed.

---

## 🤖 Gemini API Setup Guide

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account and click **"Create API Key"**.
3. Copy the key and paste it as `GEMINI_API_KEY` in:
   - `.env.local` (for local development)
   - Vercel Project Settings ➔ Environment Variables (for production deployment).
