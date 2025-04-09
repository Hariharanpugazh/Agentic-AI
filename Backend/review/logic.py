# agentic_code_reviewer_multi_llm.py
import os
import requests
from urllib.parse import urlparse
from tqdm import tqdm
from dotenv import load_dotenv

# === Load environment variables ===
load_dotenv()

# === Import LLM clients ===
from groq import Groq
import google.generativeai as genai

# === API KEYS ===
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# === MODEL CONFIG ===
GROQ_MODEL = "llama3-70b-8192"
GEMINI_MODEL = "gemini-1.5-flash-8b"

# === Init clients ===
groq_client = Groq(api_key=GROQ_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)

gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# === Extract repo info ===
def extract_repo_info(repo_url):
    parts = urlparse(repo_url)
    path = parts.path.strip("/").split("/")
    if len(path) >= 2:
        return path[0], path[1]
    raise ValueError("Invalid GitHub repo URL")

# === Get list of Python files ===
def get_python_files(owner, repo):
    api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
    res = requests.get(api_url)
    if res.status_code != 200:
        raise Exception(f"GitHub API error: {res.status_code}")
    files = res.json().get("tree", [])
    return [f["path"] for f in files if f["path"].endswith(".py")]

# === Fetch raw file content ===
def fetch_file_content(owner, repo, filepath):
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{filepath}"
    res = requests.get(raw_url)
    if res.status_code != 200:
        return None
    return res.text

# === Review with Groq ===
def review_with_groq(filename, code):
    prompt = f"""
You are a senior software engineer. Review the following Python file and provide feedback:
- Bugs or errors
- Code style
- Security concerns
- Suggestions for improvement

Filename: {filename}

Code:
{code}
"""
    response = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

# === Review with Gemini ===
def review_with_gemini(filename, code):
    prompt = f"""
Act as a senior code reviewer. Analyze the following Python code and give feedback on:
- Bugs
- Style
- Security issues
- Suggestions to improve it

Filename: {filename}

Code:
{code}
"""
    response = gemini_model.generate_content(prompt)
    return response.text.strip()

# === Combine Reviews ===
def combine_reviews(file, code):
    groq_feedback = review_with_groq(file, code)
    gemini_feedback = review_with_gemini(file, code)

    return f"\n==== GROQ REVIEW ====\n{groq_feedback}\n\n==== GEMINI REVIEW ====\n{gemini_feedback}\n"

# === Main Agent Flow ===
def run_agentic_review(repo_url):
    try:
        owner, repo = extract_repo_info(repo_url)
        py_files = get_python_files(owner, repo)

        feedback_summary = {}
        for file_path in tqdm(py_files, desc="Reviewing files"):
            content = fetch_file_content(owner, repo, file_path)
            if not content:
                continue
            final_feedback = combine_reviews(file_path, content)
            feedback_summary[file_path] = final_feedback  # ✅ collect results

        return feedback_summary  # ✅ return to views.py

    except Exception as e:
        print("❌ Agent failed:", str(e))

# === Run Entry ===
if __name__ == "__main__":
    repo_link = input("Enter the GitHub repo URL: ").strip()
    run_agentic_review(repo_link)