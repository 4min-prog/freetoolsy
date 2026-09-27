export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  addedAt?: string;
}

export const categories: { id: string; name: string }[] = [
  { id: "text", name: "Metin" },
  { id: "security", name: "Güvenlik" },
  { id: "developer", name: "Geliştirici" },
  { id: "calculation", name: "Hesaplama" },
  { id: "image", name: "Görsel" },
  { id: "seo", name: "SEO" },
  { id: "fun", name: "Eğlence" },
];

export const tools: Tool[] = [
  {
    slug: "character-counter",
    name: "Karakter Sayacı",
    category: "text",
    description:
      "Metnin karakter sayısını, boşluksuz sayımı, satır ve paragraf sayılarını anında gösterir.",
  },
  {
    slug: "word-counter",
    name: "Kelime Sayacı",
    category: "text",
    description:
      "Kelime, cümle ve karakter istatistiklerini hesaplar; tahmini okuma süresini çıkarır.",
  },
  {
    slug: "case-converter",
    name: "Harf Dönüştürücü",
    category: "text",
    description:
      "Metni büyük harfe, küçük harfe, başlık biçimine çevirir veya harfleri ters düz eder; tek tıkla kopyalayın.",
  },
  {
    slug: "password-generator",
    name: "Şifre Üretici",
    category: "security",
    description:
      "Uzunluk ve karakter türlerini seçerek tarayıcınızda güçlü, rastgele parolalar üretir.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    description:
      "JSON kodunuzu düzenler, doğrular ve okunabilir hâle getirir; hataları satır numarasıyla bildirir.",
  },
  {
    slug: "base64",
    name: "Base64 Encoder/Decoder",
    category: "developer",
    description:
      "Metni Base64 biçimine çevirir veya Base64 verisini çözerek özgün içeriğe dönüştürür.",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    category: "developer",
    description:
      "Metni URL güvenli biçime kodlar veya kodlanmış URL parametrelerini anlaşılır hâle getirir.",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Hesaplayıcı",
    category: "calculation",
    description:
      "Boy ve kilonuza göre vücut kitle indeksinizi hesaplar ve sonucu anlaşılır biçimde yorumlar.",
  },
  {
    slug: "vat-calculator",
    name: "KDV Hesaplayıcı",
    category: "calculation",
    description:
      "Tutar ve KDV oranı seçerek vergi tutarı ile toplam tutarı anında hesaplar.",
  },
  {
    slug: "percentage-calculator",
    name: "Yüzde Hesaplayıcı",
    category: "calculation",
    description:
      "Sayının yüzdesini, yüzde değişimini ve bütünün yüzdesini tek ekranda hesaplar.",
  },
  {
    slug: "age-calculator",
    name: "Yaş Hesaplayıcı",
    category: "calculation",
    description:
      "Doğum tarihinize göre yıl, ay, gün, saat, dakika ve saniye cinsinden yaşınızı canlı gösterir.",
  },
  {
    slug: "qr-code-generator",
    name: "QR Kod Oluşturucu",
    category: "developer",
    description:
      "Metni veya bir bağlantıyı tarayıcınızda anında QR koda dönüştürür; PNG olarak indirin.",
  },
  {
    slug: "sha-hash-generator",
    name: "SHA Hash Üretici",
    category: "security",
    description:
      "Metnin SHA-1, SHA-256 veya SHA-512 özetini tarayıcınızda hesaplar; tek tıkla kopyalayın.",
  },
  {
    slug: "date-difference",
    name: "Tarih Farkı",
    category: "calculation",
    description:
      "İki tarih arasındaki yıl, ay, gün, saat ve hafta farkını anında hesaplar.",
  },
  {
    slug: "color-converter",
    name: "Renk Dönüştürücü",
    category: "developer",
    description:
      "HEX, RGB ve HSL değerleri arasında anında dönüşüm yapar; önizleme ve kopyalama sunar.",
  },
  {
    slug: "uuid-generator",
    name: "UUID Üretici",
    category: "developer",
    description:
      "Tek tıkla rastgele UUID v4 (GUID) üretir; birden çok kimliği toplu kopyalayın.",
  },
  {
    slug: "unit-converter",
    name: "Birim Dönüştürücü",
    category: "calculation",
    description:
      "Uzunluk, ağırlık, hacim, alan ve sıcaklık birimleri arasında hızlı dönüşüm yapar.",
  },
  {
    slug: "password-strength-checker",
    name: "Parola Güç Testi",
    category: "security",
    description:
      "Parolanızın ne kadar güçlü olduğunu tahmini entropiyle ölçer ve iyileştirme önerileri sunar.",
  },
  {
    slug: "number-base-converter",
    name: "Sayı Sistemi Dönüştürücü",
    category: "developer",
    description:
      "Sayıları ikili, sekizli, ondalık ve onaltılık sistemler arasında anında dönüştürür.",
  },
  {
    slug: "regex-tester",
    name: "RegEx Testi",
    category: "developer",
    description:
      "Düzenli ifadenizi metin üzerinde canlı olarak test eder ve eşleşmeleri vurgular.",
  },
  {
    slug: "whitespace-cleaner",
    name: "Boşluk Temizleyici",
    category: "text",
    description:
      "Satır başı/sonu boşluklarını temizler, tekrarlı boşlukları birleştirir ve boş satırları kaldırır.",
  },
  {
    slug: "md5-hash",
    name: "MD5 Hash",
    category: "security",
    description:
      "Metnin MD5 özetini tarayıcınızda anında hesaplar; tek tıkla kopyalayın.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Çözücü",
    category: "developer",
    description:
      "JWT token'ın başlık, yük ve imza bölümlerini okunabilir JSON olarak ayırır.",
  },
  {
    slug: "json-csv-converter",
    name: "JSON ↔ CSV Dönüştürücü",
    category: "developer",
    description:
      "JSON veri dizisini CSV'ye veya CSV'yi JSON'a hızlıca dönüştürür.",
  },
  {
    slug: "unix-timestamp-converter",
    name: "Unix Zaman Damgası Çevirici",
    category: "developer",
    description:
      "Unix zaman damgasını tarihe, tarihi zaman damgasına çevirir.",
  },
  {
    slug: "duplicate-line-remover",
    name: "Tekrar Satır Temizleyici",
    category: "text",
    description:
      "Listeden tekrarlanan satırları kaldırır, ilk görünüm sırasını korur.",
  },
  {
    slug: "ai-token-counter",
    name: "AI Token Hesaplayıcı",
    category: "developer",
    description:
      "Metnin tahmini token, karakter, kelime ve satır sayısını gösterir.",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Üretici",
    category: "text",
    description:
      "Tasarım ve metin denemeleri için örnek Lorem Ipsum metni üretir.",
  },
  {
    slug: "tip-calculator",
    name: "Bahşiş Hesaplayıcı",
    category: "calculation",
    description:
      "Hesap tutarı ve orana göre bahşiş ile kişi başı payı hesaplar.",
  },
  {
    slug: "discount-calculator",
    name: "İndirim Hesaplayıcı",
    category: "calculation",
    description:
      "Orijinal fiyat ve indirim oranına göre ödenecek tutarı hesaplar.",
  },
  {
    slug: "average-calculator",
    name: "Ortalama Hesaplayıcı",
    category: "calculation",
    description:
      "Sayı listesinin ortalamasını, toplamını, adet, min ve maks değerlerini verir.",
  },
  {
    slug: "dog-age-calculator",
    name: "Köpek Yaşı Hesaplayıcı",
    category: "calculation",
    description:
      "Köpeğinizin yaşını boyutuna göre yaklaşık insan yaşına çevirir.",
  },
  {
    slug: "subnet-calculator",
    name: "Subnet Hesaplayıcı",
    category: "developer",
    description:
      "IP adresi ve prefixe göre ağ, broadcast, maske ve ana bilgisayar sayısını bulur.",
  },
  {
    slug: "px-rem-converter",
    name: "PX → REM Dönüştürücü",
    category: "developer",
    description:
      "Piksel ve REM birimlerini temel yazı boyutuna göre anında çevirir.",
  },
  {
    slug: "xml-formatter",
    name: "XML Biçimlendirici",
    category: "developer",
    description:
      "XML'i düzenler veya küçültür; hataları anlaşılır biçimde bildirir.",
  },
  {
    slug: "css-minifier",
    name: "CSS Küçültücü",
    category: "developer",
    description:
      "CSS kodunun boyutunu boşlukları ayıklayarak küçültür.",
  },
  {
    slug: "html-minifier",
    name: "HTML Küçültücü",
    category: "developer",
    description:
      "HTML kodunu güvenle küçültür; içerik bloklarını korur.",
  },
  {
    slug: "wcag-contrast-checker",
    name: "WCAG Kontrast Denetleyicisi",
    category: "developer",
    description:
      "İki rengin kontrast oranını ve WCAG erişilebilirlik geçişini kontrol eder.",
  },
  {
    slug: "color-palette-generator",
    name: "Renk Paleti Üretici",
    category: "developer",
    description:
      "Ana renkten uyumlu analog veya tek renk tonları paleti oluşturur.",
  },
  {
    slug: "box-shadow-generator",
    name: "Box Shadow Üretici",
    category: "developer",
    description:
      "Gölge bileşenlerini kaydırarak kullanıma hazır CSS üretir.",
  },
  {
    slug: "text-sorter",
    name: "Metin Sıralayıcı",
    category: "text",
    description:
      "Satırları alfabetik, uzunluk, sayısal veya rastgele sıralar.",
  },
  {
    slug: "list-shuffler",
    name: "Liste Karıştırıcı",
    category: "text",
    description:
      "Listeyi karıştırır veya içinden rastgele bir öğe çeker.",
  },
  {
    slug: "yaml-json-converter",
    name: "YAML ↔ JSON Dönüştürücü",
    category: "developer",
    description:
      "YAML ile JSON arasında iki yönlü dönüşüm yapar.",
  },
  {
    slug: "md5-file-checksum",
    name: "MD5 Dosya Checksum",
    category: "security",
    description:
      "Dosyanın MD5 özetini tarayıcınızda hesaplar; dosya hiçbir yere gönderilmez.",
  },
  {
    slug: "image-compressor",
    name: "Resim Sıkıştırıcı",
    category: "image",
    description:
      "JPEG/PNG görselleri kalite kaybını azaltarak tarayıcınızda küçültür.",
  },
  {
    slug: "image-resizer",
    name: "Resim Boyutlandırıcı",
    category: "image",
    description:
      "Görselleri istediğiniz genişlik ve yüksekliğe, oranı koruyarak ölçekler.",
  },
  {
    slug: "image-converter",
    name: "Resim Dönüştürücü",
    category: "image",
    description:
      "Görselleri JPG, PNG ve WebP arasında anında dönüştürür.",
  },
  {
    slug: "image-to-base64",
    name: "Resimden Base64",
    category: "image",
    description:
      "Görseli data URL / Base64 metnine çevirir, tek tıkla kopyalayın.",
  },
  {
    slug: "image-color-picker",
    name: "Resimden Renk Seçici",
    category: "image",
    description:
      "Görseldeki herhangi bir pikselin rengini HEX ve RGB değeriyle seçin.",
  },
  {
    slug: "slug-generator",
    name: "Slug Üretici",
    category: "seo",
    description:
      "Başlık metnini URL dostu, temiz ve küçük harfli sluga dönüştürür.",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Üretici",
    category: "seo",
    description:
      "SEO meta etiketleri ve Open Graph kodları üretir; canlı önizleme sunar.",
  },
  {
    slug: "keyword-density-checker",
    name: "Anahtar Kelime Yoğunluğu",
    category: "seo",
    description:
      "Metindeki anahtar kelime yoğunluğunu ve tekrar sıklığını analiz eder.",
  },
  {
    slug: "serp-preview",
    name: "SERP Önizleme",
    category: "seo",
    description:
      "Google arama sonucu görünümünü ve başlık/açıklama uzunluğunu denetler.",
  },
  {
    slug: "readability-score",
    name: "Okunabilirlik Skoru",
    category: "seo",
    description:
      "Flesch okunabilirlik skorunu ve yaklaşık sınıf seviyesini hesaplar.",
  },
  {
    slug: "text-diff",
    name: "Metin Karşılaştırıcı",
    category: "text",
    description:
      "İki metni satır satır karşılaştırır, eklenen ve çıkarılan bölümleri renklendirir.",
  },
  {
    slug: "html-entity-converter",
    name: "HTML Entity Çevirici",
    category: "text",
    description:
      "Metni HTML entity biçimine çevirir veya entity kodlarını çözer.",
  },
  {
    slug: "morse-converter",
    name: "Morse Çevirici",
    category: "text",
    description:
      "Metni Morse koduna çevirir veya Morse kodunu metne dönüştürür.",
  },
  {
    slug: "text-reverser",
    name: "Metin Ters Çevirici",
    category: "text",
    description:
      "Metni karakterleriyle, kelime sırasıyla veya her kelimeyi ayrı ayrı ters çevirir.",
  },
  {
    slug: "fancy-text-generator",
    name: "Kalın ve İtalik Metin Üretici",
    category: "text",
    description:
      "Metni kalın, italik veya alt çizgili Unicode karakterlere dönüştürür.",
  },
  {
    slug: "caesar-cipher",
    name: "Caesar Şifre & ROT13",
    category: "text",
    description:
      "Caesar kaydırma ve ROT13 ile şifreleme veya çözme yapar.",
  },
  {
    slug: "gpa-calculator",
    name: "Not Ortalaması Hesaplayıcı",
    category: "calculation",
    description:
      "Not ve kredi ağırlıklarıyla GPA/ortalama hesaplar; 4.0 ölçeği destekler.",
  },
  {
    slug: "loan-emi-calculator",
    name: "Kredi Taksit Hesaplayıcı",
    category: "calculation",
    description:
      "Kredi tutarı, faiz ve vade ile aylık taksit ve toplam ödemeyi hesaplar.",
  },
  {
    slug: "calorie-bmr-calculator",
    name: "Kalori & BMR Hesaplayıcı",
    category: "calculation",
    description:
      "Bazal metabolizma (BMR) ve günlük harcanan kalorileri (TDEE) hesaplar.",
  },
  {
    slug: "body-fat-calculator",
    name: "Vücut Yağ Oranı Hesaplayıcı",
    category: "calculation",
    description:
      "ABD Donanması yöntemiyle vücut yağ oranını ve yağ kütlesini hesaplar.",
  },
  {
    slug: "ideal-weight-calculator",
    name: "İdeal Kilo Hesaplayıcı",
    category: "calculation",
    description:
      "Boy ve cinsiyete göre ideal kiloyu ve sağlıklı kilo aralığını gösterir.",
  },
  {
    slug: "sleep-calculator",
    name: "Uyku Hesaplayıcı",
    category: "calculation",
    description:
      "Uyanma saatinize göre ideal uyku saatlerini veya uyku döngülerini hesaplar.",
  },
  {
    slug: "cron-tester",
    name: "Cron İfade Testi",
    category: "developer",
    description:
      "Cron ifadenizi doğrular, insan diline çevirir ve sonraki çalışma zamanlarını gösterir.",
  },
  {
    slug: "html-formatter",
    name: "HTML Biçimlendirici",
    category: "developer",
    description:
      "Dağınık HTML kodunu düzenli girintili, okunabilir biçime getirir.",
  },
  {
    slug: "aes-encryption",
    name: "AES Şifreleme/Çözme",
    category: "developer",
    description:
      "Parolayla metni AES-256-GCM kullanarak tarayıcınızda şifreler ve çözer.",
  },
  {
    slug: "random-string-generator",
    name: "Rastgele String Üretici",
    category: "developer",
    description:
      "API anahtarı ve token için kriptografik olarak güvenli rastgele string üretir.",
  },
  {
    slug: "jwt-generator",
    name: "JWT Üretici",
    category: "developer",
    description:
      "HS256 imzalı JWT token içeriği oluşturur; header, payload ve signature adımlarını gösterir.",
  },
  {
    slug: "currency-converter",
    name: "Döviz Çevirici",
    category: "calculation",
    description:
      "Seçtiğiniz döviz kurlarıyla anında para birimi dönüşümü yapar; kur oranını istediğiniz gibi düzenleyin.",
  },
  {
    slug: "compound-interest-calculator",
    name: "Bileşik Faiz Hesaplayıcı",
    category: "calculation",
    description:
      "Anapara ve düzenli katkılarla bileşik faiz getirisini; faiz, toplam yatırım ve birikim tablosuyla hesaplar.",
  },
  {
    slug: "salary-calculator",
    name: "Net Maaş Hesaplayıcı",
    category: "calculation",
    description:
      "Brüt maaştan SGK, işsizlik ve gelir vergisi kesintilerini hesaplayarak net maaşınızı gösterir.",
  },
  {
    slug: "sql-formatter",
    name: "SQL Biçimlendirici",
    category: "developer",
    description:
      "SQL sorgularını düzenler veya küçültür; anahtar kelime büyük/küçük harf tercihi sunar.",
  },
  {
    slug: "json-xml-converter",
    name: "JSON ↔ XML Dönüştürücü",
    category: "developer",
    description:
      "JSON ile XML arasında iki yönlü dönüşüm yapar; hem düğüm hem dizi yapılarını destekler.",
  },
  {
    slug: "markdown-html-converter",
    name: "Markdown ↔ HTML Dönüştürücü",
    category: "developer",
    description:
      "Markdown'ı HTML'e veya HTML'i Markdown'a çevirir; canlı önizleme sunar.",
  },
  {
    slug: "hmac-generator",
    name: "HMAC Üretici",
    category: "developer",
    description:
      "SHA-256 / SHA-512 ile HMAC imzası üretir; hex ve base64 çıktı verir.",
  },
  {
    slug: "html-table-generator",
    name: "HTML Tablo Üretici",
    category: "developer",
    description:
      "Satır/sütun sayısı ve veriyle kullanıma hazır HTML tablo kodu üretir; önizleme sunar.",
  },
  {
    slug: "favicon-generator",
    name: "Favicon Üretici",
    category: "image",
    description:
      "Metin ve renklerle favicon üretir; PNG ve ICO olarak indirin.",
  },
  {
    slug: "image-crop",
    name: "Resim Kırpma",
    category: "image",
    description:
      "Görseli tarayıcınızda sürükleyerek seçtiğiniz alana göre kırpar ve PNG olarak indirir.",
  },
  {
    slug: "image-watermark",
    name: "Resime Filigran Ekleme",
    category: "image",
    description:
      "Görsele logo veya görsel filigran ekler; konum ve opaklığı ayarlar.",
  },
  {
    slug: "jsonld-generator",
    name: "JSON-LD Üretici",
    category: "seo",
    description:
      "Article, Product, FAQPage ve daha fazlası için schema.org JSON-LD yapılandırılmış veri üretir.",
  },
  {
    slug: "hreflang-generator",
    name: "Hreflang Üretici",
    category: "seo",
    description:
      "Çok dilli siteler için hreflang etiketleri ve sitemap bloğu üretir.",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Üretici",
    category: "seo",
    description:
      "Hazır şablonlar ve özel kurallarla robots.txt içeriği oluşturur; tek tıkla kopyalayın.",
  },
  {
    slug: "wheel-of-names",
    name: "İsim Çarkı",
    category: "fun",
    description:
      "İsimleri çarka yazın, döndürün ve kazananı tarayıcınızda seçin.",
  },
  {
    slug: "random-number-generator",
    name: "Rastgele Sayı Üretici",
    category: "fun",
    description:
      "Aralık ve adet seçerek tekrarsız rastgele sayılar üretir; kopyalayın.",
  },
  {
    slug: "stopwatch-timer",
    name: "Kronometre ve Zamanlayıcı",
    category: "fun",
    description:
      "Kronometre ile tur süreleri kaydedin veya geri sayım yapan zamanlayıcı kullanın.",
  },
  {
    slug: "time-zone-converter",
    name: "Zaman Dilimi Dönüştürücü",
    category: "calculation",
    description:
      "İki zaman dilimi arasında tarih ve saat dönüşümü yapar; yaz saati otomatik hesaplanır.",
  },
  {
    slug: "qr-code-reader",
    name: "QR Kod Okuyucu",
    category: "developer",
    description:
      "Görseldeki QR kodu tarayıcınızda okur; içindeki metni veya bağlantıyı çıkarır.",
    addedAt: "2026-09-26",
  },
  {
    slug: "text-extractor",
    name: "Metin Çıkarıcı",
    category: "text",
    description:
      "Metinden e-posta adreslerini, telefon numaralarını, URL'leri ve etiketleri ayıklar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Üretici",
    category: "developer",
    description:
      "Renk, açı ve yön seçerek kullanıma hazır CSS lineer gradient kodu üretir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "border-radius-generator",
    name: "Border Radius Üretici",
    category: "developer",
    description:
      "Köşeleri görsel olarak yuvarlayıp border-radius CSS kodunu tek tıkla kopyalayın.",
    addedAt: "2026-09-26",
  },
  {
    slug: "text-to-speech",
    name: "Metin Okuyucu",
    category: "text",
    description:
      "Yazdığınız metni tarayıcınızda yapay sesle okutur; ses, hız ve perde ayarlanabilir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "pomodoro-timer",
    name: "Pomodoro Zamanlayıcı",
    category: "fun",
    description:
      "Çalışma ve mola döngülerini sayarak odaklanmanızı sağlar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "binary-text-converter",
    name: "Binary Metin Dönüştürücü",
    category: "developer",
    description:
      "Metni UTF-8 tabanlı binary koda çevirir; binary kodu tekrar metne dönüştürür.",
    addedAt: "2026-09-26",
  },
  {
    slug: "credit-card-validator",
    name: "Kredi Kartı Doğrulayıcı",
    category: "calculation",
    description:
      "Kart numarasını Luhn algoritmasına göre doğrular ve markasını belirler.",
    addedAt: "2026-09-26",
  },
  {
    slug: "roman-numeral-converter",
    name: "Roma Rakamı Dönüştürücü",
    category: "calculation",
    description:
      "Sayıları Roma rakamlarına ve Roma rakamlarını sayıya çevirir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "temperature-converter",
    name: "Sıcaklık Dönüştürücü",
    category: "calculation",
    description:
      "Celsius, Fahrenheit ve Kelvin arasında anında dönüşüm yapar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "calculator",
    name: "Hesap Makinesi",
    category: "calculation",
    description:
      "Toplama, çıkarma, çarpma, bölme, yüzde ve karekök içeren basit hesap makinesi.",
    addedAt: "2026-09-26",
  },
  {
    slug: "html-to-text-converter",
    name: "HTML'den Metne Dönüştürücü",
    category: "text",
    description:
      "HTML işaretlemelerini temizleyip düz metne çevirir; script ve style blokları atlanır.",
    addedAt: "2026-09-26",
  },
  {
    slug: "chmod-calculator",
    name: "CHMOD Hesaplayıcı",
    category: "developer",
    description:
      "Okuma, yazma ve çalıştırma izinlerinden dosya izin değerini ve sembolik gösterimi üretir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "dice-roller",
    name: "Zar Atma",
    category: "fun",
    description:
      "İstediğiniz sayıda ve yüzde zar atar; toplamları ve geçmişi gösterir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "coin-flipper",
    name: "Para Atma",
    category: "fun",
    description:
      "Yazı-tura atar; sayım, seri istatistiği ve geçmişi takip eder.",
    addedAt: "2026-09-26",
  },
  {
    slug: "word-frequency-counter",
    name: "Kelime Frekansı Sayacı",
    category: "text",
    description:
      "Metindeki kelimelerin tekrar sayısını çıkarır; sık kullanılan kelimeler isteğe bağlı atlanır.",
    addedAt: "2026-09-26",
  },
  {
    slug: "prime-factors-calculator",
    name: "Asal Çarpan Hesaplayıcı",
    category: "calculation",
    description:
      "Bir sayıyı asal çarpanlarına ayırır ve üslü gösterimle sonuç verir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "angle-converter",
    name: "Açı Dönüştürücü",
    category: "calculation",
    description:
      "Derece, radyan ve grad cinsinden açıları birbirine çevirir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "data-size-converter",
    name: "Veri Boyutu Dönüştürücü",
    category: "developer",
    description:
      "Byte, KB, MB, GB ve TB arasında ondalık veya ikili tabana göre dönüşüm yapar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "fibonacci-generator",
    name: "Fibonacci Üretici",
    category: "calculation",
    description:
      "Fibonacci dizisini üretir; toplam ve son terim değerini gösterir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "mortgage-calculator",
    name: "Konut Kredisi Hesaplayıcı",
    category: "calculation",
    description:
      "Konut kredisi aylık taksidini, toplam faizi ve amortisman tablosunu hesaplar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "hours-calculator",
    name: "Saat Hesaplayıcı",
    category: "calculation",
    description:
      "İki saat arasındaki süreyi saat, dakika ve ondalık biçimde hesaplar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "income-tax-calculator",
    name: "Gelir Vergisi Hesaplayıcı",
    category: "calculation",
    description:
      "ABD federal gelir vergisini marjinal dilimlere göre hesaplar; etkin ve marjinal oranı gösterir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "inflation-calculator",
    name: "Enflasyon Hesaplayıcı",
    category: "calculation",
    description:
      "Bir tutarın belirli yıllar arasında satın alma gücündeki değişimini ABD TÜFE verisiyle hesaplar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "typing-speed-test",
    name: "Yazma Hızı Testi",
    category: "fun",
    description:
      "Dakikadaki kelime sayısını (WPM), doğruluğu ve hata sayısını ölçen pratik testi.",
    addedAt: "2026-09-26",
  },
  {
    slug: "css-units-converter",
    name: "CSS Birim Dönüştürücü",
    category: "developer",
    description:
      "px, rem, em, %, vw ve vh birimleri arasında anında dönüşüm yapar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "css-triangle-generator",
    name: "CSS Üçgen Üretici",
    category: "developer",
    description:
      "Yön ve boyut seçerek kullanıma hazır CSS üçgen kodu üretir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "countdown-timer",
    name: "Geri Sayım Zamanlayıcı",
    category: "fun",
    description:
      "Saat, dakika ve saniye belirleyerek istediğiniz süreyi geri sayar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "image-grid-splitter",
    name: "Görsel Izgara Bölücü",
    category: "image",
    description:
      "Fotoyu eşit parçalara böler; özellikle Instagram ızgarası için kare parçalar hazırlar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "ascii-art-generator",
    name: "ASCII Sanat Üretici",
    category: "fun",
    description:
      "Görseli karakterlere dönüştürerek ASCII sanatı çıkarır; genişlik ve ters çevirme ayarlı.",
    addedAt: "2026-09-26",
  },
  {
    slug: "pixelate-image",
    name: "Pikselleştirici",
    category: "image",
    description:
      "Fotoğrafı istenen blok boyutunda pikselleştirir ve sonucu indirmenizi sağlar.",
    addedAt: "2026-09-26",
  },
  {
    slug: "vigenere-cipher",
    name: "Vigenère Şifresi",
    category: "security",
    description:
      "Türkçe alfabe destekli anahtar sözcükle Vigenère yöntemiyle şifreler ve çözer.",
    addedAt: "2026-09-26",
  },
  {
    slug: "punctuation-remover",
    name: "Noktalama Silici",
    category: "text",
    description:
      "Metinden noktalama işaretlerini temizler; kesme işareti ve tireyi koruma seçenekli.",
    addedAt: "2026-09-26",
  },
  {
    slug: "anagram-solver",
    name: "Anagram Çözücü",
    category: "fun",
    description:
      "Harflerden oluşan tüm olası anagram kombinasyonlarını listeleyin.",
    addedAt: "2026-09-26",
  },
  {
    slug: "keyword-combiner",
    name: "Anahtar Kelime Birleştirici",
    category: "seo",
    description:
      "İki kelime listesini çaprazlayarak tüm kombinasyonları tek tıkla üretir.",
    addedAt: "2026-09-26",
  },
  {
    slug: "title-length-checker",
    name: "Başlık Uzunluğu Kontrolü",
    category: "seo",
    description:
      "Başlık ve açıklamanın karakter ile piksel uzunluğunu Google SERP sınırlarına göre denetler.",
    addedAt: "2026-09-26",
  },
  {
    slug: "magic-8-ball",
    name: "Sihirli 8 Top",
    category: "fun",
    description:
      "Soru sorun, topu sallayın; cevabınızı alın. Klasik sihirli 8 top deneyimi.",
    addedAt: "2026-09-26",
  },
  {
    slug: "fuel-cost-calculator",
    name: "Yakıt Maliyeti Hesaplayıcı",
    category: "calculation",
    description:
      "Mesafe, ortalama tüketim ve yakıt fiyatına göre toplam yol maliyetini anında hesaplar.",
    addedAt: "2026-09-27",
  },
  {
    slug: "plagiarism-checker",
    name: "İntihal Kontrolü",
    category: "seo",
    description:
      "İki metni karşılaştırıp benzerlik oranını yüzde olarak ölçer; tamamı tarayıcınızda çalışır.",
    addedAt: "2026-09-27",
  },
  {
    slug: "number-to-words",
    name: "Sayıyı Yazıya Çevirme",
    category: "text",
    description:
      "Bir sayıyı anında Türkçe ve İngilizce yazıyla yazar; fatura ve çeklerde tutar okunuşu için idealdir.",
    addedAt: "2026-09-27",
  },
  {
    slug: "image-rotator",
    name: "Resim Döndürücü & Çevirici",
    category: "image",
    description:
      "Görseli 90 veya 180 derece döndürür; yatay ve dikey çevirir; PNG olarak indirin.",
    addedAt: "2026-09-27",
  },
  {
    slug: "xml-sitemap-generator",
    name: "XML Sitemap Üretici",
    category: "seo",
    description:
      "URL listesinden Google Search Console'a hazır sitemap.xml içeriği oluşturur.",
    addedAt: "2026-09-27",
  },
  {
    slug: "email-validator",
    name: "E-posta Doğrulayıcı",
    category: "text",
    description:
      "E-posta adreslerinin formatını ve üst düzey alan adlarını toplu olarak doğrular.",
    addedAt: "2026-09-27",
  },
  {
    slug: "word-scrambler",
    name: "Kelime Karıştırıcı",
    category: "text",
    description:
      "Kelimelerin harflerini karıştırır; ilk ve son harfi sabit tutma veya tam karıştırma seçenekleri.",
    addedAt: "2026-09-27",
  },
  {
    slug: "hashtag-generator",
    name: "Hashtag Üretici",
    category: "text",
    description:
      "Kelime veya cümlelerden tek tıkla hazır, boşluksuz hashtag listesi üretir.",
    addedAt: "2026-09-27",
  },
  {
    slug: "acronym-generator",
    name: "Kısaltma Üretici",
    category: "text",
    description:
      "Kelime grubundan büyük harfli kısaltma (akronim) çıkarır; noktalı seçenek sunar.",
    addedAt: "2026-09-27",
  },
  {
    slug: "palindrome-checker",
    name: "Palindrom Kontrolü",
    category: "fun",
    description:
      "Metnin tersten okunduğunda aynı olup olmadığını kontrol eder; boşluk ve noktalama atlanabilir.",
    addedAt: "2026-09-27",
  },
  {
    slug: "http-status-codes",
    name: "HTTP Durum Kodları",
    category: "developer",
    description:
      "Yaygın HTTP durum kodlarının anlamlarını aramaya göre gruplu olarak listeler.",
    addedAt: "2026-09-27",
  },
  {
    slug: "csv-formatter",
    name: "CSV Biçimlendirici",
    category: "developer",
    description:
      "Dağınık CSV verisini ayrıştırır, tablo olarak önizler ve TSV olarak kopyalamanızı sağlar.",
    addedAt: "2026-09-27",
  },
  {
    slug: "days-until-calculator",
    name: "Geri Sayım Hesaplayıcı",
    category: "calculation",
    description:
      "Bugünden istediğiniz tarihe ne kadar gün, hafta ve ay kaldığını hesaplar.",
    addedAt: "2026-09-27",
  },
  {
    slug: "running-pace-converter",
    name: "Koşu Tempo Hesaplayıcı",
    category: "calculation",
    description:
      "Km başına tempodan ortalama hızı ve 5K, 10K, yarı ve tam maraton sürelerini hesaplar.",
    addedAt: "2026-09-27",
  },
  {
    slug: "savings-goal-calculator",
    name: "Birikim Hedefi Hesaplayıcı",
    category: "calculation",
    description:
      "Hedef tutara ulaşmak için gereken süreyi veya hedef süre için aylık birikimi hesaplar.",
    addedAt: "2026-09-27",
  },
  {
    slug: "rock-paper-scissors",
    name: "Taş Kağıt Makas",
    category: "fun",
    description:
      "Bilgisayara karşı klasik taş kağıt makas oyunu; skor takibi yapılır.",
    addedAt: "2026-09-27",
  },
  {
    slug: "horoscope",
    name: "Burç Bulucu",
    category: "fun",
    description:
      "Doğum tarihine göre burcunuzu, elementinizi ve karakter özelliklerini gösterir.",
    addedAt: "2026-09-27",
  },
  {
    slug: "text-escape-unescape",
    name: "Metin Kaçış Karakteri",
    category: "developer",
    description:
      "Metni JSON/JS dizesi gibi kaçış karakterleriyle işaretler veya kaçış kodlarını çözer.",
    addedAt: "2026-09-27",
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function displayToolCount(_count: number): string {
  return "100+";
}

const NEW_TOOL_DAYS = 30;

export function isToolNew(tool: Tool, now: Date = new Date()): boolean {
  if (!tool.addedAt) return false;
  const added = new Date(tool.addedAt).getTime();
  if (Number.isNaN(added)) return false;
  const age = now.getTime() - added;
  return age >= 0 && age <= NEW_TOOL_DAYS * 24 * 60 * 60 * 1000;
}
