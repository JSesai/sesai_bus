declare module "jspdf" {
  class jsPDF {
    constructor(options: { orientation?: string; unit?: string; format?: number[] });
    setFontSize(size: number): void;
    setFont(family: string, style: string): void;
    text(text: string, x: number, y: number, options?: { align?: string }): void;
    setDrawColor(color: number): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    output(type: string): string;
  }
}
