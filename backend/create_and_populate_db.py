"""
Script para criar e popular o banco de dados de diagnósticos
"""
import sqlite3
import random
import os
from datetime import datetime, timedelta

DB_NAME = "./instance/default.db"

CITIES = [
    ("Salvador", "BA"),
    ("Feira de Santana", "BA"),
    ("São Paulo", "SP"),
    ("Rio de Janeiro", "RJ"),
    ("Belo Horizonte", "MG"),
    ("Brasília", "DF"),
    ("Recife", "PE"),
    ("Fortaleza", "CE"),
    ("Curitiba", "PR"),
    ("Porto Alegre", "RS"),
]

REGISTROS_POR_CIDADE = 5
DIAS = 7

def create_table(conn):
    """Cria a tabela de diagnósticos"""
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS diagnostics")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS diagnostics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            latency_ms REAL NOT NULL,
            packet_loss REAL NOT NULL,
            quality_of_service REAL NOT NULL,
            date TEXT NOT NULL
        );
    """)
    conn.commit()


def populate(conn):
    cursor = conn.cursor()

    cursor.execute("""DELETE FROM diagnostics""")

    for dia in range(DIAS):
        data_base = datetime.now() - timedelta(days=dia)

        for city, state in CITIES:
            for x in range(REGISTROS_POR_CIDADE):

                device_id = f"DEV{random.randint(1,999):03d}"

                latency = random.uniform(30, 70)
                loss = random.uniform(0.1, 2.0)

                quality = 100 - (latency * 0.2) - (loss * 5)
                quality = max(0, min(100, quality)) 

                data_registro = data_base.replace(
                    hour=random.randint(0, 23),
                    minute=random.randint(0, 59),
                    second=random.randint(0, 59)
                )

                cursor.execute("""
                    INSERT INTO diagnostics 
                    (device_id, city, state, latency_ms, packet_loss, quality_of_service, date)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    device_id,
                    city,
                    state,
                    round(latency, 2),
                    round(loss, 2),
                    round(quality, 2),
                    data_registro.isoformat()
                ))

    conn.commit()


if __name__ == "__main__":
    print("Iniciando criação e população do banco de dados...")
    os.makedirs("./instance", exist_ok=True)
    
    conn = sqlite3.connect(DB_NAME)
    
    create_table(conn)
    
    populate(conn)
    
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM diagnostics")
    total = cursor.fetchone()[0]
    
    conn.close()
    
    print(f"Total de registros inseridos: {total}")
