(function(){
'use strict';

// ===== FIREBASE =====
var db = null;
function getDB() {
    if (db) return db;
    if (typeof firebase !== 'undefined' && firebase.database && typeof firebaseConfig !== 'undefined') {
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            db = firebase.database();
            return db;
        } catch(e) { console.warn('Firebase init error:', e); }
    }
    return null;
}

// ===== AUTH =====
var PASSWORD = 'own123';
function isLoggedIn() { return sessionStorage.getItem('rajawali_admin') === '1'; }
function setLoggedIn() { sessionStorage.setItem('rajawali_admin', '1'); }
function logout() {
    sessionStorage.removeItem('rajawali_admin');
    closeAdminPanel();
    showNotif('Logout berhasil', 'info');
}

// ===== NOTIFICATION =====
function showNotif(msg, type) {
    type = type || 'success';
    var old = document.querySelector('.admin-notification');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'admin-notification admin-notification-' + type;
    var icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    el.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span>' + msg + '</span>';
    document.body.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('show'); });
    setTimeout(function(){ el.classList.remove('show'); setTimeout(function(){ el.remove(); }, 300); }, 2500);
}

// ===== FIREBASE SAVE =====
function fbSave(path, data) {
    var d = getDB();
    if (!d) { showNotif('Firebase tidak tersedia!', 'error'); return; }
    d.ref(path).set(data)
        .then(function(){ showNotif('Tersimpan! ✅', 'success'); })
        .catch(function(e){ showNotif('Gagal: '+e.message, 'error'); });
}

function fbDelete(path) {
    var d = getDB();
    if (!d) return;
    d.ref(path).remove();
}

// ===== SAVE MEMBER DATA (BUKAN RECURSIVE!) =====
function saveMemberPhoto(id, dataUrl) {
    var d = getDB();
    if (!d) { showNotif('Firebase tidak tersedia!', 'error'); return; }
    d.ref('members/' + id + '/photo').set(dataUrl)
        .then(function(){
            showNotif('Foto ' + id + ' tersimpan! 📸', 'success');
            // Update semua gambar di halaman
            var imgs = document.querySelectorAll('[data-member-img="' + id + '"]');
            imgs.forEach(function(img){ img.src = dataUrl; });
            var aimgs = document.querySelectorAll('[data-admin-img="' + id + '"]');
            aimgs.forEach(function(img){ img.src = dataUrl; });
        })
        .catch(function(e){ showNotif('Gagal: '+e.message, 'error'); });
}

function saveMemberBio(id, text) {
    fbSave('members/' + id + '/bio', text);
    var els = document.querySelectorAll('[data-member-bio="' + id + '"]');
    els.forEach(function(el){ el.textContent = text; });
}

function saveMemberRole(id, text) {
    fbSave('members/' + id + '/role', text);
    var els = document.querySelectorAll('[data-member-role="' + id + '"]');
    els.forEach(function(el){ el.textContent = text; });
    var els2 = document.querySelectorAll('[data-admin-role="' + id + '"]');
    els2.forEach(function(el){ el.textContent = text; });
}

// ===== GALLERY =====
function addGalleryImage(src, title) {
    var id = 'img_' + Date.now();
    fbSave('gallery/' + id, { src: src, title: title || 'Foto', date: Date.now() });
}
function deleteGalleryImage(id) {
    fbDelete('gallery/' + id);
    showNotif('Dihapus 🗑️');
}

// ===== LOGIN MODAL =====
function showLoginModal() {
    var oldModal = document.getElementById('admin-login-modal');
    if (oldModal) oldModal.remove();

    var m = document.createElement('div');
    m.id = 'admin-login-modal';
    m.className = 'admin-login-modal active';
    m.innerHTML =
        '<div class="admin-login-overlay"></div>' +
        '<div class="admin-login-box">' +
        '<div class="admin-login-icon"><i class="fas fa-crown"></i></div>' +
        '<h3>Owner Login</h3>' +
        '<form id="login-form">' +
        '<div class="admin-login-field">' +
        '<label><i class="fas fa-user"></i> Username</label>' +
        '<input type="text" id="login-username" value="owner" readonly style="opacity:0.6">' +
        '</div>' +
        '<div class="admin-login-field">' +
        '<label><i class="fas fa-lock"></i> Password</label>' +
        '<div style="position:relative">' +
        '<input type="password" id="login-password" placeholder="Masukkan password" autofocus>' +
        '<span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;color:#8892b0" onclick="var i=document.getElementById(\'login-password\');i.type=i.type===\'password\'?\'text\':\'password\'"><i class="fas fa-eye"></i></span>' +
        '</div></div>' +
        '<button type="submit" class="admin-login-btn"><i class="fas fa-sign-in-alt"></i> Masuk</button>' +
        '<div id="login-error" style="color:#ff6b6b;font-size:13px;margin-top:10px;display:none"><i class="fas fa-exclamation-circle"></i> Password salah!</div>' +
        '</form></div>';
    document.body.appendChild(m);
    document.getElementById('login-form').addEventListener('submit', function(e){
        e.preventDefault();
        var pw = document.getElementById('login-password').value;
        if (pw === PASSWORD) {
            document.getElementById('admin-login-modal').remove();
            setLoggedIn();
            openAdminPanel();
        } else {
            var err = document.getElementById('login-error');
            err.style.display = 'block';
            setTimeout(function(){ err.style.display = 'none'; }, 2000);
        }
    });
    setTimeout(function(){
        var inp = document.getElementById('login-password');
        if (inp) inp.focus();
    }, 100);
}

// ===== ADMIN PANEL - OPEN/CLOSE =====
function openAdminPanel() {
    var p = document.getElementById('admin-panel');
    if (!p) p = buildAdminPanel();
    p.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Refresh tabs
    refreshMembersTab();
    refreshGalleryTab();
    refreshSettingsTab();
}

function closeAdminPanel() {
    var p = document.getElementById('admin-panel');
    if (p) {
        p.classList.remove('active');
        document.body.style.overflow = '';
        // JANGAN hapus dari DOM! Cuma sembunyiin aja
    }
}

// ===== BUILD ADMIN PANEL (SEKALI BUAT) =====
function buildAdminPanel() {
    var p = document.createElement('div');
    p.id = 'admin-panel';
    p.className = 'admin-panel';
    p.innerHTML =
        '<div class="admin-overlay" onclick="closeAdminPanel()"></div>' +
        '<div class="admin-container">' +
        '<div class="admin-header">' +
        '<div class="admin-header-left">' +
        '<div class="admin-logo-icon"><i class="fas fa-crown"></i></div>' +
        '<div><h3>Owner Dashboard</h3><span style="font-size:11px;color:#64ffda">Firebase Realtime</span></div>' +
        '</div>' +
        '<div class="admin-header-right">' +
        '<button class="admin-btn-icon" onclick="openSettings()"><i class="fas fa-cog"></i></button>' +
        '<button class="admin-btn-icon" onclick="logout()"><i class="fas fa-sign-out-alt"></i></button>' +
        '<button class="admin-btn-icon" onclick="closeAdminPanel()"><i class="fas fa-times"></i></button>' +
        '</div></div>' +
        '<div class="admin-tabs">' +
        '<button class="admin-tab active" data-tab="members"><i class="fas fa-users"></i> Anggota</button>' +
        '<button class="admin-tab" data-tab="gallery"><i class="fas fa-images"></i> Galeri</button>' +
        '<button class="admin-tab" data-tab="settings"><i class="fas fa-sliders-h"></i> Pengaturan</button>' +
        '</div>' +
        '<div class="admin-body">' +
        '<div class="admin-tab-content active" id="admin-members-tab"></div>' +
        '<div class="admin-tab-content" id="admin-gallery-tab"></div>' +
        '<div class="admin-tab-content" id="admin-settings-tab"></div>' +
        '</div></div>';
    document.body.appendChild(p);

    // Tab switching
    p.querySelectorAll('.admin-tab').forEach(function(tab){
        tab.addEventListener('click', function(){
            p.querySelectorAll('.admin-tab').forEach(function(t){ t.classList.remove('active'); });
            p.querySelectorAll('.admin-tab-content').forEach(function(c){ c.classList.remove('active'); });
            this.classList.add('active');
            var id = 'admin-' + this.dataset.tab + '-tab';
            var ct = document.getElementById(id);
            if (ct) ct.classList.add('active');
            if (this.dataset.tab === 'members') refreshMembersTab();
            if (this.dataset.tab === 'gallery') refreshGalleryTab();
            if (this.dataset.tab === 'settings') refreshSettingsTab();
        });
    });

    return p;
}

// ===== REFRESH MEMBERS TAB =====
function refreshMembersTab() {
    var c = document.getElementById('admin-members-tab');
    if (!c || !window.membersData || !membersData.length) return;

    // Baca data Firebase dulu
    var d = getDB();
    var fbData = {};

    function renderMembersPanel(firebaseData) {
        var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;padding:16px">';
        membersData.forEach(function(m, i) {
            var num = (i+1).toString().padStart(2,'0');
            var fb = firebaseData && firebaseData[m.id] ? firebaseData[m.id] : {};
            var photo = fb.photo || m.photo || '';
            var bio = fb.bio || m.bio || '';
            var role = fb.role || m.role || 'Anggota';
            var initials = (m.name || '').split(' ').map(function(s){ return s[0]; }).join('').substring(0,2).toUpperCase();

            html += '<div class="admin-member-card">' +
                '<div class="admin-member-photo-area">' +
                '<div class="admin-photo-wrapper" style="width:90px;height:90px;margin:0 auto;border-radius:50%;padding:3px;background:linear-gradient(135deg,#64ffda,#00bfa5)">' +
                (photo
                    ? '<img data-admin-img="' + m.id + '" src="' + photo + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:3px solid #112240" onerror="this.remove()">'
                    : '<div style="width:100%;height:100%;border-radius:50%;background:#0a192f;display:flex;align-items:center;justify-content:center;font-size:28px;color:#64ffda;font-weight:700">' + initials + '</div>'
                ) +
                '</div>' +
                '<div style="margin-top:6px;font-size:11px;color:#8892b0">#' + num + ' • <span data-admin-role="' + m.id + '">' + role + '</span></div>' +
                '</div>' +
                '<div class="admin-member-info">' +
                '<div style="font-weight:600;color:#ccd6f6;margin-bottom:6px;font-size:14px">' + m.name + '</div>' +

                '<div class="admin-field"><label>Upload Foto</label>' +
                '<input type="file" accept="image/*" onchange="adminUploadPhoto(\'' + m.id + '\',this)">' +
                '</div>' +

                '<div class="admin-field"><label>Bio</label>' +
                '<textarea rows="2" placeholder="Bio anggota..." data-input-bio="' + m.id + '">' + bio + '</textarea>' +
                '</div>' +

                '<div class="admin-field"><label>Role/Jabatan</label>' +
                '<input type="text" data-input-role="' + m.id + '" value="' + role + '">' +
                '</div>' +

                '<div style="display:flex;gap:8px;margin-top:8px">' +
                '<button class="admin-btn" onclick="adminSaveBio(\'' + m.id + '\')"><i class="fas fa-save"></i> Simpan</button>' +
                '<button class="admin-btn" onclick="adminSaveRole(\'' + m.id + '\')"><i class="fas fa-tag"></i> Role</button>' +
                '</div>' +
                '</div></div>';
        });
        html += '</div>';
        c.innerHTML = html;
    }

    if (d) {
        d.ref('members').once('value').then(function(snap){
            renderMembersPanel(snap.val() || {});
        }).catch(function(){
            renderMembersPanel({});
        });
    } else {
        renderMembersPanel({});
    }
}

// ===== ADMIN HELPERS =====
function adminUploadPhoto(id, input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var maxW = 400;
            var scale = Math.min(maxW / img.width, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            saveMemberPhoto(id, dataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function adminSaveBio(id) {
    var el = document.querySelector('[data-input-bio="' + id + '"]');
    if (!el) return;
    saveMemberBio(id, el.value);
}

function adminSaveRole(id) {
    var el = document.querySelector('[data-input-role="' + id + '"]');
    if (!el) return;
    saveMemberRole(id, el.value);
}

// ===== REFRESH GALLERY TAB =====
function refreshGalleryTab() {
    var c = document.getElementById('admin-gallery-tab');
    if (!c) return;

    c.innerHTML =
        '<div style="padding:16px">' +
        '<div style="margin-bottom:16px;padding:16px;background:rgba(100,255,218,0.03);border:1px dashed #64ffda;border-radius:12px;text-align:center">' +
        '<input type="file" accept="image/*" id="gallery-upload-input" style="display:none" onchange="adminUploadGallery(this)">' +
        '<button class="admin-btn" onclick="document.getElementById(\'gallery-upload-input\').click()"><i class="fas fa-plus"></i> Tambah Foto</button>' +
        '</div>' +
        '<div id="admin-gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">' +
        '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#8892b0"><i class="fas fa-spinner fa-spin" style="font-size:30px;display:block;margin-bottom:12px"></i>Memuat galeri...</div>' +
        '</div></div>';

    var d = getDB();
    if (d) {
        d.ref('gallery').on('value', function(snap) {
            var data = snap.val() || {};
            var grid = document.getElementById('admin-gallery-grid');
            if (!grid) return;
            var keys = Object.keys(data);
            if (!keys.length) {
                grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#8892b0"><i class="fas fa-images" style="font-size:40px;display:block;margin-bottom:12px"></i>Belum ada foto galeri</div>';
                return;
            }
            var ghtml = '';
            keys.reverse().forEach(function(key) {
                var item = data[key];
                ghtml += '<div style="position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;border:1px solid rgba(100,255,218,0.1)">' +
                    '<img src="' + item.src + '" style="width:100%;height:100%;object-fit:cover" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22112240%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%2264ffda%22 font-size=%2214%22>Error</text></svg>\'">' +
                    '<div style="position:absolute;bottom:0;left:0;right:0;padding:4px 8px;background:rgba(0,0,0,0.7);font-size:11px;color:#ccd6f6">' + (item.title || '') + '</div>' +
                    '<button onclick="deleteGalleryImage(\'' + key + '\')" style="position:absolute;top:4px;right:4px;background:rgba(255,0,0,0.7);border:none;color:white;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>' +
                    '</div>';
            });
            grid.innerHTML = ghtml;
        });
    }
}

function adminUploadGallery(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        addGalleryImage(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
}

// ===== REFRESH SETTINGS TAB =====
function refreshSettingsTab() {
    var c = document.getElementById('admin-settings-tab');
    if (!c) return;
    c.innerHTML =
        '<div style="padding:24px;max-width:500px;margin:0 auto">' +
        '<h3 style="color:#ccd6f6;margin-bottom:20px"><i class="fas fa-sliders-h"></i> Pengaturan</h3>' +
        '<div style="padding:16px;background:rgba(100,255,218,0.03);border-radius:12px;border:1px solid rgba(100,255,218,0.1);margin-bottom:16px">' +
        '<h4 style="color:#64ffda;font-size:14px;margin-bottom:12px"><i class="fas fa-database"></i> Data Firebase</h4>' +
        '<p style="font-size:13px;color:#8892b0;margin-bottom:12px">Data anggota & galeri tersimpan otomatis di Firebase Realtime Database.</p>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
        '<button class="admin-btn" onclick="exportAllData()"><i class="fas fa-download"></i> Export JSON</button>' +
        '<button class="admin-btn" onclick="if(confirm(\'Yakin reset semua data Firebase?\')){var d=getDB();if(d){d.ref(\'members\').remove();d.ref(\'gallery\').remove();showNotif(\'Data direset!\',\'info\')}}" style="background:rgba(255,107,107,0.15);border-color:#ff6b6b;color:#ff6b6b"><i class="fas fa-trash-alt"></i> Reset Data</button>' +
        '</div></div>' +
        '<div style="padding:16px;background:rgba(100,255,218,0.03);border-radius:12px;border:1px solid rgba(100,255,218,0.1)">' +
        '<h4 style="color:#64ffda;font-size:14px;margin-bottom:12px"><i class="fas fa-info-circle"></i> Info</h4>' +
        '<div style="font-size:13px;color:#8892b0;line-height:2">' +
        '<div><span style="color:#64ffda">●</span> Firebase: ' + (getDB() ? '✅ Tersambung' : '❌ Tidak tersedia') + '</div>' +
        '<div><span style="color:#64ffda">●</span> Login: triple-tap foto Shandika</div>' +
        '<div><span style="color:#64ffda">●</span> Password: own123</div>' +
        '<div><span style="color:#64ffda">●</span> Data realtime sync ke semua device</div>' +
        '</div></div></div>';
}

function exportAllData() {
    var d = getDB();
    if (!d) { showNotif('Firebase tidak tersedia', 'error'); return; }
    d.ref().once('value').then(function(snap) {
        var data = snap.val();
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'regu-rajawali-data-' + Date.now() + '.json';
        a.click();
        showNotif('Data di-export! 📥', 'success');
    });
}

// ===== FIREBASE -> MEMBER CARDS (Realtime) =====
function setupFirebaseSync() {
    var d = getDB();
    if (!d || !window.membersData) return;

    // Listen realtime
    d.ref('members').on('value', function(snap) {
        var fbAll = snap.val() || {};
        membersData.forEach(function(m) {
            var fb = fbAll[m.id];
            if (fb) {
                // Update photo
                if (fb.photo) {
                    m.photo = fb.photo;
                    var imgs = document.querySelectorAll('[data-member-img="' + m.id + '"]');
                    imgs.forEach(function(img){ img.src = fb.photo; });
                }
                // Update bio
                if (fb.bio) {
                    m.bio = fb.bio;
                    var bios = document.querySelectorAll('[data-member-bio="' + m.id + '"]');
                    bios.forEach(function(el){ el.textContent = fb.bio; });
                }
                // Update role
                if (fb.role) {
                    m.role = fb.role;
                    var roles = document.querySelectorAll('[data-member-role="' + m.id + '"]');
                    roles.forEach(function(el){ el.textContent = fb.role; });
                }
            }
        });
    });

    // Listen gallery
    d.ref('gallery').on('value', function(snap) {
        var fbGallery = snap.val() || {};
        if (typeof window.renderGallery === 'function') {
            window.galleryData = fbGallery;
            window.renderGallery();
        }
    });
}

// ===== PATCH EXISTING renderMembers =====
function patchMemberCards() {
    if (!window.membersData) return;
    // Add data attributes to existing member cards
    membersData.forEach(function(m) {
        var card = document.getElementById('member-' + m.id);
        if (!card) return;

        // Find and tag photo
        var photo = card.querySelector('.member-photo, .member-photo-placeholder');
        if (photo && !photo.hasAttribute('data-member-img')) {
            photo.setAttribute('data-member-img', m.id);
        }

        // Find and tag bio
        var bio = card.querySelector('.member-bio');
        if (bio && !bio.hasAttribute('data-member-bio')) {
            bio.setAttribute('data-member-bio', m.id);
        }

        // Find and tag role
        var role = card.querySelector('.member-role');
        if (role && !role.hasAttribute('data-member-role')) {
            role.setAttribute('data-member-role', m.id);
        }
    });
}

// ===== EXPOSE TO WINDOW =====
window.openAdminPanel = openAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.showLoginModal = showLoginModal;
window.adminUploadPhoto = adminUploadPhoto;
window.adminSaveBio = adminSaveBio;
window.adminSaveRole = adminSaveRole;
window.adminUploadGallery = adminUploadGallery;
window.exportAllData = exportAllData;
window.addGalleryImage = addGalleryImage;
window.deleteGalleryImage = deleteGalleryImage;
window.getDB = getDB;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // Triple-tap Shandika (member 08)
    var clickCount = 0, clickTimer = null;
    document.addEventListener('click', function(e) {
        var card = e.target.closest('.member-card');
        if (!card) { clickCount = 0; return; }
        var numEl = card.querySelector('.card-number');
        if (numEl && numEl.textContent.trim() === '08') {
            clickCount++;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(function(){ clickCount = 0; }, 1000);
            if (clickCount >= 3) {
                clickCount = 0; clearTimeout(clickTimer);
                showLoginModal();
            }
        }
    });

    // Double-click logo as backup
    var logo = document.querySelector('.navbar-brand, .footer-logo');
    if (logo) {
        logo.addEventListener('dblclick', function(e) { e.preventDefault(); showLoginModal(); });
    }

    // Auto-open if already logged in
    if (isLoggedIn()) { openAdminPanel(); }

    // Patch cards with data attributes after render
    setTimeout(patchMemberCards, 500);
    setTimeout(patchMemberCards, 1500);

    // Setup Firebase realtime sync
    setTimeout(setupFirebaseSync, 2000);

    console.log('%c👑 Admin Panel Loaded', 'color: #ffd700; font-size: 14px');
    console.log('%c🔐 Password: own123', 'color: #00d4ff');
});
})();
