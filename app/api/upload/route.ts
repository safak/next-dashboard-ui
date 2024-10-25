import { NextRequest, NextResponse } from "next/server";
import path from 'path';
import fs from "fs";
export const POST = async (req: NextRequest) => {

  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as Blob) || null;

  // const relativeUploadDir = `/uploads/${new Date(Date.now())
  //   .toLocaleDateString("id-ID", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   })
  //   .replace(/\//g, "-")}`;

  const targetPath = path.join(process.cwd(), "public", `/uploads/`);

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }
    fs.writeFileSync(
      path.resolve(targetPath, (body.file as File).name),
      buffer
    );
  } else {
    return NextResponse.json({
      success: false,
    });
  }
  return NextResponse.json({
    success: true,
    name: process.env.ROOT_PATH + (body.file as File).name,
  });
};
