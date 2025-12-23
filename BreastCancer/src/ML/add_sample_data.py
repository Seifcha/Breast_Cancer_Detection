import mysql.connector
from datetime import datetime, timedelta
import random

# Database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='breast_cancer_db'
        )
        return conn
    except mysql.connector.Error as err:
        print(f"❌ Db Connection Error: {err}")
        return None

# Sample patients data
sample_patients = [
    {'id': 'P001', 'name': 'Sarah Johnson', 'age': 45},
    {'id': 'P002', 'name': 'Maria Garcia', 'age': 52},
    {'id': 'P003', 'name': 'Emily Chen', 'age': 38},
    {'id': 'P004', 'name': 'Jennifer Williams', 'age': 61},
    {'id': 'P005', 'name': 'Lisa Anderson', 'age': 47},
    {'id': 'P006', 'name': 'Patricia Brown', 'age': 55},
    {'id': 'P007', 'name': 'Michelle Davis', 'age': 43},
    {'id': 'P008', 'name': 'Amanda Martinez', 'age': 50},
]

# Sample consultation data
statuses = ['Benign', 'Malignant']
risk_levels = ['Low', 'Medium', 'High']
descriptions = [
    'Routine mammography screening',
    'Follow-up examination',
    'Biopsy results analysis',
    'Annual checkup',
    'Suspicious mass detected'
]

def add_sample_data():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect to database")
        return
    
    cursor = conn.cursor()
    
    try:
        # Add patients
        for patient in sample_patients:
            # Check if patient exists
            cursor.execute("SELECT * FROM patient WHERE id_patient = %s", (patient['id'],))
            if not cursor.fetchone():
                cursor.execute(
                    "INSERT INTO patient (id_patient, nom, age) VALUES (%s, %s, %s)",
                    (patient['id'], patient['name'], patient['age'])
                )
                print(f"✅ Added patient: {patient['name']}")
                
                # Add a consultation for this patient
                status = random.choice(statuses)
                risk = random.choice(risk_levels)
                confidence = random.uniform(75, 99)
                description = random.choice(descriptions)
                days_ago = random.randint(1, 30)
                visit_date = datetime.now() - timedelta(days=days_ago)
                
                cursor.execute("""
                    INSERT INTO consultation 
                    (medecin_id, patient_id, description, prediction_status, risk_level, confidence, date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (2, patient['id'], description, status, risk, confidence, visit_date))
                
                print(f"   Added consultation: {status} - Risk: {risk}")
            else:
                print(f"⚠️ Patient {patient['name']} already exists")
        
        conn.commit()
        print("\n✅ Sample data added successfully!")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    add_sample_data()
