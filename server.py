from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/char/<int:index>")
def char(index):
    conn = sqlite3.connect('IPA.db')
    c = conn.cursor()
    c.execute("SELECT * FROM VOWELS LIMIT 1 OFFSET ?", (index,))
    row = c.fetchone()
    if row is None:
        return jsonify({"error": "Index out of range"}), 404
    column_names = [description[0] for description in c.description]
    retdict = dict(zip(column_names, row))
    conn.close()
    return retdict

@app.route("/count")
def count():
    conn = sqlite3.connect('IPA.db')
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM VOWELS")
    count = c.fetchone()[0]  # Fetch the count directly
    conn.close()
    return jsonify({"count": count})  # Return the count as a JSON response