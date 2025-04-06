import requests
import json

# URL vers le JSON complet
url = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_transliteration.json"

# Récupération du JSON
response = requests.get(url)
data = response.json()

# Construction du format : { sourate_id: [ {id, text, transliteration}, ... ] }
result = {}

for sourate in data:
    sourate_id = str(sourate["id"])
    result[sourate_id] = [
        {
            "id": verse["id"],
            "transliteration": verse["transliteration"]
        }
        for verse in sourate.get("verses", [])
    ]

# Sauvegarde dans un fichier
with open("transliterations_by_sourate.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("✅ Export terminé dans 'transliterations_by_sourate.json'")
