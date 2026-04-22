// Lightweight Testing Utility for VoteDost
// Runs automatically on load to verify graph integrity and edge cases

console.log("🧪 Running VoteDost Integrity Tests...");

const tests = {
    results: { passed: 0, failed: 0 },

    assert(condition, message) {
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            this.results.passed++;
        } else {
            console.error(`❌ FAIL: ${message}`);
            this.results.failed++;
        }
    },

    runAll() {
        this.testStoryGraphIntegrity();
        this.testDecisionStepValidation();
        this.testEVMEdgeCases();
        this.testStoryGeneratorEdgeCases();
        
        console.log(`🏁 Tests Complete. Passed: ${this.results.passed}, Failed: ${this.results.failed}`);
    },

    testStoryGraphIntegrity() {
        console.log("--- Graph Integrity Tests ---");
        const specialNodes = ['FINISH', 'EVM_SIMULATOR'];
        let hasStartNode = false;
        
        for (const [nodeId, nodeData] of Object.entries(storyGraph)) {
            if (nodeId === 'start') hasStartNode = true;
            
            // Validation: Ensure node has text
            this.assert(!!nodeData.text, `Node '${nodeId}' has text content`);
            
            // Validation: Ensure valid routing
            if (nodeData.choices && nodeData.choices.length > 0) {
                nodeData.choices.forEach((choice, idx) => {
                    const isValidNext = storyGraph[choice.next] || specialNodes.includes(choice.next);
                    this.assert(isValidNext, `Node '${nodeId}' choice [${idx}] points to valid next node: ${choice.next}`);
                });
            } else {
                this.assert(false, `Node '${nodeId}' is a dead end (no choices)`);
            }
        }
        
        this.assert(hasStartNode, "Graph contains required 'start' node");
    },

    testDecisionStepValidation() {
        console.log("--- Decision Step Validation Tests ---");
        
        // 1. First Time Voter Path Validation
        const ftChoices = storyGraph['first_time_start'].choices;
        this.assert(ftChoices.some(c => c.next === 'ft_explain_form6'), "First time voter can learn about Form 6");
        this.assert(ftChoices.some(c => c.next === 'ft_wait_list'), "First time voter who filled form goes to wait list");

        // 2. Lost Card Path Validation
        const lostCardChoices = storyGraph['lost_card'].choices;
        this.assert(lostCardChoices.some(c => c.next === 'lost_card_explain'), "Lost card voter receives alternative ID explanation");

        // 3. Skip Vote Consequence Validation
        const skipNode = storyGraph['skip_vote_consequence'];
        this.assert(skipNode.type === 'consequence', "Skip vote node is correctly marked with type: 'consequence'");
        this.assert(skipNode.choices[0].next === 'skip_vote_2', "Skip vote consequence leads to secondary explanation");

        // 4. Convergence Validation (Booth Prep)
        const boothPrepPaths = ['ft_docs', 'ft_wait_list', 'lost_card_check', 'registered_plan'];
        boothPrepPaths.forEach(node => {
            const hasBoothPrep = storyGraph[node].choices.some(c => c.next === 'booth_prep');
            this.assert(hasBoothPrep, `Node '${node}' converges correctly to 'booth_prep'`);
        });

        // 5. Final EVM Entry Validation
        const evmEntryChoices = storyGraph['evm_start'].choices;
        this.assert(evmEntryChoices.some(c => c.next === 'EVM_SIMULATOR'), "EVM start node correctly routes to EVM_SIMULATOR action");
    },

    testEVMEdgeCases() {
        console.log("--- EVM Edge Case Tests ---");
        
        // Setup initial state
        evm.isVoting = false;
        evm.hasVoted = false;
        
        // Edge Case: Prevent Double Voting
        // If a user clicks rapidly, the system should block subsequent clicks
        evm.isVoting = true; // Simulate active voting animation
        const previousVotedState = evm.hasVoted;
        
        // Attempt to vote while already voting
        try {
            evm.vote(1); 
            this.assert(evm.hasVoted === previousVotedState, "EVM correctly blocks multiple votes during active sequence");
        } catch(e) {
            this.assert(false, "EVM double-vote prevention threw an error");
        }
        
        // Reset
        evm.isVoting = false;
    },

    testStoryGeneratorEdgeCases() {
        console.log("--- Story Generator Edge Case Tests ---");
        
        const tempHistory = [...app.state.history]; // Backup
        
        // Edge Case: Empty History
        // If the summary is generated without any prior choices made
        app.state.history = [];
        app.generateStorySummary();
        const summaryContent = document.getElementById('story-summary-content').innerHTML;
        this.assert(summaryContent.includes("skipped the voting process"), "Summary generator handles empty history with default fallback");
        
        // Restore
        app.state.history = tempHistory;
    }
};

// Run tests 1 second after app loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => tests.runAll(), 1000);
});
