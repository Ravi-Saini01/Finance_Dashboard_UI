import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { CATEGORIES } from '../constants/data';

const TransactionModal = ({ open, onClose, onSave, editTx, dark }) => {
    const empty = { desc: "", amount: "", category: "Food", type: "expense", date: new Date().toISOString().split("T")[0] };
    const [form, setForm] = useState(empty);

    useEffect(() => {
        setForm(editTx ? { ...editTx, amount: String(editTx.amount) } : empty);
    }, [editTx, open]);

    if (!open) return nuill;

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

export default TransactionModal;

