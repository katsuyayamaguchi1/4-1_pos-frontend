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
        {/* 左側 */}
        <div className="border p-4 rounded-lg">
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
          {/* ★★★★★★★【ここから修正】★★★★★★★ */}
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
          {/* ★★★★★★★【ここまで修正】★★★★★★★ */}
          <button onClick={handleAddToList} className="btn btn-secondary w-full">
            追加
          </button>
        </div>
        {/* 右側 */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl mb-2">購入リスト</h2>
          <div className="bg-white p-2 border rounded min-h-[200px] mb-2">
            {purchaseList.length === 0 ? (
              <p className="text-gray-400">商品が追加されていません</p>
            ) : (
              <ul>
                {/* ★★★★★★★【ここも修正】★★★★★★★ */}
                {purchaseList.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.PRD_NAME}</span>
                    <span>{item.PRD_PRICE}円</span>
                  </li>
                ))}
                {/* ★★★★★★★【ここまで修正】★★★★★★★ */}
              </ul>
            )}
          </div>
          <button onClick={handlePurchase} className="btn btn-success w-full">
            購入
          </button>
        </div>
      </div>
    </div>
  );
}


// 以下、STEP3

// src/app/page.jsx

// 'use client'; // useStateを使うため、クライアントコンポーネントとして宣言

// import { useState } from 'react';

// export default function PosPage() {
//   // 状態管理のためのuseStateフック
//   const [productCode, setProductCode] = useState(''); // ①コード入力エリア
//   const [productInfo, setProductInfo] = useState(null); // ③名称表示エリア, ④単価表示エリア
//   const [purchaseList, setPurchaseList] = useState([]); // ⑥購入品目リスト

//   // TODO: ステップ2で実装
//   const handleReadCode = () => {
//     console.log('読み込みボタンが押されました:', productCode);
//     // ここでバックエンドの「商品検索API」を呼び出す
//   };

//   // TODO: ステップ3で実装
//   const handleAddToList = () => {
//     console.log('追加ボタンが押されました');
//     // ここで購入リストに商品を追加する
//   };
  
//   // TODO: ステップ4で実装
//   const handlePurchase = () => {
//     console.log('購入ボタンが押されました');
//     // ここで購入リストをバックエンドの「購入API」に送信する
//   };


//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">POSシステム</h1>
      
//       <div className="grid grid-cols-2 gap-4">
//         {/* 左側：商品入力エリア */}
//         <div className="border p-4 rounded-lg">
//           <h2 className="text-xl mb-2">商品入力</h2>
//           <div className="flex items-center gap-2 mb-2">
//             <input
//               type="text"
//               value={productCode}
//               onChange={(e) => setProductCode(e.target.value)}
//               className="input input-bordered w-full" // ①コード入力エリア
//               placeholder="12345678901"
//             />
//             <button onClick={handleReadCode} className="btn btn-primary">
//               読み込み {/* ②読み込みボタン */}
//             </button>
//           </div>
          
//           <div className="form-control mb-2">
//             <label className="label">
//               <span className="label-text">商品名</span>
//             </label>
//             <div className="border p-2 rounded bg-gray-100 min-h-[40px]">
//               {productInfo?.NAME || '...'} {/* ③名称表示エリア */}
//             </div>
//           </div>
          
//           <div className="form-control mb-4">
//             <label className="label">
//               <span className="label-text">単価</span>
//             </label>
//             <div className="border p-2 rounded bg-gray-100 min-h-[40px]">
//               {productInfo?.PRICE ? `${productInfo.PRICE}円` : '...'} {/* ④単価表示エリア */}
//             </div>
//           </div>

//           <button onClick={handleAddToList} className="btn btn-secondary w-full">
//             追加 {/* ⑤購入リストへ追加ボタン */}
//           </button>
//         </div>

//         {/* 右側：購入リストエリア */}
//         <div className="border p-4 rounded-lg">
//           <h2 className="text-xl mb-2">購入リスト</h2>
//           <div className="bg-white p-2 border rounded min-h-[200px] mb-2">
//             {/* ⑥購入品目リスト */}
//             {purchaseList.length === 0 ? (
//               <p className="text-gray-400">商品が追加されていません</p>
//             ) : (
//               <ul>
//                 {purchaseList.map((item, index) => (
//                   <li key={index} className="flex justify-between">
//                     <span>{item.NAME}</span>
//                     <span>{item.PRICE}円</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//           <button onClick={handlePurchase} className="btn btn-success w-full">
//             購入 {/* ⑦購入ボタン */}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// // 以下、STEP３

// // export default function Home() {
// //   return <h1>Hello World</h1>
// // }