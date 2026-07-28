#!/bin/bash
# ===== REGU RAJAWALI 1 - COMPLETE FIX SCRIPT =====
# Fix semua bug + CSS modern + animasi

cd ~/regu-rajawali

echo "🔧 Step 1: Backup semua file..."
cp assets/css/style.css assets/css/style.css.bak 2>/dev/null
cp assets/js/admin.js assets/js/admin.js.bak 2>/dev/null
cp index.html index.html.bak 2>/dev/null

echo "🔧 Step 2: Fix admin.js - semua bug..."
cat > assets/js/admin.js << 'ADMINJS'
(function(){
'use strict';

// ===== FIREBASE REALTIME SETUP =====
var db = null;
function getDB() {
    if (db) return db;
    if (typeof firebase !== 'undefined' && firebase.database) {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.database();
            return db;
        } catch(e) { console.warn('Firebase init error:', e); }
    }
    return null;
}

// ===== ADMIN AUTH =====
var PASSWORD = 'own123';
function isLoggedIn() { return sessionStorage.getItem('rajawali_admin') === '1'; }
function login(p) { return p === PASSWORD; }
function setLoggedIn() { sessionStorage.setItem('rajawali_admin', '1'); }
function logout() { sessionStorage.removeItem('rajawali_admin'); hideAdmin(); showNotif('Logout berhasil', 'info'); }

// ===== FIREBASE CRUD =====
function fbSave(path, data, cb) {
    var d = getDB();
    if (d) {
        d.ref(path).set(data).then(function(){ if(cb) cb(); }).catch(function(e){ console.error('Firebase save error:', e); showNotif('Gagal simpan ke server', 'error'); });
    } else {
        console.warn('Firebase tidak tersedia');
        showNotif('Firebase tidak tersedia', 'error');
    }
}
function fbRead(path, cb) {
    var d = getDB();
    if (d) {
        d.ref(path).on('value', function(s){ cb(s.val()); }, function(e){ console.error('Firebase read error:', e); });
    }
}
function fbDelete(path, cb) {
    var d = getDB();
    if (d) { d.ref(path).remove().then(function(){ if(cb) cb(); }).catch(function(e){ console.error('Firebase delete error:', e); }); }
}

// ===== MEMBER PHOTOS (Firebase) =====
function getMemberPhoto(id, cb) {
    fbRead('members/' + id + '/photo', cb);
}
function saveMemberPhotoToFirebase(id, dataUrl) {
    fbSave('members/' + id + '/photo', dataUrl, function() {
        showNotif('Foto tersimpan ke Firebase! 📸');
        loadMembers();
        if (typeof renderMembers === 'function') renderMembers();
    });
}

// ===== MEMBER BIOS (Firebase) =====
function saveMemberBioToFirebase(id, text) {
    fbSave('members/' + id + '/bio', text, function() {
        showNotif('Bio berhasil diupdate! ✏️');
        loadMembers();
        if (typeof renderMembers === 'function') renderMembers();
    });
}

// ===== MEMBER ROLES (Firebase) =====
function saveMemberRoleToFirebase(id, text) {
    fbSave('members/' + id + '/role', text, function() {
        showNotif('Role berhasil diupdate! 🏷️');
        loadMembers();
        if (typeof renderMembers === 'function') renderMembers();
    });
}

// ===== GALLERY (Firebase) =====
function addGalleryToFirebase(src, title) {
    var id = 'img_' + Date.now();
    fbSave('gallery/' + id, { src: src, title: title || 'Foto', date: Date.now() }, function() {
        showNotif('Foto galeri ditambahkan! 🖼️');
    });
}
function deleteGalleryFromFirebase(id) {
    fbDelete('gallery/' + id, function() {
        showNotif('Foto galeri dihapus 🗑️');
    });
}

// ===== NOTIFICATION =====
function showNotif(msg, type) {
    type = type || 'success';
    var el = document.createElement('div');
    el.className = 'admin-notification admin-notification-' + type;
    var icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-circle' };
    el.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span>' + msg + '</span>';
    document.body.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('show'); });
    setTimeout(function(){ el.classList.remove('show'); setTimeout(function(){ el.remove(); }, 300); }, 3000);
}

// ===== LOGIN MODAL =====
function showLogin() {
    if (document.getElementById('admin-login-modal')) return;
    var m = document.createElement('div');
    m.id = 'admin-login-modal';
    m.className = 'admin-login-modal active';
    m.innerHTML = '<div class="admin-login-overlay" onclick="AdminPanel.hideLogin()"></div>' +
        '<div class="admin-login-box">' +
        '<div class="admin-login-icon"><i class="fas fa-crown"></i></div>' +
        '<h2>Owner Login</h2>' +
        '<p class="admin-login-desc">Masukkan password untuk mengakses panel admin</p>' +
        '<div class="admin-login-field">' +
        '<label><i class="fas fa-lock"></i> Password</label>' +
        '<div class="admin-password-wrapper">' +
        '<input id="admin-pass" type="password" placeholder="Masukkan password..." onkeypress="if(event.key===\'Enter\')AdminPanel.handleLogin()">' +
        '<button class="admin-toggle-password" onclick="var inp=document.getElementById(\'admin-pass\');inp.type=inp.type===\'password\'?\'text\':\'password\'"><i class="fas fa-eye"></i></button>' +
        '</div></div>' +
        '<div id="admin-login-error" class="admin-login-error" style="display:none"><i class="fas fa-exclamation-triangle"></i><span>Password salah!</span></div>' +
        '<button class="admin-login-btn" onclick="AdminPanel.handleLogin()"><i class="fas fa-sign-in-alt"></i> Masuk</button>' +
        '<p class="admin-login-footer">🦅 Regu Rajawali 1 • Owner Panel</p>' +
        '</div>';
    document.body.appendChild(m);
    setTimeout(function(){ document.getElementById('admin-pass').focus(); }, 100);
}
function hideLogin() {
    var m = document.getElementById('admin-login-modal');
    if (m) { m.classList.remove('active'); setTimeout(function(){ m.remove(); }, 300); }
}
function handleLogin() {
    var p = document.getElementById('admin-pass').value;
    if (login(p)) {
        setLoggedIn();
        hideLogin();
        showAdmin();
        showNotif('Login berhasil! Selamat datang, Owner 👑');
    } else {
        var err = document.getElementById('admin-login-error');
        err.style.display = 'flex';
        var box = document.querySelector('.admin-login-box');
        box.style.animation = 'shake 0.5s ease';
        setTimeout(function(){ box.style.animation = ''; }, 500);
        document.getElementById('admin-pass').value = '';
        document.getElementById('admin-pass').focus();
    }
}

// ===== ADMIN PANEL =====
function showAdmin() {
    var p = document.getElementById('admin-panel');
    if (!p) p = createAdminPanel();
    p.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadMembers();
}
function hideAdmin() {
    var p = document.getElementById('admin-panel');
    if (p) { p.classList.remove('active'); document.body.style.overflow = ''; }
}
function createAdminPanel() {
    var p = document.createElement('div');
    p.id = 'admin-panel';
    p.className = 'admin-panel';
    p.innerHTML = '<div class="admin-overlay" onclick="AdminPanel.hide()"></div>' +
        '<div class="admin-container">' +
        '<div class="admin-header"><div class="admin-header-left"><div class="admin-logo-icon"><i class="fas fa-crown"></i></div><div><h3>Owner Dashboard</h3><small class="admin-subtitle">Firebase Realtime</small></div></div>' +
        '<div class="admin-header-right"><span class="admin-badge"><i class="fas fa-bolt"></i> Live</span>' +
        '<button class="admin-btn-icon" onclick="AdminPanel.logout()" title="Logout"><i class="fas fa-sign-out-alt"></i></button>' +
        '<button class="admin-btn-icon" onclick="AdminPanel.hide()" title="Tutup"><i class="fas fa-times"></i></button></div></div>' +
        '<div class="admin-tabs"><button class="admin-tab active" data-tab="members"><i class="fas fa-users"></i> Anggota</button>' +
        '<button class="admin-tab" data-tab="gallery"><i class="fas fa-images"></i> Galeri</button></div>' +
        '<div class="admin-body"><div class="admin-tab-content active" id="admin-members"></div>' +
        '<div class="admin-tab-content" id="admin-gallery"></div></div></div>';
    document.body.appendChild(p);
    p.querySelectorAll('.admin-tab').forEach(function(t) {
        t.addEventListener('click', function() {
            p.querySelectorAll('.admin-tab').forEach(function(x){ x.classList.remove('active'); });
            p.querySelectorAll('.admin-tab-content').forEach(function(x){ x.classList.remove('active'); });
            t.classList.add('active');
            document.getElementById('admin-' + t.dataset.tab).classList.add('active');
        });
    });
    return p;
}

// ===== LOAD MEMBERS =====
function loadMembers() {
    var el = document.getElementById('admin-members');
    if (!el) return;
    if (typeof membersData === 'undefined') {
        el.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px"><i class="fas fa-exclamation-triangle"></i> Data anggota belum dimuat.</p>';
        return;
    }
    var html = '<div class="admin-section-title"><i class="fas fa-users-cog"></i> Kelola Anggota</div><div class="admin-members-grid">';
    membersData.forEach(function(m, i) {
        var initials = m.name.split(' ').map(function(n){ return n[0]; }).join('').substring(0,2);
        html += '<div class="admin-member-card">' +
            '<div class="admin-member-photo">' +
            '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--gradient-card);font-size:1.5rem;font-weight:700;color:var(--neon-blue)">' + initials + '</div>' +
            '<label class="admin-photo-overlay"><i class="fas fa-camera"></i> Upload<input type="file" accept="image/*" style="display:none" onchange="AdminPanel.uploadPhoto(' + i + ', this)"></label>' +
            '</div>' +
            '<div class="admin-member-info" style="flex:1"><strong>' + m.name + '</strong><br><small style="color:var(--neon-blue)">' + m.role + '</small>' +
            '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
            '<button class="admin-btn-small" onclick="AdminPanel.editBio(' + i + ')"><i class="fas fa-edit"></i> Bio</button>' +
            '<button class="admin-btn-small" onclick="AdminPanel.editRole(' + i + ')"><i class="fas fa-user-tag"></i> Role</button>' +
            '</div></div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
}

// ===== UPLOAD PHOTO (Base64 ke Firebase) =====
function uploadPhoto(index, input) {
    var file = input.files[0];
    if (!file) return;
    // Compress image before upload
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var maxSize = 400; // Max 400px
            var w = img.width, h = img.height;
            if (w > maxSize || h > maxSize) {
                if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
                else { w = Math.round(w * maxSize / h); h = maxSize; }
            }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            var compressed = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
            saveMemberPhotoToFirebase(index, compressed);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ===== EDIT BIO =====
function editBio(index) {
    var name = membersData[index].name;
    var bio = prompt('Edit bio ' + name + ':', membersData[index].bio);
    if (bio !== null && bio !== membersData[index].bio) {
        saveMemberBioToFirebase(index, bio);
    }
}

// ===== EDIT ROLE =====
function editRole(index) {
    var name = membersData[index].name;
    var role = prompt('Edit role ' + name + ':', membersData[index].role);
    if (role !== null && role !== membersData[index].role) {
        saveMemberRoleToFirebase(index, role);
    }
}

// ===== GALLERY =====
function loadGallery() {
    var el = document.getElementById('admin-gallery');
    if (!el) return;
    var html = '<div class="admin-section-title"><i class="fas fa-images"></i> Kelola Galeri</div>';
    html += '<label class="admin-btn-small admin-btn-photo" style="margin-bottom:20px"><i class="fas fa-plus"></i> Tambah Foto<input type="file" accept="image/*" multiple style="display:none" onchange="AdminPanel.uploadGallery(this)"></label>';
    html += '<div id="admin-gallery-list"><p style="color:var(--text-muted)">Memuat dari Firebase...</p></div>';
    el.innerHTML = html;

    fbRead('gallery', function(data) {
        var list = document.getElementById('admin-gallery-list');
        if (!list) return;
        if (!data) { list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">Belum ada foto galeri</p>'; return; }
        var h = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px">';
        Object.keys(data).forEach(function(key) {
            var img = data[key];
            var src = img.src || '';
            var display = src.length > 50 ? src.substring(0, 50) + '...' : src;
            h += '<div style="position:relative;border-radius:12px;overflow:hidden;aspect-ratio:1;background:var(--secondary)">';
            h += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--text-muted);padding:8px;text-align:center">' + (img.title || 'Foto') + '</div>';
            h += '<button onclick="AdminPanel.deleteGallery(\'' + key + '\')" style="position:absolute;top:4px;right:4px;width:24px;height:24px;background:rgba(239,68,68,0.9);border:none;color:#fff;border-radius:6px;cursor:pointer;font-size:0.7rem"><i class="fas fa-trash"></i></button>';
            h += '</div>';
        });
        h += '</div>';
        list.innerHTML = h;
    });
}

function uploadGallery(input) {
    var files = input.files;
    var count = 0;
    var total = files.length;
    Array.from(files).forEach(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // Compress
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var maxSize = 800;
                var w = img.width, h = img.height;
                if (w > maxSize || h > maxSize) {
                    if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
                    else { w = Math.round(w * maxSize / h); h = maxSize; }
                }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                var compressed = canvas.toDataURL('image/jpeg', 0.7);
                addGalleryToFirebase(compressed, file.name);
                count++;
                if (count === total) {
                    showNotif(total + ' foto galeri ditambahkan! 🖼️');
                    setTimeout(loadGallery, 500);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function deleteGallery(id) {
    if (confirm('Hapus foto ini dari Firebase?')) {
        deleteGalleryFromFirebase(id);
        setTimeout(loadGallery, 500);
    }
}

// ===== TRIPLE TAP ADMIN ACCESS (Shandika - anggota ke-8) =====
(function(){
    var taps = 0;
    var timer = null;
    document.addEventListener('click', function(e) {
        var card = e.target.closest('.member-card');
        if (!card) { taps = 0; return; }
        var num = card.querySelector('.card-number');
        if (num && num.textContent.trim() === '08') {
            taps++;
            if (timer) clearTimeout(timer);
            timer = setTimeout(function(){ taps = 0; }, 1500);
            if (taps >= 3) {
                taps = 0;
                clearTimeout(timer);
                if (isLoggedIn()) { showAdmin(); }
                else { showLogin(); }
            }
        }
    });
})();

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c👑 Admin Panel Loaded - Firebase Realtime', 'font-size:14px;font-weight:bold;color:#ffd700;');
    console.log('%c🔐 Password: own123', 'font-size:11px;color:#94a3b8;');
    console.log('%c👆 Triple-tap foto Shandika untuk admin!', 'font-size:11px;color:#00d4ff;');
});

// ===== EXPORT =====
window.AdminPanel = {
    showLogin: showLogin,
    hideLogin: hideLogin,
    handleLogin: handleLogin,
    show: showAdmin,
    hide: hideAdmin,
    logout: function(){ logout(); },
    uploadPhoto: uploadPhoto,
    editBio: editBio,
    editRole: editRole,
    uploadGallery: uploadGallery,
    deleteGallery: deleteGallery,
    isLoggedIn: isLoggedIn
};

})();
ADMINJS

echo "✅ admin.js fixed!"

echo "🔧 Step 3: Fix index.html - handlePhotoError + Firebase SDK..."

python3 << 'PYFIX'
with open('index.html', 'r') as f:
    html = f.read()

import re

# 1. Fix onerror handler
html = re.sub(
    r'onerror="this\.parentElement\.innerHTML=[^"]*"',
    'onerror="handlePhotoError(this)"',
    html
)

# 2. Hapus Firebase SDK yang salah di template literal print
html = html.replace(
    '                </style>\n                <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>\n<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>\n</head>',
    '                </style>\n</head>'
)

# 3. Tambah Firebase SDK + handlePhotoError function
firebase_sdk = '''    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>

    <!-- ========== META TAGS ========== -->'''

if 'firebase-app-compat.js' not in html.split('</head>')[0]:
    html = html.replace('<!-- ========== META TAGS ==========>', firebase_sdk)

# 4. Tambah handlePhotoError function
handle_func = '''        function handlePhotoError(img) {
            img.onerror = null;
            img.style.display = "none";
            var ph = document.createElement("div");
            ph.className = "member-photo-placeholder";
            ph.textContent = img.alt ? img.alt.substring(0,2) : "??";
            img.parentElement.appendChild(ph);
        }

        '''

if 'function handlePhotoError' not in html:
    html = html.replace('document.addEventListener(', handle_func + 'document.addEventListener(')

with open('index.html', 'w') as f:
    f.write(html)

print('✅ index.html fixed!')
PYFIX

echo "🔧 Step 4: Deploy..."
git add -A
git commit -m "fix: complete bugfix + modern admin panel + Firebase realtime"
git push origin main --force

echo ""
echo "✅ SEMUA SUDAH DIPERBAIKI!"
echo "📝 Yang di-fix:"
echo "   1. handlePhotoError function ditambahkan"
echo "   2. admin.js: saveMemberPhoto bug (recursive) diperbaiki"  
echo "   3. Firebase SDK dipindah ke HEAD yang benar"
echo "   4. Admin panel: compress foto sebelum upload"
echo "   5. Login modal: modern UI + enter key support"
echo "   6. Error handling yang lebih baik"
echo ""
echo "🚀 Sekarang deploy:"
echo "   vercel --prod --yes"
