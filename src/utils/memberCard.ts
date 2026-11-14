import { site } from "@/config/site";
import { jpegToPdf, saveBlob } from "./pdf";
import { env } from "@/lib/env";

/** The member ID card: one drawing used by the preview on /member-id, the downloads there, the public list of issued cards and the admin panel. */

/** Card is drawn at CR80 proportions (85.6 x 54 mm) on a canvas, so the preview, the JPG and the PDF are the same picture. */
export const W = 1012,
  H = 638,
  SCALE = 2;

export interface CardData {
  name: string;
  role: string;
  phone: string;
  blood: string;
  valid: string;
  photo: HTMLImageElement | null;
  id: string;
  /** leave the phone number and blood group off: for a card downloaded by someone other than its holder or an admin */ hidePrivate?: boolean;
}

/** `cors`: needed for a picture from another address (the photo storage) that is drawn on a canvas which is then saved. */
export const loadImage = (src: string, cors = false) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    if (cors) i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
export const fmtDate = (v: string) => {
  const d = new Date(v);
  return isNaN(+d) ? v : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
/** Largest font (down to `min`) at which `text` fits in `max` px; leaves the context font set. */
function fit(c: CanvasRenderingContext2D, text: string, weight: number, size: number, min: number, max: number, family: string) {
  let s = size;
  for (; s > min; s -= 2) {
    c.font = `${weight} ${s}px ${family}`;
    if (c.measureText(text).width <= max) break;
  }
  c.font = `${weight} ${s}px ${family}`;
}

export function draw(canvas: HTMLCanvasElement, d: CardData, logo: HTMLImageElement | null) {
  const c = canvas.getContext("2d");
  if (!c) return;
  const F = "Poppins, 'Noto Sans Devanagari', system-ui, sans-serif";
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  c.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  c.clearRect(0, 0, W, H);
  // a JPG has no transparency: without this the four corners outside the rounded card come out black in the download
  c.fillStyle = "#fff";
  c.fillRect(0, 0, W, H);

  // body: light card with a blue header band and a blue footer strip
  c.save();
  rr(c, 0, 0, W, H, 36);
  c.clip();
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#ffffff");
  bg.addColorStop(1, "#eaf3fd");
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);
  // soft decoration behind the details
  c.fillStyle = "rgba(20,121,209,.06)";
  c.beginPath();
  c.arc(W - 30, H - 120, 210, 0, 7);
  c.fill();
  c.fillStyle = "rgba(56,189,248,.10)";
  c.beginPath();
  c.arc(W - 150, H - 10, 130, 0, 7);
  c.fill();

  // header band
  const hb = c.createLinearGradient(0, 0, W, 0);
  hb.addColorStop(0, "#08305f");
  hb.addColorStop(0.6, "#0b4f9c");
  hb.addColorStop(1, "#1479d1");
  c.fillStyle = hb;
  c.fillRect(0, 0, W, 150);
  c.fillStyle = "rgba(255,255,255,.07)";
  c.beginPath();
  c.arc(W - 60, 20, 140, 0, 7);
  c.fill();
  c.fillStyle = "#38bdf8";
  c.fillRect(0, 150, W, 5);
  if (logo) {
    const h = 74,
      w = (h * logo.width) / logo.height;
    c.fillStyle = "#fff";
    rr(c, 30, 22, w + 36, h + 28, 22);
    c.fill();
    c.drawImage(logo, 48, 35, w, h);
  }
  c.textAlign = "right";
  c.textBaseline = "middle";
  c.fillStyle = "#fff";
  c.font = `700 32px ${F}`;
  c.fillText("MEMBER ID CARD", W - 40, 62);
  c.fillStyle = "rgba(255,255,255,.8)";
  c.font = `500 18px ${F}`;
  c.fillText(site.regLine, W - 40, 100);

  // photo, overlapping the header
  const px = 52,
    py = 112,
    pw = 226,
    ph = 282;
  c.save();
  c.shadowColor = "rgba(6,26,54,.35)";
  c.shadowBlur = 24;
  c.shadowOffsetY = 8;
  c.fillStyle = "#fff";
  rr(c, px - 8, py - 8, pw + 16, ph + 16, 28);
  c.fill();
  c.restore();
  c.save();
  rr(c, px, py, pw, ph, 22);
  c.clip();
  if (d.photo) {
    const s = Math.max(pw / d.photo.width, ph / d.photo.height),
      iw = d.photo.width * s,
      ih = d.photo.height * s;
    c.drawImage(d.photo, px + (pw - iw) / 2, py + (ph - ih) / 3, iw, ih);
  } else {
    c.fillStyle = "#dbe7f5";
    c.fillRect(px, py, pw, ph);
    c.fillStyle = "#9db6d3";
    c.beginPath();
    c.arc(px + pw / 2, py + 108, 52, 0, 7);
    c.fill();
    c.beginPath();
    c.ellipse(px + pw / 2, py + 245, 90, 80, 0, 0, 7);
    c.fill();
  }
  c.restore();
  // id pill under the photo
  const idText = d.id || "ID: ----";
  c.font = `600 17px ${F}`;
  const iw2 = Math.min(c.measureText(idText).width + 36, pw + 16);
  c.fillStyle = "#0b4f9c";
  rr(c, px + pw / 2 - iw2 / 2, py + ph + 30, iw2, 40, 20);
  c.fill();
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = "#fff";
  c.fillText(idText, px + pw / 2, py + ph + 51);

  // details
  const tx = 330,
    tw = W - tx - 44;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillStyle = "#08305f";
  fit(c, d.name || "Your Name", 700, 52, 28, tw, F);
  c.fillText(d.name || "Your Name", tx, 224);
  const role = d.role || "Role";
  c.font = `600 22px ${F}`;
  const rw = Math.min(c.measureText(role).width + 44, tw);
  c.fillStyle = "#e3f1fd";
  rr(c, tx, 246, rw, 44, 22);
  c.fill();
  c.strokeStyle = "#38bdf8";
  c.lineWidth = 2;
  rr(c, tx, 246, rw, 44, 22);
  c.stroke();
  c.fillStyle = "#0b4f9c";
  fit(c, role, 600, 22, 14, rw - 44, F);
  c.textBaseline = "middle";
  c.fillText(role, tx + 22, 269);

  c.strokeStyle = "rgba(11,79,156,.18)";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(tx, 322);
  c.lineTo(tx + tw, 322);
  c.stroke();
  const rows: [string, string][] = d.hidePrivate
    ? [
        ["MEMBER ID", d.id || "-"],
        ["VALID TILL", d.valid ? fmtDate(d.valid) : "-"]
      ]
    : [
        ["PHONE", d.phone || "-"],
        ["BLOOD GROUP", d.blood || "-"],
        ["VALID TILL", d.valid ? fmtDate(d.valid) : "-"]
      ];
  const colW = tw / 2;
  rows.forEach(([k, v], i) => {
    const x = tx + (i % 2) * colW,
      y = 366 + Math.floor(i / 2) * 92;
    c.fillStyle = "#1479d1";
    rr(c, x, y - 18, 5, 62, 2.5);
    c.fill();
    c.textBaseline = "alphabetic";
    c.fillStyle = "#5b6b82";
    c.font = `600 15px ${F}`;
    c.fillText(k, x + 18, y);
    c.fillStyle = "#08305f";
    fit(c, v, 600, 28, 16, colW - 30, F);
    c.fillText(v, x + 18, y + 36);
  });

  // footer
  const fb = c.createLinearGradient(0, 0, W, 0);
  fb.addColorStop(0, "#08305f");
  fb.addColorStop(1, "#1479d1");
  c.fillStyle = fb;
  c.fillRect(0, H - 56, W, 56);
  c.textBaseline = "middle";
  c.textAlign = "left";
  c.fillStyle = "#fff";
  c.font = `600 19px ${F}`;
  c.fillText(site.name, 40, H - 28);
  c.textAlign = "right";
  c.fillStyle = "rgba(255,255,255,.85)";
  c.font = `500 17px ${F}`;
  c.fillText(site.website, W - 40, H - 28);
  c.restore();
}

/** Storage bucket holding the applicants' photos (see supabase/migrations/20250127000000_member_card_photos.sql). */
export const MEMBER_PHOTOS = "member-photos";
export const memberPhotoUrl = (path: string) => `${env.supabaseUrl}/storage/v1/object/public/${MEMBER_PHOTOS}/${path}`;

/** The chosen photo as a small JPEG (at most 600 x 750), which is what gets sent with the application. */
export function photoForUpload(img: HTMLImageElement): Promise<Blob> {
  const k = Math.min(1, 600 / img.width, 750 / img.height),
    c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(img.width * k));
  c.height = Math.max(1, Math.round(img.height * k));
  const ctx = c.getContext("2d");
  if (!ctx) return Promise.reject(new Error("The photo could not be prepared."));
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("The photo could not be prepared."))), "image/jpeg", 0.85));
}

/** Draws a finished card on its own canvas, loading the logo, the fonts and the stored photo first so nothing is missing from the picture. */
export async function renderCard(d: Omit<CardData, "photo"> & { photoPath?: string | null }): Promise<HTMLCanvasElement> {
  const [logo, photo] = await Promise.all([
    loadImage("/assets/images/logo.png").catch(() => null),
    d.photoPath ? loadImage(memberPhotoUrl(d.photoPath), true).catch(() => null) : null,
    document.fonts?.load("700 20px Poppins").catch(() => null),
    document.fonts?.load("600 20px Poppins").catch(() => null),
    document.fonts?.load("500 20px Poppins").catch(() => null)
  ]);
  const canvas = document.createElement("canvas");
  draw(canvas, { ...d, photo }, logo);
  return canvas;
}

/** Saves a drawn card as "<name>-ID-Card.jpg" or ".pdf" (the PDF page is the size of a real card). */
export async function downloadCard(canvas: HTMLCanvasElement, name: string, kind: "jpg" | "pdf") {
  const b = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.95));
  if (!b) throw new Error("The card could not be created.");
  const file = `${(name.trim() || "member").replace(/[^\p{L}\p{N}_-]+/gu, "-")}-ID-Card.${kind}`;
  saveBlob(kind === "jpg" ? b : jpegToPdf(new Uint8Array(await b.arrayBuffer()), W * SCALE, H * SCALE, 242.65, 153.07), file);
}
