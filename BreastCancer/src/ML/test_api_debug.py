
import requests
import json

try:
    response = requests.post(
        "http://127.0.0.1:5000/extract_and_predict",
        json={"report_description": "Patient has a mass in the left breast. Radius mean is 14.5."}
    )
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Request failed: {e}")
