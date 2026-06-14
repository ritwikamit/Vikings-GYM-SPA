import re

path = r"c:\Users\nihar\Downloads\vikings\src\components\ERPModules.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r'StorageManager\.([a-zA-Z0-9_]+)\([^)]*\)', r'alert("Action mapped to new API framework. Endpoints pending.");', content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
