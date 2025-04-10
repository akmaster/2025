// Fotoğraf çekim türleri bilgileri
const fotografCekimTurleri = [
    {
        id: "head-shot",
        isim: "Baş Çekimi (Head Shot)",
        aciklama: "Sadece baş ve boyun bölgesini içeren yakın çekim. Özellikle oyunculuk portfolyolarında kullanılır.",
        icon: "fa-user-circle"
    },
    {
        id: "portrait",
        isim: "Portre (Portrait)",
        aciklama: "Yüz odaklı, genellikle omuzları da içeren klasik çekim tipi. İfade ve yüz detaylarına odaklanır.",
        icon: "fa-portrait"
    },
    {
        id: "bust-shot",
        isim: "Büst Çekimi (Bust Shot)",
        aciklama: "Baş ve göğüs bölgesini içeren, yaklaşık göğüs hizasında biten çekim.",
        icon: "fa-user-alt"
    },
    {
        id: "medium-shot",
        isim: "Yarım Boy (Medium Shot)",
        aciklama: "Belden yukarısını içeren çekim tipi.",
        icon: "fa-user-tie"
    },
    {
        id: "three-quarter",
        isim: "Üç Çeyrek Boy (Three-Quarter Length)",
        aciklama: "Dizlerden veya uyluktan yukarısını içeren çekim.",
        icon: "fa-user-alt"
    },
    {
        id: "full-length",
        isim: "Tam Boy (Full-Length)",
        aciklama: "Tüm vücudu kapsayan çekim tipi. Ayaklar ve vücudun tamamı görünür.",
        icon: "fa-user"
    },
    {
        id: "close-up",
        isim: "Yakın Çekim (Close-up)",
        aciklama: "Genellikle yüzün detaylarına odaklanan çok yakın çekim.",
        icon: "fa-search-plus"
    },
    {
        id: "extreme-close-up",
        isim: "Extreme Close-up",
        aciklama: "Gözler, dudaklar gibi sadece bir yüz özelliğine odaklanan aşırı yakın çekim.",
        icon: "fa-eye"
    },
    {
        id: "environmental-portrait",
        isim: "Çevresel Portre (Environmental Portrait)",
        aciklama: "Kişiyi bulunduğu ortamla birlikte, bağlam içinde gösteren çekim.",
        icon: "fa-mountains"
    }
];

const fotografCekimAcilari = [
    {
        id: "eye-level",
        isim: "Göz Hizası (Eye Level)",
        aciklama: "En doğal açı. Konu ile aynı seviyeden çekim.",
        icon: "fa-arrows-alt-h"
    },
    {
        id: "high-angle",
        isim: "Yukarıdan (High Angle/Bird's Eye)",
        aciklama: "Konuya yukarıdan bakış. Konuyu daha küçük ve kırılgan gösterir.",
        icon: "fa-angle-down"
    },
    {
        id: "low-angle",
        isim: "Aşağıdan (Low Angle/Worm's Eye)",
        aciklama: "Konuya aşağıdan bakış. Konuyu daha büyük ve güçlü gösterir.",
        icon: "fa-angle-up"
    }
];

// Dışa aktarımı için
if (typeof module !== 'undefined') {
    module.exports = {
        fotografCekimTurleri,
        fotografCekimAcilari
    };
}
