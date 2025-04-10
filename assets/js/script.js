// Toast Bildirimi Göster
function showToast(message, type = "success") {
    // Eğer zaten açık bir toast varsa kapat
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }
    
    // Toast elemanını oluştur
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon seç
    let icon = 'check-circle';
    if (type === 'error') icon = 'times-circle';
    if (type === 'warning') icon = 'exclamation-circle';
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
    
    // Toast'u ekle
    document.body.appendChild(toast);
    
    // Belirli bir süre sonra kapat
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// Veri Modelimiz 
const DB = {
    karakterler: [],
    kiyafetler: [],
    mekanlar: [],
    diger: []
};

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Verileri localStorage'dan yükle
    verileriYukle();
    
    // Navigasyon olaylarını ayarla
    navigasyonuAyarla();
    
    // Buton olaylarını ayarla
    butonOlaylariAyarla();
    
    // Form olaylarını ayarla
    formOlaylariAyarla();
    
    // Dosya yükleme olaylarını ayarla
    dosyaYuklemeOlaylariAyarla();
    
    // Arama ve filtreleme olaylarını ayarla
    aramaFiltrelemeAyarla();
    
    // Mixer olaylarını ayarla
    mixerOlaylariAyarla();
    
    // Fotoğraf türleri bölümünü doldur
    fotografTurleriniDoldur();
    
    // Örnek verileri yükle (eğer veritabanı boşsa)
    ornekVerileriYukle();
    
    // İlk sekmedeki içeriği göster
    verileriGoster('karakterler');
});

// Fotoğraf türleri bölümünü doldur
function fotografTurleriniDoldur() {
    // Çekim türlerini doldur
    const cekimTurleriListesi = document.getElementById('cekim-turleri-listesi');
    if (cekimTurleriListesi) {
        cekimTurleriListesi.innerHTML = '';
        fotografCekimTurleri.forEach(tur => {
            cekimTurleriListesi.innerHTML += `
                <div class="fotograf-turu ${tur.id}">
                    <i class="fas ${tur.icon}"></i>
                    <span>${tur.isim}</span>
                    <div class="aciklama-tooltip">${tur.aciklama}</div>
                </div>
            `;
        });
    }
    
    // Çekim açılarını doldur
    const cekimAcilariListesi = document.getElementById('cekim-acilari-listesi');
    if (cekimAcilariListesi) {
        cekimAcilariListesi.innerHTML = '';
        fotografCekimAcilari.forEach(aci => {
            cekimAcilariListesi.innerHTML += `
                <div class="fotograf-turu ${aci.id}">
                    <i class="fas ${aci.icon}"></i>
                    <span>${aci.isim}</span>
                    <div class="aciklama-tooltip">${aci.aciklama}</div>
                </div>
            `;
        });
    }
}

// Verileri localStorage'dan yükle
function verileriYukle() {
    if (localStorage.getItem('influencerDB')) {
        const kaydedilmisVeri = JSON.parse(localStorage.getItem('influencerDB'));
        
        // Veri modelimizi güncelle
        DB.karakterler = kaydedilmisVeri.karakterler || [];
        DB.kiyafetler = kaydedilmisVeri.kiyafetler || [];
        DB.mekanlar = kaydedilmisVeri.mekanlar || [];
        DB.diger = kaydedilmisVeri.diger || [];
    }
}

// Verileri kaydet
function verileriKaydet() {
    try {
        // Base64 formatındaki resimleri optimize etmek için boyutlarını küçültelim
        // Verileri direkt olarak kaydediyoruz, referanslar kullanmak yerine
        localStorage.setItem('influencerDB', JSON.stringify(DB));
        showToast("Veriler başarıyla kaydedildi", "success");
    } catch (error) {
        if (error.name === 'QuotaExceededError' || error.message.includes('exceeded the quota')) {
            showToast("Depolama limiti aşıldı! Daha küçük boyutlu resimler kullanın veya bazı öğeleri silin.", "warning");
            console.warn("Depolama limiti aşıldı. Lütfen daha küçük resimler kullanın.");
            
            // Kullanıcıya büyük resimlerin sorun olabileceğini bildiren bir mesaj göster
            alert("Depolama limiti aşıldı! Eklediğiniz resimler muhtemelen çok büyük. Daha küçük boyutlu resimler kullanın veya resim eklemeden sadece metin verileri kaydedin.");
        } else {
            showToast("Veri kaydedilirken bir hata oluştu: " + error.message, "error");
            console.error("Veri kaydedilirken bir hata oluştu:", error);
        }
    }
}

// Navigasyon olaylarını ayarla
function navigasyonuAyarla() {
    const navLinkleri = document.querySelectorAll('header nav ul li a');
    
    navLinkleri.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktif sekmeyi güncelle
            navLinkleri.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Sekme içeriğini göster
            const hedefId = link.getAttribute('href').substring(1);
            document.querySelectorAll('main section').forEach(section => {
                section.classList.remove('active-section');
            });
            document.getElementById(hedefId).classList.add('active-section');
            
            // İçeriği göster
            verileriGoster(hedefId);
            
            // Eğer mixer sekmesine geçtiyse, mixer select alanlarını doldur
            if (hedefId === 'mixer') {
                mixerSelectleriDoldur();
            }
        });
    });
}

// Modal açma/kapatma işlemleri
function modalKontrol(modalId, goster) {
    const modal = document.getElementById(modalId);
    if (goster) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Buton olaylarını ayarla
function butonOlaylariAyarla() {
    // Yeni Karakter Ekle butonu
    document.getElementById('yeni-karakter-btn').addEventListener('click', () => {
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
    
    // Yeni Kıyafet Ekle butonu
    document.getElementById('yeni-kiyafet-btn').addEventListener('click', () => {
        document.getElementById('kiyafet-modal-baslik').textContent = 'Yeni Kıyafet Ekle';
        document.getElementById('kiyafet-form').reset();
        document.getElementById('kiyafet-form').removeAttribute('data-id');
        
        // Önizleme alanını temizle
        document.getElementById('kiyafet-gorsel-onizleme').innerHTML = '';
        document.getElementById('kiyafet-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
        
        modalKontrol('kiyafet-modal', true);
    });
    
    // Yeni Mekan Ekle butonu
    document.getElementById('yeni-mekan-btn').addEventListener('click', () => {
        document.getElementById('mekan-modal-baslik').textContent = 'Yeni Mekan Ekle';
        document.getElementById('mekan-form').reset();
        document.getElementById('mekan-form').removeAttribute('data-id');
        
        // Önizleme alanını temizle
        document.getElementById('mekan-gorsel-onizleme').innerHTML = '';
        document.getElementById('mekan-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
        
        modalKontrol('mekan-modal', true);
    });
    
    // Yeni Diğer Prompt Ekle butonu
    document.getElementById('yeni-diger-btn').addEventListener('click', () => {
        document.getElementById('diger-modal-baslik').textContent = 'Yeni Prompt Ekle';
        document.getElementById('diger-form').reset();
        document.getElementById('diger-form').removeAttribute('data-id');
        
        // Önizleme alanını temizle
        document.getElementById('diger-gorsel-onizleme').innerHTML = '';
        document.getElementById('diger-gorsel-dosya-isim').textContent = 'Dosya seçilmedi';
        
        modalKontrol('diger-modal', true);
    });
    
    // Bütün Kapat butonları
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });
    
    // İptal butonu
    document.getElementById('sil-iptal').addEventListener('click', () => {
        modalKontrol('sil-onay-modal', false);
    });
}

// Kullanıcıya rehberlik gösteren yardımcı fonksiyon
function dosyaRehberlikGoster(dosyaAdi, kategori) {
    const kategoriler = {
        'karakter-yuz': 'karakterler',
        'karakter-boy': 'karakterler',
        'kiyafet': 'kiyafetler',
        'mekan': 'mekanlar',
        'diger': 'diger'
    };
    
    const klasor = kategoriler[kategori];
    const hedefYol = `assets/uploads/${klasor}/${dosyaAdi}`;
    
    // Kullanıcıya rehberlik içeren bir mesaj göster
    const mesaj = `
        Görsel dosyanız uygulamada sadece dosya yolu olarak saklanacak. Lütfen:
        
        1. Dosyanızı şu klasöre kopyalayın/taşıyın: 
           ${hedefYol}
        
        2. Dosya adını değiştirmeyin, aksi takdirde görüntülenemeyecektir.
        
        Not: Bu yaklaşım, depolama alanından önemli ölçüde tasarruf sağlar, ancak
        dosyaları taşıdığınız veya yeniden adlandırdığınız takdirde görseller görüntülenemez.
    `;
    
    alert(mesaj);
    return hedefYol;
}

// Dosya yükleme olaylarını ayarla
function dosyaYuklemeOlaylariAyarla() {
    // Karakterler - Yüz görseli
    const karakterYuzInput = document.getElementById('karakter-gorsel-yuz-dosya');
    const karakterYuzDosyaIsim = document.getElementById('karakter-gorsel-yuz-dosya-isim');
    const karakterYuzOnizleme = document.getElementById('karakter-gorsel-yuz-onizleme');
    
    karakterYuzInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const dosya = this.files[0];
            karakterYuzDosyaIsim.textContent = dosya.name;
            
            // Dosya yolunu oluştur ve kullanıcıya rehberlik göster
            const dosyaYolu = dosyaRehberlikGoster(dosya.name, 'karakter-yuz');
            
            // Görsel önizleme için geçici URL oluştur
            const geciciURL = URL.createObjectURL(dosya);
            karakterYuzOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
            
            // Dosya yolunu form alanına kaydet
            document.getElementById('karakter-gorsel-yuz').value = dosyaYolu;
            
            // Geçici URL'yi kullandıktan sonra serbest bırak
            setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
        } else {
            karakterYuzDosyaIsim.textContent = 'Dosya seçilmedi';
            karakterYuzOnizleme.innerHTML = '';
        }
    });
    
    // Karakterler - Boy görseli
    const karakterBoyInput = document.getElementById('karakter-gorsel-boy-dosya');
    const karakterBoyDosyaIsim = document.getElementById('karakter-gorsel-boy-dosya-isim');
    const karakterBoyOnizleme = document.getElementById('karakter-gorsel-boy-onizleme');
    
    karakterBoyInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const dosya = this.files[0];
            karakterBoyDosyaIsim.textContent = dosya.name;
            
            // Dosya yolunu oluştur ve kullanıcıya rehberlik göster
            const dosyaYolu = dosyaRehberlikGoster(dosya.name, 'karakter-boy');
            
            // Görsel önizleme için geçici URL oluştur
            const geciciURL = URL.createObjectURL(dosya);
            karakterBoyOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
            
            // Dosya yolunu form alanına kaydet
            document.getElementById('karakter-gorsel-boy').value = dosyaYolu;
            
            // Geçici URL'yi kullandıktan sonra serbest bırak
            setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
        } else {
            karakterBoyDosyaIsim.textContent = 'Dosya seçilmedi';
            karakterBoyOnizleme.innerHTML = '';
        }
    });
    
    // URL girişlerinde önizleme için - Tavsiye edilen dosya yolu kullanıldığında görsel kontrolü eklenmiştir
    document.getElementById('karakter-gorsel-yuz').addEventListener('input', function() {
        if (this.value) {
            karakterYuzOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
        } else {
            karakterYuzOnizleme.innerHTML = '';
        }
    });
    
    document.getElementById('karakter-gorsel-boy').addEventListener('input', function() {
        if (this.value) {
            karakterBoyOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
        } else {
            karakterBoyOnizleme.innerHTML = '';
        }
    });
    
    // Kıyafetler görseli
    const kiyafetInput = document.getElementById('kiyafet-gorsel-dosya');
    const kiyafetDosyaIsim = document.getElementById('kiyafet-gorsel-dosya-isim');
    const kiyafetOnizleme = document.getElementById('kiyafet-gorsel-onizleme');
    
    kiyafetInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const dosya = this.files[0];
            kiyafetDosyaIsim.textContent = dosya.name;
            
            // Dosya yolunu oluştur ve kullanıcıya rehberlik göster
            const dosyaYolu = dosyaRehberlikGoster(dosya.name, 'kiyafet');
            
            // Görsel önizleme için geçici URL oluştur
            const geciciURL = URL.createObjectURL(dosya);
            kiyafetOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
            
            // Dosya yolunu form alanına kaydet
            document.getElementById('kiyafet-gorsel').value = dosyaYolu;
            
            // Geçici URL'yi kullandıktan sonra serbest bırak
            setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
        } else {
            kiyafetDosyaIsim.textContent = 'Dosya seçilmedi';
            kiyafetOnizleme.innerHTML = '';
        }
    });
    
    document.getElementById('kiyafet-gorsel').addEventListener('input', function() {
        if (this.value) {
            kiyafetOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
        } else {
            kiyafetOnizleme.innerHTML = '';
        }
    });
    
    // Mekanlar görseli
    const mekanInput = document.getElementById('mekan-gorsel-dosya');
    const mekanDosyaIsim = document.getElementById('mekan-gorsel-dosya-isim');
    const mekanOnizleme = document.getElementById('mekan-gorsel-onizleme');
    
    mekanInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const dosya = this.files[0];
            mekanDosyaIsim.textContent = dosya.name;
            
            // Dosya yolunu oluştur ve kullanıcıya rehberlik göster
            const dosyaYolu = dosyaRehberlikGoster(dosya.name, 'mekan');
            
            // Görsel önizleme için geçici URL oluştur
            const geciciURL = URL.createObjectURL(dosya);
            mekanOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
            
            // Dosya yolunu form alanına kaydet
            document.getElementById('mekan-gorsel').value = dosyaYolu;
            
            // Geçici URL'yi kullandıktan sonra serbest bırak
            setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
        } else {
            mekanDosyaIsim.textContent = 'Dosya seçilmedi';
            mekanOnizleme.innerHTML = '';
        }
    });
    
    document.getElementById('mekan-gorsel').addEventListener('input', function() {
        if (this.value) {
            mekanOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
        } else {
            mekanOnizleme.innerHTML = '';
        }
    });
    
    // Diğer promptlar görseli
    const digerInput = document.getElementById('diger-gorsel-dosya');
    const digerDosyaIsim = document.getElementById('diger-gorsel-dosya-isim');
    const digerOnizleme = document.getElementById('diger-gorsel-onizleme');
    
    digerInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const dosya = this.files[0];
            digerDosyaIsim.textContent = dosya.name;
            
            // Dosya yolunu oluştur ve kullanıcıya rehberlik göster
            const dosyaYolu = dosyaRehberlikGoster(dosya.name, 'diger');
            
            // Görsel önizleme için geçici URL oluştur
            const geciciURL = URL.createObjectURL(dosya);
            digerOnizleme.innerHTML = `<img src="${geciciURL}" alt="Önizleme">`;
            
            // Dosya yolunu form alanına kaydet
            document.getElementById('diger-gorsel').value = dosyaYolu;
            
            // Geçici URL'yi kullandıktan sonra serbest bırak
            setTimeout(() => URL.revokeObjectURL(geciciURL), 5000);
        } else {
            digerDosyaIsim.textContent = 'Dosya seçilmedi';
            digerOnizleme.innerHTML = '';
        }
    });
    
    document.getElementById('diger-gorsel').addEventListener('input', function() {
        if (this.value) {
            digerOnizleme.innerHTML = `<img src="${this.value}" alt="Önizleme" onerror="this.onerror=null;this.src='';this.alt='Görsel bulunamadı - Lütfen dosyanın doğru konumda olduğundan emin olun';this.parentNode.classList.add('error');">`;
        } else {
            digerOnizleme.innerHTML = '';
        }
    });
}

// Form olaylarını ayarla
function formOlaylariAyarla() {
    // Karakter form işlemi
    document.getElementById('karakter-form').addEventListener('submit', function(e) {
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
            pozlar: [] // Pozları saklamak için boş dizi başlatıyoruz
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
        verileriGoster('karakterler');
        modalKontrol('karakter-modal', false);
    });
    
    // Kıyafet form işlemi
    document.getElementById('kiyafet-form').addEventListener('submit', function(e) {
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
        verileriGoster('kiyafetler');
        modalKontrol('kiyafet-modal', false);
    });
    
    // Mekan form işlemi
    document.getElementById('mekan-form').addEventListener('submit', function(e) {
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
        verileriGoster('mekanlar');
        modalKontrol('mekan-modal', false);
    });
    
    // Diğer prompt form işlemi
    document.getElementById('diger-form').addEventListener('submit', function(e) {
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
        verileriGoster('diger');
        modalKontrol('diger-modal', false);
    });
}

// Arama ve Filtreleme olaylarını ayarla
function aramaFiltrelemeAyarla() {
    // Karakter arama
    document.getElementById('karakter-ara').addEventListener('input', function() {
        verileriGoster('karakterler', this.value, document.getElementById('karakter-sirala').value);
    });
    
    // Karakter sıralama
    document.getElementById('karakter-sirala').addEventListener('change', function() {
        verileriGoster('karakterler', document.getElementById('karakter-ara').value, this.value);
    });
    
    // Kıyafet arama
    document.getElementById('kiyafet-ara').addEventListener('input', function() {
        verileriGoster('kiyafetler', this.value, document.getElementById('kiyafet-sirala').value);
    });
    
    // Kıyafet sıralama
    document.getElementById('kiyafet-sirala').addEventListener('change', function() {
        verileriGoster('kiyafetler', document.getElementById('kiyafet-ara').value, this.value);
    });
    
    // Mekan arama
    document.getElementById('mekan-ara').addEventListener('input', function() {
        verileriGoster('mekanlar', this.value, document.getElementById('mekan-sirala').value);
    });
    
    // Mekan sıralama
    document.getElementById('mekan-sirala').addEventListener('change', function() {
        verileriGoster('mekanlar', document.getElementById('mekan-ara').value, this.value);
    });
    
    // Diğer arama
    document.getElementById('diger-ara').addEventListener('input', function() {
        verileriGoster('diger', this.value, document.getElementById('diger-sirala').value);
    });
    
    // Diğer sıralama
    document.getElementById('diger-sirala').addEventListener('change', function() {
        verileriGoster('diger', document.getElementById('diger-ara').value, this.value);
    });
}

// Verileri ekranda göster
function verileriGoster(tip, aramaMetni = "", siralama = "isim-az") {
    const veriListesi = DB[tip];
    let listeElementId;
    
    switch(tip) {
        case 'karakterler':
            listeElementId = 'karakterler-listesi';
            break;
        case 'kiyafetler':
            listeElementId = 'kiyafetler-listesi';
            break;
        case 'mekanlar':
            listeElementId = 'mekanlar-listesi';
            break;
        case 'diger':
            listeElementId = 'diger-listesi';
            break;
        default:
            return;
    }
    
    const listeElement = document.getElementById(listeElementId);
    
    // Önce arama filtresi uygula
    let filtreliVeri = veriListesi;
    if (aramaMetni) {
        aramaMetni = aramaMetni.toLowerCase();
        filtreliVeri = veriListesi.filter(item => 
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
            <p>Hiç öğe bulunamadı.</p>
        </div>`;
        return;
    }
    
    // Verileri listele
    filtreliVeri.forEach(item => {
        let itemHtml = '';
        
        // Karakter kartları için özel düzen
        if (tip === 'karakterler') {
            itemHtml = `
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
                            <i class="fas ${getCategoryIcon(tip, 'karakter')}"></i>
                            ${item.yas ? `${item.yas} yaş` : ''} 
                            ${item.boy ? `${item.boy} cm` : ''}
                        </div>
                        <div class="item-description">${kisalt(item.prompt, 100)}</div>
                        <div class="item-actions">
                            <button class="duzenle-btn" onclick="itemDuzenle('${tip}', '${item.id}')">
                                <i class="fas fa-edit"></i> Düzenle
                            </button>
                            <button class="kopyala-btn" onclick="promptKopyala('${item.prompt.replace(/'/g, "\\'")}')">
                                <i class="fas fa-copy"></i> Kopyala
                            </button>
                            <button class="sil-btn-small" onclick="itemSil('${tip}', '${item.id}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Diğer tip kartlar için standart düzen
            itemHtml = `
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
                            <i class="fas ${getCategoryIcon(tip, item.kategori)}"></i>
                            ${getCategoryName(tip, item.kategori)}
                        </div>
                        <div class="item-description">${kisalt(item.prompt, 100)}</div>
                        <div class="item-actions">
                            <button class="duzenle-btn" onclick="itemDuzenle('${tip}', '${item.id}')">
                                <i class="fas fa-edit"></i> Düzenle
                            </button>
                            <button class="kopyala-btn" onclick="promptKopyala('${item.prompt.replace(/'/g, "\\'")}')">
                                <i class="fas fa-copy"></i> Kopyala
                            </button>
                            <button class="sil-btn-small" onclick="itemSil('${tip}', '${item.id}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        listeElement.innerHTML += itemHtml;
    });
    
    // Kart tıklama olaylarını ayarla
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Butonlara tıkladığımızda kartın detay görüntüleme açılmasını engelle
            if (e.target.closest('.item-actions') || e.target.closest('button')) {
                return;
            }
            
            const id = this.dataset.id;
            detayGoster(tip, id);
        });
    });
}

// Kategori simgesi
function getCategoryIcon(tip, kategori) {
    if (!kategori) return 'fa-tag';
    
    switch(tip) {
        case 'karakterler':
            return 'fa-user';
        case 'kiyafetler':
            switch(kategori) {
                case 'ust': return 'fa-tshirt';
                case 'alt': return 'fa-socks';
                case 'elbise': return 'fa-female';
                case 'ayakkabi': return 'fa-shoe-prints';
                case 'aksesuar': return 'fa-hat-wizard';
                default: return 'fa-tag';
            }
        case 'mekanlar':
            switch(kategori) {
                case 'ic': return 'fa-home';
                case 'dis': return 'fa-tree';
                case 'dogal': return 'fa-mountain';
                case 'sehir': return 'fa-city';
                default: return 'fa-map-marker-alt';
            }
        default:
            return 'fa-tag';
    }
}

// Kategori adı
function getCategoryName(tip, kategori) {
    if (!kategori) return 'Genel';
    
    switch(tip) {
        case 'kiyafetler':
            switch(kategori) {
                case 'ust': return 'Üst Giyim';
                case 'alt': return 'Alt Giyim';
                case 'elbise': return 'Elbise';
                case 'ayakkabi': return 'Ayakkabı';
                case 'aksesuar': return 'Aksesuar';
                default: return 'Diğer';
            }
        case 'mekanlar':
            switch(kategori) {
                case 'ic': return 'İç Mekan';
                case 'dis': return 'Dış Mekan';
                case 'dogal': return 'Doğal Alan';
                case 'sehir': return 'Şehir';
                default: return 'Diğer';
            }
        default:
            return kategori;
    }
}

// Metin kısaltma
function kisalt(metin, uzunluk) {
    if (!metin) return '';
    return metin.length > uzunluk ? metin.substring(0, uzunluk) + '...' : metin;
}

// Detay görüntüleme
function detayGoster(tip, id) {
    const veri = DB[tip].find(item => item.id === id);
    if (!veri) return;
    
    let detayIcerik = `
        <h2 class="detay-baslik">${veri.isim}</h2>
        <div class="detay-kategori">
            <i class="fas ${getCategoryIcon(tip, veri.kategori)}"></i>
            ${tip === 'karakterler' ? 'Karakter' : getCategoryName(tip, veri.kategori)}
        </div>
    `;
    
    if (tip === 'karakterler') {
        detayIcerik += `
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
    } else if (veri.gorselUrl) {
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
            <button class="duzenle-btn" onclick="itemDuzenle('${tip}', '${id}')">
                <i class="fas fa-edit"></i> Düzenle
            </button>
            <button class="kopyala-btn" onclick="promptKopyala('${veri.prompt.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Promptu Kopyala
            </button>
            <button class="sil-btn" onclick="itemSil('${tip}', '${id}')">
                <i class="fas fa-trash-alt"></i> Sil
            </button>
        </div>
    `;
    
    document.getElementById('detay-icerik').innerHTML = detayIcerik;
    modalKontrol('detay-modal', true);
}

// Global olarak tanımlanan fonksiyonlar
// Düzenleme fonksiyonu
window.itemDuzenle = function(tip, id) {
    const item = DB[tip].find(item => item.id === id);
    if (!item) return;
    
    let modalId, formId;
    
    switch(tip) {
        case 'karakterler':
            modalId = 'karakter-modal';
            formId = 'karakter-form';
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
            break;
            
        case 'kiyafetler':
            modalId = 'kiyafet-modal';
            formId = 'kiyafet-form';
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
            break;
            
        case 'mekanlar':
            modalId = 'mekan-modal';
            formId = 'mekan-form';
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
            break;
            
        case 'diger':
            modalId = 'diger-modal';
            formId = 'diger-form';
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
            break;
            
        default:
            return;
    }
    
    document.getElementById(formId).dataset.id = id;
    modalKontrol(modalId, true);
    
    // Aktif diğer modalları kapat
    if (document.getElementById('detay-modal').style.display === 'block') {
        modalKontrol('detay-modal', false);
    }
};

// Silme fonksiyonu
window.itemSil = function(tip, id) {
    // Silinecek öğeyi sakla
    document.getElementById('sil-onay').dataset.tip = tip;
    document.getElementById('sil-onay').dataset.id = id;
    
    // Onay modalını göster
    modalKontrol('sil-onay-modal', true);
    
    // Aktif diğer modalları kapat
    if (document.getElementById('detay-modal').style.display === 'block') {
        modalKontrol('detay-modal', false);
    }
    
    // Silme onayı verildiğinde
    document.getElementById('sil-onay').onclick = function() {
        const tip = this.dataset.tip;
        const id = this.dataset.id;
        
        // Öğeyi veritabanından sil
        const index = DB[tip].findIndex(item => item.id === id);
        if (index !== -1) {
            DB[tip].splice(index, 1);
            verileriKaydet();
            verileriGoster(tip);
            showToast(`Öğe başarıyla silindi`, "success");
        }
        
        // Modalı kapat
        modalKontrol('sil-onay-modal', false);
    };
};

// Prompt kopyalama fonksiyonu
window.promptKopyala = function(promptMetni) {
    if (!promptMetni) return;
    
    // Metni panoya kopyala
    navigator.clipboard.writeText(promptMetni)
        .then(() => {
            // Başarılı bildirim göster
            showToast("Prompt başarıyla kopyalandı!", "success");
        })
        .catch(err => {
            console.error('Kopyalama başarısız oldu:', err);
            // Alternatif kopyalama yöntemi
            const textArea = document.createElement('textarea');
            textArea.value = promptMetni;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showToast("Prompt başarıyla kopyalandı!", "success");
            } catch (err) {
                console.error('Alternatif kopyalama başarısız oldu:', err);
                showToast("Kopyalama işlemi başarısız oldu. Metni manuel kopyalayabilirsiniz.", "error");
            }
            
            document.body.removeChild(textArea);
        });
};

// Pozları karakter detaylarına ekle/çıkar fonksiyonları
window.pozuKaraktereEkle = function(karakterId, pozId) {
    if (!pozId) {
        showToast("Lütfen bir poz seçin!", "warning");
        return;
    }
    
    const karakterIndex = DB.karakterler.findIndex(k => k.id === karakterId);
    if (karakterIndex === -1) return;
    
    // Eğer pozlar dizisi yoksa oluştur
    if (!DB.karakterler[karakterIndex].pozlar) {
        DB.karakterler[karakterIndex].pozlar = [];
    }
    
    // Poz zaten eklenmişse uyarı ver
    if (DB.karakterler[karakterIndex].pozlar.includes(pozId)) {
        showToast("Bu poz zaten eklenmiş!", "warning");
        return;
    }
    
    // Pozu ekle
    DB.karakterler[karakterIndex].pozlar.push(pozId);
    
    // Verileri kaydet ve detay ekranını güncelle
    verileriKaydet();
    detayGoster('karakterler', karakterId);
    
    showToast("Poz başarıyla eklendi", "success");
};

window.pozuKarakterdenSil = function(karakterId, pozId) {
    const karakterIndex = DB.karakterler.findIndex(k => k.id === karakterId);
    if (karakterIndex === -1) return;
    
    // Karakter pozları var mı kontrol et
    if (!DB.karakterler[karakterIndex].pozlar) {
        return;
    }
    
    // Pozun indeksini bul
    const pozIndex = DB.karakterler[karakterIndex].pozlar.indexOf(pozId);
    if (pozIndex === -1) return;
    
    // Pozu sil
    DB.karakterler[karakterIndex].pozlar.splice(pozIndex, 1);
    
    // Verileri kaydet ve detay ekranını güncelle
    verileriKaydet();
    detayGoster('karakterler', karakterId);
    
    showToast("Poz başarıyla silindi", "success");
};

// Örnek verileri yükle
function ornekVerileriYukle() {
    // Eğer veritabanı zaten doluysa, örnek verileri yükleme
    if (DB.karakterler.length > 0 || DB.kiyafetler.length > 0 || DB.mekanlar.length > 0) {
        return;
    }
    
    // Örnek karakter verisi
    const ornekKarakter = {
        id: "1",
        isim: "Emma Wilson",
        yas: "25",
        boy: "170",
        prompt: "Genç kadın influencer Emma Wilson (25), 1.70 boyunda, fit yapılı, orta uzunlukta dalgalı sarı saçlı, derin mavi gözlü, belirgin elmacık kemikleri olan, sol yanağında küçük bir beni bulunan, doğal makyajlı ve özgüvenli duruşa sahip. Profesyonel fotoğraf çekimi, doğal ışık, yüksek çözünürlük, detaylı cilt dokusu, fotorealistik.",
        gorselYuzUrl: "assets/uploads/karakterler/Emma_Yuz.png",
        gorselBoyUrl: "assets/uploads/karakterler/Emma_Boy.png",
        eklemeTarihi: new Date().toISOString()
    };
    
    // Örnek kıyafet verisi
    const ornekKiyafet = {
        id: "2",
        isim: "Beyaz Plaj Elbisesi",
        kategori: "elbise",
        prompt: "İnsansız bir şekilde sadece bir kıyafeti sergileyen bir görüntü oluştur. Kıyafet şu şekilde: Beyaz, hafif kumaştan yapılmış, uzun kollu bir plaj örtüsü. Örtünün önden geniş bir düğümle bağlanmış ve hafifçe açık, böylece altındaki beyaz, üçgen kesimli bikini üstü görünüyor. Kıyafetin üstüne geniş kenarlı, saman rengi bir şapka yerleştirilmiş. Kıyafet hafif bir esintiyle dalgalanıyor. Işık, güneşli bir günün doğal ışığı gibi parlak ve yumuşak. Arka plan tamamen nötr, kıyafete odaklanacak şekilde sade bir beyaz veya gri ton.",
        gorselUrl: "assets/uploads/kiyafetler/Beyaz Plaj Elbiesi.png",
        eklemeTarihi: new Date().toISOString()
    };
    
    // Örnek mekan verisi
    const ornekMekan = {
        id: "3",
        isim: "Ege Plajı",
        kategori: "dis",
        prompt: "Türkiye'nin eşsiz Ege kıyılarında, masmavi denizin koyları kucakladığı muhteşem bir plaj manzarası. Kristal berraklığında turkuaz suları bulunan koy, çakıl taşları ve ince altın sarısı kumla kaplı sahiliyle dikkat çekiyor. Kıyıyı çevreleyen çam ağaçları ve zeytin bahçeleri, doğal bir gölgelik oluşturuyor. Sahil boyunca uzanan kayalık yarımadalar ve ufukta görünen minik adalar, tipik Ege coğrafyasının mükemmel örneklerini sergiliyor. Gökyüzü parlak mavi ve birkaç ince bulutla süslenmiş. Güneş ufka yaklaşırken, altın saat ışığı denizi ve sahili sıcak tonlarla aydınlatıyor. Kıyıda çarşaf gibi dümdüz deniz, güneşin parıltılarıyla ışıldıyor. Kıyının bir ucunda küçük bir balıkçı limanı ve renkli tekneler görünüyor. Uzakta birkaç beyaz badanalı, mavi pencereli sahil evleri tepelere yayılmış. Doğal, huzur verici ve Akdeniz ruhunu taşıyan gerçek bir Türk rivierası. Profesyonel fotoğraf çekimi, yüksek çözünürlük, net detaylar, doğal ışık ve gölgeler, fotorealistik.",
        gorselUrl: "assets/uploads/mekanlar/Ege_Plaji.jpg", 
        eklemeTarihi: new Date().toISOString()
    };
    
    // Verileri veritabanına ekle
    DB.karakterler.push(ornekKarakter);
    DB.kiyafetler.push(ornekKiyafet);
    DB.mekanlar.push(ornekMekan);
    
    // Değişiklikleri kaydet
    verileriKaydet();
}

// Prompt Mixer işlemleri
function mixerOlaylariAyarla() {
    // Seçim alanlarını doldur
    mixerSelectleriDoldur();
    
    // Karakter seçimi değiştiğinde
    document.getElementById('mixer-karakter-select').addEventListener('change', function() {
        const karakterId = this.value;
        const karakter = karakterId ? DB.karakterler.find(k => k.id === karakterId) : null;
        const preview = document.getElementById('mixer-karakter-preview');
        
        if (karakter) {
            const gorselUrl = karakter.gorselBoyUrl || karakter.gorselYuzUrl;
            if (gorselUrl) {
                preview.innerHTML = `<img src="${gorselUrl}" alt="${karakter.isim}">`;
            } else {
                preview.innerHTML = `<div class="mixer-preview empty">
                    <i class="fas fa-user"></i>
                    <p>${karakter.isim}</p>
                </div>`;
            }
            
            // Mixer'ı güncelle
            mixerPromptGuncelle();
        } else {
            preview.innerHTML = `<div class="mixer-preview empty">
                <i class="fas fa-user"></i>
                <p>Karakter seçilmedi</p>
            </div>`;
            
            // Mixer'ı güncelle
            mixerPromptGuncelle();
        }
    });
    
    // Kıyafet seçimi değiştiğinde
    document.getElementById('mixer-kiyafet-select').addEventListener('change', function() {
        const kiyafetId = this.value;
        const kiyafet = kiyafetId ? DB.kiyafetler.find(k => k.id === kiyafetId) : null;
        const preview = document.getElementById('mixer-kiyafet-preview');
        
        if (kiyafet) {
            if (kiyafet.gorselUrl) {
                preview.innerHTML = `<img src="${kiyafet.gorselUrl}" alt="${kiyafet.isim}">`;
            } else {
                preview.innerHTML = `<div class="mixer-preview empty">
                    <i class="fas fa-tshirt"></i>
                    <p>${kiyafet.isim}</p>
                </div>`;
            }
            
            // Mixer'ı güncelle
            mixerPromptGuncelle();
        } else {
            preview.innerHTML = `<div class="mixer-preview empty">
                <i class="fas fa-tshirt"></i>
                <p>Kıyafet seçilmedi</p>
            </div>`;
            
            // Mixer'ı güncelle
            mixerPromptGuncelle();
        }
    });
    
    // Mekan seçimi değiştiğinde
    document.getElementById('mixer-mekan-select').addEventListener('change', function() {
        const mekanId = this.value;
        const mekan = mekanId ? DB.mekanlar.find(m => m.id === mekanId) : null;
        const preview = document.getElementById('mixer-mekan-preview');
        
        if (mekan) {
            if (mekan.gorselUrl) {
                preview.innerHTML = `<img src="${mekan.gorselUrl}" alt="${mekan.isim}">`;
            } else {
                preview.innerHTML = `<div class="mixer-preview empty">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>${mekan.isim}</p>
                </div>`;
            }
            
            // Mixer'ı güncelle
            mixerPromptGuncelle();
        } else {
            preview.innerHTML = `<div class="mixer-preview empty">
                <i class="fas fa-map-marker-alt"></i>
                <p>Mekan seçilmedi</p>
            </div>`;
            
            // Mixer'ı güncelle
            mixerPromptGuncelle();
        }
    });
    
    // Mixer promptunu kopyala butonu
    document.getElementById('mixer-kopyala-btn').addEventListener('click', function() {
        const mixerPrompt = document.getElementById('mixer-prompt-output').value;
        
        if (mixerPrompt.trim()) {
            // Metni panoya kopyala
            navigator.clipboard.writeText(mixerPrompt)
                .then(() => {
                    // Başarılı bildirim göster
                    showToast("Birleştirilmiş prompt başarıyla kopyalandı!", "success");
                })
                .catch(err => {
                    console.error('Kopyalama başarısız oldu:', err);
                    // Alternatif kopyalama yöntemi
                    const textArea = document.createElement('textarea');
                    textArea.value = mixerPrompt;
                    textArea.style.position = 'fixed';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        showToast("Birleştirilmiş prompt başarıyla kopyalandı!", "success");
                    } catch (err) {
                        console.error('Alternatif kopyalama başarısız oldu:', err);
                        showToast("Kopyalama işlemi başarısız oldu. Metni manuel kopyalayabilirsiniz.", "error");
                    }
                    
                    document.body.removeChild(textArea);
                });
        } else {
            showToast("Kopyalanacak prompt yok. Lütfen önce karakter, kıyafet ve mekan seçin.", "warning");
        }
    });
    
    // Mixer temizle butonu
    document.getElementById('temizle-mixer-btn').addEventListener('click', function() {
        // Tüm seçimleri sıfırla
        document.getElementById('mixer-karakter-select').value = '';
        document.getElementById('mixer-kiyafet-select').value = '';
        document.getElementById('mixer-mekan-select').value = '';
        
        // Önizleme alanlarını sıfırla
        document.getElementById('mixer-karakter-preview').innerHTML = `<div class="mixer-preview empty">
            <i class="fas fa-user"></i>
            <p>Karakter seçilmedi</p>
        </div>`;
        
        document.getElementById('mixer-kiyafet-preview').innerHTML = `<div class="mixer-preview empty">
            <i class="fas fa-tshirt"></i>
            <p>Kıyafet seçilmedi</p>
        </div>`;
        
        document.getElementById('mixer-mekan-preview').innerHTML = `<div class="mixer-preview empty">
            <i class="fas fa-map-marker-alt"></i>
            <p>Mekan seçilmedi</p>
        </div>`;
        
        // Görsel önizleme ve prompt alanını sıfırla
        document.getElementById('mixer-visual-preview').innerHTML = `<div class="mixer-empty-state">
            <i class="fas fa-image"></i>
            <p>Karakter, kıyafet ve mekan seçtikçe görsel önizleme oluşturulacak</p>
        </div>`;
        
        document.getElementById('mixer-prompt-output').value = '';
        
        showToast("Mixer temizlendi", "success");
    });
}

// Mixer select alanlarını doldur
function mixerSelectleriDoldur() {
    // Karakter select
    const karakterSelect = document.getElementById('mixer-karakter-select');
    karakterSelect.innerHTML = '<option value="">Karakter seçiniz...</option>';
    
    DB.karakterler.forEach(karakter => {
        karakterSelect.innerHTML += `<option value="${karakter.id}">${karakter.isim}</option>`;
    });
    
    // Kıyafet select
    const kiyafetSelect = document.getElementById('mixer-kiyafet-select');
    kiyafetSelect.innerHTML = '<option value="">Kıyafet seçiniz...</option>';
    
    DB.kiyafetler.forEach(kiyafet => {
        kiyafetSelect.innerHTML += `<option value="${kiyafet.id}">${kiyafet.isim}</option>`;
    });
    
    // Mekan select
    const mekanSelect = document.getElementById('mixer-mekan-select');
    mekanSelect.innerHTML = '<option value="">Mekan seçiniz...</option>';
    
    DB.mekanlar.forEach(mekan => {
        mekanSelect.innerHTML += `<option value="${mekan.id}">${mekan.isim}</option>`;
    });
    
    // Mixer önizleme alanlarını sıfırla
    document.getElementById('mixer-karakter-preview').innerHTML = `<div class="mixer-preview empty">
        <i class="fas fa-user"></i>
        <p>Karakter seçilmedi</p>
    </div>`;
    
    document.getElementById('mixer-kiyafet-preview').innerHTML = `<div class="mixer-preview empty">
        <i class="fas fa-tshirt"></i>
        <p>Kıyafet seçilmedi</p>
    </div>`;
    
    document.getElementById('mixer-mekan-preview').innerHTML = `<div class="mixer-preview empty">
        <i class="fas fa-map-marker-alt"></i>
        <p>Mekan seçilmedi</p>
    </div>`;
}

// Mixer promptunu güncelle
function mixerPromptGuncelle() {
    // Seçilen öğeleri bul
    const karakterId = document.getElementById('mixer-karakter-select').value;
    const kiyafetId = document.getElementById('mixer-kiyafet-select').value;
    const mekanId = document.getElementById('mixer-mekan-select').value;
    
    const karakter = karakterId ? DB.karakterler.find(k => k.id === karakterId) : null;
    const kiyafet = kiyafetId ? DB.kiyafetler.find(k => k.id === kiyafetId) : null;
    const mekan = mekanId ? DB.mekanlar.find(m => m.id === mekanId) : null;
    
    // Görsel önizleme alanını güncelle
    const visualPreview = document.getElementById('mixer-visual-preview');
    
    if (karakter || kiyafet || mekan) {
        let secilenler = [];
        
        if (karakter) {
            const gorselUrl = karakter.gorselBoyUrl || karakter.gorselYuzUrl;
            if (gorselUrl) {
                secilenler.push(`
                    <div class="mixer-visual-item karakter">
                        <img src="${gorselUrl}" alt="${karakter.isim}">
                        <div class="mixer-visual-item-info">
                            <span>${karakter.isim}</span>
                        </div>
                    </div>
                `);
            }
        }
        
        if (kiyafet && kiyafet.gorselUrl) {
            secilenler.push(`
                <div class="mixer-visual-item kiyafet">
                    <img src="${kiyafet.gorselUrl}" alt="${kiyafet.isim}">
                    <div class="mixer-visual-item-info">
                        <span>${kiyafet.isim}</span>
                    </div>
                </div>
            `);
        }
        
        if (mekan && mekan.gorselUrl) {
            secilenler.push(`
                <div class="mixer-visual-item mekan">
                    <img src="${mekan.gorselUrl}" alt="${mekan.isim}">
                    <div class="mixer-visual-item-info">
                        <span>${mekan.isim}</span>
                    </div>
                </div>
            `);
        }
        
        if (secilenler.length > 0) {
            visualPreview.innerHTML = `
                <div class="mixer-visual-items">
                    ${secilenler.join('')}
                </div>
            `;
        } else {
            visualPreview.innerHTML = `<div class="mixer-empty-state">
                <i class="fas fa-image"></i>
                <p>Seçtiğiniz öğelerin görselleri bulunamadı</p>
            </div>`;
        }
    } else {
        visualPreview.innerHTML = `<div class="mixer-empty-state">
            <i class="fas fa-image"></i>
            <p>Karakter, kıyafet ve mekan seçtikçe görsel önizleme oluşturulacak</p>
        </div>`;
    }
    
    // Prompt alanını güncelle
    const promptOutput = document.getElementById('mixer-prompt-output');
    
    let birlesikPrompt = '';
    
    if (karakter) {
        // Karakter bilgilerini ekle
        let karakterBilgisi = karakter.prompt.trim();
        
        // Son nokta işaretini kaldır
        if (karakterBilgisi.endsWith('.')) {
            karakterBilgisi = karakterBilgisi.slice(0, -1);
        }
        
        birlesikPrompt += karakterBilgisi;
    }
    
    if (kiyafet) {
        // Kıyafet bilgilerini ekle
        if (birlesikPrompt) {
            // Önce bir virgül ekle
            birlesikPrompt += ',';
        }
        
        // Eğer kıyafet promptu "İnsansız bir şekilde..." gibi ifadelerle başlıyorsa, sadece kıyafet tanımını al
        let kiyafetBilgisi = kiyafet.prompt.trim();
        
        // "Kıyafet şu şekilde:" ifadesinden sonrasını al
        const kiyafetIndex = kiyafetBilgisi.indexOf('Kıyafet şu şekilde:');
        if (kiyafetIndex !== -1) {
            kiyafetBilgisi = kiyafetBilgisi.substring(kiyafetIndex + 'Kıyafet şu şekilde:'.length).trim();
        }
        
        // Son nokta işaretini kaldır
        if (kiyafetBilgisi.endsWith('.')) {
            kiyafetBilgisi = kiyafetBilgisi.slice(0, -1);
        }
        
        birlesikPrompt += ` üzerinde ${kiyafetBilgisi}`;
    }
    
    if (mekan) {
        // Mekan bilgilerini ekle
        if (birlesikPrompt) {
            // Önce bir virgül ekle
            birlesikPrompt += ',';
        }
        
        let mekanBilgisi = mekan.prompt.trim();
        
        // Eğer mekan bilgisi uzunsa kısalt ve sadece ilk cümle ya da kısa bir tanımı al
        const ilkNoktaIndex = mekanBilgisi.indexOf('.');
        if (ilkNoktaIndex !== -1 && ilkNoktaIndex < 100) {
            mekanBilgisi = mekanBilgisi.substring(0, ilkNoktaIndex + 1);
        } else {
            // İlk cümle çok uzun veya nokta yoksa, ilk 100 karakteri al
            const mekanKisa = mekanBilgisi.substring(0, Math.min(100, mekanBilgisi.length));
            if (mekanKisa.length < mekanBilgisi.length) {
                mekanBilgisi = mekanKisa + '...';
            }
        }
        
        // Son nokta işaretini kaldır
        if (mekanBilgisi.endsWith('.')) {
            mekanBilgisi = mekanBilgisi.slice(0, -1);
        }
        
        birlesikPrompt += ` ${mekanBilgisi} ortamında`;
    }
    
    // Sonuna ortak fotoğraf ayarlarını ekle
    if (birlesikPrompt) {
        // Nokta ekle
        birlesikPrompt += '. ';
        
        // Fotoğraf ayarları
        birlesikPrompt += 'Profesyonel fotoğraf çekimi, doğal ışık, yüksek çözünürlük, detaylı doku, fotorealistik.';
    }
    
    promptOutput.value = birlesikPrompt;
}
