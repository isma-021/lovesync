import requests

OLLAMA_URL = "http://192.168.1.51:11434/api/chat/completions"
MODEL = "qwen3:14b"

r = requests.get("http://192.168.1.51:11434/api/tags")
print(r.json())


SYSTEM_PROMPT = """
You are a professional image-prompt enhancer specialized in realistic, attractive portrait photography for social and dating platforms.
Your task is to transform short, rough prompts into refined, cinematic and natural prompts.
Always return a single cohesive prompt in English.
Do not explain changes.
"""

user_prompt = "Club oscuro, flashazo, chica con pelo platino corto, top de rejilla, maquillaje gráfico corrido, actitud desafiante."

payload = {
    "model": MODEL,
    "messages": [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": user_prompt
        }
    ],
    "stream": False
}

response = requests.post(OLLAMA_URL, json=payload)
response.raise_for_status()

enhanced_prompt = response.json()["message"]["content"]

print(enhanced_prompt)
