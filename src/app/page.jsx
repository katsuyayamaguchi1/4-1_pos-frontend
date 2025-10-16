// src/app/page.jsx

'use client'; 

import { useState } from 'react';

export default function PosPage() {
  const [productCode, setProductCode] = useState(''); 
  const [productInfo, setProductInfo] = useState(null); 
  const [purchaseList, setPurchaseList] = useState([]); 

  const handleReadCode = async () => {
    if (!productCode) {
      alert('商品コードを入力してください。');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${productCode}`);
      if (!res.ok) {
        alert('商品がマスタ未登録です');
        setProductInfo(null);
        return;
      }
      const data = await res.json();
      setProductInfo(data);
    } catch (error) {
      console.error('通信エラー:', error);
      alert('サーバーとの通信に失敗しました。');
    }
  };

  const handleAddToList = () => {
    if (!productInfo) {
      alert('まず商品を読み込んでください。');
      return;
    }
    setPurchaseList([...purchaseList, productInfo]);
    setProductCode('');
    setProductInfo(null);
  };
  
  const handlePurchase = async () => {
    if (purchaseList.length === 0) {
      alert('商品が購入リストに追加されていません。');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: purchaseList }),
      });
      if (!res.ok) {
        throw new Error('購入処理に失敗しました。');
      }
      const result = await res.json();
      alert(`購入が完了しました。\n合計金額は ${result.total_amount} 円です。`);
      setPurchaseList([]);
      setProductCode('');
      setProductInfo(null);
    } catch (error) {
      console.error('購入エラー:', error);
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">POSシステム</h1>
      <div className="grid grid-cols-2 gap-4">

        {/* 左側：商品入力エリア */}
        {/* ★★★★★★★【修正点】flex flex-col を追加 ★★★★★★★ */}
        <div className="border p-4 rounded-lg flex flex-col">
          {/* ★★★★★★★【修正点】divで囲み、flex-grow を追加 ★★★★★★★ */}
          <div className="flex-grow">
            <h2 className="text-xl mb-2">商品入力</h2>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="input input-bordered w-full"
                placeholder="1"
              />
              <button onClick={handleReadCode} className="btn btn-primary">
                読み込み
              </button>
            </div>
            <div className="form-control mb-2">
              <label className="label"><span className="label-text">商品名</span></label>
              <div className="border p-2 rounded bg-gray-100 min-h-[40px]">
                {productInfo?.PRD_NAME || '...'}
              </div>
            </div>
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">単価</span></label>
              <div className="border p-2 rounded bg-gray-100 min-h-[40px]">
                {productInfo?.PRD_PRICE ? `${productInfo.PRD_PRICE}円` : '...'}
              </div>
            </div>
          </div>
          <button onClick={handleAddToList} className="btn btn-secondary w-full">
            追加
          </button>
        </div>

        {/* 右側：購入リストエリア */}
        {/* ★★★★★★★【修正点】flex flex-col を追加 ★★★★★★★ */}
        <div className="border p-4 rounded-lg flex flex-col">
          {/* ★★★★★★★【修正点】divで囲み、flex-grow を追加 ★★★★★★★ */}
          <div className="flex-grow">
            <h2 className="text-xl mb-2">購入リスト</h2>
            <div className="bg-white p-2 border rounded min-h-[200px] mb-2">
              {purchaseList.length === 0 ? (
                <p className="text-gray-400">商品が追加されていません</p>
              ) : (
                <ul>
                  {purchaseList.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.PRD_NAME}</span>
                      <span>{item.PRD_PRICE}円</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button onClick={handlePurchase} className="btn btn-success w-full">
            購入
          </button>
        </div>

      </div>
    </div>
  );
}