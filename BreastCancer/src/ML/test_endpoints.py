"""
Quick test to check if Flask endpoints are working
"""
import requests
import json

print("=" * 70)
print("Testing Flask API Endpoints")
print("=" * 70)

# Test data
test_report = """
Mesures moyennes
radius_mean : 19.8
texture_mean : 21.4
perimeter_mean : 130.2
area_mean : 1205.6
"""

# Test 1: Check if server is running
print("\n1. Testing server connection...")
try:
    response = requests.get('http://localhost:5000/', timeout=2)
    print("✅ Server is running!")
except Exception as e:
    print(f"❌ Server not running: {e}")
    print("\nPlease start Flask server:")
    print("  cd src/ML")
    print("  python app.py")
    exit(1)

# Test 2: Test Softmax endpoint
print("\n2. Testing /extract_and_predict (Softmax)...")
try:
    response = requests.post(
        'http://localhost:5000/extract_and_predict',
        json={'report_description': test_report},
        timeout=30
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("✅ Softmax endpoint working!")
        print(f"   Diagnosis: {result.get('prediction', {}).get('diagnosis', 'N/A')}")
    else:
        print(f"❌ Error: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Test MLP endpoint
print("\n3. Testing /extract_and_predict_mlp (MLP)...")
try:
    response = requests.post(
        'http://localhost:5000/extract_and_predict_mlp',
        json={'report_description': test_report},
        timeout=30
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("✅ MLP endpoint working!")
        print(f"   Risk Level: {result.get('prediction', {}).get('risk_level_fr', 'N/A')}")
    else:
        print(f"❌ Error: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 70)
