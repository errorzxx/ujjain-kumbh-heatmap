import React from "react";
import { Shield, AlertTriangle } from "lucide-react";

const R = { olive:"#55663A", brown:"#7A5A3B", charcoal:"#282B2B", border:"#C8BFB0", cardBg:"#FDFAF5", crit:"#C0392B" };

export default function AlertPanel({ crowdData }) {
  const sorted    = [...crowdData].sort((a,b) => b.density - a.density).slice(0, 8);
  const critCount = crowdData.filter(z => z.density >= 0.9).length;

  return (
    <div style={{ background:R.cardBg, border:`1px solid ${R.border}`, borderRadius:10, overflow:"hidden" }}>
      <div style={{ background:R.olive, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
        <Shield size={14} color="#F5F1E6"/>
        <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:600, color:"#F5F1E6", letterSpacing:"1px", flex:1 }}>ZONE STATUS REPORT</span>
        {critCount > 0 && (
          <span style={{ background:R.crit, color:"#fff", borderRadius:4, padding:"2px 8px", fontSize:9, fontWeight:700 }}>
            {critCount} CRITICAL
          </span>
        )}
      </div>

      {critCount > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:"#FDECEA", borderBottom:`1px solid #F5C6C6` }}>
          <AlertTriangle size={12} color={R.crit}/>
          <span style={{ fontSize:11, color:R.crit, fontWeight:600 }}>
            Immediate action required in {critCount} zone{critCount>1?"s":""}
          </span>
        </div>
      )}

      <div>
        {sorted.map((zone, i) => {
          const sev = zone.severity;
          return (
            <div key={zone.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderBottom:`1px solid ${R.border}`, background:i%2===0?R.cardBg:"#F8F5F0" }}>
              <div style={{ width:3, height:36, borderRadius:2, background:sev.color, flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, color:R.charcoal, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontFamily:"'Poppins',sans-serif" }}>{zone.name}</div>
                <div style={{ fontSize:9, color:R.brown, letterSpacing:"0.8px", marginTop:1, textTransform:"uppercase" }}>{zone.type}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
                <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:4, background:sev.bg, color:sev.color, letterSpacing:"0.5px" }}>{sev.label}</span>
                <span style={{ fontSize:14, fontWeight:700, color:sev.color, fontFamily:"monospace" }}>{Math.round(zone.density*100)}%</span>
                <span style={{ fontSize:9, color:R.brown }}>~{zone.estimatedPeople.toLocaleString("en-IN")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
