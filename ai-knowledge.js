// ==========================================
// KNOWLEDGE BASE & AI ENGINE (ai-knowledge.js)
// ==========================================

let defaultKnowledgeFaq = [
    { prefix: "Waalaikumussalam", keyword: "assalamualaikum", suffix: "Massyaallah bagaimana kabarnya? Ada yg bisa saya bantu untuk cara pemesanan atau rekomendasi tas spunbond yg sesuai kebutuhan?", repeatKeyword: false },
    { prefix: "terkait", keyword: "minimal order", suffix: "untuk pemesanan custom tas spunbond minimal order sangat terjangkau bosku, siap kami layani!", repeatKeyword: true },
    { prefix: "mengenai", keyword: "alamat", suffix: "lokasi workshop kami ada di Taman Raya Rajeg Blok-K10 No.06, Tangerang-Banten.", repeatKeyword: true },
    { prefix: "perihal", keyword: "ongkir", suffix: "soal pengiriman, kabar baiknya untuk ke seluruh wilayah Pulau Jawa free ongkir!", repeatKeyword: true },
    { prefix: "Pilihan jumlah pesanan yang sangat pas untuk kebutuhan acara,", keyword: "500", suffix: "Untuk cetak sablon dengan jumlah 500 pcs, estimasi waktu proses pengerjaannya adalah 3 hari terhitung dari turun PO sampai siap dikirim. Namun jika memilih cetak DTF dengan jumlah tersebut, disarankan untuk koordinasi dan chat langsung dengan owner Ilham Spunbond terlebih dahulu supaya jadwalnya bisa disesuaikan dengan baik dan tidak terkejar deadline waktu. Mau langsung dibantu lanjut ke proses desainnya, Bosku?", repeatKeyword: true }
];

let knowledgeFaq = JSON.parse(localStorage.getItem("ilham_knowledgeFaq")) || defaultKnowledgeFaq;
let blockedWords = JSON.parse(localStorage.getItem("ilham_blockedWords")) || ["anjing", "asu", "bangsat", "tolol", "goblok", "kampret", "keparat"];
let unansweredLogs = JSON.parse(localStorage.getItem("ilham_unansweredLogs")) || [];

// 🎙️ FITUR SUARA (SPEECH)
function stopAiSpeech() {
    if('speechSynthesis' in window) { window.speechSynthesis.cancel(); }
}

function speakText(text) {
    if('speechSynthesis' in window) {
        stopAiSpeech();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

function speakAiGreeting() {
    let safeTitle = (customerProfile && customerProfile.title) ? customerProfile.title : "Bosku";
    let safeName = (customerProfile && customerProfile.name) ? customerProfile.name : "Rojak";
    const greeting = `Halo ${safeTitle} ${safeName}. Saya asisten AI pintar ILHAM SPUNBOND. Saya sudah membaca seluruh database model tas, harga, dan ingatan terbaru Anda. Ada yang ingin ditanyakan?`;
    appendChat("ai", greeting);
    speakText(greeting);
}

// 🤖 PENCARIAN & REKOMENDASI AI
function askAiRecommendation() {
    stopAiSpeech();
    const queryInput = document.getElementById('ai-user-query');
    if(!queryInput) return;
    const rawQuery = queryInput.value.trim();
    const queryText = rawQuery.toLowerCase();
    if(!queryText) return alert("Silakan ketik pertanyaan atau konsultasi Anda terlebih dahulu.");

    appendChat("user", rawQuery);
    queryInput.value = "";

    let safeTitle = (customerProfile && customerProfile.title) ? customerProfile.title : "Bosku";
    let safeName = (customerProfile && customerProfile.name) ? customerProfile.name : "Rojak";
    let userPrefixName = `${safeTitle} ${safeName}, `;

    const queryWords = queryText.split(/\s+/);
    const hasForbiddenWord = blockedWords.some(bw => queryText.includes(bw.toLowerCase()) || queryWords.includes(bw.toLowerCase()));

    if(hasForbiddenWord) {
        const politeResponse = `Mohon maaf, ${userPrefixName}mari kita berbincang dengan lebih santun dan damai ya. Ada hal seputar pemesanan tas spunbond yang bisa saya bantu dengan senang hati?`;
        appendChat("ai", politeResponse);
        speakText(politeResponse);
        return;
    }

    let finalAiResponse = "";
    let matchedFaq = knowledgeFaq.find(f => {
        const keywordLower = (f.keyword || "").toLowerCase().trim();
        if (!keywordLower) return false;
        if (/^\d+$/.test(keywordLower)) {
            return queryText === keywordLower || queryWords.includes(keywordLower);
        }
        return queryText === keywordLower || queryText.includes(keywordLower) || queryWords.includes(keywordLower);
    });

    if(matchedFaq) {
        let prefixPart = matchedFaq.prefix ? matchedFaq.prefix + " " : "";
        let repeatKwd = matchedFaq.repeatKeyword === true ? `${matchedFaq.keyword} ` : "";
        finalAiResponse = `${prefixPart}${userPrefixName}${repeatKwd}${matchedFaq.suffix}`;
    } else {
        let foundSpecificBag = false;
        if(typeof bagModels !== 'undefined') {
            for(let mIdx = 0; mIdx < bagModels.length; mIdx++) {
                let model = bagModels[mIdx];
                let modelNameLower = model.name.toLowerCase();

                for(let sIdx = 0; sIdx < model.sizes.length; sIdx++) {
                    let sizeObj = model.sizes[sIdx];
                    let sizeNameLower = sizeObj.name.toLowerCase();
                    let noteLower = (sizeObj.note || "").toLowerCase();

                    let isModelMatch = queryWords.some(w => modelNameLower.includes(w) || w.includes("oval") || w.includes("hls") || w.includes("hlb") || w.includes("box") || w.includes("tas"));
                    let isSizeMatch = queryText.includes(sizeNameLower) || queryWords.some(w => sizeNameLower.includes(w));
                    let isKeywordMatch = queryWords.some(w => noteLower.includes(w) || w.includes("harga") || w.includes("beli") || w.includes("pesan") || w.includes("kegunaan") || w.includes("untuk"));

                    if(isSizeMatch || (isModelMatch && isKeywordMatch) || queryText.includes(modelNameLower)) {
                        finalAiResponse = `${userPrefixName}untuk model *${model.name}* ukuran *${sizeObj.name}*, harganya adalah *Rp ${sizeObj.price.toLocaleString('id-ID')}* per pcs. Catatan: ${sizeObj.note}. Siap diproses bosku!`;
                        
                        document.getElementById('bag-model-select').value = mIdx;
                        if(typeof updateCustomerSizesDropdown === 'function') updateCustomerSizesDropdown();
                        document.getElementById('bag-size-select').value = sizeObj.name;
                        if(typeof updateSizeLabel === 'function') updateSizeLabel();
                        
                        foundSpecificBag = true;
                        break;
                    }
                }
                if(foundSpecificBag) break;
            }
        }

        if(!foundSpecificBag) {
            if(queryText.includes("harga") || queryText.includes("list") || queryText.includes("katalog")) {
                finalAiResponse = `${userPrefixName}kami menyediakan berbagai model tas custom berkualitas tinggi. Silakan pilih model dan ukurannya langsung di menu form pemesanan di atas ya!`;
            } else if(queryText.includes("alamat") || queryText.includes("lokasi") || queryText.includes("workshop")) {
                finalAiResponse = `${userPrefixName}workshop pusat kami berlokasi di Taman Raya Rajeg Blok-K10 No.06, Tangerang-Banten.`;
            } else {
                if(!unansweredLogs.includes(rawQuery)) {
                    unansweredLogs.push(rawQuery);
                
                    // 🛡️ Batasi maksimal hanya menyimpan 20 log terbaru agar memori tidak bengkak
                    if (unansweredLogs.length > 20) {
                        unansweredLogs.shift(); 
                    }

                    if(typeof saveToCloud === 'function') saveToCloud();
                }
                finalAiResponse = `Tentu ${userPrefixName}di ILHAM SPUNBOND semua pesanan custom tas bisa diatur mulai dari sablon manual sampai DTF full color. Mau dibantu hitungkan estimasi harga?`;
            }
                    if(typeof saveToCloud === 'function') saveToCloud();
                }
                finalAiResponse = `Tentu ${userPrefixName}di ILHAM SPUNBOND semua pesanan custom tas bisa diatur mulai dari sablon manual sampai DTF full color. Mau dibantu hitungkan estimasi harga?`;
            }
        }
    }

    appendChat("ai", finalAiResponse);
    speakText(finalAiResponse);
}

// 🎤 VOICE INPUT (MICROPHONE)
function toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return alert("Browser Anda tidak mendukung fitur input suara.");
    }
    stopAiSpeech();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;

    const micBtn = document.getElementById('mic-btn');
    const queryInput = document.getElementById('ai-user-query');

    micBtn.textContent = "🎙️";
    micBtn.classList.replace('bg-amber-500', 'bg-rose-600');

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        queryInput.value = queryInput.value ? queryInput.value + " " + transcript : transcript;
    };
    recognition.onerror = () => { micBtn.textContent = "🎤"; micBtn.classList.replace('bg-rose-600', 'bg-amber-500'); };
    recognition.onend = () => {
        micBtn.textContent = "🎤";
        micBtn.classList.replace('bg-rose-600', 'bg-amber-500');
        if(queryInput.value.trim() !== "") askAiRecommendation();
    };
    recognition.start();
}

// ADMIN INGATAN AI (BERTAMBAH OTOMATIS & PERMANEN REAL-TIME)
async function addKnowledgeFaq() {
    const prefix = document.getElementById('new-faq-prefix').value.trim();
    const keyword = document.getElementById('new-faq-keyword').value.trim().toLowerCase();
    const suffix = document.getElementById('new-faq-suffix').value.trim();
    const repeatKeyword = document.getElementById('new-faq-repeat').value === "true";

    if(!keyword || !suffix) return alert("Harap isi Kata Kunci dan Jawaban!");
    
    // Kunci sinkronisasi agar tidak mental saat kirim ke cloud
    isSyncingFromCloud = true;

    // 1. Tambahkan ke array lokal
    knowledgeFaq.push({ prefix, keyword, suffix, repeatKeyword });

    // 2. Kosongkan form input
    document.getElementById('new-faq-prefix').value = "";
    document.getElementById('new-faq-keyword').value = "";
    document.getElementById('new-faq-suffix').value = "";

    // 3. Render ulang panel agar nomor langsung update
    if (typeof renderAdminPanel === 'function') {
        renderAdminPanel();
    }

    // 4. Simpan permanen ke LocalStorage & Cloud Firebase
    if (typeof saveToCloud === 'function') {
        await saveToCloud();
    }
    
    // Buka kembali kunci sinkronisasi setelah 1 detik
    setTimeout(() => {
        isSyncingFromCloud = false;
    }, 1000);

    alert("Ingatan AI baru berhasil ditambahkan dan disimpan permanen!");
}

function updateFaqField(idx, fieldName) {
    if(fieldName === 'prefix') knowledgeFaq[idx].prefix = document.getElementById(`edit-faq-prefix-${idx}`).value;
    if(fieldName === 'keyword') knowledgeFaq[idx].keyword = document.getElementById(`edit-faq-kw-${idx}`).value.trim().toLowerCase();
    if(fieldName === 'suffix') knowledgeFaq[idx].suffix = document.getElementById(`edit-faq-suffix-${idx}`).value;
    if(typeof saveToCloud === 'function') saveToCloud();
}

function updateFaqRepeat(idx) {
    const selectEl = document.getElementById(`edit-faq-repeat-${idx}`);
    if(selectEl && knowledgeFaq[idx]) {
        knowledgeFaq[idx].repeatKeyword = selectEl.value === "true";
        if(typeof saveToCloud === 'function') saveToCloud();
    }
}

async function deleteKnowledgeFaq(idx) {
    if(confirm("Hapus ingatan AI ini?")) {
        knowledgeFaq.splice(idx, 1);
        if (typeof saveToCloud === 'function') await saveToCloud();
        if (typeof renderAdminPanel === 'function') renderAdminPanel();
    }
}

function promoteLogToFaq(logText, logIdx) {
    knowledgeFaq.push({
        prefix: "Terkait pertanyaan",
        keyword: logText.toLowerCase(),
        suffix: "siap kami layani dan kerjakan sesuai kebutuhan custom Kakak di Ilham Spunbond!",
        repeatKeyword: true
    });
    unansweredLogs.splice(logIdx, 1);
    if(typeof saveToCloud === 'function') saveToCloud();
    if(typeof renderAdminPanel === 'function') renderAdminPanel();
    alert("Log pertanyaan berhasil dipromosikan menjadi Ingatan AI baru!");
}

function deleteSingleUnansweredLog(logIdx) {
    unansweredLogs.splice(logIdx, 1);
    if(typeof saveToCloud === 'function') saveToCloud();
    if(typeof renderAdminPanel === 'function') renderAdminPanel();
}

function addBlockedWord() {
    const word = document.getElementById('new-blocked-word').value.trim().toLowerCase();
    if(!word) return;
    if(!blockedWords.includes(word)) {
        blockedWords.push(word);
        document.getElementById('new-blocked-word').value = "";
        if(typeof saveToCloud === 'function') saveToCloud();
        if (typeof renderAdminPanel === 'function') renderAdminPanel();
    }
}

function deleteBlockedWord(idx) {
    blockedWords.splice(idx, 1);
    if(typeof saveToCloud === 'function') saveToCloud();
    if (typeof renderAdminPanel === 'function') renderAdminPanel();
}

// ==========================================
// PEMBERSIH LOG PERTANYAAN TERTINGGAL
// ==========================================
async function clearAllUnansweredLogs() {
    if(confirm("Hapus semua daftar log pertanyaan customer yang menumpuk?")) {
        unansweredLogs = [];
        if(typeof saveToCloud === 'function') await saveToCloud();
        if(typeof renderAdminPanel === 'function') renderAdminPanel();
        alert("Semua log pertanyaan tertinggal berhasil dibersihkan! Panel AI kembali ringan.");
    }
}
