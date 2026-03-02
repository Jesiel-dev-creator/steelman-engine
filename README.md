# The Steelman Engine

A Next.js app that steelmans any argument or opinion using the Anthropic API. Paste your argument, click "Steelman It", and get three sections: **The Steelman**, **The Counter-Steelman**, and **The Kernel**.

## Setup

1. **Install dependencies** (already done if you cloned):
   ```bash
   npm install
   ```

2. **Add your Anthropic API key**  
   Copy `.env.example` to `.env.local` and add your key:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and set `ANTHROPIC_API_KEY` to your key from [console.anthropic.com](https://console.anthropic.com/).

3. **Run the dev server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and paste any argument to steelman it.

## Tech Stack

- **Next.js 16** with App Router
- **Tailwind CSS** for styling
- **Anthropic API** (Claude) for analysis
