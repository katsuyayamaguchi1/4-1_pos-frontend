// src/app/page.jsx

'use client'; 

// 1. useCallback をインポート
import { useState, useCallback } from 'react';
// 2. スキャナコンポーネントをインポート
import QrScanner from '@/app/components/QrScanner'; 

export default function PosPage() {
  const [productCode, setProductCode] = useState(''); 
  const [productInfo, setProductInfo] = useState(null); 
  const [purchaseList, setPurchaseList] = useState([]); 
  // 3. スキャナの表示状態を管理
  const [isScannerOpen, setIsScannerOpen] = useState(false); 

  // 4. handleReadCode を useCallback で囲む
  const handleReadCode = useCallback(async (code) => { 
    if (!code) { 
      alert('商品コードを入力してください。');
      return;
    }
    
    // スキャンされたコードを state に反映
    setProductCode(code); 
    
    try {
      // 引数の 'code' を使う
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${code}`); 
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
  }, []); // 空の依存配列

  const handleAddToList = () => {
    if (!productInfo) {
      alert('まず商品を読み込んでください。');
      return;
    }
    setPurchaseList([...purchaseList, productInfo]);
    setProductCode(''); // 商品追加後、コード表示をリセット
    setProductInfo(null); // 商品追加後、商品名・単価表示をリセット
  };
  
  const handlePurchase = async () => {
    console.log("handlePurchase function called"); 

    if (purchaseList.length === 0) {
      alert('商品が購入リストに追加されていません。');
      return;
    }

    const payload = {
      products: purchaseList.map(p => ({
        PRD_ID: p.PRD_ID,
        PRD_CODE: String(p.PRD_CODE), 
        PRD_NAME: p.PRD_NAME,
        PRD_PRICE: p.PRD_PRICE,
      })),
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2)); 

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), 
      });

      if (!res.ok) {
        let msg = '購入処理に失敗しました。';
        try {
          const err = await res.json();
          if (err?.detail?.[0]?.msg) msg = `購入処理に失敗：${err.detail[0].msg}`;
        } catch (_) {}
        throw new Error(msg);
      }
      
      const result = await res.json();
      
      alert(
        `購入が完了しました。\n\n` +
        `合計金額 (税込): ${result.total_amount} 円\n` +
        `合計金額 (税抜): ${result.total_amount_ex_tax} 円`
      );

      setPurchaseList([]);
      setProductCode('');
      setProductInfo(null);
    } catch (error) {
      console.error('Purchase error caught:', error); 
      alert(error.message); 
    }
  };

  // 5. handleScanSuccess を useCallback で囲む
  const handleScanSuccess = useCallback((decodedText, decodedResult) => {
    // スキャナを閉じる
    setIsScannerOpen(false); 
    // 読み取ったコードで、既存の商品検索処理を呼び出す
    handleReadCode(decodedText); 
  }, [handleReadCode]); // 依存配列に handleReadCode を指定

  // 6. handleScanFailure も useCallback で囲む
  const handleScanFailure = useCallback((error) => {
    console.warn("QRスキャン失敗:", error);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">POSシステム</h1>

      {/* 7. スキャナ表示エリア */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h2 className="text-xl mb-4">バーコード/QRコードをスキャン</h2>
            <div className="w-full">
              <QrScanner
                onScanSuccess={handleScanSuccess}
                onScanFailure={handleScanFailure}
              />
            </div>
            <button 
              onClick={() => setIsScannerOpen(false)} 
              className="btn btn-error w-full mt-4"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* 左側 */}
        <div className="border p-4 rounded-lg flex flex-col">
          <div className="flex-grow">
            {/* 8. ラベルを「商品コード」に変更 */}
            <h2 className="text-xl mb-2">商品コード</h2> 
            <div className="flex items-center gap-2 mb-2">
              {/* 9. スキャンボタンを左に配置 */}
              <button onClick={() => setIsScannerOpen(true)} className="btn btn-primary">
                スキャン（カメラ）
              </button>
              {/* 10. スキャンされたコードを表示するエリア */}
              <div className="border p-2 rounded bg-gray-100 min-h-[40px] flex-grow text-center font-mono text-lg">
                {productCode || '...'} {/* productCode state を表示 */}
              </div>
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

        {/* 右側 */}
        <div className="border p-4 rounded-lg flex flex-col">
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