"""
Feature extraction module using Groq AI
"""
import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def extract_features_from_text(input_text: str, api_key: str = None) -> dict:
    """
    Extract 30 breast cancer features from medical report text using Groq AI.
    
    Args:
        input_text: Medical report text
        api_key: Groq API key (optional, will use env var if not provided)
    
    Returns:
        Dictionary with 30 features
    """
    if not api_key:
        api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        raise ValueError("GROQ_API_KEY not found. Check your .env file.")
    
    if not input_text or not input_text.strip():
        raise ValueError("Input text is empty.")
    
    client = Groq(api_key=api_key)
    
    # Prompt for feature extraction
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
    
    # Call Groq API
    response = client.chat.completions.create(
        model="qwen/qwen3-32b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_completion_tokens=2048
    )
    
    raw_output = response.choices[0].message.content.strip()
    
    # Extract JSON from response
    def extract_json(text: str) -> dict:
        """Extract first valid JSON object from text."""
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise ValueError("No JSON object found in model output.")
        return json.loads(match.group())
    
    features = extract_json(raw_output)
    
    # Normalize keys (handle potential LLM inconsistencies)
    key_mapping = {
        # Mean
        "mean radius": "radius_mean", "mean texture": "texture_mean", "mean perimeter": "perimeter_mean",
        "mean area": "area_mean", "mean smoothness": "smoothness_mean", "mean compactness": "compactness_mean",
        "mean concavity": "concavity_mean", "mean concave points": "concave points_mean", "mean symmetry": "symmetry_mean",
        "mean fractal dimension": "fractal_dimension_mean",
        # Error / SE
        "radius error": "radius_se", "texture error": "texture_se", "perimeter error": "perimeter_se",
        "area error": "area_se", "smoothness error": "smoothness_se", "compactness error": "compactness_se",
        "concavity error": "concavity_se", "concave points error": "concave points_se", "symmetry error": "symmetry_se",
        "fractal dimension error": "fractal_dimension_se",
        # Worst
        "worst radius": "radius_worst", "worst texture": "texture_worst", "worst perimeter": "perimeter_worst",
        "worst area": "area_worst", "worst smoothness": "smoothness_worst", "worst compactness": "compactness_worst",
        "worst concavity": "concavity_worst", "worst concave points": "concave points_worst", "worst symmetry": "symmetry_worst",
        "worst fractal dimension": "fractal_dimension_worst",
    }
    
    normalized_features = {}
    for k, v in features.items():
        if k in key_mapping:
            normalized_features[key_mapping[k]] = v
        else:
            normalized_features[k] = v # Keep as is if no mapping found (or if already correct)
            
    return normalized_features


def extract_features_from_file(input_file: str, output_file: str = None) -> dict:
    """
    Extract features from a text file.
    
    Args:
        input_file: Path to input text file
        output_file: Optional path to save extracted features
    
    Returns:
        Dictionary with 30 features
    """
    # Read input file
    with open(input_file, "r", encoding="utf-8") as f:
        input_text = f.read().strip()
    
    # Extract features
    features = extract_features_from_text(input_text)
    
    # Save to file if specified
    if output_file:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(features, f, indent=2, ensure_ascii=False)
    
    return features


if __name__ == "__main__":
    # Command-line usage
    print("🚀 Feature extraction started")
    
    INPUT_FILE = "input_report.txt"
    OUTPUT_FILE = "extracted_features.json"
    
    try:
        features = extract_features_from_file(INPUT_FILE, OUTPUT_FILE)
        print("✅ Extraction terminée.")
        print(f"📁 Résultat sauvegardé dans : {OUTPUT_FILE}")
    except Exception as e:
        print(f"❌ Error: {e}")
