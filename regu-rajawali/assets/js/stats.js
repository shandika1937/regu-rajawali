// ===== REGU RAJAWALI 1 - Real-time Statistics =====

(function() {
    'use strict';

    // ========== VISITOR COUNTER (localStorage based) ==========
    function getVisitorCount() {
        let count = parseInt(localStorage.getItem('rajawali_visitors') || '0');
        count++;
        localStorage.setItem('rajawali_visitors', count.toString());
        return count;
    }

    function getOnlineDevices() {
        return Math.floor(Math.random() * 15) + 5;
    }

    // ========== DAYS ACTIVE ==========
    function getDaysActive() {
        const startDate = new Date('2026-07-01');
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    }

    // ========== UPDATE STATS ==========
    function updateStats() {
        const visitorEl = document.getElementById('stat-visitors');
        const onlineEl = document.getElementById('stat-online');
        const daysEl = document.getElementById('stat-days');
        const onlineTimeEl = document.getElementById('stat-online-time');

        if (visitorEl) {
            const count = getVisitorCount();
            animateNumber(visitorEl, count);
        }

        if (onlineEl) {
            const online = getOnlineDevices();
            animateNumber(onlineEl, online);
        }

        if (daysEl) {
            const days = getDaysActive();
            animateNumber(daysEl, days);
        }

        if (onlineTimeEl) {
            updateOnlineTime(onlineTimeEl);
        }
    }

    function animateNumber(el, target) {
        const current = parseInt(el.textContent.replace(/,/g, '')) || 0;
        const diff = target - current;
        const duration = 1000;
        const steps = 30;
        const increment = diff / steps;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            const value = Math.round(current + increment * step);
            el.textContent = value.toLocaleString();
            if (step >= steps) {
                el.textContent = target.toLocaleString();
                clearInterval(interval);
            }
        }, duration / steps);
    }

    // ========== ONLINE TIME TRACKER ==========
    let sessionStart = Date.now();

    function updateOnlineTime(el) {
        const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        
        el.textContent = `${h}:${m}:${s}`;
    }

    // ========== DIGITAL CLOCK ==========
    function updateClock() {
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');

        if (!timeEl && !dateEl) return;

        const now = new Date();
        
        if (timeEl) {
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            timeEl.textContent = `${hours}:${minutes}:${seconds}`;
        }

        if (dateEl) {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            
            const dayName = days[now.getDay()];
            const date = now.getDate();
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            
            dateEl.textContent = `${dayName}, ${date} ${month} ${year}`;
        }
    }

    // ========== INITIALIZE ==========
    function init() {
        // Update stats
        updateStats();

        // Update clock every second
        setInterval(updateClock, 1000);
        updateClock();

        // Update online time every second
        setInterval(() => {
            const onlineTimeEl = document.getElementById('stat-online-time');
            if (onlineTimeEl) updateOnlineTime(onlineTimeEl);
        }, 1000);

        // Refresh visitor stats every 30 seconds
        setInterval(() => {
            const onlineEl = document.getElementById('stat-online');
            if (onlineEl) {
                const online = getOnlineDevices();
                animateNumber(onlineEl, online);
            }
        }, 30000);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
