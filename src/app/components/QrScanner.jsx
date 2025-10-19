"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const QrScanner = ({ onScanSuccess, onScanFailure }) => {
  useEffect(() => {
    // 画面に表示されるスキャナのUIを作成
    const scanner = new Html5QrcodeScanner(
      "qr-reader-container", // このIDを持つdiv要素にスキャナが表示される
      {
        qrbox: { width: 250, height: 250 }, // スキャン領域のサイズ
        fps: 10, // 1秒あたりのスキャン回数
      },
      false // trueにすると詳細ログが出る
    );

    // スキャン成功時と失敗時の処理を定義
    scanner.render(onScanSuccess, onScanFailure);

    // コンポーネントが非表示になるときにカメラを停止する
    return () => {
      scanner.clear().catch((error) => {
        console.error("スキャナの停止に失敗しました。", error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  // スキャナを表示するための「土台」となるdiv要素
  return <div id="qr-reader-container" />;
};

export default QrScanner;
