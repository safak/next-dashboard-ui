import QRCode from "qrcode";

export async function generateQrSvg(url: string): Promise<string> {
  try {
    return await QRCode.toString(url, {
      type: "svg",
      margin: 0,
      color: {
        dark: "#000000",      // black
        light: "#ffffff00",   // transparent white (valid hex, not string "transparent")
      },
    });
  } catch (err) {
    console.error("QR generation error:", err);
    throw err;
  }
}
