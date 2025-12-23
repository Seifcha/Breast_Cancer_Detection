"""
Test script for the automatic extraction and prediction endpoint
"""
import requests
import json

# Test data - medical report
report_text = """
Le patient présente une masse mammaire dont l'analyse morphologique met en évidence les caractéristiques suivantes :

Mesures moyennes de la lésion

Le rayon moyen de la masse est estimé à 18,5, avec une texture moyenne de 14,2.

Le périmètre moyen est évalué à 120,4, pour une surface moyenne de 980,3.

La lissité moyenne est mesurée à 0,102, associée à une compacité moyenne de 0,145.

La concavité moyenne atteint 0,20, avec des points concaves moyens à 0,095, traduisant une irrégularité modérée des contours.

La symétrie moyenne est de 0,185, et la dimension fractale moyenne est évaluée à 0,061.

Variabilité des mesures (écarts-types)

Le rayon présente un écart-type de 0,62, la texture de 1,05, et le périmètre de 4,8.

La surface montre une variabilité de 75,2.

Les écarts-types de la lissité, de la compacité, de la concavité et des points concaves sont respectivement de 0,006, 0,030, 0,040 et 0,015.

La symétrie et la dimension fractale présentent des écarts-types faibles, respectivement 0,020 et 0,003.

Paramètres les plus défavorables ("worst")

Le rayon maximal est estimé à 25,1, avec une texture maximale de 19,6.

Le périmètre maximal atteint 165,0, et la surface maximale est évaluée à 2000,0, indiquant une augmentation marquée de la taille tumorale dans les zones les plus critiques.

La lissité maximale est mesurée à 0,140, la compacité maximale à 0,390, et la concavité maximale à 0,450, traduisant des contours fortement irréguliers.

Les points concaves maximaux atteignent 0,210, avec une symétrie maximale de 0,310 et une dimension fractale maximale de 0,085.
"""

print("=" * 70)
print("Testing Automatic Extraction and Prediction Endpoint")
print("=" * 70)
print()

# Call the API
try:
    print("Calling /extract_and_predict...")
    response = requests.post(
        'http://localhost:5000/extract_and_predict',
        json={'report_description': report_text},
        headers={'Content-Type': 'application/json'},
        timeout=30  # 30 seconds timeout for Groq API
    )
    
    print(f"Status Code: {response.status_code}")
    print()
    
    if response.status_code == 200:
        result = response.json()
        
        if result.get('status') == 'success':
            print("SUCCESS!")
            print("=" * 70)
            
            # Extraction info
            extraction = result['extraction']
            print(f"\nFEATURE EXTRACTION:")
            print(f"  Features extracted: {extraction['features_extracted']}/{extraction['total_features']}")
            
            # Prediction info
            prediction = result['prediction']
            print(f"\nPREDICTION:")
            print(f"  Class: {prediction['class']}")
            print(f"  Diagnosis: {prediction['diagnosis']}")
            print(f"  Confidence: {prediction['confidence']:.2f}%")
            print(f"  Probability Benign: {prediction['probability_class0']*100:.2f}%")
            print(f"  Probability Malignant: {prediction['probability_class1']*100:.2f}%")
            
            # Files saved
            files = result['files_saved']
            print(f"\nFILES SAVED:")
            print(f"  Report: {files['report']}")
            print(f"  Features: {files['features']}")
            
            print("\n" + "=" * 70)
            
            # Show some extracted features
            print("\nSAMPLE EXTRACTED FEATURES:")
            features = extraction['features']
            for key in list(features.keys())[:5]:
                print(f"  {key}: {features[key]}")
            print("  ...")
            
        else:
            print("ERROR in response:")
            print(json.dumps(result, indent=2))
    else:
        print(f"HTTP Error {response.status_code}:")
        try:
            error_data = response.json()
            print(json.dumps(error_data, indent=2))
        except:
            print(response.text)
            
except requests.exceptions.ConnectionError:
    print("ERROR: Cannot connect to Flask server")
    print("Make sure Flask is running on http://localhost:5000")
except requests.exceptions.Timeout:
    print("ERROR: Request timed out")
    print("Groq API might be slow or unavailable")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")

print("\n" + "=" * 70)
