# oceanGPT/mcp/db_mcp_server.py
from mcp.server.fastmcp import FastMCP
from sqlalchemy import create_engine, text
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = 'postgres'
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'argo_db'

engine_string = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(engine_string)

mcp = FastMCP("ArgoDBTools")

@mcp.tool()
def run_sql(query: str) -> dict:
    """Execute SQL query on argo_data and return up to 100 rows."""
    try:
        df = pd.read_sql(text(query), engine.connect())
        return {"rows": df.head(100).to_dict(orient="records")}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run(transport="stdio")
