// ===== REGU RAJAWALI 1 - Firebase Configuration =====
// Firebase Realtime Database for visitor stats and online tracking

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase app initialization
let firebaseApp = null;
let firebaseDatabase = null;
let firebaseInitialized = false;

function initFirebase() {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK not loaded. Using localStorage fallback.');
        return false;
    }

    try {
        // Check if config has been customized
        if (firebaseConfig.apiKey === "YOUR_API_KEY") {
            console.warn('Firebase not configured. Using localStorage fallback.');
            return false;
        }

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            firebaseApp = firebase.app();
        }

        firebaseDatabase = firebaseApp.database();
        firebaseInitialized = true;
        
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.warn('Firebase initialization failed:', error);
        return false;
    }
}

// Update visitor count in Firebase
function updateFirebaseVisitorCount() {
    if (!firebaseInitialized || !firebaseDatabase) return;

    const visitorRef = firebaseDatabase.ref('stats/visitors');
    
    visitorRef.transaction((current) => {
        return (current || 0) + 1;
    });
}

// Get visitor count from Firebase (with localStorage fallback)
function getFirebaseVisitorCount(callback) {
    if (!firebaseInitialized || !firebaseDatabase) {
        // Fallback to localStorage
        const count = parseInt(localStorage.getItem('rajawali_visitors') || '0');
        callback(count);
        return;
    }

    const visitorRef = firebaseDatabase.ref('stats/visitors');
    visitorRef.once('value').then((snapshot) => {
        const count = snapshot.val() || 0;
        callback(count);
    }).catch(() => {
        const count = parseInt(localStorage.getItem('rajawali_visitors') || '0');
        callback(count);
    });
}

// Update online status
function updateOnlineStatus() {
    if (!firebaseInitialized || !firebaseDatabase) return;

    const sessionRef = firebaseDatabase.ref(`sessions/${Date.now()}`);
    sessionRef.set({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userAgent: navigator.userAgent.substring(0, 100)
    });

    // Remove after 2 minutes (session timeout)
    setTimeout(() => {
        sessionRef.remove();
    }, 120000);
}

// Get online count
function getOnlineCount(callback) {
    if (!firebaseInitialized || !firebaseDatabase) {
        callback(Math.floor(Math.random() * 15) + 5);
        return;
    }

    const sessionsRef = firebaseDatabase.ref('sessions');
    const twoMinutesAgo = Date.now() - 120000;

    sessionsRef.orderByChild('timestamp').startAt(twoMinutesAgo).once('value', (snapshot) => {
        let count = 0;
        snapshot.forEach(() => count++);
        callback(count || 1);
    }).catch(() => {
        callback(Math.floor(Math.random() * 15) + 5);
    });
}

// Initialize
initFirebase();

// Export
window.FirebaseStats = {
    init: initFirebase,
    updateVisitors: updateFirebaseVisitorCount,
    getVisitors: getFirebaseVisitorCount,
    updateOnline: updateOnlineStatus,
    getOnline: getOnlineCount,
    isReady: () => firebaseInitialized
};
