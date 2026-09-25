# わんぽ デモ

ハッカソン審査用の静的Webデモです。架空施設と保護犬を選び、7日間の空き枠から60分の散歩を予約できます。複数予約、競合表示、次の約束、活動記録をブラウザ内だけで体験できます。

## ローカル確認

```sh
npx serve .
```

予約はブラウザの `localStorage`（キー：`wanpo-bookings-v2`）に配列として保存されます。ログイン、決済、本番バックエンドはありません。

## 写真クレジット

- Mariia Mariia / Unsplash
- Tom Hills / Unsplash
- Patrick Hendry / Unsplash

詳細はアプリ内の「写真の出典」を参照してください。
