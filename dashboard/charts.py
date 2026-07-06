import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Design Color Palette
COLOR_THEME = {
    "Safety": "#FF4B4B",       # Red-coral
    "Environment": "#00CC96",  # Teal-green
    "Infrastructure": "#33CFFF", # Bright blue
    "Public Services": "#AB63FA" # Violet/Purple
}

# General palettes
SEQUENTIAL_NEON = ["#33CFFF", "#00CC96", "#AB63FA", "#FF6B6B", "#FFA15A"]

def get_chart_layout(title: str):
    """Returns a unified layout dict for transparent, dark-mode friendly charts."""
    return dict(
        title=dict(
            text=title,
            font=dict(color="#E0E0E0", size=16, family="Outfit, Inter, sans-serif"),
            x=0.05
        ),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#A0A0A0", family="Inter, sans-serif"),
        margin=dict(l=40, r=20, t=50, b=40),
        xaxis=dict(
            gridcolor="#2D2D2D",
            linecolor="#3D3D3D",
            tickfont=dict(color="#A0A0A0"),
            title=dict(font=dict(color="#A0A0A0"))
        ),
        yaxis=dict(
            gridcolor="#2D2D2D",
            linecolor="#3D3D3D",
            tickfont=dict(color="#A0A0A0"),
            title=dict(font=dict(color="#A0A0A0"))
        ),
        legend=dict(
            font=dict(color="#A0A0A0"),
            bgcolor="rgba(0,0,0,0)"
        )
    )

def plot_category_distribution(df: pd.DataFrame):
    """Generates a donut chart for ticket categories."""
    counts = df["category"].value_counts().reset_index()
    counts.columns = ["Category", "Volume"]
    
    # Map colors to categories
    colors = [COLOR_THEME.get(cat, "#888888") for cat in counts["Category"]]
    
    fig = px.pie(
        counts, 
        values="Volume", 
        names="Category", 
        hole=0.5,
        color_discrete_sequence=colors
    )
    
    fig.update_traces(
        textposition="inside", 
        textinfo="percent+label",
        hoverinfo="label+value",
        marker=dict(line=dict(color="#1E1E24", width=2))
    )
    
    fig.update_layout(**get_chart_layout("Issues by Department / Category"))
    return fig

def plot_volume_trend(df: pd.DataFrame):
    """Generates an area/line chart showing tickets over time."""
    # Convert timestamp to date
    df_copy = df.copy()
    df_copy["date"] = pd.to_datetime(df_copy["timestamp"]).dt.date
    trend = df_copy.groupby(["date", "category"]).size().reset_index(name="Count")
    
    fig = px.area(
        trend, 
        x="date", 
        y="Count", 
        color="category",
        color_discrete_map=COLOR_THEME,
        line_shape="spline"
    )
    
    fig.update_layout(**get_chart_layout("Daily Ticket Reporting Trends"))
    fig.update_xaxes(title="Date")
    fig.update_yaxes(title="Report Volume")
    return fig

def plot_zone_distribution(df: pd.DataFrame):
    """Generates a grouped bar chart of categories per zone."""
    zone_data = df.groupby(["zone", "category"]).size().reset_index(name="Volume")
    
    fig = px.bar(
        zone_data,
        x="zone",
        y="Volume",
        color="category",
        barmode="group",
        color_discrete_map=COLOR_THEME
    )
    
    fig.update_layout(**get_chart_layout("Issue Density by Neighborhood Zone"))
    fig.update_xaxes(title="Neighborhood Zone")
    fig.update_yaxes(title="Total Complaints")
    return fig

def plot_priority_distribution(df: pd.DataFrame):
    """Generates a bar chart showing status breakdown within priority levels."""
    prio_status = df.groupby(["priority", "status"]).size().reset_index(name="Count")
    
    # Custom colors for status
    status_colors = {
        "Open": "#FF4B4B",
        "In Progress": "#FFA15A",
        "Resolved": "#00CC96"
    }
    
    fig = px.bar(
        prio_status,
        x="priority",
        y="Count",
        color="status",
        color_discrete_map=status_colors,
        category_orders={"priority": ["High", "Medium", "Low"]}
    )
    
    fig.update_layout(**get_chart_layout("Resolution Status by Priority"))
    fig.update_xaxes(title="Priority Level")
    fig.update_yaxes(title="Complaints Count")
    return fig
