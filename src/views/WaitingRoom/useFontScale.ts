import { useState, useEffect, useCallback } from "react";

let globalScale = 1.45;

export function getFontScale() {
  return globalScale;
}

export function useFontScale() {
  const [scale, setScale] = useState(globalScale);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await window.electron.waitingRoom.getConfig();
        if (res.ok && res.data) {
          globalScale = res.data.fontScale;
          setScale(res.data.fontScale);
        }
      } catch {}
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const s = useCallback((px: number) => `${px * scale}px`, [scale]);

  return { scale, s };
}
