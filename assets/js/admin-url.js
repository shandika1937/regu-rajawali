(function() {
    'use strict';

    var PASSWORD = 'own123';

    // ===== CEK URL UNTUK ADMIN =====
    function checkURL() {
        var hash = window.location.hash;
        var params = new URLSearchParams(window.location.search);
        if (hash === '#admin' || hash === '#/admin' || params.get('admin') === '1') {
            setTimeout(showAdminLogin, 300);
        }
    }

    // ===== TAMPILKAN LOGIN MODAL =====
    window.showAdminLogin = function() {
        // Hapus modal lama jika ada
        var old = document.getElementById('url-admin-modal');
        if (old) old.remove();

        // Cek sudah login
        if (sessionStorage.getItem('rajawali_admin') === '1') {
            bukaPanel();
            return;
        }

        var modal = document.createElement('div');
        modal.id = 'url-admin-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;';

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(5px);';
        overlay.onclick = function() { modal.remove(); };
        modal.appendChild(overlay);

        var box = document.createElement('div');
        box.style.cssText = 'position:relative;background:#0f1f3a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:40px;width:90%;max-width:380px;text-align:center;z-index:1;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

        box.innerHTML = '<div style="font-size:2.5rem;margin-bottom:12px">🔐</div>' +
            '<h2 style="font-size:1.3rem;margin-bottom:8px;color:#e2e8f0;font-family:Poppins,sans-serif">Admin Panel</h2>' +
            '<p style="font-size:0.85rem;color:#64748b;margin-bottom:24px;font-family:Poppins,sans-serif">Masukkan password admin</p>' +
            '<input type="password" id="url-admin-pass" placeholder="Password..." style="width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.06);border-radius:10px;color:#e2e8f0;font-family:Poppins,sans-serif;font-size:0.9rem;outline:none;margin-bottom:16px;box-sizing:border-box;transition:border-color 0.3s" autofocus>' +
            '<button id="url-admin-btn" onclick="cobaLogin()" style="width:100%;padding:12px 28px;border-radius:9999px;font-family:Poppins,sans-serif;font-size:0.9rem;font-weight:600;border:none;cursor:pointer;background:linear-gradient(135deg,#00d4ff,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.3s"><i class="fas fa-sign-in-alt"></i> Masuk</button>' +
            '<p style="margin-top:16px;font-size:0.75rem;color:#64748b;font-family:Poppins,sans-serif">Regu Rajawali 1 • Panel Admin</p>';

        modal.appendChild(box);
        document.body.appendChild(modal);

        // Enter key
        document.getElementById('url-admin-pass').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') cobaLogin();
        });
        setTimeout(function() {
            var inp = document.getElementById('url-admin-pass');
            if (inp) inp.focus();
        }, 100);
    };

    // ===== COBA LOGIN =====
    window.cobaLogin = function() {
        var input = document.getElementById('url-admin-pass');
        var btn = document.getElementById('url-admin-btn');
        if (!input || !btn) return;

        var pass = input.value.trim();
        if (pass === PASSWORD) {
            sessionStorage.setItem('rajawali_admin', '1');
            btn.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
            btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
            setTimeout(function() {
                var modal = document.getElementById('url-admin-modal');
                if (modal) modal.remove();
                bukaPanel();
            }, 600);
        } else {
            input.style.borderColor = '#ef4444';
            input.value = '';
            input.placeholder = 'Password salah!';
            setTimeout(function() {
                input.style.borderColor = '';
                input.placeholder = 'Password...';
            }, 2000);
        }
    };

    // ===== BUKA ADMIN PANEL =====
    function bukaPanel() {
        // Coba berbagai method untuk buka panel
        if (typeof showLogin === 'function') {
            showLogin();
        } else if (window.AdminPanel && typeof AdminPanel.showLogin === 'function') {
            AdminPanel.showLogin();
        } else if (typeof window.showAdminModal === 'function') {
            window.showAdminModal();
        } else {
            // Fallback: buat panel manual
            alert('Admin login berhasil! Panel admin akan muncul.');
        }
    }

    // ===== FLOATING ADMIN BUTTON =====
    function buatTombol() {
        var btn = document.createElement('div');
        btn.id = 'url-admin-fab';
        btn.title = 'Admin Panel (#admin)';
        btn.innerHTML = '<i class="fas fa-shield-alt"></i>';
        btn.style.cssText = 'position:fixed;bottom:80px;right:20px;width:48px;height:48px;border-radius:50%;background:rgba(15,31,58,0.95);border:1px solid rgba(255,215,0,0.3);color:#ffd700;display:flex;align-items:center;justify-content:center;font-size:1.1rem;z-index:999;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:all 0.3s;backdrop-filter:blur(10px);';
        btn.onmouseenter = function() {
            this.style.transform = 'scale(1.1)';
            this.style.borderColor = 'rgba(255,215,0,0.6)';
            this.style.boxShadow = '0 4px 30px rgba(255,215,0,0.2)';
        };
        btn.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.borderColor = 'rgba(255,215,0,0.3)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        };
        btn.onclick = function() {
            showAdminLogin();
        };
        document.body.appendChild(btn);
    }

    // ===== INIT =====
    // Tunggu DOM siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            checkURL();
            buatTombol();
        });
    } else {
        checkURL();
        buatTombol();
    }

    // Pantau perubahan hash
    window.addEventListener('hashchange', checkURL);

    console.log('%c🔐 Admin URL Module Loaded', 'color:#ffd700;font-size:11px');
    console.log('%c📌 Buka /#admin atau klik tombol shield emas', 'color:#00d4ff;font-size:11px');
})();
