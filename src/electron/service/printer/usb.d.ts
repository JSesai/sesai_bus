declare module "usb" {
  export interface UsbEndpoint {
    direction: "in" | "out";
    transfer(data: Buffer, callback: (err: Error | null) => void): void;
  }

  export interface UsbInterface {
    endpoints: UsbEndpoint[];
    claim(): void;
    release(asyncRelease?: boolean, callback?: (err?: Error | null) => void): void;
  }

  export interface UsbDevice {
    deviceDescriptor: {
      idVendor: number;
      idProduct: number;
      iManufacturer: number;
      iProduct: number;
      iSerialNumber: number;
    };
    configDescriptor: {
      interfaces: Array<Array<{ bInterfaceClass: number; bAlternateSetting: number }>>;
    };
    interfaces: UsbInterface[];
    open(): void;
    close(): void;
  }

  const usb: {
    getDeviceList(): UsbDevice[];
    findByIds(vid: number, pid: number): UsbDevice | undefined;
  };

  export default usb;
}