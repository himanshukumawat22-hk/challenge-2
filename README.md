# VoteDost 🇮🇳 | Interactive Election Journey Simulator

**Google Prompt Wars: Challenge 2 Submission**

VoteDost is an ultra-lightweight, hyper-realistic **Decision-Based Journey Simulator** designed to demystify the Indian election process for first-time and rural voters. 

Instead of reading a boring government manual, users *live* through the election process via an interactive, chat-based simulation.

🔗 **[Live Demo on Google Cloud Run](https://votedost-61372857831.us-central1.run.app)**

---

## 🛑 The Problem

*   **Information Overload**: Current resources dump walls of text on voters. Young and first-time voters lose interest reading through complex jargon (e.g., "Form 6", "Electoral Roll").
*   **Booth Anxiety**: For many rural or first-time voters, the "Black Box" nature of the polling booth and the Electronic Voting Machine (EVM) causes anxiety.
*   **Consequence Disconnect**: Voters often skip voting because they don't see the direct, hyper-local consequences of their absence or the strict bureaucratic reality of missing documents.

---

## 💡 The Solution

We built **VoteDost**, a conversational web-app that replaces linear forms with a dynamic **Story Graph Engine**, heavily augmented by Google's Gemini AI. 

### 1. Dynamic Decision Logic & Reality Checks
The application features a deeply branching state machine that tracks a user's hidden "Preparedness Score". It simulates real-life friction points voters face during Indian elections:
*   **The Aadhar Myth**: If a user thinks their Aadhar card is enough to vote, the system triggers a reality check explaining that registration on the Electoral Roll (Form 6) is strictly required.
*   **The City-Shifter Dilemma**: If a user moves to a new city and tries to vote with their old card, they hit a consequence node explaining the necessity of Form 8 to transfer their constituency.
*   **The Overconfident Voter**: If a registered voter refuses to check the updated list, the engine drops their preparedness score, warning them about accidental roll deletions.

### 2. Google Gemini API Integration (No Backend Required)
To keep the application under the 10MB limit while providing world-class AI, we integrated **Gemini 1.5 Flash** directly via the frontend.
*   **Contextual Understanding**: Every time a user makes a choice, their entire decision history is fed into the Gemini prompt. 
*   **Dynamic Responses**: Gemini rewrites standard responses on the fly to be highly contextual and engaging based on the user's specific journey up to that point.
*   **Secure Session Execution**: The user is securely prompted for their Gemini API key, which is stored entirely in `sessionStorage` and never leaves the browser tab.

### 3. The WOW Factor: EVM Simulator
We removed "Booth Anxiety" by building a fully functional, browser-based replica of the Electronic Voting Machine. 
*   Users press the blue button.
*   The red LED lights up.
*   A digital VVPAT slip drops down.
*   **Audio Feedback**: It plays the exact 2.5-second continuous "BEEP" sound.

### 4. Human-Friendly Narrative Generator
At the end of the simulation, instead of a boring checklist, the app programmatically stitches together a personalized, conversational paragraph detailing the exact user journey. It praises their correct actions (like gathering documents) and clearly highlights where they would have been turned away in real life (like missing an address proof).

---

## 🛠️ Technical Approach & The `<10MB` Constraint

This project was engineered under a strict **<10MB repository size limit**. We absolutely crushed this constraint, keeping the entire repository well under **50 KB**.

Here is how we achieved maximum impact with zero bloat:

1.  **Zero Frameworks**: Built entirely using pure HTML5, Vanilla JavaScript (`app.js`, `api.js`), and CSS (`style.css`).
2.  **Zero Image Assets (0 MB)**: All visuals, icons, and even the complex EVM machine are built entirely using CSS gradients and inline mathematical SVGs. No PNGs or JPEGs were used.
3.  **Zero Audio Files (0 MB)**: Instead of including an MP3 file for the EVM Beep, we used the browser's native **Web Audio API** to programmatically synthesize the exact sound frequency on the fly.
4.  **Tailwind via CDN**: Styling is handled by dynamically loading Tailwind CSS.
5.  **Modular Refactoring**: The codebase was refactored into clean functional modules (State, Audio, UI, Flow), proving that vanilla JS can be maintainable without bloated build tools.

---

## 🧪 Lightweight Test Coverage

To ensure stability without violating the `<10MB` constraint with heavy testing frameworks (like Jest or Cypress), we implemented a custom, zero-dependency validation script (`tests.js`) that automatically runs in the console upon loading.

### Documented Test Scenarios

1.  **Story Graph Integrity**
    *   *Validation*: Loops through the entire `storyGraph` object to prevent dead ends or broken links.
2.  **Decision Step Validation**
    *   *Validation*: Explicitly tests critical story paths and branching logic (e.g., First Time Voter, Lost Card, Skip Vote).
3.  **EVM Simulator Edge Cases**
    *   *Check*: Validates the `isVoting` state lock, ensuring multiple votes cannot be cast simultaneously.

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