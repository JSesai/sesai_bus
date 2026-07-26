import Store from "electron-store";

const store = new Store();

export const licenseStore = {
  set(license: License) {
    store.set("license.active", license);
  },

  get(): License | null {
    const license = store.get("license.active") as License | undefined;
    return license ?? null;
  },

  has(): boolean {
    return store.has("license.active");
  },

  clear() {
    store.delete("license.active");
  },
};
