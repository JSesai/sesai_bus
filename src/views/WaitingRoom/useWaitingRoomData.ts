import { useState, useEffect, useCallback, useRef } from "react";

const REFRESH_INTERVAL = 15000;

export function useWaitingRoomData() {
  const [departures, setDepartures] = useState<DepartureBoardData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDepartures = useCallback(async () => {
    try {
      const result = await window.electron.waitingRoom.getTodayDepartures();
      if (result.ok && result.data) {
        setDepartures(result.data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Error fetching departures:", err);
    }
  }, []);

  useEffect(() => {
    fetchDepartures();
    intervalRef.current = setInterval(fetchDepartures, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchDepartures]);

  return { departures, lastUpdate, refresh: fetchDepartures };
}
