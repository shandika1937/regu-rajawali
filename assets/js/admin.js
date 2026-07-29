(function(){
'use strict';

// ===== FIREBASE =====
var db = null;
function getDB() {
    if (db) return db;
    if (typeof firebase !== 'undefined' && firebase.database) {
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            db = firebase.database();
            return db;
        } catch(e) {}
    }
    return null;
}

// ===== AUTH =====
var PASSWORD = 'own123';
function isLoggedIn() { return sessionStorage.getItem('rajawali_admin') === '1'; }
function setLoggedIn() { sessionStorage.setItem('rajawali_admin', '1'); }
function logout() {
    sessionStorage.removeItem('rajawali_admin');
    hideAdminPanel();
    showNotif('Logout berhasil', 'info');
}

// ===== FIREBASE OPERATIONS =====
function fbSave(path, data) {
    var d = getDB();
    if (d) { d.ref(path).set(data).catch(function(e){ showNotif('Gagal simpan: '+e.message, 'error'); }); }
}
function fbRead(path, cb) {
    var d = getDB();
    if (d) { d.ref(path).on('value', function(s){ cb(s.val()); }); }
}
function fbReadOnce(path, cb) {
    var d = getDB();
    if (d) { d.ref(path).once('value').then(function(s){ cb(s.val()); }); }
}
function fbDelete(path) {
    var d = getDB();
    if (d) { d.ref(path).remove(); }
}

// ===== MEMBER PHOTOS =====
function saveMemberPhoto(id, dataUrl) {
    fbSave('members/' + id + '/photo', dataUrl);
    showNotif('Foto tersimpan! 📸');
}

function getAllMemberPhotos(cb) {
    fbRead('members', function(data) {
        cb(data || {});
    });
}

// ===== MEMBER BIOS =====
function saveMemberBio(id, text) {
    fbSave('members/' + id + '/bio', text);
    showNotif('Bio diupdate! ✏️');
}

// ===== MEMBER ROLES =====
function saveMemberRole(id, text) {
    fbSave('members/' + id + '/role', text);
    showNotif('Role diupdate! 🏷️');
}

// ===== GALLERY =====
function addGalleryImage(src, title) {
    var id = 'img_' + Date.now();
    fbSave('gallery/' + id, { src: src, title: title || 'Foto', date: Date.now() });
    showNotif('Foto galeri ditambahkan! 🖼️');
}
function deleteGalleryImage(id) {
    fbDelete('gallery/' + id);
    showNotif('Foto dihapus 🗑️');
}

// ===== NOTIFICATION =====
function showNotif(msg, type) {
    type = type || 'success';
    var existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'admin-notification admin-notification-' + type;
    var icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    el.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span>' + msg + '</span>';
    document.body.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('show'); });
    setTimeout(function(){ el.classList.remove('show'); setTimeout(function(){ el.remove(); }, 300); }, 3000);
}

// ===== LOGIN MODAL =====
function showLoginModal() {
    if (document.getElementById('admin-login-modal')) return;
    var m = document.createElement('div');
    m.id = 'admin-login-modal';
    m.className = 'admin-login-modal active';
    m.innerHTML = '<div class="admin-login-overlay"></div>'
        + '<div class="admin-login-box">'
        + '<div class="admin-login-icon"><i class="fas fa-crown"></i></div>'
        + '<h3>Owner Login</h3>'
        + '<form id="login-form">'
        + '<div class="admin-login-field">'
        + '<label><i class="fas fa-user"></i> Username</label>'
        + '<input type="text" id="login-username" placeholder="owner" value="owner">'
        + '</div>'
        + '<div class="admin-login-field">'
        + '<label><i class="fas fa-lock"></i> Password</label>'
        + '<div style="position:relative"><input type="password" id="login-password" placeholder="Masukkan password">'
        + '<span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;color:#8892b0" onclick="var i=document.getElementById(\'login-password\');i.type=i.type===\'password\'?\'text\':\'password\'"><i class="fas fa-eye"></i></span></div>'
        + '</div>'
        + '<button type="submit" class="admin-login-btn"><i class="fas fa-sign-in-alt"></i> Masuk</button>'
        + '<div id="login-error" style="color:#ff6b6b;font-size:13px;margin-top:10px;display:none"><i class="fas fa-exclamation-circle"></i> Password salah!</div>'
        + '</form></div>';
    document.body.appendChild(m);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('login-password').focus();
}

function handleLogin(e) {
    e.preventDefault();
    var pw = document.getElementById('login-password').value;
    var err = document.getElementById('login-error');
    if (pw === PASSWORD) {
        setLoggedIn();
        document.getElementById('admin-login-modal').remove();
        showAdminPanel();
    } else {
        err.style.display = 'block';
        setTimeout(function(){ err.style.display = 'none'; }, 2000);
    }
}

// ===== ADMIN PANEL =====
function showAdminPanel() {
    var p = document.getElementById('admin-panel');
    if (!p) p = createAdminPanel();
    p.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadMembersTab();
    loadGalleryTab();
}

function hideAdminPanel() {
    var p = document.getElementById('admin-panel');
    if (p) {
        p.classList.remove('active');
        document.body.style.overflow = '';
        // ❌ JANGAN hapus admin-panel dari DOM!
        // Biarkan saja dia hidden, tinggal show lagi nanti
    }
}

function createAdminPanel() {
    var p = document.createElement('div');
    p.id = 'admin-panel';
    p.className = 'admin-panel';
    p.innerHTML = '<div class="admin-overlay" onclick="hideAdminPanel()"></div>'
        + '<div class="admin-container">'
        + '<div class="admin-header">'
        + '<div class="admin-header-left">'
        + '<div class="admin-logo-icon"><i class="fas fa-crown"></i></div>'
        + '<div><h3>Owner Dashboard</h3><span style="font-size:11px;color:#64ffda">Firebase Realtime</span></div>'
        + '</div>'
        + '<div class="admin-header-right">'
        + '<button class="admin-btn-icon" onclick="showNotif(\'Settings\')"><i class="fas fa-cog"></i></button>'
        + '<button class="admin-btn-icon" onclick="logout()"><i class="fas fa-sign-out-alt"></i></button>'
        + '<button class="admin-btn-icon" onclick="hideAdminPanel()"><i class="fas fa-times"></i></button>'
        + '</div></div>'
        + '<div class="admin-tabs">'
        + '<button class="admin-tab active" data-tab="members"><i class="fas fa-users"></i> Anggota</button>'
        + '<button class="admin-tab" data-tab="gallery"><i class="fas fa-images"></i> Galeri</button>'
        + '<button class="admin-tab" data-tab="settings"><i class="fas fa-sliders-h"></i> Settings</button>'
        + '</div>'
        + '<div class="admin-body">'
        + '<div class="admin-tab-content active" id="admin-members"></div>'
        + '<div class="admin-tab-content" id="admin-gallery"></div>'
        + '<div class="admin-tab-content" id="admin-settings"></div>'
        + '</div></div>';
    document.body.appendChild(p);

    // Tab switching
    p.querySelectorAll('.admin-tab').forEach(function(tab){
        tab.addEventListener('click', function(){
            p.querySelectorAll('.admin-tab').forEach(function(t){ t.classList.remove('active'); });
            p.querySelectorAll('.admin-tab-content').forEach(function(c){ c.classList.remove('active'); });
            this.classList.add('active');
            var content = document.getElementById('admin-' + this.dataset.tab);
            if (content) content.classList.add('active');
            if (this.dataset.tab === 'members') loadMembersTab();
            if (this.dataset.tab === 'gallery') loadGalleryTab();
            if (this.dataset.tab === 'settings') loadSettingsTab();
        });
    });

    return p;
}

// ===== LOAD MEMBERS TAB =====
function loadMembersTab() {
    var c = document.getElementById('admin-members');
    if (!c) return;
    if (!window.membersData || !membersData.length) return;

    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;padding:16px">';

    membersData.forEach(function(m, i) {
        var num = (i+1).toString().padStart(2,'0');
        var initials = (m.name || '').split(' ').map(function(s){ return s[0]; }).join('').substring(0,2);
        html += '<div class="admin-member-card" data-id="' + m.id + '">'
            + '<div class="admin-member-photo-area">'
            + '<img id="admin-photo-' + m.id + '" src="' + (m.photo || '') + '" alt="' + m.name + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #64ffda" onerror="this.src=\'\';this.style.display=\'none\';this.parentElement.innerHTML+=\'<div style=\\\'width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#0a192f,#112240);display:flex;align-items:center;justify-content:center;font-size:28px;color:#64ffda;font-weight:700;border:3px solid #64ffda\\\'>' + initials + '</div>\'">'
            + '<div style="margin-top:8px;font-size:12px;color:#8892b0">#<span id="admin-num-' + m.id + '">' + num + '</span> • <span id="admin-role-display-' + m.id + '">' + (m.role || 'Anggota') + '</span></div>'
            + '</div>'
            + '<div class="admin-member-info">'
            + '<div style="font-weight:600;color:#ccd6f6;margin-bottom:4px">' + m.name + '</div>'
            + '<div class="admin-field"><label>Upload Foto</label><input type="file" accept="image/*" id="file-' + m.id + '" onchange="uploadMemberPhoto(\'' + m.id + '\')"></div>'
            + '<div class="admin-field"><label>Bio</label><textarea id="bio-' + m.id + '" rows="2" placeholder="Bio anggota...">' + (m.bio || '') + '</textarea></div>'
            + '<div class="admin-field"><label>Role/Jabatan</label><input type="text" id="role-' + m.id + '" value="' + (m.role || 'Anggota') + '" placeholder="Jabatan"></div>'
            + '</div>'
            + '</div>';
    });

    html += '</div>';
    c.innerHTML = html;
}

function uploadMemberPhoto(id) {
    var file = document.getElementById('file-' + id).files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        // Compress image
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

            // Save to Firebase
            saveMemberPhoto(id, dataUrl);
            showNotif('Foto ' + id + ' tersimpan!', 'success');

            // Preview
            var imgEl = document.getElementById('admin-photo-' + id);
            if (imgEl) imgEl.src = dataUrl;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ===== LOAD GALLERY TAB =====
function loadGalleryTab() {
    var c = document.getElementById('admin-gallery');
    if (!c) return;

    var html = '<div style="padding:16px">'
        + '<div style="margin-bottom:16px;padding:16px;background:rgba(100,255,218,0.05);border:1px dashed #64ffda;border-radius:12px;text-align:center">'
        + '<input type="file" accept="image/*" id="gallery-upload" style="display:none" onchange="uploadGalleryImage()">'
        + '<button class="admin-btn" onclick="document.getElementById(\'gallery-upload\').click()"><i class="fas fa-plus"></i> Tambah Foto Galeri</button>'
        + '<div style="margin-top:8px;font-size:12px;color:#8892b0">Atau <input type="text" id="gallery-url-input" placeholder="Paste URL gambar..." style="background:transparent;border:none;border-bottom:1px solid #64ffda;color:#ccd6f6;padding:4px 8px;width:300px;outline:none"> <button class="admin-btn" style="padding:4px 12px;font-size:12px" onclick="addGalleryFromUrl()">Tambah</button></div>'
        + '</div>'
        + '<div id="admin-gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px"></div>'
        + '</div>';
    c.innerHTML = html;

    // Load gallery from Firebase
    var d = getDB();
    if (d) {
        d.ref('gallery').on('value', function(snap) {
            var data = snap.val() || {};
            var grid = document.getElementById('admin-gallery-grid');
            if (!grid) return;
            var ghtml = '';
            Object.keys(data).forEach(function(key) {
                var item = data[key];
                ghtml += '<div style="position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1">'
                    + '<img src="' + item.src + '" style="width:100%;height:100%;object-fit:cover" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect fill=%22112240%22 width=%22100%25%22 height=%22100%25%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%2264ffda%22 font-size=%2214%22>Error</text></svg>\'">'
                    + '<div style="position:absolute;bottom:0;left:0;right:0;padding:4px 8px;background:rgba(0,0,0,0.7);font-size:11px;color:#ccd6f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (item.title || '') + '</div>'
                    + '<button onclick="deleteGalleryImage(\'' + key + '\')" style="position:absolute;top:4px;right:4px;background:rgba(255,0,0,0.7);border:none;color:white;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>'
                    + '</div>';
            });
            grid.innerHTML = ghtml || '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#8892b0"><i class="fas fa-images" style="font-size:40px;display:block;margin-bottom:12px"></i>Belum ada foto galeri</div>';
        });
    }
}

function uploadGalleryImage() {
    var file = document.getElementById('gallery-upload').files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        addGalleryImage(e.target.result, file.name);
        showNotif('Foto galeri ditambahkan!', 'success');
    };
    reader.readAsDataURL(file);
}

function addGalleryFromUrl() {
    var url = document.getElementById('gallery-url-input').value;
    if (!url) return;
    addGalleryImage(url, 'Gallery');
    document.getElementById('gallery-url-input').value = '';
}

// ===== SETTINGS TAB =====
function loadSettingsTab() {
    var c = document.getElementById('admin-settings');
    if (!c) return;
    c.innerHTML = '<div style="padding:24px;max-width:600px;margin:0 auto">'
        + '<h3 style="color:#ccd6f6;margin-bottom:20px"><i class="fas fa-sliders-h"></i> Pengaturan Website</h3>'

        + '<div class="admin-setting-group" style="margin-bottom:20px;padding:16px;background:rgba(100,255,218,0.03);border-radius:12px;border:1px solid rgba(100,255,218,0.1)">'
        + '<h4 style="color:#64ffda;margin-bottom:12px;font-size:14px"><i class="fas fa-palette"></i> Tampilan</h4>'
        + '<div class="admin-field"><label>Judul Website</label><input type="text" id="setting-title" value="Regu Rajawali 1" style="background:rgba(255,255,255,0.05);border:1px solid rgba(100,255,218,0.2);color:#ccd6f6;padding:8px 12px;border-radius:8px;width:100%;outline:none"></div>'
        + '<div class="admin-field" style="margin-top:12px"><label>Warna Tema</label><input type="color" id="setting-color" value="#64ffda" style="width:60px;height:40px;border:none;border-radius:8px;cursor:pointer;background:transparent"></div>'
        + '</div>'

        + '<div class="admin-setting-group" style="margin-bottom:20px;padding:16px;background:rgba(100,255,218,0.03);border-radius:12px;border:1px solid rgba(100,255,218,0.1)">'
        + '<h4 style="color:#64ffda;margin-bottom:12px;font-size:14px"><i class="fas fa-database"></i> Data Firebase</h4>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
        + '<button class="admin-btn" onclick="resetAllFirebaseData()" style="background:rgba(255,107,107,0.2);border-color:#ff6b6b"><i class="fas fa-trash-alt"></i> Reset Semua Data</button>'
        + '<button class="admin-btn" onclick="exportAllData()"><i class="fas fa-download"></i> Export Data</button>'
        + '</div>'
        + '</div>'

        + '<div style="text-align:center;margin-top:24px">'
        + '<button class="admin-btn" style="background:linear-gradient(135deg,#64ffda,#00bfa5);color:#0a192f;font-weight:600;padding:12px 40px" onclick="saveAllSettings()"><i class="fas fa-save"></i> Simpan Semua Pengaturan</button>'
        + '</div>'

        + '<div id="settings-status" style="text-align:center;margin-top:12px;color:#64ffda;font-size:13px;display:none"><i class="fas fa-check-circle"></i> Pengaturan berhasil disimpan!</div>'
        + '</div>';
}

function saveAllSettings() {
    var title = document.getElementById('setting-title').value || 'Regu Rajawali 1';
    var color = document.getElementById('setting-color').value || '#64ffda';
    fbSave('settings', { title: title, themeColor: color });
    document.getElementById('settings-status').style.display = 'block';
    setTimeout(function(){ document.getElementById('settings-status').style.display = 'none'; }, 3000);
    // Update website title
    document.title = title;
    showNotif('Pengaturan disimpan! ✅', 'success');
}

function resetAllFirebaseData() {
    if (!confirm('Yakin reset semua data Firebase? Anggota & galeri akan kehilangan foto!')) return;
    var d = getDB();
    if (d) {
        d.ref('members').remove();
        d.ref('gallery').remove();
        showNotif('Semua data Firebase direset!', 'info');
    }
}

function exportAllData() {
    var d = getDB();
    if (!d) { showNotif('Firebase tidak tersedia', 'error'); return; }
    d.ref().once('value').then(function(snap) {
        var data = snap.val();
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'regu-rajawali-data.json';
        a.click();
        showNotif('Data di-export! 📥', 'success');
    });
}

// ===== MODIFY renderMembers to use Firebase data =====
function patchRenderMembers() {
    // We'll modify the renderMembers function in index.html
    // This function is called by the page on load
    // We add Firebase data overlay
    if (typeof membersData !== 'undefined' && membersData.length) {
        var d = getDB();
        if (d) {
            d.ref('members').on('value', function(snap) {
                var firebaseData = snap.val() || {};
                // Update member cards with Firebase data
                membersData.forEach(function(m) {
                    var fb = firebaseData[m.id];
                    if (fb) {
                        // Update photo
                        if (fb.photo) {
                            m.photo = fb.photo;
                            var img = document.getElementById('member-img-' + m.id);
                            if (img) img.src = fb.photo;
                        }
                        // Update bio
                        if (fb.bio) {
                            m.bio = fb.bio;
                            var bioEl = document.querySelector('#member-' + m.id + ' .member-bio');
                            if (bioEl) bioEl.textContent = fb.bio;
                        }
                        // Update role
                        if (fb.role) {
                            m.role = fb.role;
                            var roleEl = document.querySelector('#member-' + m.id + ' .member-role');
                            if (roleEl) roleEl.textContent = fb.role;
                        }
                    }
                });

                // Also load settings
                if (firebaseData._settings) {
                    var s = firebaseData._settings;
                    if (s.title) document.title = s.title;
                }
            });
        }
    }
}

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
                clickCount = 0;
                clearTimeout(clickTimer);
                showLoginModal();
            }
        }
    });

    // Also keep double-click logo as backup
    var logo = document.querySelector('.navbar-brand, .footer-logo, .logo');
    if (logo) {
        logo.addEventListener('dblclick', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }

    // Auto login if already logged in
    if (isLoggedIn()) {
        showAdminPanel();
    }

    // Patch member data with Firebase
    setTimeout(patchRenderMembers, 1000);

    console.log('%c👑 Admin Panel Loaded - Firebase Realtime', 'color: #ffd700; font-size: 14px; font-weight: bold');
    console.log('%c🔐 Password: own123', 'color: #00d4ff; font-size: 12px;');
});

// ===== EXPORTS =====
window.AdminPanel = {
    showLogin: showLoginModal,
    logout: logout,
    show: showAdminPanel,
    hide: hideAdminPanel,
    uploadMemberPhoto: uploadMemberPhoto,
    saveMemberBio: saveMemberBio,
    saveMemberRole: saveMemberRole,
    addGalleryImage: addGalleryImage,
    deleteGalleryImage: deleteGalleryImage,
    isLoggedIn: isLoggedIn,
    saveAllSettings: saveAllSettings
};

window.showLoginModal = showLoginModal;
window.hideAdminPanel = hideAdminPanel;
window.showAdminPanel = showAdminPanel;
window.uploadMemberPhoto = uploadMemberPhoto;
window.saveMemberBio = saveMemberBio;
window.saveMemberRole = saveMemberRole;
window.addGalleryImage = addGalleryImage;
window.deleteGalleryImage = deleteGalleryImage;
window.addGalleryFromUrl = addGalleryFromUrl;
window.resetAllFirebaseData = resetAllFirebaseData;
window.exportAllData = exportAllData;
window.saveAllSettings = saveAllSettings;

})();
