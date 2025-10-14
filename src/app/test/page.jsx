"use client";
import { useState } from "react";

export default function TestPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  async function fetchAll() {
    setErr(null);
    try {
      // ← App Service の環境変数（NEXT_PUBLIC_API_ENDPOINT）を使用
      const API = (process.env.NEXT_PUBLIC_API_ENDPOINT || "").replace(/\/$/, "");
      const res = await fetch(`${API}/allcustomers`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setErr(e?.message ?? String(e));
      setData(null);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>連携テスト（最小）</h1>
      <button onClick={fetchAll}>顧客一覧を取得</button>
      {err && <p style={{ color: "crimson" }}>Error: {err}</p>}
      {!data && !err && <p>（未取得）</p>}
      {Array.isArray(data) && <pre style={{ marginTop: 12 }}>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
