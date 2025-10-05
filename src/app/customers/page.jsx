"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import fetchCustomers from "./fetchCustomers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">エラー: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">顧客一覧</h1>
        {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
        {/* legacyBehaviorを削除し、classNameを直接Linkに書く */}
        {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
        <Link 
          href="/customers/create" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          新規作成
        </Link>
      </div>

      {customers.length === 0 ? (
        <p>顧客情報がありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div
              key={customer.customer_id}
              className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">
                {customer.customer_name} さん
              </h2>
              <p className="text-gray-600">ID: {customer.customer_id}</p>
              <p className="text-gray-600">年齢: {customer.age}</p>
              <p className="text-gray-600">性別: {customer.gender}</p>
              <div className="mt-4 flex space-x-2">
                {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
                {/* 他のLinkコンポーネントも同様に修正 */}
                {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
                <Link 
                  href={`/customers/read/${customer.customer_id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                >
                  Read
                </Link>
                <Link 
                  href={`/customers/update/${customer.customer_id}`} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm"
                >
                  Update
                </Link>
                <Link 
                  href={`/customers/delete/${customer.customer_id}`} 
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                >
                  Delete
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
