import urllib.request, json, os, sys
from datetime import datetime

API_URL = "https://pptx-api-506729517706.asia-northeast1.run.app"
API_KEY = os.environ.get("PPTX_API_KEY", "")
if not API_KEY:
    print("ERROR: 環境変数 PPTX_API_KEY が設定されていません")
    sys.exit(1)

if len(sys.argv) < 3:
    print("Usage: python build_via_api.py <outline.json> <output.pptx>")
    sys.exit(1)

json_path = sys.argv[1]
output_path = sys.argv[2]

with open(json_path, encoding="utf-8") as f:
    slides_data = json.load(f)

body = json.dumps(slides_data, ensure_ascii=False).encode("utf-8")
req = urllib.request.Request(
    f"{API_URL}/build",
    data=body,
    headers={
        "X-API-Key": API_KEY,
        "Content-Type": "application/json"
    }
)
try:
    with urllib.request.urlopen(req, timeout=120) as resp:
        with open(output_path, "wb") as f:
            f.write(resp.read())
    print(f"SAVED:{output_path}")
except urllib.error.HTTPError as e:
    body_text = e.read().decode("utf-8", errors="replace")
    print(f"ERROR: {e.code} - {body_text}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
