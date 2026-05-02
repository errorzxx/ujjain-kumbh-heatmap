import React from "react";
import { Users, AlertTriangle, Activity, MapPin } from "lucide-react";

const R = { olive:"#55663A", brown:"#7A5A3B", border:"#C8BFB0", crit:"#C0392B", high:"#E67E22", low:"#27AE60" };

export default function StatsBar({ crowdData }) {
  const total    = crowdData.reduce((s, z) => s + z.estimatedPeople, 0);
  const critical = crowdData.filter(z => z.density >= 0.9).length;
  const highC    = crowdData.filter(z => z.density >= 0.75 && z.density < 0.9).length;
  const avg      = crowdData.length ? Math.round(crowdData.reduce((s,z)=>s+z.density,0)/crowdData.length*100) : 0;
  const active   = crowdData.filter(z => z.density > 0.2).length;

  const cards = [
    { label:"Total Crowd Estimate",  value: total.toLocaleString("en-IN"), sub:"People across all zones",          icon:Users,         accent:R.olive,  bg:"#EEF2E8" },
    { label:"Critical Alerts",       value: critical,                       sub:`${highC} zones on high alert`,     icon:AlertTriangle, accent:critical>0?R.crit:R.low, bg:critical>0?"#FDECEA":"#EAF6EE" },
    { label:"Average Density",       value: avg+"%",                        sub:avg>75?"Action Required":avg>55?"Monitor Closely":"Safe Limits", icon:Activity, accent:avg>75?R.crit:avg>55?R.high:R.low, bg:avg>75?"#FDECEA":avg>55?"#FEF6EC":"#EAF6EE" },
    { label:"Active Zones",          value: `${active}/${crowdData.length}`, sub:"Zones with crowd presence",       icon:MapPin,        accent:"#6F7F4E", bg:"#EEF2E8" },
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
      {cards.map((c,i) => {
        const Icon = c.icon;
        return (
          <div key={i} style={{ background:c.bg, border:`1px solid ${R.border}`, borderRadius:10, padding:"12px 16px", borderLeft:`4px solid ${c.accent}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:10, color:R.brown, fontFamily:"'Poppins',sans-serif", fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase" }}>{c.label}</span>
              <div style={{ width:30, height:30, borderRadius:6, background:c.accent+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={15} color={c.accent}/>
              </div>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:c.accent, fontFamily:"'Poppins',sans-serif", lineHeight:1 }}>{c.value}</div>
            <div style={{ fontSize:10, color:R.brown, marginTop:5 }}>{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
