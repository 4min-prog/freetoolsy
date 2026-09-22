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
    slug: "bmi-hesaplayici",
    name: "BMI Hesaplayıcı",
    category: "Hesaplama",
    description:
      "Boy ve kilonuza göre vücut kitle indeksinizi hesaplar ve sonucu anlaşılır biçimde yorumlar.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}
