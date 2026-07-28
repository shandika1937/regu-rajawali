// Data Jadwal Pelajaran Kelas 8D - TP 2026/2027
const scheduleData = {
    title: "JADWAL PELAJARAN VIII 2026/2027",
    footer: "TDD: Sule Anderson M.bg S.mp S.d",
    days: {
        "SENIN": {
            icon: "fa-calendar-day",
            color: "#ff6b6b",
            bg: "rgba(255,107,107,0.08)",
            lessons: [
                { number: 1, name: "Upacara", icon: "fa-flag" },
                { number: 2, name: "MTK", icon: "fa-calculator" },
                { number: 3, name: "MTK", icon: "fa-calculator" },
                { number: 4, name: "MTK", icon: "fa-calculator" },
                { break: "Istirahat ke 1", icon: "fa-coffee" },
                { number: 5, name: "BK/BP", icon: "fa-hand-holding-heart" },
                { number: 6, name: "BK/BP", icon: "fa-hand-holding-heart" },
                { break: "Istirahat ke 2 (MBG)", icon: "fa-utensils" },
                { number: 7, name: "B. Indonesia", icon: "fa-book-open" },
                { number: 8, name: "B. Indonesia", icon: "fa-book-open" }
            ]
        },
        "SELASA": {
            icon: "fa-calendar-day",
            color: "#51cf66",
            bg: "rgba(81,207,102,0.08)",
            lessons: [
                { number: 1, name: "B. Indonesia", icon: "fa-book-open" },
                { number: 2, name: "B. Indonesia", icon: "fa-book-open" },
                { number: 3, name: "IPS", icon: "fa-globe-asia" },
                { number: 4, name: "IPS", icon: "fa-globe-asia" },
                { break: "Istirahat ke 1", icon: "fa-coffee" },
                { number: 5, name: "MTK", icon: "fa-calculator" },
                { number: 6, name: "MTK", icon: "fa-calculator" },
                { break: "Istirahat ke 2 (MBG)", icon: "fa-utensils" },
                { number: 7, name: "B. Jawa", icon: "fa-language" },
                { number: 8, name: "B. Jawa", icon: "fa-language" }
            ]
        },
        "RABU": {
            icon: "fa-calendar-day",
            color: "#4dabf7",
            bg: "rgba(77,171,247,0.08)",
            lessons: [
                { number: 1, name: "Olahraga", icon: "fa-running" },
                { number: 2, name: "Olahraga", icon: "fa-running" },
                { number: 3, name: "Olahraga", icon: "fa-running" },
                { number: 4, name: "PPKn", icon: "fa-gavel" },
                { break: "Istirahat ke 1", icon: "fa-coffee" },
                { number: 5, name: "PPKn", icon: "fa-gavel" },
                { number: 6, name: "PPKn", icon: "fa-gavel" },
                { break: "Istirahat ke 2 (MBG)", icon: "fa-utensils" },
                { number: 7, name: "IPS", icon: "fa-globe-asia" },
                { number: 8, name: "IPS", icon: "fa-globe-asia" }
            ]
        },
        "KAMIS": {
            icon: "fa-calendar-day",
            color: "#fcc419",
            bg: "rgba(252,196,25,0.08)",
            lessons: [
                { number: 1, name: "IPA", icon: "fa-flask" },
                { number: 2, name: "IPA", icon: "fa-flask" },
                { number: 3, name: "IPA", icon: "fa-flask" },
                { number: 4, name: "B. Inggris", icon: "fa-language" },
                { break: "Istirahat ke 1", icon: "fa-coffee" },
                { number: 5, name: "B. Inggris", icon: "fa-language" },
                { number: 6, name: "Prakarya", icon: "fa-paint-brush" },
                { break: "Istirahat ke 2 (MBG)", icon: "fa-utensils" },
                { number: 7, name: "Prakarya", icon: "fa-paint-brush" },
                { number: 8, name: "Prakarya", icon: "fa-paint-brush" }
            ]
        },
        "JUMAT": {
            icon: "fa-calendar-day",
            color: "#845ef7",
            bg: "rgba(132,94,247,0.08)",
            lessons: [
                { number: 1, name: "Senam/Kerling", icon: "fa-dumbbell" },
                { number: 2, name: "PAI", icon: "fa-mosque" },
                { number: 3, name: "PAI", icon: "fa-mosque" },
                { number: 4, name: "PAI", icon: "fa-mosque" },
                { break: "Istirahat", icon: "fa-coffee" },
                { number: 5, name: "IPA", icon: "fa-flask" },
                { number: 6, name: "IPA", icon: "fa-flask" }
            ]
        },
        "SABTU": {
            icon: "fa-calendar-day",
            color: "#20c997",
            bg: "rgba(32,201,151,0.08)",
            lessons: [
                { number: 1, name: "B. Inggris", icon: "fa-language" },
                { number: 2, name: "B. Inggris", icon: "fa-language" },
                { number: 3, name: "B. Indonesia", icon: "fa-book-open" },
                { number: 4, name: "B. Indonesia", icon: "fa-book-open" },
                { break: "Istirahat", icon: "fa-coffee" },
                { number: 5, name: "Informatika", icon: "fa-laptop-code" },
                { number: 6, name: "Informatika", icon: "fa-laptop-code" },
                { number: 7, name: "Informatika", icon: "fa-laptop-code" }
            ]
        }
    }
};

// Nama hari dalam bahasa Indonesia
const dayNames = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
const dayNamesID = {
    "SUNDAY": "MINGGU",
    "MONDAY": "SENIN",
    "TUESDAY": "SELASA",
    "WEDNESDAY": "RABU",
    "THURSDAY": "KAMIS",
    "FRIDAY": "JUMAT",
    "SATURDAY": "SABTU"
};

function getDayNameID(dayIndex) {
    return dayNames[dayIndex] || "MINGGU";
}

function getTodaySchedule() {
    const today = new Date().getDay();
    const dayName = dayNames[today];
    return scheduleData.days[dayName] || null;
}

function getScheduleForDay(dayName) {
    return scheduleData.days[dayName] || null;
}

function getTomorrowSchedule() {
    const today = new Date().getDay();
    const tomorrow = today === 6 ? 0 : today + 1;
    const dayName = dayNames[tomorrow];
    return { dayName, schedule: scheduleData.days[dayName] || null };
}

function getYesterdaySchedule() {
    const today = new Date().getDay();
    const yesterday = today === 0 ? 6 : today - 1;
    const dayName = dayNames[yesterday];
    return { dayName, schedule: scheduleData.days[yesterday] || null };
}
