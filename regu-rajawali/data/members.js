// ===== REGU RAJAWALI 1 - Data Anggota =====
// Mendukung foto dari localStorage (upload owner) + fallback ke file

const membersData = [
    {
        id: 1,
        name: "Bisma Anugerah Mulia",
        nickname: "Bisma",
        role: "Ketua Regu",
        photo: "assets/images/Bisma Anugerah Mulia.jpg",
        bio: "Pemimpin yang visioner, bertanggung jawab, dan selalu menginspirasi anggota regu.",
        social: { instagram: "#", github: "#" }
    },
    {
        id: 2,
        name: "Ahmad Aufar Alfarizi",
        nickname: "Aufar",
        role: "Wakil Ketua",
        photo: "assets/images/Ahmad Aufar Alfarizi.png",
        bio: "Teladan dalam kedisiplinan, selalu tepat waktu dan siap membantu siapa pun.",
        social: { instagram: "#", github: "#" }
    },
    {
        id: 3,
        name: "Ahmad Mufri Hakiki",
        nickname: "Mufri",
        role: "Sekretaris",
        photo: "assets/images/Ahmad Mufri Hakiki.jpg",
        bio: "Rapi dalam administrasi, detail dalam setiap catatan, dan sangat terorganisir.",
        social: { instagram: "#", github: "#" }
    },
    {
        id: 4,
        name: "Lucky Riyansah Yuandino",
        nickname: "Lucky",
        role: "Bendahara",
        photo: "assets/images/Lucky Riyansah Yuandino.jpg",
        bio: "Cermat dalam mengelola keuangan regu, jujur, dan dapat dipercaya.",
        social: { instagram: "#", github: "#" }
    },
    {
        id: 5,
        name: "Muhammad Facriza",
        nickname: "Facriza",
        role: "Anggota",
        photo: "assets/images/Muhammad Facriza.jpg",
        bio: "Kreatif dan inovatif, selalu punya ide-ide segar untuk kemajuan regu.",
        social: { instagram: "#", github: "#" }
    },
    {
        id: 6,
        name: "M. Yusuf Ariyanto",
        nickname: "Yusuf",
        role: "Anggota",
        photo: "assets/images/M. Yusuf Ariyanto.jpg",
        bio: "Tangguh dan bersemangat, tidak pernah menyerah dalam menghadapi tantangan.",
        social: { instagram: "#", github: "#" }
    },
    {
        id: 7,
        name: "Arya Nufail Rafa Fernando",
        nickname: "Arya",
        role: "Anggota",
        photo: "assets/images/Arya Nufail Rafa Fernando.jpg",
        bio: "Ramah dan mudah bergaul, menjadi jembatan komunikasi antar anggota.",
        social: { instagram: "#", github: "#" }
    },
    {
        id: 8,
        name: "Shandika Ghani Maulana",
        nickname: "Shandika",
        role: "Anggota",
        photo: "assets/images/Shandika Ghani Maulana.jpg",
        bio: "Penuh semangat dan energi, selalu membawa suasana positif di regu.",
        social: { instagram: "#", github: "#" }
    }
];

// ========== SMART PHOTO LOADER ==========
// Prioritas: 1) localStorage (upload owner) 2) file path 3) placeholder

function getMemberPhotoSrc(member) {
    // Cek localStorage dulu (foto upload via admin panel)
    if (window.AdminPanel && typeof AdminPanel.getMemberPhotoFromStorage === 'function') {
        const storedPhoto = AdminPanel.getMemberPhotoFromStorage(member.id);
        if (storedPhoto) return storedPhoto;
    }
    return member.photo;
}

function getMemberBioText(member) {
    if (window.AdminPanel && typeof AdminPanel.getMemberBio === 'function') {
        return AdminPanel.getMemberBio(member.id, member.bio);
    }
    return member.bio;
}

function getMemberRoleText(member) {
    if (window.AdminPanel && typeof AdminPanel.getMemberRole === 'function') {
        return AdminPanel.getMemberRole(member.id, member.role);
    }
    return member.role;
}

// ========== REALTIME UPDATES ==========
// Listen for admin panel changes and update member cards

document.addEventListener('DOMContentLoaded', () => {
    // Listen for photo updates
    window.addEventListener('memberPhotoUpdated', (e) => {
        const { memberId, photo } = e.detail;
        updateSingleMemberCard(memberId);
    });

    // Listen for bio updates
    window.addEventListener('memberBioUpdated', (e) => {
        const { memberId, bio } = e.detail;
        const card = findMemberCard(memberId);
        if (card) {
            const bioEl = card.querySelector('.member-bio');
            if (bioEl) bioEl.textContent = bio;
        }
    });

    // Listen for role updates
    window.addEventListener('memberRoleUpdated', (e) => {
        const { memberId, role } = e.detail;
        const card = findMemberCard(memberId);
        if (card) {
            const roleEl = card.querySelector('.member-role');
            if (roleEl) roleEl.textContent = role;
        }
    });
});

function findMemberCard(memberId) {
    const cards = document.querySelectorAll('.member-card');
    const member = membersData.find(m => m.id === memberId);
    if (!member) return null;
    
    for (const card of cards) {
        const nameEl = card.querySelector('.member-name');
        if (nameEl && nameEl.textContent === member.name) {
            return card;
        }
    }
    return null;
}

function updateSingleMemberCard(memberId) {
    const member = membersData.find(m => m.id === memberId);
    if (!member) return;

    const card = findMemberCard(memberId);
    if (!card) return;

    const photoWrapper = card.querySelector('.member-photo-wrapper');
    if (!photoWrapper) return;

    const photoSrc = getMemberPhotoSrc(member);
    const existingImg = card.querySelector('.member-photo');
    const existingPlaceholder = card.querySelector('.member-photo-placeholder');

    if (existingImg) {
        // Update existing img src
        existingImg.src = photoSrc;
        existingImg.onerror = function() {
            const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2);
            this.style.display = 'none';
            if (!this.parentElement.querySelector('.member-photo-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'member-photo-placeholder';
                placeholder.textContent = initials;
                this.parentElement.appendChild(placeholder);
            }
        };
    } else if (existingPlaceholder) {
        // Replace placeholder with image
        const img = document.createElement('img');
        img.className = 'member-photo';
        img.src = photoSrc;
        img.alt = member.name;
        img.loading = 'lazy';
        
        const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        img.onerror = function() {
            this.style.display = 'none';
            if (!this.parentElement.querySelector('.member-photo-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'member-photo-placeholder';
                placeholder.textContent = initials;
                this.parentElement.appendChild(placeholder);
            }
        };
        
        existingPlaceholder.parentElement.replaceChild(img, existingPlaceholder);
    }

    // Animate update
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    card.style.transform = 'scale(1.02)';
    card.style.boxShadow = '0 0 30px rgba(0,212,255,0.3)';
    setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
    }, 500);
}
