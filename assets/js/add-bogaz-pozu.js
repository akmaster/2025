// Boğaz Manzaralı Poz dosyasını DB'ye ekleyen script

// localStorage'dan mevcut verileri çekme
function loadDB() {
    if (localStorage.getItem('influencerDB')) {
        return JSON.parse(localStorage.getItem('influencerDB'));
    } else {
        return {
            karakterler: [],
            kiyafetler: [],
            mekanlar: [],
            diger: []
        };
    }
}

// Boğaz Manzara Pozu kıyafet verisini oluşturma
function createBogazPozuItem() {
    return {
        id: Date.now().toString(), // Benzersiz ID oluştur
        isim: "İstanbul Boğaz Manzaralı Poz",
        kategori: "elbise",
        prompt: `Boğaz manzaralı İstanbul dairesinde kiremit-turuncu renkli koltukta oturan zarif kadın. Koltukta rahat bir şekilde oturuyor, vücut hafif sağa dönük, bacaklar şık biçimde yana çaprazlanmış. Sağ kolunu koltuğun kenarına yerleştirmiş, sol eli ise hafifçe dizinde duruyor. 

Üzerinde oda renklerine uyumlu, kahverengi-toprak tonlarında ipek bir elbise. Elbise vücuda hafifçe oturan, dizlerin üzerinde, ince askılı ve dekolteli bir model. Kumaş ışıkta zarif bir şekilde parıldıyor. Ayaklarında minimal tasarımlı altın-bronz tonlarında ince topuklu sandalet. 

Saçları dalgalı, bal rengi-sarı tonlarında ve omuzlarına dökülüyor. Makyajı doğal ancak göz alıcı, dudaklar nude-pembemsi bir tonla renklendirilmiş. Takı olarak ince altın kolye, minimal küpeler ve birkaç ince bilezik. 

Duruşu kendinden emin ve zarif. Hafif gülümsüyor ve kameraya doğru sakin bir bakış yöneltiyor. Arka planda Boğaz Köprüsü ve İstanbul manzarası, öğleden sonra ışığı odayı ve kadını sıcak bir tonla aydınlatıyor. Kadının kıyafeti ve ten rengi, odanın sıcak toprak tonları ve turuncu-kiremit renkleriyle mükemmel uyum içinde.

Yüksek çözünürlüklü, profesyonel aydınlatma, lifestyle ve iç mimari fotoğrafçılığı kalitesinde, gerçekçi detaylar.`,
        gorselUrl: "assets/uploads/kiyafetler/Istanbul_Bogaz_Manzarali_Poz.png", // Görselin yolunu belirt
        eklemeTarihi: new Date().toISOString()
    };
}

// Veri ekle ve kaydet
function addItemToDB() {
    try {
        // Mevcut DB'yi yükle
        const db = loadDB();
        
        // Yeni öğeyi oluştur
        const newItem = createBogazPozuItem();
        
        // DB'ye ekle
        db.kiyafetler.push(newItem);
        
        // Değişiklikleri kaydet
        localStorage.setItem('influencerDB', JSON.stringify(db));
        
        console.log("Boğaz Manzaralı Poz başarıyla eklendi:", newItem);
        alert("Boğaz Manzaralı Poz başarıyla veritabanına eklendi!");
        
        // Sayfayı yenile
        window.location.reload();
        
    } catch (error) {
        console.error("Veri eklenirken hata oluştu:", error);
        alert("Hata: " + error.message);
    }
}

// Script yüklendiğinde çalıştır
window.addEventListener('DOMContentLoaded', () => {
    // Otomatik olarak çalıştır
    setTimeout(() => {
        addItemToDB();
    }, 1000); // 1 saniye gecikme ile çalıştır (sayfa tam yüklensin diye)
    
    // Ayrıca manuel buton da ekle
    const addButton = document.createElement('button');
    addButton.textContent = 'Boğaz Manzaralı Pozu Ekle';
    addButton.style.position = 'fixed';
    addButton.style.top = '10px';
    addButton.style.right = '10px';
    addButton.style.zIndex = '9999';
    addButton.style.padding = '10px';
    addButton.style.backgroundColor = '#4a86e8';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '5px';
    addButton.style.cursor = 'pointer';
    
    addButton.addEventListener('click', addItemToDB);
    
    document.body.appendChild(addButton);
});
