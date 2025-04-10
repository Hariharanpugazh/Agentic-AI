import os
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv
from groq import Groq
import google.generativeai as genai

# === Load environment variables ===
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_MODEL = "llama3-70b-8192"

# === Initialize LLM Clients ===
client = Groq(api_key=GROQ_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-flash-8b")

# === Agent List ===
AGENT_NAMES = [
    "correctness",
    "readability",
    "docstring",
    "security",
    "performance",
    "structure",
    "error_handling",
    "test_coverage"
]

# === Load Prompt from File ===
def load_prompt(agent_name):
    prompt_path = os.path.join("prompts", f"{agent_name}.txt")
    try:
        with open(prompt_path, "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        return f"⚠️ Prompt file not found for agent: {agent_name}"

# === GitHub File Utilities ===
def extract_repo_info(repo_url):
    parts = urlparse(repo_url)
    segments = parts.path.strip("/").split("/")
    if len(segments) >= 2:
        return segments[0], segments[1]
    raise ValueError("Invalid GitHub URL format.")

def get_python_files(owner, repo):
    api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
    response = requests.get(api_url)
    if response.status_code != 200:
        raise Exception(f"GitHub API error: {response.status_code}")
    tree = response.json().get("tree", [])
    return [item["path"] for item in tree if item["path"].endswith(".py")]

def fetch_file_content(owner, repo, filepath):
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{filepath}"
    res = requests.get(raw_url)
    return res.text if res.status_code == 200 else None

# === Run on Groq ===
def run_groq(prompt):
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

# === Run on Gemini ===
def run_gemini(prompt):
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"❌ Gemini error: {str(e)}"

# === Build Agent Prompt ===
def generate_agent_prompt(agent_name, code):
    template = load_prompt(agent_name)
    return template.replace("{code}", code)

# === Run Both Models per Agent ===
def run_agent_on_code(agent_name, code):
    prompt = generate_agent_prompt(agent_name, code)
    return {
        "groq": run_groq(prompt),
        "gemini": run_gemini(prompt)
    }

# === Main Review Entry Point ===
def run_agentic_review(repo_url):
    owner, repo = extract_repo_info(repo_url)
    file_paths = get_python_files(owner, repo)

    all_reviews = {}

    for path in file_paths:
        code = fetch_file_content(owner, repo, path)
        if not code:
            continue

        file_reviews = {}
        for agent in AGENT_NAMES:
            try:
                file_reviews[agent] = run_agent_on_code(agent, code)
            except Exception as e:
                file_reviews[agent] = {
                    "groq": f"❌ Groq failed: {str(e)}",
                    "gemini": "❌ Gemini skipped"
                }

        all_reviews[path] = file_reviews

    return all_reviews
