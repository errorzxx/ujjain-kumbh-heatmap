export const UJJAIN_CENTER = [23.1765, 75.7885];
export const DEFAULT_ZOOM = 14;

export const KUMBH_ZONES = [
  { id:"mahakal",      name:"Mahakaleshwar Mandir",  lat:23.1828, lng:75.7681, radius:180, maxCapacity:50000, type:"temple",    priority:"critical" },
  { id:"ramghat",      name:"Ram Ghat",               lat:23.1815, lng:75.7752, radius:150, maxCapacity:30000, type:"ghat",      priority:"high"     },
  { id:"shipraghat",   name:"Shipra Ghat (Main)",     lat:23.1850, lng:75.7740, radius:120, maxCapacity:25000, type:"ghat",      priority:"high"     },
  { id:"railway",      name:"Ujjain Railway Station", lat:23.1846, lng:75.7844, radius:200, maxCapacity:45000, type:"transport", priority:"critical" },
  { id:"nanakheda",    name:"Nanakheda Bus Stand",    lat:23.1723, lng:75.8012, radius:190, maxCapacity:40000, type:"transport", priority:"high"     },
  { id:"dewasgate",    name:"Dewas Gate Entry",       lat:23.1550, lng:75.7950, radius:160, maxCapacity:35000, type:"entry",     priority:"medium"   },
  { id:"freeganj",     name:"Freeganj Market Area",   lat:23.1760, lng:75.7880, radius:130, maxCapacity:20000, type:"market",    priority:"medium"   },
  { id:"mangalnath",   name:"Mangalnath Mandir",      lat:23.1518, lng:75.7667, radius:100, maxCapacity:15000, type:"temple",    priority:"medium"   },
  { id:"triveni",      name:"Triveni Sangam Ghat",    lat:23.1882, lng:75.7715, radius:110, maxCapacity:18000, type:"ghat",      priority:"high"     },
  { id:"harsiddhi",   name:"Harsiddhi Mata Mandir",  lat:23.1798, lng:75.7698, radius:100, maxCapacity:14000, type:"temple",    priority:"medium"   },
  { id:"chardham",     name:"Char Dham Temple",       lat:23.1680, lng:75.7760, radius:90,  maxCapacity:12000, type:"temple",    priority:"low"      },
  { id:"parking_n",   name:"North Parking Zone",     lat:23.1970, lng:75.7840, radius:220, maxCapacity:60000, type:"parking",   priority:"medium"   },
];

export const TYPE_COLORS = {
  temple:    "#C0392B",
  ghat:      "#2980B9",
  transport: "#E67E22",
  market:    "#8E44AD",
  entry:     "#27AE60",
  parking:   "#7A5A3B",
};

export const SEVERITY = {
  critical: { color:"#C0392B", bg:"#FDECEA", label:"CRITICAL" },
  high:     { color:"#E67E22", bg:"#FEF6EC", label:"HIGH"     },
  medium:   { color:"#C7A500", bg:"#FEFBE6", label:"MEDIUM"   },
  low:      { color:"#27AE60", bg:"#EAF6EE", label:"LOW"      },
};

export function getSeverity(density) {
  if (density >= 0.9)  return SEVERITY.critical;
  if (density >= 0.75) return SEVERITY.high;
  if (density >= 0.55) return SEVERITY.medium;
  return SEVERITY.low;
}

export function getTimeMultiplier() {
  const h = new Date().getHours();
  if (h >= 4  && h <= 8)  return 0.92; // Amrit Snan — peak
  if (h >= 9  && h <= 11) return 0.72;
  if (h >= 12 && h <= 14) return 0.55; // midday dip
  if (h >= 15 && h <= 17) return 0.65;
  if (h >= 18 && h <= 21) return 0.88; // evening aarti — peak
  return 0.35;                          // night
}
