import json
import logging
from agents.base_agent import BaseAgent
from services.gemini_service import GeminiService

logger = logging.getLogger("InsightAgent")

class InsightAgent(BaseAgent):
    def __init__(self, gemini_service: GeminiService = None):
        instruction = (
            "You are the Insight Agent in the CivicMind AI multi-agent decision intelligence system.\n"
            "Your role is to analyze civic complaints data, identify volume trends, detect spikes (sudden volume increases), "
            "and spot operational anomalies (e.g., specific zones with high density of unresolved issues, unusual clusters of high-priority tickets).\n"
            "You must return your output strictly in JSON format. Do not write any markdown outside the JSON.\n"
            "The JSON structure must be:\n"
            "{\n"
            '  "overall_summary": "Short 2-3 sentence high-level overview of the community health based on data",\n'
            '  "volume_trends": [\n'
            '     {"metric": "Trend Name", "direction": "Rising/Falling/Stable", "description": "Details of the trend"}\n'
            '  ],\n'
            '  "spikes_detected": [\n'
            '     {"category": "Category", "issue_type": "Issue Type", "zone": "Zone", "severity": "High/Medium/Low", "description": "Details of the spike"}\n'
            '  ],\n'
            '  "anomalies": [\n'
            '     {"type": "Anomaly Type", "location": "Zone/Area", "impact": "Impact description", "description": "Why this is an anomaly"}\n'
            '  ]\n'
            "}"
        )
        super().__init__(
            name="InsightAgent",
            instruction=instruction,
            description="Analyzes civic issues data to find volume trends, ticket spikes, and operational anomalies.",
            gemini_service=gemini_service
        )

    def analyze_dataset(self, data_summary: dict) -> dict:
        """
        Runs analysis on a structured summary of the civic data.
        
        Args:
            data_summary (dict): Aggregated facts about the dataset.
            
        Returns:
            dict: Parsed analysis results.
        """
        prompt = (
            f"Please analyze the following structured summary of civic complaints:\n\n"
            f"{json.dumps(data_summary, indent=2)}\n\n"
            f"Generate a detailed analysis identifying the overall state of the community, volume trends, spikes, and anomalies."
        )
        
        try:
            raw_response = self.run(prompt, json_mode=True)
            # Clean response from potential markdown wrapping
            cleaned = raw_response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            res = json.loads(cleaned)
            if not isinstance(res, dict) or "error" in res:
                raise ValueError("Response is malformed or contains an error block.")
            
            # Ensure required keys exist
            res.setdefault("overall_summary", "")
            res.setdefault("volume_trends", [])
            res.setdefault("spikes_detected", [])
            res.setdefault("anomalies", [])
            
            # If overall_summary is empty or contains error indicators, replace with fallback summary
            if not res["overall_summary"] or "error parsing" in res["overall_summary"].lower():
                fallback = self.get_deterministic_insight_fallback(data_summary)
                res["overall_summary"] = fallback["overall_summary"]
                
            return res
        except Exception as e:
            logger.error(f"Failed to parse or validate JSON response from InsightAgent: {str(e)}. Raw response: {raw_response}")
            return self.get_deterministic_insight_fallback(data_summary)

    def get_deterministic_insight_fallback(self, data_summary: dict) -> dict:
        """
        Generates a robust, data-driven fallback analysis using the dataset summary metrics.
        """
        total_tickets = data_summary.get("total_tickets", 0)
        category_counts = data_summary.get("category_counts", {})
        zone_counts = data_summary.get("zone_counts", {})
        status_counts = data_summary.get("status_counts", {})
        
        most_common_category = max(category_counts, key=category_counts.get) if category_counts else "N/A"
        most_common_category_count = category_counts.get(most_common_category, 0)
        
        highest_zone = max(zone_counts, key=zone_counts.get) if zone_counts else "N/A"
        highest_zone_count = zone_counts.get(highest_zone, 0)
        
        resolved = status_counts.get("Resolved", 0)
        open_t = status_counts.get("Open", 0)
        in_progress = status_counts.get("In Progress", 0)
        active = open_t + in_progress
        
        resolved_pct = (resolved / total_tickets * 100) if total_tickets > 0 else 0.0
        active_pct = (active / total_tickets * 100) if total_tickets > 0 else 0.0
        
        # Calculate fastest growing issue category from recent tickets
        recent_tickets = data_summary.get("recent_tickets", [])
        recent_cats = {}
        for t in recent_tickets:
            c = t.get("category")
            if c:
                recent_cats[c] = recent_cats.get(c, 0) + 1
        fastest_growing = max(recent_cats, key=recent_cats.get) if recent_cats else most_common_category
        
        overall_summary = (
            f"CivicMind AI analyzed a total of {total_tickets} complaints. The most common issue category is "
            f"'{most_common_category}' ({most_common_category_count} tickets), with the highest complaint volume concentrated in "
            f"'{highest_zone}' ({highest_zone_count} tickets). The fastest growing issue category is '{fastest_growing}'. "
            f"Currently, {resolved_pct:.1f}% of issues are resolved, while {active_pct:.1f}% remain active or in progress. "
            f"Operational metrics indicate a need for targeted interventions."
        )
        
        # Detect volume spikes
        spikes = []
        if most_common_category != "N/A" and most_common_category_count > 0:
            spikes.append({
                "category": most_common_category,
                "issue_type": "General Reporting",
                "zone": highest_zone,
                "severity": "Medium",
                "description": f"Elevated complaint activity detected for category '{most_common_category}' in zone '{highest_zone}'."
            })
            
        trends = [
            {
                "metric": "Overall Report Volume",
                "direction": "Rising" if active > resolved else "Stable",
                "description": f"Overall reporting is driven by {most_common_category} issues in {highest_zone}."
            },
            {
                "metric": "Resolution Performance",
                "direction": "Stable" if resolved_pct > 50 else "Falling",
                "description": f"Community resolution rate is currently at {resolved_pct:.1f}%."
            }
        ]
        
        anomalies = []
        zone_status = data_summary.get("zone_status_breakdown", {})
        worst_zone = "N/A"
        worst_ratio = 1.0
        for zone, statuses in zone_status.items():
            z_resolved = statuses.get("Resolved", 0)
            z_total = sum(statuses.values())
            if z_total > 0:
                ratio = z_resolved / z_total
                if ratio < worst_ratio:
                    worst_ratio = ratio
                    worst_zone = zone
                    
        if worst_zone != "N/A" and worst_ratio < 0.5:
            anomalies.append({
                "type": "Low Resolution Rate",
                "location": worst_zone,
                "impact": "High backlog accumulation",
                "description": f"Zone '{worst_zone}' has a significantly low resolution rate of {worst_ratio*100:.1f}% compared to other areas."
            })
            
        return {
            "overall_summary": overall_summary,
            "volume_trends": trends,
            "spikes_detected": spikes,
            "anomalies": anomalies
        }

