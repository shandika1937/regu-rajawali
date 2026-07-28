// Owner Admin Panel - Password: own123
(function(){
var STORAGE_KEYS={memberPhotos:'rajawali_member_photos',galleryImages:'rajawali_gallery_images',memberBios:'rajawali_member_bios',memberRoles:'rajawali_member_roles'};
function gMP(){try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.memberPhotos)||'{}')}catch(e){return{}}}
function sMP(id,d){var p=gMP();p[id]=d;localStorage.setItem(STORAGE_KEYS.memberPhotos,JSON.stringify(p))}
function dMP(id){var p=gMP();delete p[id];localStorage.setItem(STORAGE_KEYS.memberPhotos,JSON.stringify(p))}
function gMPFS(id){return gMP()[id]||null}
function gME(t){try{return JSON.parse(localStorage.getItem(t)||'{}')}catch(e){return{}}}
function sME(t,id,v){var e=gME(t);e[id]=v;localStorage.setItem(t,JSON.stringify(e))}
function gMB(id,d){return gME(STORAGE_KEYS.memberBios)[id]||d}
function gMR(id,d){return gME(STORAGE_KEYS.memberRoles)[id]||d}
function gGI(){try{return JSON.parse(localStorage.getItem(STORAGE_KEYS.galleryImages)||'[]')}catch(e){return[]}}
function aGI(src,t){var imgs=gGI();var item={id:Date.now(),src:src,title:t||'Foto',date:new Date().toISOString()};imgs.unshift(item);localStorage.setItem(STORAGE_KEYS.galleryImages,JSON.stringify(imgs))}
function dGI(id){var imgs=gGI().filter(function(i){return i.id!==id});localStorage.setItem(STORAGE_KEYS.galleryImages,JSON.stringify(imgs))}
function showN(msg){var n=document.createElement('div');n.className='admin-notification admin-notification-success';n.innerHTML='<i class="fas fa-check-circle"></i><span>'+msg+'</span>';document.body.appendChild(n);n.classList.add('show');setTimeout(function(){n.remove()},3000)}
function showAdminPanel(){var p=document.getElementById('admin-panel');if(!p)p=createPanel();p.classList.add('active');document.body.style.overflow='hidden';loadMembers()}
function hideAdminPanel(){var p=document.getElementById('admin-panel');if(p){p.classList.remove('active');document.body.style.overflow=''}}
function createPanel(){var p=document.createElement('div');p.id='admin-panel';p.className='admin-panel';p.innerHTML='<div class="admin-overlay"></div><div class="admin-container"><div class="admin-header"><div class="admin-header-left"><div class="admin-logo-icon"><i class="fas fa-crown"></i></div><div><h3>Owner Dashboard</h3></div></div><div class="admin-header-right"><button class="admin-btn-icon" onclick="AdminPanel.logout()"><i class="fas fa-sign-out-alt"></i></button><button class="admin-btn-icon" onclick="AdminPanel.hide()"><i class="fas fa-times"></i></button></div></div><div class="admin-tabs"><button class="admin-tab active" data-tab="members"><i class="fas fa-users"></i> Anggota</button><button class="admin-tab" data-tab="gallery"><i class="fas fa-images"></i> Galeri</button></div><div class="admin-body"><div class="admin-tab-content active" id="admin-members"></div><div class="admin-tab-content" id="admin-gallery"></div></div></div>';document.body.appendChild(p);p.querySelectorAll('.admin-tab').forEach(function(t){t.addEventListener('click',function(){p.querySelectorAll('.admin-tab').forEach(function(x){x.classList.remove('active')});p.querySelectorAll('.admin-tab-content').forEach(function(x){x.classList.remove('active')});t.classList.add('active');var c=document.getElementById('admin-'+t.dataset.tab);if(c){c.classList.add('active');if(t.dataset.tab==='members')loadMembers();else loadGallery()}})});p.querySelector('.admin-overlay').addEventListener('click',hideAdminPanel);return p}
function loadMembers(){var c=document.getElementById('admin-members');if(!c||typeof membersData==='undefined')return;var h='<div class="admin-section-title"><i class="fas fa-user-edit"></i> Kelola Foto</div><div class="admin-members-grid">';membersData.forEach(function(m){var sp=gMPFS(m.id);var cb=gMB(m.id,m.bio);var cr=gMR(m.id,m.role);h+='<div class="admin-member-card"><div class="admin-member-photo"><img src="'+(sp||m.photo)+'" alt="'+m.name+'" onerror="this.style.display=\'none\'"><div class="admin-photo-overlay" onclick="document.getElementById(\'file-'+m.id+'\').click()"><i class="fas fa-camera"></i><span>Upload</span></div><input type="file" id="file-'+m.id+'" accept="image/*" style="display:none" onchange="AdminPanel.uploadMemberPhoto('+m.id+',this)"></div><div class="admin-member-info"><h4>'+m.name+'</h4><div class="admin-field"><label>Jabatan</label><input value="'+cr+'" onchange="AdminPanel.updateMemberRole('+m.id+',this.value)"></div><div class="admin-field"><label>Bio</label><textarea rows="2" onchange="AdminPanel.updateMemberBio('+m.id+',this.value)">'+cb+'</textarea></div></div></div>'});h+='</div>';c.innerHTML=h}
function loadGallery(){var c=document.getElementById('admin-gallery');if(!c)return;var h='<div class="admin-section-title"><i class="fas fa-images"></i> Galeri</div><div class="admin-upload-area" onclick="document.getElementById(\'gui\').click()"><i class="fas fa-cloud-upload-alt"></i><p>Upload foto galeri</p><input type="file" id="gui" accept="image/*" multiple style="display:none" onchange="AdminPanel.uploadGalleryImages(this)"></div><div class="admin-gallery-grid">';var imgs=gGI();if(imgs.length===0)h+='<p>Belum ada foto.</p>';else imgs.forEach(function(i){h+='<div class="admin-gallery-item"><img src="'+i.src+'"><div class="admin-gallery-item-overlay"><button onclick="AdminPanel.deleteGalleryImage('+i.id+')" class="admin-btn-danger"><i class="fas fa-trash"></i></button></div></div>'});h+='</div>';c.innerHTML=h}
function uploadMemberPhoto(id,input){var f=input.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){sMP(id,e.target.result);showN('Foto diupload!');loadMembers()};r.readAsDataURL(f)}
function uploadGalleryImages(input){Array.from(input.files).forEach(function(f){var r=new FileReader();r.onload=function(e){aGI(e.target.result,f.name.replace(/\.[^/.]+$/,'').replace(/[-_]/g,' '))};r.readAsDataURL(f)});input.value=''}
function updateMemberBio(id,bio){sME(STORAGE_KEYS.memberBios,id,bio);showN('Bio diperbarui!')}
function updateMemberRole(id,role){sME(STORAGE_KEYS.memberRoles,id,role);showN('Jabatan diperbarui!')}
function showLoginModal(){var ex=document.getElementById('admin-login-modal');if(ex)ex.remove();var m=document.createElement('div');m.id='admin-login-modal';m.className='admin-login-modal';m.innerHTML='<div class="admin-login-overlay"></div><div class="admin-login-box"><div class="admin-login-icon"><i class="fas fa-crown"></i></div><h2>Owner Access</h2><form onsubmit="return AdminPanel.handleLogin(event)"><div class="admin-login-field"><label><i class="fas fa-lock"></i> Password</label><input type="password" id="login-password" placeholder="Masukkan password" required></div><div id="admin-login-error" class="admin-login-error" style="display:none"><i class="fas fa-exclamation-circle"></i> Password salah!</div><button type="submit" class="admin-login-btn" id="admin-login-btn"><i class="fas fa-shield-alt"></i> Masuk</button></form><p class="admin-login-footer"><i class="fas fa-lock"></i> Aman & rahasia</p></div>';document.body.appendChild(m);m.classList.add('active');setTimeout(function(){var el=document.getElementById('login-password');if(el)el.focus()},300)}
function handleLogin(e){e.preventDefault();var p=document.getElementById('login-password').value;if(p==='own123'){document.getElementById('admin-login-modal').remove();showN('Selamat datang, Owner!');setTimeout(showAdminPanel,300)}else{document.getElementById('admin-login-error').style.display='block';document.getElementById('login-password').value='';document.getElementById('login-password').focus()}return false}
document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.navbar-brand,.footer-logo').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();showLoginModal()})})});
window.AdminPanel={showLogin:showLoginModal,handleLogin:handleLogin,logout:function(){hideAdminPanel();showN('Logout')},show:showAdminPanel,hide:hideAdminPanel,uploadMemberPhoto:uploadMemberPhoto,deleteMemberPhoto:dMP,updateMemberBio:updateMemberBio,updateMemberRole:updateMemberRole,uploadGalleryImages:uploadGalleryImages,deleteGalleryImage:dGI,isLoggedIn:function(){return false},getMemberPhotoFromStorage:gMPFS,getMemberBio:gMB,getMemberRole:gMR,getGalleryImages:gGI};
console.log('%cOwner Panel Loaded','color:#ffd700;font-weight:bold');
})();

// ===== TRIPLE TAP ADMIN ACCESS (Shandika) =====
(function() {
    var clickCount = 0;
    var clickTimer = null;
    
    document.addEventListener('click', function(e) {
        var card = e.target.closest('.member-card');
        if (!card) {
            clickCount = 0;
            return;
        }
        
        // Cek apakah ini kartu Shandika (anggota ke-8)
        var cardNumber = card.querySelector('.card-number');
        if (cardNumber && cardNumber.textContent.trim() === '08') {
            clickCount++;
            
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(function() {
                clickCount = 0;
            }, 1000); // reset dalam 1 detik
            
            if (clickCount >= 3) {
                clickCount = 0;
                clearTimeout(clickTimer);
                // Panggil login admin
                if (typeof showLoginModal === 'function') {
                    showLoginModal();
                } else if (window.AdminPanel && typeof window.AdminPanel.showLogin === 'function') {
                    window.AdminPanel.showLogin();
                }
            }
        }
    });
    
    console.log('%c👆 Triple-tap foto Shandika untuk admin!', 'color: #ffd700; font-size: 11px;');
})();
