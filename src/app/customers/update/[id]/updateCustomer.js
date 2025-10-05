export default async function updateCustomer(formData) {
  const updated_customer_name = formData.get("customer_name");
  const updated_customer_id = formData.get("customer_id");
  const ageValue = formData.get("age");
  const updated_age = ageValue ? parseInt(ageValue, 10) : null;
  const updated_gender = formData.get("gender");

  const body_msg = JSON.stringify({
    customer_name: updated_customer_name,
    customer_id: updated_customer_id,
    age: updated_age,
    gender: updated_gender,
  });

  console.log("Sending to API:", body_msg);

  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  // ここを /customer から /customers に変更しました！
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/customers`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body_msg,
  });

  if (!res.ok) {
    let errorMessage = `API Error: Status Code ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage += `, Message: ${JSON.stringify(errorData)}`;
    } catch (e) {
      const errorText = await res.text();
      errorMessage += `, Body: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  // 成功した場合はレスポンスを返す
  return await res.json();
}
