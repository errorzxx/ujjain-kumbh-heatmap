import React, { useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";

const R = { olive:"#55663A", brown:"#7A5A3B", border:"#C8BFB0", cardBg:"#FDFAF5", crit:"#C0392B", high:"#E67E22", low:"#27AE60", cream:"#F5F1E6" };

export default function TrendChart({ trendHistory }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !trendHistory.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = R.cardBg; ctx.fillRect(0,0,W,H);

    // Colored threshold bands
    const bands = [
      { from:0.9, to:1.0,  color:"rgba(192,57,43,0.07)"  },
      { from:0.75,to:0.9,  color:"rgba(230,126,34,0.07)" },
      { from:0.55,to:0.75, color:"rgba(199,165,0,0.07)"  },
      { from:0,   to:0.55, color:"rgba(39,174,96,0.05)"  },
    ];
    bands.forEach(b => {
      const y1 = H - (b.to  * H * 0.85 + H * 0.05);
      const y2 = H - (b.from* H * 0.85 + H * 0.05);
      ctx.fillStyle = b.color;
      ctx.fillRect(0, y1, W, y2 - y1);
    });

    // Dashed grid lines
    [0.25,0.55,0.75,0.9].forEach(v => {
      const y = H - (v * H * 0.85 + H * 0.05);
      ctx.strokeStyle = R.border; ctx.lineWidth = 0.5;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = R.brown; ctx.font = "8px monospace";
      ctx.fillText(Math.round(v*100)+"%", 4, y-3);
    });

    // Fill area
    const step = W / (trendHistory.length - 1);
    ctx.beginPath();
    trendHistory.forEach((v,i) => {
      const x = i*step, y = H-(v*H*0.85+H*0.05);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    const lastX = (trendHistory.length-1)*step;
    ctx.lineTo(lastX,H); ctx.lineTo(0,H); ctx.closePath();
    const fill = ctx.createLinearGradient(0,0,0,H);
    fill.addColorStop(0,"rgba(85,102,58,0.28)");
    fill.addColorStop(1,"rgba(85,102,58,0.02)");
    ctx.fillStyle = fill; ctx.fill();

    // Line stroke
    ctx.beginPath();
    trendHistory.forEach((v,i) => {
      const x=i*step, y=H-(v*H*0.85+H*0.05);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.strokeStyle = R.olive; ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.stroke();

    // Current dot
    const cur = trendHistory[trendHistory.length-1];
    const dotY = H-(cur*H*0.85+H*0.05);
    const dotColor = cur>=0.9?R.crit:cur>=0.75?R.high:cur>=0.55?"#C7A500":R.low;
    ctx.beginPath(); ctx.arc(lastX, dotY, 5, 0, Math.PI*2);
    ctx.fillStyle = dotColor; ctx.fill();
    ctx.strokeStyle = R.cream; ctx.lineWidth = 1.5; ctx.stroke();
  }, [trendHistory]);

  const cur  = trendHistory[trendHistory.length-1] || 0;
  const prev = trendHistory[trendHistory.length-6]  || cur;
  const trendLabel = cur>prev ? "↑ Rising" : cur<prev ? "↓ Falling" : "→ Stable";
  const trendColor = cur>prev ? R.crit : cur<prev ? R.low : R.brown;

  return (
    <div style={{ background:R.cardBg, border:`1px solid ${R.border}`, borderRadius:10, overflow:"hidden" }}>
      <div style={{ background:R.olive, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
        <TrendingUp size={13} color={R.cream}/>
        <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:600, color:R.cream, letterSpacing:"1px", flex:1 }}>
          CROWD TREND — 30s
        </span>
        <span style={{ fontSize:11, fontFamily:"monospace", fontWeight:700, color:trendColor, background:trendColor+"22", padding:"2px 8px", borderRadius:4 }}>
          {trendLabel} · {Math.round(cur*100)}%
        </span>
      </div>
      <canvas ref={canvasRef} width={300} height={110} style={{ width:"100%", height:110, display:"block" }}/>
    </div>
  );
}
