// src/electron/session/sessionStore.ts
import Store from "electron-store";

const store = new Store();

export const sessionStore = {
  setToken(token: string) {
    store.set("session.token", token);
  },

  getToken(): string | null {
    return store.get("session.token") as string | null;
  },

  clear() {
    store.delete("session.token");
  },

  hasSession(): boolean {
    return store.has("session.token");
  }
};
