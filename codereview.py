# agentic_code_reviewer.py
import os
import requests
from groq import Groq
from urllib.parse import urlparse
from tqdm import tqdm

# ========== CONFIG ==========
GROQ_API_KEY = "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"
MODEL_NAME = "llama3-70b-8192"  # Replace with active model name : llama-3.3-70b-versatile

client = Groq(api_key=GROQ_API_KEY)

# ========== FUNCTION: Extract repo details ==========
def extract_repo_info(repo_url):
    parts = urlparse(repo_url)
    path = parts.path.strip("/").split("/")
    if len(path) >= 2:
        return path[0], path[1]
    raise ValueError("Invalid GitHub repo URL")

# ========== FUNCTION: Get file list from repo ==========
def get_python_files(owner, repo):
    api_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
    res = requests.get(api_url)
    if res.status_code != 200:
        raise Exception(f"Failed to access GitHub API: {res.status_code}")
    files = res.json().get("tree", [])
    return [f["path"] for f in files if f["path"].endswith(".py")]

# ========== FUNCTION: Fetch file content ==========
def fetch_file_content(owner, repo, filepath):
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{filepath}"
    res = requests.get(raw_url)
    if res.status_code != 200:
        return None
    return res.text

# ========== FUNCTION: Review code with Groq ==========
def review_code(file_name, code):
    prompt = f"""
You are a senior software engineer.
Your task is to review the following Python file and give detailed feedback on:
- Bugs or errors
- Code style
- Security issues
- Suggestions for improvement

Filename: {file_name}

Code:
{code}
"""
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# ========== MAIN AGENT FLOW ==========
def run_agent(repo_url):
    print("🚀 Starting Agentic Code Review...")
    try:
        owner, repo = extract_repo_info(repo_url)
        py_files = get_python_files(owner, repo)
        print(f"🔍 Found {len(py_files)} Python files.")

        for file_path in tqdm(py_files, desc="Reviewing files"):
            content = fetch_file_content(owner, repo, file_path)
            if not content:
                print(f"⚠️ Skipping unreadable file: {file_path}")
                continue
            review = review_code(file_path, content)
            print(f"\n📄 Review for {file_path}:")
            print(review)
            print("-" * 60)

    except Exception as e:
        print("❌ Agent failed:", str(e))


# ========== ENTRY POINT ==========
if __name__ == "__main__":
    repo_link = input("Enter the GitHub repo URL: ").strip()
    run_agent(repo_link)