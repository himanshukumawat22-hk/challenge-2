// Firebase Firestore Integration (Minimal)
// Note: In a production app, these keys should be in environment variables or managed securely.
// For this hackathon, we use a placeholder that the user can fill.

const dbService = {
    config: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    },

    isInitialized: false,

    init() {
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK not loaded.");
            return false;
        }

        // Check if config is still placeholder
        if (this.config.apiKey === "YOUR_API_KEY") {
            console.warn("Firebase not configured. Please add your credentials in js/db.js");
            return false;
        }

        try {
            firebase.initializeApp(this.config);
            this.db = firebase.firestore();
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error("Firebase Init Error:", error);
            return false;
        }
    },

    async saveJourney(userData) {
        if (!this.isInitialized && !this.init()) {
            // If not initialized, try to use a local fallback or prompt
            const confirmSave = confirm("Firebase is not configured. Would you like to download your journey as a JSON file instead?");
            if (confirmSave) {
                this.downloadLocal(userData);
            }
            return;
        }

        try {
            const docRef = await this.db.collection("journeys").add({
                ...userData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Journey saved with ID: ", docRef.id);
            alert("Journey saved successfully to the cloud! 🚀");
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to save to cloud. Downloading locally instead...");
            this.downloadLocal(userData);
        }
    },

    downloadLocal(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VoteDost_Journey_${data.userName || 'Voter'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

window.dbService = dbService;
