export function BookStack() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5.5h11.5A2.5 2.5 0 0 1 19 8v9.5H7.2A2.2 2.2 0 0 1 5 15.3V5.5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 5.5v12M5 14.2h14" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 9h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BrowserWindow() {
  return (
    <svg viewBox="0 0 590 470" fill="none" role="img" aria-label="ภาพวาดสองมิติของเว็บไซต์และอุปกรณ์การเรียน">
      <path d="M73 87c0-16.6 13.4-30 30-30h377c16.6 0 30 13.4 30 30v283c0 16.6-13.4 30-30 30H103c-16.6 0-30-13.4-30-30V87Z" fill="#fff" stroke="#173329" strokeWidth="5" />
      <path d="M73 87c0-16.6 13.4-30 30-30h377c16.6 0 30 13.4 30 30v32H73V87Z" fill="#E9F5ED" stroke="#173329" strokeWidth="5" />
      <circle cx="103" cy="88" r="7" fill="#F4C84A" />
      <circle cx="128" cy="88" r="7" fill="#67B28E" />
      <circle cx="153" cy="88" r="7" fill="#fff" stroke="#173329" strokeWidth="3" />
      <rect x="104" y="151" width="181" height="19" rx="9.5" fill="#176B4C" />
      <rect x="104" y="181" width="232" height="11" rx="5.5" fill="#B9CCBF" />
      <rect x="104" y="204" width="192" height="11" rx="5.5" fill="#DCE7DF" />
      <rect x="104" y="246" width="112" height="46" rx="12" fill="#176B4C" />
      <path d="M244 269h46" stroke="#173329" strokeWidth="5" strokeLinecap="round" />
      <rect x="104" y="326" width="108" height="45" rx="11" fill="#FFF8DA" stroke="#E8D38B" strokeWidth="3" />
      <rect x="227" y="326" width="108" height="45" rx="11" fill="#E9F5ED" stroke="#BDD6C5" strokeWidth="3" />
      <rect x="350" y="326" width="108" height="45" rx="11" fill="#F4F7F5" stroke="#D4DFD7" strokeWidth="3" />
      <path d="m422 152 13 28 31 4-23 21 6 31-27-15-27 15 6-31-23-21 31-4 13-28Z" fill="#F4C84A" stroke="#173329" strokeWidth="4" strokeLinejoin="round" />
      <path d="M28 366h108v48H28z" fill="#F4C84A" stroke="#173329" strokeWidth="5" strokeLinejoin="round" />
      <path d="m28 366 22-27h108l-22 27H28Z" fill="#FFF8DA" stroke="#173329" strokeWidth="5" strokeLinejoin="round" />
      <path d="M48 390h68" stroke="#173329" strokeWidth="5" strokeLinecap="round" />
      <path d="m518 262 39 98-26 11-39-98 26-11Z" fill="#F4C84A" stroke="#173329" strokeWidth="5" />
      <path d="m492 273 6-32 20 21-26 11Z" fill="#fff" stroke="#173329" strokeWidth="5" />
      <path d="m557 360-3 25-23-14 26-11Z" fill="#176B4C" stroke="#173329" strokeWidth="5" />
      <path d="M188 431h208" stroke="#173329" strokeWidth="5" strokeLinecap="round" />
      <path d="m283 402-8 29h34l-8-29" fill="#fff" stroke="#173329" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "shirt") {
    return <svg viewBox="0 0 24 24" {...common}><path d="m8 4-5 3 2.5 4L8 9.5V20h8V9.5l2.5 1.5L21 7l-5-3c-.7 1.3-2 2-4 2S8.7 5.3 8 4Z" /></svg>;
  }
  if (name === "sparkle") {
    return <svg viewBox="0 0 24 24" {...common}><path d="M12 3c.8 4.3 3.7 7.2 8 8-4.3.8-7.2 3.7-8 8-.8-4.3-3.7-7.2-8-8 4.3-.8 7.2-3.7 8-8Z" /><path d="M19 3v4M17 5h4" /></svg>;
  }
  if (name === "users") {
    return <svg viewBox="0 0 24 24" {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-4 2.3-6 5.5-6s5 2 5.5 6M15 6.5a3 3 0 0 1 0 5.8M16 14c2.4.5 3.8 2.2 4.3 5" /></svg>;
  }
  return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01M8 13h8M8 16h5" /></svg>;
}

export function PencilSpark({ variant = 1 }: { variant?: number }) {
  const colors = variant === 2
    ? ["#F4C84A", "#176B4C", "#FFFDF4"]
    : variant === 3
      ? ["#B8D8C4", "#173329", "#FFFFFF"]
      : ["#67B28E", "#173329", "#FFF8DA"];
  return (
    <svg viewBox="0 0 280 170" fill="none" aria-hidden="true">
      <path d="M45 134h190" stroke={colors[1]} strokeWidth="4" strokeLinecap="round" />
      <rect x="65" y="43" width="122" height="82" rx="12" fill={colors[2]} stroke={colors[1]} strokeWidth="4" />
      <path d="M89 69h72M89 84h54M89 99h61" stroke={colors[0]} strokeWidth="7" strokeLinecap="round" />
      <path d="m185 42 42 42-17 17-42-42 17-17Z" fill={colors[0]} stroke={colors[1]} strokeWidth="4" />
      <path d="m168 59-8 25 25-8-17-17Z" fill="white" stroke={colors[1]} strokeWidth="4" />
      <path d="M45 38v18M36 47h18M224 27v19M215 36h18" stroke={colors[1]} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
