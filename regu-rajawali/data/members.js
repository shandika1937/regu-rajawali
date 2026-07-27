// Data Anggota Regu Rajawali 1
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

// Helper untuk mendapatkan foto anggota
function getMemberPhoto(member) {
    const img = new Image();
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    // Coba load gambar
    return member.photo;
}
