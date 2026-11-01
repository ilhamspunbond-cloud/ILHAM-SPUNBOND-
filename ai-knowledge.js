/**
 * =========================================================================
 * ILHAM SPUNBOND - AI KNOWLEDGE & VOICE ENGINE v4.1
 * Mengelola kecerdasan AI, Knowledge Base, Web Speech API, dan sinkronisasi
 * =========================================================================
 */

// Global state default untuk AI & Knowledge Base
window.aiKnowledgeBase = [
    {
        id: "kb-1",
        prefix: "Waalaikumussalam",
        keyword: "alamat",
        suffix: "Alamat workshop kami berada di Prm. taman raya No.06 blok k-10, Mekarsari, Kec. Rajeg, Kabupaten Tangerang, Banten 15540, Indonesia.",
        repeatKeyword: false
    },
    {
        id: "kb-2",
        prefix: "Baik",
        keyword: "min order",
        suffix: "Minimal order untuk custom sablon tas spunbond adalah 50 pcs, Bosku. Semakin banyak jumlahnya, harga satuan makin murah dan otomatis dapat diskon 10% untuk pesanan di atas 1.000 pcs!",
        repeatKeyword: false
    },
    {
        id: "kb-3",
        prefix: "Halo",
        keyword: "harga",
        suffix: "Harga tas spunbond bervariasi tergantung model, ukuran, dan metode cetaknya (sablon manual atau DTF full color). Silakan pilih model dan ukuran di aplikasi, harganya langsung otomatis terhitung real-time!",
        repeatKeyword: false
    },
    {
        id: "kb-4",
        prefix: "Tentu",
        keyword: "sablon",
        suffix: "Kami menyediakan sablon manual pasta tinta berkualitas tinggi (bisa 1 atau 2 warna) serta cetak DTF full color yang tajam dan awet.",
        repeatKeyword: false
    },
    {
        id: "kb-5",
        prefix: "Baik",
        keyword: "pengiriman",
        suffix: "Kami melayani pengiriman ke seluruh wilayah Jabodetabek (bisa COD / bayar di tempat) maupun ke seluruh Indonesia menggunakan ekspedisi terpercaya.",
        repeatKeyword: false
    }
];

window.blockedWordsList = ["anjing", "asu", "bangsat", "kampret", "kontol", "memek", "goblok", "tolol"];
window.unansweredLogs = [];

// Fungsi Sapaan Awal AI
function speakAiGreeting() {
    const name = localStorage.getItem('ilham_customer_name') || 'Bosku';
    const text = `Halo ${name}! Selamat datang kembali di ILHAM SPUNBOND. Ada yang bisa saya bantu terkait pemesanan tas custom hari ini?`;
    
    // Tambahkan ke chat history
    appendChatBubble('ai', text);
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

function stopAiSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// Fungsi Menambahkan Bubble Chat
function appendChatBubble(sender, text) {
    const container = document.getElementById('ai-chat-history-container');
    if (!container) return;
    
    const div = document.createElement('div');
    if (sender === 'user') {
        div.className = 'p-2.5 bg-emerald-700 text-white rounded-xl ml-6 text-right shadow-sm';
        div.innerHTML = `👤 <b>Anda:</b> ${escapeHtml(text)}`;
    } else {
        div.className = 'p-2.5 bg-emerald-50/90 text-slate-800 rounded-xl mr-6 border border-emerald-200/70 shadow-sm leading-relaxed';
        div.innerHTML = `🤖 <b>AI Asisten:</b> ${escapeHtml(text)}`;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function clearChatHistory() {
    const container = document.getElementById('ai-chat-history-container');
    if (container) {
        container.innerHTML = `
            <div class="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/60 italic leading-relaxed text-slate-800">
                🤖 "Riwayat percakapan telah direset. Silakan tanyakan apa saja seputar tas spunbond!"
            </div>
        `;
    }
}

// Mesin Pencari & Penjawab AI (Membaca Knowledge Base & Konteks)
function askAiRecommendation() {
    const inputEl = document.getElementById('ai-user-query');
    if (!inputEl) return;
    const query = inputEl.value.trim();
    if (!query) return;

    appendChatBubble('user', query);
    inputEl.value = '';

    const lowerQuery = query.toLowerCase();

    // 1. Cek Kata Terlarang (Blocked Words)
    for (let word of window.blockedWordsList) {
        if (lowerQuery.includes(word)) {
            const warningText = "Mohon maaf, gunakan bahasa yang sopan dan profesional ya, Bosku. Mari kita ngobrol dengan nyaman! 🙏";
            appendChatBubble('ai', warningText);
            speakText(warningText);
            return;
        }
    }

    // 2. Cari di Knowledge Base
    let matchedKb = null;
    for (let kb of window.aiKnowledgeBase) {
        if (lowerQuery.includes(kb.keyword.toLowerCase())) {
            matchedKb = kb;
            break;
        }
    }

    let responseText = "";
    if (matchedKb) {
        let prefix = matchedKb.prefix || "Baik";
        let keywordPart = matchedKb.repeatKeyword ? `tentang ${matchedKb.keyword}` : "";
        responseText = `${prefix}, ${keywordPart} ${matchedKb.suffix}`;
    } else {
        // Log pertanyaan tidak terjawab ke panel admin
        window.unansweredLogs.push({
            query: query,
            time: new Date().toLocaleString()
        });
        if (typeof renderMissingLogs === 'function') renderMissingLogs();

        responseText = `Wah, pertanyaan menarik nih, Bosku! Terkait "${query}", tim admin kami akan segera catat. Untuk info cepat seputar tas spunbond, ukuran, atau sablon, Kakak bisa langsung pilih di menu form atau tanyakan detail modelnya ya!`;
    }

    appendChatBubble('ai', responseText);
    speakText(responseText);
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// Voice Recognition (Speech to Text)
let recognition = null;
function toggleVoiceInput() {
    const micBtn = document.getElementById('mic-btn');
    const inputEl = document.getElementById('ai-user-query');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Browser Anda tidak mendukung fitur pengenalan suara. Silakan gunakan Google Chrome.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.classList.add('bg-rose-600', 'animate-pulse');
    micBtn.innerText = '🔴';

    recognition.onstart = function() {
        if (inputEl) inputEl.placeholder = "Mendengarkan suara Anda...";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        if (inputEl) {
            inputEl.value = transcript;
            askAiRecommendation();
        }
    };

    recognition.onerror = function() {
        micBtn.classList.remove('bg-rose-600', 'animate-pulse');
        micBtn.innerText = '🎤';
        if (inputEl) inputEl.placeholder = "Tanya model, harga, ukuran, atau custom...";
    };

    recognition.onend = function() {
        micBtn.classList.remove('bg-rose-600', 'animate-pulse');
        micBtn.innerText = '🎤';
        if (inputEl) inputEl.placeholder = "Tanya model, harga, ukuran, atau custom...";
    };

    recognition.start();
}

// Fungsi Utility Escape HTML untuk Keamanan
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

console.log("✅ ai-knowledge.js berhasil dimuat sepenuhnya.");
