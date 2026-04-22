# VoteDost 🇮🇳 | Interactive Election Journey Simulator

**Google Prompt Wars: Challenge 2 Submission**

VoteDost is an ultra-lightweight, hyper-realistic **Decision-Based Journey Simulator** designed to demystify the Indian election process for first-time and rural voters. 

Instead of reading a boring government manual, users *live* through the election process via an interactive, chat-based simulation.

🔗 **[Live Demo on Google Cloud Run](https://votedost-61372857831.us-central1.run.app)**

---

## 🛑 The Problem

*   **Information Overload**: Current resources dump walls of text on voters. Young and first-time voters lose interest reading through complex jargon (e.g., "Form 6", "Electoral Roll").
*   **Booth Anxiety**: For many rural or first-time voters, the "Black Box" nature of the polling booth and the Electronic Voting Machine (EVM) causes anxiety.
*   **Consequence Disconnect**: Voters often skip voting because they don't see the direct, hyper-local consequences of their absence.

---

## 💡 The Solution

We built **VoteDost**, a conversational web-app that replaces linear forms with a **Story Graph Engine**. 

### 1. Interactive "Choose-Your-Own-Adventure" Flow
The user interacts via simple chat bubbles. Depending on their answers (e.g., "I'm a first-time voter" vs "I might skip voting"), the engine dynamically branches the story. 
*   *Example*: If a user says they might skip, the app interrupts them to explain how a single vote impacts their local road budget.
*   *Example*: Complex jargon is broken down into simple "Hinglish".

### 2. The WOW Factor: EVM Simulator
We removed "Booth Anxiety" by building a fully functional, browser-based replica of the Electronic Voting Machine. 
*   Users press the blue button.
*   The red LED lights up.
*   A digital VVPAT slip drops down.
*   **Audio Feedback**: It plays the exact 2.5-second continuous "BEEP" sound.

### 3. "Your Election Story" Final Screen
At the end of the simulation, the app evaluates the user's choices and generates a personalized summary card, highlighting what they did right and providing exact actionable links based *only* on their journey.

---

## 🛠️ Technical Approach & The `<10MB` Constraint

This project was engineered under a strict **<10MB repository size limit**. We absolutely crushed this constraint, keeping the entire repository at exactly **34.4 KB (0.034 MB)**.

Here is how we achieved maximum impact with zero bloat:

1.  **Zero Frameworks**: Built entirely using pure HTML5, Vanilla JavaScript (`app.js`), and CSS (`style.css`). No `node_modules` required for the frontend.
2.  **Zero Image Assets (0 MB)**: All visuals, icons, and even the complex EVM machine are built entirely using CSS gradients and inline mathematical SVGs. No PNGs or JPEGs were used.
3.  **Zero Audio Files (0 MB)**: Instead of including an MP3 file for the EVM Beep, we used the browser's native **Web Audio API** to programmatically synthesize the exact sound frequency on the fly.
4.  **Tailwind via CDN**: Styling is handled by dynamically loading Tailwind CSS, keeping the local repository clean.

---

## 🚀 How to Run Locally

Because the app is purely client-side static files, you can run it instantly:

```bash
# Clone the repo
git clone https://github.com/himanshukumawat22-hk/challenge-2.git
cd challenge-2/votedost

# Serve it using any local static server
npx serve .
```

Visit `http://localhost:3000` to start your election journey.