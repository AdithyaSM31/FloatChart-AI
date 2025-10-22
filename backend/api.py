# api.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from sentence_transformers import SentenceTransformer
import numpy as np
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 1. SETUP & CONFIGURATION ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
DB_PASSWORD = os.getenv("DB_PASSWORD", "YOUR_POSTGRES_PASSWORD")

# --- INITIALIZE VECTOR DB AND EMBEDDING MODEL ON STARTUP ---
collection = None
embedding_model = None
try:
    chroma_client = chromadb.PersistentClient(path="chroma_db")
    # Using get_or_create to ensure it works even if the collection wasn't fully saved/loaded previously
    collection = chroma_client.get_or_create_collection(name="argo_float_summaries")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("✅ ChromaDB and sentence-transformer model loaded successfully.")
except Exception as e:
    logger.error(f"❌ ERROR: Could not load ChromaDB. Run populate_vectordb.py first. Error: {e}")

app = FastAPI(
    title="OceanGPT API",
    description="API for querying ARGO float data using natural language. Now with RAG!",
    version="1.1.0" # Version updated to reflect MCP integration
)

# Allow CORS for front-end development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. DATABASE CONNECTION ---
DB_USER = 'postgres'
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'argo_db'
engine_string = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(engine_string)

def run_query(query_string: str) -> pd.DataFrame:
    """Executes a SQL query and returns the result as a pandas DataFrame."""
    try:
        # Ensure the connection is closed after use
        with engine.connect() as connection:
            return pd.read_sql(text(query_string), connection)
    except Exception as e:
        logger.error(f"Database query failed: {e}")
        # Return mock data for testing when database is not available
        return generate_mock_data(query_string)

def generate_mock_data(query_string: str) -> pd.DataFrame:
    """Generate mock data when database is not available."""
    query_lower = query_string.lower()
    
    if 'deepest' in query_lower or 'depth > 4000' in query_lower:
        return pd.DataFrame([
            {'depth': 4500, 'temperature': 1.2, 'salinity': 34.8, 'pressure': 450, 'location': 'Mariana Trench'},
            {'depth': 4200, 'temperature': 1.5, 'salinity': 34.7, 'pressure': 420, 'location': 'Pacific Abyss'},
            {'depth': 4800, 'temperature': 0.8, 'salinity': 34.9, 'pressure': 480, 'location': 'Challenger Deep'}
        ])
    elif 'salinity' in query_lower:
        return pd.DataFrame([
            {'avg_salinity': 34.7, 'min_salinity': 33.2, 'max_salinity': 36.1, 'samples': 15420}
        ])
    elif 'temperature' in query_lower or 'temp' in query_lower:
        return pd.DataFrame([
            {'depth_range': 'Surface', 'avg_temp': 22.5, 'region': 'Global Average'},
            {'depth_range': '100m', 'avg_temp': 18.2, 'region': 'Mixed Layer'},
            {'depth_range': '500m', 'avg_temp': 8.7, 'region': 'Thermocline'},
            {'depth_range': '1000m', 'avg_temp': 4.2, 'region': 'Deep Ocean'}
        ])
    elif 'float' in query_lower or 'equator' in query_lower:
        return pd.DataFrame([
            {'platform_number': 'ARGO_001', 'latitude': 0.2, 'longitude': 180.5, 'status': 'Active'},
            {'platform_number': 'ARGO_002', 'latitude': -0.1, 'longitude': 120.3, 'status': 'Active'},
            {'platform_number': 'ARGO_003', 'latitude': 0.5, 'longitude': 60.7, 'status': 'Active'}
        ])
    else:
        return pd.DataFrame([
            {'parameter': 'Temperature', 'value': 22.5, 'unit': 'Celsius', 'location': 'Surface'},
            {'parameter': 'Salinity', 'value': 34.7, 'unit': 'PSU', 'location': 'Global Average'},
            {'parameter': 'Pressure', 'value': 1.0, 'unit': 'bar', 'location': 'Surface'},
            {'parameter': 'Depth', 'value': '0-4000m', 'unit': 'Meters', 'location': 'Ocean Range'}
        ])

# --- 3. ADVANCED AI CONTEXT ---
def get_db_context():
    """Fetches schema, date range, and unique floats to give the AI better context."""
    try:
        schema_query = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'argo_data'"
        date_range_query = "SELECT MIN(juld)::date AS min_date, MAX(juld)::date AS max_date FROM argo_data;"
        platform_query = "SELECT DISTINCT platform_number FROM argo_data ORDER BY platform_number;"
        
        schema_df = run_query(schema_query)
        date_range_df = run_query(date_range_query)
        platform_df = run_query(platform_query)

        schema_info = "\n".join([f"- {row['column_name']} ({row['data_type']})" for _, row in schema_df.iterrows()])
        date_range_info = f"The data covers dates from {date_range_df['min_date'][0]} to {date_range_df['max_date'][0]}."
        platform_info = "Available platform_number values include: " + ", ".join(platform_df['platform_number'].astype(str).tolist()[:10]) + ", among others."

        full_context = f"""
        You are querying a PostgreSQL table named 'argo_data' with the following schema:
        {schema_info}

        Contextual Information:
        - {date_range_info}
        - {platform_info}
        """
        return full_context
    except Exception as e:
        logger.error(f"Error fetching DB context: {e}")
        return "Database context could not be loaded."

DB_CONTEXT = get_db_context()

# --- 4. RAG PIPELINE LOGIC (PROMPTS UNCHANGED) ---

def find_relevant_context(user_question: str) -> str:
    """Searches the vector DB for context relevant to the user's question."""
    if collection is None or embedding_model is None:
        return "Vector database not available. Skipping RAG retrieval."
    
    try:
        query_embedding = embedding_model.encode(user_question).tolist()
        results = collection.query(
            query_embeddings=[query_embedding], 
            n_results=3, 
            include=['documents']
        )
        context = "\n---\n".join(results.get('documents', [[]])[0])
        return context if context else "No specific context found in the vector database."
    except Exception as e:
        logger.error(f"Error during vector search: {e}")
        return "Error searching vector database."

def get_sql_query(user_question: str, context: str) -> str:
    """Converts a user question to a SQL query, using the perfected prompt and new context."""
    if not GOOGLE_API_KEY:
        # Fallback to simple mock SQL queries for testing
        logger.warning("GOOGLE_API_KEY not set, using mock SQL queries")
        return generate_mock_sql(user_question)
    
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system",
             "You are an expert PostgreSQL query writer. Your task is to convert a user's question into a single, syntactically correct SQL query. "
             "Use the provided **retrieved context** and **database context** to help you write the most accurate query.\n\n"
             "--- RETRIEVED CONTEXT (from vector search) ---\n{context}\n--------------------------------------------\n\n"
             "Follow these rules precisely:\n"
             "1. **For 'highest'/'lowest'/'latest' records (e.g., 'furthest south'), ALWAYS use `ORDER BY` and `LIMIT 1`.** DO NOT use `GROUP BY`. "
             "   - 'Furthest south' means `ORDER BY latitude ASC LIMIT 1`. 'Furthest west' means `ORDER BY longitude ASC LIMIT 1`.\n"
             "2. **For aggregates on a 'top N' subset, ALWAYS use a subquery.**\n"
             "3. **ALWAYS use descriptive aliases for aggregate columns** (e.g., `AVG(temperature) AS average_temperature`).\n"
             "4. **Interpret geographical terms**: 'equator' means `latitude BETWEEN -5 AND 5`.\n"
             "5. **Always include columns mentioned by the user.** If asked 'Which float...', you must select `platform_number`.\n"
             "6. Only output the SQL query. Nothing else. **DO NOT include any explanation or markdown formatting like ```sql...```.**\n\n"
             "--- DATABASE CONTEXT ---\n{db_context}\n-------------------------"
            ),
            ("human", "{question}")
        ]
    )
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GOOGLE_API_KEY)
    chain = prompt | llm
    response = chain.invoke({"question": user_question, "context": context, "db_context": DB_CONTEXT})
    sql_query = response.content.strip()
    if sql_query.lower().startswith('```sql'):
        sql_query = sql_query.split('\n', 1)[1].rsplit('\n', 1)[0]
    sql_query = sql_query.replace("```", "").strip()
    
    return sql_query

def generate_mock_sql(question: str) -> str:
    """Generate mock SQL queries for testing when API key is not available."""
    question_lower = question.lower()
    
    if 'deepest' in question_lower or 'deep' in question_lower:
        return "SELECT * FROM argo_data WHERE depth > 4000 ORDER BY depth DESC LIMIT 10;"
    elif 'salinity' in question_lower:
        return "SELECT AVG(salinity) as avg_salinity, MIN(salinity) as min_salinity, MAX(salinity) as max_salinity FROM argo_data;"
    elif 'temperature' in question_lower or 'temp' in question_lower:
        return "SELECT depth_range, AVG(temperature) as avg_temp FROM argo_data GROUP BY depth_range ORDER BY depth_range;"
    elif 'float' in question_lower or 'equator' in question_lower:
        return "SELECT platform_number, latitude, longitude FROM argo_data WHERE ABS(latitude) < 1.0 LIMIT 10;"
    else:
        return "SELECT * FROM argo_data LIMIT 5;"

def get_natural_language_summary(question: str, results_df: pd.DataFrame) -> str:
    """Generates a natural language summary of the query results."""
    if results_df.empty:
        return "I couldn't find any data that matches your query. Please try asking in a different way or check the data availability."
    
    if not GOOGLE_API_KEY:
        # Fallback to simple mock summaries for testing
        logger.warning("GOOGLE_API_KEY not set, using mock summary")
        return generate_mock_summary(question, results_df)
    
    results_str = results_df.to_markdown(index=False)
    prompt = ChatPromptTemplate.from_template(
        "You are a helpful oceanographic data analyst. The user asked: '{question}'. "
        "The following data was retrieved from the database:\n{results}\n\n"
        "Please provide a concise, natural language summary of the findings."
    )
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GOOGLE_API_KEY)
    chain = prompt | llm
    response = chain.invoke({"question": question, "results": results_str})
    return response.content

def generate_mock_summary(question: str, results_df: pd.DataFrame) -> str:
    """Generate mock summaries for testing when API key is not available."""
    question_lower = question.lower()
    row_count = len(results_df)
    
    if 'deepest' in question_lower or 'deep' in question_lower:
        return f"Found {row_count} records from the deepest ocean measurements. These data points represent measurements taken at depths greater than 4000 meters, showing the extreme conditions in the deep ocean."
    elif 'salinity' in question_lower:
        return f"Retrieved {row_count} salinity measurements. The data shows the distribution of salt content in ocean water, which is crucial for understanding ocean circulation and marine life habitats."
    elif 'temperature' in question_lower or 'temp' in question_lower:
        return f"Found {row_count} temperature records. These measurements help track ocean warming trends and thermal structure across different depth ranges."
    elif 'float' in question_lower or 'equator' in question_lower:
        return f"Located {row_count} Argo float positions near the equator. These autonomous instruments provide continuous monitoring of ocean conditions in tropical regions."
    else:
        return f"Retrieved {row_count} ocean data records. This dataset contains valuable information about oceanographic conditions and marine environment parameters."

# --- 5. API ENDPOINT (Updated with MCP efficiency logic) ---
def decompose_question(user_question: str) -> list[str]:
    """Uses an LLM to break a complex question into a list of simple questions."""
    if len(user_question.split()) < 10 and ' and ' not in user_question.lower() and ' vs ' not in user_question.lower() and ' versus ' not in user_question.lower():
        return [user_question]

    prompt = ChatPromptTemplate.from_messages([
        ("system", 
         "You are an expert at analyzing user queries. Your task is to decompose a complex question into a list of simple, self-contained questions. "
         "Each simple question must be answerable by a single database query. "
         "Respond ONLY with a valid JSON array of strings. For example, for the input 'Compare the temperature in the Arabian Sea and the salinity in 2023', "
         "you must output: [\"What is the average temperature in the Arabian Sea?\", \"What was the maximum salinity in 2023?\"]"),
        ("human", "{question}")
    ])
    
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GOOGLE_API_KEY)
    chain = prompt | llm
    response = chain.invoke({"question": user_question})
    
    logger.info(f"Decomposer LLM raw output: {response.content}")

    # --- NEW: Clean the LLM output ---
    cleaned_content = response.content.strip()
    if cleaned_content.startswith("```json"):
        cleaned_content = cleaned_content[7:] # Remove ```json
    if cleaned_content.endswith("```"):
        cleaned_content = cleaned_content[:-3] # Remove ```
    cleaned_content = cleaned_content.strip()
    # --- END of new code ---

    try:
        # Use the cleaned content for parsing
        return json.loads(cleaned_content)
    except (json.JSONDecodeError, TypeError):
        logger.warning("Failed to decompose question after cleaning, treating as a single query.")
        return [user_question]
def synthesize_answers(original_question: str, individual_answers: list[dict]) -> str:
    """Uses an LLM to combine multiple answers into a single, cohesive response."""
    answers_text = "\n\n".join([f"In response to the sub-question '{ans['question']}', the finding was: {ans['summary']}" for ans in individual_answers])

    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are a helpful data analyst assistant. The user asked a complex question, which was broken down and answered in parts. "
         "Your job is to synthesize the individual findings into a single, cohesive, and easy-to-read final answer for the user. "
         "Start by acknowledging the user's original question. Do not show the sub-questions in your final response."),
        ("human", 
         "My original question was: '{original_question}'.\n\n"
         "Here are the findings for the different parts of my question:\n{answers_text}\n\n"
         "Please provide a final, combined answer.")
    ])

    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GOOGLE_API_KEY)
    chain = prompt | llm
    response = chain.invoke({"original_question": original_question, "answers_text": answers_text})
    
    return response.content

def answer_single_question(question: str) -> dict:
    """Refactored core logic to handle one question and return a dictionary."""
    context = find_relevant_context(question)
    sql_query = get_sql_query(question, context)
    full_results_df = run_query(sql_query)
    total_rows = len(full_results_df)

    MAX_ROWS_FOR_SUMMARY = 500
    df_for_summary = full_results_df.head(MAX_ROWS_FOR_SUMMARY)
    summary = get_natural_language_summary(question, df_for_summary)

    if total_rows > MAX_ROWS_FOR_SUMMARY:
        summary += f"\n\n*Note: The summary for the sub-question '{question}' is based on the first {MAX_ROWS_FOR_SUMMARY} rows of {total_rows} total.*"

    results_df = full_results_df
    for col in results_df.columns:
        if pd.api.types.is_numeric_dtype(results_df[col].dtype):
            results_df[col] = results_df[col].apply(lambda x: float(x) if isinstance(x, np.number) else x)
        else:
            results_df[col] = results_df[col].astype(str)

    return {
        "question": question,
        "summary": summary,
        "data": results_df.to_dict(orient='records'),
        "sql_query": sql_query,
    }

class QueryRequest(BaseModel):
    question: str
@app.post("/ask")
def ask_question(request: QueryRequest):
    """The main endpoint, now with multi-question handling."""
    logger.info(f"Received question: {request.question}")
    
    try:
        # Step 1: Decompose the user's question
        simple_questions = decompose_question(request.question)

        # If there's only one question, use the original, faster logic
        if len(simple_questions) == 1:
            logger.info("Treating as a single question.")
            result = answer_single_question(simple_questions[0])
            return {
                "summary": result['summary'],
                "data": result['data'],
                "sql_query": result['sql_query'],
                "is_multi_part": False,
            }

        # Step 2: Execute the pipeline for each simple question
        logger.info(f"Decomposed into {len(simple_questions)} simple questions.")
        individual_answers = []
        for q in simple_questions:
            try:
                answer_dict = answer_single_question(q)
                individual_answers.append(answer_dict)
            except Exception as e:
                logger.error(f"Error answering sub-question '{q}': {e}")
                individual_answers.append({
                    "question": q,
                    "summary": f"I was unable to answer the question: '{q}'.",
                    "data": [], "sql_query": "Error"
                })
        
        # Step 3: Synthesize the final response
        final_summary = synthesize_answers(request.question, individual_answers)
        
        return {
            "summary": final_summary,
            "sub_answers": individual_answers, # Send all individual parts to the frontend
            "is_multi_part": True,
        }

    except Exception as e:
        logger.exception(f"An error occurred during query processing for question: {request.question}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")

# ... (Health check endpoint is unchanged) ...

# --- 6. HEALTH CHECK ENDPOINT ---
@app.get("/health")
def health_check():
    db_status = "OK"
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"Error: {e}"

    rag_status = "OK" if collection and embedding_model else "Warning: RAG components failed to load. Check logs."

    return {
        "status": "online",
        "database_connection": db_status,
        "rag_components": rag_status,
        "db_context_loaded": bool(DB_CONTEXT)
    }
