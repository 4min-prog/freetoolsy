export type ToastAction = "copy" | "download" | "sample";

export function showToast(action: ToastAction = "copy"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("freetoolsy:toast", { detail: { action } })
  );
}