import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
print("API KEY =", os.getenv("GROQ_API_KEY"))

print("🚀 agent.py started")


# --------------------------------------------------
# CONFIG
# --------------------------------------------------
INPUT_FILE = "input_report.txt"
OUTPUT_FILE = "extracted_features.json"

# --------------------------------------------------
# LOAD ENV
# --------------------------------------------------
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found. Check your .env file.")

client = Groq(api_key=api_key)

# --------------------------------------------------
# READ INPUT TEXT
# --------------------------------------------------
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    input_text = f.read().strip()

if not input_text:
    raise ValueError("Input file is empty.")

# --------------------------------------------------
# PROMPT
# --------------------------------------------------
prompt = f"""
Vous êtes un expert en extraction de données biomédicales.

Votre UNIQUE sortie doit être un JSON VALIDE contenant EXACTEMENT
les 30 caractéristiques suivantes.

Si une valeur n'est pas présente, mettez null.

TEXTE À ANALYSER :
{input_text}

CLÉS OBLIGATOIRES :
['radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean', 'smoothness_mean',
 'compactness_mean', 'concavity_mean', 'concave points_mean', 'symmetry_mean', 'fractal_dimension_mean',
 'radius_se', 'texture_se', 'perimeter_se', 'area_se', 'smoothness_se',
 'compactness_se', 'concavity_se', 'concave points_se', 'symmetry_se', 'fractal_dimension_se',
 'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst', 'smoothness_worst',
 'compactness_worst', 'concavity_worst', 'concave points_worst', 'symmetry_worst', 'fractal_dimension_worst']

RÈGLE ABSOLUE :
- JSON UNIQUEMENT
- AUCUN TEXTE
"""

# --------------------------------------------------
# CALL MODEL
# --------------------------------------------------
response = client.chat.completions.create(
    model="qwen/qwen3-32b",
    messages=[{"role": "user", "content": prompt}],
    temperature=0,
    max_completion_tokens=2048
)

raw_output = response.choices[0].message.content.strip()

# --------------------------------------------------
# EXTRACT JSON ONLY (SAFE)
# --------------------------------------------------
def extract_json(text: str) -> dict:
    """
    Extract first valid JSON object from text.
    """
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in model output.")

    return json.loads(match.group())

features = extract_json(raw_output)

# --------------------------------------------------
# SAVE OUTPUT
# --------------------------------------------------
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(features, f, indent=2, ensure_ascii=False)

print("✅ Extraction terminée.")
print(f"📁 Résultat sauvegardé dans : {OUTPUT_FILE}")
