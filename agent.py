import os
from groq import Groq

# Step 1: Initialize LLM agent
client = Groq(api_key="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")

# Step 2: Define the agent's GOAL
goal = "Review and improve the given Python function."

# Step 3: Receive INPUT
code_snippet = """
def add_numbers(a, b):
    return a + b
"""

# Step 4: Agent THINKS and ACTS
prompt = f"""
You are an expert Python code reviewer.
Goal: {goal}
Here is the code:
{code_snippet}
Please review the code, identify any issues, and suggest improvements.
"""

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": prompt}]
)

# Step 5: Agent OUTPUTS result
print("🧠 Review Feedback:\n", response.choices[0].message.content)
