import os
import json
import shutil
from dotenv import load_dotenv

load_dotenv()

class RAGService:
    def __init__(self):
        # Absolute paths for stability
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.json_path = os.path.join(base_dir, "data", "knowledge_base.json")
        self.vector_db_path = os.path.join(base_dir, "data", "chroma_db")
        
        self.chain = None
        self.docs = []
        
        # 1. Load Data
        self._load_raw_data()
        
        try:
            if not self.docs:
                raise ValueError("Knowledge base is empty.")

            print("🧠 Initializing RAG Engine (Gemini 2.5)...")
            
            # Modern Imports
            from langchain_chroma import Chroma
            from langchain_huggingface import HuggingFaceEmbeddings
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain.chains import create_retrieval_chain
            from langchain.chains.combine_documents import create_stuff_documents_chain
            from langchain_core.prompts import ChatPromptTemplate
            from langchain_core.documents import Document

            if not os.getenv("GOOGLE_API_KEY"):
                raise ValueError("GOOGLE_API_KEY missing in .env")

            # Prepare Documents
            documents = []
            for item in self.docs:
                content = f"Location: {item.get('name')}\nInfo: {item.get('description')}\nSafety: {item.get('safety_tips', 'Standard')}"
                documents.append(Document(page_content=content, metadata={"source": item.get('name')}))

            # 2. Local Embeddings (Updated to langchain_huggingface)
            print("📥 Loading local embeddings (all-MiniLM-L6-v2)...")
            embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
            
            # 3. Vector DB Initialization
            # Note: We let Chroma handle persistence automatically
            vectorstore = Chroma.from_documents(
                documents=documents, 
                embedding=embeddings,
                persist_directory=self.vector_db_path
            )
            
            # 4. LLM (Updated to gemini-2.5-flash)
            # gemini-1.5-flash is retired; using the stable 2.5 release
            llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
            
            prompt = ChatPromptTemplate.from_template("""
            You are Zelig, an expert guide for Morocco. Answer the question using the context below.
            If the answer is not in the context, use your general knowledge.
            
            <context>
            {context}
            </context>
            
            Question: {input}
            """)
            
            doc_chain = create_stuff_documents_chain(llm, prompt)
            self.chain = create_retrieval_chain(vectorstore.as_retriever(search_kwargs={"k": 5}), doc_chain)
            print("✅ RAG Active (Gemini 2.5 Flash + HuggingFace)")
            
        except Exception as e:
            print(f"⚠️ RAG Initialisation Failed: {e}")
            print("ℹ️ Switching to Keyword Fallback Mode")
            self.chain = None

    def _load_raw_data(self):
        try:
            if os.path.exists(self.json_path):
                with open(self.json_path, 'r', encoding='utf-8') as f:
                    self.docs = json.load(f)
            else: self.docs = []
        except: self.docs = []

    def get_answer(self, query: str):
        # 1. RAG Attempt
        if self.chain:
            try:
                # Debug print as requested in troubleshooting step 5
                print(f"🔍 RAG Query: {query}")
                response = self.chain.invoke({"input": query})
                return {"result": response["answer"]}
            except Exception as e:
                print(f"❌ Chain Invocation Error: {str(e)}")
        
        # 2. Fallback Mode
        results = [d['description'] for d in self.docs if query.lower() in str(d).lower()]
        if results: return {"result": "Quick Info (Offline): " + results[0]}
        return {"result": "Désolé, je n'ai pas l'information pour le moment."}
