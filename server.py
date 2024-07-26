from flask import Flask
import sqlite3

app = Flask(__name__)

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
