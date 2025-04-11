// Base Module: Tüm tablar için ortak fonksiyonlar ve veri yönetimi

// Veri Modeli
const DB = {
    karakterler: [],
    kiyafetler: [],
    mekanlar: [],
    diger: []
};

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

// Kullanıcı rehberlik fonksiyonu
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

// Prompt kopyalama fonksiyonu - Global olması gerekiyor
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

// Modülü dışa aktar
export {
    DB,
    showToast,
    verileriYukle,
    verileriKaydet,
    modalKontrol,
    getCategoryIcon,
    getCategoryName,
    kisalt,
    dosyaRehberlikGoster,
    ornekVerileriYukle
};
