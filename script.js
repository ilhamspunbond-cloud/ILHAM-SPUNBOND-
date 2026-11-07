// ==========================================
// 1. DATA DEFAULT GLOBAL & INISIALISASI (API CONFIG)
// ==========================================

let rajaOngkirApiKey = "hoNQDKZPebfe35ddf393f5dbZu7xVaWZ";
let paymentApiKey = "bZHmdIPnebfe35ddf393f5dbXpvCtSa8";
let qrislyApiKey = "bZHmdIPnebfe35ddf393f5dbXpvCtSa8";
let originCityId = "444"; // Default Kota Asal Pengiriman (Tangerang)

// Load dari localStorage jika tersedia
try {
    if(localStorage.getItem('ilham_rajaOngkirKey')) rajaOngkirApiKey = localStorage.getItem('ilham_rajaOngkirKey');
    if(localStorage.getItem('ilham_paymentApiKey')) paymentApiKey = localStorage.getItem('ilham_paymentApiKey');
    if(localStorage.getItem('ilham_qrislyApiKey')) qrislyApiKey = localStorage.getItem('ilham_qrislyApiKey');
    if(localStorage.getItem('ilham_originCityId')) originCityId = localStorage.getItem('ilham_originCityId');
} catch(e) {
    console.error("Local storage error:", e);
}

const cleanDefaultBagSvg = "data:application/octet-stream;base64,PHN2Zz48L3N2Zz4=";

// Pengaturan Global Toko & Logistik
let storeName = "ILHAM SPUNBOND";
let storeAddress = "WISMA MAS BLOK G2 NO 10, Tangerang-Banten";
let storePhone = "0896 3053 9563";
let storeEmail = "ilhamspunbond@gmail.com";
let pdfPassword = "ilham123";
let ownerWaNumber = "6289630539563";
let extraColorPrice = 400;
let currentAdminEventDiscount = 0;

let brandLogoUrl = "";
let customStampUrl = "";
let adminSignatureUrl = "";

const defaultBagModels = [
    { 
        name: "Tas Spunbond Oval", 
        image: "https://via.placeholder.com/400x500/ffffff/334155?text=Tas+Oval", 
        sizes: [
            { name: "20 x 30 cm", price: 1400, weight: 30, note: "Pas untuk brosur, dokumen, souvenir kecil, dan aksesoris ringan." }, 
            { name: "25 x 35 cm", price: 1550, weight: 40, note: "Ideal untuk dus nasi ukuran sedang atau baju kaos distro." }, 
            { name: "30 x 40 cm", price: 2300, weight: 55, note: "Cocok untuk tas belanja toko baju, map besar, dan pameran." }
        ] 
    },
    { 
        name: "Tas HLS (Handle Lipat Samping)", 
        image: "https://via.placeholder.com/400x500/ffffff/334155?text=Tas+HLS", 
        sizes: [
            { name: "20 x 30 x 8 cm", price: 2000, weight: 40, note: "Sangat pas untuk kemasan box HP, kosmetik, atau souvenir kotak." }, 
            { name: "25 x 35 x 10 cm", price: 2500, weight: 55, note: "Cocok untuk tas catering box nasi kuah atau tas toko sepatu anak." },
            { name: "30 x 40 x 10 cm", price: 3000, weight: 75, note: "Ideal untuk tas butik pakaian tebal dan bingkisan sembako." }
        ] 
    },
    { 
        name: "Tas HLB Box (Handle Kotak)", 
        image: "https://via.placeholder.com/400x500/ffffff/334155?text=Tas+HLB+Box", 
        sizes: [
            { name: "25 x 25 x 10 cm", price: 2800, weight: 50, note: "Rekomendasi terbaik untuk dus kue kotak atau box nasi ukuran 20x20 cm." }, 
            { name: "30 x 30 x 12 cm", price: 3400, weight: 70, note: "Pas untuk kotak catering besar atau kue tart hajatan." }
        ] 
    },
    { 
        name: "Tas HLB Kotak", 
        image: "https://via.placeholder.com/400x500/ffffff/334155?text=Tas+HLB+Kotak", 
        sizes: [
            { name: "20 x 20 x 15 cm", price: 2500, weight: 45, note: "Cocok untuk tas kotak bekal makanan atau wadah hampers kecil." }, 
            { name: "30 x 20 x 20 cm", price: 3200, weight: 65, note: "Ideal untuk tas kardus besar, galon mini, atau dus tebal." }
        ] 
    },
    { 
        name: "KARTU NAMA CUSTOM", 
        image: "https://via.placeholder.com/400x500/ffffff/334155?text=Kartu+Nama", 
        sizes: [
            { name: "KARTU NAMA CUSTOM 4BOX", price: 100000, weight: 150, note: "UNTUK MENAMBAH BRANDING USAHAMU." }
        ] 
    }
];

let bagModels = defaultBagModels;
let bankAccounts = [
    { bank: "Mandiri", acc: "1760004889992", owner: "Abdul Rojak" },
    { bank: "SeaBank", acc: "901048993888", owner: "Abdul Rojak" }
];
let bagColors = [
    { name: "Putih Bersih", hex: "#ffffff" },
    { name: "Biru BCA", hex: "#1d4ed8" },
    { name: "Merah", hex: "#dc2626" },
    { name: "Hitam", hex: "#0f172a" },
    { name: "Hijau", hex: "#16a34a" },
    { name: "Toska", hex: "#0d9488" }
];
let inkColors = [
    { name: "Hitam Pekat", hex: "#0f172a" },
    { name: "Putih Bersih", hex: "#ffffff" },
    { name: "Merah Menyala", hex: "#dc2626" },
    { name: "Biru BCA", hex: "#1d4ed8" },
    { name: "Emas / Gold", hex: "#eab308" }
];
let dtfOptions = [{ name: "Sedang (8x8 cm)", price: 2000 }, { name: "Besar (10x10 cm)", price: 3000 }];

let activeBagTint = "#ffffff";
let activeColorName = "Putih Bersih";
let isLogoLocked = false;

let rawCustomerLogoImg1 = null;
let rawCustomerLogoImg2 = null;

let isSyncingFromCloud = false;
let activeOrdersUnsubscribe = null;
let cartItems = [];
let chatHistory = [];

let customerProfile = { title: "Bosku", name: "Rojak", wa: "", address: "" };

function safeLocalStorageSet(key, val) {
    try { localStorage.setItem(key, val); } catch(e) { console.error("Storage error:", e); }
}

// Load dari localStorage jika tersedia
try {
    if(localStorage.getItem('ilham_bagModels')) bagModels = JSON.parse(localStorage.getItem('ilham_bagModels'));
    if(localStorage.getItem('ilham_bankAccounts')) bankAccounts = JSON.parse(localStorage.getItem('ilham_bankAccounts'));
    if(localStorage.getItem('ilham_bagColors')) bagColors = JSON.parse(localStorage.getItem('ilham_bagColors'));
    if(localStorage.getItem('ilham_inkColors')) inkColors = JSON.parse(localStorage.getItem('ilham_inkColors'));
    if(localStorage.getItem('ilham_dtfOptions')) dtfOptions = JSON.parse(localStorage.getItem('ilham_dtfOptions'));
    if(localStorage.getItem('ilham_extraColorPrice')) extraColorPrice = parseInt(localStorage.getItem('ilham_extraColorPrice')) || 400;
    if(localStorage.getItem('ilham_adminEventDiscount')) currentAdminEventDiscount = parseInt(localStorage.getItem('ilham_adminEventDiscount')) || 0;
    if(localStorage.getItem('ilham_originCityId')) originCityId = localStorage.getItem('ilham_originCityId');
    if(localStorage.getItem('ilham_storeName')) storeName = localStorage.getItem('ilham_storeName');
    if(localStorage.getItem('ilham_storeAddress')) storeAddress = localStorage.getItem('ilham_storeAddress');
    if(localStorage.getItem('ilham_storePhone')) storePhone = localStorage.getItem('ilham_storePhone');
    if(localStorage.getItem('ilham_storeEmail')) storeEmail = localStorage.getItem('ilham_storeEmail');
    if(localStorage.getItem('ilham_pdfPassword')) pdfPassword = localStorage.getItem('ilham_pdfPassword');
    if(localStorage.getItem('ilham_ownerWaNumber')) ownerWaNumber = localStorage.getItem('ilham_ownerWaNumber');
    if(localStorage.getItem('ilham_brandLogoUrl')) brandLogoUrl = localStorage.getItem('ilham_brandLogoUrl');
    if(localStorage.getItem('ilham_customStampUrl')) customStampUrl = localStorage.getItem('ilham_customStampUrl');
    if(localStorage.getItem('ilham_adminSignatureUrl')) adminSignatureUrl = localStorage.getItem('ilham_adminSignatureUrl');
    if(localStorage.getItem('ilham_customerProfile')) {
        let savedProf = JSON.parse(localStorage.getItem('ilham_customerProfile'));
        if(savedProf && savedProf.name) customerProfile = savedProf;
    }
    if(localStorage.getItem('ilham_cartItems')) cartItems = JSON.parse(localStorage.getItem('ilham_cartItems'));
    if(localStorage.getItem('ilham_chatHistory')) chatHistory = JSON.parse(localStorage.getItem('ilham_chatHistory'));
} catch(e) {
    console.error("Local storage error:", e);
}

// ==========================================
// 1.5 FIREBASE CLOUD SYNC & SAVE TO CLOUD
// ==========================================
async function saveToCloud() {
    if(isSyncingFromCloud) return;
    try {
        if(window.firebaseDb && window.firebaseDeps) {
            const { doc, setDoc } = window.firebaseDeps;
            await setDoc(doc(window.firebaseDb, "config", "master"), {
                bagModels, bankAccounts, bagColors, inkColors, dtfOptions,
                extraColorPrice, currentAdminEventDiscount, originCityId, storeName, storeAddress,
                storePhone, storeEmail, pdfPassword, ownerWaNumber,
                brandLogoUrl, customStampUrl, adminSignatureUrl,
                knowledgeFaq: typeof knowledgeFaq !== 'undefined' ? knowledgeFaq : [],
                blockedWords: typeof blockedWords !== 'undefined' ? blockedWords : [],
                unansweredLogs: typeof unansweredLogs !== 'undefined' ? unansweredLogs : []
            });
            const syncEl = document.getElementById('sync-status');
            if(syncEl) {
                syncEl.textContent = "☁️ Firebase Synced";
                syncEl.className = "text-[11px] bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full font-medium inline-block shadow-sm";
            }
        }
    } catch(e) {
        console.error("Gagal save ke cloud:", e);
    }
}

window.initCloudSync = function() {
    if(!window.firebaseDb || !window.firebaseDeps) return;
    try {
        const { doc, onSnapshot } = window.firebaseDeps;
        onSnapshot(doc(window.firebaseDb, "config", "master"), (docSnap) => {
            if(docSnap.exists()) {
                applyCloudData(docSnap.data());
            }
        });
    } catch(e) {
        console.error("Gagal init sync:", e);
    }
};

window.onload = function() {
    updateDynamicManifest();
    renderAdminPanel();
    renderChatHistory();
    checkCustomerOnboarding();
    updateLivePricePreview();
    
    const qtyInput = document.getElementById('item-qty');
    if(qtyInput) {
        qtyInput.addEventListener('input', updateLivePricePreview);
    }

    if(window.initCloudSync) { window.initCloudSync(); }
};

function updateDynamicManifest() {
    const manifestLink = document.getElementById('dynamic-manifest');
    if(!manifestLink) return;
    const iconSrc = brandLogoUrl || "https://via.placeholder.com/192x192/065f46/ffffff?text=ILHAM";
    const manifestData = {
        name: "ILHAM SPUNBOND Pro",
        short_name: "ILHAM SPUNBOND",
        start_url: ".",
        display: "standalone",
        background_color: "#f1f5f9",
        theme_color: "#065f46",
        icons: [
            { src: iconSrc, sizes: "192x192", type: "image/png" },
            { src: iconSrc, sizes: "512x512", type: "image/png" }
        ]
    };
    manifestLink.href = "data:application/manifest+json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifestData));
}

function checkCustomerOnboarding() {
    if(!customerProfile.name || !customerProfile.wa) {
        document.getElementById('onboarding-modal').classList.remove('hidden');
    } else {
        updateUIWithProfile();
    }
}

function submitOnboarding() {
    const title = document.getElementById('user-title-select').value || "Bosku";
    const name = document.getElementById('onboard-name').value.trim() || "Rojak";
    const wa = document.getElementById('onboard-wa').value.trim() || "-";
    const address = document.getElementById('onboard-address').value.trim() || "-";
    if(!name || !wa) return alert("Harap isi Nama dan No WhatsApp dengan lengkap!");

    customerProfile = { title, name, wa, address };
    safeLocalStorageSet('ilham_customerProfile', JSON.stringify(customerProfile));
    document.getElementById('onboarding-modal').classList.add('hidden');
    updateUIWithProfile();
    if(typeof speakAiGreeting === 'function') speakAiGreeting();
}

function updateUIWithProfile() {
    if(!customerProfile.name) customerProfile.name = "Rojak";
    if(!customerProfile.title) customerProfile.title = "Bosku";
    const nameEl = document.getElementById('header-profile-name');
    const greetEl = document.getElementById('welcome-greeting-text');
    if(nameEl) nameEl.textContent = customerProfile.name;
    if(greetEl) greetEl.textContent = `Selamat datang, ${customerProfile.title} ${customerProfile.name}! Silakan pilih tas custom Anda.`;
}

function openProfileModal() {
    document.getElementById('edit-user-title').value = customerProfile.title || "Bosku";
    document.getElementById('edit-name').value = customerProfile.name || "";
    document.getElementById('edit-wa').value = customerProfile.wa || "";
    document.getElementById('edit-address').value = customerProfile.address || "";
    document.getElementById('profile-modal').classList.remove('hidden');
}

function closeProfileModal() { document.getElementById('profile-modal').classList.add('hidden'); }

function saveCustomerProfile() {
    customerProfile.title = document.getElementById('edit-user-title').value || "Bosku";
    customerProfile.name = document.getElementById('edit-name').value.trim() || "Rojak";
    customerProfile.wa = document.getElementById('edit-wa').value.trim() || "";
    customerProfile.address = document.getElementById('edit-address').value.trim() || "";
    if(!customerProfile.name || !customerProfile.wa) return alert("Nama dan No WhatsApp wajib diisi!");
    safeLocalStorageSet('ilham_customerProfile', JSON.stringify(customerProfile));
    closeProfileModal();
    updateUIWithProfile();
    alert("Profil berhasil diperbarui!");
}


// ==========================================
// 2. CHAT & AI INTERACTION
// ==========================================
function appendChat(sender, text) {
    chatHistory.push({ sender, text });
    safeLocalStorageSet('ilham_chatHistory', JSON.stringify(chatHistory));
    renderChatHistory();
}

function renderChatHistory() {
    const container = document.getElementById('ai-chat-history-container');
    if(!container) return;
    if(chatHistory.length === 0) {
        container.innerHTML = `<div class="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/60 italic leading-relaxed text-slate-800">🤖 "Halo! Saya langsung tahu semua data model tas, harga, ukuran, sampai ingatan baru yang Kakak input. Silakan tanya apa saja secara bebas!"</div>`;
        return;
    }
    container.innerHTML = '';
    chatHistory.forEach(chat => {
        if(chat.sender === 'user') {
            container.innerHTML += `<div class="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-right text-slate-900 font-medium">🗣️ "${chat.text}"</div>`;
        } else {
            container.innerHTML += `<div class="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/60 italic leading-relaxed text-slate-800">🤖 "${chat.text}"</div>`;
        }
    });
    container.scrollTop = container.scrollHeight;
}

function clearChatHistory() {
    if(confirm("Bersihkan riwayat percakapan?")) {
        chatHistory = [];
        safeLocalStorageSet('ilham_chatHistory', JSON.stringify(chatHistory));
        renderChatHistory();
    }
}

function toggleLockPosition() {
    isLogoLocked = !isLogoLocked;
    const btn = document.getElementById('lock-position-btn');
    const icon = document.getElementById('lock-icon');
    const text = document.getElementById('lock-text');
    const panel = document.getElementById('control-panel-box');
    const panel2 = document.getElementById('controls-logo-2');

    if(isLogoLocked) {
        icon.textContent = "🔒";
        text.textContent = "Terkunci (Klik untuk Buka)";
        btn.className = "bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer";
        panel.style.opacity = "0.4";
        panel.style.pointerEvents = "none";
        if(panel2) { panel2.style.opacity = "0.4"; panel2.style.pointerEvents = "none"; }
    } else {
        icon.textContent = "🔓";
        text.textContent = "Buka Kunci";
        btn.className = "bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer";
        panel.style.opacity = "1";
        panel.style.pointerEvents = "auto";
        if(panel2) { panel2.style.opacity = "1"; panel2.style.pointerEvents = "auto"; }
    }
}


// ==========================================
// 3. ADMIN PANEL & RENDERING
// ==========================================
function renderAdminPanel() {
    const modelAdminContainer = document.getElementById('model-admin-container');
    const bankAdminContainer = document.getElementById('bank-admin-container');
    const dtfAdminContainer = document.getElementById('dtf-admin-container');
    const faqAdminContainer = document.getElementById('faq-admin-container');
    const blockedWordsContainer = document.getElementById('blocked-words-container');
    const missingLogContainer = document.getElementById('missing-log-container');
    const modelSelect = document.getElementById('bag-model-select');
    const bankDisplay = document.getElementById('bank-accounts-display');
    const stampPreview = document.getElementById('stamp-preview-container');
    const sigPreview = document.getElementById('sig-preview-container');
    const brandStatus = document.getElementById('brand-upload-status');
    const dtfSelect = document.getElementById('dtf-size-select');
    
    if(modelSelect) {
        const prevVal = modelSelect.value || 0;
        if(modelAdminContainer) modelAdminContainer.innerHTML = '';
        modelSelect.innerHTML = '';

        bagModels.forEach((item, mIndex) => {
            const opt = document.createElement('option');
            opt.value = mIndex;
            opt.textContent = item.name;
            modelSelect.appendChild(opt);

            if(modelAdminContainer) {
                const card = document.createElement('div');
                card.className = "bg-slate-900 p-3 rounded-xl border border-slate-700 flex flex-col gap-2 text-xs";
                let sizeRows = '';
                if(item.sizes) {
                    item.sizes.forEach((s, sIndex) => {
                        sizeRows += `
                            <div class="bg-slate-800 p-2.5 rounded-lg space-y-1 text-[11px]">
                                <div class="flex items-center justify-between gap-1">
                                    <input type="text" id="edit-sname-${mIndex}-${sIndex}" value="${s.name}" oninput="updateSizeDetail(${mIndex}, ${sIndex})" class="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-bold outline-none" placeholder="Ukuran">
                                    <input type="number" id="edit-sprice-${mIndex}-${sIndex}" value="${s.price}" oninput="updateSizeDetail(${mIndex}, ${sIndex})" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-bold outline-none" placeholder="Harga">
                                    <button type="button" onclick="deleteSizeFromModel(${mIndex}, ${sIndex})" class="text-rose-400 font-bold px-2 py-0.5 cursor-pointer">Hapus</button>
                                </div>
                                <div>
                                    <input type="text" id="note-m${mIndex}-s${sIndex}" value="${s.note || ''}" placeholder="Catatan/Rekomendasi kegunaan..." oninput="updateSizeNote(${mIndex}, ${sIndex})" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-amber-300 outline-none">
                                </div>
                            </div>`;
                    });
                }
                
                const isCustomImg = item.image && !item.image.includes('placeholder.com');
                card.innerHTML = `
                    <div class="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
                        <input type="text" id="edit-model-name-${mIndex}" value="${item.name}" oninput="updateModelName(${mIndex})" class="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold text-sm outline-none" placeholder="Nama Model Tas">
                        <button type="button" onclick="deleteBagModel(${mIndex})" class="text-rose-400 font-bold text-[11px] px-2 py-1 bg-slate-800 rounded cursor-pointer">Hapus Model</button>
                    </div>
                    <div>
                        <label class="block text-[10px] text-slate-400 mb-1">Upload/Ganti Foto Tas (Transparan):</label>
                        <input type="file" accept="image/*" onchange="uploadModelSample(event, ${mIndex})" class="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-amber-500 file:text-slate-950 cursor-pointer">
                    </div>
                    <div class="text-[10px] ${isCustomImg ? 'text-emerald-400 font-semibold' : 'text-slate-400'} italic">
                        ${isCustomImg ? '✅ Foto Kustom Aktif' : 'ℹ️ Menggunakan foto default'}
                    </div>
                    <div class="space-y-2 mt-1">
                        <div class="text-[11px] font-semibold text-slate-300">Daftar Ukuran & Harga:</div>
                        ${sizeRows}
                        <div class="flex gap-1.5 mt-2">
                            <input type="text" id="new-s-name-${mIndex}" placeholder="Ukuran Baru" class="flex-1 bg-slate-800 rounded-lg px-2 py-2 text-[11px] text-white outline-none">
                            <input type="number" id="new-s-price-${mIndex}" placeholder="Harga" class="w-20 bg-slate-800 rounded-lg px-2 py-2 text-[11px] text-white outline-none">
                            <button type="button" onclick="addSizeToModel(${mIndex})" class="bg-amber-500 text-slate-950 px-3 py-2 rounded-lg text-[11px] font-semibold cursor-pointer">Tambah Ukuran</button>
                        </div>
                    </div>
                `;
                modelAdminContainer.appendChild(card);
            }
        });
        if(modelSelect.options.length > prevVal) modelSelect.value = prevVal;
    }

    if(faqAdminContainer && typeof knowledgeFaq !== 'undefined') {
        faqAdminContainer.innerHTML = '';
        knowledgeFaq.forEach((faq, fIdx) => {
            const isRepeat = faq.repeatKeyword !== false;
            faqAdminContainer.innerHTML += `
                <div class="bg-slate-900 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-amber-300"># Ingatan AI No. ${fIdx + 1}</span>
                        <button type="button" onclick="deleteKnowledgeFaq(${fIdx})" class="text-rose-400 font-bold px-2 py-0.5 cursor-pointer">Hapus</button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-0.5">Kata Tambahan Awal:</label>
                            <input type="text" id="edit-faq-prefix-${fIdx}" value="${faq.prefix || ''}" oninput="updateFaqField(${fIdx}, 'prefix')" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-0.5">Kata Kunci:</label>
                            <input type="text" id="edit-faq-kw-${fIdx}" value="${faq.keyword || ''}" oninput="updateFaqField(${fIdx}, 'keyword')" class="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-amber-300 font-bold outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] text-slate-400 mb-0.5">Kata Tambahan Akhir / Jawaban:</label>
                        <textarea id="edit-faq-suffix-${fIdx}" rows="2" oninput="updateFaqField(${fIdx}, 'suffix')" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 outline-none text-xs">${faq.suffix || ''}</textarea>
                    </div>
                    <div class="flex items-center justify-between bg-slate-800 p-2 rounded-lg border border-slate-700">
                        <span class="text-[11px] text-slate-300">Ulangi Kata Kunci di Jawaban?</span>
                        <select id="edit-faq-repeat-${fIdx}" onchange="updateFaqRepeat(${fIdx})" class="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-amber-400 font-semibold outline-none">
                            <option value="false" ${!isRepeat ? 'selected' : ''}>Tidak (Natural)</option>
                            <option value="true" ${isRepeat ? 'selected' : ''}>Ya (Diulang)</option>
                        </select>
                    </div>
                </div>`;
        });
    }

    if (typeof renderKnowledgeFaqAdmin === 'function') {
        renderKnowledgeFaqAdmin();
    }

    if(blockedWordsContainer && typeof blockedWords !== 'undefined') {
        blockedWordsContainer.innerHTML = '';
        blockedWords.forEach((bw, bwIdx) => {
            blockedWordsContainer.innerHTML += `
                <div class="bg-rose-950/80 border border-rose-500/40 text-rose-200 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                    <span>🚫 ${bw}</span>
                    <button type="button" onclick="deleteBlockedWord(${bwIdx})" class="text-rose-400 hover:text-white font-bold ml-1 cursor-pointer">×</button>
                </div>`;
        });
    }

    if(missingLogContainer && typeof unansweredLogs !== 'undefined') {
        missingLogContainer.innerHTML = '';
        if(unansweredLogs.length === 0) {
            missingLogContainer.innerHTML = '<p class="text-[10px] text-slate-500 italic">Belum ada pertanyaan tertinggal.</p>';
        } else {
            unansweredLogs.forEach((log, lIdx) => {
                missingLogContainer.innerHTML += `
                    <div class="bg-slate-900 p-2 rounded-lg border border-rose-500/30 flex items-center justify-between text-[11px] gap-2">
                        <span class="text-rose-200 truncate flex-1">❓ "${log}"</span>
                        <div class="flex items-center gap-1 flex-shrink-0">
                            <button type="button" onclick="promoteLogToFaq('${log.replace(/'/g, "\\'")}', ${lIdx})" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-semibold cursor-pointer">➕ Jadikan Ingatan</button>
                            <button type="button" onclick="deleteSingleUnansweredLog(${lIdx})" class="text-rose-400 hover:text-rose-300 font-bold px-1.5 py-1 text-[11px] cursor-pointer" title="Hapus log ini">🗑️</button>
                        </div>
                    </div>`;
            });
        }
    }

    if(brandStatus) {
        brandStatus.textContent = brandLogoUrl ? "✅ Logo Brand Permanen Aktif" : "ℹ️ Belum ada logo (menggunakan teks)";
        brandStatus.className = brandLogoUrl ? "text-[10px] text-emerald-400 font-semibold italic" : "text-[10px] text-slate-400 italic";
    }

    if(bankAdminContainer && bankDisplay) {
        bankAdminContainer.innerHTML = ''; bankDisplay.innerHTML = '';
        bankAccounts.forEach((b, bIdx) => {
            bankAdminContainer.innerHTML += `<div class="flex items-center justify-between bg-slate-900 p-2 rounded-lg text-[11px]"><span><b>${b.bank}</b>: ${b.acc} (${b.owner})</span><button type="button" onclick="deleteBank(${bIdx})" class="text-rose-400 font-bold px-2 py-1 cursor-pointer">Hapus</button></div>`;
            bankDisplay.innerHTML += `<div class="flex justify-between"><span><b>${b.bank}</b>: ${b.acc}</span><span class="text-slate-500">a.n ${b.owner}</span></div>`;
        });
    }

    if(dtfAdminContainer && dtfSelect) {
        dtfAdminContainer.innerHTML = ''; dtfSelect.innerHTML = '';
        dtfOptions.forEach((d, dIdx) => {
            dtfAdminContainer.innerHTML += `<div class="flex items-center justify-between bg-slate-900 p-2 rounded-lg text-[11px]"><span><b>${d.name}</b> (+Rp ${d.price.toLocaleString('id-ID')})</span><button type="button" onclick="deleteDtfOption(${dIdx})" class="text-rose-400 font-bold px-2 py-1 cursor-pointer">Hapus</button></div>`;
            dtfSelect.innerHTML += `<option value="${d.price}">${d.name} (+Rp ${d.price.toLocaleString('id-ID')})</option>`;
        });
    }

    if(stampPreview) {
        stampPreview.innerHTML = customStampUrl ? `<div class="flex items-center justify-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700"><img src="${customStampUrl}" class="h-10 object-contain"><span class="text-[10px] text-emerald-400 font-semibold">✅ Stempel Lunas Aktif</span><button type="button" onclick="removeStampImage()" class="text-xs text-rose-400 font-semibold underline cursor-pointer">Hapus</button></div>` : `<span class="text-[10px] text-slate-400 italic">Belum ada stempel lunas diupload.</span>`;
    }

    if(sigPreview) {
        sigPreview.innerHTML = adminSignatureUrl ? `<div class="flex items-center justify-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700"><img src="${adminSignatureUrl}" class="h-10 object-contain"><span class="text-[10px] text-emerald-400 font-semibold">✅ Tanda Tangan Owner Aktif</span><button type="button" onclick="removeAdminSignature()" class="text-xs text-rose-400 font-semibold underline cursor-pointer">Hapus</button></div>` : `<span class="text-[10px] text-slate-400 italic">Belum ada tanda tangan owner diupload.</span>`;
    }

    const inkContainer = document.getElementById('ink-list-container');
    const inkSelect1 = document.getElementById('ink-color-select-1');
    const inkSelect2 = document.getElementById('ink-color-select-2');
    
    if(inkContainer && inkSelect1 && inkSelect2) {
        inkContainer.innerHTML = ''; inkSelect1.innerHTML = ''; inkSelect2.innerHTML = '';
        inkColors.forEach((ink, idx) => {
            inkContainer.innerHTML += `<div class="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-lg text-xs"><div class="flex items-center gap-2"><span class="w-3.5 h-3.5 rounded-full inline-block border border-white" style="background:${ink.hex}"></span><span>${ink.name}</span></div><button type="button" onclick="deleteInkColor(${idx})" class="text-rose-400 font-bold px-2 py-1 cursor-pointer">Hapus</button></div>`;
            inkSelect1.innerHTML += `<option value="${ink.hex}">${ink.name}</option>`;
            inkSelect2.innerHTML += `<option value="${ink.hex}" ${idx === 1 ? 'selected' : ''}>${ink.name}</option>`;
        });
    }

    const colorContainer = document.getElementById('color-list-container');
    const colorButtons = document.getElementById('bag-color-buttons');
    if(colorContainer && colorButtons) {
        colorContainer.innerHTML = ''; colorButtons.innerHTML = '';
        bagColors.forEach((item, index) => {
            colorContainer.innerHTML += `<div class="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-lg text-xs"><div class="flex items-center gap-2"><span class="w-3.5 h-3.5 rounded-full inline-block border border-white" style="background:${item.hex}"></span><span>${item.name}</span></div><button type="button" onclick="deleteBagColor(${index})" class="text-rose-400 font-bold px-2 py-1 cursor-pointer">Hapus</button></div>`;
            
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = "px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow transition border border-slate-300 flex items-center gap-2 cursor-pointer active:scale-95";
            btn.style.backgroundColor = item.hex;
            btn.style.color = (item.hex === '#ffffff' || item.hex === '#eab308') ? '#0f172a' : '#ffffff';
            btn.innerHTML = `<span>${item.name}</span>`;
            btn.onclick = () => {
                activeBagTint = item.hex;
                activeColorName = item.name;
                document.getElementById('active-color-label').textContent = item.name;
                updateBagCanvas();
            };
            colorButtons.appendChild(btn);
        });
    }

    const extraInput = document.getElementById('admin-extra-color-price');
    if(extraInput) extraInput.value = extraColorPrice;

    const storeNameInp = document.getElementById('admin-store-name');
    const storeAddrInp = document.getElementById('admin-store-address');
    const storePhoneInp = document.getElementById('admin-store-phone');
    const storeEmailInp = document.getElementById('admin-store-email');
    const ownerWaInp = document.getElementById('admin-wa-number');
    const pdfPassInp = document.getElementById('admin-pdf-password');
    const originCityInp = document.getElementById('admin-origin-city-id');

    if(storeNameInp) storeNameInp.value = storeName;
    if(storeAddrInp) storeAddrInp.value = storeAddress;
    if(storePhoneInp) storePhoneInp.value = storePhone;
    if(storeEmailInp) storeEmailInp.value = storeEmail;
    if(ownerWaInp) ownerWaInp.value = ownerWaNumber;
    if(pdfPassInp) pdfPassInp.value = pdfPassword;
    if(originCityInp) originCityInp.value = originCityId;

    const appLauncherLogo = document.getElementById('app-launcher-logo');
    if(appLauncherLogo && brandLogoUrl) {
        appLauncherLogo.src = brandLogoUrl;
        appLauncherLogo.className = "max-h-14 w-auto object-contain filter drop-shadow";
    }

    updateCustomerSizesDropdown();
    updateBagCanvas();
    renderCartItems();
}

function updateModelName(mIndex) {
    const input = document.getElementById(`edit-model-name-${mIndex}`);
    if(input && bagModels[mIndex]) {
        bagModels[mIndex].name = input.value;
        saveToCloud();
    }
}

function updateSizeDetail(mIndex, sIndex) {
    const nameInput = document.getElementById(`edit-sname-${mIndex}-${sIndex}`);
    const priceInput = document.getElementById(`edit-sprice-${mIndex}-${sIndex}`);
    if(nameInput && priceInput && bagModels[mIndex].sizes[sIndex]) {
        bagModels[mIndex].sizes[sIndex].name = nameInput.value;
        bagModels[mIndex].sizes[sIndex].price = parseInt(priceInput.value) || 0;
        saveToCloud();
    }
}

function addNewBagModel() {
    bagModels.push({
        name: "Tas Model Baru",
        image: "https://via.placeholder.com/400x500/ffffff/334155?text=Tas+Baru",
        sizes: [{ name: "20 x 30 cm", price: 1500, note: "Ukuran standar tas baru." }]
    });
    saveToCloud();
    renderAdminPanel();
}

function deleteBagModel(mIndex) {
    if(bagModels.length <= 1) return alert("Minimal harus ada 1 model tas!");
    if(confirm("Hapus model tas ini?")) {
        bagModels.splice(mIndex, 1);
        saveToCloud();
        renderAdminPanel();
    }
}

function updateSizeNote(mIndex, sIndex) {
    const input = document.getElementById(`note-m${mIndex}-s${sIndex}`);
    if(input && bagModels[mIndex].sizes[sIndex]) {
        bagModels[mIndex].sizes[sIndex].note = input.value;
        saveToCloud();
    }
}

function updateCustomerSizesDropdown() {
    const modelSelect = document.getElementById('bag-model-select');
    const sizeSelect = document.getElementById('bag-size-select');
    if(!modelSelect || !sizeSelect) return;
    const currentModel = bagModels[modelSelect.value] || bagModels[0];
    sizeSelect.innerHTML = '';
    if(currentModel && currentModel.sizes) {
        currentModel.sizes.forEach(s => { sizeSelect.innerHTML += `<option value="${s.name}">${s.name}</option>`; });
    }
    updateSizeLabel();
}

function updateSizeLabel() {
    const mIndex = document.getElementById('bag-model-select').value || 0;
    const sizeName = document.getElementById('bag-size-select').value;
    const currentModel = bagModels[mIndex] || bagModels[0];
    const foundSize = currentModel.sizes?.find(s => s.name === sizeName);
    const sizeLabelEl = document.getElementById('preview-size-label');
    if(sizeLabelEl) sizeLabelEl.textContent = `[ ${sizeName || '-'} ]`;
    
    const noteBox = document.getElementById('size-admin-recommendation-note');
    if(noteBox) {
        if(foundSize && foundSize.note) {
            noteBox.textContent = `💡 Rekomendasi/Kegunaan: ${foundSize.note}`;
            noteBox.classList.remove('hidden');
        } else {
            noteBox.classList.add('hidden');
        }
    }
}

function saveGlobalConfig() {
    const sNameInp = document.getElementById('admin-store-name');
    const sAddrInp = document.getElementById('admin-store-address');
    const sPhoneInp = document.getElementById('admin-store-phone');
    const sEmailInp = document.getElementById('admin-store-email');
    const oWaInp = document.getElementById('admin-wa-number');
    const pdfPassInp = document.getElementById('admin-pdf-password');

    if(sNameInp) storeName = sNameInp.value;
    if(sAddrInp) storeAddress = sAddrInp.value;
    if(sPhoneInp) storePhone = sPhoneInp.value;
    if(sEmailInp) storeEmail = sEmailInp.value;
    if(oWaInp) ownerWaNumber = oWaInp.value;
    if(pdfPassInp) pdfPassword = pdfPassInp.value;
    
    const originInput = document.getElementById('admin-origin-city-id');
    if(originInput) {
        originCityId = originInput.value.trim() || "444";
        safeLocalStorageSet('ilham_originCityId', originCityId);
    }

    const extraInput = document.getElementById('admin-extra-color-price');
    if(extraInput) {
        extraColorPrice = parseInt(extraInput.value) || 400;
        safeLocalStorageSet('ilham_extraColorPrice', extraColorPrice);
    }
    
    saveToCloud();
}

function addBank() {
    const bank = document.getElementById('new-bank-name').value.trim();
    const acc = document.getElementById('new-bank-acc').value.trim();
    const owner = document.getElementById('new-bank-owner').value.trim();
    if(bank && acc && owner) { bankAccounts.push({ bank, acc, owner }); saveToCloud(); renderAdminPanel(); }
}
function deleteBank(index) { bankAccounts.splice(index, 1); saveToCloud(); renderAdminPanel(); }

function addInkColor() {
    const name = document.getElementById('new-ink-name').value.trim();
    const hex = document.getElementById('new-ink-hex').value;
    if(name) { inkColors.push({ name, hex }); saveToCloud(); renderAdminPanel(); }
}
function deleteInkColor(index) { inkColors.splice(index, 1); saveToCloud(); renderAdminPanel(); }

function addDtfOption() {
    const name = document.getElementById('new-dtf-name').value.trim();
    const price = parseInt(document.getElementById('new-dtf-price').value);
    if(name && !isNaN(price)) { dtfOptions.push({ name, price }); saveToCloud(); renderAdminPanel(); }
}
function deleteDtfOption(index) { dtfOptions.splice(index, 1); saveToCloud(); renderAdminPanel(); }

function addSizeToModel(mIndex) {
    const nameInput = document.getElementById(`new-s-name-${mIndex}`);
    const priceInput = document.getElementById(`new-s-price-${mIndex}`);
    if(!nameInput || !priceInput) return;
    const name = nameInput.value.trim();
    const price = parseInt(priceInput.value);
    if(name && !isNaN(price)) {
        if(!bagModels[mIndex].sizes) bagModels[mIndex].sizes = [];
        bagModels[mIndex].sizes.push({ name, price, note: "Ukuran kustom baru." });
        saveToCloud(); 
        renderAdminPanel();
        updateCustomerSizesDropdown();
    } else { alert("Harap isi nama ukuran dan harga dengan benar!"); }
}

function deleteSizeFromModel(mIndex, sIndex) {
    if(bagModels[mIndex].sizes.length <= 1) return alert("Minimal harus ada 1 ukuran dalam model ini!");
    bagModels[mIndex].sizes.splice(sIndex, 1);
    saveToCloud(); renderAdminPanel();
}

function addBagColor() {
    const name = document.getElementById('new-color-name').value.trim();
    const hex = document.getElementById('new-color-hex').value;
    if(name) { bagColors.push({ name, hex }); saveToCloud(); renderAdminPanel(); }
}
function deleteBagColor(index) { bagColors.splice(index, 1); saveToCloud(); renderAdminPanel(); }

async function uploadBrandLogo(e) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let targetW = img.width, targetH = img.height;
            if(targetW > 250) { targetH = Math.round((targetH * 250) / targetW); targetW = 250; }
            canvas.width = targetW; canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const imgData = ctx.getImageData(0, 0, targetW, targetH);
            const data = imgData.data;
            const rBg = data[0], gBg = data[1], bBg = data[2];
            for (let i = 0; i < data.length; i += 4) {
                if (Math.abs(data[i] - rBg) < 45 && Math.abs(data[i+1] - gBg) < 45 && Math.abs(data[i+2] - bBg) < 45) { data[i+3] = 0; }
            }
            ctx.putImageData(imgData, 0, 0);
            brandLogoUrl = canvas.toDataURL('image/png');
            safeLocalStorageSet('ilham_brandLogoUrl', brandLogoUrl);
            updateDynamicManifest();
            saveToCloud().then(() => { renderAdminPanel(); });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function resetBrandLogo() {
    brandLogoUrl = "";
    safeLocalStorageSet('ilham_brandLogoUrl', "");
    updateDynamicManifest();
    saveToCloud().then(() => { renderAdminPanel(); alert("Logo brand berhasil dihapus."); });
}

async function uploadStampImage(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                customStampUrl = canvas.toDataURL('image/png');
                safeLocalStorageSet('ilham_customStampUrl', customStampUrl);
                saveToCloud(); renderAdminPanel();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function removeStampImage() {
    customStampUrl = "";
    safeLocalStorageSet('ilham_customStampUrl', "");
    saveToCloud().then(() => { renderAdminPanel(); alert("Stempel lunas berhasil dihapus."); });
}

async function uploadAdminSignature(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                adminSignatureUrl = canvas.toDataURL('image/png');
                safeLocalStorageSet('ilham_adminSignatureUrl', adminSignatureUrl);
                saveToCloud(); renderAdminPanel();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function removeAdminSignature() {
    adminSignatureUrl = "";
    safeLocalStorageSet('ilham_adminSignatureUrl', "");
    saveToCloud().then(() => { renderAdminPanel(); alert("Tanda tangan owner berhasil dihapus."); });
}

async function uploadModelSample(e, mIndex) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let targetW = img.width, targetH = img.height;
            if(targetW > 400) { targetH = Math.round((targetH * 400) / targetW); targetW = 400; }
            canvas.width = targetW; canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const imgData = ctx.getImageData(0, 0, targetW, targetH);
            const data = imgData.data;
            const rBg = data[0], gBg = data[1], bBg = data[2];
            for (let i = 0; i < data.length; i += 4) {
                if (Math.abs(data[i] - rBg) < 45 && Math.abs(data[i+1] - gBg) < 45 && Math.abs(data[i+2] - bBg) < 45) { data[i+3] = 0; }
            }
            ctx.putImageData(imgData, 0, 0);
            bagModels[mIndex].image = canvas.toDataURL('image/png');
            saveToCloud(); renderAdminPanel(); updateBagCanvas();
            alert("Model tas berhasil di-upload dengan background otomatis transparan!");
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function togglePrintMethod() {
    const method = document.getElementById('print-method').value;
    const isDtf = method === 'dtf';
    document.getElementById('sablon-color-mode-box').classList.toggle('hidden', isDtf);
    document.getElementById('dtf-size-box').classList.toggle('hidden', !isDtf);
    toggleSablonColorCount();
    updateProcessedLogos();
}

function toggleSablonColorCount() {
    const method = document.getElementById('print-method').value;
    const colorCount = document.getElementById('sablon-color-count').value;
    const isTwoColors = (method === 'manual' && colorCount === '2');

    document.getElementById('logo-2-container').classList.toggle('hidden', !isTwoColors);
    document.getElementById('controls-logo-2').classList.toggle('hidden', !isTwoColors);
    document.getElementById('logo-layer-2').classList.toggle('hidden', !isTwoColors);
    
    document.getElementById('label-logo-1').textContent = isTwoColors ? "6a. Upload Logo / Desain Bagian 1 (Transparan)" : "6. Upload Logo / Desain Anda (Background Transparan)";
    updateProcessedLogos();
}

function loadCustomerLogo1(e) {
    processCustomerLogoFile(e, 1, 'logo-upload-status-1', (imgObj) => {
        rawCustomerLogoImg1 = imgObj;
        updateProcessedLogos();
    });
}

function loadCustomerLogo2(e) {
    processCustomerLogoFile(e, 2, 'logo-upload-status-2', (imgObj) => {
        rawCustomerLogoImg2 = imgObj;
        updateProcessedLogos();
    });
}

function processCustomerLogoFile(e, logoNum, statusId, callback) {
    const file = e.target.files[0];
    if(!file) return;
    const statusEl = document.getElementById(statusId);
    if(statusEl) { statusEl.textContent = "⏳ Memproses latar belakang transparan..."; statusEl.className = "text-[10px] text-amber-500 font-semibold italic"; }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let targetW = img.width, targetH = img.height;
            if(targetW > 280) { targetH = Math.round((targetH * 280) / targetW); targetW = 280; }
            canvas.width = targetW; canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, targetW, targetH);

            const imgData = ctx.getImageData(0, 0, targetW, targetH);
            const data = imgData.data;
            const rBg = data[0], gBg = data[1], bBg = data[2];
            for (let i = 0; i < data.length; i += 4) {
                if (Math.abs(data[i] - rBg) < 40 && Math.abs(data[i+1] - gBg) < 40 && Math.abs(data[i+2] - bBg) < 40) { data[i+3] = 0; }
            }
            ctx.putImageData(imgData, 0, 0);

            const processedImg = new Image();
            processedImg.onload = function() {
                if(statusEl) { statusEl.textContent = `✅ Logo ${logoNum} berhasil di-upload (Transparan)!`; statusEl.className = "text-[10px] text-emerald-500 font-semibold italic"; }
                callback(processedImg);
            };
            processedImg.src = canvas.toDataURL('image/png');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function updateProcessedLogos() {
    const method = document.getElementById('print-method').value;
    const colorCount = document.getElementById('sablon-color-count').value;
    const isTwoColors = (method === 'manual' && colorCount === '2');

    const inkHex1 = document.getElementById('ink-color-select-1').value || '#0f172a';
    const inkHex2 = document.getElementById('ink-color-select-2').value || '#dc2626';

    const select1 = document.getElementById('ink-color-select-1');
    const select2 = document.getElementById('ink-color-select-2');
    const name1 = select1 && select1.options[select1.selectedIndex] ? select1.options[select1.selectedIndex].text : 'Hitam';
    const name2 = select2 && select2.options[select2.selectedIndex] ? select2.options[select2.selectedIndex].text : 'Merah';

    const mSelect = document.getElementById('bag-model-select');
    const modelNameText = (mSelect && mSelect.value !== "" && bagModels[mSelect.value]) ? bagModels[mSelect.value].name : bagModels[0].name;

    const cleanMethodName = method === 'dtf' ? 'DTF Full Color' : (isTwoColors ? 'Sablon Manual (2 Warna)' : 'Sablon Manual (1 Warna)');
    document.getElementById('owner-method-txt').textContent = cleanMethodName;
    document.getElementById('owner-model-txt').textContent = modelNameText;

    let inkNoteText = "Keterangan Tinta: ";
    if(method === 'dtf') {
        inkNoteText += "DTF Full Color (Warna Asli Desain)";
    } else if(isTwoColors) {
        inkNoteText += `Desain 1: Tinta ${name1} | Desain 2: Tinta ${name2}`;
    } else {
        inkNoteText += `Tinta Sablon: ${name1}`;
    }
    document.getElementById('production-ink-notes').textContent = inkNoteText;

    if(rawCustomerLogoImg1) {
        const c1 = document.createElement('canvas');
        c1.width = rawCustomerLogoImg1.width; c1.height = rawCustomerLogoImg1.height;
        const ctx1 = c1.getContext('2d');
        ctx1.drawImage(rawCustomerLogoImg1, 0, 0);

        if(method === 'manual') {
            const imgData = ctx1.getImageData(0, 0, c1.width, c1.height);
            const d = imgData.data;
            const rT = parseInt(inkHex1.slice(1, 3), 16), gT = parseInt(inkHex1.slice(3, 5), 16), bT = parseInt(inkHex1.slice(5, 7), 16);
            for (let i = 0; i < d.length; i += 4) { if (d[i + 3] > 15) { d[i] = rT; d[i + 1] = gT; d[i + 2] = bT; } }
            ctx1.putImageData(imgData, 0, 0);
        }
        document.getElementById('preview-logo-img-1').src = c1.toDataURL('image/png');
    }

    if(rawCustomerLogoImg2 && isTwoColors) {
        const c2 = document.createElement('canvas');
        c2.width = rawCustomerLogoImg2.width; c2.height = rawCustomerLogoImg2.height;
        const ctx2 = c2.getContext('2d');
        ctx2.drawImage(rawCustomerLogoImg2, 0, 0);

        if(method === 'manual') {
            const imgData = ctx2.getImageData(0, 0, c2.width, c2.height);
            const d = imgData.data;
            const rT = parseInt(inkHex2.slice(1, 3), 16), gT = parseInt(inkHex2.slice(3, 5), 16), bT = parseInt(inkHex2.slice(5, 7), 16);
            for (let i = 0; i < d.length; i += 4) { if (d[i + 3] > 15) { d[i] = rT; d[i + 1] = gT; d[i + 2] = bT; } }
            ctx2.putImageData(imgData, 0, 0);
        }
        document.getElementById('preview-logo-img-2').src = c2.toDataURL('image/png');
    }

    renderOwnerHdProductionBox(method, isTwoColors);
}

function renderOwnerHdProductionBox(method, isTwoColors) {
    const canvas = document.getElementById('owner-hd-canvas');
    const placeholderEl = document.getElementById('owner-placeholder-text');

    if(!rawCustomerLogoImg1) {
        if(placeholderEl) placeholderEl.style.display = 'block';
        if(canvas) canvas.style.display = 'none';
        return;
    }
    if(placeholderEl) placeholderEl.style.display = 'none';
    if(canvas) canvas.style.display = 'block';

    canvas.width = 1200; 
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(rawCustomerLogoImg1) {
        ctx.drawImage(rawCustomerLogoImg1, 80, 80, 500, 600);
    }
    if(rawCustomerLogoImg2 && isTwoColors) {
        ctx.drawImage(rawCustomerLogoImg2, 620, 80, 500, 600);
    }

    if(method === 'manual') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
            if (d[i] < 240 || d[i+1] < 240 || d[i+2] < 240) {
                if (d[i + 3] > 20) {
                    d[i] = 0; d[i + 1] = 0; d[i + 2] = 0; d[i + 3] = 255;
                }
            } else {
                d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }
}

function onCustomerModelChange() { 
    updateCustomerSizesDropdown(); 
    updateBagCanvas(); 
    updateProcessedLogos(); 
    updateLivePricePreview(); 
}

function onCustomerSizeSelect() { 
    updateSizeLabel(); 
    updateLivePricePreview(); 
}

// ==========================================
// FUNGSI HITUNG TOTAL BERAT PESANAN & RAJA ONGKIR
// ==========================================
function calculateTotalCartWeight() {
    let totalWeightGrams = 0;
    cartItems.forEach(item => {
        let foundModel = bagModels.find(m => m.name === item.model);
        let foundSize = foundModel ? foundModel.sizes.find(s => s.name === item.size) : null;
        let weightPerPcs = foundSize && foundSize.weight ? foundSize.weight : 40;
        totalWeightGrams += (weightPerPcs * item.qty);
    });
    return totalWeightGrams;
}

async function checkRealtimeShippingCost(destinationCityId, courierCode = "jne") {
    const totalWeight = calculateTotalCartWeight();
    if (totalWeight <= 0) return 0;

    try {
        const response = await fetch('https://api.rajaongkir.com/starter/cost', {
            method: 'POST',
            headers: {
                'key': rajaOngkirApiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                origin: originCityId,          // Kota asal dinamis dari admin
                destination: destinationCityId, // Kota tujuan pelanggan
                weight: totalWeight,            // Berat total gram dari keranjang
                courier: courierCode            // jne, jnt, sicepat, dll
            })
        });

        const result = await response.json();
        if (result && result.rajaongkir && result.rajaongkir.results && result.rajaongkir.results.length > 0) {
            const costs = result.rajaongkir.results[0].costs;
            if (costs && costs.length > 0) {
                return costs[0].cost[0].value;
            }
        }
    } catch (e) {
        console.error("Gagal mengambil data ongkir Raja Ongkir:", e);
    }
    return 0;
}

function updateLivePricePreview() {
    const unitPrice = calculateItemPrice();
    const qtyInput = document.getElementById('item-qty');
    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
    const subtotal = unitPrice * qty;
    
    let priceLabel = document.getElementById('live-unit-price-label');
    if (!priceLabel) {
        const qtyContainer = document.getElementById('item-qty')?.closest('div')?.parentElement;
        if (qtyContainer) {
            const priceBox = document.createElement('div');
            priceBox.className = "bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 my-2";
            priceBox.innerHTML = `<span>Estimasi Harga Satuan:</span> <span id="live-unit-price-label" class="text-emerald-700 font-extrabold text-sm">Rp 0 /pcs</span>`;
            qtyContainer.parentNode.insertBefore(priceBox, qtyContainer);
            priceLabel = document.getElementById('live-unit-price-label');
        }
    }
    
    if(priceLabel) {
        priceLabel.textContent = `Rp ${unitPrice.toLocaleString('id-ID')} /pcs (Total: Rp ${subtotal.toLocaleString('id-ID')})`;
    }
}

function updateBagCanvas() {
    const mIndex = document.getElementById('bag-model-select').value || 0;
    const currentModel = bagModels[mIndex] || bagModels[0];
    const canvas = document.getElementById('bag-preview-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function() {
        canvas.width = img.width; canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width; tempCanvas.height = img.height;
        const tCtx = tempCanvas.getContext('2d');
        tCtx.drawImage(img, 0, 0);
        
        try {
            const bagData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const d = bagData.data;
            const rTint = parseInt(activeBagTint.slice(1, 3), 16);
            const gTint = parseInt(activeBagTint.slice(3, 5), 16);
            const bTint = parseInt(activeBagTint.slice(5, 7), 16);

            for (let i = 0; i < d.length; i += 4) {
                if (d[i+3] > 15 && activeBagTint !== '#ffffff') {
                    d[i]   = Math.round((d[i] * 0.2) + (rTint * 0.8));
                    d[i+1] = Math.round((d[i+1] * 0.2) + (gTint * 0.8));
                    d[i+2] = Math.round((d[i+2] * 0.2) + (bTint * 0.8));
                }
            }
            tCtx.putImageData(bagData, 0, 0);
        } catch(e) {}
        ctx.drawImage(tempCanvas, 0, 0);
    };
    img.src = currentModel.image;
}

function adjustLogoTransform() {
    if(isLogoLocked) return;
    const s1 = document.getElementById('logo-scale-1').value;
    const r1 = document.getElementById('logo-rotate-1').value;
    const x1 = document.getElementById('logo-pos-x-1').value;
    const y1 = document.getElementById('logo-pos-y-1').value;
    document.getElementById('scale-val-1').textContent = s1;
    document.getElementById('rotate-val-1').textContent = r1;
    document.getElementById('logo-layer-1').style.transform = `translate(${x1}px, ${y1}px) scale(${s1 / 100}) rotate(${r1}deg)`;

    const s2 = document.getElementById('logo-scale-2').value;
    const r2 = document.getElementById('logo-rotate-2').value;
    const x2 = document.getElementById('logo-pos-x-2').value;
    const y2 = document.getElementById('logo-pos-y-2').value;
    document.getElementById('scale-val-2').textContent = s2;
    document.getElementById('rotate-val-2').textContent = r2;
    document.getElementById('logo-layer-2').style.transform = `translate(${x2}px, ${y2}px) scale(${s2 / 100}) rotate(${r2}deg)`;
}

function calculateItemPrice() {
    const mIndex = document.getElementById('bag-model-select').value || 0;
    const sizeName = document.getElementById('bag-size-select').value;
    const currentModel = bagModels[mIndex] || bagModels[0];
    
    let basePrice = 1400;
    const found = currentModel.sizes?.find(s => s.name === sizeName);
    if(found) basePrice = found.price;

    let unitPrice = basePrice;
    const method = document.getElementById('print-method').value;
    if(method === 'dtf') {
        const dtfPrice = parseInt(document.getElementById('dtf-size-select').value) || 2000;
        unitPrice += dtfPrice;
    } else if(method === 'manual' && document.getElementById('sablon-color-count').value === '2') {
        unitPrice += extraColorPrice;
    }
    return unitPrice;
}

async function addItemToCart() {
    if(!rawCustomerLogoImg1) return alert("Silakan upload minimal Logo / Desain Utama terlebih dahulu!");
    
    const mIndex = document.getElementById('bag-model-select').value || 0;
    const currentModel = bagModels[mIndex] || bagModels[0];
    const sizeName = document.getElementById('bag-size-select').value;
    const qty = parseInt(document.getElementById('item-qty').value) || 500;
    const method = document.getElementById('print-method').value;
    const colorCount = document.getElementById('sablon-color-count').value;
    
    let printMethodName = 'Sablon Manual (1 Warna)';
    if(method === 'dtf') printMethodName = 'DTF Full Color';
    else if(colorCount === '2') printMethodName = 'Sablon Manual (2 Warna)';

    const unitPrice = calculateItemPrice();

    let mockupBase64 = "";
    try {
        const element = document.getElementById('capture-mockup');
        const canvas = await html2canvas(element, { scale: 0.7, useCORS: true, backgroundColor: '#ffffff' });
        mockupBase64 = canvas.toDataURL('image/jpeg', 0.5);
    } catch(e) { console.log("Mockup capture error:", e); }

    const hdCanvas = document.getElementById('owner-hd-canvas');
    const cleanLogoDataUrl = hdCanvas ? hdCanvas.toDataURL('image/png') : "";

    cartItems.push({
        model: currentModel.name,
        size: sizeName,
        color: activeColorName,
        method: printMethodName,
        qty: qty,
        unitPrice: unitPrice,
        subtotal: unitPrice * qty,
        mockupImg: mockupBase64,
        cleanLogo: cleanLogoDataUrl,
        inkNote: document.getElementById('production-ink-notes').textContent
    });

    renderCartItems();
    alert("Item berhasil dimasukkan ke keranjang pesanan!");
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const countEl = document.getElementById('cart-count');
    if(!container) return;
    countEl.textContent = cartItems.length;
    container.innerHTML = '';

    if(cartItems.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 text-center py-4">Belum ada item ditambahkan ke keranjang pesanan.</p>';
        updateCartTotals();
        return;
    }

    cartItems.forEach((item, index) => {
        container.innerHTML += `
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-2">
                <div class="flex items-center gap-2.5 overflow-hidden">
                    <img src="${item.mockupImg || 'https://via.placeholder.com/50'}" class="w-12 h-12 object-contain rounded border bg-white flex-shrink-0">
                    <div class="truncate">
                        <div class="font-bold text-slate-800 truncate">${item.model} (${item.size})</div>
                        <div class="text-[11px] text-slate-500">Warna: ${item.color} | ${item.method}</div>
                        <div class="text-[10px] text-amber-700">${item.inkNote || ''}</div>
                        <div class="text-[11px] font-semibold text-emerald-700">${item.qty} Pcs x Rp ${item.unitPrice.toLocaleString('id-ID')} = Rp ${item.subtotal.toLocaleString('id-ID')}</div>
                    </div>
                </div>
                <button type="button" onclick="removeCartItem(${index})" class="text-rose-600 font-bold p-2 cursor-pointer flex-shrink-0">🗑️</button>
            </div>`;
    });
    updateCartTotals();
}

function removeCartItem(index) { cartItems.splice(index, 1); renderCartItems(); }
function clearCart() { if(confirm("Kosongkan keranjang pesanan?")) { cartItems = []; renderCartItems(); } }

// ==========================================
// PENGATURAN DISKON EVENT ADMIN & KELOLA TOTAL
// ==========================================
function updateAdminEventDiscount(val) {
    window.currentAdminEventDiscount = parseInt(val) || 0;
    safeLocalStorageSet('ilham_adminEventDiscount', window.currentAdminEventDiscount);
    updateCartTotals();
    saveToCloud();
}

let selectedShippingCost = 0;
let selectedCourierName = "J&T Express";

async function updateCartTotals() {
    let totalQty = 0, grandSubtotal = 0, totalWeightGrams = 0;
    
    cartItems.forEach(item => { 
        totalQty += item.qty; 
        grandSubtotal += item.subtotal; 
        
        const modelObj = bagModels.find(m => m.name === item.model);
        const sizeObj = modelObj?.sizes?.find(s => s.name === item.size);
        const gramPerPcs = sizeObj?.weight || 40;
        totalWeightGrams += (gramPerPcs * item.qty);
    });

    let qtyDiscount = totalQty >= 1000 ? grandSubtotal * 0.10 : 0;
    let eventDiscount = window.currentAdminEventDiscount || 0;
    let totalDiscount = qtyDiscount + eventDiscount;
    let grandSubtotalAfterDisc = grandSubtotal - totalDiscount;
    
    const region = document.getElementById('shipping-region')?.value || 'jabodetabek';
    
    let grandTotal = grandSubtotalAfterDisc + selectedShippingCost;
    let dpVal = region === 'luar' ? grandTotal * 0.50 : 0;

    const totalQtyEl = document.getElementById('display-total-qty');
    if(totalQtyEl) totalQtyEl.textContent = totalQty.toLocaleString('id-ID') + " Pcs (" + totalWeightGrams + " gram)";
    
    if(totalDiscount > 0) {
        document.getElementById('discount-row')?.classList.remove('hidden');
        const discValEl = document.getElementById('display-discount-val');
        if(discValEl) discValEl.textContent = "- Rp " + Math.round(totalDiscount).toLocaleString('id-ID');
    } else { 
        document.getElementById('discount-row')?.classList.add('hidden'); 
    }

    let ongkirRow = document.getElementById('cart-ongkir-row');
    if(!ongkirRow) {
        const totalRow = document.getElementById('display-total-price')?.closest('div')?.parentElement;
        if(totalRow) {
            const div = document.createElement('div');
            div.id = 'cart-ongkir-row';
            div.className = "flex justify-between text-xs text-slate-600 my-1";
            div.innerHTML = `<span>Ongkos Kirim (${selectedCourierName}):</span> <span id="display-ongkir-val" class="font-bold text-slate-800">Rp ${selectedShippingCost.toLocaleString('id-ID')}</span>`;
            totalRow.insertBefore(div, totalRow.firstChild);
        }
    } else {
        const ongkirValEl = document.getElementById('display-ongkir-val');
        if(ongkirValEl) ongkirValEl.textContent = `Rp ${selectedShippingCost.toLocaleString('id-ID')}`;
    }

    if(region === 'luar') {
        document.getElementById('dp-row')?.classList.remove('hidden');
        const dpValEl = document.getElementById('display-dp-val');
        if(dpValEl) dpValEl.textContent = "Rp " + Math.round(dpVal).toLocaleString('id-ID') + " (50%)";
    } else { 
        document.getElementById('dp-row')?.classList.add('hidden'); 
    }

    const totalPriceEl = document.getElementById('display-total-price');
    if(totalPriceEl) totalPriceEl.textContent = "Rp " + Math.round(grandTotal).toLocaleString('id-ID');
}

function toggleAdminPanel() { 
    const adminView = document.getElementById('admin-view');
    if(adminView) adminView.classList.toggle('hidden'); 
}

function requestAdminLogin() {
    let pass = prompt("Masukkan Password Admin:");
    if (pass === pdfPassword) {
        const adminView = document.getElementById('admin-view');
        if (adminView) {
            adminView.classList.remove('hidden');
            adminView.scrollIntoView({ behavior: 'smooth' });
            renderAdminPanel();
        }
    } else if (pass !== null) {
        alert("Password salah, Bosku!");
    }
}

function applyCloudData(data) {
    if (window.isManualUpdating) return;
    isSyncingFromCloud = true;
    
    if(data.bagModels && data.bagModels.length > 0) {  
        bagModels = data.bagModels.map((m, idx) => {
            const localModel = bagModels[idx];
            return {
                name: m.name,
                image: (m.image && !m.image.includes('placeholder.com')) ? m.image : (localModel ? localModel.image : "https://via.placeholder.com/400x500/ffffff/334155?text=Tas"),
                sizes: m.sizes ? m.sizes.map((s, sIdx) => {
                    const localSize = localModel && localModel.sizes ? localModel.sizes[sIdx] : null;
                    return {
                        name: s.name,
                        price: s.price,
                        weight: s.weight !== undefined ? s.weight : (localSize ? localSize.weight : 40), 
                        note: s.note || (localSize ? localSize.note : "")
                    };
                }) : (localModel ? localModel.sizes : [])
            };
        });
    }

    if(data.bankAccounts) bankAccounts = data.bankAccounts;
    if(data.bagColors) bagColors = data.bagColors;
    if(data.inkColors) inkColors = data.inkColors;
    if(data.dtfOptions) dtfOptions = data.dtfOptions;
    
    if(data.knowledgeFaq && Array.isArray(data.knowledgeFaq) && typeof knowledgeFaq !== 'undefined') {
        knowledgeFaq = data.knowledgeFaq;
        safeLocalStorageSet('ilham_knowledgeFaq', JSON.stringify(knowledgeFaq));
    }

    if(data.blockedWords && typeof blockedWords !== 'undefined') blockedWords = data.blockedWords;
    if(data.unansweredLogs && typeof unansweredLogs !== 'undefined') unansweredLogs = data.unansweredLogs;
    
    if(data.extraColorPrice !== undefined) {
        extraColorPrice = data.extraColorPrice;
        safeLocalStorageSet('ilham_extraColorPrice', extraColorPrice);
    }
    if(data.currentAdminEventDiscount !== undefined) {
        currentAdminEventDiscount = data.currentAdminEventDiscount;
        safeLocalStorageSet('ilham_adminEventDiscount', currentAdminEventDiscount);
    }

    if(data.originCityId !== undefined) {
        originCityId = data.originCityId;
        safeLocalStorageSet('ilham_originCityId', originCityId);
        const originInput = document.getElementById('admin-origin-city-id');
        if(originInput) originInput.value = originCityId;
    }

    if(data.storeName) storeName = data.storeName;
    if(data.pdfPassword) pdfPassword = data.pdfPassword;
    if(data.ownerWaNumber) ownerWaNumber = data.ownerWaNumber;
    if(data.brandLogoUrl) { brandLogoUrl = data.brandLogoUrl; safeLocalStorageSet('ilham_brandLogoUrl', brandLogoUrl); }
    if(data.customStampUrl) { customStampUrl = data.customStampUrl; safeLocalStorageSet('ilham_customStampUrl', customStampUrl); }
    if(data.adminSignatureUrl) { adminSignatureUrl = data.adminSignatureUrl; safeLocalStorageSet('ilham_adminSignatureUrl', adminSignatureUrl); }
    if(data.storeAddress) storeAddress = data.storeAddress;
    if(data.storePhone) storePhone = data.storePhone;
    if(data.storeEmail) storeEmail = data.storeEmail;

    updateDynamicManifest();
    renderAdminPanel();
    updateBagCanvas();
    
    setTimeout(() => { isSyncingFromCloud = false; }, 1000);
}

// ==========================================
// 5. PDF & ORDER MANAGEMENT & PAYMENT
// ==========================================
async function downloadCustomerInvoicePDF() {
    if(cartItems.length === 0) return alert("Keranjang pesanan masih kosong!");
    let totalQty = 0, grandSubtotal = 0;
    cartItems.forEach(item => { totalQty += item.qty; grandSubtotal += item.subtotal; });
    let qtyDiscount = totalQty >= 1000 ? grandSubtotal * 0.10 : 0;
    let totalDiscount = qtyDiscount + (window.currentAdminEventDiscount || 0);
    let grandTotal = grandSubtotal - totalDiscount;
    const region = document.getElementById('shipping-region').value;
    const paymentTypeNote = region === 'jabodetabek' ? 'Wilayah Jabodetabek (Sistem COD / Bayar di Tempat)' : 'Di Luar Jabodetabek (Wajib DP 50% / Pelunasan)';

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.setFillColor(219, 234, 254); pdf.rect(0, 0, 210, 40, 'F');
    
    if(brandLogoUrl) {
        try { pdf.addImage(brandLogoUrl, 'PNG', 15, 8, 30, 24); } catch(e) {}
    }

    let safeTitle = (customerProfile.title && customerProfile.title !== "undefined") ? customerProfile.title : "Bosku";
    let safeName = (customerProfile.name && customerProfile.name !== "undefined") ? customerProfile.name : "Rojak";

    pdf.setTextColor(15, 23, 42); pdf.setFont("helvetica", "bold"); pdf.setFontSize(14);
    pdf.text(storeName.toUpperCase(), brandLogoUrl ? 50 : 15, 16);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
    pdf.text("Alamat: " + storeAddress, brandLogoUrl ? 50 : 15, 23);
    pdf.text("No. WA: " + storePhone + " | Email: " + storeEmail, brandLogoUrl ? 50 : 15, 28);

    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9);
    pdf.text("INVOICE TAGIHAN", 195, 16, {align: "right"});
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
    pdf.text("No. Inv: INV-" + Math.floor(1000 + Math.random() * 9000), 195, 22, {align: "right"});
    pdf.text("Tanggal: " + new Date().toLocaleString('id-ID'), 195, 27, {align: "right"});

    pdf.setTextColor(15, 23, 42); pdf.setFont("helvetica", "bold"); pdf.setFontSize(10);
    pdf.text("INFORMASI PELANGGAN:", 15, 48);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5);
    pdf.text(`Nama: ${safeTitle} ${safeName} (${customerProfile.wa || '-'})`, 15, 54);
    
    const addressLines = pdf.splitTextToSize(`Alamat Pengiriman: ${customerProfile.address || '-'}`, 110);
    pdf.text(addressLines, 15, 60);
    const nextYAfterAddress = 60 + (addressLines.length * 4.5);

    pdf.text(`Ket. Pembayaran: ${paymentTypeNote}`, 15, nextYAfterAddress + 2);

    let startY = nextYAfterAddress + 10;
    pdf.setFillColor(224, 242, 254); 
    pdf.setDrawColor(0, 0, 0); pdf.setLineWidth(0.3);
    pdf.rect(15, startY, 180, 8, 'FD');

    pdf.setTextColor(15, 23, 42); pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
    pdf.text("No", 18, startY + 5.5);
    pdf.text("Jenis & Model Tas / Ukuran & Catatan Tinta", 28, startY + 5.5);
    pdf.text("Metode Cetak", 100, startY + 5.5);
    pdf.text("Qty", 132, startY + 5.5);
    pdf.text("Harga", 152, startY + 5.5);
    pdf.text("Subtotal", 176, startY + 5.5);

    startY += 8;
    pdf.setFont("helvetica", "normal");

    cartItems.forEach((item, idx) => {
        const descText = `${item.model} (${item.size}) - Kain: ${item.color}\n${item.inkNote || ''}`;
        const descLines = pdf.splitTextToSize(descText, 68);
        const methodLines = pdf.splitTextToSize(item.method, 28);
        
        const maxLineCount = Math.max(descLines.length, methodLines.length, 1);
        const cellHeight = Math.max(15, maxLineCount * 4.5 + 4);

        if(startY + cellHeight > 250) {
            pdf.addPage();
            startY = 20;
        }

        pdf.setFillColor(255, 255, 255);
        pdf.rect(15, startY, 180, cellHeight, 'FD');
        
        pdf.text(String(idx + 1), 18, startY + 5.5);
        pdf.text(descLines, 28, startY + 5.5);
        pdf.text(methodLines, 100, startY + 5.5);
        pdf.text(item.qty + " Pcs", 132, startY + 5.5);
        pdf.text("Rp " + item.unitPrice.toLocaleString('id-ID'), 152, startY + 5.5);
        pdf.text("Rp " + item.subtotal.toLocaleString('id-ID'), 176, startY + 5.5);
        
        startY += cellHeight;
    });

    startY += 6;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
    pdf.text(`Subtotal Keseluruhan: Rp ${grandSubtotal.toLocaleString('id-ID')}`, 130, startY);
    if(totalDiscount > 0) {
        startY += 6;
        pdf.setTextColor(10, 153, 100);
        pdf.text(`Total Diskon: - Rp ${Math.round(totalDiscount).toLocaleString('id-ID')}`, 130, startY);
        pdf.setTextColor(15, 23, 42);
    }
    startY += 6;
    pdf.setFontSize(10);
    pdf.text(`TOTAL TAGIHAN: Rp ${Math.round(grandTotal).toLocaleString('id-ID')}`, 115, startY);

    if(cartItems.length > 0) {
        try {
            startY += 10;
            if(startY > 220) { pdf.addPage(); startY = 20; }
            pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
            pdf.text("ILUSTRASI PRATINJAU DESAIN PESANAN:", 15, startY);
            startY += 5;

            let posX = 15;
            cartItems.forEach((it, i) => {
                if(it.mockupImg) {
                    if(posX + 35 > 195) {
                        posX = 15;
                        startY += 38;
                        if(startY > 230) { pdf.addPage(); startY = 20; }
                    }
                    pdf.addImage(it.mockupImg, 'JPEG', posX, startY, 32, 32);
                    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
                    pdf.text(`Item #${i+1}`, posX, startY + 35);
                    posX += 38;
                }
            });
            startY += 10;
        } catch(e) {}
    }

    if(startY > 240) { pdf.addPage(); startY = 20; }

    startY += 4;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
    pdf.text("Silakan lakukan transfer pembayaran ke rekening resmi berikut:", 15, startY);
    startY += 5;
    pdf.setFont("helvetica", "normal");
    bankAccounts.forEach(b => {
        pdf.text(`- Bank ${b.bank}: ${b.acc} (a.n ${b.owner})`, 18, startY);
        startY += 5;
    });

    startY += 6;
    pdf.setFont("helvetica", "bold"); pdf.setTextColor(6, 95, 70);
    pdf.text(`Terima kasih ${safeTitle} ${safeName} telah mempercayakan pemesanan tas custom di ${storeName}!`, 15, startY);

    pdf.save(`Invoice-Tagihan-ILHAM-SPUNBOND.pdf`);
    alert("Invoice Tagihan PDF berhasil di-download!");
}

function verifyAndShowOrderHistory() {
    const pwd = prompt("Masukkan Password Owner:");
    if(pwd === pdfPassword) showOrderHistory();
    else if(pwd !== null) alert("Password salah!");
}

function showOrderHistory() {
    const modal = document.getElementById('order-history-modal');
    const container = document.getElementById('order-history-list');
    container.innerHTML = 'Menghubungkan live sync data PO...';
    modal.classList.remove('hidden');

    const { collection, onSnapshot, query, orderBy } = window.firebaseDeps;
    const q = query(collection(window.firebaseDb, "orders"), orderBy("date", "desc"));
    if(activeOrdersUnsubscribe) activeOrdersUnsubscribe();

    activeOrdersUnsubscribe = onSnapshot(q, (querySnapshot) => {
        container.innerHTML = '';
        let totalOrdersCount = 0;
        let totalOmzetMonthly = 0;
        const currentMonthStr = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });
        document.getElementById('recap-month-name').textContent = currentMonthStr;

        if(querySnapshot.empty) { 
            container.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">Belum ada pesanan masuk.</p>'; 
            document.getElementById('recap-total-orders').textContent = "0 PO";
            document.getElementById('recap-total-omzet').textContent = "Rp 0";
            return; 
        }

        querySnapshot.forEach((docSnap) => {
            const o = docSnap.data();
            totalOrdersCount++;
            const numericPrice = parseInt((o.totalPrice || "0").replace(/[^0-9]/g, '')) || 0;
            totalOmzetMonthly += numericPrice;

            const statusVal = o.status || "BELUM LUNAS";
            const isLunas = statusVal === "LUNAS";
            const isDp = statusVal === "DP 50% LUNAS";
            const isLuarJadetabek = o.region === "luar";
            const currentCourier = o.courier || "J&T Express";
            const currentTracking = o.trackingNumber || "";

            let statusBadgeClass = "bg-amber-900 text-amber-300";
            if(isLunas) statusBadgeClass = "bg-emerald-900 text-emerald-300";
            else if(isDp) statusBadgeClass = "bg-blue-900 text-blue-300";

            let dpButtonHtml = "";
            if(isLuarJadetabek && !isLunas) {
                dpButtonHtml = `<button type="button" onclick="toggleDpStatus('${docSnap.id}', '${statusVal}')" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer flex-1">💰 ${isDp ? 'Batalkan DP' : '✅ DP 50% Sudah Dibayar'}</button>`;
            }

            container.innerHTML += `
                <div class="bg-slate-800 p-3 rounded-xl text-xs space-y-2 border border-slate-700">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-amber-400">${o.id} - ${o.name} (${o.wa})</span>
                        <span class="text-[10px] text-slate-400">${o.date}</span>
                    </div>
                    <div class="flex justify-between items-center text-[11px]">
                        <span>Total: <b class="text-emerald-400">${o.totalPrice}</b></span>
                        <span class="px-2 py-0.5 rounded font-bold ${statusBadgeClass}">${statusVal}</span>
                    </div>
                    
                    <div class="space-y-1.5 pt-1 border-t border-slate-700">
                        <label class="block text-[10px] text-slate-300 font-semibold">Pengiriman & Ekspedisi (${o.region === 'luar' ? 'Luar Jabodetabek' : 'Jabodetabek'}):</label>
                        <div class="grid grid-cols-2 gap-2">
                            <select id="courier-select-${docSnap.id}" class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white outline-none">
                                <option value="J&T Express" ${currentCourier==='J&T Express'?'selected':''}>J&T Express</option>
                                <option value="JNE" ${currentCourier==='JNE'?'selected':''}>JNE</option>
                                <option value="SiCepat" ${currentCourier==='SiCepat'?'selected':''}>SiCepat</option>
                                <option value="Lalamove" ${currentCourier==='Lalamove'?'selected':''}>Lalamove (Instan)</option>
                                <option value="GoSend" ${currentCourier==='GoSend'?'selected':''}>GoSend (Instan)</option>
                                <option value="Ambil Sendiri" ${currentCourier==='Ambil Sendiri'?'selected':''}>Ambil Sendiri di Workshop</option>
                                <option value="Kurir Toko" ${currentCourier==='Kurir Toko'?'selected':''}>Kurir Toko / COD</option>
                            </select>
                            <input type="text" id="tracking-input-${docSnap.id}" value="${currentTracking}" placeholder="No Resi (Opsional)" class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none">
                        </div>
                        <div class="flex gap-2 pt-1">
                            <button type="button" onclick="saveShippingInfo('${docSnap.id}')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer flex-1">💾 Simpan Pengiriman</button>
                            <button type="button" onclick="sendWhatsAppStatusMessage('${docSnap.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer flex-1">💬 Kirim WA & Invoice</button>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 pt-1 border-t border-slate-700">
                        <button type="button" onclick="downloadOwnerPoHD('${docSnap.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer">📥 Download Desain HD</button>
                        <button type="button" onclick="downloadOwnerInvoicePDF('${docSnap.id}')" class="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer">📄 Nota / Pelunasan (PDF)</button>
                        <button type="button" onclick="toggleOrderStatus('${docSnap.id}', '${statusVal}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer">🔄 Ubah Status Lunas</button>
                        <button type="button" onclick="sendShippingWhatsAppMessage('${docSnap.id}')" class="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer">🚚 Barang Dalam Pengiriman</button>
                        ${dpButtonHtml}
                        <button type="button" onclick="deletePoOrder('${docSnap.id}')" class="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer">🗑️ Hapus</button>
                    </div>
                </div>`;
        });

        document.getElementById('recap-total-orders').textContent = totalOrdersCount + " PO";
        document.getElementById('recap-total-omzet').textContent = "Rp " + totalOmzetMonthly.toLocaleString('id-ID');
    });
}

function closeOrderHistoryModal() {
    document.getElementById('order-history-modal').classList.add('hidden');
    if(activeOrdersUnsubscribe) { activeOrdersUnsubscribe(); activeOrdersUnsubscribe = null; }
}

async function saveShippingInfo(docId) {
    const courier = document.getElementById(`courier-select-${docId}`).value;
    const tracking = document.getElementById(`tracking-input-${docId}`).value.trim();
    const { doc, setDoc } = window.firebaseDeps;
    await setDoc(doc(window.firebaseDb, "orders", docId), { courier, trackingNumber: tracking }, { merge: true });
    alert("Informasi pengiriman berhasil disimpan!");
}

async function sendWhatsAppStatusMessage(docId) {
    const { doc, getDoc } = window.firebaseDeps;
    const docSnap = await getDoc(doc(window.firebaseDb, "orders", docId));
    if(!docSnap.exists()) return alert("Data PO tidak ditemukan!");
    const o = docSnap.data();

    await downloadOwnerInvoicePDF(docId, true);

    let targetWa = o.wa.replace(/[^0-9]/g, '');
    if(targetWa.startsWith('0')) targetWa = '62' + targetWa.slice(1);

    let message = "";
    const isLunas = o.status === "LUNAS";

    if(isLunas) {
        message = `Halo Kak *${o.name}*, terima kasih banyak telah melunasi pesanan Anda di *${storeName}* (No PO: *${o.id}*). 🙏\n\nSemoga Kakak selalu diberikan kesehatan, kelancaran rezeki yang berkah, dan kesuksesan selalu. Pesanan Anda akan segera kami kirimkan. Terima kasih telah mempercayakan kebutuhan tas spunbond di ${storeName}! ✨😊`;
    } else {
        message = `Halo Kak *${o.name}*, terima kasih telah memesan di *${storeName}* (No PO: *${o.id}*). 🙏\n\nFile Invoice Tagihan resmi telah kami kirimkan. Silakan lakukan pembayaran sesuai instruksi agar pesanan segera diproses tim produksi. Terima kasih! 📦📋`;
    }

    window.open(`https://wa.me/${targetWa}?text=${encodeURIComponent(message)}`);
}

async function sendShippingWhatsAppMessage(docId) {
    const courier = document.getElementById(`courier-select-${docId}`).value;
    const tracking = document.getElementById(`tracking-input-${docId}`).value.trim();
    const { doc, getDoc } = window.firebaseDeps;
    const docSnap = await getDoc(doc(window.firebaseDb, "orders", docId));
    if(!docSnap.exists()) return alert("Data PO tidak ditemukan!");
    const o = docSnap.data();

    let targetWa = o.wa.replace(/[^0-9]/g, '');
    if(targetWa.startsWith('0')) targetWa = '62' + targetWa.slice(1);

    let resiText = tracking ? ` dengan No. Resi: *${tracking}*` : "";
    let message = `Halo Kak *${o.name}*, kabar gembira! Pesanan custom tas Anda di *${storeName}* (No PO: *${o.id}*) saat ini **sedang dalam pengiriman** melalui jasa kirim *${courier}*${resiText}. Mohon ditunggu kedatangannya ya Bosku. Terima kasih! 🚚📦✨`;

    window.open(`https://wa.me/${targetWa}?text=${encodeURIComponent(message)}`);
}

async function toggleOrderStatus(docId, currentStatus) {
    const newStatus = currentStatus === "LUNAS" ? "BELUM LUNAS" : "LUNAS";
    const { doc, setDoc } = window.firebaseDeps;
    await setDoc(doc(window.firebaseDb, "orders", docId), { status: newStatus }, { merge: true });
}

async function toggleDpStatus(docId, currentStatus) {
    const newStatus = currentStatus === "DP 50% LUNAS" ? "BELUM LUNAS" : "DP 50% LUNAS";
    const { doc, setDoc } = window.firebaseDeps;
    await setDoc(doc(window.firebaseDb, "orders", docId), { status: newStatus }, { merge: true });
}

async function deletePoOrder(docId) {
    if(confirm("Yakin ingin menghapus pesanan PO ini?")) {
        const { doc, deleteDoc } = window.firebaseDeps;
        await deleteDoc(doc(window.firebaseDb, "orders", docId));
    }
}

function clearAllOrders() {
    if(confirm("Hapus seluruh riwayat PO?")) {
        const { collection, getDocs, doc, deleteDoc } = window.firebaseDeps;
        getDocs(collection(window.firebaseDb, "orders")).then(snapshot => {
            snapshot.forEach(d => deleteDoc(doc(window.firebaseDb, "orders", d.id)));
        });
    }
}

async function downloadOwnerPoHD(docId) {
    const { doc, getDoc } = window.firebaseDeps;
    const docSnap = await getDoc(doc(window.firebaseDb, "orders", docId));
    if(!docSnap.exists()) return alert("Data PO tidak ditemukan!");
    const o = docSnap.data();

    if(!o.items || o.items.length === 0 || !o.items[0].cleanLogo) return alert("File logo HD tidak tersedia pada PO ini.");
    
    const link = document.createElement('a');
    link.href = o.items[0].cleanLogo;
    link.download = `Film-Produksi-Bersih-${o.id}.png`;
    link.click();
    alert("File desain HD bersih tanpa tanda air berhasil di-download!");
}

async function downloadOwnerInvoicePDF(docId, silent = false) {
    const { doc, getDoc } = window.firebaseDeps;
    const docSnap = await getDoc(doc(window.firebaseDb, "orders", docId));
    if(!docSnap.exists()) return alert("Data PO tidak ditemukan!");
    const o = docSnap.data();
    const statusVal = o.status || "BELUM LUNAS";
    const isLunas = statusVal === "LUNAS";

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.setFillColor(219, 234, 254); pdf.rect(0, 0, 210, 40, 'F');
    
    if(brandLogoUrl) {
        try { pdf.addImage(brandLogoUrl, 'PNG', 15, 8, 30, 24); } catch(e) {}
    }

    pdf.setTextColor(15, 23, 42); pdf.setFont("helvetica", "bold"); pdf.setFontSize(14);
    pdf.text(storeName.toUpperCase() + " - NOTA & TAGIHAN", brandLogoUrl ? 50 : 15, 16);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
    pdf.text("Alamat: " + storeAddress + " | No WA: " + storePhone, brandLogoUrl ? 50 : 15, 25);

    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9);
    pdf.text("NOTA PESANAN", 195, 16, {align: "right"});
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
    pdf.text("No PO: " + o.id, 195, 22, {align: "right"});
    pdf.text("Tanggal: " + o.date, 195, 27, {align: "right"});

    pdf.setTextColor(15, 23, 42); pdf.setFont("helvetica", "bold"); pdf.setFontSize(11);
    pdf.text(isLunas ? "NOTA PELUNASAN (LUNAS)" : (statusVal === "DP 50% LUNAS" ? "NOTA TAGIHAN (DP 50% DITERIMA)" : "NOTA TAGIHAN / PEMESANAN"), 15, 48);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5);
    pdf.text(`Status Pembayaran: ${statusVal}`, 15, 54);

    pdf.setFont("helvetica", "bold"); pdf.text("DATA PEMESAN:", 15, 62);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5);
    pdf.text(`Nama: ${o.name} (${o.wa})`, 15, 68);
    
    const ownerAddressLines = pdf.splitTextToSize(`Alamat Kirim: ${o.address}`, 110);
    pdf.text(ownerAddressLines, 15, 74);
    const nextYOwnerAfterAddr = 74 + (ownerAddressLines.length * 4.5);

    let startY = nextYOwnerAfterAddr + 4;
    pdf.setFillColor(224, 242, 254); 
    pdf.setDrawColor(0, 0, 0); pdf.setLineWidth(0.3);
    pdf.rect(15, startY, 180, 8, 'FD');

    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
    pdf.text("No", 18, startY + 5.5);
    pdf.text("Jenis & Model Tas / Ukuran & Catatan Tinta", 28, startY + 5.5);
    pdf.text("Metode Cetak", 100, startY + 5.5);
    pdf.text("Qty", 132, startY + 5.5);
    pdf.text("Harga", 152, startY + 5.5);
    pdf.text("Subtotal", 176, startY + 5.5);

    startY += 8;
    pdf.setFont("helvetica", "normal");

    o.items.forEach((item, idx) => {
        const descText = `${item.model} (${item.size}) - Kain: ${item.color}\n${item.inkNote || ''}`;
        const descLines = pdf.splitTextToSize(descText, 68);
        const methodLines = pdf.splitTextToSize(item.method, 28);
        
        const maxLineCount = Math.max(descLines.length, methodLines.length, 1);
        const cellHeight = Math.max(15, maxLineCount * 4.5 + 4);

        if(startY + cellHeight > 250) {
            pdf.addPage();
            startY = 20;
        }

        pdf.setFillColor(255, 255, 255);
        pdf.rect(15, startY, 180, cellHeight, 'FD');
        
        pdf.text(String(idx + 1), 18, startY + 5.5);
        pdf.text(descLines, 28, startY + 5.5);
        pdf.text(methodLines, 100, startY + 5.5);
        pdf.text(item.qty + " Pcs", 132, startY + 5.5);
        pdf.text("Rp " + item.unitPrice.toLocaleString('id-ID'), 152, startY + 5.5);
        pdf.text("Rp " + item.subtotal.toLocaleString('id-ID'), 176, startY + 5.5);
        
        startY += cellHeight;
    });

    startY += 6;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10);
    pdf.text(`TOTAL PEMBAYARAN: ${o.totalPrice}`, 115, startY);

    if(isLunas && customStampUrl) {
        try {
            pdf.setGState(new pdf.GState({ opacity: 0.35 })); 
            pdf.addImage(customStampUrl, 'PNG', 110, startY - 12, 55, 26); 
            pdf.setGState(new pdf.GState({ opacity: 1.0 })); 
        } catch(e) {}
    }

    if(o.items && o.items.length > 0) {
        try {
            startY += 10;
            if(startY > 220) { pdf.addPage(); startY = 20; }
            pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5);
            pdf.text("ILUSTRASI PRATINJAU DESAIN PESANAN:", 15, startY);
            startY += 5;

            let posX = 15;
            o.items.forEach((it, i) => {
                if(it.mockupImg) {
                    if(posX + 35 > 195) {
                        posX = 15;
                        startY += 38;
                        if(startY > 230) { pdf.addPage(); startY = 20; }
                    }
                    pdf.addImage(it.mockupImg, 'JPEG', posX, startY, 32, 32);
                    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7);
                    pdf.text(`Item #${i+1}`, posX, startY + 35);
                    posX += 38;
                }
            });
            startY += 10;
        } catch(e) {}
    }

    if(adminSignatureUrl) {
        try {
            if(startY > 230) { pdf.addPage(); startY = 20; }
            pdf.setFont("helvetica", "normal"); pdf.setFontSize(8);
            pdf.text("Hormat Kami,", 145, startY + 5);
            pdf.addImage(adminSignatureUrl, 'PNG', 140, startY + 8, 35, 18);
            pdf.text("(" + storeName + ")", 140, startY + 29);
        } catch(e) {}
    }

    pdf.save(`Nota-Owner-${o.id}.pdf`);
    if(!silent) alert("Nota / Pelunasan PDF berhasil didownload!");
}

async function generateQrisPayment(orderId, totalAmount) {
    try {
        const response = await fetch('https://api.qrisly.id/v1/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${qrislyApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                merchant_id: "ILHAM_SPUNBOND",
                invoice_id: orderId,
                amount: totalAmount,
                expired_time: 30
            })
        });

        const result = await response.json();
        if(result && result.status === 'success') {
            return {
                qrString: result.data.qr_string,
                qrImageUrl: result.data.qr_image_url
            };
        }
    } catch(e) {
        console.error("Gagal generate QRISly:", e);
    }
    return null;
}

// Saat form pesanan dikonfirmasi / dikirim ke WhatsApp / Cloud
async function saveOrderAndSendWhatsApp() {
    if(!customerProfile.name || !customerProfile.wa || !customerProfile.address) {
        return alert("Profil pemesan dan alamat tujuan belum lengkap! Harap perbarui profil Anda.");
    }
    if(cartItems.length === 0) return alert("Keranjang pesanan masih kosong!");

    let safeTitle = (customerProfile.title && customerProfile.title !== "undefined") ? customerProfile.title : "Bosku";
    let safeName = (customerProfile.name && customerProfile.name !== "undefined") ? customerProfile.name : "Rojak";

    const orderId = "PO-" + Math.floor(1000 + Math.random() * 9000);
    let totalQty = 0, grandSubtotal = 0;
    cartItems.forEach(item => { totalQty += item.qty; grandSubtotal += item.subtotal; });
    const qtyDiscount = totalQty >= 1000 ? grandSubtotal * 0.10 : 0;
    const totalDiscount = qtyDiscount + (window.currentAdminEventDiscount || 0);
    const grandSubtotalAfterDisc = grandSubtotal - totalDiscount;
    const grandTotal = grandSubtotalAfterDisc + selectedShippingCost;
    
    const region = document.getElementById('shipping-region')?.value || 'jabodetabek';
    const dpVal = grandTotal * 0.50;

    const newOrder = {
        id: orderId, 
        name: `${safeTitle} ${safeName}`, 
        wa: customerProfile.wa, 
        address: customerProfile.address, // <-- Otomatis menggunakan alamat profil customer
        region: region, 
        items: cartItems, 
        totalPrice: "Rp " + Math.round(grandTotal).toLocaleString('id-ID'),
        shippingCost: selectedShippingCost,
        courier: selectedCourierName,
        date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' }),
        status: "BELUM LUNAS",
        trackingNumber: ""
    };

    try {
        const { doc, setDoc } = window.firebaseDeps;
        await setDoc(doc(window.firebaseDb, "orders", orderId), newOrder);
        
        let itemsDetailText = "";
        cartItems.forEach((it, idx) => {
            itemsDetailText += `\n${idx + 1}. *${it.model} (${it.size})*\n   - Warna: ${it.color}\n   - Cetak: ${it.method}\n   - Qty: ${it.qty} Pcs @Rp ${it.unitPrice.toLocaleString('id-ID')} = *Rp ${it.subtotal.toLocaleString('id-ID')}*`;
        });

        let paymentInstruction = region === 'jabodetabek' 
            ? `🚚 *Ket. Pembayaran:* Wilayah Jabodetabek (*Sistem COD / Bayar di Tempat*).` 
            : `⚠️ *Ket. Pembayaran:* Wilayah Luar Jabodetabek (*Wajib DP 50% sebesar Rp ${Math.round(dpVal).toLocaleString('id-ID')}*).`;

        let waMessage = `Halo Owner *${storeName}*, saya *${safeTitle} ${safeName}* ingin memesan custom tas dengan rincian berikut:\n\n📦 *No PO:* ${orderId}\n👤 *Nama:* ${safeTitle} ${safeName} (${customerProfile.wa})\n📍 *Alamat Tujuan:* ${customerProfile.address}\n\n*Daftar Item Pesanan:*${itemsDetailText}\n\n📦 *Kurir (${selectedCourierName}):* Rp ${selectedShippingCost.toLocaleString('id-ID')}\n💰 *Total Keseluruhan (＋Ongkir):* *Rp ${Math.round(grandTotal).toLocaleString('id-ID')}*\n${paymentInstruction}\n\nMohon segera diproses ya bosku, terima kasih! 🙏`;

        alert("Pesanan tersimpan & diarahkan ke WhatsApp owner!");
        window.open(`https://wa.me/${ownerWaNumber}?text=${encodeURIComponent(waMessage)}`);
    } catch(e) { 
        console.error(e);
        alert("Gagal menyimpan pesanan ke cloud."); 
    }
}
