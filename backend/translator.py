import os
import requests
from dotenv import load_dotenv

load_dotenv()

class TerjmanService:
    def __init__(self):
        # We use the Atlas-Chat model or a specific translation model
        self.api_url = "https://api-inference.huggingface.co/models/MBZUAI-Paris/Atlas-Chat-9B"
        self.api_key = os.getenv("HUGGINGFACE_API_KEY") 
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    def translate(self, text: str, target_lang: str):
        """
        Simple prompt engineering to force the model to translate.
        """
        if not self.api_key:
            return "Error: HuggingFace API Key missing in .env"

        # Construct a prompt for the model
        if target_lang == "darija":
            prompt = f"Translate the following English text to Moroccan Darija using Latin script (Arabizi). Text: {text} Translation:"
        else:
            prompt = f"Translate the following Moroccan Darija text to English. Text: {text} Translation:"

        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 50, "return_full_text": False}
        }

        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            result = response.json()
            if isinstance(result, list) and 'generated_text' in result[0]:
                return result[0]['generated_text'].strip()
            return "Translation service busy (Model loading...)"
        except Exception as e:
            return f"Connection error: {str(e)}"
