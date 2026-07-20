declare module "escpos" {
  class Printer {
    constructor(device: any);
    align(value: string): Printer;
    text(value: string): Printer;
    feed(lines?: number): Printer;
    cut(): Printer;
    close(callback: () => void): void;
  }

  class USB {
    static findPrinter(): any[];
    open(callback: (err: Error | null) => void): void;
  }
}

declare module "escpos-usb" {
  const USB: {
    findPrinter(): any[];
    new (): { open(callback: (err: Error | null) => void): void };
  };
  export default USB;
}
