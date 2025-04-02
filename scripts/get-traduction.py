import requests
import json

# Configuration
api_url = "https://quranenc.com/api/v1/translation/sura/french_hameedullah/"
nombre_appels = 114
resultats = {}

# Boucle d'appels API
for i in range(1, nombre_appels + 1):  # 1 à 114
    print("sourate " + str(i))
    response = requests.get(api_url + str(i))

    if response.status_code == 200:
        data = response.json()

        # Vérifier que "result" existe et est une liste
        if "result" in data and isinstance(data["result"], list):
            # Supprimer la clé "sura" dans chaque élément de la liste
            for item in data["result"]:
                item.pop("id", None)
                item.pop("sura", None)
                item.pop("footnotes", None)
                item.pop("arabic_text", None)  

            # Ajouter au dictionnaire avec le numéro de sourate comme clé
            resultats[str(i)] = data["result"]
        else:
            print(f"Format inattendu pour la sourate {i}")
    else:
        print(f"Erreur sur la sourate {i}: {response.status_code}")

# Sauvegarde en fichier JSON
with open("resultats.json", "w", encoding="utf-8") as f:
    json.dump(resultats, f, ensure_ascii=False, indent=2)

print("Fichier JSON généré: resultats.json")
