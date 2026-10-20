export async function fileToBuffer(file: File) {
  const bytes = await file.arrayBuffer();

  return Buffer.from(bytes);
}