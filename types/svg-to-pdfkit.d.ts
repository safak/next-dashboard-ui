declare module "svg-to-pdfkit" {
  const SVGtoPDF: (
    doc: any,
    svg: string,
    x: number,
    y: number,
    options?: {
      width?: number;
      height?: number;
      preserveAspectRatio?: string;
    }
  ) => void;

  export default SVGtoPDF;
}
