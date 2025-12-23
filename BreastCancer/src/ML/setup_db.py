import mysql.connector
import sys

print("------------------------------------------------")
print("STARTING DATABASE SETUP SCRIPT")
print("------------------------------------------------")

config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',
    'port': 3306
}

try:
    print(f"1. Attempting to connect to MySQL server at {config['host']}:{config['port']}...")
    conn = mysql.connector.connect(**config)
    print("   ✅ Connected to MySQL server successfully!")
    
    cursor = conn.cursor()
    
    print("2. Checking databases...")
    cursor.execute("SHOW DATABASES")
    dbs = [d[0] for d in cursor.fetchall()]
    print(f"   Current databases: {dbs}")
    
    db_name = 'breast_cancer_db'
    if db_name in dbs:
        print(f"   ℹ️ Database '{db_name}' already exists.")
    else:
        print(f"   Creating database '{db_name}'...")
        cursor.execute(f"CREATE DATABASE {db_name}")
        print(f"   ✅ Database '{db_name}' created!")

    print(f"3. Selecting database '{db_name}'...")
    conn.database = db_name
    
    print("4. Creating tables...")
    
    # Medecin
    print("   - Table 'medecin'...", end=" ")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medecin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )
    """)
    print("OK")
    
    # Patient
    print("   - Table 'patient'...", end=" ")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient (
        id_patient VARCHAR(50) PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        age INT NOT NULL
    )
    """)
    print("OK")
    
    # Consultation
    print("   - Table 'consultation'...", end=" ")
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
    print("OK")

    print("5. Inserting default doctor...")
    cursor.execute("SELECT * FROM medecin WHERE username = '166JMT8965'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO medecin (nom, prenom, username, password) 
        VALUES ('Smith', 'John', '166JMT8965', 'admin123')
        """)
        print("   ✅ Default doctor created!")
    else:
        print("   ℹ️ Default doctor already exists.")
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print("------------------------------------------------")
    print("SETUP COMPLETE SUCCESSFUL")
    print("------------------------------------------------")

except mysql.connector.Error as err:
    print(f"❌ MySQL Error: {err}")
except Exception as e:
    print(f"❌ General Error: {e}")
