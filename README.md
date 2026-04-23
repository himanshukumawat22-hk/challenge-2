# VoteDost 🇮🇳 | Interactive Election Journey Simulator

**Google Prompt Wars: Challenge 2 Submission**

VoteDost is an ultra-lightweight, hyper-realistic **Decision-Based Journey Simulator** designed to demystify the Indian election process for first-time and rural voters. 

Instead of reading a boring government manual, users *live* through the election process via an interactive, chat-based simulation powered by **Google's Gemini AI** and **Firebase**.

🔗 **[Live Demo on Google Cloud Run](https://votedost-61372857831.us-central1.run.app)**

---

## 🛑 The Problem

*   **Information Overload**: Current resources dump walls of text. Young voters lose interest in complex jargon (e.g., "Form 6", "Electoral Roll").
*   **Booth Anxiety**: For many, the "Black Box" nature of the polling booth and the Electronic Voting Machine (EVM) causes significant stress.
*   **Consequence Disconnect**: Voters often skip voting because they don't see the direct, hyper-local consequences of missing documents or failing to register.

---

## 💡 The Solution: Google-Powered Decision Intelligence

We built **VoteDost**, a conversational web-app that replaces linear forms with a dynamic **Story Graph Engine**, heavily augmented by Google's state-of-the-art developer services.

### 1. Personalization & Context with Google Gemini 1.5 Flash
To keep the app under 10MB while providing world-class AI, we integrated Gemini directly into the frontend:
*   **Decision Awareness**: Every choice (e.g., "I moved city", "I lost my card") updates a hidden **Preparedness Score**. 
*   **Contextual Dialogue**: Gemini rewrites responses on-the-fly. It addresses you by name and comments on your specific choices (e.g., *"Arre Rahul, since you just moved, Form 8 is your best friend!"*).
*   **Tone Matching**: The AI speaks in a warm, encouraging mix of English and Hinglish (Dost-style) to make the voter feel supported, not lectured.

### 2. Journey Persistence with Google Firebase Firestore
We implemented a minimal, serverless data layer to allow voters to save their progress:
*   **Save My Journey**: Users can sync their final outcome, preparedness score, and AI-generated narrative to the cloud.
*   **Zero-Config Fallback**: If Firebase isn't configured, the app automatically switches to a local JSON download feature, ensuring 100% feature availability.

### 3. The WOW Factor: EVM Simulator
We removed "Booth Anxiety" by building a pixel-perfect, browser-based replica of the EVM:
*   **VVPAT Feedback**: A digital VVPAT slip drops down after voting to confirm the choice.
*   **Authentic Audio**: Uses the **Web Audio API** to synthesize the exact 2.5-second "BEEP" sound without needing a heavy MP3 file.

---

## 🛠️ Technical Approach & The `<10MB` Constraint

This project was engineered under a strict **<10MB repository size limit**. We crushed this constraint, keeping the entire repository under **60 KB** while including AI and Database capabilities.

1.  **Zero Frameworks**: Built entirely using pure HTML5, Vanilla JavaScript, and CSS.
2.  **Zero Image Assets (0 MB)**: All visuals, including the complex EVM machine, are built entirely using CSS gradients and inline SVGs.
3.  **Synthesized Audio (0 MB)**: No audio files were used; sounds are generated programmatically via the Web Audio API.
4.  **Modular Integration**: Gemini and Firebase are integrated via lightweight, modular scripts, proving that "Enterprise Tech" can be "Edge-Light".

---

## ⚙️ Configuration & Security

The app is designed to be "Bring Your Own Key" for maximum security:
*   **Gemini API**: Enter your key in the simulation; it's stored only in `sessionStorage` and never leaves your browser.
*   **Firebase**: To enable cloud saving, update the config in `js/db.js` with your Project ID and API Key.

---

## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/himanshukumawat22-hk/challenge-2.git
cd challenge-2/votedost

# Serve it using any local static server
npx serve .
```

Visit `http://localhost:3000` to start your election journey.
art your election journey.