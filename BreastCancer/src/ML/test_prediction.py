import requests
import json

# Load the extracted features
with open('extracted_features.json', 'r', encoding='utf-8') as f:
    features = json.load(f)

print("Testing prediction with extracted features...")
print(f"Features loaded: {len(features)} features")
print()

# Call the API
try:
    response = requests.post(
        'http://localhost:5000/predict2',
        json=features,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 200:
        result = response.json()
        print("API Response:")
        print(json.dumps(result, indent=2))
        print()
        
        # Interpret the results
        prediction = result['prediction']
        prob_benign = result['probability_class0'] * 100
        prob_malignant = result['probability_class1'] * 100
        
        print("=" * 60)
        print("DIAGNOSTIC:")
        print("=" * 60)
        print(f"Classe predite: {prediction} ({'BENIN' if prediction == 0 else 'MALIN'})")
        print(f"Probabilite Benin: {prob_benign:.2f}%")
        print(f"Probabilite Malin: {prob_malignant:.2f}%")
        print("=" * 60)
        
        if prediction == 1:
            print("ATTENTION: Resultat MALIN detecte")
            print("Consultation urgente recommandee avec un oncologue.")
        else:
            print("Resultat rassurant: BENIN")
            print("Suivi regulier recommande selon le protocole standard.")
        
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"Error calling API: {e}")
    print("Make sure Flask server is running on port 5000")
