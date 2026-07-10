import React from "react";
import { getGateTrafficLevel, calculateGateCoordinates } from "../../utils/helpers";
import { COLORS, GATES } from "../../utils/constants";

/**
 * StadiumBowl Component
 * Renders the interactive SVG stadium map with real-time congestion heatmaps.
 */
const StadiumBowl = React.memo(function StadiumBowl({ densities, highContrast }) {
  const cx = 200, cy = 200, r = 140;
  
  const levelColor = (v) => {
    const level = getGateTrafficLevel(v);
    if (level === 'busy') return COLORS.coral;
    if (level === 'moderate') return COLORS.gold;
    return COLORS.green;
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-w-sm mx-auto" role="img" aria-label="Live stadium crowd map showing gate congestion levels">
      <title>Stadium crowd heatmap</title>
      <circle cx={cx} cy={cy} r={r + 35} fill={highContrast ? "#000" : COLORS.navyDeep} opacity={highContrast ? 1 : 0.9} />
      <circle cx={cx} cy={cy} r={r} fill={highContrast ? "#1a1a1a" : "#173556"} />
      <circle cx={cx} cy={cy} r={70} fill={COLORS.green} opacity={highContrast ? 0.5 : 0.35} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="600" letterSpacing="1">PITCH</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="white" fontSize="9" opacity="0.7">FIFA World Cup 2026</text>

      {GATES.map((g) => {
        const v = densities[g.id] ?? g.base;
        const { x: gx, y: gy } = calculateGateCoordinates(g.angle, r + 35, cx, cy);
        const color = levelColor(v);
        return (
          <g key={g.id}>
            <circle cx={gx} cy={gy} r={16} fill={color} opacity={0.25}>
              <animate attributeName="r" values="16;22;16" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx={gx} cy={gy} r={11} fill={color} stroke="white" strokeWidth="1.5" />
            <text x={gx} y={gy + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={highContrast ? "#fff" : COLORS.navyDeep}>{g.id}</text>
            <text x={gx} y={gy + 26} textAnchor="middle" fontSize="9" fill={highContrast ? "#fff" : "#cfd8e3"} fontWeight="600">{Math.round(v)}%</text>
          </g>
        );
      })}
    </svg>
  );
});

export default StadiumBowl;
