(function(){
'use strict';

// ===== FIREBASE REALTIME SETUP =====
var db = null;
function getDB() {
    if (db) return db;
    if (typeof firebase !== 'undefined' && firebase.database) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.database();
        return db;
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
    if (d) { d.ref(path).set(data).then(cb||function(){}); }
}
function fbRead(path, cb) {
    var d = getDB();
    if (d) { d.ref(path).on('value', function(s){ cb(s.val()); }); }
}
function fbDelete(path, cb) {
    var d = getDB();
    if (d) { d.ref(path).remove().then(cb||function(){}); }
}

// ===== MEMBER PHOTOS =====
function getMemberPhoto(id, cb) {
    fbRead('members/' + id + '/photo', cb);
}
function saveMemberPhoto(id, dataUrl) {
    fbSave('members/' + id + '/photo', dataUrl);
}

// ===== MEMBER BIOS =====
function getMemberBio(id, cb) {
    fbRead('members/' + id + '/bio', cb);
}
function saveMemberBio(id, text) {
    fbSave('members/' + id + '/bio', text);
}

// ===== MEMBER ROLES =====
function getMemberRole(id, cb) {
    fbRead('members/' + id + '/role', cb);
}
function saveMemberRole(id, text) {
    fbSave('members/' + id + '/role', text);
}

// ===== GALLERY =====
function getGallery(cb) {
    fbRead('gallery', cb);
}
function addGalleryImage(src, title) {
    var id = 'img_' + Date.now();
    fbSave('gallery/' + id, { src: src, title: title || 'Foto', date: Date.now() });
}
function deleteGalleryImage(id) {
    fbDelete('gallery/' + id);
}

// ===== NOTIFICATION =====
function showNotif(msg, type) {
    type = type || 'success';
    var el = document.createElement('div');
    el.className = 'admin-notification admin-notification-' + type;
    el.innerHTML = '<i class="fas fa-check-circle"></i><span>' + msg + '</span>';
    document.body.appendChild(el);
    el.classList.add('show');
    setTimeout(function(){ el.remove(); }, 3000);
}

// ===== LOGIN MODAL =====
function showLogin() {
    var m = document.createElement('div');
    m.id = 'admin-login-modal';
    m.innerHTML = '<div class="admin-overlay" onclick="AdminPanel.hideLogin()"></div>' +
        '<div class="admin-login-box">' +
        '<h3><i class="fas fa-crown"></i> Owner Login</h3>' +
        '<input id="admin-pass" type="password" placeholder="Password">' +
        '<button onclick="AdminPanel.handleLogin()">Masuk</button>' +
        '<p id="admin-login-error" style="color:#ff6b6b;display:none">Password salah!</p>' +
        '</div>';
    document.body.appendChild(m);
    document.getElementById('admin-pass').focus();
}
function hideLogin() {
    var m = document.getElementById('admin-login-modal');
    if (m) m.remove();
}
function handleLogin() {
    var p = document.getElementById('admin-pass').value;
    if (login(p)) {
        setLoggedIn();
        hideLogin();
        showAdmin();
        showNotif('Login berhasil! Selamat datang, Owner 👑');
    } else {
        document.getElementById('admin-login-error').style.display = 'block';
    }
}

// ===== ADMIN PANEL =====
function showAdmin() {
    var p = document.getElementById('admin-panel');
    if (!p) p = createAdminPanel();
    p.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadMembers();
    loadGallery();
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
        '<div class="admin-header"><div class="admin-header-left"><div class="admin-logo-icon"><i class="fas fa-crown"></i></div><div><h3>Owner Dashboard</h3><small>Firebase Realtime</small></div></div>' +
        '<div class="admin-header-right"><button class="admin-btn-icon" onclick="AdminPanel.logout()"><i class="fas fa-sign-out-alt"></i></button><button class="admin-btn-icon" onclick="AdminPanel.hide()"><i class="fas fa-times"></i></button></div></div>' +
        '<div class="admin-tabs"><button class="admin-tab active" data-tab="members"><i class="fas fa-users"></i> Anggota</button><button class="admin-tab" data-tab="gallery"><i class="fas fa-images"></i> Galeri</button></div>' +
        '<div class="admin-body"><div class="admin-tab-content active" id="admin-members"></div><div class="admin-tab-content" id="admin-gallery"></div></div>' +
        '</div>';
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
    el.innerHTML = '<p style="color:#94a3b8"><i class="fas fa-sync"></i> Memuat dari Firebase...</p>';
    if (typeof membersData === 'undefined') {
        el.innerHTML = '<p>Data anggota belum dimuat. Refresh halaman.</p>';
        return;
    }
    var html = '';
    membersData.forEach(function(m, i) {
        var initials = m.name.split(' ').map(function(n){ return n[0]; }).join('').substring(0,2);
        html += '<div class="admin-member-item">' +
            '<div class="admin-member-info"><strong>' + m.name + '</strong><br><small>' + m.role + '</small></div>' +
            '<div class="admin-member-actions">' +
            '<label class="admin-btn-small admin-btn-photo"><i class="fas fa-camera"></i> Foto<input type="file" accept="image/*" style="display:none" onchange="AdminPanel.uploadPhoto(' + i + ', this)"></label>' +
            '<button class="admin-btn-small" onclick="AdminPanel.editBio(' + i + ')"><i class="fas fa-edit"></i> Bio</button>' +
            '<button class="admin-btn-small" onclick="AdminPanel.editRole(' + i + ')"><i class="fas fa-user-tag"></i> Role</button>' +
            '</div></div>';
    });
    el.innerHTML = html;
}

// ===== UPLOAD PHOTO =====
function uploadPhoto(index, input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var dataUrl = e.target.result;
        fbSave('members/' + index + '/photo', dataUrl, function() {
            showNotif('Foto berhasil di-upload ke Firebase! 📸');
            loadMembers();
            // Trigger refresh di page utama
            if (typeof renderMembers === 'function') renderMembers();
        });
    };
    reader.readAsDataURL(file);
}

// ===== EDIT BIO =====
function editBio(index) {
    var name = membersData[index].name;
    var bio = prompt('Edit bio ' + name + ':', membersData[index].bio);
    if (bio !== null) {
        fbSave('members/' + index + '/bio', bio, function() {
            showNotif('Bio berhasil diupdate! ✏️');
            loadMembers();
            if (typeof renderMembers === 'function') renderMembers();
        });
    }
}

// ===== EDIT ROLE =====
function editRole(index) {
    var name = membersData[index].name;
    var role = prompt('Edit role ' + name + ':', membersData[index].role);
    if (role !== null) {
        fbSave('members/' + index + '/role', role, function() {
            showNotif('Role berhasil diupdate! 🏷️');
            loadMembers();
            if (typeof renderMembers === 'function') renderMembers();
        });
    }
}

// ===== LOAD GALLERY =====
function loadGallery() {
    var el = document.getElementById('admin-gallery');
    if (!el) return;
    el.innerHTML = '<label class="admin-btn-small admin-btn-photo"><i class="fas fa-plus"></i> Tambah Foto<input type="file" accept="image/*" multiple style="display:none" onchange="AdminPanel.uploadGallery(this)"></label><div id="admin-gallery-list"></div>';
    fbRead('gallery', function(data) {
        var list = document.getElementById('admin-gallery-list');
        if (!list) return;
        if (!data) { list.innerHTML = '<p style="color:#94a3b8">Belum ada foto galeri</p>'; return; }
        var html = '';
        Object.keys(data).forEach(function(key) {
            var img = data[key];
            html += '<div class="admin-gallery-item"><img src="' + img.src.substring(0,100) + '..." style="width:60px;height:60px;object-fit:cover;border-radius:8px"><span>' + img.title + '</span><button onclick="AdminPanel.deleteGallery(\'' + key + '\')"><i class="fas fa-trash"></i></button></div>';
        });
        list.innerHTML = html;
    });
}

// ===== UPLOAD GALLERY =====
function uploadGallery(input) {
    var files = input.files;
    var count = 0;
    Array.from(files).forEach(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            addGalleryImage(e.target.result, file.name);
            count++;
            if (count === files.length) {
                showNotif(count + ' foto galeri ditambahkan! 🖼️');
                loadGallery();
            }
        };
        reader.readAsDataURL(file);
    });
}

// ===== DELETE GALLERY =====
function deleteGallery(id) {
    if (confirm('Hapus foto ini?')) {
        deleteGalleryImage(id);
        showNotif('Foto galeri dihapus 🗑️');
        loadGallery();
    }
}

// ===== TRIPLE TAP ADMIN ACCESS =====
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
    logout: logout,
    uploadPhoto: uploadPhoto,
    editBio: editBio,
    editRole: editRole,
    uploadGallery: uploadGallery,
    deleteGallery: deleteGallery,
    isLoggedIn: isLoggedIn
};

})();
