"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import fetchCustomer from "./fetchCustomer";
import updateCustomer from "./updateCustomer";

export default function UpdatePage(props) {
  const params = use(props.params);
  const router = useRouter();
  const id = params.id;

  // 1. stateをより明確に定義
  // customerInfoはオブジェクトなのでnullで初期化
  const [customerInfo, setCustomerInfo] = useState(null); 
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(""); // エラーメッセージ用
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信処理中の状態

  // 2. データの取得とローディング管理
  useEffect(() => {
    const fetchAndSetCustomer = async () => {
      try {
        setError(""); // 初期化
        setLoading(true);
        const customerData = await fetchCustomer(id);
        setCustomerInfo(customerData);
      } catch (err) {
        setError("顧客情報の取得に失敗しました。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchAndSetCustomer();
    }
  }, [id]); // idを依存配列に追加

  // 3. フォームの値をstateで管理 (制御コンポーネント)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };
  
  // 4. エラーハンドリングを強化したhandleSubmit
  const handleSubmit = async (event) => {
    event.preventDefault();
    // FormDataは不要になり、stateの値を直接使う
    if (!customerInfo) return;

    setIsSubmitting(true);
    setError("");

    try {
      // updateCustomerには直接オブジェクトを渡すように変更（もしFormDataが必要なら別途修正）
      // ここではcustomerInfoを直接渡せると仮定
      const formData = new FormData();
      formData.append("customer_name", customerInfo.customer_name);
      formData.append("customer_id", customerInfo.customer_id);
      formData.append("age", customerInfo.age);
      formData.append("gender", customerInfo.gender);

      await updateCustomer(formData);
      router.push(`./${customerInfo.customer_id}/confirm`);
    } catch (err) {
      setError("顧客情報の更新に失敗しました。");
      console.error(err); // コンソールに詳細なエラーを表示
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. ローディング中の表示
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">読み込み中...</p>
      </div>
    );
  }

  // 顧客情報が取得できなかった場合の表示
  if (!customerInfo) {
     return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-red-500">顧客情報が見つかりません。</p>
      </div>
    );
  }

  return (
    <>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4 mx-auto">
        <div className="m-4 card bordered bg-blue-200">
          {/* formタグにonSubmitを直接指定 */}
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <h2 className="card-title">
                <p>
                  {/* 6. 「制御コンポーネント」に変更 */}
                  <input
                    type="text"
                    name="customer_name"
                    value={customerInfo.customer_name || ''}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                  さん
                </p>
              </h2>
              <p>
                Customer ID:
                <input
                  type="text"
                  name="customer_id"
                  value={customerInfo.customer_id || ''}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </p>
              <p>
                Age:
                <input
                  type="number"
                  name="age"
                  value={customerInfo.age || ''}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </p>
              <p>
                Gender:
                <input
                  type="text"
                  name="gender"
                  value={customerInfo.gender || ''}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </p>
            </div>
            {/* 7. エラーメッセージの表示 */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex justify-center">
              {/* 8. 送信中はボタンを無効化 */}
              <button 
                type="submit"
                className="btn btn-primary m-4 text-2xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "更新中..." : "更新"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}