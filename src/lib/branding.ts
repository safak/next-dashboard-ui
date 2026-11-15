import "server-only";
import path from "path";

// The school's uploaded logo lives next to the study materials, outside
// /public, so each copy of the system can have its own
export const brandingDir = () =>
  process.env.BRANDING_DIR || path.join(process.cwd(), "storage", "branding");

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

// SVG is left out: it can carry scripts
export const LOGO_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export const isHexColor = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);
