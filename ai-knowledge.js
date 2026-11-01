/**
 * =========================================================================
 * ILHAM SPUNBOND - AI KNOWLEDGE & VOICE ENGINE v4.1
 * Mengelola kecerdasan AI, Knowledge Base, Web Speech API, dan sinkronisasi
 * =========================================================================
 */

// Global state default untuk AI & Knowledge Base (disamakan ke knowledgeFaq & blockedWords)
window.knowledgeFaq = [
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

window.blockedWords = ["anjing", "asu", "bangsat", "kampret", "kontol", "memek", "goblok", "tolol"];
window.unansweredLogs = [];

// Load dari localStorage jika ada penyimpanan kustom dari admin
try {
    if(localStorage.getItem('ilham_knowledgeFaq')) {
        window.knowledgeFaq = JSON.parse(localStorage.getItem('ilham_knowledgeFaq'));
    }
    if(localStorage.getItem('ilham_blockedWords')) {
        window.blockedWords = JSON.parse(localStorage.getItem('ilham_blockedWords'));
    }
    if(localStorage.getItem('ilham_unansweredLogs')) {
        window.unansweredLogs = JSON.parse(localStorage.getItem('ilham_unansweredLogs'));
    }
} catch(e) {
    console.error("Storage error:", e);
}

// Fungsi Sapaan Awal AI (Otomatis Menarik Nama Customer yang Aktif)
function speakAiGreeting() {
    // Ambil data profil customer terbaru dari localStorage
    let activeCustomer = {};
    try {
        activeCustomer = JSON.parse(localStorage.getItem('ilham_customerProfile') || '{}');
    } catch(e) {}

    const title = activeCustomer.title || localStorage.getItem('ilham_customer_title') || 'Bosku';
    const name = activeCustomer.name || localStorage.getItem('ilham_customer_name') || 'Pelanggan';
    
    const text = `Halo ${title} ${name}! Selamat datang kembali di ILHAM SPUNBOND. Ada yang bisa saya bantu terkait pemesanan tas custom hari ini?`;
    
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

// Fungsi Menambahkan Bubble Chat
function appendChatBubble(sender, text) {
    const container = document.getElementById('ai-chat-history-container');
    if (!container) return;
    
    const div = document.createElement('div');
    if (sender === 'user') {
        div.className = 'p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-right text-slate-900 font-medium';
        div.innerHTML = `🗣️ "${escapeHtml(text)}"`;
    } else {
        div.className = 'p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/60 italic leading-relaxed text-slate-800';
        div.innerHTML = `🤖 "${escapeHtml(text)}"`;
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
// Mesin Pencari & Penjawab AI (Sesuai Urutan Baru)
function askAiRecommendation() {
    const inputEl = document.getElementById('ai-user-query');
    if (!inputEl) return;
    const query = inputEl.value.trim();
    if (!query) return;

    appendChatBubble('user', query);
    inputEl.value = '';

    const lowerQuery = query.toLowerCase();

    // 1. Cek Kata Terlarang (Blocked Words)
    for (let word of window.blockedWords) {
        if (lowerQuery.includes(word)) {
            const warningText = "Mohon maaf, gunakan bahasa yang sopan dan profesional ya, Bosku. Mari kita ngobrol dengan nyaman! 🙏";
            appendChatBubble('ai', warningText);
            speakText(warningText);
            return;
        }
    }

    // Ambil Nama & Panggilan Customer yang Sedang Aktif
    let activeCustomer = {};
    try { activeCustomer = JSON.parse(localStorage.getItem('ilham_customerProfile') || '{}'); } catch(e) {}
    const title = activeCustomer.title || localStorage.getItem('ilham_customer_title') || 'Bosku';
    const name = activeCustomer.name || localStorage.getItem('ilham_customer_name') || 'Pelanggan';
    const customerFullName = `${title} ${name}`; // Contoh: "Bosku Rojak" atau "Kak Budi"

    // 2. Cari di Knowledge Base (knowledgeFaq)
    let matchedKb = null;
    for (let kb of window.knowledgeFaq) {
        if (lowerQuery.includes(kb.keyword.toLowerCase())) {
            matchedKb = kb;
            break;
        }
    }

    let responseText = "";
    if (matchedKb) {
        // URUTAN SESUAI PERMINTAAN: Kata Awal + Nama Customer + Kata Akhir (Suffix)
        let prefix = matchedKb.prefix || "Baik";
        
        // Cek apakah user/admin mengaktifkan pengulangan keyword
        let keywordPart = "";
        if (matchedKb.repeatKeyword === true) {
            keywordPart = ` mengenai ${matchedKb.keyword}`;
        }

        // Susun kalimat sesuai urutan: [Prefix] + [Nama Customer] + [Keyword Optional] + [Suffix]
        responseText = `${prefix}, ${customerFullName}${keywordPart}. ${matchedKb.suffix}`;
        
    } else {
        // Log pertanyaan tidak terjawab ke panel admin
        window.unansweredLogs.push(query);
        try { localStorage.setItem('ilham_unansweredLogs', JSON.stringify(window.unansweredLogs)); } catch(e) {}
        if (typeof renderAdminPanel === 'function') renderAdminPanel();

        // Susun sapaan jika pertanyaan belum ada di knowledge base
        responseText = `Wah, pertanyaan menarik nih, ${customerFullName}! Terkait "${query}", tim admin kami akan segera catat. Untuk info cepat seputar tas spunbond, ukuran, atau sablon, Kakak bisa langsung pilih di menu form ya!`;
    }

    appendChatBubble('ai', responseText);
    speakText(responseText);
}

// Fungsi Update Field FAQ (Edit Kata Kunci / Prefix / Suffix) dengan Auto-Save Permanen
function updateFaqField(fIdx, field) {
    if (!window.knowledgeFaq || !window.knowledgeFaq[fIdx]) return;
    
    // Ambil nilai terbaru dari inputan form edit di panel admin
    const prefixVal = document.getElementById(`edit-faq-prefix-${fIdx}`)?.value || "";
    const kwVal = document.getElementById(`edit-faq-kw-${fIdx}`)?.value || "";
    const suffixVal = document.getElementById(`edit-faq-suffix-${fIdx}`)?.value || "";
    
    // Perbarui data di array global
    window.knowledgeFaq[fIdx].prefix = prefixVal;
    window.knowledgeFaq[fIdx].keyword = kwVal;
    window.knowledgeFaq[fIdx].suffix = suffixVal;
    
    // 1. Simpan otomatis ke LocalStorage seketika
    try {
        localStorage.setItem('ilham_knowledgeFaq', JSON.stringify(window.knowledgeFaq));
    } catch(e) {}
    
    // 2. Aktifkan penanda manual update supaya tidak bentrok dengan onSnapshot
    window.isManualUpdating = true;
    
    // 3. Kirim dan simpan permanen ke Firebase Cloud secara otomatis
    if (typeof saveToCloud === 'function') {
        saveToCloud().then(() => {
            setTimeout(() => { window.isManualUpdating = false; }, 1000);
        });
    }
}

// Fungsi Update Opsi Pengulangan Kata Kunci dengan Auto-Save
function updateFaqRepeat(fIdx) {
    if (!window.knowledgeFaq || !window.knowledgeFaq[fIdx]) return;
    const val = document.getElementById(`edit-faq-repeat-${fIdx}`).value === 'true';
    window.knowledgeFaq[fIdx].repeatKeyword = val;
    
    // Simpan otomatis ke LocalStorage & Cloud
    try {
        localStorage.setItem('ilham_knowledgeFaq', JSON.stringify(window.knowledgeFaq));
    } catch(e) {}
    
    window.isManualUpdating = true;
    if (typeof saveToCloud === 'function') {
        saveToCloud().then(() => {
            setTimeout(() => { window.isManualUpdating = false; }, 1000);
        });
    }
}

// Fungsi Tambah Ingatan AI yang Aman dari Bentrok Cloud
function addKnowledgeFaq() {
    const prefix = document.getElementById('new-faq-prefix')?.value.trim() || "Baik";
    const keyword = document.getElementById('new-faq-keyword')?.value.trim();
    const suffix = document.getElementById('new-faq-suffix')?.value.trim();
    
    if(!keyword || !suffix) {
        alert("Keyword dan Jawaban wajib diisi, Bosku!");
        return;
    }
    
    if (!window.knowledgeFaq) window.knowledgeFaq = [];
    
    // Tambah ingatan baru dengan ID super unik
    window.knowledgeFaq.push({
        id: "kb-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
        prefix: prefix,
        keyword: keyword,
        suffix: suffix,
        repeatKeyword: false
    });
    
    // Simpan ke localStorage terlebih dahulu sebagai master lokal
    try {
        localStorage.setItem('ilham_knowledgeFaq', JSON.stringify(window.knowledgeFaq));
    } catch(e) {
        console.error("Gagal simpan localStorage:", e);
    }
    
    // Set flag supaya cloud tahu kita sedang update manual (mencegah bentrok onSnapshot)
    window.isManualUpdating = true;
    
    // Simpan ke Firebase Cloud
    if (typeof saveToCloud === 'function') {
        saveToCloud().then(() => {
            setTimeout(() => { window.isManualUpdating = false; }, 1000);
        });
    }
    
    // Kosongkan form input
    document.getElementById('new-faq-prefix').value = '';
    document.getElementById('new-faq-keyword').value = '';
    document.getElementById('new-faq-suffix').value = '';
    
    if (typeof renderAdminPanel === 'function') {
        renderAdminPanel();
    }
}

// Fungsi Hapus Ingatan AI yang Aman
function deleteKnowledgeFaq(fIdx) {
    if (confirm("Yakin ingin menghapus ingatan AI ini?")) {
        if (!window.knowledgeFaq) return;
        
        // Hapus array berdasarkan indeks
        window.knowledgeFaq.splice(fIdx, 1);
        
        // Simpan ke localStorage
        try {
            localStorage.setItem('ilham_knowledgeFaq', JSON.stringify(window.knowledgeFaq));
        } catch(e) {}
        
        // Set flag penanda update manual
        window.isManualUpdating = true;
        
        // Sinkronkan ke Firebase Cloud
        if (typeof saveToCloud === 'function') {
            saveToCloud().then(() => {
                setTimeout(() => { window.isManualUpdating = false; }, 1000);
            });
        }
        
        if (typeof renderAdminPanel === 'function') {
            renderAdminPanel();
        }
    }
}

function promoteLogToFaq(queryText, lIdx) {
    window.knowledgeFaq.push({
        id: "kb-" + Date.now(),
        prefix: "Baik, mengenai",
        keyword: queryText,
        suffix: `Informasi terkait "${queryText}" akan segera kami layani dengan maksimal di workshop ILHAM SPUNBOND.`,
        repeatKeyword: true
    });
    deleteSingleUnansweredLog(lIdx);
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

    if(micBtn) {
        micBtn.classList.add('bg-rose-600', 'animate-pulse');
        micBtn.innerText = '🔴';
    }

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
        if(micBtn) {
            micBtn.classList.remove('bg-rose-600', 'animate-pulse');
            micBtn.innerText = '🎤';
        }
        if (inputEl) inputEl.placeholder = "Tanya model, harga, ukuran, atau custom...";
    };

    recognition.onend = function() {
        if(micBtn) {
            micBtn.classList.remove('bg-rose-600', 'animate-pulse');
            micBtn.innerText = '🎤';
        }
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

console.log("✅ ai-knowledge.js berhasil diselaraskan dan dimuat sepenuhnya.");
