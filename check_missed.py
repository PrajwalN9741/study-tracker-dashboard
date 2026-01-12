import sqlite3
from datetime import date
from alert import send_alert

today = date.today().day

con = sqlite3.connect("database.db")
cur = con.cursor()

task = cur.execute(
    "SELECT task, status FROM plan WHERE day=?",
    (today,)
).fetchone()

if task and task[1] != "Completed":
    send_alert(task[0])

con.close()
