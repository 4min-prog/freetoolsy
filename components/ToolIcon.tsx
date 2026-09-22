import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAlignLeft,
  faCalculator,
  faCalendarDays,
  faCode,
  faFingerprint,
  faFont,
  faGaugeHigh,
  faHeartPulse,
  faHourglassHalf,
  faKey,
  faLink,
  faPalette,
  faPercent,
  faPuzzlePiece,
  faQrcode,
  faReceipt,
  faRightLeft,
  faRulerCombined,
  faShuffle,
  faTextWidth,
  faToolbox,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

const ICONS: Record<string, IconDefinition> = {
  "karakter-sayaci": faTextWidth,
  "kelime-sayaci": faAlignLeft,
  "harf-donusturucu": faFont,
  "sifre-uretici": faKey,
  "json-formatter": faCode,
  base64: faRightLeft,
  "url-encoder": faLink,
  "bmi-hesaplayici": faHeartPulse,
  "kdv-hesaplayici": faReceipt,
  "yuzde-hesaplayici": faPercent,
  "yas-hesaplayici": faCalendarDays,
  "qr-kod-olusturucu": faQrcode,
  "sha-hash-uretici": faFingerprint,
  "tarih-farki": faHourglassHalf,
  "renk-donusturucu": faPalette,
  "uuid-uretici": faShuffle,
  "birim-donusturucu": faRulerCombined,
  "parola-guc-testi": faGaugeHigh,
  "sayi-donusturucu": faCalculator,
  "regex-testi": faPuzzlePiece,
  "bosluk-temizleyici": faWandMagicSparkles,
};

export default function ToolIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <FontAwesomeIcon
      icon={ICONS[id] ?? faToolbox}
      className={className}
      aria-hidden="true"
    />
  );
}