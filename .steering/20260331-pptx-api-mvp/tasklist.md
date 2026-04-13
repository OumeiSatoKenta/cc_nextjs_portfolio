# タスクリスト: PPTX生成API MVP

## フェーズ1: プロジェクトセットアップ

- [ ] `pptx-api/` ディレクトリを作成
- [ ] `requirements.txt` を作成（fastapi, uvicorn, python-pptx）
- [ ] `main.py` のスケルトンを作成（FastAPIアプリ + 2エンドポイント定義）

## フェーズ2: テンプレート定義

- [ ] `template_defs/templates.json` を作成（5テンプレートのゾーン制約定義）
- [ ] `GET /templates` エンドポイントを実装（templates.jsonを返す）

## フェーズ3: PPTXビルダー実装

- [ ] `builder.py` のベース構造を実装（`build_slide()` ディスパッチ関数）
- [ ] T81ビルダーを実装（表紙・センター型）
- [ ] T59ビルダーを実装（課題・ギャップ型）
- [ ] T62ビルダーを実装（サービス機能一覧・3カラム）
- [ ] T66ビルダーを実装（導入事例・インタビュー形式）
- [ ] T72ビルダーを実装（ネクストステップ）

## フェーズ4: /build エンドポイント実装

- [ ] `POST /build` エンドポイントを実装（JSONを受け取りPPTXバイナリを返す）
- [ ] 全スライドをループしてbuilder.pyを呼び出す処理を実装

## フェーズ5: 動作確認

- [ ] サーバー起動確認（`uvicorn main:app --reload`）
- [ ] `GET /templates` の動作確認（curlまたはブラウザ）
- [ ] テスト用JSONで `POST /build` を実行してPPTXを取得
- [ ] 生成されたPPTXをPowerPointで開いて内容確認
- [ ] pptx-buildスキルのAPI URLを `http://localhost:8000` に変更して動作確認

## フェーズ6: スキル更新

- [ ] `pptx-build/scripts/get_templates.py` のAPIURLを変数化（環境変数 `PPTX_API_URL` 対応）
- [ ] `pptx-build/scripts/build_via_api.py` のAPIURLを変数化
- [ ] `pptx-build/SKILL.md` の説明を自社APIに合わせて更新

---

## 実装後の振り返り

（実装完了後に記入）

- 実装完了日:
- 計画と実績の差分:
- 学んだこと:
- 次回への改善提案:
