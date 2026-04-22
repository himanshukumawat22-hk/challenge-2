// Mock/Fetch logic for Gemini API

const api = {
    // In a real hackathon, this would hit your backend or use a provided API key
    // For safety in this static repo, we simulate the prompt generation 
    // OR we can plug in a direct fetch if an API key is provided in a .env (not included in repo)
    
    async fetchPlan(userAnswers) {
        // Log answers for debugging
        console.log("Generating plan for:", userAnswers);

        // Simulate network delay to show loading state (2 seconds)
        await new Promise(r => setTimeout(r, 2000));

        // Let's create localized, context-aware responses based on their inputs
        // This simulates what the LLM *would* output given our System Prompt
        
        let intro = "";
        let steps = [];
        let note = "";

        // Context 1: User Type
        if (userAnswers.userType === 'first_time') {
            intro = "Arre wah! Congrats on turning 18! 🎉 Pehli baar vote karna ek special feeling hai. It's super easy, let's get you set up.";
            steps.push("<strong>Step 1: Fill Form 6.</strong> Yeh naya voter ID banwane ka form hai. Download the <strong>Voter Helpline App</strong>, go to 'Voter Registration', and select Form 6. It takes 5 mins.");
            steps.push("<strong>Step 2: Keep Docs Ready.</strong> Ek passport size photo aur Aadhar card ya 10th marksheet pass rakhna upload karne ke liye.");
            note = "Pro tip: Booth par selfies allowed nahi hoti andar, but you can click outside showing your inked finger! 🤳";
        } else if (userAnswers.userType === 'moved') {
            intro = "Naye sheher mein welcome! 🚚 City change ki hai toh voter card mein address update karna zaruri hai warna purani jagah jana padega vote dene.";
            steps.push("<strong>Step 1: Fill Form 8.</strong> Yeh 'Shifting of Residence' ke liye hota hai. Voter Helpline App mein Form 8 select karo.");
            steps.push("<strong>Step 2: Naya Address Proof.</strong> Apna naya rent agreement, electricity bill, ya gas connection bill upload karna hoga.");
        } else if (userAnswers.userType === 'lost_id') {
            intro = "Voter ID kho gaya? Tension mat lo, apka naam Voter List mein hai toh vote de sakte ho! 🔍";
            steps.push("<strong>Step 1: Verify your Name.</strong> Search your name on the Voter Helpline app using your details (Name, Age, State).");
            steps.push("<strong>Step 2: Use Alternate ID.</strong> Jab voting day ho, bas apna Aadhar Card, PAN card, ya Driving License le jao. EPIC card ki zarurat nahi hai!");
        } else {
            intro = "Awesome! It's great that you're checking your status. Ek smart voter wahi hai jo hamesha ready rahe! ✅";
            steps.push("<strong>Step 1: Check the List.</strong> Election se pehle ek baar Voter Helpline app par apna naam zaroor search karlena. Kabhi kabhi naam katt jata hai by mistake.");
            steps.push("<strong>Step 2: Know Your Candidate.</strong> Use the 'Know Your Candidate (KYC)' app by ECI to check criminal records and assets of people asking for your vote.");
        }

        // Context 2: Urgency
        if (userAnswers.urgency === 'urgent') {
            note = "⚠️ <strong>Alert:</strong> Elections bahot paas hain. Voter List mein changes ki deadline shayad nikal gayi ho, but try doing it TODAY.";
        } else if (userAnswers.urgency === 'clueless') {
            steps.push("<strong>Bonus:</strong> Since you don't know the dates, setting up the Voter Helpline App will automatically send you alerts when elections in your state are announced.");
        }

        // Context 3: Location context (flavor text)
        if (userAnswers.location === 'rural') {
            intro += " Panchayat ho ya Lok Sabha, aapka ek vote gaon ka budget decide karta hai.";
        }

        // Format the output
        const html = `
            <p class="text-lg font-medium text-white mb-6">${intro}</p>
            <ul class="space-y-4 mb-6">
                ${steps.map(step => `<li class="flex gap-3"><span class="text-brand-orange">👉</span><span>${step}</span></li>`).join('')}
            </ul>
            ${note ? `<div class="p-3 bg-brand-orange/10 border border-brand-orange/30 rounded-lg text-brand-orange text-sm mb-4">${note}</div>` : ''}
            <p class="text-sm italic text-gray-400 mt-6 border-t border-gray-700 pt-4">This advice is AI-generated based on simplified ECI guidelines.</p>
        `;

        return html;
    }
};
