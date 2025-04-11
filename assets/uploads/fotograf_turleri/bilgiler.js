// Fotoğraf türleri bilgileri
// Bu dosya, fotoğraf çekim türleri ve açıları hakkında bilgileri içerir

// Fotoğraf Çekim Türleri
const cekimTurleri = [
    {
        id: "ct001",
        isim: "Portre (Portrait)",
        aciklama: "Yüz ve genellikle omuzları kapsayan yakın çekim türü. Karakterin yüz ifadesi ve kişiliğini vurgulamak için kullanılır.",
        ipucu: "Yapay zeka promptlarında sadece 'portrait' veya 'portrait shot' olarak belirtmek yeterlidir."
    },
    {
        id: "ct002",
        isim: "Baş Çekimi (Headshot)",
        aciklama: "Sadece yüz ve baş bölgesine odaklanan, daha yakın bir çekim türü. Profesyonel profil ve aktör tanıtım fotoğraflarında yaygın olarak kullanılır.",
        ipucu: "Yapay zeka promptlarında 'headshot', 'close-up portrait' veya 'head and shoulders shot' olarak belirtilebilir."
    },
    {
        id: "ct003",
        isim: "Yarım Boy (Half-Length)",
        aciklama: "Karakterin bel veya kalça bölgesine kadar görüldüğü çekim türü. Hem kişiyi hem de giyiminin bir kısmını göstermeye olanak tanır.",
        ipucu: "Promptlarda 'half-length shot', 'mid-shot' veya 'waist-up shot' şeklinde kullanılabilir."
    },
    {
        id: "ct004",
        isim: "Üç Çeyrek Boy (Three-Quarter Length)",
        aciklama: "Karakterin diz veya baldır bölgesine kadar göründüğü çekim türü. Kıyafetlerin büyük kısmını ve vücut dilini göstermeye uygun.",
        ipucu: "Promptlarda 'three-quarter length' veya '3/4 length shot' olarak belirtilebilir."
    },
    {
        id: "ct005",
        isim: "Tam Boy (Full-Length)",
        aciklama: "Karakterin tepeden tırnağa tüm vücudunun göründüğü çekim türü. Kıyafet, duruş ve kişinin tam görünümü için idealdir.",
        ipucu: "Promptlarda 'full-length shot', 'full body shot' veya 'head to toe shot' şeklinde kullanılabilir."
    },
    {
        id: "ct006",
        isim: "Çevresel Portre (Environmental Portrait)",
        aciklama: "Karakteri anlamlı bir ortam içinde gösteren çekim türü. Kişinin yaşam tarzı, mesleği veya kişiliği hakkında bilgi verir.",
        ipucu: "Promptlarda 'environmental portrait' veya 'character in context' olarak kullanılabilir."
    },
    {
        id: "ct007",
        isim: "Sıcak Çekim (Close-Up)",
        aciklama: "Belirli bir detaya, genellikle yüz bölgesine çok yakından odaklanan çekim. Duygu ve ifadeyi vurgulamak için kullanılır.",
        ipucu: "Promptlarda 'close-up' veya 'tight shot' olarak kullanılabilir. Belirli bir bölge için 'close-up of eyes/hands' şeklinde detaylandırın."
    },
    {
        id: "ct008",
        isim: "Aşırı Yakın Çekim (Extreme Close-Up)",
        aciklama: "Çok spesifik bir detaya, örneğin göz veya dudaklara odaklanan çok yakın çekim türü. Dramatik etki için kullanılır.",
        ipucu: "Promptlarda 'extreme close-up' veya 'macro shot' olarak belirtilebilir."
    },
    {
        id: "ct009",
        isim: "Grup Çekimi (Group Shot)",
        aciklama: "Birden fazla karakterin bir arada göründüğü çekim türü. Herkesin görünür ve dengeli olarak yerleştirilmesi önemlidir.",
        ipucu: "Promptlarda 'group shot', 'group portrait' veya 'ensemble shot' olarak belirtilir. Kişi sayısını da ekleyin."
    },
    {
        id: "ct010",
        isim: "Aksiyon Çekimi (Action Shot)",
        aciklama: "Hareket halindeki bir karakteri yakalayan çekim türü. Spor, dans veya günlük aktiviteler için idealdir.",
        ipucu: "Promptlarda 'action shot', 'in motion' veya 'dynamic pose' olarak kullanılabilir."
    }
];

// Fotoğraf Çekim Açıları
const cekimAcilari = [
    {
        id: "ca001",
        isim: "Göz Hizası (Eye Level)",
        aciklama: "Kamera süjenin göz hizasında, ne yukarıda ne aşağıda. En doğal ve tarafsız perspektifi sunar.",
        etki: "Eşitlik ve doğrudan iletişim hissi verir. İzleyici karakterle aynı seviyede hisseder.",
        ipucu: "Çoğu portre çekimi için varsayılan açıdır, yapay zeka promptlarında özellikle belirtmeye gerek olmayabilir."
    },
    {
        id: "ca002",
        isim: "Kuş Bakışı (Bird's Eye View / High Angle)",
        aciklama: "Kamera süjenin yukarısında, aşağıya doğru bakar şekilde konumlandırılır.",
        etki: "Karakteri daha küçük, savunmasız veya güçsüz gösterebilir. Ortamın bağlamını göstermek için de kullanılır.",
        ipucu: "Promptlarda 'high angle', 'looking down at subject' veya 'bird's eye view' olarak belirtilir."
    },
    {
        id: "ca003",
        isim: "Alçak Açı (Low Angle)",
        aciklama: "Kamera süjenin aşağısında, yukarıya doğru bakar şekilde konumlandırılır.",
        etki: "Karakteri daha büyük, güçlü veya etkileyici gösterir. Otorite ve güç hissi yaratır.",
        ipucu: "Promptlarda 'low angle', 'looking up at subject' veya 'worm's eye view' (aşırı alçak açı için) olarak belirtilir."
    },
    {
        id: "ca004",
        isim: "Eğik Açı (Dutch Angle)",
        aciklama: "Kamera yatay eksende eğilerek, görüntünün eğik olmasını sağlar.",
        etki: "Rahatsızlık, gerilim veya dengesizlik hissi uyandırır. Dramatik etki için kullanılır.",
        ipucu: "Promptlarda 'dutch angle', 'tilted angle' veya 'canted angle' olarak belirtilebilir."
    },
    {
        id: "ca005",
        isim: "Omuz Üstü (Over-the-Shoulder)",
        aciklama: "Kamera bir karakterin omzu üzerinden diğer karaktere veya nesneye bakar.",
        etki: "İzleyiciyi sahneye dahil eder ve iki özne arasındaki ilişkiyi gösterir.",
        ipucu: "Promptlarda 'over-the-shoulder shot' veya 'OTS shot' olarak belirtilir."
    },
    {
        id: "ca006",
        isim: "Profil (Profile)",
        aciklama: "Karakter yandan görünür, yüzün veya vücudun yan görünümü.",
        etki: "Karakterin siluetini vurgular ve klasik bir portre etkisi yaratır.",
        ipucu: "Promptlarda 'profile view', 'side view' veya 'profile shot' olarak belirtilir."
    },
    {
        id: "ca007",
        isim: "Arka Plan (Backdrop)",
        aciklama: "Kamera arkadan çekim yapar, karakterin arkasından görüntü alır.",
        etki: "Gizem duygusu yaratır ve karakterin baktığı manzarayı vurgular.",
        ipucu: "Promptlarda 'from behind', 'back view' veya 'rear view' olarak belirtilir."
    }
];
