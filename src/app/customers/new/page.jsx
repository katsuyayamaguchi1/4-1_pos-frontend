"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function NewCustomerPage() {
  const [form, setForm] = useState({
    customer_id: "",
    customer_name: "",
    age: "",
    gender: "men",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "age" ? value.replace(/\D/g, "") : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age || 0),
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        // FastAPI の 409 等はここに入ります
        const detail =
          (data && data.detail) ||
          (typeof data === "string" ? data : JSON.stringify(data));
        throw new Error(detail);
      }

      setMsg({ type: "ok", text: "登録しました。", data });
      // フォームをリセット
      setForm({ customer_id: "", customer_name: "", age: "", gender: "men" });
    } catch (err) {
      setMsg({ type: "err", text: String(err.message || err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 560 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>新規顧客の登録</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          顧客ID（必須）
          <input
            name="customer_id"
            value={form.customer_id}
            onChange={onChange}
            required
            placeholder="例：C20251013-0001"
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          氏名（必須）
          <input
            name="customer_name"
            value={form.customer_name}
            onChange={onChange}
            required
            placeholder="山口 勝也"
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          年齢（半角数字・必須）
          <input
            name="age"
            inputMode="numeric"
            value={form.age}
            onChange={onChange}
            required
            placeholder="47"
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          性別
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="men">men</option>
            <option value="women">women</option>
            <option value="other">other</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "送信中…" : "登録する"}
        </button>
      </form>

      {msg && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 8,
            background: msg.type === "ok" ? "#e7f6ed" : "#ffe9e9",
            color: msg.type === "ok" ? "#0a5" : "#b00",
          }}
        >
          <div style={{ fontWeight: 700 }}>{msg.text}</div>
          {msg.data && (
            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(msg.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </main>
  );
}
