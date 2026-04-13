# 設計: PPTX生成API MVP

## アーキテクチャ

```
pptx-api/
├── main.py              # FastAPIアプリ・エントリーポイント
├── templates/           # テンプレートPPTXファイル
│   ├── T81.pptx
│   ├── T59.pptx
│   ├── T62.pptx
│   ├── T66.pptx
│   └── T72.pptx
├── template_defs/       # ゾーン制約定義（JSON）
│   └── templates.json
├── builder.py           # PPTX生成ロジック
└── requirements.txt
```

## テンプレート設計方針

### ゾーンの実装方式

python-pptxでshapeをzone名で特定して書き込む。
**テンプレートPPTXファイルはpython-pptxで動的に生成**する（既成ファイル不要）。

各テンプレートに対して `builder.py` 内に専用ビルダー関数を定義：

```python
def build_T81(slide, zones: dict) -> None:
    """T81: 表紙・センター型"""
    # title, subtitle ゾーンを書き込む
```

### テンプレートのゾーン設計

#### T81（表紙・センター型）
| zone名 | 内容 | char_limit | min_chars |
|--------|------|-----------|-----------|
| zone1 | メインタイトル | 40 | 5 |
| zone2 | サブタイトル | 60 | 0 |
| zone3 | 会社名・日付 | 30 | 0 |

#### T59（課題・ギャップ型）
| zone名 | 内容 | char_limit | min_chars |
|--------|------|-----------|-----------|
| zone1 | スライドタイトル | 20 | 5 |
| zone2 | 実情ラベル | 10 | 2 |
| zone3 | 実情テキスト | 120 | 20 |
| zone4 | ありたい姿ラベル | 10 | 2 |
| zone5 | ありたい姿テキスト | 120 | 20 |
| zone6 | 矢印中央テキスト（ギャップ） | 30 | 5 |

#### T62（サービス機能一覧・3カラム）
| zone名 | 内容 | char_limit | min_chars |
|--------|------|-----------|-----------|
| zone1 | スライドタイトル | 20 | 5 |
| zone2 | 機能1タイトル | 15 | 3 |
| zone3 | 機能1説明 | 80 | 20 |
| zone4 | 機能2タイトル | 15 | 3 |
| zone5 | 機能2説明 | 80 | 20 |
| zone6 | 機能3タイトル | 15 | 3 |
| zone7 | 機能3説明 | 80 | 20 |

#### T66（導入事例・インタビュー形式）
| zone名 | 内容 | char_limit | min_chars |
|--------|------|-----------|-----------|
| zone1 | スライドタイトル | 20 | 5 |
| zone2 | 企業名・役職 | 30 | 5 |
| zone3 | 課題（Before） | 100 | 20 |
| zone4 | 解決（After） | 100 | 20 |
| zone5 | 効果・数値 | 60 | 10 |

#### T72（ネクストステップ）
| zone名 | 内容 | char_limit | min_chars |
|--------|------|-----------|-----------|
| zone1 | スライドタイトル | 20 | 5 |
| zone2 | メインCTA | 40 | 10 |
| zone3 | ステップ1 | 50 | 5 |
| zone4 | ステップ2 | 50 | 5 |
| zone5 | ステップ3 | 50 | 5 |
| zone6 | 特典・補足 | 80 | 0 |

## APIレスポンス設計

### GET /templates

```json
{
  "templates": [
    {
      "id": "T81",
      "name": "表紙・センター型",
      "use_when": "表紙スライド",
      "zones": [
        {
          "name": "zone1",
          "description": "メインタイトル",
          "char_limit": 40,
          "min_chars": 5,
          "max_lines": 2,
          "min_lines": 1,
          "line_char_limit": 20
        }
      ]
    }
  ]
}
```

### POST /build

- Request: `Content-Type: application/json` + スライドJSON
- Response: `Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation`
- BodyにPPTXバイナリを直接返す

## スタイル方針

MVP段階なので装飾よりも**構造の正確さ**を優先する：
- 背景: 白
- テキスト: 黒（タイトルは大きめ）
- レイアウトはZone定義に沿った位置に配置
- python-pptxのEMU単位でレイアウト定義

## pptx-buildスキルとの接続

SKILL.mdの `PPTX_API_KEY` と API URL を自社サーバーに向け直すだけで動作するよう設計する。
MVP時点では認証なし（ローカル専用）とし、`PPTX_API_KEY` チェックはAPIサーバー側でスキップ。
