export default async function fetchCustomers() {
  console.log(
    "Fetching from API Endpoint:",
    process.env.NEXT_PUBLIC_API_ENDPOINT
  );

  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  // リクエスト先のURLは、必ず "/allcustomers" になっている必要があります
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/allcustomers",
    {
      cache: "no-cache",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch customers");
  }
  return res.json();
}
