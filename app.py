from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# LOAD MODEL
# -----------------------------
MODEL_PATH = "xgb_accident_severity_model.pkl"
model = joblib.load(MODEL_PATH)

# -----------------------------
# HISTORY FILE
# -----------------------------
HISTORY_FILE = "history.json"
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)

def save_history(entry):
    with open(HISTORY_FILE, "r") as f:
        data = json.load(f)

    data.append(entry)

    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=4)

# -----------------------------
# PREPROCESSOR (MATCH NOTEBOOK)
# -----------------------------
def preprocess_input(data):
    df = pd.DataFrame([data])

    # ----------------------
    # 1) BINARY MAPS
    # ----------------------
    bin_map = {"Yes": 1, "No": 0}
    df["road_signs_present"] = df["road_signs_present"].map(bin_map)
    df["public_road"] = df["public_road"].map(bin_map)
    df["holiday"] = df["holiday"].map(bin_map)
    df["school_season"] = df["school_season"].map(bin_map)

    # ----------------------
    # 2) NUMERIC FIELDS
    # ----------------------
    df["num_lanes"] = pd.to_numeric(df["num_lanes"], errors="coerce")
    df["curvature"] = pd.to_numeric(df["curvature"], errors="coerce")
    df["speed_limit"] = pd.to_numeric(df["speed_limit"], errors="coerce")
    df["num_reported_accidents"] = pd.to_numeric(df["num_reported_accidents"], errors="coerce")

    # ----------------------
    # 3) TIME OF DAY → SIN/COS
    # ----------------------
    df["time_of_day"] = df["time_of_day"].astype(str).str.lower()

    time_order = ["morning", "afternoon", "evening"]
    time_map = {t: i for i, t in enumerate(time_order)}
    df["time_num"] = df["time_of_day"].map(time_map).fillna(0)

    N = len(time_order)
    df["time_sin"] = np.sin(2 * np.pi * df["time_num"] / N)
    df["time_cos"] = np.cos(2 * np.pi * df["time_num"] / N)

    # ----------------------
    # 4) ONE-HOT ENCODING EXACTLY LIKE NOTEBOOK
    # ----------------------
    # Road type
    df["rt_highway"] = (df["road_type"] == "highway").astype(int)
    df["rt_rural"]   = (df["road_type"] == "rural").astype(int)
    df["rt_urban"]   = (df["road_type"] == "urban").astype(int)

    # Lighting
    df["lt_daylight"] = (df["lighting"] == "daylight").astype(int)
    df["lt_dim"]      = (df["lighting"] == "dim").astype(int)
    df["lt_night"]    = (df["lighting"] == "night").astype(int)

    # Weather
    df["wtr_clear"]  = (df["weather"] == "clear").astype(int)
    df["wtr_foggy"]  = (df["weather"] == "foggy").astype(int)
    df["wtr_rainy"]  = (df["weather"] == "rainy").astype(int)

    # ----------------------
    # 5) Final column order (CRITICAL)
    # ----------------------
    FINAL_COLS = [
        'num_lanes','curvature','speed_limit','road_signs_present',
        'public_road','holiday','school_season','num_reported_accidents',
        'rt_highway','rt_rural','rt_urban',
        'lt_daylight','lt_dim','lt_night',
        'wtr_clear','wtr_foggy','wtr_rainy',
        'time_sin','time_cos'
    ]

    df = df[FINAL_COLS]

    return df


# -----------------------------
# ROUTES
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return "Backend working..."

@app.route("/api/login", methods=["POST"])
def login():
    return jsonify({"status": "success", "message": "Login successful"})

@app.route("/api/register", methods=["POST"])
def register():
    return jsonify({"status": "success", "message": "Registration successful"})


# -----------------------------
# PREDICT
# -----------------------------
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("🔥 Incoming raw input:", data)

        # Preprocess like notebook
        processed_df = preprocess_input(data)
        print("🧠 Processed features shape:", processed_df.shape)

        pred = model.predict(processed_df)[0]
        pred_value = round(float(pred), 4)*100


        # Save to history
        save_history({
            "input": data,
            "processed": processed_df.to_dict(),
            "prediction": pred_value,
            "timestamp": __import__("datetime").datetime.now().isoformat()
        })

        return jsonify({"severity_prediction": pred_value})

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


@app.route("/api/history", methods=["GET"])
def history():
    with open(HISTORY_FILE, "r") as f:
        data = json.load(f)
    return jsonify(data)


# -----------------------------
# START SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
