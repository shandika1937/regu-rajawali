// ===== REGU RAJAWALI 1 - Data Anggota =====

var membersData = [
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
function getMemberPhotoSrc(member) {
    if (window.AdminPanel && typeof AdminPanel.getMemberPhotoFromStorage === "function") {
        var storedPhoto = AdminPanel.getMemberPhotoFromStorage(member.id);
        if (storedPhoto) return storedPhoto;
    }
    return member.photo;
}

function getMemberBioText(member) {
    if (window.AdminPanel && typeof AdminPanel.getMemberBio === "function") {
        return AdminPanel.getMemberBio(member.id, member.bio);
    }
    return member.bio;
}

function getMemberRoleText(member) {
    if (window.AdminPanel && typeof AdminPanel.getMemberRole === "function") {
        return AdminPanel.getMemberRole(member.id, member.role);
    }
    return member.role;
}

// ========== REALTIME UPDATES ==========
document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("memberPhotoUpdated", function(e) {
        var memberId = e.detail.memberId;
        updateSingleMemberCard(memberId);
    });

    window.addEventListener("memberBioUpdated", function(e) {
        var memberId = e.detail.memberId;
        var bio = e.detail.bio;
        var card = findMemberCard(memberId);
        if (card) {
            var bioEl = card.querySelector(".member-bio");
            if (bioEl) bioEl.textContent = bio;
        }
    });

    window.addEventListener("memberRoleUpdated", function(e) {
        var memberId = e.detail.memberId;
        var role = e.detail.role;
        var card = findMemberCard(memberId);
        if (card) {
            var roleEl = card.querySelector(".member-role");
            if (roleEl) roleEl.textContent = role;
        }
    });
});

function findMemberCard(memberId) {
    var cards = document.querySelectorAll(".member-card");
    var member = null;
    for (var i = 0; i < membersData.length; i++) {
        if (membersData[i].id === memberId) {
            member = membersData[i];
            break;
        }
    }
    if (!member) return null;

    for (var j = 0; j < cards.length; j++) {
        var nameEl = cards[j].querySelector(".member-name");
        if (nameEl && nameEl.textContent === member.name) {
            return cards[j];
        }
    }
    return null;
}

function updateSingleMemberCard(memberId) {
    var member = null;
    for (var i = 0; i < membersData.length; i++) {
        if (membersData[i].id === memberId) {
            member = membersData[i];
            break;
        }
    }
    if (!member) return;

    var card = findMemberCard(memberId);
    if (!card) return;

    var photoWrapper = card.querySelector(".member-photo-wrapper");
    if (!photoWrapper) return;

    var photoSrc = getMemberPhotoSrc(member);
    var existingImg = card.querySelector(".member-photo");
    var existingPlaceholder = card.querySelector(".member-photo-placeholder");

    if (existingImg) {
        existingImg.src = photoSrc;
    } else if (existingPlaceholder) {
        var img = document.createElement("img");
        img.className = "member-photo";
        img.src = photoSrc;
        img.alt = member.name;
        img.loading = "lazy";
        existingPlaceholder.parentElement.replaceChild(img, existingPlaceholder);
    }
}
