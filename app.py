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
# USER FILE FOR LOGIN / REGISTER
# -----------------------------
USERS_FILE = "users.json"
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

def load_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)


# -----------------------------
# PREPROCESSOR
# -----------------------------
def preprocess_input(data):
    df = pd.DataFrame([data])

    bin_map = {"Yes": 1, "No": 0}
    df["road_signs_present"] = df["road_signs_present"].map(bin_map)
    df["public_road"] = df["public_road"].map(bin_map)
    df["holiday"] = df["holiday"].map(bin_map)
    df["school_season"] = df["school_season"].map(bin_map)

    df["num_lanes"] = pd.to_numeric(df["num_lanes"], errors="coerce")
    df["curvature"] = pd.to_numeric(df["curvature"], errors="coerce")
    df["speed_limit"] = pd.to_numeric(df["speed_limit"], errors="coerce")
    df["num_reported_accidents"] = pd.to_numeric(df["num_reported_accidents"], errors="coerce")

    df["time_of_day"] = df["time_of_day"].astype(str).str.lower()

    time_order = ["morning", "afternoon", "evening"]
    time_map = {t: i for i, t in enumerate(time_order)}
    df["time_num"] = df["time_of_day"].map(time_map).fillna(0)

    N = len(time_order)
    df["time_sin"] = np.sin(2 * np.pi * df["time_num"] / N)
    df["time_cos"] = np.cos(2 * np.pi * df["time_num"] / N)

    df["rt_highway"] = (df["road_type"] == "highway").astype(int)
    df["rt_rural"] = (df["road_type"] == "rural").astype(int)
    df["rt_urban"] = (df["road_type"] == "urban").astype(int)

    df["lt_daylight"] = (df["lighting"] == "daylight").astype(int)
    df["lt_dim"] = (df["lighting"] == "dim").astype(int)
    df["lt_night"] = (df["lighting"] == "night").astype(int)

    df["wtr_clear"] = (df["weather"] == "clear").astype(int)
    df["wtr_foggy"] = (df["weather"] == "foggy").astype(int)
    df["wtr_rainy"] = (df["weather"] == "rainy").astype(int)

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


# -----------------------------
# REGISTER
# -----------------------------
# -----------------------------
# REGISTER
# -----------------------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")              # 👈 ADD THIS
    email = data.get("email")
    password = data.get("password")

    users = load_users()

    # Check duplicate email
    for u in users:
        if u["email"] == email:
            return jsonify({"status": "error", "message": "Email already exists"}), 400

    # SAVE FULL USER DETAILS
    users.append({
        "name": name,                     # 👈 ADD THIS
        "email": email,
        "password": password
    })

    save_users(users)

    return jsonify({"status": "success", "message": "Registration successful"})



# -----------------------------
# LOGIN
# -----------------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    users = load_users()

    for u in users:
        if u["email"] == email and u["password"] == password:
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "user": {"email": email}
            })

    return jsonify({"status": "error", "message": "Invalid email or password"}), 401


# -----------------------------
# PREDICT
# -----------------------------
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("🔥 Incoming raw input:", data)

        processed_df = preprocess_input(data)
        print("🧠 Processed features shape:", processed_df.shape)

        processed_sanitized = processed_df.replace(
            {np.nan: None, np.inf: None, -np.inf: None}
        ).to_dict()

        pred = model.predict(processed_df)[0]
        pred_value = round(float(pred), 4) * 100

        save_history({
            "input": data,
            "processed": processed_sanitized,
            "prediction": pred_value,
            "timestamp": __import__("datetime").datetime.now().isoformat()
        })

        return jsonify({"severity_prediction": pred_value})

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# -----------------------------
# HISTORY
# -----------------------------
@app.route("/api/history", methods=["GET"])
def history():
    with open(HISTORY_FILE, "r") as f:
        data = json.load(f)
    return jsonify(data)


# -----------------------------
# START SERVER
# -----------------------------
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
