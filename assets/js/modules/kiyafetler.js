// Kıyafetler Module: Kıyafetlerin yönetimi ve görüntülenmesi

// İlgili modülleri içe aktar
import { DB, verileriKaydet, modalKontrol, getCategoryIcon, getCategoryName, kisalt, showToast } from './base.js';

// Kıyafetleri görüntüleme
function verileriGoster(aramaMetni = "", siralama = "isim-az") {
    const listeElement = document.getElementById('kiyafetler-listesi');
    if (!listeElement) return;
    
    // Önce arama filtresi uygula
    let filtreliVeri = DB.kiyafetler;
    if (aramaMetni) {
        aramaMetni = aramaMetni.toLowerCase();
        filtreliVeri = DB.kiyafetler.filter(item => 
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
            <p>Hiç kıyafet bulunamadı.</p>
        </div>`;
        return;
    }
    
    // Kıyafetleri listele
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
                        <i class="fas ${getCategoryIcon('kiyafetler', item.kategori)}"></i>
                        ${getCategoryName('kiyafetler', item.kategori)}
                    </div>
                    <div class="item-description">${kisalt(item.prompt, 100)}</div>
                    <div class="item-actions">
                        <button class="duzenle-btn" onclick="itemDuzenle('kiyafetler', '${item.id}')">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="kopyala-btn" onclick="promptKopyala('${item.prompt.replace(/'/g, "\\'")}')">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                        <button class="sil-btn-small" onclick="itemSil('kiyafetler', '${item.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Kart tıklama olaylarını ayarla
    document.querySelectorAll('#kiyafetler-listesi .item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Butonlara tıkladığımızda kartın detay görüntüleme açılmasını engelle
            if (e.target.closest('.item-actions') || e.target.closest('button')) {
                return;
            }
            
            const id = this.dataset.id;
            kiyafetDetayGoster(id);
        });
    });
}

// Kıyafet detay görüntüleme
function kiyafetDetayGoster(id) {
    const veri = DB.kiyafetler.find(item => item.id === id);
    if (!veri) return;
    
    let detayIcerik = `
        <h2 class="detay-baslik">${veri.isim}</h2>
        <div class="detay-kategori">
            <i class="fas ${getCategoryIcon('kiyafetler', veri.kategori)}"></i>
            ${getCategoryName('kiyafetler', veri.kategori)}
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
            <button class="duzenle-btn" onclick="itemDuzenle('kiyafetler', '${id}')">
                <i class="fas fa-edit"></i> Düzenle
            </button>
            <button class="kopyala-btn" onclick="promptKopyala('${veri.prompt.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Promptu Kopyala
            </button>
            <button class="sil-btn" onclick="itemSil('kiyafetler', '${id}')">
                <i class="fas fa-trash-alt"></i> Sil
            </button>
        </div>
    `;
    
    document.getElementById('detay-icerik').innerHTML = detayIcerik;
    modalKontrol('detay-modal', true);
}

// Kıyafet ekleme/düzenleme buton olaylarını ayarla
function butonOlaylariAyarla() {
    // Yeni Kıyafet Ekle butonu
    const yeniKiyafetBtn = document.getElementById('yeni-kiyafet-btn');
    if (yeniKiyafetBtn) {
        yeniKiyafetBtn.addEventListener('click', () => {
            document.getElementById('kiyafet-modal-baslik').textContent = 'Yeni Kıyafet Ekle';
            document.getElementById('kiyafet-form').reset();
            document.getElementById('kiyafet-form').removeAttribute('data-id');
            
            // Önizleme alanını temizle
            document.getElementById('kiyafet-gorsel-onizleme').innerHTML = '';
            document.getElementById('kiyafet-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
            
            modalKontrol('kiyafet-modal', true);
        });
    }

    // Kıyafet form işlemi
    const kiyafetForm = document.getElementById('kiyafet-form');
    if (kiyafetForm) {
        kiyafetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = this.dataset.id;
            const yeniKiyafet = {
                id: id || Date.now().toString(),
                isim: document.getElementById('kiyafet-isim').value,
                kategori: document.getElementById('kiyafet-kategori').value,
                prompt: document.getElementById('kiyafet-prompt').value,
                gorselUrl: document.getElementById('kiyafet-gorsel').value,
                eklemeTarihi: id ? DB.kiyafetler.find(k => k.id === id).eklemeTarihi : new Date().toISOString()
            };
            
            if (id) {
                // Güncelleme
                const index = DB.kiyafetler.findIndex(k => k.id === id);
                if (index !== -1) {
                    DB.kiyafetler[index] = yeniKiyafet;
                    showToast("Kıyafet başarıyla güncellendi");
                }
            } else {
                // Yeni kıyafet ekleme
                DB.kiyafetler.push(yeniKiyafet);
                showToast("Yeni kıyafet başarıyla eklendi");
            }
            
            verileriKaydet();
            verileriGoster();
            modalKontrol('kiyafet-modal', false);
        });
    }
}

// Kıyafet silme işlemi
function kiyafetSil(id) {
    const index = DB.kiyafetler.findIndex(item => item.id === id);
    
    if (index !== -1) {
        DB.kiyafetler.splice(index, 1);
        verileriKaydet();
        verileriGoster();
        return true;
    }
    
    return false;
}

// Kıyafet düzenleme işlemi
function kiyafetDuzenle(id) {
    const item = DB.kiyafetler.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('kiyafet-modal-baslik').textContent = 'Kıyafeti Düzenle';
    document.getElementById('kiyafet-isim').value = item.isim;
    document.getElementById('kiyafet-kategori').value = item.kategori || 'diger';
    document.getElementById('kiyafet-prompt').value = item.prompt;
    document.getElementById('kiyafet-gorsel').value = item.gorselUrl || '';
    
    // Görsel önizleme
    if (item.gorselUrl) {
        document.getElementById('kiyafet-gorsel-onizleme').innerHTML = `<img src="${item.gorselUrl}" alt="${item.isim}">`;
    } else {
        document.getElementById('kiyafet-gorsel-onizleme').innerHTML = '';
    }
    
    // Dosya adını sıfırla
    document.getElementById('kiyafet-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
    
    document.getElementById('kiyafet-form').dataset.id = id;
    modalKontrol('kiyafet-modal', true);
}

// Dosya yükleme olaylarını ayarla
function dosyaYuklemeOlaylariAyarla() {
    // Kıyafet görseli
    const kiyafetInput = document.getElementById('kiyafet-gorsel-dosya');
    const kiyafetDosyaIsim = document.getElementById('kiyafet-gorsel-dosya-isim');
    const kiyafetOnizleme = document.getElementById('kiyafet-gorsel-onizleme');
    
    if (kiyafetInput) {
        kiyafetInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const dosya = this.files[0];
                kiyafetDosyaIsim.textContent = dosya.name;
                
                // Dosya yolunu oluştur
                const dosyaYolu = `assets/uploads/kiyafetler/${dosya.name}`;
                
                // Görsel önizleme için geçici URL oluştur
                const geciciURL = URL.createObjectURL(dosya);
                kiyafetOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
                
                // Dosya yolunu form alanına kaydet
                document.getElementById('kiyafet-gorsel').value = dosyaYolu;
                
                // Kullanıcıya rehberlik
                showToast(`Yüklenen dosya: ${dosya.name}. Dosyayı 'assets/uploads/kiyafetler/' klasörüne kaydettiğinizden emin olun.`, "info");
                
                // Geçici URL'yi kullandıktan sonra serbest bırak
                setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
            } else {
                kiyafetDosyaIsim.textContent = 'Dosya seçilmedi';
                kiyafetOnizleme.innerHTML = '';
            }
        });
    }
    
    // URL girişi önizleme olayı
    const kiyafetGorselInput = document.getElementById('kiyafet-gorsel');
    if (kiyafetGorselInput) {
        kiyafetGorselInput.addEventListener('input', function() {
            if (this.value) {
                kiyafetOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
            } else {
                kiyafetOnizleme.innerHTML = '';
            }
        });
    }
}

// Dışa aktarılacak fonksiyonlar
export {
    verileriGoster,
    kiyafetDetayGoster,
    butonOlaylariAyarla,
    kiyafetSil,
    kiyafetDuzenle,
    dosyaYuklemeOlaylariAyarla
};
