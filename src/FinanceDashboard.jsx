import { useState, useMemo, useEffect, useCallback } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Food", "Transport", "Shopping", "Housing", "Health", "Entertainment", "Salary", "Freelance", "Investment"];
const CATEGORY_COLORS = {
  Food: "#f97316", Transport: "#3b82f6", Shopping: "#a855f7",
  Housing: "#ef4444", Health: "#22c55e", Entertainment: "#eab308",
  Salary: "#06b6d4", Freelance: "#10b981", Investment: "#8b5cf6",
};

const INITIAL_TRANSACTIONS = [
  { id: 1, date: "2026-03-01", desc: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 2, date: "2026-03-02", desc: "Apartment Rent", amount: 22000, category: "Housing", type: "expense" },
  { id: 3, date: "2026-03-03", desc: "Swiggy Order", amount: 450, category: "Food", type: "expense" },
  { id: 4, date: "2026-03-05", desc: "Uber Ride", amount: 280, category: "Transport", type: "expense" },
  { id: 5, date: "2026-03-07", desc: "Freelance Project", amount: 15000, category: "Freelance", type: "income" },
  { id: 6, date: "2026-03-08", desc: "Amazon Shopping", amount: 3200, category: "Shopping", type: "expense" },
  { id: 7, date: "2026-03-10", desc: "Gym Membership", amount: 1500, category: "Health", type: "expense" },
  { id: 8, date: "2026-03-12", desc: "Netflix + Spotify", amount: 749, category: "Entertainment", type: "expense" },
  { id: 9, date: "2026-03-14", desc: "Mutual Fund SIP", amount: 10000, category: "Investment", type: "expense" },
  { id: 10, date: "2026-03-15", desc: "Restaurant Dinner", amount: 1800, category: "Food", type: "expense" },
  { id: 11, date: "2026-03-17", desc: "Metro Card Recharge", amount: 500, category: "Transport", type: "expense" },
  { id: 12, date: "2026-03-18", desc: "Doctor Visit", amount: 800, category: "Health", type: "expense" },
  { id: 13, date: "2026-03-20", desc: "Freelance Bonus", amount: 5000, category: "Freelance", type: "income" },
  { id: 14, date: "2026-03-22", desc: "Zomato Order", amount: 620, category: "Food", type: "expense" },
  { id: 15, date: "2026-03-25", desc: "Electricity Bill", amount: 1200, category: "Housing", type: "expense" },
  { id: 16, date: "2026-03-27", desc: "Movie Tickets", amount: 900, category: "Entertainment", type: "expense" },
  { id: 17, date: "2026-03-28", desc: "Dividend Income", amount: 3200, category: "Investment", type: "income" },
  { id: 18, date: "2026-03-30", desc: "Grocery Store", amount: 2100, category: "Food", type: "expense" },
  { id: 19, date: "2026-02-01", desc: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 20, date: "2026-02-02", desc: "Apartment Rent", amount: 22000, category: "Housing", type: "expense" },
  { id: 21, date: "2026-02-05", desc: "Freelance Project", amount: 8000, category: "Freelance", type: "income" },
  { id: 22, date: "2026-02-10", desc: "Shopping Mall", amount: 5500, category: "Shopping", type: "expense" },
  { id: 23, date: "2026-02-14", desc: "Valentine Dinner", amount: 2800, category: "Food", type: "expense" },
  { id: 24, date: "2026-02-18", desc: "Metro Recharge", amount: 500, category: "Transport", type: "expense" },
  { id: 25, date: "2026-02-22", desc: "Mutual Fund SIP", amount: 10000, category: "Investment", type: "expense" },
  { id: 26, date: "2026-01-01", desc: "Monthly Salary", amount: 82000, category: "Salary", type: "income" },
  { id: 27, date: "2026-01-03", desc: "Apartment Rent", amount: 22000, category: "Housing", type: "expense" },
  { id: 28, date: "2026-01-08", desc: "New Year Shopping", amount: 7200, category: "Shopping", type: "expense" },
  { id: 29, date: "2026-01-15", desc: "Freelance Work", amount: 12000, category: "Freelance", type: "income" },
  { id: 30, date: "2026-01-20", desc: "Mutual Fund SIP", amount: 10000, category: "Investment", type: "expense" },
];

const MONTHLY_BALANCE = [
  { month: "Oct", balance: 48000, income: 90000, expense: 42000 },
  { month: "Nov", balance: 52000, income: 88000, expense: 36000 },
  { month: "Dec", balance: 38000, income: 85000, expense: 47000 },
  { month: "Jan", balance: 55000, income: 94000, expense: 39000 },
  { month: "Feb", balance: 47000, income: 93000, expense: 46000 },
  { month: "Mar", balance: 60200, income: 108200, expense: 48000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

let nextId = INITIAL_TRANSACTIONS.length + 1;

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16, className = "" }) => {
  const icons = {
    wallet: <path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm0 0V5a2 2 0 00-2-2H6L4 5v2M16 13a1 1 0 100-2 1 1 0 000 2z" />,
    trending_up: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    trending_down: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>,
    arrow_up: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
    arrow_down: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6m5 0V4h4v2" /></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />,
    sun: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    bar_chart: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
};

// ─── Mini Bar Chart (time-based) ──────────────────────────────────────────────
const BarChart = ({ data, dark }) => {
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

// ─── Donut Chart (categorical) ────────────────────────────────────────────────
const DonutChart = ({ data, dark }) => {
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

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, onSave, editTx, dark }) => {
  const empty = { desc: "", amount: "", category: "Food", type: "expense", date: new Date().toISOString().split("T")[0] };
  const [form, setForm] = useState(empty);
  useEffect(() => { setForm(editTx ? { ...editTx, amount: String(editTx.amount) } : empty); }, [editTx, open]);
  if (!open) return null;
  const handleSave = () => {
    if (!form.desc || !form.amount || !form.date) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };
  const inp = { background: dark ? "#1f2937" : "#f9fafb", border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`, color: dark ? "#f9fafb" : "#111827", borderRadius: 8, padding: "8px 12px", width: "100%", fontSize: 14, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 12, fontWeight: 600, color: dark ? "#9ca3af" : "#6b7280", marginBottom: 4, display: "block" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? "#111827" : "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 420, boxShadow: "0 25px 50px rgba(0,0,0,0.4)", border: `1px solid ${dark ? "#1f2937" : "#e5e7eb"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: dark ? "#f9fafb" : "#111827" }}>{editTx ? "Edit Transaction" : "Add Transaction"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#9ca3af" : "#6b7280", padding: 4 }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={lbl}>Description</label><input style={inp} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="e.g. Monthly Salary" /></div>
          <div><label style={lbl}>Amount (₹)</label><input style={inp} type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Category</label>
              <select style={inp} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Type</label>
              <select style={inp} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div><label style={lbl}>Date</label><input style={inp} type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`, background: "none", color: dark ? "#9ca3af" : "#6b7280", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSave} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [dark, setDark] = useState(true);
  const [role, setRole] = useState("admin"); // "admin" | "viewer"
  const [tab, setTab] = useState("dashboard"); // "dashboard" | "transactions" | "insights"
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [animIn, setAnimIn] = useState(true);

  useEffect(() => { setAnimIn(false); setTimeout(() => setAnimIn(true), 50); }, [tab]);

  // Summary computations
  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // Spending by category
  const categorySpend = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || "#6b7280" }));
  }, [transactions]);

  // Filtered & sorted transactions
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

  // Insights
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

  // Theme tokens
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
            <Icon name="bar_chart" size={16} className="" />
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
          {/* Role Switch */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.card2, borderRadius: 8, padding: "5px 10px", border: `1px solid ${T.border}` }}>
            <Icon name="user" size={13} />
            <select value={role} onChange={e => setRole(e.target.value)} style={{ ...selStyle, background: "none", border: "none", padding: "0", fontSize: 13, fontWeight: 600 }}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          {/* Dark Mode */}
          <button onClick={() => setDark(d => !d)} className="btn-hover" style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: T.text, display: "flex", alignItems: "center" }}>
            <Icon name={dark ? "sun" : "moon"} size={15} />
          </button>
        </div>
      </header>

      {/* Role Banner */}
      {role === "viewer" && (
        <div style={{ background: "rgba(234,179,8,0.1)", borderBottom: "1px solid rgba(234,179,8,0.2)", padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#eab308" }}>
          <Icon name="eye" size={14} /><strong>Viewer Mode</strong> — You can view all data but cannot add or edit transactions.
        </div>
      )}

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 40px" }}>

        {/* ── DASHBOARD TAB ─────────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="fade-in">
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Balance", value: summary.balance, icon: "wallet", color: "#10b981", positive: summary.balance >= 0 },
                { label: "Total Income", value: summary.income, icon: "arrow_up", color: "#10b981", positive: true },
                { label: "Total Expenses", value: summary.expense, icon: "arrow_down", color: "#f97316", positive: false },
                { label: "Savings Rate", value: null, raw: `${summary.income > 0 ? ((summary.balance / summary.income) * 100).toFixed(1) : 0}%`, icon: "zap", color: "#8b5cf6", positive: true },
              ].map((c, i) => (
                <div key={i} style={{ ...cardStyle, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: c.color, opacity: 0.06, borderRadius: "50%" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 12, color: T.muted, fontWeight: 600, marginBottom: 6 }}>{c.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: c.value !== null ? (c.positive ? "#10b981" : "#f97316") : "#8b5cf6", fontFamily: "DM Mono, monospace" }}>
                        {c.value !== null ? fmt(c.value) : c.raw}
                      </p>
                    </div>
                    <div style={{ background: `${c.color}20`, borderRadius: 10, padding: 10, color: c.color }}>
                      <Icon name={c.icon} size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>Monthly Overview</h3>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: T.muted }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#10b981", display: "inline-block" }} />Income</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#f97316", display: "inline-block" }} />Expense</span>
                  </div>
                </div>
                <BarChart data={MONTHLY_BALANCE} dark={dark} />
              </div>

              <div style={cardStyle}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Spending by Category</h3>
                <DonutChart data={categorySpend.slice(0, 6)} dark={dark} />
              </div>
            </div>

            {/* Recent Transactions */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Transactions</h3>
                <button onClick={() => setTab("transactions")} style={{ fontSize: 12, color: T.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
              </div>
              {transactions.slice(0, 5).sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => (
                <div key={t.id} className="row-hover" style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}`, gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${CATEGORY_COLORS[t.category]}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 14 }}>{t.category === "Food" ? "🍔" : t.category === "Transport" ? "🚗" : t.category === "Shopping" ? "🛍️" : t.category === "Housing" ? "🏠" : t.category === "Health" ? "💊" : t.category === "Entertainment" ? "🎬" : t.category === "Salary" ? "💼" : t.category === "Freelance" ? "💻" : "📈"}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.desc}</p>
                    <p style={{ fontSize: 12, color: T.muted }}>{fmtDate(t.date)} · {t.category}</p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "DM Mono, monospace", color: t.type === "income" ? "#10b981" : "#f97316" }}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS TAB ──────────────────────────────────────────────── */}
        {tab === "transactions" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>All Transactions <span style={{ fontSize: 14, color: T.muted, fontWeight: 500 }}>({filteredTx.length})</span></h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {role === "admin" && (
                  <button onClick={() => { setEditTx(null); setModalOpen(true); }} className="btn-hover"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="plus" size={14} /> Add
                  </button>
                )}
                <button onClick={exportCSV} className="btn-hover"
                  style={{ background: T.card2, color: T.text, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="download" size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ ...cardStyle, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", gap: 8, background: T.card2, borderRadius: 8, padding: "8px 12px", border: `1px solid ${T.border}` }}>
                <Icon name="search" size={14} style={{ color: T.muted }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…"
                  style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: T.text, width: "100%" }} />
              </div>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selStyle}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={selStyle}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selStyle}>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="amount_desc">Highest Amount</option>
                <option value="amount_asc">Lowest Amount</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: T.card2 }}>
                      {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? ["Actions"] : [])].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: T.muted, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.length === 0 ? (
                      <tr><td colSpan={role === "admin" ? 6 : 5} style={{ padding: 40, textAlign: "center", color: T.muted }}>No transactions found</td></tr>
                    ) : filteredTx.map(t => (
                      <tr key={t.id} className="row-hover" style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: T.muted, fontFamily: "DM Mono, monospace", whiteSpace: "nowrap" }}>{fmtDate(t.date)}</td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{t.desc}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: `${CATEGORY_COLORS[t.category]}20`, color: CATEGORY_COLORS[t.category], padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{t.category}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: t.type === "income" ? "rgba(16,185,129,0.1)" : "rgba(249,115,22,0.1)", color: t.type === "income" ? "#10b981" : "#f97316", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{t.type}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, fontFamily: "DM Mono, monospace", color: t.type === "income" ? "#10b981" : "#f97316", whiteSpace: "nowrap" }}>
                          {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                        </td>
                        {role === "admin" && (
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => { setEditTx(t); setModalOpen(true); }} style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}><Icon name="edit" size={13} /></button>
                              <button onClick={() => handleDelete(t.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}><Icon name="trash" size={13} /></button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── INSIGHTS TAB ──────────────────────────────────────────────────── */}
        {tab === "insights" && (
          <div className="fade-in">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Financial Insights</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
              {[
                {
                  title: "🏆 Top Spending Category",
                  value: insights.topCat?.label || "—",
                  sub: insights.topCat ? `${fmt(insights.topCat.value)} total spent` : "",
                  color: insights.topCat ? CATEGORY_COLORS[insights.topCat.label] : T.accent,
                },
                {
                  title: "📊 Savings Rate (Mar)",
                  value: `${insights.savingsRate}%`,
                  sub: insights.savingsRate >= 20 ? "✅ Healthy savings rate" : "⚠️ Below recommended 20%",
                  color: parseFloat(insights.savingsRate) >= 20 ? "#10b981" : "#eab308",
                },
                {
                  title: "📈 Income vs Last Month",
                  value: fmt(insights.thisIncome),
                  sub: `${insights.thisIncome >= insights.lastIncome ? "▲" : "▼"} ${fmt(Math.abs(insights.thisIncome - insights.lastIncome))} vs Feb`,
                  color: insights.thisIncome >= insights.lastIncome ? "#10b981" : "#f97316",
                },
                {
                  title: "💸 Expense vs Last Month",
                  value: fmt(insights.thisExpense),
                  sub: `${insights.thisExpense >= insights.lastExpense ? "▲" : "▼"} ${fmt(Math.abs(insights.thisExpense - insights.lastExpense))} vs Feb`,
                  color: insights.thisExpense <= insights.lastExpense ? "#10b981" : "#f97316",
                },
              ].map((ins, i) => (
                <div key={i} style={{ ...cardStyle, borderLeft: `3px solid ${ins.color}` }}>
                  <p style={{ fontSize: 13, color: T.muted, fontWeight: 600, marginBottom: 8 }}>{ins.title}</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: ins.color, fontFamily: "DM Mono, monospace", marginBottom: 4 }}>{ins.value}</p>
                  <p style={{ fontSize: 12, color: T.muted }}>{ins.sub}</p>
                </div>
              ))}
            </div>

            {/* Category Breakdown Table */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Spending Breakdown by Category</h3>
              {categorySpend.map((c, i) => {
                const pct = (c.value / categorySpend[0].value) * 100;
                return (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{c.label}</span>
                      <span style={{ fontFamily: "DM Mono, monospace", fontWeight: 700, color: c.color }}>{fmt(c.value)}</span>
                    </div>
                    <div style={{ height: 6, background: T.card2, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 99, transition: "width 0.8s ease", boxShadow: `0 0 8px ${c.color}80` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Month Comparison */}
            <div style={{ ...cardStyle, marginTop: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>6-Month Balance Trend</h3>
              <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
                {MONTHLY_BALANCE.map((m, i) => {
                  const balance = m.income - m.expense;
                  const isPositive = balance >= 0;
                  return (
                    <div key={i} style={{ flex: 1, minWidth: 100, textAlign: "center", padding: "16px 12px", borderRadius: 12, background: T.card2, border: `1px solid ${T.border}` }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: T.muted, marginBottom: 8 }}>{m.month}</p>
                      <p style={{ fontSize: 15, fontWeight: 800, color: isPositive ? "#10b981" : "#f97316", fontFamily: "DM Mono, monospace" }}>{fmt(balance)}</p>
                      <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{isPositive ? "Saved" : "Deficit"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditTx(null); }} onSave={handleSave} editTx={editTx} dark={dark} />
    </div>
  );
}
