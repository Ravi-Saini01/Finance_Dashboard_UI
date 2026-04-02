import { useState } from "react";

const data = [
    { id: 1, desc: "Salary", amount: 85000 }
];

export default function App() {
    const [tab, setTab] = useState("dashboard");

    return (
        <div style={{ padding: 20 }}>
            <h1>Finance Dashboard</h1>

            <button onClick={() => setTab("dashboard")}>Dashboard</button>
            <button onClick={() => setTab("transactions")}>Transactions</button>

            {tab === "dashboard" && <h2>Dashboard Page</h2>}

            {tab === "transactions" && (
                <div>
                    <h2>Transactions</h2>
                    {data.map((t) => (
                        <div key={t.id}>{t.desc} - ₹{t.amount}</div>
                    ))}
                </div>
            )}
        </div>
    );
}