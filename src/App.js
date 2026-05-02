import React from "react";
import LeafletMap  from "./components/LeafletMap";
import StatsBar    from "./components/StatsBar";
import AlertPanel  from "./components/AlertPanel";
import TrendChart  from "./components/TrendChart";
import { useCrowdData } from "./hooks/useCrowdData";
import { Shield, Pause, Play, Download } from "lucide-react";

const R = {
  olive:"#55663A", moss:"#6F7F4E", cream:"#F5F1E6",
  stone:"#DBD2C4", brown:"#7A5A3B", charcoal:"#282B2B",
  crit:"#C0392B",  high:"#E67E22", low:"#27AE60",
  cardBg:"#FDFAF5", border:"#C8BFB0",
};

export default function App() {
  const { crowdData, heatPoints, trendHistory, lastUpdated, isLive, setIsLive } = useCrowdData();

  const critCount = crowdData.filter(z => z.density >= 0.9).length;

  const exportCSV = () => {
    const hdr  = ["Zone","Type","Priority","Density%","Est.People","MaxCapacity","Status"];
    const rows = crowdData.map(z => [
      z.name, z.type, z.priority,
      Math.round(z.density*100), z.estimatedPeople, z.maxCapacity,
      z.severity.label,
    ]);
    const csv  = [hdr,...rows].map(r=>r.join(",")).join("\n");
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = `rakshix-kumbh-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={s.app}>
      {/* ── Navbar ── */}
      <div style={s.navbar}>
        <div style={s.brand}>
          <div style={s.logoBox}><Shield size={22} color={R.cream} strokeWidth={2.5}/></div>
          <div>
            <div style={s.brandName}>RAKSHIX</div>
            <div style={s.brandSub}>CIVIC SAFETY INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        <div style={s.navCenter}>
          <span style={s.missionTag}>🕉&nbsp; UJJAIN SIMHASTHA KUMBH — CROWD INTELLIGENCE SYSTEM</span>
        </div>

        <div style={s.navRight}>
          {critCount > 0 && (
            <div style={s.critBanner}>🔴 {critCount} CRITICAL ZONE{critCount>1?"S":""}</div>
          )}
          <button onClick={()=>setIsLive(v=>!v)}
            style={{...s.btnSec, color:isLive?R.crit:R.low, borderColor:isLive?R.crit:R.low}}>
            {isLive ? <Pause size={13}/> : <Play size={13}/>}
            {isLive ? "Pause Feed" : "Resume Feed"}
          </button>
          <button onClick={exportCSV} style={s.btnPri}>
            <Download size={13}/> Export Report
          </button>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div style={s.statusBar}>
        <div style={s.statusLeft}>
          <span style={{...s.liveDot, background: isLive ? R.low : R.brown}}/>
          <span style={s.stxt}>{isLive ? "LIVE MONITORING ACTIVE" : "FEED PAUSED"}</span>
          <span style={s.sdiv}>|</span>
          <span style={s.stxt}>Last sync: {lastUpdated.toLocaleTimeString("en-IN")}</span>
          <span style={s.sdiv}>|</span>
          <span style={s.stxt}>📍 Ujjain, Madhya Pradesh · Powered by OpenStreetMap — No API Key Required</span>
        </div>
        <div style={s.sevRow}>
          {[{c:R.crit,l:"Critical"},{c:R.high,l:"High"},{c:"#C7A500",l:"Medium"},{c:R.low,l:"Low"}].map(sv=>(
            <span key={sv.l} style={s.sevChip}>
              <span style={{...s.sevDot, background:sv.c}}/>
              <span style={s.stxt}>{sv.l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{padding:"14px 24px 0"}}>
        <StatsBar crowdData={crowdData}/>
      </div>

      {/* ── Main Grid ── */}
      <div style={s.mainGrid}>
        {/* Map panel */}
        <div style={s.mapPanel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>CROWD DENSITY MAP — REAL TIME</span>
            <span style={s.panelMeta}>OpenStreetMap · Leaflet Heatmap · {crowdData.length} Zones · FREE — No API Key</span>
          </div>
          <div style={{flex:1, minHeight:480}}>
            <LeafletMap crowdData={crowdData} heatPoints={heatPoints}/>
          </div>
        </div>

        {/* Sidebar */}
        <div style={s.sidebar}>
          <AlertPanel crowdData={crowdData}/>
          <TrendChart trendHistory={trendHistory}/>

          {/* Legend card */}
          <div style={s.legendCard}>
            <div style={s.legendHead}>DENSITY SCALE</div>
            <div style={s.gradBar}/>
            <div style={s.gradRow}>
              {["Clear","Low","Moderate","High","Critical"].map(l=>(
                <span key={l} style={s.gradLbl}>{l}</span>
              ))}
            </div>
            <div style={{borderTop:`1px solid ${R.border}`,paddingTop:10,marginTop:6}}>
              <div style={s.legendHead}>ZONE TYPES</div>
              <div style={s.typeRow}>
                {[
                  {c:"#C0392B",l:"Temple"},
                  {c:"#2980B9",l:"Ghat"},
                  {c:"#E67E22",l:"Transport"},
                  {c:"#8E44AD",l:"Market"},
                  {c:"#27AE60",l:"Entry"},
                  {c:R.brown,  l:"Parking"},
                ].map(t=>(
                  <span key={t.l} style={s.typeChip}>
                    <span style={{...s.typeDot, background:t.c}}/>
                    {t.l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={s.footer}>
        <span>RAKSHIX © 2025 — Civic Safety Intelligence · Madhya Pradesh Government</span>
        <span style={{color:R.brown}}>
          Map: © OpenStreetMap contributors · © Stadia Maps · © Esri &nbsp;|&nbsp;
          ⚠ Simulated data — connect live IoT/CCTV feeds for production
        </span>
      </div>
    </div>
  );
}

const s = {
  app:        { minHeight:"100vh", background:R.cream, color:R.charcoal, fontFamily:"'Inter',sans-serif", display:"flex", flexDirection:"column" },
  navbar:     { background:R.olive, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 24px", gap:16, borderBottom:`3px solid ${R.moss}` },
  brand:      { display:"flex", alignItems:"center", gap:12, flexShrink:0 },
  logoBox:    { width:42, height:42, borderRadius:8, background:R.moss, display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px solid rgba(245,241,230,0.3)" },
  brandName:  { fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:22, color:R.cream, letterSpacing:"3px" },
  brandSub:   { fontSize:8, color:"rgba(245,241,230,0.6)", letterSpacing:"1.8px", fontWeight:500 },
  navCenter:  { flex:1, display:"flex", justifyContent:"center" },
  missionTag: { fontSize:11, color:R.cream, fontFamily:"'Poppins',sans-serif", fontWeight:600, letterSpacing:"0.5px" },
  navRight:   { display:"flex", alignItems:"center", gap:10, flexShrink:0 },
  critBanner: { background:"#7B1717", color:"#FFD5D5", border:"1px solid #C0392B", borderRadius:6, padding:"5px 12px", fontSize:11, fontWeight:700 },
  btnPri:     { display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:R.cream, border:"none", borderRadius:6, color:R.olive, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Poppins',sans-serif" },
  btnSec:     { display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"transparent", border:"1.5px solid", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Poppins',sans-serif" },
  statusBar:  { background:R.charcoal, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 24px" },
  statusLeft: { display:"flex", alignItems:"center", gap:10 },
  liveDot:    { width:7, height:7, borderRadius:"50%", display:"inline-block" },
  stxt:       { fontSize:10, color:R.stone, letterSpacing:"0.8px", fontFamily:"monospace" },
  sdiv:       { color:"#555", fontSize:12 },
  sevRow:     { display:"flex", gap:16, alignItems:"center" },
  sevChip:    { display:"flex", alignItems:"center", gap:5 },
  sevDot:     { width:8, height:8, borderRadius:"50%" },
  mainGrid:   { display:"grid", gridTemplateColumns:"1fr 310px", gap:16, padding:"14px 24px", flex:1 },
  mapPanel:   { display:"flex", flexDirection:"column", background:R.cardBg, border:`1px solid ${R.border}`, borderRadius:12, overflow:"hidden" },
  panelHead:  { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", background:R.olive, borderBottom:`2px solid ${R.moss}` },
  panelTitle: { fontFamily:"'Poppins',sans-serif", fontSize:12, fontWeight:600, color:R.cream, letterSpacing:"1px" },
  panelMeta:  { fontSize:10, color:"rgba(245,241,230,0.6)" },
  sidebar:    { display:"flex", flexDirection:"column", gap:12 },
  legendCard: { background:R.cardBg, border:`1px solid ${R.border}`, borderRadius:10, padding:14 },
  legendHead: { fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:600, color:R.olive, letterSpacing:"1.2px", marginBottom:8 },
  gradBar:    { height:8, borderRadius:4, background:"linear-gradient(to right,#27AE60,#F1C40F,#E67E22,#C0392B)", marginBottom:4 },
  gradRow:    { display:"flex", justifyContent:"space-between", marginBottom:10 },
  gradLbl:    { fontSize:9, color:R.brown, fontFamily:"monospace" },
  typeRow:    { display:"flex", flexWrap:"wrap", gap:8 },
  typeChip:   { display:"flex", alignItems:"center", gap:4, fontSize:10, color:R.charcoal },
  typeDot:    { width:7, height:7, borderRadius:"50%" },
  footer:     { display:"flex", justifyContent:"space-between", padding:"10px 24px", background:R.charcoal, fontSize:10, color:R.stone, borderTop:`2px solid ${R.olive}` },
};
