import os
import json
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# Load environment variables
load_dotenv()

# --- Configuration ---
# We use Gemini's Embedding model for high quality vector search
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

class RAGService:
    def __init__(self, json_path: str = "data/knowledge_base.json"):
        self.json_path = json_path
        self.vector_db_path = "data/chroma_db"
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.vectorstore = None
        
        # Initialize the DB
        self._initialize_db()

    def _load_data(self):
        """Loads JSON and converts it to LangChain Documents"""
        with open(self.json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        documents = []
        for item in data:
            # We create a rich text representation for the AI to read
            content = f"""
            Name: {item['name']}
            Category: {item['category']}
            Location: {item['location']}
            Description: {item['description']}
            Safety Tips: {item['safety_tips']}
            Budget: {item['budget']}
            """
            # Metadata helps us filter later if needed
            meta = {"source": item['name'], "category": item['category']}
            documents.append(Document(page_content=content, metadata=meta))
        return documents

    def _initialize_db(self):
        """Creates or loads the Vector Database"""
        print("⚡ Loading Knowledge Base...")
        
        # Check if DB exists to avoid rebuilding every time (Efficiency)
        if os.path.exists(self.vector_db_path):
             self.vectorstore = Chroma(persist_directory=self.vector_db_path, embedding_function=self.embeddings)
             print("✅ Loaded existing Vector DB.")
        else:
            docs = self._load_data()
            self.vectorstore = Chroma.from_documents(
                documents=docs, 
                embedding=self.embeddings,
                persist_directory=self.vector_db_path
            )
            print("✅ Created new Vector DB from JSON.")

    def get_answer(self, query: str):
        """Main function to ask the AI"""
        
        # 1. Setup the Gemini Chat Model
        llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
        
        # 2. Define the "Moroccan Guide" Persona
        template = """
        You are a knowledgeable and friendly Moroccan tour guide in Marrakech.
        Use the following pieces of context to answer the tourist's question.
        
        - If the safety risk is mentioned in the context, ALWAYS warn the user.
        - If you don't know the answer from the context, say you don't know, don't make it up.
        - Speak in a welcoming tone.
        
        Context: {context}
        
        Question: {question}
        
        Answer:
        """
        prompt = PromptTemplate(template=template, input_variables=["context", "question"])
        
        # 3. Create the Chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 2}), # Retrieve top 2 matches
            chain_type_kwargs={"prompt": prompt}
        )
        
        # 4. Run
        return qa_chain.invoke(query)
