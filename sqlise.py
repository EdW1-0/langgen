import csv
import sqlite3
import os

# Define file paths
csv_file_path = 'CONSONANTS.csv'
sqlite_db_path = 'CONSONANTS.db'

# Remove the existing database file if it exists
if os.path.exists(sqlite_db_path):
    os.remove(sqlite_db_path)

# Read the CSV file
with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
    csv_reader = csv.reader(csvfile)
    headers = next(csv_reader)  # Read the header row
    rows = []
    for row in csv_reader:
        # Handle multiline fields by joining them
        row = [field.replace('\n', ' ').strip() for field in row]
        rows.append(row)

# Create a connection to the SQLite database
conn = sqlite3.connect(sqlite_db_path)
cursor = conn.cursor()

# Create a table with the same structure as the CSV file
table_name = 'consonants'
columns = ', '.join([f'"{header}" TEXT' for header in headers])
create_table_query = f'CREATE TABLE IF NOT EXISTS {table_name} ({columns})'
cursor.execute(create_table_query)

# Insert the data into the table
insert_query = f'INSERT INTO {table_name} ({", ".join(headers)}) VALUES ({", ".join(["?" for _ in headers])})'
cursor.executemany(insert_query, rows)

# Commit the transaction and close the connection
conn.commit()
conn.close()