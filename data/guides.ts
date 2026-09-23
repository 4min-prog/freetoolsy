export interface GuideBlock {
  h2: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideLocalized {
  title: string;
  desc: string;
  intro: string;
  blocks: GuideBlock[];
}

export interface Guide {
  slug: string;
  relatedTools: string[];
  content: { en: GuideLocalized; tr: GuideLocalized };
}

export const guides: Guide[] = [
  {
    slug: "json-formatter-nedir",
    relatedTools: ["json-formatter", "json-csv-donusturucu", "yaml-json-donusturucu"],
    content: {
      en: {
        title: "What is a JSON formatter and how do you use it?",
        desc: "Learn what JSON formatting is, why clean indentation matters, and how to format, validate and pretty-print JSON instantly in your browser.",
        intro:
          "JSON (JavaScript Object Notation) is the most common format for exchanging data between servers and browsers. A JSON formatter takes a raw, single-line JSON string and reprints it with consistent indentation so it is easy to read, debug and maintain.",
        blocks: [
          {
            h2: "Why does formatting JSON matter?",
            paragraphs: [
              "APIs and config files often return JSON as one long, unreadable line. That makes it hard to spot a missing brace, a wrong key, or a nested value you want to change. A formatter adds two-space indentation and line breaks without touching the data itself, so you can scan the structure at a glance.",
              "Formatting is the first step of debugging. Once the JSON is readable, you can compare it against the API documentation, find incorrect field names, and copy valid snippets into your own code.",
            ],
          },
          {
            h2: "How to format JSON with FreetoolsY",
            paragraphs: [
              "Open the Json Formatter tool, paste the raw JSON into the text area and click format. The tool adds indentation and shows a clear error when the input is invalid, so you also get a free JSON validator.",
            ],
            bullets: [
              "Paste a JSON API response or config snippet (or press 'Try sample data').",
              "The tool validates the input first — invalid JSON is reported, not formatted.",
              "Copy the formatted result with one click and paste it into your editor.",
            ],
          },
          {
            h2: "JSON formatting best practices",
            paragraphs: [
              "Use two-space indentation for most projects. Keep keys quoted and avoid trailing commas. If you move data between formats, convert JSON to CSV or YAML instead of editing the string by hand — FreetoolsY ships dedicated converters for both.",
              "Once your JSON is clean, a formatting rule in your editor keeps it that way automatically. The tool shares the same approach: short, repeatable steps that keep your data intact.",
            ],
          },
        ],
      },
      tr: {
        title: "JSON formatlayıcı nedir ve nasıl kullanılır?",
        desc: "JSON formatlamanın ne olduğunu, temiz girintinin neden önemli olduğunu ve tarayıcınızda JSON'a nasıl anında biçim verip doğrulayacağınızı öğrenin.",
        intro:
          "JSON (JavaScript Object Notation), sunucular ve tarayıcılar arasında veri alışverişinde kullanılan en yaygın formattır. Bir JSON formatter, ham ve tek satırlık JSON metnini tutarlı girintiyle yeniden yazar; böylece veriyi okumak, hata ayıklamak ve düzenlemek kolaylaşır.",
        blocks: [
          {
            h2: "JSON'u biçimlendirmek neden önemli?",
            paragraphs: [
              "API'ler ve yapılandırma dosyaları JSON'u genellikle okunması güç tek bir uzun satır olarak döndürür. Bu durum, eksik bir parantezi, yanlış bir anahtarı veya değiştirmek istediğiniz iç içe bir değeri fark etmeyi zorlaştırır. Formatter, verinin kendisine dokunmadan iki boşluklu girinti ve satır sonları ekler; böylece yapıyı bir bakışta tararsınız.",
              "Biçimlendirme hata ayıklamanın ilk adımıdır. JSON okunabilir hale gelince dokümantasyonla karşılaştırabilir, hatalı alan adlarını bulabilir ve geçerli parçaları kendi kodunuza kopyalayabilirsiniz.",
            ],
          },
          {
            h2: "FreetoolsY ile JSON nasıl biçimlendirilir?",
            paragraphs: [
              "Json Formatter aracını açın, ham JSON'u metin alanına yapıştırın ve format düğmesine basın. Araç girintiyi ekler ve giriş geçersizse net bir hata gösterir; böylece ücretsiz bir JSON doğrulayıcı da elde etmiş olursunuz.",
            ],
            bullets: [
              "Bir API yanıtını veya yapılandırma parçasını yapıştırın (ya da 'Örnek veriyle dene' tuşuna basın).",
              "Araç önce girişi doğrular — geçersiz JSON biçimlendirilmez, hata olarak bildirilir.",
              "Sonucu tek tıkla kopyalayın ve editörünüze yapıştırın.",
            ],
          },
          {
            h2: "JSON formatlama ipuçları",
            paragraphs: [
              "Çoğu proje için iki boşluklu girinti kullanın. Anahtarları tırnaklı tutun ve sondaki virgüllerden kaçının. Veriyi formatlar arasında taşıyacaksanız metni elle düzenlemek yerine JSON'u CSV veya YAML'a dönüştürün — FreetoolsY ikisi için de hazır dönüştürücüler sunar.",
              "JSON'unuz temizlendikten sonra editörünüzdeki formatlama kuralı onu otomatik olarak korur. Araç da aynı yaklaşımı paylaşır: veriyi bozmadan, kısa ve tekrarlanabilir adımlar.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "meta-tag-nedir",
    relatedTools: ["meta-tag-uretici", "serp-onizleme", "anahtar-kelime-yogunlugu"],
    content: {
      en: {
        title: "Meta tags explained: writing title & description for SEO",
        desc: "Understand the essential meta tags — title tag and meta description — and how to write optimized, click-worthy metadata for every page.",
        intro:
          "Meta tags are short HTML snippets that describe what a page is about. Search engines and social platforms use them to show your page in results and shares. The two most important ones are the title tag and the meta description.",
        blocks: [
          {
            h2: "Title tag: your headline in search results",
            paragraphs: [
              "The title tag appears as the clickable headline in Google and is usually cut off around 60 characters. Keep the most important phrase at the start, add your brand at the end, and use one clear keyword rather than stuffing several.",
              "A good pattern is: Primary Keyword – Secondary Keyword | Brand. Write naturally, because people click on understandable results.",
            ],
          },
          {
            h2: "Meta description: the ad for your page",
            paragraphs: [
              "The meta description is the grey text under the title in search results. Google often writes its own snippet, but a well-written description of around 150-160 characters improves click-through. Describe the value you offer and include one action-oriented phrase.",
              "Avoid repeating the title, keyword stuffing, and quoting. Accurate, specific descriptions build trust and reduce bounce.",
            ],
            bullets: [
              "One H1 per page containing the main keyword.",
              "Keep the title under 60 characters and the description around 155.",
              "Every page needs unique metadata — never duplicate the homepage title.",
            ],
          },
          {
            h2: "Generate meta tags in seconds",
            paragraphs: [
              "FreetoolsY's Meta Tag Generator builds title, description, Open Graph and Twitter tags from your input, and the SERP Preview tool shows exactly how Google will render them. Check your keyword density afterwards to keep the focus on one topic.",
            ],
          },
        ],
      },
      tr: {
        title: "Meta tag nedir? SEO için başlık ve açıklama yazmak",
        desc: "Temel meta etiketlerini — title ve meta description — öğrenin; her sayfa için optimize, tıklanmaya değer meta veri nasıl yazılır görün.",
        intro:
          "Meta tag'ler, bir sayfanın neyle ilgili olduğunu anlatan kısa HTML parçalarıdır. Arama motorları ve sosyal platformlar, sayfanızı sonuçlarda ve paylaşımlarda göstermek için bunları kullanır. En önemli ikisi title etiketi ve meta description'dır.",
        blocks: [
          {
            h2: "Title etiketi: arama sonucundaki başlığınız",
            paragraphs: [
              "Title etiketi, Google'daki tıklanabilir başlık olarak görünür ve genellikle 60 karakterde kesilir. En önemli ifadeyi başa koyun, markanızı sona ekleyin ve birçok anahtar kelimeyi doldurmak yerine tek net bir kelime kullanın.",
              "İyi bir kalıp: Birincil Anahtar Kelime – İkincil Anahtar Kelime | Marka. Doğal yazın; insanlar anlaşılır sonuçlara tıklar.",
            ],
          },
          {
            h2: "Meta description: sayfanızın reklamı",
            paragraphs: [
              "Meta description, arama sonuçlarındaki başlığın altında yer alan gri metindir. Google çoğu zaman kendi snippet'ini oluşturur ancak 150-160 karakterlik iyi yazılmış bir açıklama tıklanma oranını artırır. Sunduğunuz değeri anlatın ve eyleme yönlendiren bir ifade ekleyin.",
              "Başlığı tekrar etmekten, anahtar kelime doldurmaktan ve abartıdan kaçının. Doğru ve belirli açıklamalar güven oluşturur, hemen çıkma oranını düşürür.",
            ],
            bullets: [
              "Sayfa başına tek H1 ve ana anahtar kelime.",
              "Title 60, description yaklaşık 155 karakter olsun.",
              "Her sayfanın meta verisi benzersiz olmalı — ana sayfa başlığını asla kopyalamayın.",
            ],
          },
          {
            h2: "Meta tag'leri saniyeler içinde üretin",
            paragraphs: [
              "FreetoolsY Meta Tag Generator, girdiğiniz bilgilerden title, description, Open Graph ve Twitter etiketlerini üretir; SERP Önizleme aracı ise Google'ın bunları tam olarak nasıl göstereceğini canlandırır. Sonrasında anahtar kelime yoğunluğunu kontrol ederek odağı tek konuda tutun.",
            ],
          },
        ],
      },
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}