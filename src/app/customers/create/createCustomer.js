// サーバーアクションとして定義
"use server";

export default async function createCustomer(formData) {
  const creating_customer_name = formData.get("customer_name");
  // IDもフォームから取得
  const creating_customer_id = formData.get("customer_id"); 
  const creating_age = parseInt(formData.get("age"));
  const creating_gender = formData.get("gender");

  const body_msg = JSON.stringify({
    customer_id: creating_customer_id, // JSONにIDを含める
    customer_name: creating_customer_name,
    age: creating_age,
    gender: creating_gender,
  });

  const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body_msg,
  });

  // ★★★★★★★★★★★★★★★ ここから修正 ★★★★★★★★★★★★★★★
  if (!res.ok) {
    // サーバーから返されたエラーメッセージを取得
    const errorData = await res.json();
    // エラーメッセージを投げる
    throw new Error(errorData.detail || "顧客の作成に失敗しました。");
  }
  // ★★★★★★★★★★★★★★★ ここまで修正 ★★★★★★★★★★★★★★★

  const createdCustomer = await res.json();
  return createdCustomer;
}