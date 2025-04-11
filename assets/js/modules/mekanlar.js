// Mekanlar Module: Mekanların yönetimi ve görüntülenmesi

// İlgili modülleri içe aktar
import { DB, verileriKaydet, modalKontrol, getCategoryIcon, getCategoryName, kisalt, showToast } from './base.js';

// Mekanları görüntüleme
function verileriGoster(aramaMetni = "", siralama = "isim-az") {
    const listeElement = document.getElementById('mekanlar-listesi');
    if (!listeElement) return;
    
    // Önce arama filtresi uygula
    let filtreliVeri = DB.mekanlar;
    if (aramaMetni) {
        aramaMetni = aramaMetni.toLowerCase();
        filtreliVeri = DB.mekanlar.filter(item => 
            item.isim.toLowerCase().includes(aramaMetni) || 
            (item.prompt && item.prompt.toLowerCase().includes(aramaMetni))
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
            <p>Hiç mekan bulunamadı.</p>
        </div>`;
        return;
    }
    
    // Mekanları listele
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
                        <i class="fas ${getCategoryIcon('mekanlar', item.kategori)}"></i>
                        ${getCategoryName('mekanlar', item.kategori)}
                    </div>
                    <div class="item-description">${kisalt(item.prompt, 100)}</div>
                    <div class="item-actions">
                        <button class="duzenle-btn" onclick="itemDuzenle('mekanlar', '${item.id}')">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="kopyala-btn" onclick="promptKopyala('${item.prompt.replace(/'/g, "\\'")}')">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                        <button class="sil-btn-small" onclick="itemSil('mekanlar', '${item.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Kart tıklama olaylarını ayarla
    document.querySelectorAll('#mekanlar-listesi .item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Butonlara tıkladığımızda kartın detay görüntüleme açılmasını engelle
            if (e.target.closest('.item-actions') || e.target.closest('button')) {
                return;
            }
            
            const id = this.dataset.id;
            mekanDetayGoster(id);
        });
    });
}

// Mekan detay görüntüleme
function mekanDetayGoster(id) {
    const veri = DB.mekanlar.find(item => item.id === id);
    if (!veri) return;
    
    let detayIcerik = `
        <h2 class="detay-baslik">${veri.isim}</h2>
        <div class="detay-kategori">
            <i class="fas ${getCategoryIcon('mekanlar', veri.kategori)}"></i>
            ${getCategoryName('mekanlar', veri.kategori)}
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
            <button class="duzenle-btn" onclick="itemDuzenle('mekanlar', '${id}')">
                <i class="fas fa-edit"></i> Düzenle
            </button>
            <button class="kopyala-btn" onclick="promptKopyala('${veri.prompt.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Promptu Kopyala
            </button>
            <button class="sil-btn" onclick="itemSil('mekanlar', '${id}')">
                <i class="fas fa-trash-alt"></i> Sil
            </button>
        </div>
    `;
    
    document.getElementById('detay-icerik').innerHTML = detayIcerik;
    modalKontrol('detay-modal', true);
}

// Mekan ekleme/düzenleme buton olaylarını ayarla
function butonOlaylariAyarla() {
    // Yeni Mekan Ekle butonu
    const yeniMekanBtn = document.getElementById('yeni-mekan-btn');
    if (yeniMekanBtn) {
        yeniMekanBtn.addEventListener('click', () => {
            document.getElementById('mekan-modal-baslik').textContent = 'Yeni Mekan Ekle';
            document.getElementById('mekan-form').reset();
            document.getElementById('mekan-form').removeAttribute('data-id');
            
            // Önizleme alanını temizle
            document.getElementById('mekan-gorsel-onizleme').innerHTML = '';
            document.getElementById('mekan-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
            
            modalKontrol('mekan-modal', true);
        });
    }

    // Mekan form işlemi
    const mekanForm = document.getElementById('mekan-form');
    if (mekanForm) {
        mekanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = this.dataset.id;
            const yeniMekan = {
                id: id || Date.now().toString(),
                isim: document.getElementById('mekan-isim').value,
                kategori: document.getElementById('mekan-kategori').value,
                prompt: document.getElementById('mekan-prompt').value,
                gorselUrl: document.getElementById('mekan-gorsel').value,
                eklemeTarihi: id ? DB.mekanlar.find(m => m.id === id).eklemeTarihi : new Date().toISOString()
            };
            
            if (id) {
                // Güncelleme
                const index = DB.mekanlar.findIndex(m => m.id === id);
                if (index !== -1) {
                    DB.mekanlar[index] = yeniMekan;
                    showToast("Mekan başarıyla güncellendi");
                }
            } else {
                // Yeni mekan ekleme
                DB.mekanlar.push(yeniMekan);
                showToast("Yeni mekan başarıyla eklendi");
            }
            
            verileriKaydet();
            verileriGoster();
            modalKontrol('mekan-modal', false);
        });
    }
}

// Mekan silme işlemi
function mekanSil(id) {
    const index = DB.mekanlar.findIndex(item => item.id === id);
    
    if (index !== -1) {
        DB.mekanlar.splice(index, 1);
        verileriKaydet();
        verileriGoster();
        return true;
    }
    
    return false;
}

// Mekan düzenleme işlemi
function mekanDuzenle(id) {
    const item = DB.mekanlar.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('mekan-modal-baslik').textContent = 'Mekanı Düzenle';
    document.getElementById('mekan-isim').value = item.isim;
    document.getElementById('mekan-kategori').value = item.kategori || 'diger';
    document.getElementById('mekan-prompt').value = item.prompt;
    document.getElementById('mekan-gorsel').value = item.gorselUrl || '';
    
    // Görsel önizleme
    if (item.gorselUrl) {
        document.getElementById('mekan-gorsel-onizleme').innerHTML = `<img src="${item.gorselUrl}" alt="${item.isim}">`;
    } else {
        document.getElementById('mekan-gorsel-onizleme').innerHTML = '';
    }
    
    // Dosya adını sıfırla
    document.getElementById('mekan-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
    
    document.getElementById('mekan-form').dataset.id = id;
    modalKontrol('mekan-modal', true);
}

// Dosya yükleme olaylarını ayarla
function dosyaYuklemeOlaylariAyarla() {
    // Mekan görseli
    const mekanInput = document.getElementById('mekan-gorsel-dosya');
    const mekanDosyaIsim = document.getElementById('mekan-gorsel-dosya-isim');
    const mekanOnizleme = document.getElementById('mekan-gorsel-onizleme');
    
    if (mekanInput) {
        mekanInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const dosya = this.files[0];
                mekanDosyaIsim.textContent = dosya.name;
                
                // Dosya yolunu oluştur
                const dosyaYolu = `assets/uploads/mekanlar/${dosya.name}`;
                
                // Görsel önizleme için geçici URL oluştur
                const geciciURL = URL.createObjectURL(dosya);
                mekanOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
                
                // Dosya yolunu form alanına kaydet
                document.getElementById('mekan-gorsel').value = dosyaYolu;
                
                // Kullanıcıya rehberlik
                showToast(`Yüklenen dosya: ${dosya.name}. Dosyayı 'assets/uploads/mekanlar/' klasörüne kaydettiğinizden emin olun.`, "info");
                
                // Geçici URL'yi kullandıktan sonra serbest bırak
                setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
            } else {
                mekanDosyaIsim.textContent = 'Dosya seçilmedi';
                mekanOnizleme.innerHTML = '';
            }
        });
    }
    
    // URL girişi önizleme olayı
    const mekanGorselInput = document.getElementById('mekan-gorsel');
    if (mekanGorselInput) {
        mekanGorselInput.addEventListener('input', function() {
            if (this.value) {
                mekanOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
            } else {
                mekanOnizleme.innerHTML = '';
            }
        });
    }
}

// Dışa aktarılacak fonksiyonlar
export {
    verileriGoster,
    mekanDetayGoster,
    butonOlaylariAyarla,
    mekanSil,
    mekanDuzenle,
    dosyaYuklemeOlaylariAyarla
};
