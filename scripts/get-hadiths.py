import pandas as pd
import json

# Charger le fichier Excel et afficher les colonnes disponibles
def excel_to_json(excel_file, json_file, colonnes):
    # Lire le fichier Excel avec l'encodage approprié
    df = pd.read_excel(excel_file, engine='openpyxl')

    # Afficher les colonnes disponibles dans le fichier Excel
    print("Colonnes disponibles dans le fichier Excel :")
    print(df.columns)

    # Sélectionner uniquement les colonnes spécifiques
    try:
        df = pd.read_excel(excel_file, usecols=colonnes, engine='openpyxl')
    except ValueError as e:
        print("Erreur de sélection des colonnes : ", e)
        return

    # Convertir le DataFrame en liste de dictionnaires
    data = df.to_dict(orient='records')

    # Sauvegarder les données dans un fichier JSON
    with open(json_file, 'w', encoding='utf-8') as json_f:
        json.dump(data, json_f, indent=4, ensure_ascii=False)

# Exemple d'utilisation
excel_file = '/Users/macbookpro/Downloads/HadeethEnc.com_fr-v1.5.0.xlsx'  # Remplacer par votre fichier Excel
json_file = 'hadiths.json'       # Le fichier JSON de sortie
colonnes = ['hadith_text_ar', 'hadith_text', 'grade', 'takhrij']  # Colonnes à extraire
excel_to_json(excel_file, json_file, colonnes)
