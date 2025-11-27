import MySQLdb

try:
    db = MySQLdb.connect(host="localhost", user="root", passwd="supith@2323")
    cursor = db.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS coplur_db")
    print("Database created successfully")
except Exception as e:
    print(f"Error creating database: {e}")
