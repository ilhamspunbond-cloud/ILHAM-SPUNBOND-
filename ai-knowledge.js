/**
 * =========================================================================
 * ILHAM SPUNBOND - AI KNOWLEDGE & VOICE ENGINE v4.1
 * Mengelola kecerdasan AI, Knowledge Base, Web Speech API, dan sinkronisasi
 * =========================================================================
 */

// Global state default untuk AI & Knowledge Base (dengan pengaman try-catch anti-corrupt JSON)
window.knowledgeFaq = [
    {
        id: "kb-1",
        prefix: "Waalaikumussalam",
        keyword: "alamat",
        suffix: "Alamat workshop kami berada di Prm. taman raya No.06 blok k-10, Mekarsari, Kec. Rajeg, Kabupaten Tangerang, Banten 15540, Indonesia",
        repeatKeyword: false
    },
    {
        id: "kb-2",
        prefix: "Baik",
        keyword: "min order",
        suffix: "Minimal order untuk custom sablon tas spunbond adalah 50 pcs, Bosku. Semakin banyak jumlahnya, harga satuan makin murah dan otomatis dapat diskon 10% untuk pesanan di atas 1.000 pcs",
        repeatKeyword: false
    },
    {
        id: "kb-3",
        prefix: "Halo",
        keyword: "harga",
        suffix: "Harga tas spunbond bervariasi tergantung model, ukuran, dan metode cetaknya (sablon manual atau DTF full color). Silakan pilih model dan ukuran di aplikasi, harganya langsung otomatis terhitung real-time",
        repeatKeyword: false
    },
    {
        id: "kb-4",
        prefix: "Tentu",
        keyword: "sablon",
        suffix: "Kami menyediakan sablon manual pasta tinta berkualitas tinggi (bisa 1 atau 2 warna) serta cetak DTF full color yang tajam dan awet",
        repeatKeyword: false
    },
    {
        id: "kb-5",
        prefix: "Baik",
        keyword: "pengiriman",
        suffix: "Kami melayani pengiriman ke seluruh wilayah Jabodetabek (bisa COD / bayar di tempat) maupun ke seluruh Indonesia menggunakan ekspedisi terpercaya",
        repeatKeyword: false
    }
];

window.blockedWords = ["anjing", "asu", "bangsat", "kampret", "kontol", "memek", "goblok", "tolol"];
window.unansweredLogs = [];

// Load dari localStorage dengan Pengaman Anti-Crash / Anti-Corrupt JSON
try {
    const savedFaq = localStorage.getItem('ilham_knowledgeFaq');
    if (savedFaq) {
        const parsedData = JSON.parse(savedFaq);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
            window.knowledgeFaq = parsedData;
        }
    }
    if(localStorage.getItem('ilham_blockedWords')) {
        window.blockedWords = JSON.parse(localStorage.getItem('ilham_blockedWords'));
    }
    if(localStorage.getItem('ilham_unansweredLogs')) {
        window.unansweredLogs = JSON.parse(localStorage.getItem('ilham_unansweredLogs'));
    }
} catch(e) {
    console.warn("⚠️ Terdeteksi data korup di localStorage, membersihkan string berbahaya...", e);
    localStorage.removeItem('ilham_knowledgeFaq');
}

// Fungsi Pembersih Koma / Spasi Nyasar di Ujung Kalimat
function cleanTrailingComma(str) {
    if (!str) return "";
    let cleaned = str.trim();
    if (cleaned.endsWith(',')) {
        cleaned = cleaned.slice(0, -1).trim();
    }
    return cleaned;
}

// Fungsi Sapaan Awal AI (Otomatis Menarik Nama Customer yang Aktif)
function speakAiGreeting() {
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

// Mesin Pencari & Penjawab AI
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
    const customerFullName = `${title} ${name}`;

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
        let prefix = matchedKb.prefix || "Baik";
        let keywordPart = "";
        if (matchedKb.repeatKeyword === true) {
            keywordPart = ` mengenai ${matchedKb.keyword}`;
        }
        responseText = `${prefix}, ${customerFullName}${keywordPart}. ${matchedKb.suffix}.`;
    } else {
        window.unansweredLogs.push(query);
        try { localStorage.setItem('ilham_unansweredLogs', JSON.stringify(window.unansweredLogs)); } catch(e) {}
        if (typeof renderAdminPanel === 'function') renderAdminPanel();

        responseText = `Wah, pertanyaan menarik nih, ${customerFullName}! Terkait "${query}", tim admin kami akan segera catat. Untuk info cepat seputar tas spunbond, ukuran, atau sablon, Kakak bisa langsung pilih di menu form ya!`;
    }

    appendChatBubble('ai', responseText);
    speakText(responseText);
}

// =========================================================================
// PANEL ADMIN: RENDER FAQ DENGAN KUNCI OTOMATIS & TOMBOL SIMPAN EDIT AMAN
// =========================================================================
function renderKnowledgeFaqAdmin() {
    const faqAdminContainer = document.getElementById('faq-admin-container');
    if (!faqAdminContainer || typeof knowledgeFaq === 'undefined') return;
    
    faqAdminContainer.innerHTML = '';
    knowledgeFaq.forEach((faq, fIdx) => {
        const isRepeat = faq.repeatKeyword !== false;
        
        faqAdminContainer.innerHTML += `
            <div id="faq-card-${fIdx}" class="bg-slate-900 p-3.5 rounded-xl border border-slate-700 text-xs space-y-2.5 shadow-md transition">
                <div class="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span class="font-bold text-amber-300 flex items-center gap-1.5">
                        <span>🔒</span> # Ingatan AI No. ${fIdx + 1}
                    </span>
                    <div class="flex items-center gap-1.5">
                        <button type="button" onclick="toggleEditFaqCard(${fIdx})" id="btn-lock-${fIdx}" class="bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer border border-slate-600">
                            🔓 Buka Edit
                        </button>
                        <button type="button" onclick="deleteKnowledgeFaq(${fIdx})" class="text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded-lg bg-rose-950/40 border border-rose-900/50 cursor-pointer text-[10px]">
                            🗑️ Hapus
                        </button>
                    </div>
                </div>

                <!-- Form Terkunci Default -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 opacity-75" id="form-body-${fIdx}">
                    <div>
                        <label class="block text-[10px] text-slate-400 mb-0.5">Kata Tambahan Awal:</label>
                        <input type="text" id="edit-faq-prefix-${fIdx}" value="${faq.prefix || ''}" disabled class="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 outline-none cursor-not-allowed">
                    </div>
                    <div>
                        <label class="block text-[10px] text-slate-400 mb-0.5">Kata Kunci:</label>
                        <input type="text" id="edit-faq-kw-${fIdx}" value="${faq.keyword || ''}" disabled class="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-amber-200/80 font-bold outline-none cursor-not-allowed">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-[10px] text-slate-400 mb-0.5">Kata Tambahan Akhir / Jawaban:</label>
                        <textarea id="edit-faq-suffix-${fIdx}" rows="2" disabled class="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 outline-none text-xs cursor-not-allowed">${faq.suffix || ''}</textarea>
                    </div>
                    <div class="sm:col-span-2 flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span class="text-[11px] text-slate-400">Ulangi Kata Kunci di Jawaban?</span>
                        <select id="edit-faq-repeat-${fIdx}" disabled class="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-400 font-semibold outline-none cursor-not-allowed">
                            <option value="false" ${!isRepeat ? 'selected' : ''}>Tidak (Natural)</option>
                            <option value="true" ${isRepeat ? 'selected' : ''}>Ya (Diulang)</option>
                        </select>
                    </div>
                </div>

                <!-- Tombol Simpan Manual (Muncul pas Buka Edit diklik) -->
                <div id="save-btn-box-${fIdx}" class="hidden pt-1">
                    <button type="button" onclick="saveEditedFaq(${fIdx})" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow transition active:scale-95 flex items-center justify-center gap-1.5">
                        <span>💾</span> Simpan & Kunci Kembali No. ${fIdx + 1}
                    </button>
                </div>
            </div>`;
    });
}

// Toggle Buka/Kunci Kartu Edit
function toggleEditFaqCard(fIdx) {
    const formBody = document.getElementById(`form-body-${fIdx}`);
    const saveBox = document.getElementById(`save-btn-box-${fIdx}`);
    const btnLock = document.getElementById(`btn-lock-${fIdx}`);
    const card = document.getElementById(`faq-card-${fIdx}`);

    const isLocked = formBody.classList.contains('opacity-75');

    const prefixInput = document.getElementById(`edit-faq-prefix-${fIdx}`);
    const kwInput = document.getElementById(`edit-faq-kw-${fIdx}`);
    const suffixInput = document.getElementById(`edit-faq-suffix-${fIdx}`);
    const repeatSelect = document.getElementById(`edit-faq-repeat-${fIdx}`);

    if (isLocked) {
        formBody.classList.remove('opacity-75', 'cursor-not-allowed');
        saveBox.classList.remove('hidden');
        btnLock.innerHTML = "🔒 Tutup / Kunci";
        btnLock.className = "bg-amber-600 hover:bg-amber-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer border border-amber-500 shadow";
        card.classList.add('border-emerald-500/60', 'bg-slate-950/80');

        prefixInput.disabled = false;
        kwInput.disabled = false;
        suffixInput.disabled = false;
        repeatSelect.disabled = false;

        prefixInput.classList.remove('cursor-not-allowed', 'bg-slate-950', 'text-slate-300');
        kwInput.classList.remove('cursor-not-allowed', 'bg-slate-950');
        suffixInput.classList.remove('cursor-not-allowed', 'bg-slate-950', 'text-slate-300');
        repeatSelect.classList.remove('cursor-not-allowed', 'bg-slate-900', 'text-slate-400');
        
        prefixInput.classList.add('bg-slate-900', 'text-white');
        kwInput.classList.add('bg-slate-900', 'text-amber-300');
        suffixInput.classList.add('bg-slate-900', 'text-white');
        repeatSelect.classList.add('bg-slate-900', 'text-amber-400');
    } else {
        renderKnowledgeFaqAdmin();
    }
}

// Simpan Perubahan Editan (Hanya saat Tombol Simpan diklik)
function saveEditedFaq(fIdx) {
    if (!window.knowledgeFaq || !window.knowledgeFaq[fIdx]) return;

    const rawPrefix = document.getElementById(`edit-faq-prefix-${fIdx}`).value;
    const rawKw = document.getElementById(`edit-faq-kw-${fIdx}`).value;
    const rawSuffix = document.getElementById(`edit-faq-suffix-${fIdx}`).value;
    const repeatVal = document.getElementById(`edit-faq-repeat-${fIdx}`).value === 'true';

    const kwVal = cleanTrailingComma(rawKw);
    const suffixVal = cleanTrailingComma(rawSuffix);
    const prefixVal = cleanTrailingComma(rawPrefix);

    if (!kwVal || !suffixVal) {
        alert("Kata Kunci dan Jawaban tidak boleh kosong, Bosku!");
        return;
    }

    window.knowledgeFaq[fIdx].prefix = prefixVal;
    window.knowledgeFaq[fIdx].keyword = kwVal;
    window.knowledgeFaq[fIdx].suffix = suffixVal;
    window.knowledgeFaq[fIdx].repeatKeyword = repeatVal;

    try {
        localStorage.setItem('ilham_knowledgeFaq', JSON.stringify(window.knowledgeFaq));
    } catch(e) {
        alert("Gagal simpan! Periksa karakter tulisan.");
        return;
    }

    window.isManualUpdating = true;
    if (typeof saveToCloud === 'function') {
        saveToCloud().then(() => {
            setTimeout(() => { window.isManualUpdating = false; }, 1000);
        });
    }

    alert(`✅ Ingatan No. ${fIdx + 1} berhasil disimpan permanen!`);
    renderKnowledgeFaqAdmin();
}

// ==========================================
// FUNGSI TAMBAH INGATAN AI BARU
// ==========================================
function addKnowledgeFaq() {
    const rawPrefix = document.getElementById('new-faq-prefix')?.value || "Baik";
    const rawKeyword = document.getElementById('new-faq-keyword')?.value;
    const rawSuffix = document.getElementById('new-faq-suffix')?.value;
    
    const keyword = cleanTrailingComma(rawKeyword);
    const suffix = cleanTrailingComma(rawSuffix);
    const prefix = cleanTrailingComma(rawPrefix);

    if(!keyword || !suffix) {
        alert("Keyword dan Jawaban wajib diisi, Bosku!");
        return;
    }
    
    if (!window.knowledgeFaq) window.knowledgeFaq = [];
    
    // Tambah data baru ke memori global
    window.knowledgeFaq.push({
        id: "kb-" + Date.now(),
        prefix: prefix,
        keyword: keyword,
        suffix: suffix,
        repeatKeyword: false
    });
    
    // Simpan ke localStorage
    try {
        localStorage.setItem('ilham_knowledgeFaq', JSON.stringify(window.knowledgeFaq));
    } catch(e) {
        console.error("Gagal simpan ke localStorage:", e);
    }
    
    // Sinkronisasi Real-Time ke Cloud Firebase agar semua HP customer ikut terupdate
    window.isManualUpdating = true;
    if (typeof saveToCloud === 'function') {
        saveToCloud().then(() => {
            setTimeout(() => { window.isManualUpdating = false; }, 1000);
        });
    }
    
    // Reset input form tambah FAQ
    if(document.getElementById('new-faq-prefix')) document.getElementById('new-faq-prefix').value = '';
    if(document.getElementById('new-faq-keyword')) document.getElementById('new-faq-keyword').value = '';
    if(document.getElementById('new-faq-suffix')) document.getElementById('new-faq-suffix').value = '';
    
    // Refresh tampilan admin
    if (typeof renderKnowledgeFaqAdmin === 'function') {
        renderKnowledgeFaqAdmin();
    }
    if (typeof renderAdminPanel === 'function') {
        renderAdminPanel();
    }
    
    alert("Ingatan AI baru berhasil disimpan dan disinkronkan ke semua perangkat secara real-time! 🚀");
}

// ==========================================
// FUNGSI PROMOTE LOG KE FAQ (BERSIH & TUNGGAL)
// ==========================================
function promoteLogToFaq(queryText, lIdx) {
    if (!window.knowledgeFaq) window.knowledgeFaq = [];
    
    window.knowledgeFaq.push({
        id: "kb-" + Date.now(),
        prefix: "Baik, mengenai",
        keyword: cleanTrailingComma(queryText),
        suffix: `Informasi terkait "${queryText}" akan segera kami layani dengan maksimal di workshop ILHAM SPUNBOND`,
        repeatKeyword: true
    });

    // Simpan perubahan ke local storage
    try {
        localStorage.setItem('ilham_knowledgeFaq', JSON.stringify(window.knowledgeFaq));
    } catch(e) {}

    // Sinkronisasi Real-Time ke Cloud Firebase
    window.isManualUpdating = true;
    if (typeof saveToCloud === 'function') {
        saveToCloud().then(() => {
            setTimeout(() => { window.isManualUpdating = false; }, 1000);
        });
    }

    deleteSingleUnansweredLog(lIdx);

    // Refresh tampilan admin
    if (typeof renderKnowledgeFaqAdmin === 'function') {
        renderKnowledgeFaqAdmin();
    }
    if (typeof renderAdminPanel === 'function') {
        renderAdminPanel();
    }

    alert(`Pertanyaan "${queryText}" berhasil dipromosikan menjadi Ingatan AI permanen & disinkronkan! ✨`);
}
function promoteLogToFaq(queryText, lIdx) {
    window.knowledgeFaq.push({
        id: "kb-" + Date.now(),
        prefix: "Baik, mengenai",
        keyword: cleanTrailingComma(queryText),
        suffix: `Informasi terkait "${queryText}" akan segera kami layani dengan maksimal di workshop ILHAM SPUNBOND`,
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

console.log("✅ ai-knowledge.js lengkap dengan sistem kunci otomatis & auto-save aman dimuat.");
