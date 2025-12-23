import mysql.connector
import sys

try:
    print("Connecting to DB...")
    conn = mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='',
        database='breast_cancer_db'
    )
    cursor = conn.cursor()
    
    print("Resetting user '166JMT8965'...")
    cursor.execute("DELETE FROM medecin WHERE username = '166JMT8965'")
    conn.commit()
    
    print("Creating user with clean password...")
    # Using explicit values, no extra spaces
    cursor.execute("""
        INSERT INTO medecin (nom, prenom, username, password) 
        VALUES ('Smith', 'John', '166JMT8965', 'admin123')
    """)
    conn.commit()
    
    print("Verifying...")
    cursor.execute("SELECT username, password FROM medecin WHERE username = '166JMT8965'")
    row = cursor.fetchone()
    if row:
        u, p = row
        print(f"User in DB: '{u}'")
        print(f"Pass in DB: '{p}'")
        
        if u == '166JMT8965' and p == 'admin123':
             print("SUCCESS: Credentials verified perfectly.")
        else:
             print("WARNING: retrieved values do not match expected!")
    else:
        print("ERROR: User not found after insertion!")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
