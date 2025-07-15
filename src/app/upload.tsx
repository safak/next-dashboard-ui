import formidable, { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

// Désactive le body parser de Next.js pour cette route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadDir = path.join(process.cwd(), "/public/uploads");

  // S'assurer que le dossier existe
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext, part, form) => {
      return `${Date.now()}_${part.originalFilename}`;
    },
  });

  form.parse(req, (err, fields, files: formidable.Files) => {
  const uploadedFile = files.file?.[0];
  if (!uploadedFile) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const fileName = path.basename(uploadedFile.filepath);
  return res.status(200).json({ fileName });
});

}
