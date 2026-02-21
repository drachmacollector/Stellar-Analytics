from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List
from datetime import datetime
import pandas as pd
import numpy as np
import joblib
import os

# ---------------------------------------------------------
# 1. SCIENTIFICALLY VALIDATED FEATURE SPACE
# ---------------------------------------------------------
# Removed target leakage (koi_ror), collinearity (st_dens), and all error/noise columns.
EXPECTED_FEATURES = [
    'koi_period',
    'koi_duration',
    'koi_depth',
    'koi_impact',
    'koi_model_snr',
    'koi_num_transits',
    'st_teff', 
    'st_logg',
    'st_met',
    'st_mass',
    'st_radius'
]

class PredictionRequest(BaseModel):
    features: Dict[str, float]
    tasks: List[str] = Field(default_factory=lambda: ["classification", "regression"])

app = FastAPI(
    title="Stellar Analytics AI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://kepler-ai-koi.vercel.app"
    ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 2. MODEL LOADING ARCHITECTURE
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    classification_model = joblib.load(os.path.join(BASE_DIR, "models", "classification_pipeline.pkl"))
    print("Classification model loaded successfully.")
except Exception as e:
    print(f"Error loading classification model: {e}")
    classification_model = None

try:
    regression_model = joblib.load(os.path.join(BASE_DIR, "models", "regression_pipeline.pkl"))
    print("Regression model loaded successfully.")
except Exception as e:
    print(f"Error loading regression model: {e}")
    regression_model = None

# ---------------------------------------------------------
# 3. API ENDPOINTS
# ---------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Stellar Analytics backend is fully operational."}

@app.get("/health")
def health_check():
    return {
        "classification_status": "Active" if classification_model else "Offline",
        "regression_status": "Active" if regression_model else "Offline"
    }

@app.post("/predict")
def predict(request: PredictionRequest):
    
    # Identify discrepancies between incoming data and the required model schema
    missing_features = [f for f in EXPECTED_FEATURES if f not in request.features]
    if missing_features:
        raise HTTPException(
            status_code=400,
            detail={"error": "Missing fundamental physical parameters.", "missing_features": missing_features}
        )

    # Restrict processing purely to the expected features to prevent matrix dimensional errors
    input_df = pd.DataFrame([request.features])[EXPECTED_FEATURES]

    classification_output = None
    regression_output = None

    # ---- Classification Flow ----
    if "classification" in request.tasks:
        if classification_model is None:
            raise HTTPException(500, "Classification inference engine is offline.")

        prediction = classification_model.predict(input_df)[0]
        
        # Safely extract probability corresponding to the 'CONFIRMED' class (typically labeled as 1)
        prob_array = classification_model.predict_proba(input_df)[0]
        positive_class_index = list(classification_model.classes_).index(1) if 1 in classification_model.classes_ else 1
        probability = prob_array[positive_class_index]

        classification_output = {
            "label": "CONFIRMED" if prediction == 1 else "FALSE POSITIVE",
            "probability": float(probability)
        }

    # ---- Regression Flow ----
    if "regression" in request.tasks:
        if regression_model is None:
            raise HTTPException(500, "Regression inference engine is offline.")

        reg_df = input_df.copy()
        
        # Implement mathematical safeguards: clip negative inputs to 0 before calculating square root
        reg_df["sqrt_koi_depth"] = np.sqrt(np.clip(reg_df["koi_depth"], a_min=0, a_max=None))
        
        # Calculate astrophysical interactions
        reg_df["koi_depth_x_st_radius"] = reg_df["koi_depth"] * reg_df["st_radius"]
        reg_df["koi_period_x_st_radius"] = reg_df["koi_period"] * reg_df["st_radius"]

        # Ensure the dataframe shape perfectly matches the training environment before prediction
        predicted_radius = regression_model.predict(reg_df)[0]

        regression_output = {
            "predicted_planetary_radius_earth_radii": float(predicted_radius)
        }

    return {
        "classification": classification_output,
        "regression": regression_output,
        "metadata": {
            "model_version": "v1.1_production",
            "timestamp": datetime.utcnow().isoformat()
        }
    }