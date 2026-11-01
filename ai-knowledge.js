// ==========================================
// 1. DATA ARRAY INGATAN AI & FILTER KATA
// ==========================================
let knowledgeFaq = [
    { prefix: "Waalaikumussalam", keyword: "assalamualaikum", suffix: "Massyaallah bagaimana kabarnya? Ada yg bisa saya bantu untuk cara pemesanan atau rekomendasi tas spunbond yg sesuai kebutuhan?", repeatKeyword: false },
    { prefix: "terkait", keyword: "minimal order", suffix: "untuk pemesanan custom tas spunbond minimal order sangat terjangkau bosku, siap kami layani!", repeatKeyword: true },
    { prefix: "mengenai", keyword: "alamat", suffix: "lokasi workshop kami ada di Taman Raya Rajeg Blok-K10 No.06, Tangerang-Banten.", repeatKeyword: true },
    { prefix: "perihal", keyword: "ongkir", suffix: "soal pengiriman, kabar baiknya untuk ke seluruh wilayah Pulau Jawa free ongkir!", repeatKeyword: true },
    { prefix: "Pilihan jumlah pesanan yang sangat pas untuk kebutuhan acara,", keyword: "500", suffix: "Untuk cetak sablon dengan jumlah 500 pcs, estimasi waktu proses pengerjaannya adalah 3 hari terhitung dari turun PO sampai siap dikirim. Namun jika memilih cetak DTF dengan jumlah tersebut, disarankan untuk koordinasi dan chat langsung dengan owner Ilham Spunbond terlebih dahulu supaya jadwalnya bisa disesuaikan dengan baik dan tidak terkejar deadline waktu. Mau langsung dibantu lanjut ke proses desainnya, Bosku?", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },
    { prefix: "", keyword: "", suffix: "", repeatKeyword: true },


    
];

let blockedWords = ["anjing", "asu", "bangsat", "tolol", "goblok", "kampret", "keparat"];
let unansweredLogs = [];

// ==========================================
// 2. FUNGSI SUARA & UCAPAN AI (SPEECH)
// ==========================================
function stopAiSpeech() {
    if('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
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
    let safeTitle = (customerProfile.title && customerProfile.title !== "undefined") ? customerProfile.title : "Bosku";
    let safeName = (customerProfile.name && customerProfile.name !== "undefined") ? customerProfile.name : "Rojak";
    const greeting = `Halo ${safeTitle} ${safeName}. Saya asisten AI pintar ILHAM SPUNBOND. Saya sudah membaca seluruh database model tas, harga, dan ingatan terbaru Anda. Ada yang ingin ditanyakan?`;
    appendChat("ai", greeting);
    speakText(greeting);
}

// ==========================================
// 3. FUNGSI UTAMA PENCARIAN & REKOMENDASI AI
// ==========================================
function askAiRecommendation() {
    stopAiSpeech();
    const queryInput = document.getElementById('ai-user-query');
    const rawQuery = queryInput.value.trim();
    const queryText = rawQuery.toLowerCase();
    if(!queryText) return alert("Silakan ketik pertanyaan atau konsultasi Anda terlebih dahulu.");

    appendChat("user", rawQuery);
    queryInput.value = "";

    let safeTitle = (customerProfile.title && customerProfile.title !== "undefined") ? customerProfile.title : "Bosku";
    let safeName = (customerProfile.name && customerProfile.name !== "undefined") ? customerProfile.name : "Rojak";
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

    // Cek di Knowledge FAQ
    let matchedFaq = knowledgeFaq.find(f => {
        const keywordLower = (f.keyword || "").toLowerCase().trim();
        return keywordLower && (queryText === keywordLower || queryText.includes(keywordLower) || queryWords.includes(keywordLower));
    });

    if(matchedFaq) {
        let prefixPart = matchedFaq.prefix ? matchedFaq.prefix + " " : "";
        let repeatKwd = matchedFaq.repeatKeyword === true ? `${matchedFaq.keyword} ` : "";
        finalAiResponse = `${prefixPart}${userPrefixName}${repeatKwd}${matchedFaq.suffix}`;
    } else {
        let foundSpecificBag = false;

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
                    finalAiResponse = `${userPrefixName}untuk model *${model.name}* ukuran *${sizeObj.name}*, harganya adalah *Rp ${sizeObj.price.toLocaleString('id-ID')}* per pcs. Catatan & kegunaan: ${sizeObj.note}. Kualitas dijamin mantap dan siap diproses bosku!`;

                    document.getElementById('bag-model-select').value = mIdx;
                    updateCustomerSizesDropdown();
                    document.getElementById('bag-size-select').value = sizeObj.name;
                    updateSizeLabel();
                    foundSpecificBag = true;
                    break;
                }
            }
            if(foundSpecificBag) break;
        }

        if(!foundSpecificBag) {
            for(let mIdx = 0; mIdx < bagModels.length; mIdx++) {
                let model = bagModels[mIdx];
                if(queryText.includes(model.name.toLowerCase()) || queryWords.some(w => model.name.toLowerCase().includes(w))) {
                    let sizeListStr = model.sizes.map(s => `${s.name} (Rp ${s.price.toLocaleString('id-ID')})`).join(', ');
                    finalAiResponse = `${userPrefixName}mengenai *${model.name}*, kami punya beberapa pilihan ukuran lengkap: ${sizeListStr}. Silakan pilih ukuran yang pas di form atas ya Bosku!`;

                    document.getElementById('bag-model-select').value = mIdx;
                    updateCustomerSizesDropdown();
                    foundSpecificBag = true;
                    break;
                }
            }
        }

        if(!foundSpecificBag) {
            if(queryText.includes("harga") || queryText.includes("list") || queryText.includes("katalog") || queryText.includes("menu")) {
                let summaryCatalog = bagModels.map(m => `${m.name} (mulai Rp ${m.sizes[0]?.price.toLocaleString('id-ID')})`).join(', ');
                finalAiResponse = `${userPrefixName}kami menyediakan berbagai model tas custom berkualitas tinggi: ${summaryCatalog}. Silakan pilih model dan ukurannya langsung di menu form pemesanan di atas ya!`;
            } else if(queryText.includes("alamat") || queryText.includes("lokasi") || queryText.includes("toko") || queryText.includes("workshop")) {
                finalAiResponse = `${userPrefixName}workshop pusat kami berlokasi di ${storeAddress}. Silakan mampir atau order langsung via online!`;
            } else if(queryText.includes("kontak") || queryText.includes("owner") || queryText.includes("admin") || queryText.includes("wa")) {
                finalAiResponse = `${userPrefixName}bisa langsung hubungi nomor WhatsApp resmi kami di ${storePhone} atau klik tombol kirim pesanan ke owner di bawah ya.`;
            } else {
                if(!unansweredLogs.includes(rawQuery)) {
                    unansweredLogs.push(rawQuery);
                    saveToCloud();
                }
                const generalPitches = [
                    `Tentu ${userPrefixName}di ILHAM SPUNBOND semua pesanan custom tas bisa diatur mulai dari sablon manual 1-2 warna sampai DTF full color. Mau dibantu hitungkan estimasi harga untuk jumlah berapa pcs?`,
                    `Siap ${userPrefixName}semua spesifikasi tas, ukuran, dan pilihan warna kain sudah lengkap di aplikasi ini. Ada model tas khusus yang sedang Kakak cari?`,
                    `Baik ${userPrefixName}untuk hasil sablon dijamin rapi, kain tebal murni 75GSM, dan khusus Pulau Jawa gratis ongkir! Ada detail pesanan yang ingin kita diskusikan?`
                ];
                finalAiResponse = generalPitches[Math.floor(Math.random() * generalPitches.length)];
            }
        }
    }

    appendChat("ai", finalAiResponse);
    speakText(finalAiResponse);
}

// ==========================================
// 4. FUNGSI VOICE INPUT (MICROPHONE)
// ==========================================
function toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return alert("Browser Anda tidak mendukung fitur input suara. Silakan ketik manual.");
    }
    stopAiSpeech();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = true;

    const micBtn = document.getElementById('mic-btn');
    const queryInput = document.getElementById('ai-user-query');

    micBtn.textContent = "🎙️";
    micBtn.classList.replace('bg-amber-500', 'bg-rose-600');

    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript) {
            const existingText = queryInput.value.trim();
            queryInput.value = existingText ? existingText + " " + finalTranscript : finalTranscript;
        } else if (interimTranscript) {
            queryInput.placeholder = interimTranscript;
        }
    };

    recognition.onerror = () => { 
        micBtn.textContent = "🎤"; 
        micBtn.classList.replace('bg-rose-600', 'bg-amber-500'); 
    };
    recognition.onend = () => { 
        micBtn.textContent = "🎤"; 
        micBtn.classList.replace('bg-rose-600', 'bg-amber-500');
        if(queryInput.value.trim() !== "") {
            askAiRecommendation();
        }
    };
    recognition.start();
}

// ==========================================
// 5. FUNGSI MANAJEMEN INGATAN AI (ADMIN)
// ==========================================
async function addKnowledgeFaq() {
    const prefix = document.getElementById('new-faq-prefix').value.trim();
    const keyword = document.getElementById('new-faq-keyword').value.trim().toLowerCase();
    const suffix = document.getElementById('new-faq-suffix').value.trim();
    const repeatKeyword = document.getElementById('new-faq-repeat').value === "true";

    if(!keyword || !suffix) return alert("Harap isi Kata Kunci dan Jawaban dengan lengkap!");

    knowledgeFaq.push({ prefix, keyword, suffix, repeatKeyword });

    document.getElementById('new-faq-prefix').value = "";
    document.getElementById('new-faq-keyword').value = "";
    document.getElementById('new-faq-suffix').value = "";

    renderAdminPanel();

    isSyncingFromCloud = true;
    await saveToCloud();
    setTimeout(() => { isSyncingFromCloud = false; }, 1200);

    alert(`Ingatan AI No. ${knowledgeFaq.length} berhasil disimpan permanen!`);
}

function updateFaqField(idx, fieldName) {
    if(fieldName === 'prefix') {
        const val = document.getElementById(`edit-faq-prefix-${idx}`).value;
        if(knowledgeFaq[idx]) knowledgeFaq[idx].prefix = val;
    } else if(fieldName === 'keyword') {
        const val = document.getElementById(`edit-faq-kw-${idx}`).value.trim().toLowerCase();
        if(knowledgeFaq[idx]) knowledgeFaq[idx].keyword = val;
    } else if(fieldName === 'suffix') {
        const val = document.getElementById(`edit-faq-suffix-${idx}`).value;
        if(knowledgeFaq[idx]) knowledgeFaq[idx].suffix = val;
    }
    saveToCloud();
}

function updateFaqRepeat(idx) {
    const selectEl = document.getElementById(`edit-faq-repeat-${idx}`);
    if(selectEl && knowledgeFaq[idx]) {
        knowledgeFaq[idx].repeatKeyword = selectEl.value === "true";
        saveToCloud();
    }
}

async function deleteKnowledgeFaq(idx) {
    knowledgeFaq.splice(idx, 1);
    isSyncingFromCloud = true;
    await saveToCloud();
    setTimeout(() => { isSyncingFromCloud = false; }, 1200);
    renderAdminPanel();
}

function addBlockedWord() {
    const word = document.getElementById('new-blocked-word').value.trim().toLowerCase();
    if(!word) return alert("Masukkan kata terlarang terlebih dahulu!");
    if(!blockedWords.includes(word)) {
        blockedWords.push(word);
        document.getElementById('new-blocked-word').value = "";
        saveToCloud();
        renderAdminPanel();
        alert("Kata terlarang berhasil ditambahkan!");
    } else {
        alert("Kata tersebut sudah ada dalam daftar terlarang.");
    }
}

function deleteBlockedWord(idx) {
    blockedWords.splice(idx, 1);
    saveToCloud();
    renderAdminPanel();
}

function promoteLogToFaq(logText, logIdx) {
    const prefix = prompt(`Masukkan Kata Tambahan Awal untuk pertanyaan: "${logText}"`, "ngomongin soal");
    const suffix = prompt(`Masukkan Kata Tambahan Akhir / Jawaban untuk pertanyaan: "${logText}"`);
    if(prefix !== null && suffix) {
        knowledgeFaq.push({ prefix: prefix.trim(), keyword: logText.toLowerCase().trim(), suffix: suffix.trim(), repeatKeyword: true });
        unansweredLogs.splice(logIdx, 1);
        isSyncingFromCloud = true;
        saveToCloud().then(() => {
            setTimeout(() => { isSyncingFromCloud = false; }, 1200);
        });
        renderAdminPanel();
        alert("Pertanyaan berhasil dipromosikan jadi ingatan tetap AI!");
    }
}

function deleteSingleUnansweredLog(idx) {
    unansweredLogs.splice(idx, 1);
    saveToCloud();
    renderAdminPanel();
}

function clearAllUnansweredLogs() {
    if(confirm("Bersihkan semua log pertanyaan belum terjawab?")) {
        unansweredLogs = [];
        saveToCloud();
        renderAdminPanel();
    }
}
