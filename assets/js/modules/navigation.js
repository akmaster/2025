// Navigation Module: Tüm tab geçişleri ve navigasyon yönetimi

// İlgili modülleri içe aktar
import { verileriGoster as karakterleriGoster } from './karakterler.js';
import { verileriGoster as kiyafetleriGoster } from './kiyafetler.js';
import { verileriGoster as mekanlariGoster } from './mekanlar.js';
import { verileriGoster as digerleriGoster } from './diger.js';
import { fotografTurleriniDoldur } from './fotograf-turleri.js';
import { mixerSelectleriDoldur } from './mixer.js';

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
            
            // İlgili tab içeriğini göster
            sekmeyeGoreIcerikYukle(hedefId);
        });
    });
}

// Sekmeye göre ilgili modülün içerik yükleme fonksiyonunu çağır
function sekmeyeGoreIcerikYukle(tabId, aramaMetni = "", siralama = "isim-az") {
    switch(tabId) {
        case 'karakterler':
            karakterleriGoster(aramaMetni, siralama);
            break;
        case 'kiyafetler':
            kiyafetleriGoster(aramaMetni, siralama);
            break;
        case 'mekanlar':
            mekanlariGoster(aramaMetni, siralama);
            break;
        case 'diger':
            digerleriGoster(aramaMetni, siralama);
            break;
        case 'fotograf-turleri':
            fotografTurleriniDoldur();
            break;
        case 'mixer':
            mixerSelectleriDoldur();
            break;
    }
}

// Boş alan bulunan ilk sekmeyi göster
function ilkTabiGoster() {
    // İlk olarak aktif olan sekmeyi bul
    const aktifLink = document.querySelector('header nav ul li a.active');
    const aktifTabId = aktifLink ? aktifLink.getAttribute('href').substring(1) : 'karakterler';
    
    // İlgili sekmeyi göster
    sekmeyeGoreIcerikYukle(aktifTabId);
}

// Arama ve Filtreleme olaylarını ayarla
function aramaFiltrelemeAyarla() {
    // Karakter arama
    document.getElementById('karakter-ara').addEventListener('input', function() {
        karakterleriGoster(this.value, document.getElementById('karakter-sirala').value);
    });
    
    // Karakter sıralama
    document.getElementById('karakter-sirala').addEventListener('change', function() {
        karakterleriGoster(document.getElementById('karakter-ara').value, this.value);
    });
    
    // Kıyafet arama
    document.getElementById('kiyafet-ara').addEventListener('input', function() {
        kiyafetleriGoster(this.value, document.getElementById('kiyafet-sirala').value);
    });
    
    // Kıyafet sıralama
    document.getElementById('kiyafet-sirala').addEventListener('change', function() {
        kiyafetleriGoster(document.getElementById('kiyafet-ara').value, this.value);
    });
    
    // Mekan arama
    document.getElementById('mekan-ara').addEventListener('input', function() {
        mekanlariGoster(this.value, document.getElementById('mekan-sirala').value);
    });
    
    // Mekan sıralama
    document.getElementById('mekan-sirala').addEventListener('change', function() {
        mekanlariGoster(document.getElementById('mekan-ara').value, this.value);
    });
    
    // Diğer arama
    document.getElementById('diger-ara').addEventListener('input', function() {
        digerleriGoster(this.value, document.getElementById('diger-sirala').value);
    });
    
    // Diğer sıralama
    document.getElementById('diger-sirala').addEventListener('change', function() {
        digerleriGoster(document.getElementById('diger-ara').value, this.value);
    });
}

// Dışa aktarılacak fonksiyonlar
export {
    navigasyonuAyarla,
    sekmeyeGoreIcerikYukle,
    ilkTabiGoster,
    aramaFiltrelemeAyarla
};
