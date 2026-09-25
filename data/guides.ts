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
    slug: "what-is-json-formatter",
    relatedTools: ["json-formatter", "json-csv-converter", "yaml-json-converter"],
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
    slug: "what-is-meta-tags",
    relatedTools: ["meta-tag-generator", "serp-preview", "keyword-density-checker"],
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
  {
    slug: "what-is-json-ld",
    relatedTools: ["jsonld-generator", "meta-tag-generator", "serp-preview"],
    content: {
      en: {
        title: "JSON-LD explained: structured data that helps you rank",
        desc: "Learn what JSON-LD is, why Google uses it to build rich results, and how to generate clean, valid structured data in seconds.",
        intro:
          "JSON-LD (JavaScript Object Notation for Linked Data) is a type of structured data that tells search engines exactly what a page contains. Instead of guessing from the visible text, Google reads the JSON-LD block and uses it to show rich results — stars, FAQs, breadcrumbs, app info and more.",
        blocks: [
          {
            h2: "Why does structured data matter for SEO?",
            paragraphs: [
              "Rich results stand out. A page with a rating, an FAQ section or a software description gets more clicks than the plain blue link next to it, which improves click-through rate. Structured data also helps Google understand your intent, so the right page is shown for the right query.",
              "Almost every FreetoolsY page already ships with helpful JSON-LD: SoftwareApplication on the tools, FAQPage and BreadcrumbList on every page, and WebSite plus Organization on the homepage. If you run your own site, the same markup puts you one step ahead.",
            ],
          },
          {
            h2: "Which JSON-LD types should you use?",
            paragraphs: [
              "Start with the schemas that describe your business: Organization for company info, WebSite for the site itself, and BreadcrumbList for navigation paths.",
            ],
            bullets: [
              "Organization — logo, name and contact details.",
              "WebSite — site-wide metadata, often with a search action.",
              "SoftwareApplication — name, rating and description of a tool.",
              "FAQPage — questions and answers for a help or product page.",
              "BreadcrumbList — the hierarchy back to the homepage.",
            ],
          },
          {
            h2: "Generate valid JSON-LD in seconds",
            paragraphs: [
              "Writing markup by hand is easy to get wrong — one missing bracket and Google ignores the whole block. The JsonLD Generator creates Organization, Article and FAQ schemas from a short form, and outputs code you can paste straight into the head or body of your page. Test the result with the SERP Preview tool to see how it looks in search.",
            ],
          },
        ],
      },
      tr: {
        title: "JSON-LD nedir: sıralamaya yardımcı yapılandırılmış veri",
        desc: "JSON-LD'nin ne olduğunu, Google'ın zengin sonuçları nasıl oluşturduğunu ve saniyeler içinde temiz, geçerli yapılandırılmış veri nasıl üreteceğinizi öğrenin.",
        intro:
          "JSON-LD (Linked Data için JavaScript Object Notation), bir sayfanın ne içerdiğini arama motorlarına tam olarak anlatan bir yapılandırılmış veri türüdür. Google görünür metinden tahmin etmek yerine JSON-LD bloğunu okur ve bunu yıldız, SSS, sayfa yolu ve uygulama bilgisi gibi zengin sonuçlar göstermek için kullanır.",
        blocks: [
          {
            h2: "Yapılandırılmış veri SEO için neden önemli?",
            paragraphs: [
              "Zengin sonuçlar öne çıkar. Puanı, SSS bölümü veya yazılım açıklaması olan bir sayfa, yanındaki sade mavi bağlantıdan daha çok tıklanır; bu da tıklanma oranını artırır. Yapılandırılmış veri ayrıca Google'ın niyetinizi anlamasına yardımcı olur, böylece doğru sorgu için doğru sayfa gösterilir.",
              "FreetoolsY sayfalarının neredeyse tamamında yararlı JSON-LD bulunur: araçlarda SoftwareApplication, her sayfada FAQPage ve BreadcrumbList, ana sayfada ise WebSite ve Organization. Kendi sitenizi yönetiyorsanız aynı işaretleme sizi bir adım öne geçirir.",
            ],
          },
          {
            h2: "Hangi JSON-LD türlerini kullanmalısınız?",
            paragraphs: [
              "İşinizi anlatan şemalarla başlayın: şirket bilgisi için Organization, sitenin kendisi için WebSite ve gezinme yolları için BreadcrumbList.",
            ],
            bullets: [
              "Organization — logo, ad ve iletişim bilgileri.",
              "WebSite — çoğunlukla arama eylemiyle birlikte site geneli meta veri.",
              "SoftwareApplication — aracın adı, puanı ve açıklaması.",
              "FAQPage — yardım veya ürün sayfasındaki soru ve cevaplar.",
              "BreadcrumbList — ana sayfaya dönen hiyerarşi.",
            ],
          },
          {
            h2: "Saniyeler içinde geçerli JSON-LD üretin",
            paragraphs: [
              "Şemayı elle yazmak kolayca hatalı olabilir — tek bir eksik parantez Google'ın tüm bloğu yok saymasına yol açar. JSON-LD Generator, kısa bir formdan Organization, Article ve FAQ şemaları üretir; çıktıyı doğrudan sayfanızın head ya da body bölümüne yapıştırabilirsiniz. Sonucu SERP Önizleme aracıyla test edip aramada nasıl göründüğünü izleyin.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-write-robots-txt",
    relatedTools: ["robots-txt-generator", "url-encoder", "serp-preview"],
    content: {
      en: {
        title: "What is robots.txt and how do you write one?",
        desc: "Understand the robots.txt protocol, which folders and files to block, and how to generate a correct file with a robots.txt generator.",
        intro:
          "robots.txt is a small text file on your server root that tells search engine crawlers which parts of your site they are allowed to crawl. Written correctly, it protects private pages and saves crawl budget; written wrongly, it can hide your whole site from Google.",
        blocks: [
          {
            h2: "How do robots.txt rules work?",
            paragraphs: [
              "The file uses simple rules. User-agent selects the crawler, Disallow blocks a path, Allow re-opens one, and Sitemap points at your sitemap. An empty Disallow (Disallow: with nothing after it) means everything is allowed.",
            ],
            bullets: [
              "User-agent: * — applies to all crawlers.",
              "Disallow: /admin/ — blocks the admin folder.",
              "Allow: /admin/open/ — lets one path back in.",
              "Sitemap: https://example.com/sitemap.xml — announces your sitemap.",
            ],
          },
          {
            h2: "Common mistakes that hurt rankings",
            paragraphs: [
              "Blocking CSS and JavaScript files is the most frequent error — Google then renders a broken page. robots.txt also cannot remove a page from the index; use a noindex tag for that. And remember: a broken Disallow line can accidentally block the entire site.",
            ],
          },
          {
            h2: "Generate a clean robots.txt with FreetoolsY",
            paragraphs: [
              "The Robots.txt Generator builds the file from your allowed and blocked paths, then lets you copy it in one click. Keep the file small, test it in Search Console afterwards, and combine it with a noindex tag and canonical URLs — together they give you full control over how Google crawls your site.",
            ],
          },
        ],
      },
      tr: {
        title: "robots.txt nedir ve nasıl yazılır?",
        desc: "robots.txt protokolünü, hangi klasör ve dosyaların engelleneceğini ve doğru bir dosyayı robots.txt oluşturucuyla nasıl üreteceğinizi öğrenin.",
        intro:
          "robots.txt, sunucunuzun kök dizininde duran ve arama motoru tarayıcılarına sitenizin hangi bölümlerini tarayabileceklerini söyleyen küçük bir metin dosyasıdır. Doğru yazıldığında özel sayfaları korur ve tarama bütçesini verimli kullanır; yanlış yazıldığında sitenizin tamamını Google'dan gizleyebilir.",
        blocks: [
          {
            h2: "robots.txt kuralları nasıl çalışır?",
            paragraphs: [
              "Dosya basit kurallar kullanır. User-agent tarayıcıyı seçer, Disallow bir yolu engeller, Allow bir yolu yeniden açar, Sitemap ise sitemap dosyanızı gösterir. Arkasında hiçbir şey olmayan boş bir Disallow satırı, her şeye izin verildiği anlamına gelir.",
            ],
            bullets: [
              "User-agent: * — tüm tarayıcılar için geçerlidir.",
              "Disallow: /admin/ — admin klasörünü engeller.",
              "Allow: /admin/open/ — bir yolu yeniden açar.",
              "Sitemap: https://ornek.com/sitemap.xml — sitemap'inizi duyurur.",
            ],
          },
          {
            h2: "Sıralamayı bozan yaygın hatalar",
            paragraphs: [
              "En sık yapılan hata CSS ve JavaScript dosyalarını engellemektir — Google böylece bozuk bir sayfa işler. robots.txt ayrıca bir sayfayı dizinden kaldıramaz; bunun için noindex etiketi kullanın. Unutmayın: bozuk bir Disallow satırı tüm siteyi yanlışlıkla engelleyebilir.",
            ],
          },
          {
            h2: "FreetoolsY ile temiz bir robots.txt üretin",
            paragraphs: [
              "Robots.txt Generator, izin verilen ve engellenen yollarınızdan dosyayı oluşturur ve tek tıkla kopyalamanızı sağlar. Dosyayı küçük tutun, sonrasında Search Console'da test edin ve noindex etiketi ile canonical adreslerle birlikte kullanın — üçü bir arada Google'ın sitenizi nasıl tarayacağı konusunda size tam kontrol verir.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "what-is-hreflang-multilingual-seo",
    relatedTools: ["hreflang-generator", "meta-tag-generator"],
    content: {
      en: {
        title: "Hreflang guide: the right page for every language",
        desc: "Learn what hreflang tags do, why multilingual sites need them, and how to generate correct hreflang links with a hreflang generator.",
        intro:
          "Hreflang is an HTML attribute that tells Google which URL to show for which language or region. Without it, a multilingual site can serve duplicate, confusing results — the English page showing up in Turkish search results and vice versa.",
        blocks: [
          {
            h2: "When do you need hreflang tags?",
            paragraphs: [
              "Hreflang matters the moment you serve the same content in more than one language or region.",
            ],
            bullets: [
              "You have the same content in two or more languages.",
              "You offer country-specific pages that share a language.",
              "You want a fallback page for users in regions you do not target.",
            ],
          },
          {
            h2: "How the attribute works",
            paragraphs: [
              "Every translated page lists all its language versions, including itself, using link rel=alternate with the hreflang attribute. The x-default value points to the fallback page for languages you do not serve. When the values disagree between versions, Google ignores all of them — so consistency matters.",
            ],
          },
          {
            h2: "Generate hreflang links without typos",
            paragraphs: [
              "Writing these links by hand across many pages produces copy-and-paste mistakes, and one wrong language code resets your whole set. The Hreflang Generator produces the complete link tags or a URL list for your sitemap from your existing page URLs, ready to paste. Verify the output and keep the same codes on every language version.",
            ],
          },
        ],
      },
      tr: {
        title: "Hreflang rehberi: her dil için doğru sayfa",
        desc: "Hreflang etiketlerinin ne yaptığını, çok dilli sitelerin neden bunlara ihtiyaç duyduğunu ve bir hreflang oluşturucuyla doğru bağlantıları nasıl üreteceğinizi öğrenin.",
        intro:
          "Hreflang, Google'a hangi URL'nin hangi dil veya bölge için gösterileceğini söyleyen bir HTML özniteliğidir. Bu olmadan çok dilli bir site kopya ve karışık sonuçlar gösterebilir — İngilizce sayfa Türkçe arama sonuçlarında, Türkçe sayfa İngilizce sonuçlarında belirir.",
        blocks: [
          {
            h2: "Hreflang etiketlerine ne zaman ihtiyacınız var?",
            paragraphs: [
              "Aynı içeriği birden fazla dilde veya bölgede sunduğunuz anda hreflang önemli hale gelir.",
            ],
            bullets: [
              "Aynı içeriği iki veya daha fazla dilde sunuyorsunuz.",
              "Dili aynı, ülkeye özel sayfalarınız var.",
              "Hedeflemediğiniz bölgelerdeki kullanıcılar için yedek sayfa istiyorsunuz.",
            ],
          },
          {
            h2: "Öznitelik nasıl çalışır?",
            paragraphs: [
              "Çevrilen her sayfa, kendisi de dahil tüm dil sürümlerini link rel=alternate ile hreflang özniteliği kullanarak listeler. x-default değeri, sunmadığınız diller için yedek sayfayı işaret eder. Sürümler birbiriyle çeliştiğinde Google hepsini yok sayar — bu yüzden tutarlılık önemlidir.",
            ],
          },
          {
            h2: "Yazım hatasız hreflang bağlantıları üretin",
            paragraphs: [
              "Bu bağlantıları birçok sayfada elle yazmak kopyala-yapıştır hataları doğurur ve tek bir yanlış dil kodu tüm seti bozar. Hreflang Generator, mevcut sayfa URL'lerinizden hazır link etiketleri veya sitemap için URL listesi üretir. Çıktıyı doğrulayın ve her dil sürümünde aynı kodları kullanın.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "markdown-to-html-guide",
    relatedTools: [
      "markdown-html-converter",
      "html-formatter",
      "html-entity-converter",
    ],
    content: {
      en: {
        title: "Markdown to HTML: a practical guide for writers",
        desc: "Turn Markdown into clean HTML for blogs, emails and docs — learn the basics of conversion and how to convert Markdown to HTML instantly.",
        intro:
          "Markdown lets you write structure without tags: a hash for a heading, an asterisk for bold. Most publishing platforms need HTML under the hood, so a Markdown to HTML converter turns your lightweight text into clean markup in seconds.",
        blocks: [
          {
            h2: "Which Markdown elements are most common?",
            paragraphs: [
              "You can write a full article with a handful of symbols, and every one has a predictable HTML output.",
            ],
            bullets: [
              "Headings (#, ##, ###) become h1, h2 and h3 tags.",
              "Emphasis: *text* is italic, **text** is bold.",
              "Lists: - or * makes bullets, 1. makes numbered lists.",
              "Links: [text](url) becomes an anchor tag.",
              "Code: backticks become code, ``` fenced blocks become pre.",
            ],
          },
          {
            h2: "Why convert Markdown instead of pasting HTML?",
            paragraphs: [
              "Writing HTML by hand in a blog or email editor invites errors — unclosed tags and broken entities appear often. With Markdown you keep the source readable and convert only when the target system really needs HTML. The result is also far easier to review before publishing.",
            ],
          },
          {
            h2: "Convert, clean, and reuse",
            paragraphs: [
              "The Markdown to HTML Converter produces ready-to-paste markup you can check with the HTML Formatter, and when text contains reserved characters like < or >, the HTML Entity Converter keeps them safe. Use the three tools together and your content will survive any platform without breaking.",
            ],
          },
        ],
      },
      tr: {
        title: "Markdown'dan HTML'e: yazarlar için pratik rehber",
        desc: "Bloglar, e-postalar ve dokümanlar için Markdown'u temiz HTML'e dönüştürmeyi ve Markdown'dan HTML'e anında çevirinin temellerini öğrenin.",
        intro:
          "Markdown, etiket olmadan yapı yazmanızı sağlar: başlık için bir diyez, kalın için bir yıldız. Çoğu yayın platformu arka planda HTML ister; bu yüzden Markdown'dan HTML'e dönüştürücü hafif metninizi saniyeler içinde temiz işaretlemeye çevirir.",
        blocks: [
          {
            h2: "En yaygın Markdown öğeleri hangileri?",
            paragraphs: [
              "Bir avuç sembolle koca bir makale yazabilirsiniz ve her birinin tahmin edilebilir bir HTML çıktısı vardır.",
            ],
            bullets: [
              "Başlıklar (#, ##, ###) h1, h2 ve h3 etiketlerine dönüşür.",
              "Vurgu: *metin* italik, **metin** kalın yapar.",
              "Listeler: - veya * madde imli, 1. numaralı liste yapar.",
              "Bağlantı: [metin](url) bir çapa etiketi olur.",
              "Kod: ters tırnak code, ``` fenced bloklar pre olur.",
            ],
          },
          {
            h2: "HTML yapıştırmak yerine neden Markdown çevirelim?",
            paragraphs: [
              "Blog veya e-posta editöründe HTML'i elle yazmak hata davet eder — kapanmamış etiketler ve bozuk karakterler sık görülür. Markdown ile kaynağı okunabilir tutar, sadece hedef sistem gerçekten HTML istediğinde dönüştürürsünüz. Sonuç da yayınlamadan önce gözden geçirmek için çok daha kolaydır.",
            ],
          },
          {
            h2: "Dönüştürün, temizleyin, yeniden kullanın",
            paragraphs: [
              "Markdown'dan HTML'e Dönüştürücü, HTML Biçimlendirici ile kontrol edebileceğiniz hazır işaretleme üretir; metinde < veya > gibi ayrılmış karakterler varsa HTML Varlıkları Dönüştürücü onları güvende tutar. Üç aracı birlikte kullanın; içeriğiniz hiçbir platformda bozulmadan çalışır.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-convert-currency",
    relatedTools: ["currency-converter", "percentage-calculator", "unit-converter"],
    content: {
      en: {
        title: "Currency converter: how to calculate exchange rates",
        desc: "Understand exchange rates, how currencies are quoted, and how to convert money quickly with or without live rates.",
        intro:
          "Currency conversion means multiplying an amount by an exchange rate — the price of one currency in another. Rates move constantly on the market, so the answer you get depends on when you convert and which rate you use.",
        blocks: [
          {
            h2: "How are exchange rates read?",
            paragraphs: [
              "A quote like 1 USD = 27.5 TRY tells you how much one dollar costs in liras. To convert in that direction you multiply, and the tool does it automatically whichever way you enter the pair. Knowing the direction prevents the most common mistake: multiplying when you should divide.",
            ],
          },
          {
            h2: "Live rates vs fixed rates",
            paragraphs: [
              "Live rates come from banks or APIs and change by the second; fixed rates suit budgets, quotes and offline planning. Mid-market rates sit between the buy and sell price of a bank and are the fairest comparison point.",
            ],
            bullets: [
              "Live rates — current, but they change as you watch.",
              "Fixed rates — predictable for plans and documents.",
              "Mid-market — the reference point between a bank's buy and sell prices.",
            ],
          },
          {
            h2: "Convert in your browser without guesswork",
            paragraphs: [
              "FreetoolsY Currency Converter multiplies your amount by the selected rate, switches the base and target currency freely, and lets you override the rate when you have a bank or invoice figure. Prices shown by banks include a margin, so compare the mid-market rate to understand what you really pay.",
            ],
          },
        ],
      },
      tr: {
        title: "Döviz çevirici: kur hesaplama nasıl yapılır?",
        desc: "Döviz kurlarının nasıl okunduğunu, para birimlerinin nasıl çevrildiğini ve canlı kur olsun ya da olmasın parayı hızlıca nasıl hesaplayacağınızı öğrenin.",
        intro:
          "Döviz çevirme, bir tutarı döviz kuruyla çarpmak demektir — yani bir para biriminin diğeri cinsinden fiyatı. Kurlar piyasada sürekli hareket eder; bu yüzden alacağınız sonuç, hangi anda çevirdiğinize ve hangi kuru kullandığınıza bağlıdır.",
        blocks: [
          {
            h2: "Döviz kurları nasıl okunur?",
            paragraphs: [
              "1 USD = 27,5 TRY gibi bir fiyat, bir doların kaç liraya karşılık geldiğini söyler. O yönde çevirirken çarparsınız; araç, çifti hangi yönde girerseniz girin bunu otomatik yapar. Yönü bilmek en yaygın hatayı — bölmeniz gereken yerde çarpmayı — engeller.",
            ],
          },
          {
            h2: "Canlı kur mu, sabit kur mu?",
            paragraphs: [
              "Canlı kurlar bankalardan veya API'lerden gelir ve saniyeler içinde değişir; sabit kurlar bütçe, teklif ve çevrimdışı planlamaya uygundur. Piyasa ortası kur, bankanın alış ve satış fiyatının ortasında durur ve en adil karşılaştırma noktasıdır.",
            ],
            bullets: [
              "Canlı kur — günceldir ama izlerken değişir.",
              "Sabit kur — planlar ve belgeler için öngörülebilir.",
              "Piyasa ortası — bankanın alış ve satış fiyatı arasındaki referans.",
            ],
          },
          {
            h2: "Tahmin yapmadan tarayıcıda çevirin",
            paragraphs: [
              "FreetoolsY Döviz Çevirici, tutarı seçtiğiniz kurla çarpar, temel ve hedef para birimini serbestçe değiştirir ve elinizde banka veya fatura tutarı varsa kurun üzerine yazmanıza izin verir. Bankaların gösterdiği fiyata bir fark eklenir; bu yüzden gerçekte ne ödediğinizi anlamak için piyasa ortası kuru karşılaştırın.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "what-is-compound-interest",
    relatedTools: [
      "compound-interest-calculator",
      "loan-emi-calculator",
      "salary-calculator",
    ],
    content: {
      en: {
        title: "Compound interest calculator: how compounding works",
        desc: "Understand compound interest, the formula behind it, and how a small monthly amount grows into a large sum over time.",
        intro:
          "Compound interest is interest on interest. Each period, the interest earned is added to the principal, and the next calculation runs on the bigger total. Over years that snowball effect turns small savings into surprisingly large balances.",
        blocks: [
          {
            h2: "The inputs that drive growth",
            paragraphs: [
              "Interest is typically compounded daily, monthly or yearly. The more often it compounds, the faster the balance grows for the same rate. Rate, frequency and time work together — and time is the most underused ingredient of all.",
            ],
            bullets: [
              "Principal — the money you save or owe at the start.",
              "Rate — the yearly interest percentage.",
              "Compounds per year — daily, monthly, quarterly or yearly.",
              "Years — the longer the period, the steeper the curve.",
            ],
          },
          {
            h2: "Compound interest on loans cuts the other way",
            paragraphs: [
              "The same mathematics steers loans and credit cards, where compounding increases what you owe. Term and rate decide how painful the curve gets; the Loan EMI Calculator shows the monthly payment so you can compare offers before signing.",
            ],
          },
          {
            h2: "Model any scenario with the calculator",
            paragraphs: [
              "The Compound Interest Calculator takes principal, rate, frequency and years, then shows the final balance and the growth curve. Run a couple of scenarios — a little more each month, a slightly higher rate — and let the snowball show you which lever matters most.",
            ],
          },
        ],
      },
      tr: {
        title: "Bileşik faiz hesaplama: birikim nasıl büyür?",
        desc: "Bileşik faiz kavramını, arkasındaki formülü ve küçük bir aylık tutarın zaman içinde nasıl büyük bir mevduata dönüştüğünü öğrenin.",
        intro:
          "Bileşik faiz, faizin faizidir. Her dönemde kazanılan faiz anaparaya eklenir ve sonraki hesaplama büyümüş toplam üzerinden yapılır. Yıllar içinde bu kartopu etkisi küçük birikimleri şaşırtıcı derecede büyük bakiyelere çevirir.",
        blocks: [
          {
            h2: "Büyümeyi yönlendiren girdiler",
            paragraphs: [
              "Faiz genellikle günlük, aylık veya yıllık birleştirilir. Aynı oranda ne kadar sık birleştirilirse bakiye o kadar hızlı büyür. Oran, sıklık ve süre birlikte çalışır — ve zaman en az kullanılan bileşendir.",
            ],
            bullets: [
              "Anapara — başlangıçta biriktirdiğiniz veya borçlu olduğunuz para.",
              "Oran — yıllık faiz yüzdesi.",
              "Yıllık birleştirme — günlük, aylık, üç aylık veya yıllık.",
              "Yıl — süre uzadıkça eğri dikleşir.",
            ],
          },
          {
            h2: "Kredilerde bileşik faiz ters yönde çalışır",
            paragraphs: [
              "Aynı matematik, bileşikleştirmenin borcunuzu artırdığı kredileri ve kredi kartlarını da yönetir. Vade ve oran eğrinin ne kadar zorlu olacağına karar verir; Kredi Taksit Hesaplama aylık ödemeyi gösterir, böylece imzalamadan önce teklifleri karşılaştırabilirsiniz.",
            ],
          },
          {
            h2: "Hesap makinesiyle her senaryoyu modelleyin",
            paragraphs: [
              "Bileşik Faiz Hesaplama; anapara, oran, sıklık ve yıl bilgilerini alır ve nihai bakiyeyi büyüme eğrisiyle birlikte gösterir. Birkaç senaryo deneyin — her ay biraz daha fazla, oranı biraz yükseltin — kartopu hangi faktörün daha önemli olduğunu göstersin.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-format-sql-queries",
    relatedTools: ["sql-formatter", "json-formatter", "xml-formatter"],
    content: {
      en: {
        title: "SQL formatter: write readable queries in seconds",
        desc: "Learn why formatted SQL is easier to debug and review, how keyword casing and indentation help, and how to format queries instantly.",
        intro:
          "A SQL query can be a single long line or a readable, indented block. A SQL formatter breaks the query into lines, aligns clauses and capitalizes keywords so the structure is visible before you even read the logic.",
        blocks: [
          {
            h2: "Why formatting makes SQL easier to review",
            paragraphs: [
              "SELECT, JOIN and WHERE are easier to separate when each clause starts on its own line. Reviewers spot missing conditions faster, and you find the mistake before the database does. Teams that format every query write fewer bugs and spend less time on pull requests.",
            ],
          },
          {
            h2: "What a formatter changes",
            paragraphs: [
              "Formatting never changes what the query returns — it only changes how the query reads.",
            ],
            bullets: [
              "Keywords such as SELECT, FROM and WHERE are uppercased.",
              "Each clause starts on a new line and subqueries are indented.",
              "Lists of columns and conditions line up for scanning.",
            ],
          },
          {
            h2: "Format SQL alongside the rest of your stack",
            paragraphs: [
              "The SQL Formatter handles SELECT, INSERT, UPDATE and CREATE statements and returns a copy-ready result. Use it together with the JSON and XML formatters to keep every text format in your pipeline consistent — readable data is debugged faster and shipped with fewer surprises.",
            ],
          },
        ],
      },
      tr: {
        title: "SQL formatlayıcı: saniyeler içinde okunaklı sorgular",
        desc: "Biçimlendirilmiş SQL'in neden daha kolay hata ayıklanıp incelendiğini, anahtar kelime büyük harfinin ve girintinin nasıl yardımcı olduğunu ve sorguları anında nasıl biçimlendireceğinizi öğrenin.",
        intro:
          "Bir SQL sorgusu tek bir uzun satır ya da okunabilir, girintili bir blok olabilir. SQL formatter, sorguyu satırlara böler, maddeleri hizalar ve anahtar kelimeleri büyüğe çevirir — mantığı okumadan önce yapıyı görürsünüz.",
        blocks: [
          {
            h2: "Biçimlendirme SQL'i incelemeyi neden kolaylaştırır?",
            paragraphs: [
              "Her madde kendi satırında başladığında SELECT, JOIN ve WHERE'i ayırmak kolaylaşır. İnceleyen kişi eksik koşulları daha hızlı fark eder; siz de hatayı veritabanı bulmadan görürsünüz. Her sorguyu biçimlendiren ekipler daha az hata üretir ve pull request'lerde daha az zaman harcar.",
            ],
          },
          {
            h2: "Bir formatlayıcı neyi değiştirir?",
            paragraphs: [
              "Biçimlendirme, sorgunun döndürdüğü sonucu asla değiştirmez — sadece sorgunun nasıl okunduğunu değiştirir.",
            ],
            bullets: [
              "SELECT, FROM ve WHERE gibi anahtar kelimeler büyük harfle yazılır.",
              "Her madde yeni satırda başlar ve alt sorgular girintilenir.",
              "Sütun ve koşul listeleri taramak için hizalanır.",
            ],
          },
          {
            h2: "SQL'i diğer araçlarla birlikte biçimlendirin",
            paragraphs: [
              "SQL Formatter; SELECT, INSERT, UPDATE ve CREATE ifadelerini işler ve kopyalanmaya hazır bir sonuç döndürür. JSON ve XML formatlayıcılarla birlikte kullanın; böylece pipeline'ınızdaki her metin biçimi tutarlı kalır — okunabilir veri daha hızlı hata ayıklanır ve daha az sürprizle yayına girer.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "wheel-of-names-random-picker-guide",
    relatedTools: ["wheel-of-names", "random-number-generator", "list-shuffler"],
    content: {
      en: {
        title: "Wheel of names: run a fair random picker",
        desc: "Use a wheel of names, a random number generator and a shuffle tool to run fair giveaways, draw winners and assign teams.",
        intro:
          "A wheel of names is a spinning circle that picks one entry at random. Because the wheel can be seen and saved, audiences trust it far more than a silent random pick — and the tool makes the draw transparent for everyone.",
        blocks: [
          {
            h2: "When a random picker beats choosing by hand",
            paragraphs: [
              "Humans are surprisingly bad at random choices — we repeat, we favor, we hesitate. A visible wheel removes every doubt.",
            ],
            bullets: [
              "Giveaways on social media and live streams.",
              "Classroom questions and icebreakers.",
              "Assigning teams, turn orders and roommates fairly.",
              "Demos, testing and QA where variation is needed.",
            ],
          },
          {
            h2: "Random number generator and shuffle as alternatives",
            paragraphs: [
              "A random number generator gives a fair result without a visual — ideal for drawing numbered tickets or seat numbers. A list shuffler reorders all entries at once, perfect when you need a sequence (who goes first, second, third) instead of a single winner.",
            ],
          },
          {
            h2: "Run the draw so everyone trusts it",
            paragraphs: [
              "Paste the full list, spin the wheel once and record the result. If you need a series of winners, shuffle the list once beforehand so even the order of spins is fair. FreetoolsY keeps everything client-side, so no entries ever leave your browser — a detail your audience will appreciate.",
            ],
          },
        ],
      },
      tr: {
        title: "Çarkıfelek: adil rastgele seçim nasıl yapılır?",
        desc: "Adil çekilişler yapmak, kazanan belirlemek ve takım kurmak için çarkıfelek, rastgele sayı üretici ve liste karıştırıcıyı kullanın.",
        intro:
          "Çarkıfelek, bir girdiyi rastgele seçen dönen bir çemberdir. Çark görülebildiği ve kaydedilebildiği için izleyiciler ona sessiz bir rastgele seçimden çok daha fazla güvenir — araç çekilişi herkes için şeffaf kılar.",
        blocks: [
          {
            h2: "Elle seçmek yerine rastgele seçici ne zaman iyi?",
            paragraphs: [
              "İnsanlar rastgele seçimde şaşırtıcı derecede kötüdür — tekrar ederiz, kayırmaya meyilliyiz, tereddüt ederiz. Görünür bir çark her şüpheyi ortadan kaldırır.",
            ],
            bullets: [
              "Sosyal medya ve canlı yayınlardaki çekilişler.",
              "Sınıf soruları ve kaynaştırıcı oyunlar.",
              "Takım, sıra ve oda arkadaşı atamaları.",
              "Çeşitlilik gerektiren demo, test ve QA işleri.",
            ],
          },
          {
            h2: "Alternatif: rastgele sayı üretici ve karıştırıcı",
            paragraphs: [
              "Rastgele sayı üretici, görsel olmadan adil bir sonuç verir — numaralı bilet veya koltuk numarası çekmek için idealdir. Liste karıştırıcı ise tüm girdileri aynı anda yeniden sıralar; tek kazanan değil de bir sıra gerektiğinde (önce kim, ikinci kim) tam istediğiniz araçtır.",
            ],
          },
          {
            h2: "Herkesin güveneceği bir çekiliş yapın",
            paragraphs: [
              "Tüm listeyi yapıştırın, çarkı bir kez çevirin ve sonucu kaydedin. Bir dizi kazanan gerekiyorsa öncesinde listeyi bir kez karıştırın ki çevirme sırası bile adil olsun. FreetoolsY her şeyi tarayıcınızda tutar; hiçbir girdi tarayıcınızdan çıkmaz — izleyicilerinizin takdir edeceği bir detay.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "what-is-a-qr-code",
    relatedTools: ["qr-code-generator", "url-encoder"],
    content: {
      en: {
        title: "What is a QR code and how do you make one?",
        desc: "QR codes explained: how they work, where they are used, and how to generate a custom QR code in seconds with FreetoolsY.",
        intro:
          "A QR code (Quick Response code) is a two-dimensional barcode that can be scanned by any smartphone camera. It stores text, URLs, Wi-Fi details or contact information and turns them into an instant action for the person scanning it.",
        blocks: [
          {
            h2: "How does a QR code work?",
            paragraphs: [
              "A QR code stores data as black squares on a white background, arranged in a grid. Three large squares in the corners help the camera find and orient the code; everything else encodes the actual payload. Because scanning happens client-side, no data has to travel anywhere — the phone reads the pattern locally.",
            ],
            bullets: [
              "URLs: open a website or landing page.",
              "Wi-Fi: connect to a network with one tap.",
              "Payments: start a payment link or program.",
              "Products: show a menu, manual or campaign page.",
            ],
          },
          {
            h2: "How to generate a QR code with FreetoolsY",
            paragraphs: [
              "Open the QR Code Generator and type or paste the text, link or serial number you want to encode. Pick a size and the colors you like, then download the QR code as a PNG image and drop it into a poster, menu, business card or email signature.",
            ],
            bullets: [
              "Test the code with a real phone camera before printing.",
              "Use a solid, dark-on-light contrast for reliable scanning.",
              "Keep a buffer zone around the code — do not cover it with artwork.",
            ],
          },
          {
            h2: "Best practices for QR codes",
            paragraphs: [
              "Run a quick error check before you print: a few wrong modules can make the whole code unreadable. If your target is a URL, point the code to a short redirect you can change later, so you do not have to reprint when the link updates.",
            ],
          },
        ],
      },
      tr: {
        title: "QR kod nedir ve nasıl oluşturulur?",
        desc: "QR kodların nasıl çalıştığını, nerelerde kullanıldığını ve FreetoolsY ile saniyeler içinde özel QR kod nasıl üretileceğini öğrenin.",
        intro:
          "QR kod (Quick Response), herhangi bir akıllı telefon kamerasıyla taranabilen iki boyutlu bir barkoddur. Metin, URL, Wi-Fi bilgisi veya iletişim bilgisi saklar; tarayan kişi için bunları anında bir işleme dönüştürür.",
        blocks: [
          {
            h2: "QR kod nasıl çalışır?",
            paragraphs: [
              "QR kod, veriyi siyah karelerin beyaz zemin üzerine yerleştiği bir ızgara olarak saklar. Köşelerdeki üç büyük kare kameranın kodu bulmasına ve yönünü belirlemesine yardımcı olur; gerisi gerçek yükü kodlar. Tarama tamamen cihazda yapıldığı için hiçbir veri başka bir yere gitmez.",
            ],
            bullets: [
              "URL: bir web sitesini veya açılış sayfasını açar.",
              "Wi-Fi: tek dokunuşla ağa bağlanır.",
              "Ödeme: bir ödeme bağlantısını veya programını başlatır.",
              "Ürün: menü, kılavuz veya kampanya sayfası gösterir.",
            ],
          },
          {
            h2: "FreetoolsY ile QR kod nasıl oluşturulur?",
            paragraphs: [
              "QR Kod Oluşturucu'yu açın ve kodlamak istediğiniz metni, bağlantıyı veya seri numarasını yazın ya da yapıştırın. Boyutu ve istediğiniz renkleri seçin, ardından QR kodu PNG olarak indirip afişe, menüye, kartvizite veya e-posta imzasına ekleyin.",
            ],
            bullets: [
              "Baskıdan önce kodu gerçek bir telefon kamerasıyla test edin.",
              "Güvenilir tarama için koyu ve açık zemin arasında güçlü kontrast kullanın.",
              "Kodun çevresinde boşluk bırakın — üzerini tasarımla kapatmayın.",
            ],
          },
          {
            h2: "QR kod için en iyi uygulamalar",
            paragraphs: [
              "Baskı öncesi hata kontrolü yapın: birkaç yanlış modül, kodun tamamını okunmaz hale getirebilir. Hedef bir URL ise, kodu daha sonra değiştirebileceğiniz kısa bir yönlendirmeye bağlayın; böylece bağlantı güncellenince yeniden bastırmanız gerekmez.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "what-is-base64-encoding",
    relatedTools: ["base64", "image-to-base64", "url-encoder"],
    content: {
      en: {
        title: "What is Base64 encoding and when should you use it?",
        desc: "Learn how Base64 works, why email, JSON and HTML use it, and how to encode or decode text and images instantly in your browser.",
        intro:
          "Base64 is a way to represent binary data as plain ASCII text. It turns bytes into a safe 64-character alphabet (A-Z, a-z, 0-9, + and /) so data can travel through systems that only understand text.",
        blocks: [
          {
            h2: "Why is Base64 everywhere?",
            paragraphs: [
              "Emails, JSON APIs, CSS and HTML all predate modern binary-safe transport. Base64 lets them embed images, files and raw bytes without corruption. It grows data by about 33%, but the trade-off is universally compatible transport.",
            ],
            bullets: [
              "Inline images in HTML or CSS as data URIs.",
              "Attachments in email (MIME) and JWT payloads.",
              "Storing binary values inside JSON or configuration files.",
            ],
          },
          {
            h2: "How to encode and decode with FreetoolsY",
            paragraphs: [
              "Paste text or a file into the Base64 Encoder and copy the encoded output. The tool also decodes — handy when you receive a Base64 blob from an API and want the original value back. Use image-to-base64 when you specifically need an image as a data URI.",
            ],
          },
          {
            h2: "Base64 is not encryption",
            paragraphs: [
              "Anyone can decode Base64 in a second, so never use it to protect passwords or secrets. Treat it as a format, not security. For sensitive data use a real encryption tool with a key.",
            ],
          },
        ],
      },
      tr: {
        title: "Base64 kodlama nedir ve ne zaman kullanılır?",
        desc: "Base64'ün nasıl çalıştığını, e-posta, JSON ve HTML'nin onu neden kullandığını ve tarayıcınızda metin veya görselleri nasıl encode/decode edeceğinizi öğrenin.",
        intro:
          "Base64, ikili veriyi düz ASCII metin olarak temsil etmenin bir yoludur. Baytları güvenli 64 karakterlik bir alfabeye (A-Z, a-z, 0-9, + ve /) dönüştürür; böylece veri yalnızca metin anlayan sistemlerde güvenle taşınabilir.",
        blocks: [
          {
            h2: "Base64 neden her yerde?",
            paragraphs: [
              "E-postalar, JSON API'ler, CSS ve HTML ikili veriye güvenli taşımanın yaygınlaşmasından önce ortaya çıktı. Base64 bu sistemlerin görsel, dosya ve ham baytları bozulmadan gömmesini sağlar. Veriyi yaklaşık %33 büyütür, ancak bedeli evrensel uyumlu taşımadır.",
            ],
            bullets: [
              "HTML veya CSS'te data URI olarak satır içi görseller.",
              "E-posta ekleri (MIME) ve JWT payload'ları.",
              "JSON veya yapılandırma dosyalarında ikili değer saklama.",
            ],
          },
          {
            h2: "FreetoolsY ile nasıl encode/decode edilir?",
            paragraphs: [
              "Metni veya bir dosyayı Base64 Encoder'a yapıştırın ve çıktıyı kopyalayın. Araç aynı zamanda decode eder; bir API'den Base64 blob aldığınızda orijinal değere dönmek için idealdir. Görseli özellikle data URI olarak istiyorsanız image-to-base64 aracını kullanın.",
            ],
          },
          {
            h2: "Base64 şifreleme değildir",
            paragraphs: [
              "Base64 bir saniyede çözülebilir; şifreleri veya sırları korumak için asla kullanmayın. Onu bir format olarak görün, güvenlik olarak değil. Gizli veriler için anahtarlı gerçek bir şifreleme aracı kullanın.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-calculate-bmi",
    relatedTools: ["bmi-calculator", "ideal-weight-calculator", "body-fat-calculator"],
    content: {
      en: {
        title: "What is BMI and how do you calculate it?",
        desc: "Body Mass Index explained: the formula, the categories, its limits, and how to check your BMI in one click with FreetoolsY.",
        intro:
          "BMI (Body Mass Index) is a quick number that relates your weight to your height. It is the most widely used screening tool for weight categories, calculated as weight in kilograms divided by height in meters squared.",
        blocks: [
          {
            h2: "The BMI formula",
            paragraphs: [
              "BMI = weight (kg) / height (m)^2. Enter those two values into the BMI Calculator and it returns your index and your category: underweight, normal, overweight or obese, using the standard WHO ranges.",
            ],
            bullets: [
              "Below 18.5: underweight.",
              "18.5-24.9: normal weight.",
              "25-29.9: overweight.",
              "30 and above: obese.",
            ],
          },
          {
            h2: "Where BMI is useful and where it is not",
            paragraphs: [
              "BMI is a cheap, reproducible population indicator. For individuals it can mislead: athletes with high muscle mass often land in the overweight range, while older adults can be normal-weight yet frail. Use BMI as a starting point, and pair it with body fat percentage or waist measurement for a fuller picture — FreetoolsY has a Body Fat Calculator for that.",
            ],
          },
          {
            h2: "How to use the tool",
            paragraphs: [
              "Enter height and weight, then read the result instantly. The calculator shows the exact BMI value and the category, so you can track changes over time from the same starting data.",
            ],
          },
        ],
      },
      tr: {
        title: "Vücut Kitle İndeksi (BMI) nedir ve nasıl hesaplanır?",
        desc: "Vücut Kitle İndeksi formülü, kategorileri, sınırları ve FreetoolsY ile BMI'ınızı tek tıkla nasıl ölçeceğiniz.",
        intro:
          "Vücut Kitle İndeksi (BMI), kilonuzu boyunuzla ilişkilendiren hızlı bir ölçüttür. Kilo kategorileri için en yaygın kullanılan tarama araçlarından biridir; kilonun (kg) boyun metre cinsinden karesine bölünmesiyle hesaplanır.",
        blocks: [
          {
            h2: "BMI formülü",
            paragraphs: [
              "BMI = kilo (kg) / boy (m)^2. Bu iki değeri BMI Hesaplayıcı'ya girin; sonuç olarak endeksinizi ve kategorinizi verir: zayıf, normal, kilolu veya obez — standart WHO aralıklarına göre.",
            ],
            bullets: [
              "18.5 altı: zayıf.",
              "18.5-24.9: normal kilo.",
              "25-29.9: kilolu.",
              "30 ve üzeri: obez.",
            ],
          },
          {
            h2: "BMI nerede işe yarar, nerede yanıltır?",
            paragraphs: [
              "BMI ucuz ve tekrarlanabilir bir toplum ölçütüdür. Bireyler için yanıltıcı olabilir: kas oranı yüksek sporcular genellikle kilolu aralığına düşerken, yaşlı yetişkinler normal kiloda olup kırılgan olabilir. BMI'ı başlangıç noktası olarak kullanın ve vücut yağ oranı veya bel ölçüsüyle tamamlayın — FreetoolsY bunun için bir Vücut Yağ Hesaplayıcı sunar.",
            ],
          },
          {
            h2: "Araç nasıl kullanılır?",
            paragraphs: [
              "Boy ve kilonuzu girin, sonucu anında okuyun. Hesaplayıcı tam BMI değerini ve kategoriyi gösterir; aynı başlangıç verisiyle zaman içindeki değişimi takip edebilirsiniz.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-create-strong-passwords",
    relatedTools: ["password-generator", "password-strength-checker", "random-string-generator"],
    content: {
      en: {
        title: "How to create strong passwords and test their strength",
        desc: "Password security made simple: what makes a password strong, how a generator creates secure passwords, and how to check strength in real time.",
        intro:
          "Most account takeovers come from weak, reused or predictable passwords. A strong password is long, random and unique per site. This guide shows how to generate one and how to verify its strength before you use it.",
        blocks: [
          {
            h2: "What actually makes a password strong?",
            paragraphs: [
              "Length beats complexity. A 16-character random password has trillions of times more combinations than an 8-character one, even if the short one has symbols. The best approach is a generator that picks from a large alphabet: upper and lower case, digits and symbols, with no word patterns an attacker could guess.",
            ],
          },
          {
            h2: "Generate and verify with FreetoolsY",
            paragraphs: [
              "Use the Password Generator to create a long, random password and copy it into your password manager. Before committing, paste it into the Password Strength Checker to see an instant score and get specific feedback on length and variety.",
            ],
            bullets: [
              "Use a unique password for every account.",
              "Store them in a password manager, not a note file.",
              "Enable two-factor authentication where possible.",
            ],
          },
          {
            h2: "What about passphrases?",
            paragraphs: [
              "A passphrase — several random words joined together — is easier to type and memorize while staying strong. The Random String Generator can build memorable combinations too, giving you the same protection with less friction.",
            ],
          },
        ],
      },
      tr: {
        title: "Güçlü şifre nasıl oluşturulur ve gücü nasıl test edilir?",
        desc: "Şifre güvenliği sade anlatımla: şifreyi güçlü yapan şey, üreticinin nasıl güvenli şifre oluşturduğu ve gücünün anlık nasıl kontrol edileceği.",
        intro:
          "Hesap ele geçirmelerinin çoğu zayıf, tekrar kullanılan veya tahmin edilebilir şifrelerden gelir. Güçlü bir şifre uzun, rastgele ve her site için benzersizdir. Bu rehber, güçlü şifrenin nasıl üretileceğini ve kullanmadan önce gücünün nasıl doğrulanacağını gösterir.",
        blocks: [
          {
            h2: "Şifreyi asıl güçlü yapan nedir?",
            paragraphs: [
              "Uzunluk, karmaşıklığı yener. 16 karakterlik rastgele bir şifre, sembollü olsa bile 8 karakterli olandan trilyonlarca kat fazla kombinasyona sahiptir. En iyi yaklaşım, büyük bir alfabeden seçim yapan üreticidir: büyük/küçük harf, rakam ve sembol; saldırganın tahmin edebileceği kelime örüntüleri olmadan.",
            ],
          },
          {
            h2: "FreetoolsY ile üretin ve doğrulayın",
            paragraphs: [
              "Şifre Oluşturucu ile uzun ve rastgele bir şifre üretin, ardından şifre yöneticinize kopyalayın. Kullanmadan önce Şifre Gücü Kontrol aracına yapıştırın; anlık puan ve uzunluk/çeşitlilik hakkında somut geri bildirim alın.",
            ],
            bullets: [
              "Her hesap için benzersiz bir şifre kullanın.",
              "Şifreleri not dosyasına değil, şifre yöneticisine kaydedin.",
              "Mümkünse iki faktörlü doğrulamayı açın.",
            ],
          },
          {
            h2: "Peki parola cümleleri?",
            paragraphs: [
              "Parola cümlesi — birkaç rastgele kelimenin birleşimi — hem güçlü kalır hem yazması ve hatırlaması kolaydır. Rastgele Metin Oluşturucu da akılda kalıcı kombinasyonlar üretebilir; aynı korumayı daha az sürtünmeyle sunar.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-convert-unix-timestamps",
    relatedTools: ["unix-timestamp-converter", "date-difference"],
    content: {
      en: {
        title: "Unix timestamp converter: how Unix time works",
        desc: "Understand Unix time, why developers store timestamps instead of dates, and how to convert seconds or milliseconds to a human-readable date.",
        intro:
          "A Unix timestamp is the number of seconds that have passed since 1 January 1970 00:00:00 UTC (the Unix epoch). Developers store this number instead of a date because it is unambiguous across time zones and easy to compare.",
        blocks: [
          {
            h2: "Why timestamps not dates?",
            paragraphs: [
              "A string like '25/09/2026' is ambiguous — is it September 25th or 25th of September? A timestamp has no time zone, no format and no locale, so it travels between servers and languages without misinterpretation. Databases, JWT tokens and API logs all use them.",
            ],
          },
          {
            h2: "Convert with FreetoolsY",
            paragraphs: [
              "Paste a Unix timestamp into the Unix Timestamp Converter. It reads seconds, milliseconds and microseconds, shows the UTC time and your local time, and includes a copy-friendly ISO string for logs and tests.",
            ],
            bullets: [
              "Convert back and forth: date to timestamp works too.",
              "Check whether the source used seconds (10 digits) or milliseconds (13 digits).",
              "Use the 'now' button to capture the current moment exactly.",
            ],
          },
          {
            h2: "Common mistakes",
            paragraphs: [
              "The most frequent bug is a missing zero: multiplying seconds by 1000 in JavaScript (or dividing by 1000 in other languages) turns a valid timestamp into a far-future or far-past date. The Date Difference tool helps verify the span between two such moments.",
            ],
          },
        ],
      },
      tr: {
        title: "Unix zaman damgası dönüştürücü: Unix saat nasıl çalışır?",
        desc: "Unix zamanını, geliştiricilerin tarih yerine neden zaman damgası sakladığını ve saniye veya milisaniyeyi okunabilir tarihe nasıl çevireceğinizi öğrenin.",
        intro:
          "Unix zaman damgası, 1 Ocak 1970 00:00:00 UTC'den (Unix epoch) bu yana geçen saniye sayısıdır. Geliştiriciler bunu tarih yerine saklar çünkü saat dilimleri arasında belirsizlik yaratmaz ve karşılaştırması kolaydır.",
        blocks: [
          {
            h2: "Neden tarih değil zaman damgası?",
            paragraphs: [
              "'25/09/2026' gibi bir metin belirsizdir — 25 Eylül mü, yoksa 25'inci Eylül mü? Zaman damgasının saat dilimi, formatı ve yereli yoktur; bu yüzden sunucular ve diller arasında yanlış anlaşılmadan dolaşır. Veritabanları, JWT token'ları ve API logları hep bunları kullanır.",
            ],
          },
          {
            h2: "FreetoolsY ile dönüştürün",
            paragraphs: [
              "Unix zaman damgasını Unix Zaman Damgası Dönüştürücü'ye yapıştırın. Saniye, milisaniye ve mikrosaniyeyi okur; UTC saatini ve yerel saatinizi gösterir; log ve testler için kopyalanabilir ISO metni sunar.",
            ],
            bullets: [
              "Ters yön de çalışır: tarihten zaman damgası üretebilirsiniz.",
              "Kaynağın saniye (10 hane) mi milisaniye (13 hane) mi kullandığını kontrol edin.",
              "'Şimdi' butonuyla anın tam değerini yakalayın.",
            ],
          },
          {
            h2: "Sık yapılan hatalar",
            paragraphs: [
              "En yaygın hata sıfır eklemektir: JavaScript'te saniye değerini 1000 ile çarpmak (veya başka dillerde 1000'e bölmek) geçerli bir zaman damgasını uzak geleceğe ya da uzak geçmişe taşır. Tarih Farkı aracı, iki an arasındaki süreyi doğrulamaya yardımcı olur.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "json-vs-csv-when-to-use",
    relatedTools: ["json-csv-converter", "json-formatter"],
    content: {
      en: {
        title: "JSON vs CSV: which format should you use?",
        desc: "Compare JSON and CSV for data exchange, import or export, and convert between both formats without losing structure.",
        intro:
          "JSON and CSV are the two most common formats for moving tabular data between applications. CSV is a simple grid of rows and columns; JSON is a nested, typed structure. Each is better for different jobs.",
        blocks: [
          {
            h2: "CSV: simple and universal",
            paragraphs: [
              "CSV is a plain-text table. Spreadsheets, database tools and practically every import feature read it, which makes it ideal for exporting reports or moving data between systems. The weakness: no nesting, no types, and no obvious way to represent a hierarchy or an empty cell vs a missing value.",
            ],
          },
          {
            h2: "JSON: structure and types",
            paragraphs: [
              "JSON supports objects, arrays, numbers, booleans and null, so it mirrors how applications actually think about data. It is the default for APIs and configuration. The weakness: it is verbose, and flattening a deep structure into a spreadsheet takes extra work.",
            ],
            bullets: [
              "Use CSV when a human will open it in Excel or Google Sheets.",
              "Use JSON when an API, config or frontend consumes the data.",
            ],
          },
          {
            h2: "Convert between them",
            paragraphs: [
              "The Json Csv Converter flattens a JSON array of objects into CSV columns, or rebuilds the nested structure back from CSV. Combine it with the Json Formatter to inspect the structure first — formatting before converting reveals exactly how the rows will map.",
            ],
          },
        ],
      },
      tr: {
        title: "JSON vs CSV: hangi formatı kullanmalısınız?",
        desc: "Veri değişimi, içe/dışa aktarma için JSON ve CSV'yi karşılaştırın ve yapıyı bozmadan iki format arasında dönüştürün.",
        intro:
          "JSON ve CSV, uygulamalar arasında tablo verisi taşımak için en yaygın iki formattır. CSV, satır ve sütunlardan oluşan basit bir ızgaradır; JSON ise iç içe, tipli bir yapıdır. Her biri farklı işler için daha iyidir.",
        blocks: [
          {
            h2: "CSV: basit ve evrensel",
            paragraphs: [
              "CSV, düz metin tablosudur. Elektronik tablolar, veritabanı araçları ve neredeyse tüm içe aktarma özellikleri onu okur; rapor dışa aktarmak veya veriyi sistemler arasında taşımak için idealdir. Zayıflığı: iç içelik, tipler yoktur; hiyerarşiyi veya boş hücreyle eksik değer arasındaki farkı temsil etmek zordur.",
            ],
          },
          {
            h2: "JSON: yapı ve tipler",
            paragraphs: [
              "JSON; nesneleri, dizileri, sayıları, boolean'ları ve null'u destekler; böylece uygulamaların veriyi gerçekte nasıl düşündüğünü yansıtır. API'ler ve yapılandırma için varsayılandır. Zayıflığı: hızlı büyür ve derin bir yapıyı elektronik tabloya düzleştirmek ekstra iş gerektirir.",
            ],
            bullets: [
              "Veriyi bir insan Excel veya Google Sheets'te açacaksa CSV kullanın.",
              "Veriyi bir API, yapılandırma veya frontend tüketecekse JSON kullanın.",
            ],
          },
          {
            h2: "İkisi arasında dönüştürme",
            paragraphs: [
              "JSON CSV Dönüştürücü, JSON nesne dizisini CSV sütunlarına düzleştirir veya iç içe yapıyı CSV'den geri kurar. Önce JSON Formatlayıcı ile yapıyı inceleyin — dönüştürmeden önce biçimlendirmek satırların nasıl eşleşeceğini gösterir.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-convert-color-formats",
    relatedTools: ["color-converter", "color-palette-generator", "image-color-picker"],
    content: {
      en: {
        title: "How to convert hex, RGB and HSL colors",
        desc: "Convert between hex, RGB and HSL, pick colors from images, and generate harmonious palettes with FreetoolsY.",
        intro:
          "Designers and developers switch between color formats constantly: hex in CSS, RGB in code, HSL when tweaking hue and lightness. Converting between them by hand is error-prone; a converter does it instantly with exact values.",
        blocks: [
          {
            h2: "The common formats",
            paragraphs: [
              "Hex (#2563EB) is compact and CSS-friendly. RGB (37, 99, 235) separates red, green and blue channels. HSL (222, 82%, 53%) describes the same color by hue, saturation and lightness, which makes adjustments like 'slightly darker' trivial.",
            ],
          },
          {
            h2: "Convert and sample with FreetoolsY",
            paragraphs: [
              "Paste any color format into the Color Converter to see it in all the others at once. Need a color that is inside an image? Open Image Color Picker, click any pixel and copy its code. To build a whole palette, start from one flat color and let the Palette Generator propose harmonious variations.",
            ],
          },
          {
            h2: "Keep your palette consistent",
            paragraphs: [
              "Save every brand color in one place — a hex dashboard — and reference it everywhere. Small shifts in lightness change perceived color more than small shifts in hue, so prefer HSL when you tune a shade.",
            ],
          },
        ],
      },
      tr: {
        title: "HEX, RGB ve HSL renkleri nasıl dönüştürülür?",
        desc: "HEX, RGB ve HSL arasında dönüştürme yapın, görsellerden renk seçin ve FreetoolsY ile uyumlu paletler üretin.",
        intro:
          "Tasarımcılar ve geliştiriciler renk formatları arasında sürekli geçiş yapar: CSS'te hex, kodda RGB, ton ve parlaklığı ayarlarken HSL. Elle dönüştürme hataya açıktır; bir çevirici tam değerlerle anında sonuç verir.",
        blocks: [
          {
            h2: "Yaygın formatlar",
            paragraphs: [
              "HEX (#2563EB) kompakt ve CSS uyumludur. RGB (37, 99, 235) kırmızı, yeşil ve mavi kanalları ayırır. HSL (222, 82%, 53%) aynı rengi ton, doygunluk ve parlaklıkla tanımlar; 'biraz daha koyu' gibi ayarlamaları kolaylaştırır.",
            ],
          },
          {
            h2: "FreetoolsY ile dönüştürün ve örnekleyin",
            paragraphs: [
              "Herhangi bir renk formatını Renk Dönüştürücü'ye yapıştırın; hepsini aynı anda görün. Görselin içindeki bir renk mi gerekiyor? Görselden Renk Seç'i açın, herhangi bir piksele tıklayın ve kodunu kopyalayın. Bütün bir palet için tek bir düz renkten başlayın; Palet Oluşturucu uyumlu varyasyonlar önersin.",
            ],
          },
          {
            h2: "Paletinizi tutarlı tutun",
            paragraphs: [
              "Her marka rengini tek yerde — bir hex panosunda — saklayın ve her yerde ona atıfta bulunun. Parlaklıktaki küçük kaymalar, ton farklarından daha fazla algısal değişim yaratır; bu yüzden ton ayarlarken HSL'yi tercih edin.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "how-to-check-color-contrast-wcag",
    relatedTools: ["wcag-contrast-checker", "color-converter"],
    content: {
      en: {
        title: "How to check color contrast for WCAG accessibility",
        desc: "Test foreground/background contrast for WCAG AA and AAA, and make sure every visitor can read your interface.",
        intro:
          "Color contrast is the difference in brightness between text and its background. When it is too low, many users cannot read the content. WCAG defines concrete ratios — 4.5:1 for normal text, 3:1 for large text — and a checker tells you in seconds whether a pair passes.",
        blocks: [
          {
            h2: "The ratios that matter",
            paragraphs: [
              "WCAG AA requires 4.5:1 for normal-size text and 3:1 for large text (18px+ or 14px bold). AAA raises the bars to 7:1 and 4.5:1. Interfaces that pass these ratios are readable for people with low vision and in sunlight.",
            ],
            bullets: [
              "AA: minimum for public sites.",
              "AAA: the stricter standard for text-heavy content.",
              "Graphic elements and icons need 3:1 as well.",
            ],
          },
          {
            h2: "Check a pair with FreetoolsY",
            paragraphs: [
              "Enter your foreground and background colors into the WCAG Contrast Checker. It computes the exact ratio and instantly marks whether the pair passes AA or AAA. Adjust the values live until a pair you like is compliant — no guessing.",
            ],
          },
          {
            h2: "Design with contrast first",
            paragraphs: [
              "Pick text and background colors from the same palette, then verify before you ship the component. Combine the Contrast Checker with the Color Converter to test the exact hex values your CSS uses.",
            ],
          },
        ],
      },
      tr: {
        title: "WCAG erişilebilirliği için renk kontrastı nasıl kontrol edilir?",
        desc: "Metin ve zemin arasındaki kontrastı WCAG AA ve AAA için test edin; her ziyaretçinin arayüzünüzü okuyabildiğinden emin olun.",
        intro:
          "Renk kontrastı, metin ile zemini arasındaki parlaklık farkıdır. Çok düşük olduğunda birçok kullanıcı içeriği okuyamaz. WCAG somut oranlar tanımlar — normal metin için 4.5:1, büyük metin için 3:1 — ve bir denetleyici saniyeler içinde çiftin geçerli olup olmadığını söyler.",
        blocks: [
          {
            h2: "Önemli oranlar",
            paragraphs: [
              "WCAG AA, normal boyutlu metin için 4.5:1, büyük metin için (18px+ veya 14px koyu) 3:1 ister. AAA çıtayı 7:1 ve 4.5:1'e yükseltir. Bu oranları geçen arayüzler düşük görüşlü kişiler ve gün ışığında okunabilir.",
            ],
            bullets: [
              "AA: herkese açık siteler için minimum.",
              "AAA: metin ağırlıklı içerik için daha katı standart.",
              "Grafik öğeler ve ikonlar da 3:1 gerektirir.",
            ],
          },
          {
            h2: "FreetoolsY ile bir çifti test edin",
            paragraphs: [
              "WCAG Kontrast Denetleyici'ye metin ve zemin renginizi girin. Tam oranı hesaplar ve çiftin AA veya AAA'yı geçip geçmediğini anında gösterir. Sevdiğiniz çift uyumlu olana kadar değerleri canlı ayarlayın — tahmin yok.",
            ],
          },
          {
            h2: "Önce kontrastla tasarlayın",
            paragraphs: [
              "Metin ve zemin renklerini aynı paletten seçin, ardından bileşeni yayınlamadan önce doğrulayın. Kontrast Denetleyici'yi Renk Dönüştürücü ile birleştirip CSS'inizde kullandığınız tam hex değerlerini test edin.",
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