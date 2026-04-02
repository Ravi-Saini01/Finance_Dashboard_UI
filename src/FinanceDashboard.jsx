import React, { useState, useMemo, useEffect, useCallback } from "react";
import { CATEGORIES, CATEGORY_COLORS, INITIAL_TRANSACTIONS, MONTHLY_BALANCE } from "./constants/data";
import { fmt, fmtDate } from "./utils/formatters";
import Icon from "./components/Icon";
import { BarChart, DonutChart } from "./components/Charts";
import TransactionModal from "./components/TransactionModal";

let nextId = INITIAL_TRANSACTIONS.length + 1;

export default function FinanceDashboard() {
    const [dark, setDark] = useState(true);
    const [role, setRole] = useState("admin");
    const [tab, setTab] = useState("dashboard");
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [sortBy, setSortBy] = useState("date_desc");
    const [modalOpen, setModalOpen] = useState(false);
    const [editTx, setEditTx] = useState(null);
    const [animIn, setAnimIn] = useState(true);

    useEffect(() => { setAnimIn(false); setTimeout(() => setAnimIn(true), 50); }, [tab]);

    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        return { income, expense, balance: income - expense };
    }, [transactions]);

    const categorySpend = useMemo(() => {
        const map = {};
        transactions.filter(t => t.type === "expense").forEach(t => {
            map[t.category] = (map[t.category] || 0) + t.amount;
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || "#6b7280" }));
    }, [transactions]);

    const filteredTx = useMemo(() => {
        return transactions
            .filter(t => {
                const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
                const matchType = filterType === "all" || t.type === filterType;
                const matchCat = filterCategory === "all" || t.category === filterCategory;
                return matchSearch && matchType && matchCat;
            })
            .sort((a, b) => {
                if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
                if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
                if (sortBy === "amount_desc") return b.amount - a.amount;
                if (sortBy === "amount_asc") return a.amount - b.amount;
                return 0;
            });
    }, [transactions, search, filterType, filterCategory, sortBy]);

    const insights = useMemo(() => {
        const thisMonth = transactions.filter(t => t.date.startsWith("2026-03"));
        const lastMonth = transactions.filter(t => t.date.startsWith("2026-02"));
        const topCat = categorySpend[0];
        const thisIncome = thisMonth.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const lastIncome = lastMonth.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const thisExpense = thisMonth.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        const lastExpense = lastMonth.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        const savingsRate = thisIncome > 0 ? ((thisIncome - thisExpense) / thisIncome * 100).toFixed(1) : 0;
        return { topCat, thisIncome, lastIncome, thisExpense, lastExpense, savingsRate };
    }, [transactions, categorySpend]);

    const handleSave = useCallback((form) => {
        if (form.id) {
            setTransactions(prev => prev.map(t => t.id === form.id ? form : t));
        } else {
            setTransactions(prev => [...prev, { ...form, id: nextId++ }]);
        }
    }, []);

    const handleDelete = useCallback((id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    const exportCSV = () => {
        const header = "Date,Description,Category,Type,Amount";
        const rows = filteredTx.map(t => `${t.date},"${t.desc}",${t.category},${t.type},${t.amount}`);
        const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "transactions.csv"; a.click();
    };

    const T = {
        bg: dark ? "#030712" : "#f8fafc",
        card: dark ? "#0f172a" : "#ffffff",
        card2: dark ? "#1e293b" : "#f1f5f9",
        border: dark ? "#1e293b" : "#e2e8f0",
        text: dark ? "#f1f5f9" : "#0f172a",
        muted: dark ? "#64748b" : "#94a3b8",
        accent: "#10b981",
        danger: "#f97316",
    };

    const cardStyle = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 24px" };
    const selStyle = { background: T.card2, border: `1px solid ${T.border}`, color: T.text, borderRadius: 8, padding: "7px 10px", fontSize: 13, cursor: "pointer", outline: "none" };

    return (
        <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "background 0.3s, color 0.3s" }}>
            {/* Note: In a real app, move these global styles to index.css or App.css */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .fade-in { animation: fadeSlide 0.35s ease forwards; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .btn-hover:hover { filter: brightness(1.1); transform: translateY(-1px); transition: all 0.15s; }
        .row-hover:hover { background: ${dark ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.03)"} !important; }
        .nav-item { cursor: pointer; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 14px; transition: all 0.2s; }
        .nav-item:hover { background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}; }
        input::placeholder { color: ${T.muted}; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: ${dark ? "invert(1)" : "none"}; }
      `}</style>

            {/* Header */}
            <header style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="bar_chart" size={16} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.5px" }}>Fintrack</span>
                    <span style={{ fontSize: 11, background: dark ? "#1e293b" : "#f1f5f9", padding: "2px 8px", borderRadius: 99, color: T.muted, fontWeight: 600 }}>v1.0</span>
                </div>

                <nav style={{ display: "flex", gap: 2 }}>
                    {["dashboard", "transactions", "insights"].map(t => (
                        <button key={t} onClick={() => setTab(t)} className="nav-item"
                            style={{ background: tab === t ? (dark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)") : "none", color: tab === t ? T.accent : T.muted, border: "none", textTransform: "capitalize" }}>
                            {t}
                        </button>
                    ))}
                </nav>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.card2, borderRadius: 8, padding: "5px 10px", border: `1px solid ${T.border}` }}>
                        <Icon name="user" size={13} />
                        <select value={role} onChange={e => setRole(e.target.value)} style={{ ...selStyle, background: "none", border: "none", padding: "0", fontSize: 13, fontWeight: 600 }}>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    <button onClick={() => setDark(d => !d)} className="btn-hover" style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: T.text, display: "flex", alignItems: "center" }}>
                        <Icon name={dark ? "sun" : "moon"} size={15} />
                    </button>
                </div>
            </header>

            {role === "viewer" && (
                <div style={{ background: "rgba(234,179,8,0.1)", borderBottom: "1px solid rgba(234,179,8,0.2)", padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#eab308" }}>
                    <Icon name="eye" size={14} /><strong>Viewer Mode</strong> — You can view all data but cannot add or edit transactions.
                </div>
            )}

            <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 40px" }}>
                {/* ... The rest of your JSX logic inside <main> remains exactly the same ... */}
                {/* Replace your modal rendering at the bottom with the imported Component */}
            </main>

            <TransactionModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTx(null); }} onSave={handleSave} editTx={editTx} dark={dark} />
        </div>
    );
}