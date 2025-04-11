// Fotoğraf Türleri Module: Fotoğraf çekim türleri ve açılarını yönetir

// Çekim türleri verilerini dışarıdan içe aktar
// Bu veriler assets/uploads/fotograf_turleri/bilgiler.js içinde tanımlanmış

// Fotoğraf türleri bölümünü doldur
function fotografTurleriniDoldur() {
    // Çekim türlerini doldur
    const cekimTurleriListesi = document.getElementById('cekim-turleri-listesi');
    if (cekimTurleriListesi) {
        cekimTurleriListesi.innerHTML = '';
        // cekimTurleri global değişkeni bilgiler.js dosyasında tanımlanmış durumda
        cekimTurleri.forEach(tur => {
            cekimTurleriListesi.innerHTML += `
                <div class="fotograf-turu" data-id="${tur.id}">
                    <h3 class="tur-baslik">${tur.isim}</h3>
                    <p class="tur-aciklama">${tur.aciklama}</p>
                    <div class="tur-ipucu">
                        <i class="fas fa-lightbulb"></i>
                        <p>${tur.ipucu}</p>
                    </div>
                </div>
            `;
        });

        // Tür kartlarına tıklama olayları ekle
        document.querySelectorAll('#cekim-turleri-listesi .fotograf-turu').forEach(kart => {
            kart.addEventListener('click', function() {
                fotografTuruDetayGoster(this.dataset.id);
            });
        });
    }
    
    // Çekim açılarını doldur
    const cekimAcilariListesi = document.getElementById('cekim-acilari-listesi');
    if (cekimAcilariListesi) {
        cekimAcilariListesi.innerHTML = '';
        // cekimAcilari global değişkeni bilgiler.js dosyasında tanımlanmış durumda
        cekimAcilari.forEach(aci => {
            cekimAcilariListesi.innerHTML += `
                <div class="fotograf-turu" data-id="${aci.id}">
                    <h3 class="tur-baslik">${aci.isim}</h3>
                    <p class="tur-aciklama">${aci.aciklama}</p>
                    <div class="tur-etki">
                        <i class="fas fa-magic"></i>
                        <p>${aci.etki}</p>
                    </div>
                    <div class="tur-ipucu">
                        <i class="fas fa-lightbulb"></i>
                        <p>${aci.ipucu}</p>
                    </div>
                </div>
            `;
        });

        // Açı kartlarına tıklama olayları ekle
        document.querySelectorAll('#cekim-acilari-listesi .fotograf-turu').forEach(kart => {
            kart.addEventListener('click', function() {
                fotografAcisiDetayGoster(this.dataset.id);
            });
        });
    }

    // Örnek promptlar için kopyalama butonları
    document.querySelectorAll('.prompt-box .kopyala-btn').forEach(buton => {
        buton.onclick = function() {
            const promptMetni = this.getAttribute('onclick').match(/promptKopyala\('(.+?)'\)/)[1];
            if (promptMetni) {
                promptKopyala(promptMetni);
            }
        };
    });
}

// Fotoğraf türü detayını göster
function fotografTuruDetayGoster(turId) {
    const tur = cekimTurleri.find(t => t.id === turId);
    if (!tur) return;

    // Modal veya bilgi kutucuğu yerine toast bildirimi kullanıyoruz
    showToast(`${tur.isim}: ${tur.aciklama}`, "info");
}

// Fotoğraf açısı detayını göster
function fotografAcisiDetayGoster(aciId) {
    const aci = cekimAcilari.find(a => a.id === aciId);
    if (!aci) return;

    // Modal veya bilgi kutucuğu yerine toast bildirimi kullanıyoruz
    showToast(`${aci.isim}: ${aci.aciklama} - ${aci.etki}`, "info");
}

// Örnek prompt oluştur
function ornekPromptOlustur(fotografTuru) {
    // İstenilen türe göre örnek bir prompt oluşturur
    const temelPrompt = "Genç kadın model, 25 yaşında, doğal ışık, profesyonel fotoğrafçılık, yüksek çözünürlük";
    
    switch(fotografTuru) {
        case 'portrait':
            return `${temelPrompt}, portre çekimi, yüz detaylarına odaklanma, shallow depth of field`;
        case 'full-length':
            return `${temelPrompt}, tam boy çekim (full-length shot), vücudun tamamı görünür, doğal duruş`;
        case 'close-up':
            return `${temelPrompt}, yakın çekim (close-up), yüz ifadesine odaklanma, detaylı cilt dokusu`;
        default:
            return `${temelPrompt}, ${fotografTuru} çekim`;
    }
}

// Dışa aktarılacak fonksiyonlar
export {
    fotografTurleriniDoldur,
    fotografTuruDetayGoster,
    fotografAcisiDetayGoster,
    ornekPromptOlustur
};
