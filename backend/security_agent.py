from duckduckgo_search import DDGS
from deep_translator import GoogleTranslator

class SecurityAgent:
    def __init__(self):
        self.translator = GoogleTranslator(source='auto', target='ar')
        self.risk_keywords = {
            'danger': ['خطر', 'تحذير', 'إرهاب', 'مسلح', 'قتل'],
            'crime': ['سرقة', 'جريمة', 'نشل', 'اعتداء', 'لصوص', 'كريساج'],
            'accident': ['حادث', 'اصطدام', 'غرق', 'حريق', 'وفاة'],
            'protest': ['مظاهرة', 'احتجاج', 'إضراب']
        }

    def analyze(self, city_input: str):
        try:
            city_ar = self.translator.translate(city_input)
            print(f"🕵️ Scanning Security for: {city_input} -> {city_ar}")

            # Using standard DDGS which is robust
            query = f'"{city_ar}" أخبار أمن حوادث المغرب'
            results = list(DDGS().text(query, max_results=8))
            
            if not results:
                return {
                    "city": city_input,
                    "risk_level": "Unknown",
                    "risk_color": "gray",
                    "recommendation": "No recent data available.",
                    "hits": {}
                }

            counts = {'crime': 0, 'accident': 0, 'danger': 0}
            total_hits = 0
            
            for res in results:
                content = (res['title'] + " " + res['body']).lower()
                for category, keywords in self.risk_keywords.items():
                    if category in counts:
                        for word in keywords:
                            if word in content:
                                counts[category] += 1
                                total_hits += 1
                                break 

            if total_hits == 0:
                level, color, advice = "Low", "green", "No recent incidents reported."
            elif total_hits <= 2:
                level, color, advice = "Moderate", "orange", "Some isolated incidents reported."
            else:
                level, color, advice = "High", "red", f"Multiple incidents ({total_hits}) reported recently."

            return {
                "city": city_input.capitalize(),
                "city_ar": city_ar,
                "risk_level": level,
                "risk_color": color,
                "recommendation": advice,
                "hits": counts,
                "sources_count": len(results)
            }

        except Exception as e:
            print(f"⚠️ Security Agent Error: {e}")
            return {"city": city_input, "risk_level": "Error", "risk_color": "gray", "recommendation": "Service unavailable.", "hits": {}}
