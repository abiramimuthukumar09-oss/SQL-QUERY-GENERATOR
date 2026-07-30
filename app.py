import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from google import genai
from pydantic import BaseModel

# -----------------------------
# Load Environment Variables
# -----------------------------
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

app = FastAPI(title="SQL Query Generator")

# -----------------------------
# Static & Templates
# -----------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


# -----------------------------
# Request Model
# -----------------------------
class QueryRequest(BaseModel):
    question: str


# -----------------------------
# Prompt
# -----------------------------
PROMPT = """
You are an expert SQL developer.

Convert the user's natural language request into SQL.

Return ONLY valid JSON.

Format:

{
  "query":"...",
  "type":"SELECT",
  "explanation":"...",
  "warning":"..."
}

Rules:

1. No markdown.
2. No ```json
3. No ```sql
4. If DELETE or UPDATE has no WHERE clause, mention that in warning.
5. If query is safe, warning should be "None".
6. Use generic SQL.
7. Return ONLY JSON.
"""


# -----------------------------
# Extract JSON
# -----------------------------
def extract_json(text: str):

    text = text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "")
        text = text.replace("```", "").strip()

    elif text.startswith("```"):
        text = text.replace("```", "").strip()

    return json.loads(text)


# -----------------------------
# Home
# -----------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


# -----------------------------
# Generate SQL
# -----------------------------
@app.post("/generate")
async def generate(data: QueryRequest):

    try:

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=f"""
{PROMPT}

User Request:

{data.question}
"""
        )

        print("\n========== GEMINI RESPONSE ==========")
        print(response.text)
        print("=====================================\n")

        result = extract_json(response.text)

        return JSONResponse(content=result)

    except Exception as e:

        import traceback
        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "query": "",
                "type": "",
                "explanation": "",
                "warning": str(e)
            }
        )


# -----------------------------
# Run
# -----------------------------
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )