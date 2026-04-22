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

    async generateDynamicResponse(nodeText, userHistory) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            console.warn("No API Key provided. Falling back to static text.");
            return nodeText;
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        // Structure the prompt with contextual understanding
        let historyContext = userHistory.map((h, i) => `Step ${i+1}: User chose "${h.choiceLabel}"`).join('\n');
        
        const promptText = `
You are 'VoteDost', a friendly, engaging guide helping young Indian voters understand elections.
You speak in a mix of simple English and a little bit of encouraging Hinglish.
The user is going through an interactive election journey.

Past User Choices (Context):
${historyContext || "User just started the journey."}

Standard Expected Response:
"${nodeText}"

Task:
Rewrite the "Standard Expected Response" to be highly contextual based on their past choices, dynamic, and engaging.
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
    }
};
