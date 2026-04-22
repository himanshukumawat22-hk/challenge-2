// Core Application Logic & Story Graph Engine

const storyGraph = {
    start: {
        text: "Hey! Welcome to VoteDost. Are you a registered voter?",
        choices: [
            { label: "Yes, I have an EPIC card 🪪", next: "registered_plan" },
            { label: "No, I'm a First Time Voter 🙋‍♂️", next: "first_time_start" },
            { label: "Not sure / Lost it 🤷", next: "lost_card" },
            { label: "Honestly, I might skip voting 😴", next: "skip_vote_consequence" }
        ]
    },
    // --- BRANCH: SKIP VOTE CONSEQUENCE ---
    skip_vote_consequence: {
        text: "I get it. It feels like one vote doesn't matter. But did you know in 2008, a leader in Rajasthan lost by exactly ONE vote?",
        type: "consequence",
        choices: [
            { label: "Wait, really? 😳", next: "skip_vote_2" }
        ]
    },
    skip_vote_2: {
        text: "Yes. When you skip, you let others decide how your tax money is spent on your roads, hospitals, and schools. You lose your right to complain.",
        type: "consequence",
        choices: [
            { label: "Okay, how do I start? 🗳️", next: "start" },
            { label: "Still don't care.", next: "end_skipped" }
        ]
    },
    end_skipped: {
        text: "That's your choice! But democracy only works when we all participate. See you next election!",
        choices: [
            { label: "Finish Story", next: "FINISH" }
        ]
    },

    // --- BRANCH: FIRST TIME VOTER ---
    first_time_start: {
        text: "Awesome! Turning 18 is a big deal. 🎉 Have you filled 'Form 6' yet?",
        choices: [
            { label: "What is Form 6? 🤔", next: "ft_explain_form6" },
            { label: "Yes, I filled it!", next: "ft_wait_list" }
        ]
    },
    ft_explain_form6: {
        text: "Form 6 is the official application to get your name on the Voter List. You can fill it online in 5 minutes using the Voter Helpline App.",
        choices: [
            { label: "Okay, what documents do I need?", next: "ft_docs" }
        ]
    },
    ft_docs: {
        text: "Just keep a passport photo and an address proof (like Aadhar or 10th marksheet) ready on your phone.",
        choices: [
            { label: "Got it. What next?", next: "booth_prep" }
        ]
    },
    ft_wait_list: {
        text: "Great job! Keep an eye on the NVSP portal to check when your name is added to the official Electoral Roll.",
        choices: [
            { label: "Let's prepare for voting day!", next: "booth_prep" }
        ]
    },

    // --- BRANCH: LOST CARD ---
    lost_card: {
        text: "Don't panic! You actually DON'T need the physical Voter ID card to vote.",
        choices: [
            { label: "Really? How? 😲", next: "lost_card_explain" }
        ]
    },
    lost_card_explain: {
        text: "As long as your name is on the Voter List, you can just take your Aadhar Card, PAN Card, or Driving License to the booth.",
        choices: [
            { label: "Phew! How do I check the list?", next: "lost_card_check" }
        ]
    },
    lost_card_check: {
        text: "Download the 'Voter Helpline' app and search by your details (Name, Father's Name, Age, State).",
        choices: [
            { label: "Understood. Let's practice voting.", next: "booth_prep" }
        ]
    },

    // --- BRANCH: REGISTERED ---
    registered_plan: {
        text: "Smart voter! ✅ Have you checked your name on the list this year? Sometimes names get accidentally deleted.",
        choices: [
            { label: "Yes, checked it.", next: "booth_prep" },
            { label: "No, I'll do it today.", next: "booth_prep" }
        ]
    },

    // --- CONVERGENCE: BOOTH PREP ---
    booth_prep: {
        text: "Voting day is here. Do you know what happens inside the polling booth?",
        choices: [
            { label: "Yes, I know.", next: "evm_start" },
            { label: "No, a bit nervous 😬", next: "booth_explain" }
        ]
    },
    booth_explain: {
        text: "It's simple: 1. Officer checks your ID. 2. They ink your finger. 3. You go behind a cardboard screen to the EVM machine.",
        choices: [
            { label: "Show me the EVM!", next: "evm_start" }
        ]
    },
    evm_start: {
        text: "Let's practice! I'll take you to the simulator. Remember, your vote is secret. No selfies inside the booth!",
        choices: [
            { label: "Enter Booth Simulator 🗳️", next: "EVM_SIMULATOR" }
        ]
    }
};

const app = {
    state: {
        currentView: 'splash',
        currentNode: 'start',
        history: [], // Tracks user choices for the final story
    },

    init() {
        console.log("VoteDost Engine Initialized");
        this.initAudio();
    },

    navigate(viewId) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        const targetView = document.getElementById(`view-${viewId}`);
        if(targetView) {
            targetView.classList.remove('hidden');
            this.state.currentView = viewId;
        }

        if(viewId === 'simulator') {
            document.getElementById('chat-history').innerHTML = ''; // Clear chat
            this.state.history = []; // Reset history
            this.renderNode('start');
        }
    },

    renderNode(nodeId) {
        this.state.currentNode = nodeId;
        const node = storyGraph[nodeId];

        // 1. Add AI Chat Bubble
        this.addChatBubble(node.text, 'ai', node.type === 'consequence');

        // 2. Render Options
        const optionsContainer = document.getElementById('chat-options');
        optionsContainer.innerHTML = '';
        
        node.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'py-3 px-5 rounded-full bg-gray-800 text-white text-sm font-semibold border border-gray-700 hover:bg-brand-orange hover:border-brand-orange transition-all active:scale-95';
            btn.innerText = choice.label;
            btn.onclick = () => this.handleChoice(choice, nodeId);
            optionsContainer.appendChild(btn);
        });

        this.scrollToBottom();
    },

    handleChoice(choice, fromNodeId) {
        // Log to history
        this.state.history.push({
            node: fromNodeId,
            choiceLabel: choice.label,
            nextNode: choice.next
        });

        // Clear buttons immediately to prevent double clicks
        document.getElementById('chat-options').innerHTML = '';

        // Add User Chat Bubble
        this.addChatBubble(choice.label, 'user');

        // Delay next node slightly for realistic feel
        setTimeout(() => {
            if (choice.next === 'EVM_SIMULATOR') {
                this.navigate('evm');
            } else if (choice.next === 'FINISH') {
                this.finishStory();
            } else {
                this.renderNode(choice.next);
            }
        }, 600);
    },

    addChatBubble(text, sender, isConsequence = false) {
        const historyContainer = document.getElementById('chat-history');
        const bubble = document.createElement('div');
        
        let classes = 'chat-bubble text-[15px] leading-relaxed ';
        if (sender === 'ai') {
            classes += isConsequence ? 'chat-consequence' : 'chat-ai';
        } else {
            classes += 'chat-user';
        }
        
        bubble.className = classes;
        bubble.innerHTML = text;
        historyContainer.appendChild(bubble);
        this.scrollToBottom();
    },

    scrollToBottom() {
        const container = document.getElementById('chat-history');
        container.scrollTop = container.scrollHeight;
    },

    finishStory() {
        this.navigate('story');
        this.generateStorySummary();
    },

    generateStorySummary() {
        const summaryContainer = document.getElementById('story-summary-content');
        const actionsContainer = document.getElementById('story-actions');
        summaryContainer.innerHTML = '';
        actionsContainer.innerHTML = '';

        let praise = [];
        let learnings = [];
        let links = [];

        // Analyze history
        const pathNodes = this.state.history.map(h => h.node);
        const pathChoices = this.state.history.map(h => h.nextNode);

        // Logic checks
        if (pathChoices.includes('evm_start') || pathChoices.includes('EVM_SIMULATOR')) {
             if(evm.hasVoted) {
                 praise.push({ title: "You Cast Your Vote!", desc: "You successfully navigated the EVM simulator. You're ready for the real thing." });
             } else {
                 learnings.push({ title: "Missed the button?", desc: "You reached the booth but didn't press the button in the simulator!" });
             }
        }

        if (pathNodes.includes('skip_vote_consequence')) {
            learnings.push({ title: "Realized the Value", desc: "You initially thought about skipping, but learned how a single vote affects local budgets." });
        }

        if (pathNodes.includes('first_time_start')) {
            praise.push({ title: "First Step Taken", desc: "You are beginning your democratic journey." });
            links.push({ label: "Download Voter Helpline App (For Form 6)", url: "#" });
        }

        if (pathNodes.includes('lost_card')) {
            learnings.push({ title: "Myth Busted", desc: "You learned that you don't need a physical EPIC card to vote, just an alternate ID." });
        }

        // Render Praise
        praise.forEach(p => {
            summaryContainer.innerHTML += `
                <div class="flex gap-3 items-start">
                    <div class="text-green-500 text-xl mt-1">✅</div>
                    <div>
                        <h4 class="font-bold text-white">${p.title}</h4>
                        <p class="text-sm text-gray-400">${p.desc}</p>
                    </div>
                </div>
            `;
        });

        // Render Learnings
        learnings.forEach(l => {
            summaryContainer.innerHTML += `
                <div class="flex gap-3 items-start">
                    <div class="text-brand-orange text-xl mt-1">💡</div>
                    <div>
                        <h4 class="font-bold text-white">${l.title}</h4>
                        <p class="text-sm text-gray-400">${l.desc}</p>
                    </div>
                </div>
            `;
        });

        // Render Default if empty (user skipped everything)
        if (praise.length === 0 && learnings.length === 0) {
            summaryContainer.innerHTML = `<p class="text-gray-400">You skipped the voting process this time. Remember, your voice matters!</p>`;
        }

        // Render Links
        if (links.length === 0) {
            links.push({ label: "Check your name on Electoral Roll", url: "#" });
            links.push({ label: "Know Your Candidate (KYC) App", url: "#" });
        }

        links.forEach(link => {
            actionsContainer.innerHTML += `
                <a href="${link.url}" class="block w-full p-3 bg-gray-800 rounded-xl text-brand-orange text-sm font-semibold hover:bg-gray-700 transition-colors border border-gray-700">
                    🔗 ${link.label}
                </a>
            `;
        });
    },

    // Audio setup for EVM
    initAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        } catch(e) {
            console.log("Web Audio API not supported");
        }
    },

    playBeep() {
        if(!this.audioCtx) return;
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(3000, this.audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 2.5); 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
