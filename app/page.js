"use client";
import { useState } from "react";

const initialSites = [
  { id: 1, name: "渡辺マンション新築工事", address: "神奈川県横浜市中区山下町1-1", date: "2026-03-21", endDate: "2026-04-15", status: "作業中", memo: "基礎工事フェーズ" },
  { id: 2, name: "川崎工場解体現場", address: "神奈川県川崎市川崎区東田町5-5", date: "2026-03-10", endDate: "2026-03-20", status: "完了", memo: "金属スクラップ回収済み" },
];

const STATUS_LIST = ["未着", "作業中", "完了"];
const STATUS_COLOR = { "未着": "#4a90d9", "作業中": "#4db86a", "完了": "#c8a84b" };
const EMPTY = { name: "", address: "", date: "", endDate: "", status: "未着", memo: "" };

export default function App() {
  const [sites, setSites] = useState(initialSites);
  const [filter, setFilter] = useState("すべて");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [nextId, setNextId] = useState(3);

  const filtered = sites.filter(s => {
    const ok1 = filter === "すべて" || s.status === filter;
    const ok2 = !search || s.name.includes(search) || s.address.includes(search);
    return ok1 && ok2;
  });

  const openNew = () => { setForm(EMPTY); setModal("new"); };
  const openEdit = (s) => { setForm(s); setModal("edit"); };
  const save = () => {
    if (!form.name || !form.address || !form.date) return;
    if (modal === "new") { setSites([...sites, { ...form, id: nextId }]); setNextId(nextId + 1); }
    else { setSites(sites.map(s => s.id === form.id ? form : s)); }
    setModal(null);
  };
  const del = (id) => setSites(sites.filter(s => s.id !== id));

  const inp = { width: "100%", padding: "8px", background: "#111", border: "1px solid #333", color: "#eee", borderRadius: 6, fontSize: 14, boxSizing: "border-box" };
  const lbl = { display: "block", color: "#888", fontSize: 11, marginBottom: 4 };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0e14", color: "#eee", fontFamily: "sans-serif", paddingBottom: 40 }}>
      <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
        <span style={{ fontWeight: 800, fontSize: 16 }}>🏗 現場表管理</span>
        <button onClick={openNew} style={{ background: "#4a90d9", border: "none", color: "#fff", padding: "7px 14px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>＋ 新規</button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {["すべて", ...STATUS_LIST].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "#222" : "transparent", border: "1px solid #333", color: filter === f ? "#4a90d9" : "#666", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>{f} {f === "すべて" ? sites.length : sites.filter(s => s.status === f).length}</button>
          ))}
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 現場名・住所で検索" style={{ ...inp, marginBottom: 12 }} />

        {filtered.map(s => (
          <div key={s.id} style={{ background: "#111", border: "1px solid #222", borderLeft: `3px solid ${STATUS_COLOR[s.status]}`, borderRadius: 8, padding: "12px 16px", marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{s.name}</span>
                <span style={{ fontSize: 11, color: STATUS_COLOR[s.status], border: `1px solid ${STATUS_COLOR[s.status]}`, borderRadius: 4, padding: "2px 8px" }}>{s.status}</span>
              </div>
              <div style={{ color: "#666", fontSize: 12 }}>📍 {s.address}</div>
              <div style={{ color: "#666", fontSize: 12 }}>📅 {s.date}{s.endDate ? " → " + s.endDate : ""}</div>
              {s.memo && <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{s.memo}</div>}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => openEdit(s)} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontSize: 12 }}>編集</button>
              <button onClick={() => del(s.id)} style={{ background: "none", border: "1px solid #333", color: "#633", padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontSize: 12 }}>削除</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: "center", color: "#444", padding: 40 }}>現場が見つかりません</div>}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 100 }}>
          <div style={{ background: "#16181f", border: "1px solid #333", borderRadius: 12, padding: 24, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{modal === "new" ? "新規現場" : "現場を編集"}</span>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={lbl}>現場名 *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} /></div>
              <div><label style={lbl}>住所 *</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inp} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}><label style={lbl}>開始日 *</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ ...inp, colorScheme: "dark" }} /></div>
                <div style={{ flex: 1 }}><label style={lbl}>終了予定日</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} style={{ ...inp, colorScheme: "dark" }} /></div>
              </div>
              <div><label style={lbl}>ステータス</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>{STATUS_LIST.map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label style={lbl}>メモ</label><textarea value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} /></div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "8px 18px", borderRadius: 6, cursor: "pointer" }}>キャンセル</button>
              <button onClick={save} style={{ background: "#4a90d9", border: "none", color: "#fff", padding: "8px 20px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

─────────────────────

ZEROSAM合同会社
代表　渡邊修
〒915-0071 福井県越前市府中1-12-13
TEL：0778-22-1534 
FAX： 0778-22-1534
携帯090-7740-7720
Email：watanabe@zerosam.jp

──────────────────────
