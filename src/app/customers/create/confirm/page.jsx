'use client';  // ★最初に置く

// SSR/プリレンダを無効化（任意：必要なら残す）
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OneCustomerInfoCard from '@/app/components/one_customer_info_card.jsx';
import fetchCustomer from './fetchCustomer';

// Hooks を使う本体
function ConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customer_id = searchParams.get('customer_id');
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (!customer_id) return;
    (async () => {
      const data = await fetchCustomer(customer_id);
      setCustomer(data);
    })();
  }, [customer_id]);

  return (
    <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
      <div className="alert alert-success p-4 text-center">正常に作成しました</div>
      {customer && <OneCustomerInfoCard {...customer} />}
      <button onClick={() => router.push('/customers')}>
        <div className="btn btn-primary m-4 text-2xl">戻る</div>
      </button>
    </div>
  );
}

// Suspense でラップ（ビルドが通りにくい場合は外してもOK）
export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="m-4">読み込み中...</div>}>
      <ConfirmInner />
    </Suspense>
  );
}
