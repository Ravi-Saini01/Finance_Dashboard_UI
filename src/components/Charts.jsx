import React from 'react';
import { fmt } from '../utils/formatters';

export const BarChart = ({ data, dark }) => {
    const maxVal = Math.max(...data.map(d => d.income));
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "8px 0" }}>
            {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", display: "flex", gap: 3, alignItems: "flex-end", height: 110 }}>
                        <div title={`Income: ${fmt(d.income)}`} style={{
                            flex: 1, height: `${(d.income / maxVal) * 100}%`,
                            background: "linear-gradient(180deg, #10b981, #059669)",
                            borderRadius: "3px 3px 0 0", transition: "height 0.6s ease", cursor: "pointer",
                            boxShadow: "0 0 8px rgba(16,185,129,0.4)"
                        }} />
                        <div title={`Expense: ${fmt(d.expense)}`} style={{
                            flex: 1, height: `${(d.expense / maxVal) * 100}%`,
                            background: "linear-gradient(180deg, #f97316, #ea580c)",
                            borderRadius: "3px 3px 0 0", transition: "height 0.6s ease", cursor: "pointer",
                            boxShadow: "0 0 8px rgba(249,115,22,0.4)"
                        }} />
                    </div>
                    <span style={{ fontSize: 11, color: dark ? "#9ca3af" : "#6b7280", fontWeight: 600 }}>{d.month}</span>
                </div>
            ))}
        </div>
    );
};

export const DonutChart = ({ data, dark }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    let cumulative = 0;
    const r = 60, cx = 80, cy = 80, stroke = 22;
    const circ = 2 * Math.PI * r;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <svg width={160} height={160} style={{ flexShrink: 0 }}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark ? "#1f2937" : "#f3f4f6"} strokeWidth={stroke} />
                {data.map((d, i) => {
                    const pct = d.value / total;
                    const dash = pct * circ;
                    const offset = circ * (1 - cumulative / total);
                    cumulative += d.value;
                    return (
                        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                            stroke={d.color} strokeWidth={stroke}
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={offset}
                            style={{ transformOrigin: `${cx}px ${cy}px`, transform: "rotate(-90deg)", transition: "all 0.6s ease" }}
                        />
                    );
                })}
                <text x={cx} y={cy - 6} textAnchor="middle" fill={dark ? "#f9fafb" : "#111827"} fontSize="13" fontWeight="700">Total</text>
                <text x={cx} y={cy + 12} textAnchor="middle" fill={dark ? "#d1fae5" : "#059669"} fontSize="11" fontWeight="600">
                    {fmt(total).replace("₹", "₹")}
                </text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 120 }}>
                {data.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        <span style={{ color: dark ? "#d1d5db" : "#374151", flex: 1 }}>{d.label}</span>
                        <span style={{ fontWeight: 700, color: dark ? "#f9fafb" : "#111827" }}>{Math.round((d.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};