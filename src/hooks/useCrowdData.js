import { useState, useEffect, useRef, useCallback } from "react";
import { KUMBH_ZONES, getSeverity, getTimeMultiplier } from "../data/zones";

export function useCrowdData() {
  const tickRef = useRef(0);
  const [crowdData,    setCrowdData]    = useState([]);
  const [heatPoints,   setHeatPoints]   = useState([]);
  const [trendHistory, setTrendHistory] = useState(Array(30).fill(0.55));
  const [lastUpdated,  setLastUpdated]  = useState(new Date());
  const [isLive,       setIsLive]       = useState(true);

  const compute = useCallback(() => {
    tickRef.current += 1;
    const t   = tickRef.current;
    const mul = getTimeMultiplier();

    const data = KUMBH_ZONES.map((zone, i) => {
      const boost = zone.priority === "critical" ? 0.12
                  : zone.priority === "high"     ? 0.06 : 0;
      const wave  = Math.sin(t * 0.05 + i * 0.9) * 0.08
                  + Math.sin(t * 0.02 + i * 1.5) * 0.04;
      const noise = (Math.random() - 0.5) * 0.04;
      const density = Math.max(0.05, Math.min(0.98,
        mul * 0.68 + boost + wave + noise + 0.08
      ));
      const sev = getSeverity(density);
      return {
        ...zone,
        density,
        estimatedPeople: Math.round(density * zone.maxCapacity),
        severity: sev,
      };
    });

    // Build heatmap points: [lat, lng, intensity]
    const pts = [];
    data.forEach(z => {
      const count = Math.floor(z.density * 20) + 2;
      for (let i = 0; i < count; i++) {
        const spread = z.radius * 0.000009;
        const angle  = Math.random() * Math.PI * 2;
        pts.push([
          z.lat + Math.cos(angle) * spread * Math.random(),
          z.lng + Math.sin(angle) * spread * Math.random(),
          z.density,
        ]);
      }
    });

    const avg = data.reduce((s, z) => s + z.density, 0) / data.length;
    setTrendHistory(prev => [...prev.slice(1), avg]);
    setCrowdData(data);
    setHeatPoints(pts);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    compute();
    const id = setInterval(() => { if (isLive) compute(); }, 2000);
    return () => clearInterval(id);
  }, [isLive, compute]);

  return { crowdData, heatPoints, trendHistory, lastUpdated, isLive, setIsLive };
}
