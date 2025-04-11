// Hazır Promptlar Module: Hazır promptların yönetimi ve görüntülenmesi

// İlgili modülleri içe aktar
import { DB, verileriKaydet, modalKontrol, getCategoryIcon, getCategoryName, kisalt, showToast } from './base.js';

// Tüm hazır promptları görüntüleme
function verileriGoster(aramaMetni = "", siralama = "isim-az") {
    const listeElement = document.getElementById('hazir-promptlar-listesi');
    if (!listeElement) return;
    
    // Eğer DB'de hazir_promptlar dizisi yoksa oluştur
    if (!DB.hazir_promptlar) {
        DB.hazir_promptlar = [];
        verileriKaydet();
    }
    
    // Önce arama filtresi uygula
    let filtreliVeri = DB.hazir_promptlar;
    if (aramaMetni) {
        aramaMetni = aramaMetni.toLowerCase();
        filtreliVeri = DB.hazir_promptlar.filter(item => 
            item.isim.toLowerCase().includes(aramaMetni) || 
            (item.icerik && item.icerik.toLowerCase().includes(aramaMetni))
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
            <p>Hiç hazır prompt bulunamadı.</p>
        </div>`;
        return;
    }
    
    // Hazır promptları listele
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
                        <i class="fas ${getHazirPromptIcon(item.kategori)}"></i>
                        ${getHazirPromptKategoriAdi(item.kategori)}
                    </div>
                    <div class="item-description">${kisalt(item.icerik, 100)}</div>
                    <div class="item-actions">
                        <button class="duzenle-btn" onclick="itemDuzenle('hazir_promptlar', '${item.id}')">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="kopyala-btn" onclick="promptKopyala('${item.icerik.replace(/'/g, "\\'")}')">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                        <button class="sil-btn-small" onclick="itemSil('hazir_promptlar', '${item.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Kart tıklama olaylarını ayarla
    document.querySelectorAll('#hazir-promptlar-listesi .item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Butonlara tıkladığımızda kartın detay görüntüleme açılmasını engelle
            if (e.target.closest('.item-actions') || e.target.closest('button')) {
                return;
            }
            
            const id = this.dataset.id;
            hazirPromptDetayGoster(id);
        });
    });
}

// Hazır prompt için kategori ikonu
function getHazirPromptIcon(kategori) {
    if (!kategori) return 'fa-tag';
    
    switch(kategori) {
        case 'poz':
            return 'fa-person-rays';
        case 'mekan':
            return 'fa-map-location-dot';
        case 'kiyafet':
            return 'fa-shirt';
        default:
            return 'fa-tag';
    }
}

// Hazır prompt kategorisi adı
function getHazirPromptKategoriAdi(kategori) {
    if (!kategori) return 'Genel';
    
    switch(kategori) {
        case 'poz':
            return 'Poz';
        case 'mekan':
            return 'Mekan';
        case 'kiyafet':
            return 'Kıyafet';
        default:
            return 'Diğer';
    }
}

// Hazır prompt detay görüntüleme
function hazirPromptDetayGoster(id) {
    const veri = DB.hazir_promptlar.find(item => item.id === id);
    if (!veri) return;
    
    let detayIcerik = `
        <h2 class="detay-baslik">${veri.isim}</h2>
        <div class="detay-kategori">
            <i class="fas ${getHazirPromptIcon(veri.kategori)}"></i>
            ${getHazirPromptKategoriAdi(veri.kategori)}
        </div>
    `;
    
    if (veri.gorselUrl) {
        detayIcerik += `<img src="${veri.gorselUrl}" alt="${veri.isim}" class="detay-gorsel">`;
    }
    
    detayIcerik += `
        <div class="detay-prompt">
            <div class="detay-prompt-baslik">
                <i class="fas fa-quote-left"></i> Prompt İçeriği
            </div>
            ${veri.icerik}
        </div>
        
        <div class="detay-butonlar">
            <button class="duzenle-btn" onclick="itemDuzenle('hazir_promptlar', '${id}')">
                <i class="fas fa-edit"></i> Düzenle
            </button>
            <button class="kopyala-btn" onclick="promptKopyala('${veri.icerik.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Promptu Kopyala
            </button>
            <button class="sil-btn" onclick="itemSil('hazir_promptlar', '${id}')">
                <i class="fas fa-trash-alt"></i> Sil
            </button>
        </div>
    `;
    
    document.getElementById('detay-icerik').innerHTML = detayIcerik;
    modalKontrol('detay-modal', true);
}

// Hazır prompt ekleme/düzenleme buton olaylarını ayarla
function butonOlaylariAyarla() {
    // Yeni Hazır Prompt Ekle butonu
    const yeniHazirPromptBtn = document.getElementById('yeni-hazir-prompt-btn');
    if (yeniHazirPromptBtn) {
        yeniHazirPromptBtn.addEventListener('click', () => {
            document.getElementById('hazir-prompt-modal-baslik').textContent = 'Yeni Hazır Prompt Ekle';
            document.getElementById('hazir-prompt-form').reset();
            document.getElementById('hazir-prompt-form').removeAttribute('data-id');
            
            // Önizleme alanını temizle
            document.getElementById('hazir-prompt-gorsel-onizleme').innerHTML = '';
            document.getElementById('hazir-prompt-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
            
            modalKontrol('hazir-prompt-modal', true);
        });
    }

    // Hazır prompt form işlemi
    const hazirPromptForm = document.getElementById('hazir-prompt-form');
    if (hazirPromptForm) {
        hazirPromptForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = this.dataset.id;
            const yeniHazirPrompt = {
                id: id || Date.now().toString(),
                isim: document.getElementById('hazir-prompt-isim').value,
                kategori: document.getElementById('hazir-prompt-kategori').value,
                icerik: document.getElementById('hazir-prompt-icerik').value,
                gorselUrl: document.getElementById('hazir-prompt-gorsel').value,
                eklemeTarihi: id ? DB.hazir_promptlar.find(k => k.id === id)?.eklemeTarihi : new Date().toISOString()
            };
            
            // hazir_promptlar dizisini kontrol et ve gerekirse oluştur
            if (!DB.hazir_promptlar) {
                DB.hazir_promptlar = [];
            }
            
            if (id) {
                // Güncelleme
                const index = DB.hazir_promptlar.findIndex(k => k.id === id);
                if (index !== -1) {
                    DB.hazir_promptlar[index] = yeniHazirPrompt;
                    showToast("Hazır prompt başarıyla güncellendi");
                }
            } else {
                // Yeni hazır prompt ekleme
                DB.hazir_promptlar.push(yeniHazirPrompt);
                showToast("Yeni hazır prompt başarıyla eklendi");
            }
            
            verileriKaydet();
            verileriGoster();
            modalKontrol('hazir-prompt-modal', false);
        });
    }
}

// Hazır prompt silme işlemi
function hazirPromptSil(id) {
    if (!DB.hazir_promptlar) return false;
    
    const index = DB.hazir_promptlar.findIndex(item => item.id === id);
    
    if (index !== -1) {
        DB.hazir_promptlar.splice(index, 1);
        verileriKaydet();
        verileriGoster();
        return true;
    }
    
    return false;
}

// Hazır prompt düzenleme işlemi
function hazirPromptDuzenle(id) {
    if (!DB.hazir_promptlar) return;
    
    const item = DB.hazir_promptlar.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('hazir-prompt-modal-baslik').textContent = 'Hazır Promptu Düzenle';
    document.getElementById('hazir-prompt-isim').value = item.isim;
    document.getElementById('hazir-prompt-kategori').value = item.kategori || 'diger';
    document.getElementById('hazir-prompt-icerik').value = item.icerik;
    document.getElementById('hazir-prompt-gorsel').value = item.gorselUrl || '';
    
    // Görsel önizleme
    if (item.gorselUrl) {
        document.getElementById('hazir-prompt-gorsel-onizleme').innerHTML = `<img src="${item.gorselUrl}" alt="${item.isim}">`;
    } else {
        document.getElementById('hazir-prompt-gorsel-onizleme').innerHTML = '';
    }
    
    // Dosya adını sıfırla
    document.getElementById('hazir-prompt-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
    
    document.getElementById('hazir-prompt-form').dataset.id = id;
    modalKontrol('hazir-prompt-modal', true);
}

// Dosya yükleme olaylarını ayarla
function dosyaYuklemeOlaylariAyarla() {
    // Hazır prompt görseli
    const hazirPromptInput = document.getElementById('hazir-prompt-gorsel-dosya');
    const hazirPromptDosyaIsim = document.getElementById('hazir-prompt-gorsel-dosya-isim');
    const hazirPromptOnizleme = document.getElementById('hazir-prompt-gorsel-onizleme');
    
    if (hazirPromptInput) {
        hazirPromptInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const dosya = this.files[0];
                hazirPromptDosyaIsim.textContent = dosya.name;
                
                // Dosya yolunu oluştur
                const dosyaYolu = `assets/uploads/hazir_promptlar/${dosya.name}`;
                
                // Görsel önizleme için geçici URL oluştur
                const geciciURL = URL.createObjectURL(dosya);
                hazirPromptOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
                
                // Dosya yolunu form alanına kaydet
                document.getElementById('hazir-prompt-gorsel').value = dosyaYolu;
                
                // Kullanıcıya rehberlik
                showToast(`Yüklenen dosya: ${dosya.name}. Dosyayı 'assets/uploads/hazir_promptlar/' klasörüne kaydettiğinizden emin olun.`, "info");
                
                // Geçici URL'yi kullandıktan sonra serbest bırak
                setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
            } else {
                hazirPromptDosyaIsim.textContent = 'Dosya seçilmedi';
                hazirPromptOnizleme.innerHTML = '';
            }
        });
    }
    
    // URL girişi önizleme olayı
    const hazirPromptGorselInput = document.getElementById('hazir-prompt-gorsel');
    if (hazirPromptGorselInput) {
        hazirPromptGorselInput.addEventListener('input', function() {
            if (this.value) {
                hazirPromptOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
            } else {
                hazirPromptOnizleme.innerHTML = '';
            }
        });
    }
}

// Boğaz Manzaralı Pozu ekle
function bogazManzaraliPozuEkle() {
    // hazir_promptlar dizisini kontrol et ve gerekirse oluştur
    if (!DB.hazir_promptlar) {
        DB.hazir_promptlar = [];
    }
    
    // ID'yi kontrol et ve eğer aynı ID'li bir öğe varsa tekrar eklemeyi önle
    const mevcut = DB.hazir_promptlar.find(item => item.isim === "İstanbul Boğaz Manzaralı Poz");
    if (mevcut) {
        console.log("Boğaz Manzaralı Poz zaten eklenmiş.");
        return;
    }
    
    // Yeni hazır prompt oluştur
    const yeniPrompt = {
        id: "bogaz-manzarali-poz-" + Date.now().toString(),
        isim: "İstanbul Boğaz Manzaralı Poz",
        kategori: "poz",
        icerik: `Boğaz manzaralı İstanbul dairesinde kiremit-turuncu renkli koltukta oturan zarif kadın. Koltukta rahat bir şekilde oturuyor, vücut hafif sağa dönük, bacaklar şık biçimde yana çaprazlanmış. Sağ kolunu koltuğun kenarına yerleştirmiş, sol eli ise hafifçe dizinde duruyor. 

Üzerinde oda renklerine uyumlu, kahverengi-toprak tonlarında ipek bir elbise. Elbise vücuda hafifçe oturan, dizlerin üzerinde, ince askılı ve dekolteli bir model. Kumaş ışıkta zarif bir şekilde parıldıyor. Ayaklarında minimal tasarımlı altın-bronz tonlarında ince topuklu sandalet. 

Saçları dalgalı, bal rengi-sarı tonlarında ve omuzlarına dökülüyor. Makyajı doğal ancak göz alıcı, dudaklar nude-pembemsi bir tonla renklendirilmiş. Takı olarak ince altın kolye, minimal küpeler ve birkaç ince bilezik. 

Duruşu kendinden emin ve zarif. Hafif gülümsüyor ve kameraya doğru sakin bir bakış yöneltiyor. Arka planda Boğaz Köprüsü ve İstanbul manzarası, öğleden sonra ışığı odayı ve kadını sıcak bir tonla aydınlatıyor. Kadının kıyafeti ve ten rengi, odanın sıcak toprak tonları ve turuncu-kiremit renkleriyle mükemmel uyum içinde.

Yüksek çözünürlüklü, profesyonel aydınlatma, lifestyle ve iç mimari fotoğrafçılığı kalitesinde, gerçekçi detaylar.`,
        gorselUrl: "assets/uploads/kiyafetler/Istanbul_Bogaz_Manzarali_Poz.png",
        eklemeTarihi: new Date().toISOString()
    };
    
    // DB'ye ekle
    DB.hazir_promptlar.push(yeniPrompt);
    verileriKaydet();
    
    console.log("Boğaz Manzaralı Poz başarıyla eklendi.");
    showToast("Boğaz Manzaralı Poz başarıyla eklendi.", "success");
}

// Dışa aktarılacak fonksiyonlar
export {
    verileriGoster,
    hazirPromptDetayGoster,
    butonOlaylariAyarla,
    hazirPromptSil,
    hazirPromptDuzenle,
    dosyaYuklemeOlaylariAyarla,
    bogazManzaraliPozuEkle
};
