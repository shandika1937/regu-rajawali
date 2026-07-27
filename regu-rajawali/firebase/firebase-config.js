// ===== REGU RAJAWALI 1 - Firebase Realtime Database =====
// Konfigurasi untuk statistik realtime (pengunjung, online, dll)
// Otomatis fallback ke localStorage jika Firebase tidak dikonfigurasi

// ========== 1. ISI FIREBASE CONFIG ANDA DI SINI ==========
// Cara dapatkan: https://console.firebase.google.com > Project Settings > General > Your apps > Web app > Config
const firebaseConfig = {
    apiKey: "AIzaSyBzX78p8wYFZH_98nWePccs_rYnaWXgIdM",
    authDomain: "regu-rajawali-1.firebaseapp.com",
    databaseURL: "https://regu-rajawali-1-default-rtdb.firebaseio.com",
    projectId: "regu-rajawali-1",
    storageBucket: "regu-rajawali-1.firebasestorage.app",
    messagingSenderId: "1050547596477",
    appId: "1:1050547596477:web:c927b2467b1c195e2f5bd4"
};

// ========== FIREBASE STATUS ==========
let firebaseApp = null;
let firebaseDatabase = null;
let firebaseAvailable = false; // Set ke true jika Firebase siap

// ========== CEK APAKAH FIREBASE SUDAH DIKONFIGURASI ==========
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
           firebaseConfig.projectId !== "YOUR_PROJECT" &&
           firebaseConfig.databaseURL !== "https://YOUR_PROJECT-default-rtdb.firebaseio.com";
}

// ========== INITIALISASI FIREBASE ==========
function initFirebase() {
    // Cek apakah Firebase SDK sudah diload
    if (typeof firebase === 'undefined') {
        console.warn('⚠️ Firebase SDK tidak ditemukan. Menggunakan localStorage fallback.');
        firebaseAvailable = false;
        return firebaseAvailable;
    }

    // Cek apakah konfigurasi sudah diisi
    if (!isFirebaseConfigured()) {
        console.warn('⚠️ Firebase belum dikonfigurasi. Isi firebaseConfig di firebase-config.js');
        console.log('📋 Cara: https://console.firebase.google.com > Project Settings > Web App > Config');
        firebaseAvailable = false;
        return firebaseAvailable;
    }

    try {
        // Initialize Firebase (cegah double init)
        if (!firebase.apps || !firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            firebaseApp = firebase.app();
        }

        firebaseDatabase = firebaseApp.database();
        firebaseAvailable = true;
        
        console.log('✅ Firebase Realtime Database siap!');
        console.log(`📊 Project: ${firebaseConfig.projectId}`);
        
        return true;
    } catch (error) {
        console.error('❌ Firebase init gagal:', error);
        firebaseAvailable = false;
        return false;
    }
}

// ========== REALTIME DATABASE RULES (untuk Firebase console) ==========
/*
Copy rules ini ke Firebase Console > Realtime Database > Rules:

{
  "rules": {
    ".read": true,
    ".write": true,
    "visitors": {
      ".validate": "newData.isNumber()"
    },
    "sessions": {
      "$session_id": {
        ".validate": "newData.hasChildren(['timestamp'])",
        "timestamp": { ".validate": "newData.isNumber()" },
        "userAgent": { ".validate": "newData.isString()" }
      },
      ".indexOn": ["timestamp"]
    }
  }
}
*/

// ========== VISITOR COUNTER ==========
function updateVisitorCount() {
    if (!firebaseAvailable || !firebaseDatabase) {
        // Fallback: localStorage
        let count = parseInt(localStorage.getItem('rajawali_visitors') || '0');
        count++;
        localStorage.setItem('rajawali_visitors', count.toString());
        return count;
    }

    // Firebase: gunakan transaction untuk atomic increment
    const visitorRef = firebaseDatabase.ref('visitors/count');
    visitorRef.transaction((current) => {
        return (current || 0) + 1;
    });

    return null; // Akan di-update via callback
}

function getVisitorCount(callback) {
    if (!firebaseAvailable || !firebaseDatabase) {
        const count = parseInt(localStorage.getItem('rajawali_visitors') || '0');
        callback(count);
        return;
    }

    // Firebase: realtime listener
    const visitorRef = firebaseDatabase.ref('visitors/count');
    visitorRef.on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        callback(count);
    }, (error) => {
        console.warn('Firebase read error:', error);
        const count = parseInt(localStorage.getItem('rajawali_visitors') || '0');
        callback(count);
    });
}

// ========== ONLINE STATUS (SESSION-BASED) ==========
let sessionRef = null;
let sessionKeepAlive = null;

function updateOnlineStatus() {
    if (!firebaseAvailable || !firebaseDatabase) return;

    // Buat session baru
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionRef = firebaseDatabase.ref(`sessions/${sessionId}`);

    // Set session data
    sessionRef.set({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userAgent: (navigator.userAgent || '').substring(0, 100),
        online: true
    });

    // Update timestamp setiap 30 detik (keep alive)
    if (sessionKeepAlive) clearInterval(sessionKeepAlive);
    sessionKeepAlive = setInterval(() => {
        if (sessionRef) {
            sessionRef.update({
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }
    }, 30000);

    // Hapus session saat page unload
    window.addEventListener('beforeunload', () => {
        if (sessionRef) {
            sessionRef.remove();
        }
        if (sessionKeepAlive) {
            clearInterval(sessionKeepAlive);
        }
    });
}

function getOnlineCount(callback) {
    if (!firebaseAvailable || !firebaseDatabase) {
        // Fallback: random number
        callback(Math.floor(Math.random() * 12) + 3);
        return;
    }

    // Firebase: hitung session aktif (60 detik terakhir)
    const sessionsRef = firebaseDatabase.ref('sessions');
    const oneMinuteAgo = Date.now() - 60000;

    sessionsRef.orderByChild('timestamp').startAt(oneMinuteAgo).on('value', (snapshot) => {
        let count = 0;
        snapshot.forEach(() => count++);
        callback(count || 1);
    }, (error) => {
        console.warn('Firebase online count error:', error);
        callback(Math.floor(Math.random() * 12) + 3);
    });
}

// ========== TOTAL DAYS ACTIVE ==========
function getDaysActive() {
    const startDate = new Date('2026-07-01');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
}

// ========== INITIALIZE ==========
// Coba init Firebase
initFirebase();

// Jika Firebase siap, update visitor & online status
if (firebaseAvailable) {
    // Update visitor count di Firebase
    updateVisitorCount();
    
    // Set online status
    updateOnlineStatus();
} else {
    // Fallback: localStorage visitor count
    let count = parseInt(localStorage.getItem('rajawali_visitors') || '0');
    count++;
    localStorage.setItem('rajawali_visitors', count.toString());
}

// ========== EXPORT API ==========
window.FirebaseStats = {
    initialized: firebaseAvailable,
    
    // Init
    init: initFirebase,
    isConfigured: isFirebaseConfigured,
    isAvailable: () => firebaseAvailable,
    
    // Visitors
    updateVisitors: updateVisitorCount,
    getVisitors: getVisitorCount,
    
    // Online
    updateOnline: updateOnlineStatus,
    getOnline: getOnlineCount,
    
    // Days
    getDaysActive: getDaysActive,
    
    // Config (untuk admin panel)
    getConfig: () => firebaseConfig,
    
    // Manual refresh
    refresh: () => {
        if (!firebaseAvailable) {
            initFirebase();
        }
    }
};

console.log('%c🔥 Firebase Stats Module Loaded', 'font-size: 12px; color: #ffd700;');
console.log(`%c📡 Status: ${firebaseAvailable ? 'ONLINE' : 'FALLBACK (localStorage)'}`, 'font-size: 11px; color: #00d4ff;');
