# ZPK 2

マイクラ統合版用のアスレ補助アドオンです  
[ここからダウンロード](https://github.com/mihiro13/ZPK_2/releases/latest)

## 導入

アドオンをダウンロードし、ワールドに適応してください。必ず`Beta API`をオンにしてください。

## 設定

`/mpk:gui` で表示するラベルの設定  
`/mpk:config` でその他の設定  
`/mpk:lb` でLBの設定  
ができます

## 機能

- Label  
プレイヤーの座標などの情報をアクションバーに表示します。詳しくは割愛  
- LB (Landing Block) & Offset  
なんか座標からの距離がみれるやつ  
    - 設定方法  
    設定したいブロックにのって`/mpk:setlb` か  
    設定したいブロックを向いて`/mpk:setlb target` または  
    看板に `/setlb x y z <lb_type: "z" | "x" | "both" | "zneo"> <inverse_lb: "z" | "x" | "both">"` を入力し右クリック  
    例  `/setlb 1.3 0.5 2.3 both`  
    看板のsetlbは座標を直接指定するものですが、`/mpk:setlb` はブロックに対して設定するので挙動が変わる可能性があります
- Checkpoint  
そのまま。チェックポイントを設定したり戻ったりできる。  
    - チェックポイントを設定  
    `/scriptevent zpk:cp x y z yaw pitch`で最も近いプレイヤーにチェックポイントを設定(セレクターが指定されている場合はそのプレイヤー)  
    `Set Checkpoint Item` (デフォルト: エメラルド) を右クリック
    - チェックポイントに戻る  
    `Checkpoint Item` (デフォルト: 赤色の染料) を右クリック
- Practice  
練習モードがつかえます。。
`Practice Item` (スライムボール) を右クリックで開始  
詳しい説明はカットで