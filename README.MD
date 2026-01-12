

```md
# 📘 Study Progress Tracker with Alerts


A smart web-based **study progress tracker** designed for **TCS NQT preparation**, featuring progress visualization, browser alerts, and PWA support.

---

## 📌 Project Overview

The **TCS 15-Day Study Tracker** helps students follow a structured 15-day preparation plan for the TCS exam.  
It tracks daily study tasks, visualizes completion progress, and alerts users when tasks are missed using **browser notifications and sound alerts**.

The project does **not depend on email or external APIs**, making it simple, fast, and reliable.

---

## 🎯 Objectives

- Provide a structured 15-day study plan
- Track daily progress visually
- Alert users immediately when they miss a task
- Offer a mobile-app-like experience using PWA

---

## 🚀 Features

### ✅ Core Features
- Auto-loaded **TCS 15-Day Study Plan**
- Mark tasks as **Completed**
- Live **Donut Chart** with percentage
- Weekly performance analytics

### 🔔 Alert System (Browser-Based)
- 🔴 On-screen alert banner
- 🔊 Sound alert
- 🔔 Browser notification
- 📱 PWA notifications

### 🔄 Reset & Control
- Reset **today’s task**
- Reset **specific selected day**
- Reset **entire plan**
- ↩ Undo last reset

### 📱 Progressive Web App (PWA)
- Installable on desktop & mobile
- Offline UI support
- App-like experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|-----|-----------|
| Backend | Python (Flask) |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |
| Charts | Chart.js |
| Alerts | Web Notifications API |
| PWA | Service Worker, Manifest |

---

## 📁 Project Structure

```

tcs_study_tracker/
│
├── app.py
├── database.db
│
├── templates/
│   └── dashboard.html
│
├── static/
│   ├── style.css
│   ├── alert.mp3
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── sw.js

````

---

## ▶️ How to Run the Project

### 1️⃣ Install Flask
```bash
pip install flask
````

### 2️⃣ Run the application

```bash
python app.py
```

### 3️⃣ Open in browser

```
http://127.0.0.1:5000
```

---

## 🧪 How Alerts Work

* If the **current day’s task is not completed**
* Refreshing the page triggers:

  * ⚠ On-screen warning
  * 🔊 Sound alert
  * 🔔 Browser notification

> Notification permission must be **Allowed** on first load.

---

## 📱 Install as Mobile App (PWA)

1. Open the app in **Chrome / Edge**
2. Click **⋮ → Install App**
3. Launch from desktop or phone home screen

---

## 🧠 Future Enhancements

* User login system
* Cloud deployment
* AI-based study suggestions
* Export progress as PDF/CSV

---

## 👨‍💻 Author

**Developed by:** *PRAJWAL N*
**Purpose:** Academic / Skill-Building Project

---

## 🏁 Conclusion

This project demonstrates:

* Full-stack web development using Flask
* Real-time UI updates
* Browser APIs (Notifications, Audio, PWA)
* Clean and scalable architecture

---

