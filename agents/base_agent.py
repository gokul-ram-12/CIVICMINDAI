import os
import logging
from services.gemini_service import GeminiService

logger = logging.getLogger("BaseAgent")

class BaseAgent:
    def __init__(self, name: str, instruction: str, description: str = "", tools: list = None, gemini_service: GeminiService = None):
        self.name = name
        self.instruction = instruction
        self.description = description
        self.tools = tools or []
        self.gemini_service = gemini_service or GeminiService()
        
        logger.info(f"Agent '{self.name}' initialized.")

    def run(self, prompt: str, json_mode: bool = False, model_name: str = "gemini-1.5-flash") -> str:
        """Runs the agent with the given input prompt."""
        logger.info(f"Running agent '{self.name}'...")
        
        # Format tools description if tools are present, and inject into instruction
        full_instruction = self.instruction
        if self.tools:
            tools_desc = "\n\nYou have access to the following tools:\n"
            for t in self.tools:
                tools_desc += f"- {t.__name__}: {t.__doc__ or 'No description'}\n"
            full_instruction += tools_desc
            
        return self.gemini_service.generate_response(
            prompt=prompt,
            system_instruction=full_instruction,
            json_mode=json_mode,
            model_name=model_name
        )
