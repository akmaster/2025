// Prompt Mixer Module: Farklı bileşenleri bir araya getirip birleşik prompt oluşturur

// İlgili modülleri içe aktar
import { DB, showToast } from './base.js';

// Mixer'ı başlatma
function mixerBaslat() {
    // Karakter, kıyafet ve mekan seçicileri
    const karakterSelect = document.getElementById('mixer-karakter-select');
    const kiyafetSelect = document.getElementById('mixer-kiyafet-select');
    const mekanSelect = document.getElementById('mixer-mekan-select');
    
    // Önizleme alanları
    const karakterPreview = document.getElementById('mixer-karakter-preview');
    const kiyafetPreview = document.getElementById('mixer-kiyafet-preview');
    const mekanPreview = document.getElementById('mixer-mekan-preview');
    
    // Birleşik görsel ve prompt alanları
    const visualPreview = document.getElementById('mixer-visual-preview');
    const promptOutput = document.getElementById('mixer-prompt-output');
    
    // Butonlar
    const kopyalaBtn = document.getElementById('mixer-kopyala-btn');
    const temizleBtn = document.getElementById('temizle-mixer-btn');
    
    // Seçicileri doldur
    mixerSelectleriDoldur();
    
    // Olay dinleyicilerini ayarla
    if (karakterSelect) {
        karakterSelect.addEventListener('change', function() {
            karakterOnizlemeGuncelle(this.value);
            birlesikPromptGuncelle();
        });
    }
    
    if (kiyafetSelect) {
        kiyafetSelect.addEventListener('change', function() {
            kiyafetOnizlemeGuncelle(this.value);
            birlesikPromptGuncelle();
        });
    }
    
    if (mekanSelect) {
        mekanSelect.addEventListener('change', function() {
            mekanOnizlemeGuncelle(this.value);
            birlesikPromptGuncelle();
        });
    }
    
    // Kopyalama butonu
    if (kopyalaBtn) {
        kopyalaBtn.addEventListener('click', function() {
            const promptMetni = promptOutput.value;
            if (promptMetni.trim() === '') {
                showToast("Kopyalanacak prompt bulunamadı", "warning");
                return;
            }
            promptKopyala(promptMetni);
        });
    }
    
    // Temizleme butonu
    if (temizleBtn) {
        temizleBtn.addEventListener('click', function() {
            mixerSifirla();
        });
    }
}

// Seçimleri veritabanından doldur
function mixerSelectleriDoldur() {
    // Karakter seçimlerini doldur
    const karakterSelect = document.getElementById('mixer-karakter-select');
    if (karakterSelect) {
        karakterSelect.innerHTML = '<option value="">Karakter seçiniz...</option>';
        DB.karakterler.forEach(karakter => {
            karakterSelect.innerHTML += `<option value="${karakter.id}">${karakter.isim}</option>`;
        });
    }
    
    // Kıyafet seçimlerini doldur
    const kiyafetSelect = document.getElementById('mixer-kiyafet-select');
    if (kiyafetSelect) {
        kiyafetSelect.innerHTML = '<option value="">Kıyafet seçiniz...</option>';
        DB.kiyafetler.forEach(kiyafet => {
            kiyafetSelect.innerHTML += `<option value="${kiyafet.id}">${kiyafet.isim}</option>`;
        });
    }
    
    // Mekan seçimlerini doldur
    const mekanSelect = document.getElementById('mixer-mekan-select');
    if (mekanSelect) {
        mekanSelect.innerHTML = '<option value="">Mekan seçiniz...</option>';
        DB.mekanlar.forEach(mekan => {
            mekanSelect.innerHTML += `<option value="${mekan.id}">${mekan.isim}</option>`;
        });
    }
}

// Karakter önizleme güncelleme
function karakterOnizlemeGuncelle(karakterId) {
    const preview = document.getElementById('mixer-karakter-preview');
    if (!preview) return;
    
    // Boş seçim durumu
    if (!karakterId) {
        preview.innerHTML = '';
        return;
    }
    
    // Karakteri bul
    const karakter = DB.karakterler.find(k => k.id === karakterId);
    if (!karakter) {
        preview.innerHTML = '<div class="not-found">Karakter bulunamadı</div>';
        return;
    }
    
    // Önizleme oluştur
    let onizleme = `
        <div class="mixer-preview-content">
            <div class="mixer-preview-images">
    `;
    
    if (karakter.gorselYuzUrl) {
        onizleme += `
            <div class="preview-image">
                <img src="${karakter.gorselYuzUrl}" alt="${karakter.isim} yüz">
            </div>
        `;
    }
    
    if (karakter.gorselBoyUrl) {
        onizleme += `
            <div class="preview-image">
                <img src="${karakter.gorselBoyUrl}" alt="${karakter.isim} boy">
            </div>
        `;
    }
    
    onizleme += `
            </div>
            <div class="mixer-preview-details">
                <h4>${karakter.isim}</h4>
                <div class="preview-attributes">
                    ${karakter.yas ? `<span class="preview-attribute"><i class="fas fa-birthday-cake"></i> ${karakter.yas} yaş</span>` : ''}
                    ${karakter.boy ? `<span class="preview-attribute"><i class="fas fa-ruler-vertical"></i> ${karakter.boy} cm</span>` : ''}
                </div>
                <div class="preview-prompt">
                    <div class="preview-prompt-title">Prompt</div>
                    <div class="preview-prompt-content">${karakter.prompt}</div>
                </div>
            </div>
        </div>
    `;
    
    preview.innerHTML = onizleme;
}

// Kıyafet önizleme güncelleme
function kiyafetOnizlemeGuncelle(kiyafetId) {
    const preview = document.getElementById('mixer-kiyafet-preview');
    if (!preview) return;
    
    // Boş seçim durumu
    if (!kiyafetId) {
        preview.innerHTML = '';
        return;
    }
    
    // Kıyafeti bul
    const kiyafet = DB.kiyafetler.find(k => k.id === kiyafetId);
    if (!kiyafet) {
        preview.innerHTML = '<div class="not-found">Kıyafet bulunamadı</div>';
        return;
    }
    
    // Önizleme oluştur
    let onizleme = `
        <div class="mixer-preview-content">
            <div class="mixer-preview-images">
    `;
    
    if (kiyafet.gorselUrl) {
        onizleme += `
            <div class="preview-image">
                <img src="${kiyafet.gorselUrl}" alt="${kiyafet.isim}">
            </div>
        `;
    }
    
    onizleme += `
            </div>
            <div class="mixer-preview-details">
                <h4>${kiyafet.isim}</h4>
                <div class="preview-prompt">
                    <div class="preview-prompt-title">Prompt</div>
                    <div class="preview-prompt-content">${kiyafet.prompt}</div>
                </div>
            </div>
        </div>
    `;
    
    preview.innerHTML = onizleme;
}

// Mekan önizleme güncelleme
function mekanOnizlemeGuncelle(mekanId) {
    const preview = document.getElementById('mixer-mekan-preview');
    if (!preview) return;
    
    // Boş seçim durumu
    if (!mekanId) {
        preview.innerHTML = '';
        return;
    }
    
    // Mekanı bul
    const mekan = DB.mekanlar.find(m => m.id === mekanId);
    if (!mekan) {
        preview.innerHTML = '<div class="not-found">Mekan bulunamadı</div>';
        return;
    }
    
    // Önizleme oluştur
    let onizleme = `
        <div class="mixer-preview-content">
            <div class="mixer-preview-images">
    `;
    
    if (mekan.gorselUrl) {
        onizleme += `
            <div class="preview-image">
                <img src="${mekan.gorselUrl}" alt="${mekan.isim}">
            </div>
        `;
    }
    
    onizleme += `
            </div>
            <div class="mixer-preview-details">
                <h4>${mekan.isim}</h4>
                <div class="preview-prompt">
                    <div class="preview-prompt-title">Prompt</div>
                    <div class="preview-prompt-content">${mekan.prompt}</div>
                </div>
            </div>
        </div>
    `;
    
    preview.innerHTML = onizleme;
}

// Birleşik görsel ve prompt güncelleme
function birlesikPromptGuncelle() {
    const promptOutput = document.getElementById('mixer-prompt-output');
    const visualPreview = document.getElementById('mixer-visual-preview');
    
    if (!promptOutput || !visualPreview) return;
    
    // Seçimleri al
    const karakterId = document.getElementById('mixer-karakter-select')?.value;
    const kiyafetId = document.getElementById('mixer-kiyafet-select')?.value;
    const mekanId = document.getElementById('mixer-mekan-select')?.value;
    
    // Seçilen öğeleri bul
    const karakter = karakterId ? DB.karakterler.find(k => k.id === karakterId) : null;
    const kiyafet = kiyafetId ? DB.kiyafetler.find(k => k.id === kiyafetId) : null;
    const mekan = mekanId ? DB.mekanlar.find(m => m.id === mekanId) : null;
    
    // Görsel önizleme güncelleme
    if (karakter || kiyafet || mekan) {
        let gorselHTML = '<div class="mixer-visual-grid">';
        
        // Karakter görseli
        if (karakter && karakter.gorselBoyUrl) {
            gorselHTML += `
                <div class="mixer-visual-item">
                    <div class="mixer-visual-image">
                        <img src="${karakter.gorselBoyUrl}" alt="${karakter.isim}">
                    </div>
                    <div class="mixer-visual-caption">Karakter</div>
                </div>
            `;
        }
        
        // Kıyafet görseli
        if (kiyafet && kiyafet.gorselUrl) {
            gorselHTML += `
                <div class="mixer-visual-item">
                    <div class="mixer-visual-image">
                        <img src="${kiyafet.gorselUrl}" alt="${kiyafet.isim}">
                    </div>
                    <div class="mixer-visual-caption">Kıyafet</div>
                </div>
            `;
        }
        
        // Mekan görseli
        if (mekan && mekan.gorselUrl) {
            gorselHTML += `
                <div class="mixer-visual-item">
                    <div class="mixer-visual-image">
                        <img src="${mekan.gorselUrl}" alt="${mekan.isim}">
                    </div>
                    <div class="mixer-visual-caption">Mekan</div>
                </div>
            `;
        }
        
        gorselHTML += '</div>';
        visualPreview.innerHTML = gorselHTML;
    } else {
        // Hiçbir şey seçilmemiş
        visualPreview.innerHTML = `
            <div class="mixer-empty-state">
                <i class="fas fa-image"></i>
                <p>Karakter, kıyafet ve mekan seçtikçe görsel önizleme oluşturulacak</p>
            </div>
        `;
    }
    
    // Prompt oluşturma
    let birlesikPrompt = '';
    
    // Karakter prompt'u
    if (karakter) {
        birlesikPrompt += karakter.prompt;
    }
    
    // Kıyafet prompt'u
    if (kiyafet) {
        // Eğer önceki prompt varsa bir boşluk ekle
        if (birlesikPrompt) {
            birlesikPrompt += '\n\n';
        }
        birlesikPrompt += `Üzerinde: ${kiyafet.prompt}`;
    }
    
    // Mekan prompt'u
    if (mekan) {
        // Eğer önceki prompt varsa bir boşluk ekle
        if (birlesikPrompt) {
            birlesikPrompt += '\n\n';
        }
        birlesikPrompt += `Mekan: ${mekan.prompt}`;
    }
    
    // Prompt'u textarea'ya yaz
    promptOutput.value = birlesikPrompt;
}

// Mixer'ı sıfırlama
function mixerSifirla() {
    // Seçimleri sıfırla
    const karakterSelect = document.getElementById('mixer-karakter-select');
    const kiyafetSelect = document.getElementById('mixer-kiyafet-select');
    const mekanSelect = document.getElementById('mixer-mekan-select');
    
    if (karakterSelect) karakterSelect.value = '';
    if (kiyafetSelect) kiyafetSelect.value = '';
    if (mekanSelect) mekanSelect.value = '';
    
    // Önizlemeleri temizle
    const karakterPreview = document.getElementById('mixer-karakter-preview');
    const kiyafetPreview = document.getElementById('mixer-kiyafet-preview');
    const mekanPreview = document.getElementById('mixer-mekan-preview');
    
    if (karakterPreview) karakterPreview.innerHTML = '';
    if (kiyafetPreview) kiyafetPreview.innerHTML = '';
    if (mekanPreview) mekanPreview.innerHTML = '';
    
    // Birleşik görsel ve prompt'u temizle
    const visualPreview = document.getElementById('mixer-visual-preview');
    const promptOutput = document.getElementById('mixer-prompt-output');
    
    if (visualPreview) {
        visualPreview.innerHTML = `
            <div class="mixer-empty-state">
                <i class="fas fa-image"></i>
                <p>Karakter, kıyafet ve mekan seçtikçe görsel önizleme oluşturulacak</p>
            </div>
        `;
    }
    
    if (promptOutput) promptOutput.value = '';
    
    showToast("Mixer sıfırlandı", "info");
}

// Dışa aktarılacak fonksiyonlar
export {
    mixerBaslat,
    mixerSelectleriDoldur,
    karakterOnizlemeGuncelle,
    kiyafetOnizlemeGuncelle,
    mekanOnizlemeGuncelle,
    birlesikPromptGuncelle,
    mixerSifirla
};
