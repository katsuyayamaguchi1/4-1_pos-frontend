// src/app/customers/create/confirm/page.jsx

export const dynamic = 'force-dynamic'; // ← プリレンダ無効（動的レンダリング）
export const revalidate = 0;

'use client';

import { Suspense } from 'react';
import OneCustomerInfoCard from '@/app/components/one_customer_info_card.jsx';
import fetchCustomer from './fetchCustomer';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// useSearchParams を使う本体
function ConfirmInner() {
  const router = useRouter();
  const params = useSearchParams();
  const customer_id = params.get('customer_id');
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // id がまだ取れていない瞬間をケア
    if (!customer_id) return;
    (async () => {
      const customerData = await fetchCustomer(customer_id);
      setCustomer(customerData);
    })();
  }, [customer_id]);

  return (
    <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
      <div className="alert alert-success p-4 text-center">正常に作成しました</div>

      {/* 取得前の一瞬はプレースホルダ表示に */}
      {customer ? (
        <OneCustomerInfoCard {...customer} />
      ) : (
        <div className="p-4">読み込み中...</div>
      )}

      {/* 相対パスより /customers の絶対パスが安全 */}
      <button onClick={() => router.push('/customers')}>
        <div className="btn btn-primary m-4 text-2xl">戻る</div>
      </button>
    </div>
  );
}

// ✅ useSearchParams を使うコンポーネントを Suspense でラップ
export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  );
}
