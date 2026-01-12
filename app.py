from flask import Flask, render_template, request, redirect
import sqlite3
from datetime import date
from alert import send_alert

app = Flask(__name__)

# ---------------- DB CONNECTION ----------------
def db():
    return sqlite3.connect("database.db")

# ---------------- CREATE TABLES ----------------
with db() as con:
    con.execute("""
    CREATE TABLE IF NOT EXISTS plan (
        day INTEGER PRIMARY KEY,
        task TEXT,
        status TEXT
    )
    """)

    con.execute("""
    CREATE TABLE IF NOT EXISTS undo_log (
        day INTEGER,
        old_status TEXT
    )
    """)

# ---------------- TCS 15-DAY PLAN ----------------
plan = [
    "Number System", "HCF & LCM", "Percentages", "Profit & Loss",
    "Ratios & Proportion", "Averages", "Ages", "Time & Work",
    "Speed & Distance", "Allegations", "Series",
    "Probability", "Permutations", "Data Interpretation", "Full Revision"
]

with db() as con:
    for i, task in enumerate(plan, 1):
        con.execute(
            "INSERT OR IGNORE INTO plan VALUES (?, ?, ?)",
            (i, task, "Not Started")
        )

# ---------------- WEEKLY STATS ----------------
def weekly_stats():
    con = db()
    data = con.execute("SELECT status FROM plan").fetchall()
    con.close()

    completed = sum(1 for d in data if d[0] == "Completed")
    missed = len(data) - completed
    percent = int((completed / len(data)) * 100) if data else 0

    return completed, missed, percent

# ---------------- DASHBOARD ----------------
@app.route("/", methods=["GET", "POST"])
def dashboard():
    today = date.today().day
    missed_today = False

    if request.method == "POST":
        d = int(request.form["day"])
        con = db()
        con.execute("UPDATE plan SET status='Completed' WHERE day=?", (d,))
        con.commit()
        con.close()
        return redirect("/")

    con = db()
    tasks = con.execute("SELECT * FROM plan").fetchall()
    con.close()

    # Check if today's task is missed
    if today <= len(tasks):
        if tasks[today - 1][2] != "Completed":
            missed_today = True

    completed, missed, percent = weekly_stats()

    return render_template(
        "dashboard.html",
        tasks=tasks,
        completed=completed,
        missed=missed,
        percent=percent,
        missed_today=missed_today
    )

# ---------------- RESET ALL ----------------
@app.route("/reset", methods=["POST"])
def reset_plan():
    con = db()
    cur = con.cursor()

    # save last state (first non-not-started)
    old = cur.execute(
        "SELECT day, status FROM plan WHERE status != 'Not Started' LIMIT 1"
    ).fetchone()

    if old:
        cur.execute("DELETE FROM undo_log")
        cur.execute("INSERT INTO undo_log VALUES (?, ?)", old)

    cur.execute("UPDATE plan SET status='Not Started'")
    con.commit()
    con.close()
    return redirect("/")

# ---------------- RESET TODAY ----------------
@app.route("/reset-today", methods=["POST"])
def reset_today():
    today = date.today().day

    con = db()
    cur = con.cursor()

    old = cur.execute(
        "SELECT status FROM plan WHERE day=?", (today,)
    ).fetchone()

    if old:
        cur.execute("DELETE FROM undo_log")
        cur.execute("INSERT INTO undo_log VALUES (?, ?)", (today, old[0]))

    cur.execute(
        "UPDATE plan SET status='Not Started' WHERE day=?", (today,)
    )

    con.commit()
    con.close()
    return redirect("/")

# ---------------- RESET SPECIFIC DAY ----------------
@app.route("/reset-day", methods=["POST"])
def reset_specific_day():
    day = int(request.form["day"])

    con = db()
    cur = con.cursor()

    old = cur.execute(
        "SELECT status FROM plan WHERE day=?", (day,)
    ).fetchone()

    if old:
        cur.execute("DELETE FROM undo_log")
        cur.execute("INSERT INTO undo_log VALUES (?, ?)", (day, old[0]))

    cur.execute(
        "UPDATE plan SET status='Not Started' WHERE day=?", (day,)
    )

    con.commit()
    con.close()
    return redirect("/")

# ---------------- UNDO RESET ----------------
@app.route("/undo-reset", methods=["POST"])
def undo_reset():
    con = db()
    cur = con.cursor()

    last = cur.execute(
        "SELECT day, old_status FROM undo_log"
    ).fetchone()

    if last:
        cur.execute(
            "UPDATE plan SET status=? WHERE day=?",
            (last[1], last[0])
        )
        cur.execute("DELETE FROM undo_log")

    con.commit()
    con.close()
    return redirect("/")
@app.route("/test-alert")
def test_alert():
    send_alert("TEST ALERT – Email system working")
    return "✅ Test alert sent. Check your email inbox."

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)
