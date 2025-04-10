// Model pozlarının tanımlamaları
const pozTanimlari = [
    {
        id: "poz1",
        isim: "Plajda Ayakta Duruş",
        aciklama: "Emma, plajda doğrudan kameraya bakarak ayakta duruyor. Bir kalçaya hafifçe ağırlık vermiş, özgüvenli duruş. Kolları doğal şekilde yanlarında, omuzlar geriye doğru hafif açık. Yüzünde yumuşak bir gülümseme ile saçları hafif rüzgarla savruluyor.",
        kategori: "ayakta"
    },
    {
        id: "poz2",
        isim: "Kumsalda Oturuş",
        aciklama: "Emma, kumsal üzerinde oturuyor. Bacakları yanına uzatılmış, vücudu hafifçe öne eğik ve bir eli kumun üzerinde destek olarak kullanılmış. Diğer eli saçlarını kulak arkasına atarken, kameraya dönük olarak omuz üzerinden bakıyor. Rahat ve doğal bir poz.",
        kategori: "oturma"
    },
    {
        id: "poz3",
        isim: "Deniz Kenarında Yürüyüş",
        aciklama: "Emma, sahil boyunca suyun kenarında yürürken yakalanmış dinamik bir poz. Kameraya bakmadan ilerleme hareketi içinde, adım atarken hafif bir salınım. Saçları ve kıyafeti esintide hareket halinde. Su ayak bileklerine kadar vuruyor. Doğal ve canlı bir hareket içinde.",
        kategori: "hareket"
    },
    {
        id: "poz4",
        isim: "Şezlongda Uzanış",
        aciklama: "Emma, plaj şezlongunda uzanıyor. Vücudu kameraya dönük, başı hafifçe kalkık ve bir eliyle güneş gözlüklerini düzeltiyor. Diğer eli şezlongda dinleniyor. Rahat ve şık bir poz. Güneşin cildi güzelce aydınlattığı, dinlenen bir görüntü.",
        kategori: "uzanma"
    },
    {
        id: "poz5",
        isim: "Selfie Çekimi",
        aciklama: "Emma, bir selfie çekiyormuş gibi poz veriyor. Kameraya yakın bir açıda, kolunu uzatmış ve hafifçe yukarıdan çekim açısı. Dudakları hafif aralık doğal bir gülümseme, gözleri doğrudan kameraya bakıyor. Modern ve sosyal medyaya uygun bir poz.",
        kategori: "selfie"
    }
];

// Dışa aktarımı için
if (typeof module !== 'undefined') {
    module.exports = pozTanimlari;
}
