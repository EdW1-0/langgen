from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import random

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/vowels/<int:index>")
def vowel(index):
    conn = sqlite3.connect('VOWELS.db')
    c = conn.cursor()
    c.execute("SELECT * FROM VOWELS LIMIT 1 OFFSET ?", (index,))
    row = c.fetchone()
    if row is None:
        return jsonify({"error": "Index out of range"}), 404
    column_names = [description[0] for description in c.description]
    retdict = dict(zip(column_names, row))
    conn.close()
    return retdict

@app.route("/vowels/count")
def vowel_count():
    conn = sqlite3.connect('VOWELS.db')
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM VOWELS")
    count = c.fetchone()[0]  # Fetch the count directly
    conn.close()
    return jsonify({"count": count})  # Return the count as a JSON response

@app.route("/consonants/<int:index>")
def consonant(index):
    return get_consonant(index)

def get_consonant(index):
    conn = sqlite3.connect('CONSONANTS.db')
    c = conn.cursor()
    c.execute("SELECT * FROM CONSONANTS LIMIT 1 OFFSET ?", (index,))
    row = c.fetchone()
    if row is None:
        return jsonify({"error": "Index out of range"}), 404
    column_names = [description[0] for description in c.description]
    retdict = dict(zip(column_names, row))
    conn.close()
    return retdict

def get_consonant_count():
    conn = sqlite3.connect('CONSONANTS.db')
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM CONSONANTS")
    count = c.fetchone()[0]  # Fetch the count directly
    conn.close()
    return count

@app.route("/consonants/count")
def consonant_count():
    count = get_consonant_count()
    return jsonify({"count": count})

@app.route("/phonology/generate")
def generate_phonology():
    count = get_consonant_count()
    i = 0
    consonants = []
    while i < 5:
        rand = random.randint(0, count - 1)
        consonants.append(get_consonant(rand))
        i += 1 

    create_phonology_db()
    # Insert generated consonants into the PHONOLOGY database
    conn = sqlite3.connect('PHONOLOGY.db')
    c = conn.cursor()
    for consonant in consonants:
        c.execute("INSERT INTO GENERATED_CONSONANTS (consonant) VALUES (?)", (consonant["id"],))
    conn.commit()
    conn.close()
    

    return jsonify(consonants)

def create_phonology_db():
    conn = sqlite3.connect('PHONOLOGY.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS GENERATED_CONSONANTS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            consonant TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


@app.route("/phonology/consonants/count")
def phonology_consonant_count():
    conn = sqlite3.connect('PHONOLOGY.db')
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM GENERATED_CONSONANTS")
    count = c.fetchone()[0]  # Fetch the count directly
    conn.close()
    return jsonify({"count": count})

@app.route("/phonology/consonants/<int:index>")
def phonology_consonant(index):
    conn = sqlite3.connect('PHONOLOGY.db')
    c = conn.cursor()
    c.execute("SELECT * FROM GENERATED_CONSONANTS LIMIT 1 OFFSET ?", (index,))
    row = c.fetchone()
    if row is None:
        return jsonify({"error": "Index out of range"}), 404
    column_names = [description[0] for description in c.description]
    retdict = dict(zip(column_names, row))
    conn.close()
    return retdict