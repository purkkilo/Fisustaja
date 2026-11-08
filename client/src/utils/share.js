import { copyText } from "./clipboard";

/** A router href ("/public-results/abc") as a full address to send to others. */
export function absoluteUrl(href, origin = window.location.origin) {
  return new URL(href, origin).toString();
}

/** Phones and tablets get the system share sheet; laptops copy the link. */
export function prefersShareSheet(nav = navigator, win = window) {
  return (
    typeof nav.share === "function" &&
    !!win.matchMedia?.("(pointer: coarse)").matches
  );
}

/**
 * Share or copy a link.
 * @returns {Promise<"shared"|"copied"|"cancelled"|"failed">}
 */
export async function shareLink({ url, title }) {
  if (prefersShareSheet()) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch (err) {
      if (err?.name === "AbortError") return "cancelled";
      // share sheet failed: copy instead
    }
  }
  return (await copyText(url)) ? "copied" : "failed";
}
