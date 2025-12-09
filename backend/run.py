from app import create_app
import os
import sqlite3
from create_and_populate_db import create_table, populate, DB_NAME

print("Verificando banco de dados...")
os.makedirs("./instance", exist_ok=True)

db_already_exists = os.path.exists(DB_NAME)

if not db_already_exists:
    conn = sqlite3.connect(DB_NAME)
    create_table(conn)
    populate(conn)

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)