# sanitize_history.py
import json, re, sys

IN = "history.json"
OUT = "history.json"

with open(IN, "r", encoding="utf-8") as f:
    raw = f.read()

# replace bare NaN/Infinity/-Infinity with null
# safe-ish approach: regex match unquoted NaN/Infinity
clean = re.sub(r'(?<=[:\s,\[\{])NaN(?=[\s,\]\}])', 'null', raw)
clean = re.sub(r'(?<=[:\s,\[\{])Infinity(?=[\s,\]\}])', 'null', clean)
clean = re.sub(r'(?<=[:\s,\[\{])-Infinity(?=[\s,\]\}])', 'null', clean)

# try parse to ensure valid JSON
data = json.loads(clean)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Sanitized history.json — NaN/Infinity replaced with null.")
