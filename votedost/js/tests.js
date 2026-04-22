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
