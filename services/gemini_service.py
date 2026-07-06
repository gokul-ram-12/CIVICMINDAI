import os
import json
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GeminiService")

class GeminiService:
    def __init__(self):
        # Retrieve the API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY environment variable is not set. The Gemini service will fail until configured.")
        else:
            print("Using Gemini API Key Authentication")
            genai.configure(api_key=api_key)
            logger.info("Gemini API successfully configured using API Key.")
            
    def generate_response(self, prompt: str, system_instruction: str = None, json_mode: bool = False, model_name: str = "gemini-1.5-flash") -> str:
        """
        Sends a prompt to the Gemini API and returns the generated text.
        
        Args:
            prompt (str): The main prompt text.
            system_instruction (str, optional): System instructions for framing the agent's behavior.
            json_mode (bool, optional): If True, requests structured JSON output.
            model_name (str, optional): The Gemini model version to use.
            
        Returns:
            str: The raw generated response.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return json.dumps({"error": "GEMINI_API_KEY is not configured. Please set your Gemini API Key in the sidebar."}) if json_mode else "Error: GEMINI_API_KEY is not configured. Please set it in the sidebar."

        try:
            # Set up configuration options
            config = {}
            if json_mode:
                config["response_mime_type"] = "application/json"
            
            # Print authentication pathway logging
            print("Using Gemini API Key Authentication")
            genai.configure(api_key=api_key)

            # Initialize model using genai.GenerativeModel(MODEL_NAME)
            model = genai.GenerativeModel(
                model_name,
                system_instruction=system_instruction,
                generation_config=config
            )
            
            logger.info(f"Generating content using model {model_name}... (JSON Mode: {json_mode})")
            response = model.generate_content(prompt)
            
            if response and response.text:
                return response.text.strip()
            else:
                raise ValueError("Received empty response from Gemini API.")
                
        except Exception as e:
            logger.error(f"Error communicating with Gemini API: {str(e)}")
            if json_mode:
                return json.dumps({
                    "error": f"Failed to generate AI response: {str(e)}",
                    "status_code": 500,
                    "details": "Check API key and network connection."
                })
            else:
                return f"Error: Failed to generate AI response. Details: {str(e)}"

