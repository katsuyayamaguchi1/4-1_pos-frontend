"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import createCustomer from "./createCustomer";

export default function CreatePage() {
  const router = useRouter();
  const formRef = useRef();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(formRef.current);
    try {
      const newCustomer = await createCustomer(formData);
      router.push("/customers");
      router.refresh();
    } catch (err) {
      // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
      // オブジェクトそのものではなく、メッセージ部分(err.message)をセットする
      // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">顧客新規作成</h1>
      <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* 顧客ID */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer_id">
            顧客ID
          </label>
          <input
            type="text"
            name="customer_id"
            id="customer_id"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {/* 顧客名 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer_name">
            顧客名
          </label>
          <input
            type="text"
            name="customer_name"
            id="customer_name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
        {/* ここからが追加された年齢と性別のフォームです */}
        {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
        {/* 年齢 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
            年齢
          </label>
          <input
            type="number"
            name="age"
            id="age"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {/* 性別 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
            性別
          </label>
          <input
            type="text"
            name="gender"
            id="gender"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}
        {/* ここまでが追加部分です */}
        {/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */}

        {/* エラーメッセージの表示場所 */}
        {error && (
          <p className="text-red-500 text-xs italic mb-4">{error}</p>
        )}

        {/* 送信ボタン */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? '作成中...' : '作成'}
          </button>
        </div>
      </form>
    </div>
  );
}
