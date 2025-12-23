import requests
import json
import time

url = "http://127.0.0.1:5000/extract_and_predict"

# Description with explicit numerical features (Malignant case from dataset)
malignant_report = """
Patient Analysis Report:
The extracted mass shows the following characteristics:
mean radius: 17.99, mean texture: 10.38, mean perimeter: 122.8, mean area: 1001.0
mean smoothness: 0.1184, mean compactness: 0.2776, mean concavity: 0.3001
mean concave points: 0.1471, mean symmetry: 0.2419, mean fractal dimension: 0.07871
radius error: 1.095, texture error: 0.9053, perimeter error: 8.589, area error: 153.4
smoothness error: 0.006399, compactness error: 0.04904, concavity error: 0.05373
concave points error: 0.01587, symmetry error: 0.03003, fractal dimension error: 0.006193
worst radius: 25.38, worst texture: 17.33, worst perimeter: 184.6, worst area: 2019.0
worst smoothness: 0.1622, worst compactness: 0.6656, worst concavity: 0.7119
worst concave points: 0.2654, worst symmetry: 0.4601, worst fractal dimension: 0.1189
Conclusion: Malignant.
"""

payload = {
    "report_description": malignant_report
}

print("Sending request...")
try:
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Success!")
        print(f"Diagnosis: {data['prediction']['diagnosis']}")
        print(f"Confidence: {data['prediction']['confidence']:.2f}%")
        print(f"Extracted Features Count: {data['extraction']['features_extracted']}")
        
        # Show a few key features to verify they are not all 0
        features = data['extraction']['features']
        print("\nSample Features:")
        for key in ['radius_mean', 'texture_mean', 'perimeter_mean']:
             print(f"  {key}: {features.get(key)}")
             
    else:
        print(f"❌ Error {response.status_code}: {response.text}")

except requests.exceptions.ConnectionError:
    print("❌ Could not connect to server. Is app.py running?")
