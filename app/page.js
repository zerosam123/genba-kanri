"use client";
import { useState } from "react";

const initialSites = [
  {
    id: 1,
    name: "渡辺マンション新築工事",
    address: "神奈川県横浜市中区山下町1-1",
    date: "2026-03-21",
    endDate: "2026-04-15",
    status: "作業中",
    memo: "基礎工事フェーズ。廃材多め。",
  },
  {
    id: 2,
    name: "上尾市役所改修工事",
    address: "埼玉県上尾市本町1-2-3",
    date: "2026-03-25",
    endDate: "2026-04-30",
    status: "未着",
    memo: "コンクリートガラ・木くず中心",
  },
  {
    id: 3,
    name: "川崎工場解体現場",
    address: "神奈川県川崎市川崎区東田町5-5",
    date: "2026-03-10",
    endDate: "2026-03-20",
    status: "完了",
    memo: "金属スクラップ・廃プラ回収済み",
  },
];

const STATUS_LIST = ["未着", "作業中", "完了"];
const STATUS_STYLE = {
  未着: { bg: "#1a1a2e", border: "#4a90d9", text: "#4a90d9", dot: "#4a90d9" },
  作業中: { bg: "#1a2e1a", border: "#4db86a", text: "#4db86a", dot: "#4db86a" },
  完了: { bg: "#2e2e1a", border: "#c8a84b", text: "#c8a84b", dot: "#c8a84b" },
};
const EMPTY_FORM = { name: "", address: "", date: "", endDate: "", status: "未着", memo: "" };

function Badge({ status }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, border: `1px solid ${s.border}`, color: s.text, borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function Modal({ site, onClose, onSave }) {
  const [form, setForm] = useState(site || EMPTY_FORM);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = () => { if (!form.name.trim() || !form.address.trim() || !form.date) return; onSave(form); };
  const inputStyle = { width: "100%", background: "#111218", border: "1px solid #2a2d3a", borderRadius: 6, color: "#e8e8f0", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", color: "#888aaa", fontSize: 11, fontWeight: 700, marginBottom: 6 };
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: "#16181f", border: "1px solid #2a2d3a", borderRadius: 12, padding: 28, width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: "#e8e8f0", fontSize: 17, fontWeight: 800, margin: 0 }}>{site ? "現場を編集" : "新規現場を追加"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div><label style={labelStyle}>現場名 *</label><input name="name" value={form.name} onChange={handleChange} placeholder="例：〇〇マンション新築工事" style={inputStyle} /></div>
          <div><label style={labelStyle}>住所 *</label><input name="address" value={form.address} onChange={handleChange} placeholder="例：神奈川県横浜市中区..." style={inputStyle} /></div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>開始日 *</label><input type="date" name="date" value={form.date} onChange={handleChange} style={{ ...inputStyle, colorScheme: "dark" }} /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>終了予定日</label><input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={{ ...inputStyle, colorScheme: "dark" }} /></div>
          </div>
          <div><label style={labelStyle}>ステータス</label><select name="status" value={form.status} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>{STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label style={labelStyle}>メモ</label><textarea name="memo" value={form.memo} onChange={handleChange} rows={3} placeholder="廃棄物の種類、注意事項など" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} /></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #2a2d3a", borderRadius: 6, color: "#888aaa", padding: "9px 20px", fontSize: 13, cursor: "pointer" }}>キャンセル</button>
          <button onClick={handleSubmit} style={{ background: "#4a90d9", border: "none", borderRadius: 6, color: "#fff", padding: "9px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>保存</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sites, setSites] = useState(initialSites);
  const [filter, setFilter] = useState("すべて");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const filtered = sites.filter((s) => { const matchStatus = filter === "すべて" || s.status === filter; const q = search.toLowerCase(); return matchStatus && (!q || s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)); });
  const counts = STATUS_LIST.reduce((acc, s) => { acc[s] = sites.filter((x) => x.status === s).length; return acc; }, {});
  const handleSave = (form) => { if (form.id) { setSites(sites.map((s) => (s.id === form.id ? form : s))); } else { setSites([...sites, { ...form, id: nextId }]); setNextId(nextId + 1); } setModal(null); };
  const handleDelete = (id) => { setSites(sites.filter((s) => s.id !== id)); setDeleteId(null); };
  const formatDate = (d) => { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${y}/${m}/${day}`; };
  return (
    <div style={{ minHeight: "100vh", background: "#0d0e14", color: "#e8e8f0", paddingBottom: 48, fontFamily: "sans-serif" }}>
      <style>{`* { box-sizing: border-box; } input, select, textarea { font-family: sans-serif; }`}</style>
      <div style={{ background: "#111218", borderBottom: "1px solid #1​​​​​​​​​​​​​​​​
