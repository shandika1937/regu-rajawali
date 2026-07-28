// ===== REGU RAJAWALI 1 - Owner Admin Panel =====
// Hanya owner yang bisa mengakses. Password terenkripsi.

(function() {
    'use strict';

    // ========== KONFIGURASI OWNER ==========
    // Username & password owner (RAHASIA - jangan dibagikan!)
    const OWNER_CONFIG = {
        username: 'owner',
        password: 'own123'
    };

    // ========== SESSION MANAGEMENT ==========
    function isLoggedIn() {
        return sessionStorage.getItem('rajawali_owner') === 'authenticated';
    }

    function login(username, password) {
        return username === OWNER_CONFIG.username && password === OWNER_CONFIG.password;
    }

    function setLoggedIn() {
        sessionStorage.setItem('rajawali_owner', 'authenticated');
        sessionStorage.setItem('rajawali_login_time', Date.now().toString());
    }

    function logout() {
        sessionStorage.removeItem('rajawali_owner');
        sessionStorage.removeItem('rajawali_login_time');
        hideAdminPanel();
        showNotification('Anda telah logout', 'info');
    }

    // Auto logout setelah 1 jam
    function checkSessionTimeout() {
        const loginTime = parseInt(sessionStorage.getItem('rajawali_login_time') || '0');
        if (loginTime && (Date.now() - loginTime) > 3600000) {
            logout();
            return true;
        }
        return false;
    }

    // ========== MEMBER PHOTO MANAGEMENT ==========
    function getMemberPhotos() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.memberPhotos) || '{}');
        } catch { return {}; }
    }

    function saveMemberPhoto(memberId, base64Data) {
        const photos = getMemberPhotos();
        photos[memberId] = base64Data;
        localStorage.setItem(STORAGE_KEYS.memberPhotos, JSON.stringify(photos));
        
        // Trigger realtime update event
        window.dispatchEvent(new CustomEvent('memberPhotoUpdated', { 
            detail: { memberId, photo: base64Data } 
        }));
    }

    function deleteMemberPhoto(memberId) {
        const photos = getMemberPhotos();
        delete photos[memberId];
        localStorage.setItem(STORAGE_KEYS.memberPhotos, JSON.stringify(photos));
        window.dispatchEvent(new CustomEvent('memberPhotoUpdated', { 
            detail: { memberId, photo: null } 
        }));
    }

    function getMemberPhotoFromStorage(memberId) {
        const photos = getMemberPhotos();
        return photos[memberId] || null;
    }

    // ========== MEMBER BIO/ROLE MANAGEMENT ==========
    function getMemberEdits(type) {
        try {
            return JSON.parse(localStorage.getItem(type) || '{}');
        } catch { return {}; }
    }

    function saveMemberEdit(type, memberId, value) {
        const edits = getMemberEdits(type);
        edits[memberId] = value;
        localStorage.setItem(type, JSON.stringify(edits));
    }

    function getMemberBio(memberId, defaultBio) {
        const edits = getMemberEdits(STORAGE_KEYS.memberBios);
        return edits[memberId] || defaultBio;
    }

    function getMemberRole(memberId, defaultRole) {
        const edits = getMemberEdits(STORAGE_KEYS.memberRoles);
        return edits[memberId] || defaultRole;
    }

    // ========== GALLERY MANAGEMENT ==========
    function getGalleryImages() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.galleryImages) || '[]');
        } catch { return []; }
    }

    function addGalleryImage(base64Data, title, subtitle) {
        const images = getGalleryImages();
        const newItem = {
            id: Date.now(),
            src: base64Data,
            title: title || 'Foto Baru',
            subtitle: subtitle || 'Momen Regu Rajawali 1',
            date: new Date().toISOString()
        };
        images.unshift(newItem);
        localStorage.setItem(STORAGE_KEYS.galleryImages, JSON.stringify(images));
        
        // Trigger realtime update
        window.dispatchEvent(new CustomEvent('galleryUpdated', { detail: images }));
        return newItem;
    }

    function deleteGalleryImage(id) {
        let images = getGalleryImages();
        images = images.filter(img => img.id !== id);
        localStorage.setItem(STORAGE_KEYS.galleryImages, JSON.stringify(images));
        window.dispatchEvent(new CustomEvent('galleryUpdated', { detail: images }));
    }

    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.admin-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ========== RENDER ADMIN PANEL ==========
    function showAdminPanel() {
        let panel = document.getElementById('admin-panel');
        if (!panel) {
            panel = createAdminPanel();
        }
        panel.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadAdminDashboard();
    }

    function hideAdminPanel() {
        const panel = document.getElementById('admin-panel');
        if (panel) {
            panel.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function createAdminPanel() {
        const panel = document.createElement('div');
        panel.id = 'admin-panel';
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div class="admin-overlay"></div>
            <div class="admin-container">
                <div class="admin-header">
                    <div class="admin-header-left">
                        <div class="admin-logo-icon">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div>
                            <h3>Owner Dashboard</h3>
                            <p class="admin-subtitle">Regu Rajawali 1 • Panel Kontrol</p>
                        </div>
                    </div>
                    <div class="admin-header-right">
                        <span class="admin-badge">Owner</span>
                        <button class="admin-btn-icon" onclick="AdminPanel.logout()" title="Logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                        <button class="admin-btn-icon" onclick="AdminPanel.hide()" title="Tutup">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="members">
                        <i class="fas fa-users"></i> Anggota
                    </button>
                    <button class="admin-tab" data-tab="gallery">
                        <i class="fas fa-images"></i> Galeri
                    </button>
                    <button class="admin-tab" data-tab="stats">
                        <i class="fas fa-chart-bar"></i> Statistik
                    </button>
                </div>

                <div class="admin-body">
                    <div class="admin-tab-content active" id="admin-members">
                        <div class="admin-loading"><i class="fas fa-spinner fa-spin"></i> Memuat...</div>
                    </div>
                    <div class="admin-tab-content" id="admin-gallery">
                        <div class="admin-loading"><i class="fas fa-spinner fa-spin"></i> Memuat...</div>
                    </div>
                    <div class="admin-tab-content" id="admin-stats">
                        <div class="admin-loading"><i class="fas fa-spinner fa-spin"></i> Memuat...</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Tab switching
        panel.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const content = document.getElementById(`admin-${tab.dataset.tab}`);
                if (content) {
                    content.classList.add('active');
                    if (tab.dataset.tab === 'members') loadAdminMembers();
                    else if (tab.dataset.tab === 'gallery') loadAdminGallery();
                    else if (tab.dataset.tab === 'stats') loadAdminStats();
                }
            });
        });

        // Close on overlay click
        panel.querySelector('.admin-overlay').addEventListener('click', hideAdminPanel);

        return panel;
    }

    // ========== LOAD ADMIN DASHBOARD CONTENT ==========
    function loadAdminDashboard() {
        loadAdminMembers();
    }

    function loadAdminMembers() {
        const container = document.getElementById('admin-members');
        if (!container || typeof membersData === 'undefined') return;

        let html = '<div class="admin-section-title"><i class="fas fa-user-edit"></i> Kelola Foto & Data Anggota</div>';
        html += '<div class="admin-members-grid">';

        membersData.forEach(member => {
            const storedPhoto = getMemberPhotoFromStorage(member.id);
            const currentBio = getMemberBio(member.id, member.bio);
            const currentRole = getMemberRole(member.id, member.role);
            
            html += `
                <div class="admin-member-card" data-member-id="${member.id}">
                    <div class="admin-member-photo">
                        <img src="${storedPhoto || member.photo}" alt="${member.name}"
                             onerror="this.src='data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#112240"/><text x="50" y="55" text-anchor="middle" fill="#00d4ff" font-size="28" font-family="Arial">' + member.name.split(' ').map(n=>n[0]).join('').substring(0,2) + '</text></svg>')}'">
                        <div class="admin-photo-overlay" onclick="document.getElementById('file-${member.id}').click()">
                            <i class="fas fa-camera"></i>
                            <span>Upload Foto</span>
                        </div>
                        <input type="file" id="file-${member.id}" accept="image/*" style="display:none"
                               onchange="AdminPanel.uploadMemberPhoto(${member.id}, this)">
                        <button class="admin-delete-photo" onclick="AdminPanel.deleteMemberPhoto(${member.id})" 
                                title="Hapus foto" ${!storedPhoto ? 'style="display:none"' : ''}>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="admin-member-info">
                        <h4>${member.name}</h4>
                        <div class="admin-field">
                            <label>Jabatan</label>
                            <input type="text" class="admin-input" value="${currentRole}" 
                                   onchange="AdminPanel.updateMemberRole(${member.id}, this.value)">
                        </div>
                        <div class="admin-field">
                            <label>Bio</label>
                            <textarea class="admin-input admin-textarea" rows="2"
                                      onchange="AdminPanel.updateMemberBio(${member.id}, this.value)">${currentBio}</textarea>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    function loadAdminGallery() {
        const container = document.getElementById('admin-gallery');
        if (!container) return;

        let html = `
            <div class="admin-section-title">
                <i class="fas fa-images"></i> Kelola Galeri
            </div>
            <div class="admin-upload-area" onclick="document.getElementById('gallery-upload-input').click()">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Klik untuk upload foto galeri</p>
                <span>Format: JPG, PNG, WebP</span>
                <input type="file" id="gallery-upload-input" accept="image/*" multiple style="display:none"
                       onchange="AdminPanel.uploadGalleryImages(this)">
            </div>
            <div class="admin-gallery-grid" id="admin-gallery-grid">
        `;

        const images = getGalleryImages();
        if (images.length === 0) {
            html += '<div class="admin-empty"><i class="fas fa-folder-open"></i><p>Belum ada foto galeri. Upload sekarang!</p></div>';
        } else {
            images.forEach(img => {
                html += `
                    <div class="admin-gallery-item">
                        <img src="${img.src}" alt="${img.title}">
                        <div class="admin-gallery-item-overlay">
                            <button onclick="AdminPanel.deleteGalleryImage(${img.id})" class="admin-btn-danger">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="admin-gallery-item-info">
                            <span>${img.title || 'Foto'}</span>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div></div>';
        container.innerHTML = html;
    }

    function loadAdminStats() {
        const container = document.getElementById('admin-stats');
        if (!container) return;

        const photos = getMemberPhotos();
        const photoCount = Object.keys(photos).length;
        const galleryImages = getGalleryImages();
        const visitors = parseInt(localStorage.getItem('rajawali_visitors') || '0');
        const storageUsed = estimateStorageUsage();
        
        // Firebase status
        const isFirebaseOn = window.FirebaseStats && window.FirebaseStats.isAvailable && window.FirebaseStats.isAvailable();

        container.innerHTML = `
            <div class="admin-section-title"><i class="fas fa-chart-bar"></i> Statistik Website</div>
            
            <!-- Firebase Status -->
            <div class="admin-firebase-status" style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:12px;margin-bottom:20px;
                ${isFirebaseOn ? 'background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);' : 'background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);'}">
                <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;
                    ${isFirebaseOn ? 'background:rgba(16,185,129,0.12);color:#10b981;' : 'background:rgba(245,158,11,0.12);color:#f59e0b;'}">
                    <i class="fas ${isFirebaseOn ? 'fa-database' : 'fa-exclamation-triangle'}"></i>
                </div>
                <div style="flex:1;">
                    <div style="font-weight:600;font-size:0.9rem;">${isFirebaseOn ? 'Firebase Realtime Database Online' : 'Firebase Belum Dikonfigurasi'}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">
                        ${isFirebaseOn 
                            ? 'Data statistik realtime tersinkron ke semua pengunjung' 
                            : 'Menggunakan localStorage. <a href="#" onclick="showFirebaseSetup();return false;" style="color:#00d4ff;text-decoration:underline;">Klik di sini untuk panduan setup</a>'
                        }
                    </div>
                </div>
                <button onclick="window.FirebaseStats && FirebaseStats.refresh(); loadAdminStats();" 
                        style="padding:8px 14px;border-radius:8px;border:1px solid var(--glass-border);background:transparent;color:var(--text-secondary);cursor:pointer;font-size:0.8rem;">
                    <i class="fas fa-sync"></i>
                </button>
            </div>

            <div class="admin-stats-grid">
                <div class="admin-stat-box">
                    <div class="admin-stat-icon blue"><i class="fas fa-user-check"></i></div>
                    <div class="admin-stat-value">${photoCount}/8</div>
                    <div class="admin-stat-label">Foto Anggota</div>
                </div>
                <div class="admin-stat-box">
                    <div class="admin-stat-icon gold"><i class="fas fa-images"></i></div>
                    <div class="admin-stat-value">${galleryImages.length}</div>
                    <div class="admin-stat-label">Foto Galeri</div>
                </div>
                <div class="admin-stat-box">
                    <div class="admin-stat-icon purple"><i class="fas fa-eye"></i></div>
                    <div class="admin-stat-value" id="admin-visitor-count">${visitors.toLocaleString()}</div>
                    <div class="admin-stat-label">Total Pengunjung</div>
                </div>
                <div class="admin-stat-box">
                    <div class="admin-stat-icon green"><i class="fas fa-database"></i></div>
                    <div class="admin-stat-value">${storageUsed}</div>
                    <div class="admin-stat-label">Penyimpanan</div>
                </div>
            </div>

            <div class="admin-warning">
                <i class="fas fa-info-circle"></i>
                <span>Foto disimpan di localStorage browser. Untuk penyimpanan permanen, upload file ke folder <code>assets/images/</code>. Statistik realtime membutuhkan Firebase.</span>
            </div>
        `;

        // Update visitor count in realtime if Firebase is on
        if (isFirebaseOn && window.FirebaseStats) {
            window.FirebaseStats.getVisitors((count) => {
                const el = document.getElementById('admin-visitor-count');
                if (el) el.textContent = count.toLocaleString();
            });
        }
    }

    function estimateStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (key.startsWith('rajawali_')) {
                total += localStorage[key].length * 2; // UTF-16
            }
        }
        if (total < 1024) return total + ' bytes';
        if (total < 1048576) return (total / 1024).toFixed(1) + ' KB';
        return (total / 1048576).toFixed(1) + ' MB';
    }

    // ========== UPLOAD HANDLERS ==========
    async function uploadMemberPhoto(memberId, input) {
        const file = input.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Ukuran foto maksimal 5MB', 'error');
            input.value = '';
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            saveMemberPhoto(memberId, base64);
            showNotification('Foto berhasil diupload! 🔥', 'success');
            input.value = '';
            
            // Refresh member card display
            loadAdminMembers();
            
            // Update the member photo in the main page view
            updateMemberCardPhoto(memberId, base64);
        } catch (error) {
            showNotification('Gagal upload foto: ' + error.message, 'error');
        }
    }

    async function uploadGalleryImages(input) {
        const files = input.files;
        if (!files || files.length === 0) return;

        let successCount = 0;
        for (const file of files) {
            if (file.size > 10 * 1024 * 1024) {
                showNotification(`"${file.name}" terlalu besar (max 10MB)`, 'warning');
                continue;
            }
            try {
                const base64 = await fileToBase64(file);
                const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                addGalleryImage(base64, name, 'Momen Regu Rajawali 1');
                successCount++;
            } catch (error) {
                showNotification(`Gagal upload "${file.name}"`, 'error');
            }
        }

        if (successCount > 0) {
            showNotification(`${successCount} foto berhasil ditambahkan! 📸`, 'success');
            loadAdminGallery();
            // Refresh main gallery
            window.dispatchEvent(new CustomEvent('adminGalleryUpdated'));
        }

        input.value = '';
    }

    // ========== UPDATE HANDLERS ==========
    function updateMemberBio(memberId, bio) {
        saveMemberEdit(STORAGE_KEYS.memberBios, memberId, bio);
        showNotification('Bio berhasil diperbarui!', 'success');
        // Dispatch event for realtime update
        window.dispatchEvent(new CustomEvent('memberBioUpdated', { detail: { memberId, bio } }));
    }

    function updateMemberRole(memberId, role) {
        saveMemberEdit(STORAGE_KEYS.memberRoles, memberId, role);
        showNotification('Jabatan berhasil diperbarui!', 'success');
        window.dispatchEvent(new CustomEvent('memberRoleUpdated', { detail: { memberId, role } }));
    }

    // ========== HELPERS ==========
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Update member card photo in main view
    function updateMemberCardPhoto(memberId, base64) {
        const memberCards = document.querySelectorAll('.member-card');
        memberCards.forEach((card, index) => {
            if (index + 1 === memberId || card.querySelector('.member-name')?.textContent.includes(membersData[memberId-1]?.name)) {
                const photoWrapper = card.querySelector('.member-photo-wrapper');
                const existingImg = card.querySelector('.member-photo');
                const existingPlaceholder = card.querySelector('.member-photo-placeholder');
                
                if (existingImg) {
                    existingImg.src = base64;
                } else if (existingPlaceholder) {
                    // Replace placeholder with image
                    const img = document.createElement('img');
                    img.className = 'member-photo';
                    img.src = base64;
                    img.alt = membersData[memberId-1]?.name || 'Member';
                    existingPlaceholder.parentElement.replaceChild(img, existingPlaceholder);
                }
            }
        });
    }

    // ========== LOGIN MODAL ==========
    function showLoginModal() {
        // Remove existing login modal
        const existing = document.getElementById('admin-login-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'admin-login-modal';
        modal.className = 'admin-login-modal';
        modal.innerHTML = `
            <div class="admin-login-overlay"></div>
            <div class="admin-login-box">
                <div class="admin-login-icon">
                    <i class="fas fa-crown"></i>
                </div>
                <h2>Owner Access</h2>
                <p class="admin-login-desc">Masuk sebagai owner untuk mengelola konten website</p>
                <form id="admin-login-form" onsubmit="return AdminPanel.handleLogin(event)">
                    <div class="admin-login-field">
                        <label><i class="fas fa-user"></i> Username</label>
                        <input type="text" id="login-username" placeholder="Masukkan username" required autocomplete="off">
                    </div>
                    <div class="admin-login-field">
                        <label><i class="fas fa-lock"></i> Password</label>
                        <div class="admin-password-wrapper">
                            <input type="password" id="login-password" placeholder="Masukkan password" required>
                            <button type="button" class="admin-toggle-password" onclick="AdminPanel.togglePassword()">
                                <i class="fas fa-eye" id="password-toggle-icon"></i>
                            </button>
                        </div>
                    </div>
                    <div id="admin-login-error" class="admin-login-error" style="display:none">
                        <i class="fas fa-exclamation-circle"></i> Username atau password salah!
                    </div>
                    <button type="submit" class="admin-login-btn" id="admin-login-btn">
                        <i class="fas fa-shield-alt"></i> Masuk sebagai Owner
                    </button>
                </form>
                <p class="admin-login-footer">
                    <i class="fas fa-lock"></i> Aman & rahasia
                </p>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Focus username
        setTimeout(() => document.getElementById('login-username')?.focus(), 300);
    }

    function hideLoginModal() {
        const modal = document.getElementById('admin-login-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    async function handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('admin-login-error');
        const btn = document.getElementById('admin-login-btn');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...';

        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const isValid = await login(username, password);

        if (isValid) {
            setLoggedIn();
            hideLoginModal();
            showNotification('Selamat datang, Owner! 🦅', 'success');
            setTimeout(() => showAdminPanel(), 500);
        } else {
            errorEl.style.display = 'flex';
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-shield-alt"></i> Masuk sebagai Owner';
            document.getElementById('login-password').value = '';
            document.getElementById('login-password').focus();
            
            // Shake animation
            const box = document.querySelector('.admin-login-box');
            box.style.animation = 'none';
            setTimeout(() => {
                box.style.animation = 'shake 0.4s ease';
            }, 10);
        }

        return false;
    }

    function togglePassword() {
        const input = document.getElementById('login-password');
        const icon = document.getElementById('password-toggle-icon');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // ========== KEYBOARD SHORTCUT ==========
    // Ctrl+Shift+A or double-click on logo to open admin login
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            triggerAdminAccess();
        }
    });

    // ========== TRIGGER ADMIN ACCESS ==========
    let logoClickCount = 0;
    let logoClickTimer = null;

    function triggerAdminAccess() {
        if (isLoggedIn()) {
            if (checkSessionTimeout()) return;
            showAdminPanel();
        } else {
            showLoginModal();
        }
    }

    // Setup double-click on footer logo/brand
    document.addEventListener('DOMContentLoaded', () => {
        const brandElements = document.querySelectorAll('.navbar-brand, .footer-logo');
        brandElements.forEach(el => {
            el.addEventListener('dblclick', (e) => {
                e.preventDefault();
                triggerAdminAccess();
            });
        });
    });

    // ========== EXPOSE PUBLIC API ==========
    window.AdminPanel = {
        // Login
        showLogin: showLoginModal,
        hideLogin: hideLoginModal,
        handleLogin,
        togglePassword,
        logout,
        
        // Panel
        show: showAdminPanel,
        hide: hideAdminPanel,
        
        // Member management
        uploadMemberPhoto,
        deleteMemberPhoto,
        updateMemberBio,
        updateMemberRole,
        
        // Gallery management
        uploadGalleryImages,
        deleteGalleryImage,
        
        // Utils
        isLoggedIn,
        getMemberPhotoFromStorage,
        getMemberBio,
        getMemberRole,
        getGalleryImages
    };

    console.log('%c🛡️ Owner Panel Loaded', 'font-size: 14px; font-weight: bold; color: #ffd700;');
    console.log('%c🔒 Double-click logo untuk akses owner', 'font-size: 12px; color: #00d4ff;');

})();
