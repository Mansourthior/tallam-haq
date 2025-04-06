import pandas as pd
import json
import requests
from tqdm import tqdm

# Étape 1 : Charger l'Excel et filtrer les colonnes
def excel_to_dataframe(excel_file, colonnes):
    df = pd.read_excel(excel_file, usecols=colonnes, engine='openpyxl')
    return df.to_dict(orient='records')

# Étape 2 : Récupérer toutes les catégories
def fetch_categories():
    url = "https://hadeethenc.com/api/v1/categories/list/?language=fr"
    response = requests.get(url)
    response.raise_for_status()
    categories = response.json()
    return {cat['id']: cat['title'] for cat in categories}

# Étape 3 : Récupérer les catégories de chaque hadith via le lien
def enrich_with_categories(data, category_map):
    enriched_data = []
    for entry in tqdm(data, desc="Traitement des hadiths"):
        try:
            response = requests.get('https://hadeethenc.com/api/v1/hadeeths/one/?language=fr&id=' + str(entry.get('id')))
            response.raise_for_status()
            hadith_details = response.json()
            cat_ids = hadith_details.get("categories", [])
            cat_titles = [category_map.get(cat_id, f"Catégorie inconnue ({cat_id})") for cat_id in cat_ids]
            entry["categories"] = cat_titles
        except Exception as e:
            print(f"Erreur avec le lien: {e}")
            entry["categories"] = []

        # Supprimer le champ "link"
        entry.pop("link", None)
        enriched_data.append(entry)
    return enriched_data

# Étape 4 : Sauvegarder le JSON final
def save_json(data, json_file):
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# Exemple d'utilisation
excel_file = '/Users/macbookpro/Downloads/HadeethEnc.com_fr-v1.5.0.xlsx'
json_file = 'hadiths_final.json'
colonnes = ['id', 'title', 'hadith_text_ar', 'hadith_text', 'grade', 'takhrij']

# Pipeline
data = excel_to_dataframe(excel_file, colonnes)
category_map = fetch_categories()
enriched_data = enrich_with_categories(data, category_map)
save_json(enriched_data, json_file)
