// Core Application Logic & Story Graph Engine

const storyGraph = {
    start: {
        text: "Hey! Welcome to VoteDost. Are you a registered voter?",
        choices: [
            { label: "Yes, I have an EPIC card 🪪", next: "registered_plan" },
            { label: "No, I'm a First Time Voter 🙋‍♂️", next: "first_time_start" },
            { label: "I just moved to a new city 🚚", next: "moved_city" },
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
            { label: "What is Form 6? 🤔", next: "ft_explain_form6", effects: { preparedness: 0 } },
            { label: "Yes, I filled it!", next: "ft_wait_list", effects: { preparedness: 20 } }
        ]
    },
    ft_explain_form6: {
        text: "Form 6 is the official application to get your name on the Voter List. You can fill it online in 5 minutes using the Voter Helpline App.",
        choices: [
            { label: "Okay, what documents do I need?", next: "ft_docs" },
            { label: "Wait, isn't my Aadhar enough?", next: "aadhar_confusion", effects: { preparedness: -5 } }
        ]
    },
    aadhar_confusion: {
        text: "Nope! Aadhar is just an ID. To vote, your name MUST be on the official Electoral Roll (Voter List). That's what Form 6 does.",
        type: "consequence",
        choices: [
            { label: "Ah, got it. What docs do I need?", next: "ft_docs", effects: { preparedness: 5 } }
        ]
    },
    ft_docs: {
        text: "Just keep a passport photo and an address proof (like Aadhar or 10th marksheet) ready on your phone.",
        choices: [
            { label: "I have them ready!", next: "booth_prep", effects: { preparedness: 15 } },
            { label: "I don't have address proof.", next: "no_docs_consequence", effects: { preparedness: -10 } }
        ]
    },
    no_docs_consequence: {
        text: "Without an address proof, your Form 6 will get rejected. You need to get your Aadhar updated first or use a bank passbook.",
        type: "consequence",
        choices: [
            { label: "Okay, I'll arrange it.", next: "booth_prep", effects: { preparedness: 10 } }
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
            { label: "Found my name!", next: "booth_prep", effects: { preparedness: 20 } },
            { label: "Can't find it...", next: "not_found_consequence", effects: { preparedness: -20 } }
        ]
    },
    not_found_consequence: {
        text: "If your name isn't on the list, you CANNOT vote, even if you have an old Voter ID! You must fill Form 6 immediately.",
        type: "consequence",
        choices: [
            { label: "Got it, I'll fill Form 6.", next: "ft_explain_form6", effects: { preparedness: 10 } }
        ]
    },

    // --- BRANCH: REGISTERED ---
    registered_plan: {
        text: "Smart voter! ✅ Have you checked your name on the list this year? Sometimes names get accidentally deleted.",
        choices: [
            { label: "Yes, checked it.", next: "booth_prep", effects: { preparedness: 20 } },
            { label: "No, I'll figure it out on Election Day.", next: "late_decision_consequence", effects: { preparedness: -30 } },
            { label: "Why bother? I have my card.", next: "overconfident_consequence", effects: { preparedness: -20 } }
        ]
    },
    late_decision_consequence: {
        text: "That's a very risky late decision! If you arrive at the booth and your name is missing, officials CANNOT let you vote, and it will be too late to register.",
        type: "consequence",
        choices: [
            { label: "Yikes, I'll check it beforehand.", next: "booth_prep", effects: { preparedness: 15 } }
        ]
    },
    overconfident_consequence: {
        text: "Having a card isn't enough! If your name is deleted from the Electoral Roll (which happens during updates), you will be turned away from the booth.",
        type: "consequence",
        choices: [
            { label: "Whoa, I'll check it now.", next: "booth_prep", effects: { preparedness: 15 } }
        ]
    },

    // --- BRANCH: MOVED CITY ---
    moved_city: {
        text: "Welcome to the new city! Did you update your address in the Voter List?",
        choices: [
            { label: "Yes, I filled Form 8.", next: "ft_wait_list", effects: { preparedness: 20 } },
            { label: "No, can't I just vote here with my old card?", next: "moved_consequence", effects: { preparedness: -15 } }
        ]
    },
    moved_consequence: {
        text: "No! Your vote is tied to your constituency. If you didn't update your address (Form 8) before the deadline, you must travel back to your old city to vote.",
        type: "consequence",
        choices: [
            { label: "Oh no. I'll remember this.", next: "booth_prep", effects: { preparedness: 5 } }
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

// --- STATE ---
const state = {
    currentView: 'splash',
    currentNode: 'start',
    history: [],
    preparedness: 0
};

// --- AUDIO SYSTEM ---
let audioCtx = null;

function initAudio() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    } catch(e) {
        console.log("Web Audio API not supported");
    }
}

function playBeep() {
    if(!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(3000, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 2.5); 
}

// --- UI UPDATES ---
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    const targetView = document.getElementById(`view-${viewId}`);
    if(targetView) {
        targetView.classList.remove('hidden');
        state.currentView = viewId;
        
        // Accessibility: Manage focus for screen readers
        const heading = targetView.querySelector('h1, h2');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    }
}

function scrollToBottom() {
    const container = document.getElementById('chat-history');
    container.scrollTop = container.scrollHeight;
}

function addChatBubble(text, sender, isConsequence = false, id = null) {
    const historyContainer = document.getElementById('chat-history');
    const bubble = document.createElement('div');
    if (id) bubble.id = id;
    
    let classes = 'chat-bubble text-[15px] leading-relaxed ';
    if (sender === 'ai') {
        classes += isConsequence ? 'chat-consequence' : 'chat-ai';
    } else {
        classes += 'chat-user';
    }
    
    bubble.className = classes;
    bubble.innerHTML = text;
    bubble.setAttribute('role', 'log');
    historyContainer.appendChild(bubble);
    scrollToBottom();
}

function renderOptions(node, nodeId) {
    const optionsContainer = document.getElementById('chat-options');
    optionsContainer.innerHTML = '';
    
    node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'py-3 px-5 rounded-full bg-gray-800 text-white text-sm font-semibold border border-gray-700 hover:bg-brand-orange hover:text-brand-dark focus-visible:bg-brand-orange focus-visible:text-brand-dark hover:border-brand-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange transition-all active:scale-95';
        btn.innerText = choice.label;
        btn.onclick = () => handleChoice(choice, nodeId);
        optionsContainer.appendChild(btn);
    });
}

function generateStorySummary() {
    const summaryContainer = document.getElementById('story-summary-content');
    const actionsContainer = document.getElementById('story-actions');
    summaryContainer.innerHTML = '';
    actionsContainer.innerHTML = '';

    const pathNodes = state.history.map(h => h.node);
    const pathChoices = state.history.map(h => h.nextNode);

    // --- GENERATE HUMAN-FRIENDLY NARRATIVE ---
    let journeyNarrative = "";

    if (pathNodes.includes('skip_vote_consequence')) {
         journeyNarrative += "You initially thought about skipping the election, feeling like one vote doesn't matter. But after learning how a single vote impacts your local budget and daily life, you decided to participate. ";
    }

    if (pathNodes.includes('first_time_start')) {
        journeyNarrative += "You started your journey as an excited first-time voter. ";
        if (pathNodes.includes('aadhar_confusion')) {
            journeyNarrative += "You made a common mistake: thinking an Aadhar card alone gives you the right to vote. You quickly learned that you MUST be on the official Electoral Roll (Form 6). ";
        }
        if (pathNodes.includes('no_docs_consequence')) {
            journeyNarrative += "When preparing your form, you realized you were missing a valid address proof, which would have gotten your application rejected in real life. ";
        } else if (!pathNodes.includes('skip_vote_consequence')) {
            journeyNarrative += "You smartly gathered your documents and understood how to use Form 6. ";
        }
    } else if (pathNodes.includes('lost_card')) {
        journeyNarrative += "You panicked because you lost your physical Voter ID card. But you discovered a life-saving secret: as long as your name is on the list, an alternate ID works perfectly! ";
        if (pathNodes.includes('not_found_consequence')) {
            journeyNarrative += "However, when you checked the app, your name wasn't there. You learned the hard way that without your name on the list, you simply cannot vote, forcing you to start over with Form 6. ";
        }
    } else if (pathNodes.includes('moved_city')) {
        journeyNarrative += "You recently moved to a new city. ";
        if (pathNodes.includes('moved_consequence')) {
            journeyNarrative += "You assumed you could just use your old card in the new city, but learned that you must transfer your constituency using Form 8, otherwise you'd have to travel all the way back home to vote! ";
        } else {
            journeyNarrative += "You made the correct choice to update your address via Form 8. ";
        }
    } else if (pathNodes.includes('registered_plan')) {
        journeyNarrative += "You entered as a registered voter. ";
        if (pathNodes.includes('late_decision_consequence')) {
            journeyNarrative += "You made a risky choice to just 'figure it out' on Election Day, learning that if your name was accidentally purged from the list, officials wouldn't let you vote. ";
        } else if (pathNodes.includes('overconfident_consequence')) {
            journeyNarrative += "You assumed having an EPIC card was a golden ticket, but realized that checking the updated voter list beforehand is mandatory. ";
        } else {
            journeyNarrative += "You did the right thing by verifying your name on the electoral list beforehand. ";
        }
    }

    if (pathChoices.includes('evm_start') || pathChoices.includes('EVM_SIMULATOR')) {
        if(typeof evm !== 'undefined' && evm.hasVoted) {
            journeyNarrative += "Finally, you confidently stepped into the polling booth and successfully cast your vote on the EVM. Great job!";
        } else {
            journeyNarrative += "You made it all the way to the booth, but walked out without actually pressing the button!";
        }
    }

    if (!journeyNarrative) {
        journeyNarrative = "You skipped the voting process this time, missing a chance to have your voice heard.";
    }

    // Inject Narrative
    summaryContainer.innerHTML += `
        <div class="mb-6 p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl">
            <h3 class="font-bold text-brand-orange mb-2">Your Journey</h3>
            <p class="text-white text-sm leading-relaxed">${journeyNarrative}</p>
        </div>
        <h3 class="font-bold text-gray-300 text-sm uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Key Takeaways</h3>
    `;

    // --- GENERATE BULLET POINTS ---
    let praise = [];
    let learnings = [];
    let links = [];

    // Dynamic State Outcome
    if (state.preparedness >= 20) {
        praise.push({ title: "Highly Prepared Voter 🏆", desc: "You took all the right steps to verify your status and documents. You won't face any surprises at the booth!" });
    } else if (state.preparedness < 0) {
        learnings.push({ title: "Needs Better Prep", desc: "You missed crucial steps like checking the list or having valid proof. In real life, you might be turned away from voting." });
    }

    if (pathNodes.includes('first_time_start') || pathNodes.includes('aadhar_confusion')) {
        links.push({ label: "Download Voter Helpline App (For Form 6)", url: "https://play.google.com/store/apps/details?id=com.eci.citizen" });
    }
    if (pathNodes.includes('moved_consequence') || pathNodes.includes('moved_city')) {
        links.push({ label: "Voter Portal (For Form 8)", url: "https://voters.eci.gov.in/" });
    }

    // Render Arrays
    praise.forEach(p => {
        summaryContainer.innerHTML += `
            <div class="flex gap-3 items-start mb-4" role="listitem">
                <div class="text-green-500 text-xl mt-1" aria-hidden="true">✅</div>
                <div><h4 class="font-bold text-white">${p.title}</h4><p class="text-sm text-gray-300">${p.desc}</p></div>
            </div>`;
    });

    learnings.forEach(l => {
        summaryContainer.innerHTML += `
            <div class="flex gap-3 items-start mb-4" role="listitem">
                <div class="text-brand-orange text-xl mt-1" aria-hidden="true">💡</div>
                <div><h4 class="font-bold text-white">${l.title}</h4><p class="text-sm text-gray-300">${l.desc}</p></div>
            </div>`;
    });

    if (links.length === 0) {
        links.push({ label: "Check your name on Electoral Roll", url: "https://electoralsearch.eci.gov.in/" });
        links.push({ label: "Know Your Candidate Details", url: "https://affidavit.eci.gov.in/" });
    }

    links.forEach(link => {
        actionsContainer.innerHTML += `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="block w-full p-3 bg-gray-800 rounded-xl text-brand-orange text-sm font-semibold hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange transition-colors border border-gray-700 flex justify-between items-center">
                <span><span aria-hidden="true">🎯</span> ${link.label}</span>
                <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>`;
    });
}

// --- FLOW HANDLING ---
function navigate(viewId) {
    showView(viewId);

    if(viewId === 'simulator') {
        document.getElementById('chat-history').innerHTML = ''; // Clear chat
        state.history = []; // Reset history
        state.preparedness = 0; // Reset state
        renderNode('start');
    }
}

async function renderNode(nodeId) {
    state.currentNode = nodeId;
    const node = storyGraph[nodeId];

    // Show Typing Indicator
    const typingId = 'typing-' + Date.now();
    addChatBubble('<span class="animate-pulse">Thinking...</span>', 'ai', false, typingId);

    let dynamicText = node.text; // Default fallback

    try {
        if (typeof api !== 'undefined' && api.generateDynamicResponse) {
            dynamicText = await api.generateDynamicResponse(node.text, state.history);
        }
    } catch (error) {
        console.error("Story Engine Error:", error);
    }

    // Update Chat Bubble
    const typingElement = document.getElementById(typingId);
    if (typingElement) {
        typingElement.innerHTML = dynamicText;
        if (node.type === 'consequence') {
            typingElement.classList.add('chat-consequence');
            typingElement.classList.remove('chat-ai');
        }
    } else {
        addChatBubble(dynamicText, 'ai', node.type === 'consequence');
    }

    renderOptions(node, nodeId);
    scrollToBottom();
}

function handleChoice(choice, fromNodeId) {
    if (choice.effects && choice.effects.preparedness !== undefined) {
        state.preparedness += choice.effects.preparedness;
    }

    state.history.push({
        node: fromNodeId,
        choiceLabel: choice.label,
        nextNode: choice.next
    });

    // Clear UI instantly to prevent double-clicks
    document.getElementById('chat-options').innerHTML = '';
    addChatBubble(choice.label, 'user');

    // Simulate realistic delay before next step
    setTimeout(() => {
        if (choice.next === 'EVM_SIMULATOR') {
            navigate('evm');
        } else if (choice.next === 'FINISH') {
            finishStory();
        } else {
            renderNode(choice.next);
        }
    }, 600);
}

function finishStory() {
    navigate('story');
    generateStorySummary();
}

function init() {
    console.log("VoteDost Engine Initialized");
    initAudio();
}

// --- PUBLIC API EXPORTS ---
window.app = {
    state,
    init,
    navigate,
    finishStory,
    playBeep,
    generateStorySummary
};

document.addEventListener('DOMContentLoaded', init);
