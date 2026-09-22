import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import Base64Encoder from "@/components/tools/Base64Encoder";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder — Ücretsiz Online Araç",
  description:
    "Metni Base64'e çevirin veya Base64 verisini çözün. UTF-8 / Unicode desteğiyle ücretsiz çevrimiçi kodlama aracı.",
  alternates: { canonical: "/araclar/base64" },
};

export default function Base64Page() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-text">
          Ana sayfa
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link href="/#gelistirici" className="transition-colors hover:text-text">
          Geliştirici
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">Base64 Encoder/Decoder</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Base64 Encoder/Decoder — Ücretsiz Online Araç
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          Geliştirici
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        Metni Base64 biçimine kodlayın ya da Base64 verisini çözerek özgün
        içeriğe dönüştürün.
      </p>

<AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <Base64Encoder />
      </div>

      <AdSlot slot="bottom" />

      <section className="mt-10 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Base64 Encoder/Decoder Nedir?
        </h2>
        <p className="mt-3">
          Base64 Encoder/Decoder, ikili veriyi (binary) ASCII karakterlere
          dönüştürmek ve dönüştürülmüş veriyi tekrar özgün hâline çevirmek
          için kullanılan ücretsiz bir online geliştirici aracıdır. Girdi
          kutusuna metninizi yazın, Encode düğmesine basın; metin, +
          işaretleriyle temsil edilen ve yalnızca yazdırılabilir karakterlerden
          oluşan bir Base64 dizesine çevrilir. Elinizdeki Base64 verisini
          çözmek istiyorsanız Decode düğmesini kullanın.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Base64 nerede kullanılır?
        </h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>
            E-posta ekleri: MIME standardı, ekleri Base64 ile kodlanmış biçimde
            taşır.
          </li>
          <li>
            Veri URI: Resim ve küçük dosyalar{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5">data:image/png;base64,…</code>{" "}
            olarak HTML&apos;e gömülebilir.
          </li>
          <li>
            API kimlik doğrulama: Basic Authentication, kullanıcı adı ve
            parolayı Base64 ile kodlar.
          </li>
          <li>
            JSON içinde ikili veri taşıma: Metin olmayan alanlar Base64&apos;e
            çevrilerek saklanır.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-text">
          Türkçe ve Unicode desteği var mı?
        </h3>
        <p className="mt-3">
          Evet. Araç metni önce UTF-8 olarak kodlar, ardından Base64&apos;e çevirir.
          Bu sayede Türkçe karakterler (ç, ğ, ı, ö, ş, ü), emojiler ve farklı
          alfabeler bozulmadan kodlanır ve doğru şekilde geri çözülür. Base64
          biçimi sadece ASCII içerdiğinden her platformda sorunsuz taşınır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Base64 şifreleme midir?
        </h3>
        <p className="mt-3">
          Hayır. Base64 bir şifreleme değil, kodlama biçimidir. Veriyi gizli
          tutmaz; yalnızca taşınabilir ve yazdırılabilir bir formata çevirir.
          Bu yüzden parola ya da özel bilgileri yalnızca Base64 ile korumak
          güvenli değildir. Hassas veriler için gerçek şifreleme
          yöntemleri kullanılmalıdır.
        </p>
        <h3 className="mt-6 text-base font-semibold text-text">
          Verileriniz güvende midir?
        </h3>
        <p className="mt-3">
          Evet. Encode ve Decode işlemleri tamamen tarayıcınızda gerçekleşir;
          veriniz hiçbir sunucuya gönderilmez ya da saklanmaz. Üyelik yok,
          kurulum yok; ücretsizdir.
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-muted">
        Oluşturduğun içeriği paylaşmak için{" "}
        <a
          href="https://linkly.hub"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent transition-opacity hover:opacity-80"
        >
          linkly.hub
        </a>{" "}
        adresini dene
      </p>
    </main>
  );
}