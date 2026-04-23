const api = {
    getApiKey() {
        let key = sessionStorage.getItem('GEMINI_API_KEY');
        if (key === 'DISABLED') return null;
        
        if (!key) {
            key = prompt("Enter Gemini API Key for AI responses (Stored only for this session).\n\nClick 'Cancel' to disable AI and use standard text instead.");
            if (key === null) {
                sessionStorage.setItem('GEMINI_API_KEY', 'DISABLED');
                return null;
            }
            key = key.trim();
            if (key) {
                sessionStorage.setItem('GEMINI_API_KEY', key);
            } else {
                return null;
            }
        }
        return key;
    },

    async generateDynamicResponse(nodeText, userHistory, userName = 'Voter', preparedness = 0) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            console.warn("No API Key provided. Falling back to static text.");
            return nodeText;
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        // Structure the prompt with contextual understanding
        let historyContext = userHistory.map((h, i) => `Step ${i+1}: They chose "${h.choiceLabel}" (moving to ${h.nextNode})`).join('\n');
        
        const promptText = `
You are 'VoteDost', a friendly, engaging guide helping young Indian voters understand elections.
User Name: ${userName}
Current Preparedness Score: ${preparedness}/100 (High is good, Low means they are making risky choices)

Context:
The user is going through an interactive election journey.
${historyContext ? "Past Choices:\n" + historyContext : "They just started their journey."}

Standard Expected Response:
"${nodeText}"

Task:
Rewrite the "Standard Expected Response" to be highly personalized for ${userName}.
- Reference their name or past choices if it makes sense (e.g., "Good choice, ${userName}!", or "Arre ${userName}, you just moved right?").
- Use a mix of English and warm Hinglish (like "Chalo", "Samjhe?", "Bilkul").
- Be encouraging if they are doing well, or helpful/warning if they are making mistakes (low preparedness).
- Keep it under 3 sentences.
- Ensure the core meaning remains exactly the same so the story flows logically.
- Do not add any choices in your response, just the conversational text.
`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: promptText }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150
                    }
                })
            });

            if (!response.ok) {
                console.error("API response not ok", response.status);
                return nodeText;
            }
            const data = await response.json();
            return data.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error("Gemini API Error:", error);
            return nodeText; // Fallback
        }
    },
    
    async generateFinalSummary(userHistory, userName, preparedness) {
        const apiKey = this.getApiKey();
        if (!apiKey) return null;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        let historyContext = userHistory.map((h, i) => `Step ${i+1}: Chose "${h.choiceLabel}"`).join('\n');
        
        const promptText = `
You are 'VoteDost', summarizing the user's election journey.
User Name: ${userName}
Final Preparedness Score: ${preparedness}/100

User's Journey:
${historyContext}

Task:
Write a short (4-5 sentences), warm, and highly personalized summary of their journey.
- Mention their name.
- Comment on their choices (were they responsible? did they learn something?).
- If their preparedness is high, congratulate them on being a 'Super Voter'.
- If it's low, give them a friendly 'Dost' advice on what to be careful about next time.
- End with an encouraging note about the power of their vote.
- Use a mix of English and Hinglish.
`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: promptText }]
                    }],
                    generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
                })
            });

            if (!response.ok) return null;
            const data = await response.json();
            return data.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            return null;
        }
    }
};
