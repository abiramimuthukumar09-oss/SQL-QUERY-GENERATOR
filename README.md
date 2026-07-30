# SQL-QUERY-GENERATOR
An AI-powered full-stack web application that translates natural language into optimized SQL queries with classification, safety checks, and step-by-step explanations using FastAPI and Google Gemini 2.5 Flash
# ⚡ Natural Language SQL Query Generator (Gemini AI)

An AI-powered full-stack web application that translates plain English descriptions into optimized SQL queries. It automatically classifies query types, detects potentially dangerous operations, and provides step-by-step plain-English explanations.

Built with **FastAPI**, **Google Gemini 2.5 Flash**, and a responsive **Glassmorphism UI**.

---

## ✨ Features

- 🧠 **AI-Driven SQL Generation:** Translates natural language prompts (e.g., *"Show top 10 highest-paid employees in Chennai"*) into structured SQL queries instantly.
- 🛡️ **Safety Warning Engine:** Detects destructive queries (e.g., `DELETE` or `UPDATE` missing `WHERE` clauses) and alerts the user before execution.
- 🏷️ **Query Classification:** Automatically identifies SQL statement types (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`).
- 📖 **Plain-English Explanations:** Breaks down complex generated queries into simple logic.
- 🎨 **Modern Interactive UI:** Glassmorphism design featuring typing effects, prompt chips, single-click copy to clipboard, and LocalStorage query history.

---

## 🛠️ Tech Stack

- **Backend:** Python 3.11, FastAPI, Uvicorn
- **AI / LLM:** Google Gemini 2.5 Flash (`google-genai` SDK)
- **Frontend:** HTML5, CSS3 (Glassmorphism & Animations), Vanilla JavaScript
- **Dev Tools:** `python-dotenv`, Pydantic

---

## 📂 Repository Structure
SQL-QUERY-GENERATOR/
- ├── app.py                # FastAPI backend & Gemini integration
- ├── list_models.py        # Utility script to test Gemini API models
- ├── requirement.txt       # Python dependencies
- ├── .env.example          # Template for environment variables
- ├── .gitignore            # Git exclusion rules
- ├── templates/
- │   └── index.html        # Main HTML layout
- └── static/
- ├── style.css         # Glassmorphism styling
- └── script.js         # Interactive JS & LocalStorage
