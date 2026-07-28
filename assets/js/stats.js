// ===== REGU RAJAWALI 1 - Real-time Statistics =====
// Terintegrasi dengan Firebase Realtime Database + fallback localStorage

(function() {
    'use strict';

    // ========== INITIALIZE STATS ==========
    function initStats() {
        const visitorEl = document.getElementById('stat-visitors');
        const onlineEl = document.getElementById('stat-online');
        const daysEl = document.getElementById('stat-days');
        const onlineTimeEl = document.getElementById('stat-online-time');

        // ===== VISITOR COUNT (Firebase + Fallback) =====
        if (visitorEl) {
            if (window.FirebaseStats && window.FirebaseStats.isAvailable()) {
                // Firebase realtime listener
                window.FirebaseStats.getVisitors((count) => {
                    animateNumber(visitorEl, count);
                });
            } else {
                // localStorage fallback
                const count = parseInt(localStorage.getItem('rajawali_visitors') || '1');
                animateNumber(visitorEl, count);
                
                // Refresh setiap 30 detik
                setInterval(() => {
                    const c = parseInt(localStorage.getItem('rajawali_visitors') || '1');
                    animateNumber(visitorEl, c);
                }, 30000);
            }
        }

        // ===== ONLINE COUNT (Firebase + Fallback) =====
        if (onlineEl) {
            if (window.FirebaseStats && window.FirebaseStats.isAvailable()) {
                // Firebase realtime listener (auto-updates)
                window.FirebaseStats.getOnline((count) => {
                    animateNumber(onlineEl, count);
                });
            } else {
                // Fallback: random
                const fallback = Math.floor(Math.random() * 12) + 3;
                animateNumber(onlineEl, fallback);
                
                setInterval(() => {
                    const f = Math.floor(Math.random() * 12) + 3;
                    animateNumber(onlineEl, f);
                }, 15000);
            }
        }

        // ===== DAYS ACTIVE =====
        if (daysEl) {
            const days = window.FirebaseStats 
                ? window.FirebaseStats.getDaysActive() 
                : getDaysActiveFallback();
            animateNumber(daysEl, days);
        }

        // ===== ONLINE TIME TRACKER =====
        let sessionStart = Date.now();
        if (onlineTimeEl) {
            setInterval(() => updateOnlineTime(onlineTimeEl, sessionStart), 1000);
            updateOnlineTime(onlineTimeEl, sessionStart);
        }

        // ===== DIGITAL CLOCK =====
        setInterval(updateClock, 1000);
        updateClock();

        // ===== FIREBASE STATUS INDICATOR =====
        updateFirebaseStatus();
    }

    // ========== FIREBASE STATUS BADGE ==========
    function updateFirebaseStatus() {
        const statsContainer = document.querySelector('.stats-container');
        if (!statsContainer) return;

        const isFirebaseOn = window.FirebaseStats && window.FirebaseStats.isAvailable();
        
        // Remove existing badge
        const existingBadge = document.querySelector('.firebase-status-badge');
        if (existingBadge) existingBadge.remove();

        const badge = document.createElement('div');
        badge.className = 'firebase-status-badge';
        badge.style.cssText = `
            text-align: center;
            margin-bottom: 16px;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `;

        if (isFirebaseOn && window.FirebaseStats) {
            const config = window.FirebaseStats.getConfig ? window.FirebaseStats.getConfig() : {};
            badge.innerHTML = `
                <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 14px;border-radius:20px;
                    background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:#10b981;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#10b981;animation:pulse 2s infinite;"></span>
                    Firebase Realtime • ${config.projectId || 'Connected'}
                </span>
            `;
        } else {
            badge.innerHTML = `
                <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 14px;border-radius:20px;
                    background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);color:#f59e0b;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#f59e0b;"></span>
                    LocalStorage Mode • 
                    <a href="#" onclick="showFirebaseSetup()" style="color:#00d4ff;text-decoration:underline;">
                        Setup Firebase
                    </a>
                </span>
            `;
        }

        statsContainer.parentNode.insertBefore(badge, statsContainer);
    }

    // ========== ANIMATE NUMBER ==========
    function animateNumber(el, target) {
        if (!el) return;
        const current = parseInt(el.textContent.replace(/,/g, '').replace(/\./g, '')) || 0;
        if (current === target) return;
        
        const diff = target - current;
        const duration = 800;
        const steps = 20;
        const increment = diff / steps;
        let step = 0;

        if (el._animInterval) clearInterval(el._animInterval);

        el._animInterval = setInterval(() => {
            step++;
            const value = Math.round(current + increment * step);
            el.textContent = value.toLocaleString();
            if (step >= steps) {
                el.textContent = target.toLocaleString();
                clearInterval(el._animInterval);
                el._animInterval = null;
            }
        }, duration / steps);
    }

    // ========== ONLINE TIME ==========
    function updateOnlineTime(el, startTime) {
        if (!el) return;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        el.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // ========== DAYS ACTIVE FALLBACK ==========
    function getDaysActiveFallback() {
        const startDate = new Date('2026-07-01');
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    // ========== DIGITAL CLOCK ==========
    function updateClock() {
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');
        if (!timeEl && !dateEl) return;

        const now = new Date();
        
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        if (dateEl) {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        }
    }

    // ========== FIREBASE SETUP GUIDE ==========
    window.showFirebaseSetup = function() {
        const guide = document.createElement('div');
        guide.className = 'firebase-setup-guide';
        guide.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            z-index: 1000000; display: flex; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
        `;
        guide.innerHTML = `
            <div style="background:#112240;border:1px solid rgba(255,255,255,0.1);border-radius:24px;
                        padding:40px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;
                        box-shadow:0 0 60px rgba(0,212,255,0.1);">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
                    <div style="width:48px;height:48px;background:linear-gradient(135deg,#ffd700,#ff8c00);
                                border-radius:14px;display:flex;align-items:center;justify-content:center;
                                font-size:1.3rem;">
                        🔥
                    </div>
                    <div>
                        <h3 style="font-size:1.2rem;font-weight:700;">Firebase Setup</h3>
                        <p style="font-size:0.8rem;color:#a0a0b8;">Aktifkan statistik realtime</p>
                    </div>
                    <button onclick="this.closest('.firebase-setup-guide').remove()" style="margin-left:auto;
                        width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);
                        background:transparent;color:#a0a0b8;cursor:pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div style="margin-bottom:20px;padding:16px;background:rgba(0,212,255,0.05);border-radius:12px;
                            border:1px solid rgba(0,212,255,0.1);">
                    <p style="font-size:0.85rem;color:#e8e8e8;line-height:1.7;">
                        <strong style="color:#00d4ff;">Langkah-langkah setup Firebase:</strong>
                    </p>
                </div>

                <ol style="display:flex;flex-direction:column;gap:16px;padding-left:20px;margin-bottom:24px;">
                    <li style="font-size:0.85rem;color:#a0a0b8;line-height:1.6;">
                        <strong style="color:#ffd700;">1. Buka Firebase Console</strong><br>
                        <a href="https://console.firebase.google.com" target="_blank" 
                           style="color:#00d4ff;text-decoration:underline;">
                            console.firebase.google.com
                        </a>
                    </li>
                    <li style="font-size:0.85rem;color:#a0a0b8;line-height:1.6;">
                        <strong style="color:#ffd700;">2. Buat project baru</strong><br>
                        Klik "Add project", beri nama (contoh: "regu-rajawali-1")
                    </li>
                    <li style="font-size:0.85rem;color:#a0a0b8;line-height:1.6;">
                        <strong style="color:#ffd700;">3. Tambahkan Web App</strong><br>
                        Klik ikon <code style="color:#00d4ff;">&lt;/&gt;</code> (Web), beri nama app
                    </li>
                    <li style="font-size:0.85rem;color:#a0a0b8;line-height:1.6;">
                        <strong style="color:#ffd700;">4. Copy konfigurasi</strong><br>
                        Copy object <code style="color:#00d4ff;">firebaseConfig</code> dari Firebase Console
                    </li>
                    <li style="font-size:0.85rem;color:#a0a0b8;line-height:1.6;">
                        <strong style="color:#ffd700;">5. Aktifkan Realtime Database</strong><br>
                        Build > Realtime Database > Create Database > Start in test mode
                    </li>
                    <li style="font-size:0.85rem;color:#a0a0b8;line-height:1.6;">
                        <strong style="color:#ffd700;">6. Paste konfigurasi</strong><br>
                        Buka file <code style="color:#00d4ff;">firebase/firebase-config.js</code><br>
                        Ganti isi <code style="color:#00d4ff;">firebaseConfig</code> dengan punya Anda
                    </li>
                </ol>

                <div style="padding:16px;background:rgba(255,215,0,0.06);border-radius:12px;
                            border:1px solid rgba(255,215,0,0.15);margin-bottom:20px;">
                    <p style="font-size:0.8rem;color:#a0a0b8;">
                        <strong style="color:#ffd700;">📋 Contoh format firebaseConfig:</strong>
                    </p>
                    <pre style="margin-top:8px;padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;
                               font-size:0.7rem;color:#00d4ff;overflow-x:auto;white-space:pre-wrap;">
{
    apiKey: "AIzaSyD-...",
    authDomain: "project-123.firebaseapp.com",
    databaseURL: "https://project-123-default-rtdb.firebaseio.com",
    projectId: "project-123",
    storageBucket: "project-123.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123..."
}</pre>
                </div>

                <div style="padding:16px;background:rgba(16,185,129,0.06);border-radius:12px;
                            border:1px solid rgba(16,185,129,0.15);margin-bottom:24px;">
                    <p style="font-size:0.85rem;color:#10b981;">
                        <i class="fas fa-check-circle"></i> 
                        <strong>Aturan Realtime Database (copy ke Firebase Console):</strong>
                    </p>
                    <pre style="margin-top:8px;padding:12px;background:rgba(0,0,0,0.3);border-radius:8px;
                               font-size:0.7rem;color:#a0a0b8;overflow-x:auto;white-space:pre-wrap;">
{
  "rules": {
    ".read": true,
    ".write": true,
    "visitors": { ".validate": "newData.isNumber()" },
    "sessions": {
      "$session_id": {
        "timestamp": { ".validate": "newData.isNumber()" }
      },
      ".indexOn": ["timestamp"]
    }
  }
}</pre>
                </div>

                <button onclick="this.closest('.firebase-setup-guide').remove()" 
                        style="width:100%;padding:14px;background:linear-gradient(135deg,#00d4ff,#7c3aed);
                               border:none;border-radius:12px;color:#fff;font-family:'Poppins',sans-serif;
                               font-size:0.95rem;font-weight:600;cursor:pointer;">
                    <i class="fas fa-check"></i> Selesai, tutup panduan
                </button>
            </div>
        `;
        document.body.appendChild(guide);

        // Close on overlay click
        guide.addEventListener('click', (e) => {
            if (e.target === guide) guide.remove();
        });
    };

    // ========== START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStats);
    } else {
        initStats();
    }

    console.log('%c📊 Stats Module Ready', 'font-size: 12px; color: #00d4ff;');

})();
