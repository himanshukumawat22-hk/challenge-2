// UI specific logic (EVM Simulator)

const evm = {
    isVoting: false,
    hasVoted: false, // Track if they actually pushed a button

    vote(candidateId) {
        if(this.isVoting) return; // Prevent multiple clicks
        this.isVoting = true;
        this.hasVoted = true;

        // 1. Light up the specific candidate's LED
        const light = document.getElementById(`light-${candidateId}`);
        light.classList.add('evm-light-on');

        // 2. Turn off the 'Ready' green light
        document.getElementById('ready-light').classList.remove('bg-green-500');
        document.getElementById('ready-light').classList.add('bg-gray-700');
        document.getElementById('ready-light').style.boxShadow = 'none';

        // 3. Play the iconic Beep sound
        app.playBeep();

        // 4. Show VVPAT Slip Animation
        this.showVVPAT(candidateId);

        // Reset after 5 seconds
        setTimeout(() => {
            light.classList.remove('evm-light-on');
            document.getElementById('ready-light').classList.remove('bg-gray-700');
            document.getElementById('ready-light').classList.add('bg-green-500');
            document.getElementById('ready-light').style.boxShadow = '0 0 10px #22c55e';
            this.isVoting = false;
            
            // Show the "See Your Story" button after they vote
            const finishBtn = document.getElementById('finish-story-btn');
            if (finishBtn) {
                finishBtn.classList.remove('hidden');
            }
        }, 5000);
    },

    showVVPAT(candidateId) {
        const modal = document.getElementById('vvpat-modal');
        const slip = document.getElementById('vvpat-slip');
        const nameEl = document.getElementById('vvpat-name');
        const symbolEl = document.getElementById('vvpat-symbol');

        if(candidateId === 1) {
            nameEl.innerText = "Candidate A";
            symbolEl.innerText = "[Arrow Symbol]";
        } else if (candidateId === 2) {
            nameEl.innerText = "Candidate B";
            symbolEl.innerText = "[Circle Symbol]";
        } else {
            nameEl.innerText = "NOTA";
            symbolEl.innerText = "[None]";
        }

        modal.classList.remove('hidden');
        void modal.offsetWidth; // Trigger reflow
        modal.classList.remove('opacity-0');
        slip.classList.remove('translate-y-10');

        setTimeout(() => {
            modal.classList.add('opacity-0');
            slip.classList.add('translate-y-10');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }, 4000);
    }
};
