// Influencer Prompt Yöneticisi - Ana JS Dosyası
// ES Modül yapısı kullanılmaktadır

// İlgili modülleri içe aktar
import { 
    verileriYukle,
    ornekVerileriYukle,
    modalKontrol,
    showToast
} from './modules/base.js';

import {
    navigasyonuAyarla,
    ilkTabiGoster,
    aramaFiltrelemeAyarla
} from './modules/navigation.js';

import {
    karakterDetayGoster,
    karakterSil,
    karakterDuzenle,
    pozaKarakterEkle,
    pozaKarakterSil,
    butonOlaylariAyarla as karakterButonOlaylariAyarla,
    dosyaYuklemeOlaylariAyarla as karakterDosyaYuklemeOlaylariAyarla,
    verileriGoster as karakterleriGoster
} from './modules/karakterler.js';

import {
    kiyafetDetayGoster,
    kiyafetSil,
    kiyafetDuzenle,
    butonOlaylariAyarla as kiyafetButonOlaylariAyarla,
    dosyaYuklemeOlaylariAyarla as kiyafetDosyaYuklemeOlaylariAyarla,
    verileriGoster as kiyafetleriGoster
} from './modules/kiyafetler.js';

import {
    mekanDetayGoster,
    mekanSil,
    mekanDuzenle,
    butonOlaylariAyarla as mekanButonOlaylariAyarla,
    dosyaYuklemeOlaylariAyarla as mekanDosyaYuklemeOlaylariAyarla,
    verileriGoster as mekanlariGoster
} from './modules/mekanlar.js';

import {
    digerDetayGoster,
    digerSil,
    digerDuzenle,
    butonOlaylariAyarla as digerButonOlaylariAyarla,
    dosyaYuklemeOlaylariAyarla as digerDosyaYuklemeOlaylariAyarla,
    verileriGoster as digerleriGoster
} from './modules/diger.js';

import {
    hazirPromptDetayGoster,
    hazirPromptSil,
    hazirPromptDuzenle,
    butonOlaylariAyarla as hazirPromptButonOlaylariAyarla,
    dosyaYuklemeOlaylariAyarla as hazirPromptDosyaYuklemeOlaylariAyarla,
    verileriGoster as hazirPromptlariGoster,
    bogazManzaraliPozuEkle
} from './modules/hazir-promptlar.js';

import {
    fotografTurleriniDoldur
} from './modules/fotograf-turleri.js';

import {
    mixerBaslat
} from './modules/mixer.js';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    console.log("Influencer Prompt Yöneticisi başlatılıyor...");
    
    // Verileri localStorage'dan yükle
    verileriYukle();
    
    // Genel olayları ayarla
    genelOlaylarAyarla();
    
    // Her modül için buton olaylarını ayarla
    tumModullerOlaylariAyarla();
    
    // Dosya yükleme olaylarını ayarla
    tumDosyaYuklemeOlaylariAyarla();
    
    // Örnek verileri yükle (eğer veritabanı boşsa)
    ornekVerileriYukle();
    
    // Tüm modüllerin verilerini göster
    tumModulVerileriniGoster();
    
    // Fotoğraf türleri bölümünü doldur
    fotografTurleriniDoldur();
    
    // Mixer modülünü başlat
    mixerBaslat();
    
    // İlk sekmedeki içeriği göster
    ilkTabiGoster();
    
    // Her şey yüklendi
    console.log("Uygulama başarıyla yüklendi");
});

// Genel olayları ayarla (tüm modüller için ortak olanlar)
function genelOlaylarAyarla() {
    // Navigasyon olaylarını ayarla
    navigasyonuAyarla();
    
    // Arama ve filtreleme olaylarını ayarla
    aramaFiltrelemeAyarla();
    
    // Silme iptal butonu
    document.getElementById('sil-iptal')?.addEventListener('click', () => {
        modalKontrol('sil-onay-modal', false);
    });
    
    // Tüm kapat butonları
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });
}

// Tüm modüllerin olay işleyicilerini ayarla
function tumModullerOlaylariAyarla() {
    karakterButonOlaylariAyarla();
    kiyafetButonOlaylariAyarla();
    mekanButonOlaylariAyarla();
    digerButonOlaylariAyarla();
    hazirPromptButonOlaylariAyarla();
}

// Tüm modüllerin verilerini görüntüle
function tumModulVerileriniGoster() {
    karakterleriGoster();
    kiyafetleriGoster();
    mekanlariGoster();
    digerleriGoster();
    hazirPromptlariGoster();
    
    // Boğaz Manzaralı Pozu otomatik olarak ekle
    bogazManzaraliPozuEkle();
}

// Tüm dosya yükleme olaylarını ayarla
function tumDosyaYuklemeOlaylariAyarla() {
    karakterDosyaYuklemeOlaylariAyarla();
    kiyafetDosyaYuklemeOlaylariAyarla();
    mekanDosyaYuklemeOlaylariAyarla();
    digerDosyaYuklemeOlaylariAyarla();
    hazirPromptDosyaYuklemeOlaylariAyarla();
}

// Global fonksiyonlar - HTML'de onclick olaylarında kullanılıyor
window.itemSil = function(tip, id) {
    // Silme onay modalını aç
    document.getElementById('sil-onay').dataset.tip = tip;
    document.getElementById('sil-onay').dataset.id = id;
    modalKontrol('sil-onay-modal', true);
    
    // Silme işlemi için işlevsellik ekle
    document.getElementById('sil-onay').onclick = function() {
        const tip = this.dataset.tip;
        const id = this.dataset.id;
        
        // İlgili modülün silme fonksiyonunu çağır
        let basarili = false;
        
        switch(tip) {
            case 'karakterler':
                basarili = karakterSil(id);
                break;
            case 'kiyafetler':
                basarili = kiyafetSil(id);
                break;
            case 'mekanlar':
                basarili = mekanSil(id);
                break;
            case 'diger':
                basarili = digerSil(id);
                break;
            case 'hazir_promptlar':
                basarili = hazirPromptSil(id);
                break;
        }
        
        if (basarili) {
            showToast(`Öğe başarıyla silindi`, "success");
        } else {
            showToast(`Silme işlemi başarısız oldu`, "error");
        }
        
        // Modalı kapat
        modalKontrol('sil-onay-modal', false);
        
        // Detay modalı açıksa onu da kapat
        modalKontrol('detay-modal', false);
    };
};

window.itemDuzenle = function(tip, id) {
    // İlgili modülün düzenleme fonksiyonunu çağır
    switch(tip) {
        case 'karakterler':
            karakterDuzenle(id);
            break;
        case 'kiyafetler':
            kiyafetDuzenle(id);
            break;
        case 'mekanlar':
            mekanDuzenle(id);
            break;
        case 'diger':
            digerDuzenle(id);
            break;
        case 'hazir_promptlar':
            hazirPromptDuzenle(id);
            break;
    }
    
    // Detay modalı açıksa onu kapat
    modalKontrol('detay-modal', false);
};

window.detayGoster = function(tip, id) {
    // İlgili modülün detay görüntüleme fonksiyonunu çağır
    switch(tip) {
        case 'karakterler':
            karakterDetayGoster(id);
            break;
        case 'kiyafetler':
            kiyafetDetayGoster(id);
            break;
        case 'mekanlar':
            mekanDetayGoster(id);
            break;
        case 'diger':
            digerDetayGoster(id);
            break;
        case 'hazir_promptlar':
            hazirPromptDetayGoster(id);
            break;
    }
};

window.pozuKaraktereEkle = function(karakterId, pozId) {
    if (!pozId) {
        showToast("Lütfen bir poz seçin!", "warning");
        return;
    }
    
    // Karakter pozlarını güncelle
    const basarili = pozaKarakterEkle(karakterId, pozId);
    
    if (basarili) {
        showToast("Poz başarıyla eklendi", "success");
        // Detay ekranını güncelle
        karakterDetayGoster(karakterId);
    } else {
        showToast("Bu poz zaten eklenmiş!", "warning");
    }
};

window.pozuKarakterdenSil = function(karakterId, pozId) {
    // Karakter pozlarını güncelle
    const basarili = pozaKarakterSil(karakterId, pozId);
    
    if (basarili) {
        showToast("Poz başarıyla silindi", "success");
        // Detay ekranını güncelle
        karakterDetayGoster(karakterId);
    }
};
