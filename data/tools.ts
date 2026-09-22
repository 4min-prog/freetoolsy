export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
}

export const categories: { id: string; name: string }[] = [
  { id: "metin", name: "Metin" },
  { id: "guvenlik", name: "Güvenlik" },
  { id: "gelistirici", name: "Geliştirici" },
  { id: "hesaplama", name: "Hesaplama" },
];

export const tools: Tool[] = [
  {
    slug: "karakter-sayaci",
    name: "Karakter Sayacı",
    category: "metin",
    description:
      "Metnin karakter sayısını, boşluksuz sayımı, satır ve paragraf sayılarını anında gösterir.",
  },
  {
    slug: "kelime-sayaci",
    name: "Kelime Sayacı",
    category: "metin",
    description:
      "Kelime, cümle ve karakter istatistiklerini hesaplar; tahmini okuma süresini çıkarır.",
  },
  {
    slug: "harf-donusturucu",
    name: "Harf Dönüştürücü",
    category: "metin",
    description:
      "Metni büyük harfe, küçük harfe, başlık biçimine çevirir veya harfleri ters düz eder; tek tıkla kopyalayın.",
  },
  {
    slug: "sifre-uretici",
    name: "Şifre Üretici",
    category: "guvenlik",
    description:
      "Uzunluk ve karakter türlerini seçerek tarayıcınızda güçlü, rastgele parolalar üretir.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "gelistirici",
    description:
      "JSON kodunuzu düzenler, doğrular ve okunabilir hâle getirir; hataları satır numarasıyla bildirir.",
  },
  {
    slug: "base64",
    name: "Base64 Encoder/Decoder",
    category: "gelistirici",
    description:
      "Metni Base64 biçimine çevirir veya Base64 verisini çözerek özgün içeriğe dönüştürür.",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    category: "gelistirici",
    description:
      "Metni URL güvenli biçime kodlar veya kodlanmış URL parametrelerini anlaşılır hâle getirir.",
  },
  {
    slug: "bmi-hesaplayici",
    name: "BMI Hesaplayıcı",
    category: "hesaplama",
    description:
      "Boy ve kilonuza göre vücut kitle indeksinizi hesaplar ve sonucu anlaşılır biçimde yorumlar.",
  },
  {
    slug: "kdv-hesaplayici",
    name: "KDV Hesaplayıcı",
    category: "hesaplama",
    description:
      "Tutar ve KDV oranı seçerek vergi tutarı ile toplam tutarı anında hesaplar.",
  },
  {
    slug: "yuzde-hesaplayici",
    name: "Yüzde Hesaplayıcı",
    category: "hesaplama",
    description:
      "Sayının yüzdesini, yüzde değişimini ve bütünün yüzdesini tek ekranda hesaplar.",
  },
  {
    slug: "yas-hesaplayici",
    name: "Yaş Hesaplayıcı",
    category: "hesaplama",
    description:
      "Doğum tarihinize göre yıl, ay, gün, saat, dakika ve saniye cinsinden yaşınızı canlı gösterir.",
  },
  {
    slug: "qr-kod-olusturucu",
    name: "QR Kod Oluşturucu",
    category: "gelistirici",
    description:
      "Metni veya bir bağlantıyı tarayıcınızda anında QR koda dönüştürür; PNG olarak indirin.",
  },
  {
    slug: "sha-hash-uretici",
    name: "SHA Hash Üretici",
    category: "guvenlik",
    description:
      "Metnin SHA-1, SHA-256 veya SHA-512 özetini tarayıcınızda hesaplar; tek tıkla kopyalayın.",
  },
  {
    slug: "tarih-farki",
    name: "Tarih Farkı",
    category: "hesaplama",
    description:
      "İki tarih arasındaki yıl, ay, gün, saat ve hafta farkını anında hesaplar.",
  },
  {
    slug: "renk-donusturucu",
    name: "Renk Dönüştürücü",
    category: "gelistirici",
    description:
      "HEX, RGB ve HSL değerleri arasında anında dönüşüm yapar; önizleme ve kopyalama sunar.",
  },
  {
    slug: "uuid-uretici",
    name: "UUID Üretici",
    category: "gelistirici",
    description:
      "Tek tıkla rastgele UUID v4 (GUID) üretir; birden çok kimliği toplu kopyalayın.",
  },
  {
    slug: "birim-donusturucu",
    name: "Birim Dönüştürücü",
    category: "hesaplama",
    description:
      "Uzunluk, ağırlık, hacim, alan ve sıcaklık birimleri arasında hızlı dönüşüm yapar.",
  },
  {
    slug: "parola-guc-testi",
    name: "Parola Güç Testi",
    category: "guvenlik",
    description:
      "Parolanızın ne kadar güçlü olduğunu tahmini entropiyle ölçer ve iyileştirme önerileri sunar.",
  },
  {
    slug: "sayi-donusturucu",
    name: "Sayı Sistemi Dönüştürücü",
    category: "gelistirici",
    description:
      "Sayıları ikili, sekizli, ondalık ve onaltılık sistemler arasında anında dönüştürür.",
  },
  {
    slug: "regex-testi",
    name: "RegEx Testi",
    category: "gelistirici",
    description:
      "Düzenli ifadenizi metin üzerinde canlı olarak test eder ve eşleşmeleri vurgular.",
  },
  {
    slug: "bosluk-temizleyici",
    name: "Boşluk Temizleyici",
    category: "metin",
    description:
      "Satır başı/sonu boşluklarını temizler, tekrarlı boşlukları birleştirir ve boş satırları kaldırır.",
  },
  {
    slug: "md5-hash",
    name: "MD5 Hash",
    category: "guvenlik",
    description:
      "Metnin MD5 özetini tarayıcınızda anında hesaplar; tek tıkla kopyalayın.",
  },
  {
    slug: "jwt-cozucu",
    name: "JWT Çözücü",
    category: "gelistirici",
    description:
      "JWT token'ın başlık, yük ve imza bölümlerini okunabilir JSON olarak ayırır.",
  },
  {
    slug: "json-csv-donusturucu",
    name: "JSON ↔ CSV Dönüştürücü",
    category: "gelistirici",
    description:
      "JSON veri dizisini CSV'ye veya CSV'yi JSON'a hızlıca dönüştürür.",
  },
  {
    slug: "unix-timestamp-cevirici",
    name: "Unix Zaman Damgası Çevirici",
    category: "gelistirici",
    description:
      "Unix zaman damgasını tarihe, tarihi zaman damgasına çevirir.",
  },
  {
    slug: "tekrar-satir-temizleyici",
    name: "Tekrar Satır Temizleyici",
    category: "metin",
    description:
      "Listeden tekrarlanan satırları kaldırır, ilk görünüm sırasını korur.",
  },
  {
    slug: "ai-token-hesaplayici",
    name: "AI Token Hesaplayıcı",
    category: "gelistirici",
    description:
      "Metnin tahmini token, karakter, kelime ve satır sayısını gösterir.",
  },
  {
    slug: "lorem-ipsum-uretici",
    name: "Lorem Ipsum Üretici",
    category: "metin",
    description:
      "Tasarım ve metin denemeleri için örnek Lorem Ipsum metni üretir.",
  },
  {
    slug: "bahsis-hesaplayici",
    name: "Bahşiş Hesaplayıcı",
    category: "hesaplama",
    description:
      "Hesap tutarı ve orana göre bahşiş ile kişi başı payı hesaplar.",
  },
  {
    slug: "indirim-hesaplayici",
    name: "İndirim Hesaplayıcı",
    category: "hesaplama",
    description:
      "Orijinal fiyat ve indirim oranına göre ödenecek tutarı hesaplar.",
  },
  {
    slug: "ortalama-hesaplayici",
    name: "Ortalama Hesaplayıcı",
    category: "hesaplama",
    description:
      "Sayı listesinin ortalamasını, toplamını, adet, min ve maks değerlerini verir.",
  },
  {
    slug: "kopek-yasi-hesaplayici",
    name: "Köpek Yaşı Hesaplayıcı",
    category: "hesaplama",
    description:
      "Köpeğinizin yaşını boyutuna göre yaklaşık insan yaşına çevirir.",
  },
  {
    slug: "subnet-hesaplayici",
    name: "Subnet Hesaplayıcı",
    category: "gelistirici",
    description:
      "IP adresi ve prefixe göre ağ, broadcast, maske ve ana bilgisayar sayısını bulur.",
  },
  {
    slug: "px-rem-donusturucu",
    name: "PX → REM Dönüştürücü",
    category: "gelistirici",
    description:
      "Piksel ve REM birimlerini temel yazı boyutuna göre anında çevirir.",
  },
  {
    slug: "xml-formatter",
    name: "XML Biçimlendirici",
    category: "gelistirici",
    description:
      "XML'i düzenler veya küçültür; hataları anlaşılır biçimde bildirir.",
  },
  {
    slug: "css-minifier",
    name: "CSS Küçültücü",
    category: "gelistirici",
    description:
      "CSS kodunun boyutunu boşlukları ayıklayarak küçültür.",
  },
  {
    slug: "html-minifier",
    name: "HTML Küçültücü",
    category: "gelistirici",
    description:
      "HTML kodunu güvenle küçültür; içerik bloklarını korur.",
  },
  {
    slug: "wcag-kontrast",
    name: "WCAG Kontrast Denetleyicisi",
    category: "gelistirici",
    description:
      "İki rengin kontrast oranını ve WCAG erişilebilirlik geçişini kontrol eder.",
  },
  {
    slug: "renk-paleti-uretici",
    name: "Renk Paleti Üretici",
    category: "gelistirici",
    description:
      "Ana renkten uyumlu analog veya tek renk tonları paleti oluşturur.",
  },
  {
    slug: "box-shadow-uretici",
    name: "Box Shadow Üretici",
    category: "gelistirici",
    description:
      "Gölge bileşenlerini kaydırarak kullanıma hazır CSS üretir.",
  },
  {
    slug: "metin-siralayici",
    name: "Metin Sıralayıcı",
    category: "metin",
    description:
      "Satırları alfabetik, uzunluk, sayısal veya rastgele sıralar.",
  },
  {
    slug: "liste-karistirici",
    name: "Liste Karıştırıcı",
    category: "metin",
    description:
      "Listeyi karıştırır veya içinden rastgele bir öğe çeker.",
  },
  {
    slug: "yaml-json-donusturucu",
    name: "YAML ↔ JSON Dönüştürücü",
    category: "gelistirici",
    description:
      "YAML ile JSON arasında iki yönlü dönüşüm yapar.",
  },
  {
    slug: "md5-dosya-checksum",
    name: "MD5 Dosya Checksum",
    category: "guvenlik",
    description:
      "Dosyanın MD5 özetini tarayıcınızda hesaplar; dosya hiçbir yere gönderilmez.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export const popularTools: string[] = [
  "karakter-sayaci",
  "json-formatter",
  "sifre-uretici",
  "kdv-hesaplayici",
  "qr-kod-olusturucu",
  "base64",
];
