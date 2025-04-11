// Karakterler Module: Karakterlerin yönetimi ve görüntülenmesi

// İlgili modülleri içe aktar
import { DB, verileriKaydet, modalKontrol, getCategoryIcon, kisalt, showToast } from './base.js';

// Karakterleri görüntüleme
function verileriGoster(aramaMetni = "", siralama = "isim-az") {
    const listeElement = document.getElementById('karakterler-listesi');
    if (!listeElement) return;
    
    // Önce arama filtresi uygula
    let filtreliVeri = DB.karakterler;
    if (aramaMetni) {
        aramaMetni = aramaMetni.toLowerCase();
        filtreliVeri = DB.karakterler.filter(item => 
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
            <p>Hiç karakter bulunamadı.</p>
        </div>`;
        return;
    }
    
    // Karakterleri listele
    filtreliVeri.forEach(item => {
        listeElement.innerHTML += `
            <div class="item-card" data-id="${item.id}">
                <div class="character-images">
                    <div class="character-face">
                        ${item.gorselYuzUrl 
                            ? `<img src="${item.gorselYuzUrl}" alt="${item.isim} yüz" class="face-img">`
                            : `<div class="item-image-placeholder"><i class="fas fa-user"></i></div>`
                        }
                    </div>
                    <div class="character-full">
                        ${item.gorselBoyUrl 
                            ? `<img src="${item.gorselBoyUrl}" alt="${item.isim} boy" class="full-img">`
                            : `<div class="item-image-placeholder"><i class="fas fa-user-alt"></i></div>`
                        }
                    </div>
                </div>
                <div class="item-content">
                    <h3 class="item-title">${item.isim}</h3>
                    <div class="item-category">
                        <i class="fas ${getCategoryIcon('karakterler', 'karakter')}"></i>
                        ${item.yas ? `${item.yas} yaş` : ''} 
                        ${item.boy ? `${item.boy} cm` : ''}
                    </div>
                    <div class="item-description">${kisalt(item.prompt, 100)}</div>
                    <div class="item-actions">
                        <button class="duzenle-btn" onclick="itemDuzenle('karakterler', '${item.id}')">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="kopyala-btn" onclick="promptKopyala('${item.prompt.replace(/'/g, "\\'")}')">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                        <button class="sil-btn-small" onclick="itemSil('karakterler', '${item.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Kart tıklama olaylarını ayarla
    document.querySelectorAll('#karakterler-listesi .item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Butonlara tıkladığımızda kartın detay görüntüleme açılmasını engelle
            if (e.target.closest('.item-actions') || e.target.closest('button')) {
                return;
            }
            
            const id = this.dataset.id;
            karakterDetayGoster(id);
        });
    });
}

// Karakter detay görüntüleme
function karakterDetayGoster(id) {
    const veri = DB.karakterler.find(item => item.id === id);
    if (!veri) return;
    
    let detayIcerik = `
        <h2 class="detay-baslik">${veri.isim}</h2>
        <div class="detay-kategori">
            <i class="fas ${getCategoryIcon('karakterler', 'karakter')}"></i>
            Karakter
        </div>
        
        <div class="karakter-gorseller">
            ${veri.gorselYuzUrl ? 
                `<div class="gorsel-container">
                    <h4>Yüz</h4>
                    <img src="${veri.gorselYuzUrl}" alt="${veri.isim} yüz" class="detay-gorsel-karakter">
                </div>` : ''
            }
            ${veri.gorselBoyUrl ? 
                `<div class="gorsel-container">
                    <h4>Boy</h4>
                    <img src="${veri.gorselBoyUrl}" alt="${veri.isim} boy" class="detay-gorsel-karakter">
                </div>` : ''
            }
        </div>
    `;
    
    if (veri.yas) {
        detayIcerik += `<p class="detay-bilgi"><strong>Yaş:</strong> ${veri.yas}</p>`;
    }
    if (veri.boy) {
        detayIcerik += `<p class="detay-bilgi"><strong>Boy:</strong> ${veri.boy} cm</p>`;
    }
    
    // Karakter Pozları Bölümü
    detayIcerik += `
        <div class="karakter-pozlar">
            <h3 class="detay-bolum-baslik"><i class="fas fa-walking"></i> Karakterin Pozları</h3>
            <div class="poz-listesi">
                ${veri.pozlar && veri.pozlar.length > 0 ? 
                    veri.pozlar.map(pozId => {
                        const poz = pozTanimlari.find(p => p.id === pozId);
                        return poz ? `
                            <div class="poz-item" data-id="${poz.id}">
                                <h4>${poz.isim}</h4>
                                <p>${poz.aciklama}</p>
                                <button class="sil-btn-small poz-sil-btn" onclick="pozuKarakterdenSil('${veri.id}', '${poz.id}')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        ` : '';
                    }).join('') :
                    `<p class="bos-mesaj">Bu karakter için henüz poz eklenmemiş.</p>`
                }
            </div>
            
            <div class="poz-ekle">
                <h4>Yeni Poz Ekle</h4>
                <select id="poz-secim">
                    <option value="">Bir poz seçin...</option>
                    ${pozTanimlari.map(poz => {
                        const mevcutMu = veri.pozlar && veri.pozlar.includes(poz.id);
                        return `<option value="${poz.id}" ${mevcutMu ? 'disabled' : ''}>${poz.isim} ${mevcutMu ? '(Eklenmiş)' : ''}</option>`;
                    }).join('')}
                </select>
                <button class="ekle-btn" onclick="pozuKaraktereEkle('${veri.id}', document.getElementById('poz-secim').value)">
                    <i class="fas fa-plus"></i> Ekle
                </button>
            </div>
        </div>
    `;
    
    detayIcerik += `
        <div class="detay-prompt">
            <div class="detay-prompt-baslik">
                <i class="fas fa-quote-left"></i> Prompt
            </div>
            ${veri.prompt}
        </div>
        
        <div class="detay-butonlar">
            <button class="duzenle-btn" onclick="itemDuzenle('karakterler', '${id}')">
                <i class="fas fa-edit"></i> Düzenle
            </button>
            <button class="kopyala-btn" onclick="promptKopyala('${veri.prompt.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Promptu Kopyala
            </button>
            <button class="sil-btn" onclick="itemSil('karakterler', '${id}')">
                <i class="fas fa-trash-alt"></i> Sil
            </button>
        </div>
    `;
    
    document.getElementById('detay-icerik').innerHTML = detayIcerik;
    modalKontrol('detay-modal', true);
}

// Karakter ekleme/düzenleme buton olaylarını ayarla
function butonOlaylariAyarla() {
    // Yeni Karakter Ekle butonu
    const yeniKarakterBtn = document.getElementById('yeni-karakter-btn');
    if (yeniKarakterBtn) {
        yeniKarakterBtn.addEventListener('click', () => {
            document.getElementById('karakter-modal-baslik').textContent = 'Yeni Karakter Ekle';
            document.getElementById('karakter-form').reset();
            document.getElementById('karakter-form').removeAttribute('data-id');
            
            // Önizleme alanlarını temizle
            document.getElementById('karakter-gorsel-yuz-onizleme').innerHTML = '';
            document.getElementById('karakter-gorsel-boy-onizleme').innerHTML = '';
            document.getElementById('karakter-gorsel-yuz-dosya-isim').textContent = 'Dosya seçilmedi';
            document.getElementById('karakter-gorsel-boy-dosya-isim').textContent = 'Dosya seçilmedi';
            
            modalKontrol('karakter-modal', true);
        });
    }

    // Karakter form işlemi
    const karakterForm = document.getElementById('karakter-form');
    if (karakterForm) {
        karakterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = this.dataset.id;
            const yeniKarakter = {
                id: id || Date.now().toString(),
                isim: document.getElementById('karakter-isim').value,
                yas: document.getElementById('karakter-yas').value,
                boy: document.getElementById('karakter-boy').value,
                prompt: document.getElementById('karakter-prompt').value,
                gorselYuzUrl: document.getElementById('karakter-gorsel-yuz').value,
                gorselBoyUrl: document.getElementById('karakter-gorsel-boy').value,
                eklemeTarihi: id ? DB.karakterler.find(k => k.id === id).eklemeTarihi : new Date().toISOString(),
                pozlar: id ? DB.karakterler.find(k => k.id === id).pozlar || [] : []
            };
            
            if (id) {
                // Güncelleme
                const index = DB.karakterler.findIndex(k => k.id === id);
                if (index !== -1) {
                    DB.karakterler[index] = yeniKarakter;
                    showToast("Karakter başarıyla güncellendi");
                }
            } else {
                // Yeni karakter ekleme
                DB.karakterler.push(yeniKarakter);
                showToast("Yeni karakter başarıyla eklendi");
            }
            
            verileriKaydet();
            verileriGoster();
            modalKontrol('karakter-modal', false);
        });
    }
}

// Karakter silme işlemi
function karakterSil(id) {
    const index = DB.karakterler.findIndex(item => item.id === id);
    
    if (index !== -1) {
        DB.karakterler.splice(index, 1);
        verileriKaydet();
        verileriGoster();
        return true;
    }
    
    return false;
}

// Karakter düzenleme işlemi
function karakterDuzenle(id) {
    const item = DB.karakterler.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('karakter-modal-baslik').textContent = 'Karakteri Düzenle';
    document.getElementById('karakter-isim').value = item.isim;
    document.getElementById('karakter-yas').value = item.yas || '';
    document.getElementById('karakter-boy').value = item.boy || '';
    document.getElementById('karakter-prompt').value = item.prompt;
    document.getElementById('karakter-gorsel-yuz').value = item.gorselYuzUrl || '';
    document.getElementById('karakter-gorsel-boy').value = item.gorselBoyUrl || '';
    
    // Görsel önizlemeleri
    if (item.gorselYuzUrl) {
        document.getElementById('karakter-gorsel-yuz-onizleme').innerHTML = `<img src="${item.gorselYuzUrl}" alt="${item.isim} yüz">`;
    } else {
        document.getElementById('karakter-gorsel-yuz-onizleme').innerHTML = '';
    }
    
    if (item.gorselBoyUrl) {
        document.getElementById('karakter-gorsel-boy-onizleme').innerHTML = `<img src="${item.gorselBoyUrl}" alt="${item.isim} boy">`;
    } else {
        document.getElementById('karakter-gorsel-boy-onizleme').innerHTML = '';
    }
    
    // Dosya adlarını sıfırla
    document.getElementById('karakter-gorsel-yuz-dosya-isim').textContent = 'Dosya seçilmedi';
    document.getElementById('karakter-gorsel-boy-dosya-isim').textContent = 'Dosya seçilmedi';
    
    document.getElementById('karakter-form').dataset.id = id;
    modalKontrol('karakter-modal', true);
}

// Poza karakter ekleme
function pozaKarakterEkle(karakterId, pozId) {
    if (!pozId) return false;
    
    const karakterIndex = DB.karakterler.findIndex(k => k.id === karakterId);
    if (karakterIndex === -1) return false;
    
    // Eğer pozlar dizisi yoksa oluştur
    if (!DB.karakterler[karakterIndex].pozlar) {
        DB.karakterler[karakterIndex].pozlar = [];
    }
    
    // Poz zaten eklenmişse false dön
    if (DB.karakterler[karakterIndex].pozlar.includes(pozId)) {
        return false;
    }
    
    // Pozu ekle
    DB.karakterler[karakterIndex].pozlar.push(pozId);
    
    // Verileri kaydet
    verileriKaydet();
    return true;
}

// Pozdan karakter sil
function pozaKarakterSil(karakterId, pozId) {
    const karakterIndex = DB.karakterler.findIndex(k => k.id === karakterId);
    if (karakterIndex === -1) return false;
    
    // Karakter pozları var mı kontrol et
    if (!DB.karakterler[karakterIndex].pozlar) {
        return false;
    }
    
    // Pozun indeksini bul
    const pozIndex = DB.karakterler[karakterIndex].pozlar.indexOf(pozId);
    if (pozIndex === -1) return false;
    
    // Pozu sil
    DB.karakterler[karakterIndex].pozlar.splice(pozIndex, 1);
    
    // Verileri kaydet
    verileriKaydet();
    return true;
}

// Dosya yükleme olaylarını ayarla
function dosyaYuklemeOlaylariAyarla() {
    // Yüz görseli yükleme
    const yuzInput = document.getElementById('karakter-gorsel-yuz-dosya');
    const yuzDosyaIsim = document.getElementById('karakter-gorsel-yuz-dosya-isim');
    const yuzOnizleme = document.getElementById('karakter-gorsel-yuz-onizleme');
    
    if (yuzInput) {
        yuzInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const dosya = this.files[0];
                yuzDosyaIsim.textContent = dosya.name;
                
                // Dosya yolunu oluştur
                const dosyaYolu = `assets/uploads/karakterler/${dosya.name}`;
                
                // Görsel önizleme için geçici URL oluştur
                const geciciURL = URL.createObjectURL(dosya);
                yuzOnizleme.innerHTML = `<img src="${geciciURL}" alt="Yüz Önizleme">`;
                
                // Dosya yolunu form alanına kaydet
                document.getElementById('karakter-gorsel-yuz').value = dosyaYolu;
                
                // Kullanıcıya rehberlik
                showToast(`Yüklenen dosya: ${dosya.name}. Dosyayı 'assets/uploads/karakterler/' klasörüne kaydettiğinizden emin olun.`, "info");
                
                // Geçici URL'yi kullandıktan sonra serbest bırak
                setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
            } else {
                yuzDosyaIsim.textContent = 'Dosya seçilmedi';
                yuzOnizleme.innerHTML = '';
            }
        });
    }
    
    // Boy görseli yükleme
    const boyInput = document.getElementById('karakter-gorsel-boy-dosya');
    const boyDosyaIsim = document.getElementById('karakter-gorsel-boy-dosya-isim');
    const boyOnizleme = document.getElementById('karakter-gorsel-boy-onizleme');
    
    if (boyInput) {
        boyInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const dosya = this.files[0];
                boyDosyaIsim.textContent = dosya.name;
                
                // Dosya yolunu oluştur
                const dosyaYolu = `assets/uploads/karakterler/${dosya.name}`;
                
                // Görsel önizleme için geçici URL oluştur
                const geciciURL = URL.createObjectURL(dosya);
                boyOnizleme.innerHTML = `<img src="${geciciURL}" alt="Boy Önizleme">`;
                
                // Dosya yolunu form alanına kaydet
                document.getElementById('karakter-gorsel-boy').value = dosyaYolu;
                
                // Kullanıcıya rehberlik
                showToast(`Yüklenen dosya: ${dosya.name}. Dosyayı 'assets/uploads/karakterler/' klasörüne kaydettiğinizden emin olun.`, "info");
                
                // Geçici URL'yi kullandıktan sonra serbest bırak
                setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
            } else {
                boyDosyaIsim.textContent = 'Dosya seçilmedi';
                boyOnizleme.innerHTML = '';
            }
        });
    }
    
    // URL girişi önizlemeleri
    const yuzUrlInput = document.getElementById('karakter-gorsel-yuz');
    if (yuzUrlInput) {
        yuzUrlInput.addEventListener('input', function() {
            if (this.value) {
                yuzOnizleme.innerHTML = `<img src="${this.value}" alt="Yüz Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
            } else {
                yuzOnizleme.innerHTML = '';
            }
        });
    }
    
    const boyUrlInput = document.getElementById('karakter-gorsel-boy');
    if (boyUrlInput) {
        boyUrlInput.addEventListener('input', function() {
            if (this.value) {
                boyOnizleme.innerHTML = `<img src="${this.value}" alt="Boy Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
            } else {
                boyOnizleme.innerHTML = '';
            }
        });
    }
}

// Dışa aktarılacak fonksiyonlar
export {
    verileriGoster,
    karakterDetayGoster,
    butonOlaylariAyarla,
    karakterSil,
    karakterDuzenle,
    pozaKarakterEkle,
    pozaKarakterSil,
    dosyaYuklemeOlaylariAyarla
};
