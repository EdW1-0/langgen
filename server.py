from flask import Flask
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/char")
def char():
    conn = sqlite3.connect('IPA.db')
    c = conn.cursor()
    c.execute("SELECT * FROM PHONEMES")
    retstr = str(c.fetchall())
    conn.close()
    return retstr
