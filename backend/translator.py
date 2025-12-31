import os
import re
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

load_dotenv()

class TerjmanService:
    def __init__(self):
        print("⏳ Loading Terjman-Nano-v2.0 Model...")
        model_name = "atlasia/Terjman-Nano-v2.0"
        hf_token = os.getenv("HF_TOKEN")
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name, token=hf_token)
            print("✅ Terjman Model Loaded Successfully.")
        except Exception as e:
            print(f"⚠️ Translator Error: {e}")
            self.model = None

    def clean_output(self, text: str) -> str:
        """Nettoie les artefacts du modèle comme , [src], etc."""
        # 1. Supprimer les balises entre crochets type ou [src]
        text = re.sub(r'\[.*?\]', '', text)
        # 2. Supprimer les espaces multiples créés par la suppression
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def translate(self, text: str) -> str:
        if not self.model: return "Service Indisponible"
        try:
            # Paramètres optimisés pour la vitesse sur M1
            inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
            
            outputs = self.model.generate(
                **inputs, 
                max_length=128, 
                num_beams=1, # Greedy search (plus rapide)
                early_stopping=True
            )
            
            raw_translation = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return self.clean_output(raw_translation)
            
        except Exception as e:
            return f"Error: {str(e)}"
