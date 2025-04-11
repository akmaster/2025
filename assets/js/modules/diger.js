// Diğer Promptlar Module: Karakter, kıyafet ve mekan dışındaki promptların yönetimi

// İlgili modülleri içe aktar
import { DB, verileriKaydet, modalKontrol, getCategoryIcon, kisalt, showToast } from './base.js';

// Diğer promptları görüntüleme
function verileriGoster(aramaMetni = "", siralama = "isim-az") {
    const listeElement = document.getElementById('diger-listesi');
    if (!listeElement) return;
    
    // Önce arama filtresi uygula
    let filtreliVeri = DB.diger;
    if (aramaMetni) {
        aramaMetni = aramaMetni.toLowerCase();
        filtreliVeri = DB.diger.filter(item => 
            item.isim.toLowerCase().includes(aramaMetni) || 
            (item.prompt && item.prompt.toLowerCase().includes(aramaMetni)) ||
            (item.kategori && item.kategori.toLowerCase().includes(aramaMetni))
        );
    }
    
    // Ardından sıralama uygula
    filtreliVeri = filtreliVeri.sort((a, b) => {
        switch(siralama) {
            case 'isim-az':
                return a.isim.localeCompare(b.isim);
            case 'isim-za':
                return b.isim.localeCompare(a.isim);
            case 'tarih-yeni':
                return new Date(b.eklemeTarihi) - new Date(a.eklemeTarihi);
            case 'tarih-eski':
                return new Date(a.eklemeTarihi) - new Date(b.eklemeTarihi);
            default:
                return a.isim.localeCompare(b.isim);
        }
    });
    
    // Listeyi temizle
    listeElement.innerHTML = '';
    
    // Veri yoksa mesaj göster
    if (filtreliVeri.length === 0) {
        listeElement.innerHTML = `<div class="bos-liste-mesaji">
            <i class="fas fa-search"></i>
            <p>Hiç prompt bulunamadı.</p>
        </div>`;
        return;
    }
    
    // Promptları listele
    filtreliVeri.forEach(item => {
        listeElement.innerHTML += `
            <div class="item-card" data-id="${item.id}">
                <div class="item-image">
                    ${item.gorselUrl 
                        ? `<img src="${item.gorselUrl}" alt="${item.isim}">`
                        : `<div class="item-image-placeholder"><i class="fas fa-image"></i></div>`
                    }
                </div>
                <div class="item-content">
                    <h3 class="item-title">${item.isim}</h3>
                    <div class="item-category">
                        <i class="fas ${getCategoryIcon('diger', item.kategori)}"></i>
                        ${item.kategori || 'Genel'}
                    </div>
                    <div class="item-description">${kisalt(item.prompt, 100)}</div>
                    <div class="item-actions">
                        <button class="duzenle-btn" onclick="itemDuzenle('diger', '${item.id}')">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="kopyala-btn" onclick="promptKopyala('${item.prompt.replace(/'/g, "\\'")}')">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                        <button class="sil-btn-small" onclick="itemSil('diger', '${item.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Kart tıklama olaylarını ayarla
    document.querySelectorAll('#diger-listesi .item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Butonlara tıkladığımızda kartın detay görüntüleme açılmasını engelle
            if (e.target.closest('.item-actions') || e.target.closest('button')) {
                return;
            }
            
            const id = this.dataset.id;
            digerDetayGoster(id);
        });
    });
}

// Diğer prompt detay görüntüleme
function digerDetayGoster(id) {
    const veri = DB.diger.find(item => item.id === id);
    if (!veri) return;
    
    let detayIcerik = `
        <h2 class="detay-baslik">${veri.isim}</h2>
        <div class="detay-kategori">
            <i class="fas ${getCategoryIcon('diger', veri.kategori)}"></i>
            ${veri.kategori || 'Genel'}
        </div>
    `;
    
    if (veri.gorselUrl) {
        detayIcerik += `<img src="${veri.gorselUrl}" alt="${veri.isim}" class="detay-gorsel">`;
    }
    
    detayIcerik += `
        <div class="detay-prompt">
            <div class="detay-prompt-baslik">
                <i class="fas fa-quote-left"></i> Prompt
            </div>
            ${veri.prompt}
        </div>
        
        <div class="detay-butonlar">
            <button class="duzenle-btn" onclick="itemDuzenle('diger', '${id}')">
                <i class="fas fa-edit"></i> Düzenle
            </button>
            <button class="kopyala-btn" onclick="promptKopyala('${veri.prompt.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Promptu Kopyala
            </button>
            <button class="sil-btn" onclick="itemSil('diger', '${id}')">
                <i class="fas fa-trash-alt"></i> Sil
            </button>
        </div>
    `;
    
    document.getElementById('detay-icerik').innerHTML = detayIcerik;
    modalKontrol('detay-modal', true);
}

// Buton olaylarını ayarla
function butonOlaylariAyarla() {
    // Yeni Prompt Ekle butonu
    const yeniDigerBtn = document.getElementById('yeni-diger-btn');
    if (yeniDigerBtn) {
        yeniDigerBtn.addEventListener('click', () => {
            document.getElementById('diger-modal-baslik').textContent = 'Yeni Prompt Ekle';
            document.getElementById('diger-form').reset();
            document.getElementById('diger-form').removeAttribute('data-id');
            
            // Önizleme alanını temizle
            document.getElementById('diger-gorsel-onizleme').innerHTML = '';
            document.getElementById('diger-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
            
            modalKontrol('diger-modal', true);
        });
    }

    // Diğer prompt form işlemi
    const digerForm = document.getElementById('diger-form');
    if (digerForm) {
        digerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = this.dataset.id;
            const yeniPrompt = {
                id: id || Date.now().toString(),
                isim: document.getElementById('diger-isim').value,
                kategori: document.getElementById('diger-kategori').value,
                prompt: document.getElementById('diger-prompt').value,
                gorselUrl: document.getElementById('diger-gorsel').value,
                eklemeTarihi: id ? DB.diger.find(d => d.id === id).eklemeTarihi : new Date().toISOString()
            };
            
            if (id) {
                // Güncelleme
                const index = DB.diger.findIndex(d => d.id === id);
                if (index !== -1) {
                    DB.diger[index] = yeniPrompt;
                    showToast("Prompt başarıyla güncellendi");
                }
            } else {
                // Yeni prompt ekleme
                DB.diger.push(yeniPrompt);
                showToast("Yeni prompt başarıyla eklendi");
            }
            
            verileriKaydet();
            verileriGoster();
            modalKontrol('diger-modal', false);
        });
    }
}

// Prompt silme işlemi
function digerSil(id) {
    const index = DB.diger.findIndex(item => item.id === id);
    
    if (index !== -1) {
        DB.diger.splice(index, 1);
        verileriKaydet();
        verileriGoster();
        return true;
    }
    
    return false;
}

// Prompt düzenleme işlemi
function digerDuzenle(id) {
    const item = DB.diger.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('diger-modal-baslik').textContent = 'Promptu Düzenle';
    document.getElementById('diger-isim').value = item.isim;
    document.getElementById('diger-kategori').value = item.kategori || '';
    document.getElementById('diger-prompt').value = item.prompt;
    document.getElementById('diger-gorsel').value = item.gorselUrl || '';
    
    // Görsel önizleme
    if (item.gorselUrl) {
        document.getElementById('diger-gorsel-onizleme').innerHTML = `<img src="${item.gorselUrl}" alt="${item.isim}">`;
    } else {
        document.getElementById('diger-gorsel-onizleme').innerHTML = '';
    }
    
    // Dosya adını sıfırla
    document.getElementById('diger-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
    
    document.getElementById('diger-form').dataset.id = id;
    modalKontrol('diger-modal', true);
}

// Dosya yükleme olaylarını ayarla
function dosyaYuklemeOlaylariAyarla() {
    // Diğer promptlar görseli
    const digerInput = document.getElementById('diger-gorsel-dosya');
    const digerDosyaIsim = document.getElementById('diger-gorsel-dosya-isim');
    const digerOnizleme = document.getElementById('diger-gorsel-onizleme');
    
    if (digerInput) {
        digerInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const dosya = this.files[0];
                digerDosyaIsim.textContent = dosya.name;
                
                // Dosya yolunu oluştur
                const dosyaYolu = `assets/uploads/diger/${dosya.name}`;
                
                // Görsel önizleme için geçici URL oluştur
                const geciciURL = URL.createObjectURL(dosya);
                digerOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
                
                // Dosya yolunu form alanına kaydet
                document.getElementById('diger-gorsel').value = dosyaYolu;
                
                // Kullanıcıya rehberlik
                showToast(`Yüklenen dosya: ${dosya.name}. Dosyayı 'assets/uploads/diger/' klasörüne kaydettiğinizden emin olun.`, "info");
                
                // Geçici URL'yi kullandıktan sonra serbest bırak
                setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
            } else {
                digerDosyaIsim.textContent = 'Dosya seçilmedi';
                digerOnizleme.innerHTML = '';
            }
        });
    }
    
    // URL girişi önizleme olayı
    const digerGorselInput = document.getElementById('diger-gorsel');
    if (digerGorselInput) {
        digerGorselInput.addEventListener('input', function() {
            if (this.value) {
                digerOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
            } else {
                digerOnizleme.innerHTML = '';
            }
        });
    }
}

// Dışa aktarılacak fonksiyonlar
export {
    verileriGoster,
    digerDetayGoster,
    butonOlaylariAyarla,
    digerSil,
    digerDuzenle,
    dosyaYuklemeOlaylariAyarla
};
