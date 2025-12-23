from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import torch
import torch.nn as nn
import numpy as np
from sklearn.neural_network import MLPClassifier
import os
import json
import mysql.connector
from datetime import datetime

# Import feature extractor
try:
    from feature_extractor import extract_features_from_text
    FEATURE_EXTRACTION_AVAILABLE = True
except ImportError:
    FEATURE_EXTRACTION_AVAILABLE = False
    print("⚠️ Feature extraction not available (feature_extractor.py not found)")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# =====================
# Load ML Models and Scalers
# =====================
# Define the 30 breast cancer features
feature_cols = [
    'radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean', 'smoothness_mean',
    'compactness_mean', 'concavity_mean', 'concave points_mean', 'symmetry_mean', 'fractal_dimension_mean',
    'radius_se', 'texture_se', 'perimeter_se', 'area_se', 'smoothness_se',
    'compactness_se', 'concavity_se', 'concave points_se', 'symmetry_se', 'fractal_dimension_se',
    'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst', 'smoothness_worst',
    'compactness_worst', 'concavity_worst', 'concave points_worst', 'symmetry_worst', 'fractal_dimension_worst'
]

# Define Softmax Regression Model Class
class SoftmaxRegression(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(SoftmaxRegression, self).__init__()
        self.linear = nn.Linear(input_dim, output_dim)
    
    def forward(self, x):
        return self.linear(x)

# Load models and scalers
print("Loading ML models...")
try:
    # Import sklearn modules to register with joblib
    import sklearn.preprocessing
    import sklearn.neural_network
    import sys
    
    # Monkey-patch numpy.random to handle old pickle format
    import numpy.random
    if not hasattr(numpy.random, '__RandomState_ctor'):
        numpy.random.__RandomState_ctor = numpy.random.RandomState
    
    # Try to use sklearn's joblib if available, otherwise use standard joblib
    try:
        from sklearn.externals import joblib as sk_joblib
        loader = sk_joblib
    except ImportError:
        loader = joblib
    
    # Load scalers
    scaler_dso2 = loader.load('scaler_dso2.joblib')
    scaler_dso3 = loader.load('scaler_dso3.joblib')
    
    # Load Softmax model (PyTorch)
    softmax_model = SoftmaxRegression(input_dim=30, output_dim=2)
    softmax_model.load_state_dict(torch.load('softmax_regression_dso2.pth', map_location=torch.device('cpu'), weights_only=False))
    softmax_model.eval()
    
    # Load MLP model (scikit-learn)
    mlp_dso3 = loader.load('mlp_perfect_dso3_model.joblib')
    
    print("✅ All models loaded successfully!")
except Exception as e:
    print(f"⚠️ Error loading models: {e}")
    import traceback
    traceback.print_exc()
    raise

# =====================
# Database Connection
# =====================
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host='127.0.0.1',  # Use IP instead of localhost
            port=3306,
            user='root',
            password='',  # Default XAMPP password
            database='breast_cancer_db'
        )
        return conn
    except mysql.connector.Error as err:
        print(f"❌ Db Connection Error: {err}")
        return None

def init_db():
    try:
        print("Attempting to connect to MySQL to initialize DB...")
        conn = mysql.connector.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password=''
        )
        cursor = conn.cursor()
        
        # Create database if not exists
        print("Creating database if not exists...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS breast_cancer_db")
        cursor.execute("USE breast_cancer_db")
        
        # Create Medecin table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS medecin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(100) NOT NULL,
            prenom VARCHAR(100) NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
        """)
        
        # Create Patient table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS patient (
            id_patient VARCHAR(50) PRIMARY KEY,
            nom VARCHAR(100) NOT NULL,
            age INT NOT NULL
        )
        """)
        
        # Create Consultation table (Many-to-Many relationship)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS consultation (
            id INT AUTO_INCREMENT PRIMARY KEY,
            medecin_id INT,
            patient_id VARCHAR(50),
            description TEXT,
            image_path VARCHAR(255),
            prediction_status VARCHAR(20),
            risk_level VARCHAR(20),
            confidence FLOAT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (medecin_id) REFERENCES medecin(id),
            FOREIGN KEY (patient_id) REFERENCES patient(id_patient)
        )
        """)
        
        # check if user exists
        cursor.execute("SELECT * FROM medecin WHERE username = '166JMT8965'")
        if not cursor.fetchone():
            print("Creating default doctor account...")
            cursor.execute("""
            INSERT INTO medecin (nom, prenom, username, password) 
            VALUES ('Smith', 'John', '166JMT8965', 'admin123')
            """)
        else:
            print("Default doctor account already exists.")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")

# Initialize DB on startup
init_db()

# ... (omitted code) ...

# =====================
# LOGIN ENDPOINT
# =====================
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    # Trim whitespace to avoid copy-paste errors
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    print(f"----- LOGIN DEBUG -----")
    print(f"Received Username: '{username}'")
    print(f"Received Password: '{password}'")
    
    conn = get_db_connection()
    if not conn:
        print("❌ Login failed: No DB connection")
        return jsonify({"success": False, "message": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    
    # Direct check to see what's in the DB for this username
    cursor.execute("SELECT * FROM medecin WHERE username = %s", (username,))
    user_by_name = cursor.fetchone()
    
    if user_by_name:
        print(f"User found by name: {user_by_name['username']}")
        print(f"DB Password: '{user_by_name['password']}'")
        print(f"Input Password: '{password}'")
        print(f"Match? {user_by_name['password'] == password}")
        
        if user_by_name['password'] == password:
            print("✅ Login Successful")
            cursor.close()
            conn.close()
            return jsonify({"success": True, "doctor": {"id": user_by_name['id'], "nom": user_by_name['nom'], "prenom": user_by_name['prenom']}})
        else:
            print("❌ Password verification failed")
    else:
        print("❌ User not found by username")

    cursor.close()
    conn.close()
    
    return jsonify({"success": False, "message": "Identifiants invalides"}), 401

# =====================
# SAVE CONSULTATION ENDPOINT
# =====================
@app.route("/save_consultation", methods=["POST"])
def save_consultation():
    try:
        # Check if it's multipart (has file)
        if 'image' in request.files:
            file = request.files['image']
            image_path = os.path.join('uploads', file.filename)
            os.makedirs('uploads', exist_ok=True)
            file.save(image_path)
        else:
            image_path = None

        # Get form data (might be JSON or Form)
        if request.is_json:
            data = request.json
        else:
            data = request.form

        doctor_id = data.get('doctor_id')
        patient_id = data.get('patient_id')
        patient_name = data.get('patient_name')
        patient_age = data.get('patient_age')
        description = data.get('description')
        prediction_status = data.get('prediction_status')
        risk_level = data.get('risk_level')
        confidence = data.get('confidence')

        conn = get_db_connection()
        if not conn:
            return jsonify({"success": False, "message": "Database error"}), 500

        cursor = conn.cursor()

        # 1. Upsert Patient
        cursor.execute("SELECT * FROM patient WHERE id_patient = %s", (patient_id,))
        if cursor.fetchone():
            cursor.execute("UPDATE patient SET nom = %s, age = %s WHERE id_patient = %s", 
                           (patient_name, patient_age, patient_id))
        else:
            cursor.execute("INSERT INTO patient (id_patient, nom, age) VALUES (%s, %s, %s)", 
                           (patient_id, patient_name, patient_age))

        # 2. Insert Consultation
        cursor.execute("""
            INSERT INTO consultation (medecin_id, patient_id, description, image_path, prediction_status, risk_level, confidence)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (doctor_id, patient_id, description, image_path, prediction_status, risk_level, confidence))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Consultation saved successfully"})
    
    except Exception as e:
        print(f"Error saving consultation: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

# =====================
# GET ALL PATIENTS ENDPOINT
# =====================
@app.route("/get_patients", methods=["GET"])
def get_patients():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"success": False, "message": "Database connection failed"}), 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Get all patients with their latest consultation
        cursor.execute("""
            SELECT 
                p.id_patient,
                p.nom,
                p.age,
                c.date as last_visit,
                c.prediction_status,
                c.risk_level,
                c.confidence,
                c.description
            FROM patient p
            LEFT JOIN (
                SELECT patient_id, MAX(date) as max_date
                FROM consultation
                GROUP BY patient_id
            ) latest ON p.id_patient = latest.patient_id
            LEFT JOIN consultation c ON p.id_patient = c.patient_id AND c.date = latest.max_date
            ORDER BY p.id_patient
        """)
        
        patients = cursor.fetchall()
        
        # Format the response
        formatted_patients = []
        for patient in patients:
            formatted_patients.append({
                "id": patient['id_patient'],
                "name": patient['nom'],
                "age": patient['age'],
                "lastVisit": patient['last_visit'].strftime('%Y-%m-%d') if patient['last_visit'] else None,
                "status": patient['prediction_status'],
                "riskLevel": patient['risk_level'],
                "confidence": float(patient['confidence']) if patient['confidence'] else None,
                "description": patient['description']
            })
        
        cursor.close()
        conn.close()
        
        return jsonify({"success": True, "patients": formatted_patients})
    
    except Exception as e:
        print(f"Error fetching patients: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500

# =====================
# EXISTING ML ENDPOINTS (Keep them as is)
# =====================
@app.route("/predict2", methods=["POST"])
def predict2():
    data = request.json
    try:
        values = np.array([[data.get(col, 0) if data.get(col) is not None else 0 for col in feature_cols]], dtype=np.float32)
    except Exception as e:
        return jsonify({"error": f"missing or invalid fields: {str(e)}"}), 400

    X_scaled = scaler_dso2.transform(values)
    X_tensor = torch.tensor(X_scaled, dtype=torch.float32)

    logits = softmax_model(X_tensor)
    proba = torch.softmax(logits, dim=1).detach().numpy()[0]
    pred_class = int(np.argmax(proba))

    return jsonify({
        "prediction": pred_class,
        "probability_class0": float(proba[0]),
        "probability_class1": float(proba[1])
    })

@app.route("/predict3", methods=["POST"])
def predict3():
    data = request.json
    try:
        values = np.array([[data[col] for col in feature_cols]], dtype=np.float32)
    except:
        return jsonify({"error": "missing or invalid fields"}), 400

    X_scaled = scaler_dso3.transform(values)
    pred = mlp_dso3.predict(X_scaled)[0]
    proba = mlp_dso3.predict_proba(X_scaled)[0]
    risk_score = proba[1]

    if risk_score <= 0.3:
      risk_level = "Low"
      french_level = "Faible risque"
      recommendation = "Pas d'urgence – suivi standard recommandé"
      color = "green"
    elif risk_score < 0.7:
      risk_level = "Medium"
      french_level = "Risque intermédiaire"
      recommendation = "Évaluation complémentaire conseillée rapidement"
      color = "orange"
    else:
      risk_level = "High"
      french_level = "Risque élevé"
      recommendation = "Urgence – prise en charge rapide recommandée"
      color = "red"

    response = jsonify({
    "prediction": float(risk_score),
    "risk_level_en": risk_level,
    "risk_level_fr": french_level,
    "recommendation_fr": recommendation,
    "color": color,
    "probability_class0": float(proba[0]),
    "probability_class1": float(proba[1])
    })
    return response


@app.route("/extract_and_predict", methods=["POST"])
def extract_and_predict():
    if not FEATURE_EXTRACTION_AVAILABLE:
        return jsonify({"error": "Feature extraction not available."}), 503
    
    data = request.json
    try:
        report_text = data.get('report_description', '')
        if not report_text or not report_text.strip():
            return jsonify({"error": "report_description is required"}), 400
        
        features = extract_features_from_text(report_text)
        
        try:
            values = np.array([[features.get(col, 0) if features.get(col) is not None else 0 for col in feature_cols]], dtype=np.float32)
        except Exception as e:
            return jsonify({"error": f"Invalid features: {str(e)}"}), 400
        
        X_scaled = scaler_dso2.transform(values)
        X_tensor = torch.tensor(X_scaled, dtype=torch.float32)
        
        logits = softmax_model(X_tensor)
        proba = torch.softmax(logits, dim=1).detach().numpy()[0]
        pred_class = int(np.argmax(proba))
        
        return jsonify({
            "status": "success",
            "extraction": {
                "features_extracted": len([v for v in features.values() if v is not None]),
                "total_features": len(features),
                "features": features
            },
            "prediction": {
                "class": pred_class,
                "diagnosis": "Benign" if pred_class == 0 else "Malignant",
                "probability_class0": float(proba[0]),
                "probability_class1": float(proba[1]),
                "confidence": float(max(proba[0], proba[1]) * 100)
            }
        })
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


@app.route("/extract_and_predict_mlp", methods=["POST"])
def extract_and_predict_mlp():
    if not FEATURE_EXTRACTION_AVAILABLE:
        return jsonify({"error": "Feature extraction not available."}), 503
    
    data = request.json
    try:
        report_text = data.get('report_description', '')
        if not report_text or not report_text.strip():
            return jsonify({"error": "report_description is required"}), 400
        
        features = extract_features_from_text(report_text)
        
        try:
            values = np.array([[features.get(col, 0) if features.get(col) is not None else 0 for col in feature_cols]], dtype=np.float32)
        except Exception as e:
            return jsonify({"error": f"Invalid features: {str(e)}"}), 400
        
        X_scaled = scaler_dso3.transform(values)
        pred = mlp_dso3.predict(X_scaled)[0]
        proba = mlp_dso3.predict_proba(X_scaled)[0]
        risk_score = proba[1]
        
        if risk_score <= 0.3:
            risk_level = "Low"
            french_level = "Faible risque"
            recommendation = "Pas d'urgence – suivi standard recommandé"
            color = "green"
        elif risk_score < 0.7:
            risk_level = "Medium"
            french_level = "Risque intermédiaire"
            recommendation = "Évaluation complémentaire conseillée rapidement"
            color = "orange"
        else:
            risk_level = "High"
            french_level = "Risque élevé"
            recommendation = "Urgence – prise en charge rapide recommandée"
            color = "red"
        
        return jsonify({
            "status": "success",
            "model": "MLP (DSO3)",
            "prediction": {
                "class": int(pred),
                "diagnosis": "Benign" if pred == 0 else "Malignant",
                "risk_score": float(risk_score),
                "risk_level_en": risk_level,
                "risk_level_fr": french_level,
                "recommendation_fr": recommendation,
                "color": color,
                "probability_class0": float(proba[0]),
                "probability_class1": float(proba[1]),
                "confidence": float(max(proba[0], proba[1]) * 100)
            }
        })
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5000)
