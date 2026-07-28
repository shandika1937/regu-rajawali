// ===== REGU RAJAWALI 1 - AI Bisma Chatbot =====

(function() {
    'use strict';

    // ========== KNOWLEDGE BASE ==========
    const dayIndo = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
    const dayEng = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    function getToday() {
        return new Date().getDay();
    }

    function getDayName(index) {
        return dayIndo[index] || "MINGGU";
    }

    function getTomorrow() {
        const today = getToday();
        return today === 6 ? 0 : today + 1;
    }

    function getYesterday() {
        const today = getToday();
        return today === 0 ? 6 : today - 1;
    }

    function getDayAfterTomorrow() {
        const tomorrow = getTomorrow();
        return tomorrow === 6 ? 0 : tomorrow + 1;
    }

    const scheduleData = typeof window.scheduleData !== 'undefined' ? window.scheduleData : null;

    function getSchedule(dayIndex) {
        const dayName = dayIndo[dayIndex];
        if (scheduleData && scheduleData.days && scheduleData.days[dayName]) {
            return scheduleData.days[dayName];
        }
        return null;
    }

    function formatSchedule(daySchedule) {
        if (!daySchedule || !daySchedule.lessons) return "Tidak ada jadwal.";
        
        let result = [];
        let lessonNum = 1;
        
        daySchedule.lessons.forEach(item => {
            if (item.break) {
                result.push(`  — ${item.break} —`);
            } else if (item.name) {
                result.push(`  ${lessonNum}. ${item.name}`);
                lessonNum++;
            }
        });
        
        return result.join('\n');
    }

    function getFullDaySchedule(dayIndex) {
        const dayName = getDayName(dayIndex);
        const schedule = getSchedule(dayIndex);
        if (!schedule) return `Jadwal untuk hari ${dayName} tidak tersedia.`;
        
        return `Jadwal ${dayName}:\n${formatSchedule(schedule)}`;
    }

    // ========== CHATBOT RESPONSES ==========
    function getBotResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();
        
        // Greetings
        if (/^(halo|hai|hi|hey|selamat pagi|selamat siang|selamat sore|selamat malam|pagi|siang|sore|malam|assalamualaikum|assalamu'alaikum|wr[.]? wb[.]?)$/i.test(msg) || 
            msg.match(/^(halo|hai|hi|hey)/i)) {
            const greetings = [
                "Halo! Saya AI Bisma, asisten virtual Regu Rajawali 1. Ada yang bisa saya bantu? 🦅",
                "Hai! AI Bisma siap membantu. Tanya apa saja tentang jadwal sekolah ya! 😊",
                "Hey! Salam kenal dari AI Bisma. Mau tanya jadwal pelajaran? Silakan! 📚"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // Who are you
        if (/siapa (kamu|anda)|perkenalkan|nama kamu|ai bisma/i.test(msg)) {
            return "Saya AI Bisma 🤖 — asisten virtual pintar dari Regu Rajawali 1. Saya bisa menjawab pertanyaan tentang jadwal pelajaran kelas 8D secara offline! Coba tanya: 'Besok jadwal apa?' atau 'Hari Kamis apa?'";
        }

        // Regu Rajawali info
        if (/apa itu regu rajawali|regu rajawali|tentang regu/i.test(msg)) {
            return "Regu Rajawali 1 adalah regu dari kelas 8D yang menjunjung tinggi kekompakan, disiplin, tanggung jawab, dan semangat belajar. Motto kami: Solid • Disiplin • Kompak • Siap Berkarya! 🦅✨";
        }

        // Today's schedule
        if (/hari ini (belajar|pelajaran|jadwal|apa)\?*$/i.test(msg) || 
            /hari ini\?*$/i.test(msg) ||
            /sekarang (belajar|pelajaran|jadwal|apa)/i.test(msg)) {
            const today = getToday();
            if (today === 0) return "Hari ini Minggu, libur! Tidak ada jadwal pelajaran. 🎉";
            const schedule = getSchedule(today);
            if (!schedule) return "Hari ini tidak ada jadwal pelajaran. Libur! 🎉";
            return `Jadwal hari ini (${getDayName(today)}):\n${formatSchedule(schedule)}`;
        }

        // Tomorrow's schedule
        if (/besok (jadwal|pelajaran|belajar|apa)\?*$/i.test(msg) || /besok\?*$/i.test(msg)) {
            const tomorrow = getTomorrow();
            if (tomorrow === 0) return "Besok hari Minggu, libur! Tidak ada jadwal pelajaran. 🎉";
            const schedule = getSchedule(tomorrow);
            if (!schedule) return "Besok tidak ada jadwal pelajaran.";
            return `Besok (${getDayName(tomorrow)}):\n${formatSchedule(schedule)}`;
        }

        // Day after tomorrow (lusa)
        if (/lusa (jadwal|pelajaran|belajar|apa)\?*$/i.test(msg) || /lusa\?*$/i.test(msg)) {
            const lusa = getDayAfterTomorrow();
            if (lusa === 0) return "Lusa hari Minggu, libur! 🎉";
            const schedule = getSchedule(lusa);
            if (!schedule) return "Lusa tidak ada jadwal pelajaran.";
            return `Lusa (${getDayName(lusa)}):\n${formatSchedule(schedule)}`;
        }

        // Specific day questions
        const dayPatterns = {
            'senin': 1, 'selasa': 2, 'rabu': 3, 'kamis': 4, 'jumat': 5, 'sabtu': 6, 'minggu': 0,
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0
        };

        for (const [day, idx] of Object.entries(dayPatterns)) {
            if (msg.includes(day)) {
                if (idx === 0) return `${getDayName(idx)} libur, tidak ada pelajaran. 🎉`;
                const schedule = getSchedule(idx);
                if (!schedule) return `Jadwal ${getDayName(idx)} tidak tersedia.`;
                
                // Check if asking specific lesson hour
                const jamMatch = msg.match(/jam (ke[- ]?)?(\d+)/i);
                if (jamMatch) {
                    const lessonNum = parseInt(jamMatch[2]);
                    const lessons = schedule.lessons.filter(l => l.number === lessonNum);
                    if (lessons.length > 0) {
                        return `Jam ke-${lessonNum} hari ${getDayName(idx)}: ${lessons[0].name}`;
                    }
                    return `Jam ke-${lessonNum} hari ${getDayName(idx)} adalah jam istirahat.`;
                }
                
                // Check if asking about a specific subject
                const subjectPatterns = [
                    { regex: /ipa\b/i, name: 'IPA' },
                    { regex: /mtk|matematika|math/i, name: 'MTK' },
                    { regex: /b\.? indonesia|bahasa indonesia|indo/i, name: 'B. Indonesia' },
                    { regex: /b\.? inggris|bahasa inggris|inggris/i, name: 'B. Inggris' },
                    { regex: /b\.? jawa|bahasa jawa|jawa/i, name: 'B. Jawa' },
                    { regex: /pai|pendidikan agama/i, name: 'PAI' },
                    { regex: /ppkn|pkn/i, name: 'PPKn' },
                    { regex: /ips/i, name: 'IPS' },
                    { regex: /prakarya/i, name: 'Prakarya' },
                    { regex: /informatika|tik|komputer/i, name: 'Informatika' },
                    { regex: /olahraga|penjas|sport/i, name: 'Olahraga' },
                    { regex: /bk.?bp|bimbingan konseling|bk/i, name: 'BK/BP' },
                    { regex: /senam|kerling/i, name: 'Senam/Kerling' },
                    { regex: /upacara/i, name: 'Upacara' }
                ];
                
                for (const sp of subjectPatterns) {
                    if (sp.regex.test(msg)) {
                        const hasLesson = schedule.lessons.some(l => l.name === sp.name);
                        if (hasLesson) {
                            const lessonNumbers = schedule.lessons
                                .filter(l => l.name === sp.name)
                                .map(l => l.number)
                                .join(', ');
                            return `Ya! ${sp.name} ada di hari ${getDayName(idx)} pada jam ke-${lessonNumbers}.`;
                        } else {
                            return `${sp.name} tidak ada di hari ${getDayName(idx)}.`;
                        }
                    }
                }
                
                return getFullDaySchedule(idx);
            }
        }

        // Schedule question: "ada [subject] besok" or "besok ada [subject]?"
        const subjectCheck = [
            { regex: /ipa\b/i, name: 'IPA' },
            { regex: /mtk|matematika|math/i, name: 'MTK' },
            { regex: /b\.? indonesia/i, name: 'B. Indonesia' },
            { regex: /b\.? inggris/i, name: 'B. Inggris' },
            { regex: /b\.? jawa/i, name: 'B. Jawa' },
            { regex: /pai/i, name: 'PAI' },
            { regex: /ppkn|pkn/i, name: 'PPKn' },
            { regex: /ips/i, name: 'IPS' },
            { regex: /prakarya/i, name: 'Prakarya' },
            { regex: /informatika|tik/i, name: 'Informatika' },
            { regex: /olahraga|penjas/i, name: 'Olahraga' },
            { regex: /bk|bp/i, name: 'BK/BP' }
        ];

        // Check if asking about a specific subject on a specific day
        if (/ada (tidak|nggak|gak)\?/i.test(msg) || /\?$/.test(msg)) {
            for (const sc of subjectCheck) {
                if (sc.regex.test(msg)) {
                    // Find which day they're asking about
                    let targetDay = getToday();
                    if (/besok/i.test(msg)) targetDay = getTomorrow();
                    else if (/lusa/i.test(msg)) targetDay = getDayAfterTomorrow();
                    else if (/kemarin/i.test(msg)) targetDay = getYesterday();
                    else {
                        for (const [day, idx] of Object.entries(dayPatterns)) {
                            if (msg.includes(day) && day.length > 3) {
                                targetDay = idx;
                                break;
                            }
                        }
                    }

                    if (targetDay === 0) return `${getDayName(targetDay)} libur, tidak ada pelajaran.`;
                    const schedule = getSchedule(targetDay);
                    if (!schedule) return `Tidak ada data jadwal untuk ${getDayName(targetDay)}.`;
                    
                    const hasIt = schedule.lessons.some(l => l.name === sc.name || l.name.includes(sc.name));
                    if (hasIt) {
                        const lessonNums = schedule.lessons
                            .filter(l => l.name === sc.name)
                            .map(l => l.number)
                            .join(', ');
                        return `Ya! ${sc.name} ada di hari ${getDayName(targetDay)} pada jam ke-${lessonNums}.`;
                    } else {
                        return `Tidak, ${sc.name} tidak ada di hari ${getDayName(targetDay)}.`;
                    }
                }
            }
        }

        // "Jam pertama" questions
        if (/jam (pertama|1|ke-1)/i.test(msg)) {
            let targetDay = getToday();
            for (const [day, idx] of Object.entries(dayPatterns)) {
                if (msg.includes(day) && day.length > 3) {
                    targetDay = idx;
                    break;
                }
            }
            if (/besok/i.test(msg)) targetDay = getTomorrow();
            
            if (targetDay === 0) return `${getDayName(targetDay)} libur.`;
            const schedule = getSchedule(targetDay);
            if (!schedule) return `Tidak ada data jadwal.`;
            const firstLesson = schedule.lessons.find(l => l.number === 1);
            return firstLesson ? `Jam pertama hari ${getDayName(targetDay)}: ${firstLesson.name}` : `Tidak ada pelajaran di jam pertama.`;
        }

        // Class info
        if (/kelas (berapa|apa)|8d|8-d|kelas 8/i.test(msg)) {
            return "Kami adalah Regu Rajawali 1 dari Kelas 8D! 🦅 Sebuah kelas yang solid, disiplin, dan kompak. Mau lihat jadwal pelajaran? Tanya saja 'Jadwal Senin apa?' atau hari lainnya!";
        }

        // Member info
        if (/anggota|siapa saja|member/i.test(msg)) {
            return "Regu Rajawali 1 memiliki 8 anggota:\n1. Bisma Anugerah Mulia (Ketua)\n2. Ahmad Aufar Alfarizi (Wakil Ketua)\n3. Ahmad Mufri Hakiki (Sekretaris)\n4. Lucky Riyansah Yuandino (Bendahara)\n5. Muhammad Facriza\n6. M. Yusuf Ariyanto\n7. Arya Nufail Rafa Fernando\n8. Shandika Ghani Maulana\n\nScroll ke bawah untuk lihat profil lengkap! 👇";
        }

        // Contact
        if (/kontak|hubungi|email|telepon|whatsapp/i.test(msg)) {
            return "Untuk menghubungi Regu Rajawali 1, silakan scroll ke bagian Kontak di website ini atau hubungi langsung melalui form yang tersedia. 📬";
        }

        // Help
        if (/bantuan|help|tolong|menu|command|perintah|bisa apa/i.test(msg)) {
            return "Saya bisa menjawab pertanyaan seputar:\n📅 Jadwal pelajaran (hari ini, besok, lusa, atau hari tertentu)\n📚 Mata pelajaran tertentu\n👥 Anggota regu\n🏫 Informasi kelas 8D\n\nCoba tanya:\n• 'Besok jadwal apa?'\n• 'Hari Kamis apa?'\n• 'Besok ada IPA?'\n• 'Jam pertama hari Selasa apa?'";
        }

        // Thanks
        if (/terima kasih|makasih|thanks|thank|trims/i.test(msg)) {
            return "Sama-sama! Senang bisa membantu 😊 Semangat terus belajarnya! Ada lagi yang ingin ditanyakan? 🦅";
        }

        // Farewell
        if (/dadah|bye|selamat tinggal|sampai jumpa|goodbye/i.test(msg)) {
            return "Sampai jumpa! Tetap semangat dan jaga kekompakan Regu Rajawali 1! 🦅✨";
        }

        // Time
        if (/jam (berapa|sekarang)|waktu|pukul/i.test(msg)) {
            const now = new Date();
            const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return `Sekarang jam ${time} WIB. ⏰`;
        }

        // Default response
        const defaultResponses = [
            "Maaf, saya belum mengerti pertanyaan itu. Coba tanya tentang jadwal pelajaran ya! Contoh: 'Besok jadwal apa?' atau 'Hari Kamis apa?' 😊",
            "Hmm, saya belum paham maksudnya. Saya spesialis jadwal pelajaran kelas 8D nih! Coba tanya: 'Senin belajar apa?' 🏫",
            "Mohon maaf, saya belum bisa menjawab itu. Saya AI Bisma yang khusus membantu soal jadwal sekolah. Ketik 'help' untuk bantuan! 🤖"
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // ========== CHATBOT UI ==========
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const voiceBtn = document.getElementById('voice-btn');
    const ttsBtn = document.getElementById('tts-btn');
    const clearBtn = document.getElementById('chat-clear');

    if (!chatMessages || !chatInput || !chatSend) return;

    let isListening = false;
    let recognition = null;
    let lastBotMessage = '';

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(bubble);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    // Send message
    function sendMessage(text) {
        if (!text.trim()) return;
        
        // Add user message
        addMessage(text, 'user');
        chatInput.value = '';
        
        // Show typing
        showTyping();
        
        // Simulate AI thinking
        const delay = 500 + Math.random() * 800;
        setTimeout(() => {
            hideTyping();
            const response = getBotResponse(text);
            lastBotMessage = response;
            addMessage(response, 'bot');
        }, delay);
    }

    // Send button click
    chatSend.addEventListener('click', () => sendMessage(chatInput.value));

    // Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(chatInput.value);
        }
    });

    // Clear chat
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            chatMessages.innerHTML = '';
            // Add welcome message
            setTimeout(() => {
                addMessage("Halo! Saya AI Bisma 🤖 Ada yang bisa saya bantu? Tanya soal jadwal pelajaran ya!", 'bot');
            }, 300);
        });
    }

    // Voice input
    if (voiceBtn && 'webkitSpeechRecognition' in window || voiceBtn && 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            sendMessage(transcript);
            voiceBtn.classList.remove('listening');
            isListening = false;
        };

        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
            isListening = false;
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
            isListening = false;
        };

        voiceBtn.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
                voiceBtn.classList.remove('listening');
                isListening = false;
            } else {
                try {
                    recognition.start();
                    voiceBtn.classList.add('listening');
                    isListening = true;
                } catch (e) {
                    console.warn('Voice recognition error:', e);
                }
            }
        });
    } else if (voiceBtn) {
        voiceBtn.style.opacity = '0.3';
        voiceBtn.title = 'Voice input tidak didukung di browser ini';
    }

    // Text to Speech
    if (ttsBtn && 'speechSynthesis' in window) {
        ttsBtn.addEventListener('click', () => {
            if (lastBotMessage) {
                const utterance = new SpeechSynthesisUtterance(lastBotMessage);
                utterance.lang = 'id-ID';
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                window.speechSynthesis.speak(utterance);
            } else {
                // Read last message
                const lastMsg = chatMessages.querySelector('.chat-message.bot:last-child .bubble');
                if (lastMsg) {
                    const utterance = new SpeechSynthesisUtterance(lastMsg.textContent);
                    utterance.lang = 'id-ID';
                    window.speechSynthesis.speak(utterance);
                }
            }
        });
    } else if (ttsBtn) {
        ttsBtn.style.opacity = '0.3';
        ttsBtn.title = 'Text-to-Speech tidak didukung di browser ini';
    }

    // Dark/light mode toggle (simple)
    const themeBtn = document.getElementById('chat-theme');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const card = document.querySelector('.chatbot-card');
            if (card) {
                card.style.background = card.style.background === 'var(--gradient-card)' || !card.style.background 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'var(--gradient-card)';
            }
        });
    }

    // === WELCOME MESSAGE ===
    setTimeout(() => {
        const today = getToday();
        let welcomeMsg = "Halo! Saya AI Bisma 🤖 Ada yang bisa saya bantu? Tanya soal jadwal pelajaran ya!";
        if (today !== 0 && getSchedule(today)) {
            welcomeMsg = `Halo! Saya AI Bisma 🤖\n\nHari ini ${getDayName(today)}.\n${formatSchedule(getSchedule(today))}\n\nAda yang ingin ditanyakan?`;
        } else if (today === 0) {
            welcomeMsg = "Halo! Saya AI Bisma 🤖\nHari ini Minggu, libur! 🎉\nTanya jadwal besok atau hari lainnya ya!";
        }
        addMessage(welcomeMsg, 'bot');
    }, 1000);

    // Expose for other scripts
    window.AIBisma = {
        sendMessage,
        getBotResponse,
        getSchedule,
        getDayName,
        getToday,
        getTomorrow
    };

})();
