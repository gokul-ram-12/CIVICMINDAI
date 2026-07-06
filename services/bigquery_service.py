import os
import sqlite3
import logging
import pandas as pd
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BigQueryService")

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CSV_PATH = str(BASE_DIR / "data" / "complaints.csv")

class BigQueryService:
    def __init__(self, csv_path: str = DEFAULT_CSV_PATH):
        self.csv_path = csv_path
        self.local_conn = None
        self.use_cloud = False
        self.bq_client = None
        self.project_id = os.getenv("GCP_PROJECT_ID")
        self.dataset_id = os.getenv("GCP_DATASET_ID", "civicmind_ai")
        self.table_id = os.getenv("GCP_TABLE_ID", "complaints")
        
        # Try to initialize Google Cloud BigQuery client
        # We check for credentials or project configuration
        if os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and self.project_id:
            try:
                from google.cloud import bigquery
                self.bq_client = bigquery.Client(project=self.project_id)
                self.use_cloud = True
                logger.info(f"BigQuery Cloud client successfully initialized for project: {self.project_id}")
            except Exception as e:
                logger.warning(f"Failed to initialize cloud BigQuery client: {str(e)}. Falling back to local SQLite engine.")
        
        # Always initialize local SQLite engine for fast fallback and offline development
        self._init_local_db()

    def _init_local_db(self):
        """Initializes an in-memory SQLite database populated with our CSV data."""
        try:
            self.local_conn = sqlite3.connect(":memory:", check_same_thread=False)
            if os.path.exists(self.csv_path):
                df = pd.read_csv(self.csv_path)
                df.to_sql("complaints", self.local_conn, if_exists="replace", index=False)
                logger.info(f"Loaded {len(df)} records from CSV into in-memory local 'complaints' table.")
            else:
                logger.warning(f"Local CSV file at {self.csv_path} not found. Creating empty local table.")
                # Create empty schema
                empty_df = pd.DataFrame(columns=[
                    "ticket_id", "timestamp", "category", "issue_type", 
                    "zone", "priority", "status", "description"
                ])
                empty_df.to_sql("complaints", self.local_conn, if_exists="replace", index=False)
        except Exception as e:
            logger.error(f"Error initializing local database: {str(e)}")

    def reload_data(self, df: pd.DataFrame):
        """Reloads the local in-memory table with a new DataFrame."""
        try:
            df.to_sql("complaints", self.local_conn, if_exists="replace", index=False)
            logger.info(f"Reloaded {len(df)} records into in-memory local 'complaints' table.")
            
            # If in cloud mode, optionally stream to BigQuery
            if self.use_cloud and self.bq_client:
                self.upload_dataframe_to_bigquery(df)
        except Exception as e:
            logger.error(f"Error reloading data: {str(e)}")

    def query(self, sql_query: str) -> pd.DataFrame:
        """
        Executes a SQL query. If use_cloud is True, queries BigQuery; 
        otherwise queries the local SQLite in-memory database.
        """
        if self.use_cloud and self.bq_client:
            try:
                # Rewrite simple queries if table naming differs (e.g. mapping complaints -> dataset.table)
                full_table_path = f"{self.project_id}.{self.dataset_id}.{self.table_id}"
                adjusted_query = sql_query.replace("complaints", full_table_path)
                
                logger.info(f"Executing cloud BigQuery query: {adjusted_query}")
                query_job = self.bq_client.query(adjusted_query)
                return query_job.to_dataframe()
            except Exception as e:
                logger.error(f"BigQuery cloud query failed: {str(e)}. Falling back to local database query.")
                # Fall back to local sqlite on error
        
        # SQLite querying
        try:
            # SQLite does not support some BigQuery dialects, so we clean standard operations
            # E.g. BigQuery uses double quotes or backticks for column names, SQLite supports backticks
            logger.info(f"Executing local SQLite query: {sql_query}")
            return pd.read_sql_query(sql_query, self.local_conn)
        except Exception as e:
            logger.error(f"Local SQL query failed: {str(e)}")
            # Return empty dataframe with matching columns or structure
            return pd.DataFrame()

    def get_all_data(self) -> pd.DataFrame:
        """Returns the complete dataset."""
        return self.query("SELECT * FROM complaints")

    def upload_dataframe_to_bigquery(self, df: pd.DataFrame):
        """Uploads a pandas DataFrame to Google Cloud BigQuery."""
        if not self.bq_client:
            logger.warning("No BigQuery client available. Skipping cloud upload.")
            return False
            
        try:
            from google.cloud import bigquery
            table_ref = f"{self.project_id}.{self.dataset_id}.{self.table_id}"
            
            job_config = bigquery.LoadJobConfig(
                write_disposition="WRITE_TRUNCATE", # Overwrite existing table
                source_format=bigquery.SourceFormat.CSV,
                autodetect=True
            )
            
            logger.info(f"Uploading {len(df)} rows to BigQuery table: {table_ref}")
            job = self.bq_client.load_table_from_dataframe(df, table_ref, job_config=job_config)
            job.result() # Wait for job to complete
            logger.info("BigQuery upload completed successfully.")
            return True
        except Exception as e:
            logger.error(f"Failed to upload DataFrame to BigQuery: {str(e)}")
            return False
            
    def get_bigquery_ddl(self) -> str:
        """Returns the DDL statement to create the BigQuery schema."""
        table_ref = f"`{self.project_id or 'GCP_PROJECT'}`.`{self.dataset_id}`.`{self.table_id}`"
        return f"""CREATE OR REPLACE TABLE {table_ref} (
    ticket_id STRING OPTIONS(description="Unique ID for each civic issue ticket"),
    timestamp TIMESTAMP OPTIONS(description="Date and time when issue was reported"),
    category STRING OPTIONS(description="Broad category of issue (e.g. Safety, Environment, Infrastructure)"),
    issue_type STRING OPTIONS(description="Specific type of issue (e.g. Pothole, Street Light Out)"),
    zone STRING OPTIONS(description="Civic zone or neighbourhood classification"),
    priority STRING OPTIONS(description="Severity classification (High, Medium, Low)"),
    status STRING OPTIONS(description="Current status (Open, In Progress, Resolved)"),
    description STRING OPTIONS(description="Text description provided by the citizen")
);"""
