import datetime
from jinja2 import Template

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CivicMind AI - Executive Decision Report</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            line-height: 1.6;
            margin: 40px;
            background-color: #ffffff;
        }
        .header {
            border-bottom: 3px solid #1A73E8;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .logo-title h1 {
            margin: 0;
            color: #1A73E8;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .logo-title p {
            margin: 5px 0 0 0;
            color: #666666;
            font-size: 14px;
        }
        .meta-info {
            text-align: right;
            font-size: 13px;
            color: #666666;
        }
        
        /* Stats Sections */
        .grid-stats {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .score-section {
            background: #F8F9FA;
            border: 1px solid #E0E0E0;
            border-radius: 8px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .overall-score {
            text-align: center;
            flex: 1;
            border-right: 1px solid #E0E0E0;
            padding-right: 20px;
        }
        .overall-score-num {
            font-size: 48px;
            font-weight: bold;
            color: #1A73E8;
            margin: 0;
        }
        .overall-score-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666666;
            margin: 5px 0 0 0;
        }
        .sub-scores {
            flex: 2;
            padding-left: 25px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .score-bar-container {
            margin-bottom: 5px;
        }
        .score-bar-label {
            font-size: 12px;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }
        .score-bar-bg {
            background-color: #E2E8F0;
            height: 6px;
            border-radius: 3px;
            overflow: hidden;
        }
        .score-bar-fill {
            height: 100%;
            border-radius: 3px;
        }
        
        .accel-section {
            background: linear-gradient(135deg, #E8F0FE 0%, #F3E8FF 100%);
            border: 1px solid #D2E3FC;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .accel-num {
            font-size: 38px;
            font-weight: 800;
            color: #1A73E8;
            margin: 0;
            line-height: 1;
        }
        .accel-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #202124;
            font-weight: bold;
            margin: 8px 0 4px 0;
        }
        .accel-text {
            font-size: 12px;
            color: #5F6368;
            margin: 0;
        }
        
        .section-title {
            color: #202124;
            font-size: 18px;
            border-bottom: 1px solid #E0E0E0;
            padding-bottom: 6px;
            margin-top: 30px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .trend-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            border: 1px solid #E0E0E0;
            border-radius: 6px;
            padding: 15px;
            background: #ffffff;
        }
        .trend-card h4 {
            margin: 0 0 8px 0;
            font-size: 15px;
            color: #202124;
            display: flex;
            justify-content: space-between;
        }
        .badge {
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
        .badge-rising { background: #FCE8E6; color: #C5221F; }
        .badge-falling { background: #E6F4EA; color: #137333; }
        .badge-stable { background: #E8F0FE; color: #1A73E8; }
        
        .badge-high { background: #FCE8E6; color: #C5221F; }
        .badge-med { background: #FEF7E0; color: #B06000; }
        .badge-low { background: #E8F0FE; color: #1A73E8; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #E0E0E0;
            font-size: 14px;
        }
        th {
            background-color: #F8F9FA;
            color: #202124;
            font-weight: 600;
        }
        .rec-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px dashed #E0E0E0;
        }
        .rec-item:last-child {
            border-bottom: none;
        }
        .rec-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .rec-title {
            font-size: 16px;
            font-weight: 600;
            color: #202124;
            margin: 0;
        }
        .rec-meta {
            font-size: 13px;
            color: #666666;
            margin-bottom: 8px;
        }
        .rec-steps {
            margin: 10px 0;
            padding-left: 20px;
            font-size: 14px;
        }
        .rec-footer {
            font-size: 13px;
            background: #E8F0FE;
            padding: 10px 15px;
            border-radius: 4px;
            color: #1A73E8;
            margin-top: 10px;
        }
        .rec-metric-row {
            display: flex;
            gap: 20px;
            margin-top: 5px;
            font-size: 12px;
            color: #202124;
            font-weight: 500;
        }
        .rec-metric-item {
            background: rgba(26, 115, 232, 0.08);
            padding: 3px 8px;
            border-radius: 4px;
        }
        .print-btn-container {
            margin-bottom: 30px;
            text-align: right;
        }
        .btn-print {
            background-color: #1A73E8;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-print:hover {
            background-color: #1557B0;
        }
        
        @media print {
            .print-btn-container {
                display: none;
            }
            body {
                margin: 0;
            }
        }
    </style>
</head>
<body>

    <div class="print-btn-container">
        <button class="btn-print" onclick="window.print()">Print Executive PDF</button>
    </div>

    <div class="header">
        <div class="logo-title">
            <h1>CIVICMIND AI</h1>
            <p>Decision Intelligence Platform for Smarter Communities</p>
        </div>
        <div class="meta-info">
            <strong>Document Ref:</strong> CM-EXEC-{{ date_str }}<br>
            <strong>Date Generated:</strong> {{ date_full }}<br>
            <strong>Status:</strong> Approved for Review
        </div>
    </div>

    <div class="grid-stats">
        <div class="score-section">
            <div class="overall-score">
                <p class="overall-score-num">{{ risk.overall_health_score | default(74) }}</p>
                <p class="overall-score-label">Community Health Score</p>
            </div>
            <div class="sub-scores">
                {% if risk is defined and risk.category_scores is defined and risk.category_scores %}
                    {% for cat, val in risk.category_scores.items() %}
                    <div class="score-bar-container">
                        <div class="score-bar-label">
                            <span>{{ cat }}</span>
                            <span>{{ val }}/100</span>
                        </div>
                        <div class="score-bar-bg">
                            <div class="score-bar-fill" style="width: {{ val }}%; background-color: {% if cat == 'Safety' %}#FF4B4B{% elif cat == 'Environment' %}#00CC96{% elif cat == 'Infrastructure' %}#33CFFF{% else %}#AB63FA{% endif %};"></div>
                        </div>
                    </div>
                    {% endfor %}
                {% else %}
                    <div class="score-bar-container">
                        <div class="score-bar-label"><span>Safety</span><span>82/100</span></div>
                        <div class="score-bar-bg"><div class="score-bar-fill" style="width: 82%; background-color: #FF4B4B;"></div></div>
                    </div>
                    <div class="score-bar-container">
                        <div class="score-bar-label"><span>Environment</span><span>68/100</span></div>
                        <div class="score-bar-bg"><div class="score-bar-fill" style="width: 68%; background-color: #00CC96;"></div></div>
                    </div>
                    <div class="score-bar-container">
                        <div class="score-bar-label"><span>Infrastructure</span><span>71/100</span></div>
                        <div class="score-bar-bg"><div class="score-bar-fill" style="width: 71%; background-color: #33CFFF;"></div></div>
                    </div>
                    <div class="score-bar-container">
                        <div class="score-bar-label"><span>Public Services</span><span>75/100</span></div>
                        <div class="score-bar-bg"><div class="score-bar-fill" style="width: 75%; background-color: #AB63FA;"></div></div>
                    </div>
                {% endif %}
            </div>
        </div>
        
        <div class="accel-section">
            <div class="accel-num">60x</div>
            <div class="accel-title">Decision Acceleration Factor</div>
            <div class="accel-text">AI Processing: 3 min vs. Est. Manual Review: 180 min</div>
        </div>
    </div>

    <div class="section-title">Executive Summary</div>
    <p>{{ analyst.overall_summary | default("No executive summary available.") }}</p>

    {% if risk is defined and risk.zone_risk_levels is defined and risk.zone_risk_levels %}
    <div class="section-title">Zone Risk Rankings (Risk Intelligence Agent)</div>
    <table>
        <thead>
            <tr>
                <th>Rank</th>
                <th>Zone</th>
                <th>Risk Level</th>
                <th>Health Score</th>
                <th>Primary Drivers</th>
            </tr>
        </thead>
        <tbody>
            {% for z_risk in risk.zone_risk_levels | sort(attribute='health_score') %}
            <tr>
                <td>{{ loop.index }}</td>
                <td><strong>{{ z_risk.zone }}</strong></td>
                <td><span class="badge {% if z_risk.risk_level == 'High' or z_risk.risk_level == 'Critical' %}badge-high{% elif z_risk.risk_level == 'Medium' %}badge-med{% else %}badge-low{% endif %}">{{ z_risk.risk_level }}</span></td>
                <td>{{ z_risk.health_score }}/100</td>
                <td>{{ (z_risk.primary_drivers | join(', ')) if z_risk.primary_drivers is defined else 'N/A' }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
    {% endif %}

    <div class="section-title">Emerging Trends (Insight Agent)</div>
    <div class="trend-grid">
        {% if analyst is defined and analyst.volume_trends is defined and analyst.volume_trends %}
            {% for trend in analyst.volume_trends %}
            <div class="card trend-card">
                <h4>
                    <span>{{ trend.metric }}</span>
                    <span class="badge {% if trend.direction == 'Rising' %}badge-rising{% elif trend.direction == 'Falling' %}badge-falling{% else %}badge-stable{% endif %}">
                        {{ trend.direction }}
                    </span>
                </h4>
                <p style="margin: 0; font-size: 13px; color: #5F6368;">{{ trend.description }}</p>
            </div>
            {% endfor %}
        {% else %}
            <p>No trends detected.</p>
        {% endif %}
    </div>

    {% if analyst is defined and analyst.spikes_detected is defined and analyst.spikes_detected %}
    <div class="section-title">Detected Reporting Spikes</div>
    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th>Issue Type</th>
                <th>Target Area / Zone</th>
                <th>Severity</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {% for spike in analyst.spikes_detected %}
            <tr>
                <td><strong>{{ spike.category }}</strong></td>
                <td>{{ spike.issue_type }}</td>
                <td>{{ spike.zone }}</td>
                <td><span class="badge badge-high">{{ spike.severity }}</span></td>
                <td>{{ spike.description }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
    {% endif %}

    {% if risk is defined and risk.critical_alerts is defined and risk.critical_alerts %}
    <div class="section-title">Top 3 Critical Risks (Risk Intelligence Agent)</div>
    <table>
        <thead>
            <tr>
                <th>Alert Title</th>
                <th>Target Area / Zone</th>
                <th>Severity</th>
                <th>Risk Justification</th>
            </tr>
        </thead>
        <tbody>
            {% for alert in risk.critical_alerts[:3] %}
            <tr>
                <td><strong style="color: #D93025;">{{ alert.title }}</strong></td>
                <td>{{ alert.zone }}</td>
                <td><span class="badge badge-high">{{ alert.severity }}</span></td>
                <td>{{ alert.explanation }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
    {% endif %}

    <div class="section-title">Decision Acceleration Engine™: Priority Actions (Top 3 Actions)</div>
    
    {% if recommendations is defined and recommendations.recommendations is defined and recommendations.recommendations %}
    <div class="card" style="padding: 15px; border-left: 5px solid #1A73E8; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #1A73E8;">Impact Forecast Summary</h4>
        <div style="display: flex; gap: 40px; font-size: 14px;">
            {% set ns = namespace(total=0) %}
            {% for r in recommendations.recommendations %}
                {% set ns.total = ns.total + (r.citizens_impacted | default(0) | int) %}
            {% endfor %}
            <div>👥 <strong>Total Citizens Benefited:</strong> {{ ns.total }} residents</div>
            
            {% set ns2 = namespace(sum=0, count=0) %}
            {% for r in recommendations.recommendations %}
                {% set ns2.sum = ns2.sum + (r.complaints_reduction | default(0) | int) %}
                {% set ns2.count = ns2.count + 1 %}
            {% endfor %}
            <div>📉 <strong>Avg. Category Complaint Drop:</strong> {{ (ns2.sum / ns2.count) | round | int if ns2.count > 0 else 0 }}%</div>
        </div>
    </div>
    {% endif %}

    <div class="card" style="padding: 20px;">
        {% if recommendations is defined and recommendations.recommendations is defined and recommendations.recommendations %}
            {% for rec in recommendations.recommendations[:3] %}
            <div class="rec-item">
                <div class="rec-header">
                    <h3 class="rec-title">{{ rec.id }}: {{ rec.title }}</h3>
                    <span class="badge {% if rec.priority == 'High' %}badge-high{% elif rec.priority == 'Medium' %}badge-med{% else %}badge-low{% endif %}">
                        {{ rec.priority }} Priority
                    </span>
                </div>
                <div class="rec-meta">
                    <strong>Category:</strong> {{ rec.category }} | <strong>Zone:</strong> {{ rec.zone }}
                </div>
                
                <div class="rec-metric-row" style="flex-wrap: wrap;">
                    <div class="rec-metric-item">👥 <strong>Citizens Benefiting:</strong> {{ rec.citizens_impacted }}</div>
                    <div class="rec-metric-item">📉 <strong>Complaints Reduction:</strong> {{ rec.complaints_reduction }}%</div>
                    <div class="rec-metric-item">🎯 <strong>Decision Confidence:</strong> {{ rec.decision_confidence }}%</div>
                    <div class="rec-metric-item">🛡️ <strong>Safety Benefit:</strong> {{ rec.safety_improvement }}</div>
                </div>
                
                <ol class="rec-steps">
                    {% if rec.steps is defined %}
                        {% for step in rec.steps %}
                        <li>{{ step }}</li>
                        {% endfor %}
                    {% endif %}
                </ol>
                <div class="rec-footer">
                    <strong>Resource Estimate:</strong> {{ rec.estimated_resources }}<br>
                    <strong>Expected Impact:</strong> {{ rec.expected_impact }}
                </div>
            </div>
            {% endfor %}
        {% else %}
            <p>No action recommendations available.</p>
        {% endif %}
    </div>

    <div class="section-title">Forecast Summary & Decision Confidence Metrics</div>
    <div class="card" style="padding: 20px; background: #FAFBFD; border-left: 5px solid #1A73E8; margin-bottom: 25px;">
        {% if sim is defined and sim and sim.affected_category is defined %}
            <h4 style="margin: 0 0 10px 0; color: #1A73E8;">Simulated Intervention: "{{ sim_action | default('Prospective Operation') }}"</h4>
            <table style="width: 100%; border: none; margin-bottom: 10px; border-collapse: collapse;">
                <tr style="border: none; background: transparent;">
                    <td style="border: none; padding: 5px 10px; width: 33%;"><strong>Category Affected:</strong> {{ sim.affected_category }}</td>
                    <td style="border: none; padding: 5px 10px; width: 33%;"><strong>Score Projection:</strong> {{ sim.original_score }} &rarr; {{ sim.simulated_score }}</td>
                    <td style="border: none; padding: 5px 10px; width: 33%;"><strong>Forecast Confidence:</strong> <span style="color: #137333; font-weight: bold;">{{ sim.simulation_confidence }}%</span></td>
                </tr>
            </table>
            <ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 14px;">
                <li><strong>Current State:</strong> {{ sim.current_state }}</li>
                <li><strong>Predicted State:</strong> {{ sim.predicted_state }}</li>
                <li><strong>Expected Benefit:</strong> {{ sim.expected_benefit }}</li>
                <li><strong>Risk Reduction:</strong> {{ sim.risk_reduction }}</li>
                <li><strong>Resource Impact:</strong> {{ sim.resource_impact }}</li>
            </ul>
        {% elif recommendations is defined and recommendations.recommendations is defined and recommendations.recommendations %}
            {% set top_rec = recommendations.recommendations[0] %}
            <h4 style="margin: 0 0 10px 0; color: #1A73E8;">Projected Intervention: "{{ top_rec.title }}" (Top Priority Action)</h4>
            <table style="width: 100%; border: none; margin-bottom: 10px; border-collapse: collapse;">
                <tr style="border: none; background: transparent;">
                    <td style="border: none; padding: 5px 10px; width: 33%;"><strong>Category Affected:</strong> {{ top_rec.category }}</td>
                    <td style="border: none; padding: 5px 10px; width: 33%;"><strong>Target Zone:</strong> {{ top_rec.zone }}</td>
                    <td style="border: none; padding: 5px 10px; width: 33%;"><strong>Decision Confidence:</strong> <span style="color: #137333; font-weight: bold;">{{ top_rec.decision_confidence }}%</span></td>
                </tr>
            </table>
            <ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 14px;">
                <li><strong>Expected Benefit:</strong> {{ top_rec.expected_impact }}</li>
                <li><strong>Citizens Benefiting:</strong> {{ top_rec.citizens_impacted }} residents</li>
                <li><strong>Projected Complaint Drop:</strong> {{ top_rec.complaints_reduction }}%</li>
                <li><strong>Safety Benefit:</strong> {{ top_rec.safety_improvement }}</li>
                <li><strong>Estimated Resources:</strong> {{ top_rec.estimated_resources }}</li>
            </ul>
        {% else %}
            <p>No active simulation or recommendation metrics are available for forecasting.</p>
        {% endif %}
    </div>

    <div class="section-title" style="margin-top: 50px;">Verification & Sign-off</div>
    <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px;">
        <div>
            <p>_____________________________________</p>
            <p><strong>Chief Operations Officer</strong></p>
            <p>Municipal Operations Board</p>
        </div>
        <div>
            <p>_____________________________________</p>
            <p><strong>Lead Data Scientist / AI Coordinator</strong></p>
            <p>CivicMind AI Platform Agent Layer</p>
        </div>
    </div>

</body>
</html>
"""

def generate_report(analyst_insights: dict, risk_insights: dict, rec_insights: dict, sim_insights: dict = None, sim_action: str = "") -> str:
    """
    Renders the raw HTML report containing agent outputs.
    """
    now = datetime.datetime.now()
    date_str = now.strftime("%Y%m%d-%H%M")
    date_full = now.strftime("%B %d, %Y at %H:%M %p")
    
    t = Template(HTML_TEMPLATE)
    return t.render(
        date_str=date_str,
        date_full=date_full,
        analyst=analyst_insights,
        risk=risk_insights,
        recommendations=rec_insights,
        sim=sim_insights,
        sim_action=sim_action
    )
