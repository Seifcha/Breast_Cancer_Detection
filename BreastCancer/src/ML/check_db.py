import mysql.connector

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

def check_database():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect to database")
        return
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Check medecin table
        print("=== MEDECIN TABLE ===")
        cursor.execute("SELECT * FROM medecin")
        doctors = cursor.fetchall()
        for doc in doctors:
            print(f"ID: {doc['id']}, Name: {doc['nom']} {doc['prenom']}, Username: {doc['username']}")
        
        print("\n=== PATIENT TABLE ===")
        cursor.execute("SELECT * FROM patient")
        patients = cursor.fetchall()
        for patient in patients:
            print(f"ID: {patient['id_patient']}, Name: {patient['nom']}, Age: {patient['age']}")
        
        print("\n=== CONSULTATION TABLE ===")
        cursor.execute("SELECT * FROM consultation")
        consultations = cursor.fetchall()
        for consult in consultations:
            print(f"ID: {consult['id']}, Patient: {consult['patient_id']}, Status: {consult['prediction_status']}, Risk: {consult['risk_level']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    check_database()
