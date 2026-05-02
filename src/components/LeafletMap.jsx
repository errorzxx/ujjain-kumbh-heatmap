import React, { useEffect, useRef, useState } from "react";
import { TYPE_COLORS, getSeverity } from "../data/zones";

const R = {
  olive:"#55663A", moss:"#6F7F4E", cream:"#F5F1E6",
  brown:"#7A5A3B", charcoal:"#282B2B", border:"#C8BFB0", cardBg:"#FDFAF5",
};

const TILE_LAYERS = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    label: "Standard",
  },
  tactical: {
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attr: '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    label: "Tactical (Dark)",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "© Esri — Source: Esri, Maxar, Earthstar Geographics",
    label: "Satellite",
  },
};

export default function LeafletMap({ crowdData, heatPoints }) {
  const mapRef      = useRef(null);
  const mapObjRef   = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef  = useRef([]);
  const tileRef     = useRef(null);
  const [tileKey, setTileKey]       = useState("tactical");
  const [selected, setSelected]     = useState(null);
  const [leafletReady, setLeafletReady] = useState(false);

  // Dynamically load Leaflet + leaflet.heat from CDN (no npm issues)
  useEffect(() => {
    if (window.L && window.L.heatLayer) { setLeafletReady(true); return; }

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(cssLink);

    const script1 = document.createElement("script");
    script1.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script1.onload = () => {
      const script2 = document.createElement("script");
      script2.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
      script2.onload = () => setLeafletReady(true);
      document.head.appendChild(script2);
    };
    document.head.appendChild(script1);
  }, []);

  // Init map once Leaflet is ready
  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapObjRef.current) return;
    const L   = window.L;
    const map = L.map(mapRef.current, {
      center: [23.1765, 75.7885],
      zoom: 14,
      zoomControl: true,
    });

    const tile = TILE_LAYERS[tileKey];
    tileRef.current = L.tileLayer(tile.url, { attribution: tile.attr, maxZoom: 19 }).addTo(map);
    mapObjRef.current = map;

    // Initial heatmap layer
    heatLayerRef.current = L.heatLayer([], {
      radius: 45,
      blur: 30,
      maxZoom: 17,
      gradient: { 0.0:"#27AE60", 0.4:"#F1C40F", 0.65:"#E67E22", 0.85:"#C0392B", 1.0:"#7B0000" },
    }).addTo(map);
  }, [leafletReady]);

  // Update tile layer on toggle
  useEffect(() => {
    if (!mapObjRef.current || !window.L) return;
    const L = window.L;
    if (tileRef.current) { tileRef.current.remove(); }
    const tile = TILE_LAYERS[tileKey];
    tileRef.current = L.tileLayer(tile.url, { attribution: tile.attr, maxZoom: 19 })
      .addTo(mapObjRef.current);
  }, [tileKey]);

  // Update heatmap points
  useEffect(() => {
    if (!heatLayerRef.current || !heatPoints.length) return;
    heatLayerRef.current.setLatLngs(heatPoints);
  }, [heatPoints]);

  // Update markers
  useEffect(() => {
    if (!mapObjRef.current || !window.L || !crowdData.length) return;
    const L = window.L;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    crowdData.forEach(zone => {
      const sev   = zone.severity;
      const color = TYPE_COLORS[zone.type] || R.olive;

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            width:14px;height:14px;border-radius:50%;
            background:${sev.color};border:2.5px solid #fff;
            box-shadow:0 0 6px ${sev.color}88;
          "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon })
        .addTo(mapObjRef.current)
        .on("click", () => setSelected(zone));

      markersRef.current.push(marker);
    });
  }, [crowdData]);

  return (
    <div style={{ position:"relative", height:"100%", minHeight:480 }}>
      {/* Tile toggle */}
      <div style={s.toggle}>
        {Object.entries(TILE_LAYERS).map(([k, v]) => (
          <button key={k} onClick={() => setTileKey(k)}
            style={{ ...s.toggleBtn,
              background: tileKey===k ? R.olive : "rgba(40,43,43,0.88)",
              color:      tileKey===k ? R.cream : "#aaa",
              borderColor:tileKey===k ? R.moss  : "transparent",
            }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div ref={mapRef} style={{ width:"100%", height:"100%", minHeight:480 }} />

      {!leafletReady && (
        <div style={s.loader}>
          <span style={{ color:R.olive, fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:14 }}>
            Loading Ujjain Map...
          </span>
        </div>
      )}

      {/* Info popup */}
      {selected && (
        <div style={s.popup}>
          <div style={{ ...s.popHead, background: selected.severity.color }}>
            <span style={s.popName}>{selected.name}</span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={s.popBadge}>{selected.severity.label}</span>
              <button onClick={() => setSelected(null)} style={s.popClose}>✕</button>
            </div>
          </div>
          <div style={s.popBody}>
            {[
              ["Zone Type",      selected.type.toUpperCase()],
              ["Crowd Density",  Math.round(selected.density * 100) + "%"],
              ["Est. People",    "~" + selected.estimatedPeople.toLocaleString("en-IN")],
              ["Max Capacity",   selected.maxCapacity.toLocaleString("en-IN")],
              ["Occupancy",      Math.round((selected.estimatedPeople / selected.maxCapacity) * 100) + "%"],
              ["Priority",       selected.priority.toUpperCase()],
            ].map(([k, v]) => (
              <div key={k} style={s.popRow}>
                <span style={s.popLabel}>{k}</span>
                <span style={s.popVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  toggle: {
    position:"absolute", top:10, left:10, zIndex:1000,
    display:"flex", gap:6,
    background:"rgba(40,43,43,0.9)", padding:5, borderRadius:8,
  },
  toggleBtn: {
    padding:"5px 12px", borderRadius:5,
    border:"1.5px solid", cursor:"pointer",
    fontSize:11, fontFamily:"'Poppins',sans-serif",
    fontWeight:600, letterSpacing:"0.3px",
  },
  loader: {
    position:"absolute", inset:0,
    display:"flex", alignItems:"center", justifyContent:"center",
    background:"#EEF2E8", zIndex:500,
  },
  popup: {
    position:"absolute", bottom:20, right:10, zIndex:1000,
    width:230, borderRadius:10, overflow:"hidden",
    boxShadow:"0 4px 20px rgba(0,0,0,0.25)",
    border:`1px solid ${R.border}`,
  },
  popHead: {
    padding:"10px 12px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
  },
  popName:  { fontSize:13, fontWeight:700, color:"#fff", fontFamily:"'Poppins',sans-serif", flex:1 },
  popBadge: { fontSize:9, fontWeight:700, color:"#fff", background:"rgba(0,0,0,0.25)", padding:"2px 6px", borderRadius:3, letterSpacing:"0.5px" },
  popClose: { background:"transparent", border:"none", color:"#fff", cursor:"pointer", fontSize:14, padding:"0 0 0 8px", lineHeight:1 },
  popBody:  { background:R.cardBg, padding:"10px 12px" },
  popRow:   { display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:`1px solid ${R.border}`, fontSize:11 },
  popLabel: { color:R.brown },
  popVal:   { color:R.charcoal, fontWeight:600 },
};
