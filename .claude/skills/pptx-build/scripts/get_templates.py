import urllib.request, json, os, sys

API_URL = "https://pptx-api-506729517706.asia-northeast1.run.app"
API_KEY = os.environ.get("PPTX_API_KEY", "")
if not API_KEY:
    print("ERROR: 環境変数 PPTX_API_KEY が設定されていません。設定してからやり直してください。")
    sys.exit(1)

req = urllib.request.Request(
    f"{API_URL}/templates",
    headers={"X-API-Key": API_KEY}
)
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    with open("/tmp/templates_index.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print("OK: テンプレート取得完了")
except urllib.error.HTTPError as e:
    print(f"ERROR: APIキーが無効か、サーバーエラーです（{e.code}）")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
