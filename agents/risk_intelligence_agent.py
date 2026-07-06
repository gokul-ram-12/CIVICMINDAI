import json
import logging
from agents.base_agent import BaseAgent
from services.gemini_service import GeminiService

logger = logging.getLogger("RiskIntelligenceAgent")

class RiskIntelligenceAgent(BaseAgent):
    def __init__(self, gemini_service: GeminiService = None):
        instruction = (
            "You are the Risk Intelligence Agent in the CivicMind AI multi-agent decision intelligence system.\n"
            "Your role is to assess civic risks, determine sub-category health scores (Safety, Environment, Infrastructure, Public Services) "
            "and calculate the overall Community Health Score (on a scale of 0-100, where 100 is perfect and 0 is severe distress).\n"
            "Higher health scores mean less risk and better conditions. Lower health scores mean high risk.\n"
            "Your calculation should consider factors like ticket volume, proportion of High/Medium priority issues, "
            "unresolved ticket counts, and trends.\n"
            "You must return your output strictly in JSON format. Do not write any markdown outside the JSON.\n"
            "The JSON structure must be:\n"
            "{\n"
            '  "overall_health_score": 74,\n'
            '  "category_scores": {\n'
            '     "Safety": 82,\n'
            '     "Environment": 68,\n'
            '     "Infrastructure": 71,\n'
            '     "Public Services": 75\n'
            '  },\n'
            '  "zone_risk_levels": [\n'
            '     {"zone": "Zone Name", "risk_level": "Low/Medium/High/Critical", "health_score": 70, "primary_drivers": ["Driver 1", "Driver 2"]}\n'
            '  ],\n'
            '  "critical_alerts": [\n'
            '     {"title": "Alert Title", "zone": "Zone Name", "severity": "High/Critical", "explanation": "Why this alert is triggered"}\n'
            '  ]\n'
            "}"
        )
        super().__init__(
            name="RiskIntelligenceAgent",
            instruction=instruction,
            description="Predicts and calculates community health scores and zone-based civic risks.",
            gemini_service=gemini_service
        )

    def calculate_risk(self, data_summary: dict, insight_results: dict) -> dict:
        """
        Calculates community health scores and risk profiles.
        
        Args:
            data_summary (dict): Aggregated facts about the dataset.
            insight_results (dict): Output insights from the InsightAgent.
            
        Returns:
            dict: Parsed risk assessment and scores.
        """
        det = self.get_deterministic_risk_fallback(data_summary)
        
        prompt = (
            f"Using the dataset summary:\n"
            f"{json.dumps(data_summary, indent=2)}\n\n"
            f"And the Insight Agent's insights:\n"
            f"{json.dumps(insight_results, indent=2)}\n\n"
            f"Calculate the overall Community Health Score, the sub-scores for Safety, Environment, "
            f"Infrastructure, and Public Services, and assess the risk level for each zone."
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
            
            # Force numerical scores and structures to match our deterministic math
            res["overall_health_score"] = det["overall_health_score"]
            res["category_scores"] = det["category_scores"]
            
            # Merge zone risk levels
            gemini_zones = {z.get("zone"): z for z in res.get("zone_risk_levels", []) if z.get("zone")}
            merged_zones = []
            for z_det in det["zone_risk_levels"]:
                zone_name = z_det["zone"]
                if zone_name in gemini_zones:
                    z_gem = gemini_zones[zone_name]
                    drivers = z_gem.get("primary_drivers", [])
                    if not drivers:
                        drivers = z_det["primary_drivers"]
                    merged_zones.append({
                        "zone": zone_name,
                        "risk_level": z_det["risk_level"],
                        "health_score": z_det["health_score"],
                        "primary_drivers": drivers
                    })
                else:
                    merged_zones.append(z_det)
            res["zone_risk_levels"] = merged_zones
            
            # Merge critical alerts
            alerts = res.get("critical_alerts", [])
            if not alerts:
                res["critical_alerts"] = det["critical_alerts"]
            else:
                for alert in alerts:
                    alert.setdefault("title", "Active Civic Alert")
                    alert.setdefault("zone", "Multiple Zones")
                    alert.setdefault("severity", "High")
                    alert.setdefault("explanation", "Potential civic bottleneck identified.")
                    
            return res
        except Exception as e:
            logger.error(f"Failed to parse or validate JSON response from RiskIntelligenceAgent: {str(e)}. Raw response: {raw_response if 'raw_response' in locals() else 'None'}")
            return det

    def get_deterministic_risk_fallback(self, data_summary: dict) -> dict:
        """
        Calculates category health scores and zone risks directly from dataset summary metrics.
        """
        total_tickets = data_summary.get("total_tickets", 0)
        category_counts = data_summary.get("category_counts", {})
        zone_counts = data_summary.get("zone_counts", {})
        
        # Calculate category scores
        category_scores = {}
        standard_categories = ["Safety", "Environment", "Infrastructure", "Public Services"]
        
        # Get breakdowns
        cat_status = data_summary.get("category_status_breakdown", {})
        cat_active_prio = data_summary.get("category_active_priority_breakdown", {})
        
        for cat in standard_categories:
            cat_key = cat
            if cat not in category_counts:
                # search for keys like 'Services' or similar
                for k in category_counts.keys():
                    if cat.lower() in k.lower() or k.lower() in cat.lower():
                        cat_key = k
                        break
            
            c_total = category_counts.get(cat_key, 0)
            if c_total == 0:
                category_scores[cat] = 75  # default
                continue
                
            c_statuses = cat_status.get(cat_key, {})
            c_resolved = c_statuses.get("Resolved", 0)
            c_active = c_total - c_resolved
            
            c_active_prios = cat_active_prio.get(cat_key, {})
            c_high_active = c_active_prios.get("High", 0)
            c_med_active = c_active_prios.get("Medium", 0)
            
            # Formula: 100 - (active/total * 40) - (high_active/total * 35) - (medium_active/total * 15)
            c_score = 100 - (c_active / c_total * 40) - (c_high_active / c_total * 35) - (c_med_active / c_total * 15)
            category_scores[cat] = max(10, min(100, int(round(c_score))))
            
        overall_health_score = int(round(sum(category_scores.values()) / len(category_scores))) if category_scores else 75
        
        # Calculate zone risks
        zone_risk_levels = []
        zone_status = data_summary.get("zone_status_breakdown", {})
        zone_active_prio = data_summary.get("zone_active_priority_breakdown", {})
        
        for zone in zone_counts.keys():
            z_total = zone_counts.get(zone, 0)
            if z_total == 0:
                continue
                
            z_statuses = zone_status.get(zone, {})
            z_resolved = z_statuses.get("Resolved", 0)
            z_active = z_total - z_resolved
            
            z_active_prios = zone_active_prio.get(zone, {})
            z_high_active = z_active_prios.get("High", 0)
            z_med_active = z_active_prios.get("Medium", 0)
            
            # Risk formula: 30 + (active/total * 60) + (high_active/total * 45) + (medium_active/total * 15)
            z_risk_score = 30 + (z_active / z_total * 60) + (z_high_active / z_total * 45) + (z_med_active / z_total * 15)
            z_risk_score = max(10, min(100, int(round(z_risk_score))))
            
            # Map risk level
            if z_risk_score >= 80:
                risk_level = "Critical"
            elif z_risk_score >= 60:
                risk_level = "High"
            elif z_risk_score >= 35:
                risk_level = "Medium"
            else:
                risk_level = "Low"
                
            # Health score is 100 - risk_score
            z_health = max(10, min(100, 100 - z_risk_score))
            
            # Build drivers
            drivers = []
            if z_active > 0:
                drivers.append(f"{z_active} unresolved issues")
            if z_high_active > 0:
                drivers.append(f"{z_high_active} high-priority active cases")
            if not drivers:
                drivers.append("Normal reporting volume")
                
            zone_risk_levels.append({
                "zone": zone,
                "risk_level": risk_level,
                "health_score": z_health,
                "primary_drivers": drivers
            })
            
        # Critical alerts
        critical_alerts = []
        for z_risk in zone_risk_levels:
            if z_risk["risk_level"] in ["High", "Critical"]:
                critical_alerts.append({
                    "title": f"Elevated Risk in {z_risk['zone']}",
                    "zone": z_risk["zone"],
                    "severity": z_risk["risk_level"],
                    "explanation": f"High concentration of unresolved issues: {', '.join(z_risk['primary_drivers'])}."
                })
                
        if not critical_alerts and total_tickets > 0:
            critical_alerts.append({
                "title": "Routine Maintenance Backlog",
                "zone": "All Zones",
                "severity": "Medium",
                "explanation": "Standard backlog of minor complaints across municipal sectors."
            })
            
        return {
            "overall_health_score": overall_health_score,
            "category_scores": category_scores,
            "zone_risk_levels": zone_risk_levels,
            "critical_alerts": critical_alerts
        }

