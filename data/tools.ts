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
    category: "Metin",
    description:
      "Metnin karakter sayısını, boşluksuz sayımı, satır ve paragraf sayılarını anında gösterir.",
  },
  {
    slug: "kelime-sayaci",
    name: "Kelime Sayacı",
    category: "Metin",
    description:
      "Kelime, cümle ve karakter istatistiklerini hesaplar; tahmini okuma süresini çıkarır.",
  },
  {
    slug: "harf-donusturucu",
    name: "Harf Dönüştürücü",
    category: "Metin",
    description:
      "Metni büyük harfe, küçük harfe, başlık biçimine çevirir veya harfleri ters düz eder; tek tıkla kopyalayın.",
  },
  {
    slug: "sifre-uretici",
    name: "Şifre Üretici",
    category: "Güvenlik",
    description:
      "Uzunluk ve karakter türlerini seçerek tarayıcınızda güçlü, rastgele parolalar üretir.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Geliştirici",
    description:
      "JSON kodunuzu düzenler, doğrular ve okunabilir hâle getirir; hataları satır numarasıyla bildirir.",
  },
  {
    slug: "base64",
    name: "Base64 Encoder/Decoder",
    category: "Geliştirici",
    description:
      "Metni Base64 biçimine çevirir veya Base64 verisini çözerek özgün içeriğe dönüştürür.",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    category: "Geliştirici",
    description:
      "Metni URL güvenli biçime kodlar veya kodlanmış URL parametrelerini anlaşılır hâle getirir.",
  },
  {
    slug: "bmi-hesaplayici",
    name: "BMI Hesaplayıcı",
    category: "Hesaplama",
    description:
      "Boy ve kilonuza göre vücut kitle indeksinizi hesaplar ve sonucu anlaşılır biçimde yorumlar.",
  },
  {
    slug: "kdv-hesaplayici",
    name: "KDV Hesaplayıcı",
    category: "Hesaplama",
    description:
      "Tutar ve KDV oranı seçerek vergi tutarı ile toplam tutarı anında hesaplar.",
  },
  {
    slug: "yuzde-hesaplayici",
    name: "Yüzde Hesaplayıcı",
    category: "Hesaplama",
    description:
      "Sayının yüzdesini, yüzde değişimini ve bütünün yüzdesini tek ekranda hesaplar.",
  },
  {
    slug: "yas-hesaplayici",
    name: "Yaş Hesaplayıcı",
    category: "Hesaplama",
    description:
      "Doğum tarihinize göre yıl, ay, gün, saat, dakika ve saniye cinsinden yaşınızı canlı gösterir.",
  },
  {
    slug: "qr-kod-olusturucu",
    name: "QR Kod Oluşturucu",
    category: "Geliştirici",
    description:
      "Metni veya bir bağlantıyı tarayıcınızda anında QR koda dönüştürür; PNG olarak indirin.",
  },
  {
    slug: "sha-hash-uretici",
    name: "SHA Hash Üretici",
    category: "Güvenlik",
    description:
      "Metnin SHA-1, SHA-256 veya SHA-512 özetini tarayıcınızda hesaplar; tek tıkla kopyalayın.",
  },
  {
    slug: "tarih-farki",
    name: "Tarih Farkı",
    category: "Hesaplama",
    description:
      "İki tarih arasındaki yıl, ay, gün, saat ve hafta farkını anında hesaplar.",
  },
  {
    slug: "renk-donusturucu",
    name: "Renk Dönüştürücü",
    category: "Geliştirici",
    description:
      "HEX, RGB ve HSL değerleri arasında anında dönüşüm yapar; önizleme ve kopyalama sunar.",
  },
  {
    slug: "uuid-uretici",
    name: "UUID Üretici",
    category: "Geliştirici",
    description:
      "Tek tıkla rastgele UUID v4 (GUID) üretir; birden çok kimliği toplu kopyalayın.",
  },
  {
    slug: "birim-donusturucu",
    name: "Birim Dönüştürücü",
    category: "Hesaplama",
    description:
      "Uzunluk, ağırlık, hacim, alan ve sıcaklık birimleri arasında hızlı dönüşüm yapar.",
  },
  {
    slug: "parola-guc-testi",
    name: "Parola Güç Testi",
    category: "Güvenlik",
    description:
      "Parolanızın ne kadar güçlü olduğunu tahmini entropiyle ölçer ve iyileştirme önerileri sunar.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}
