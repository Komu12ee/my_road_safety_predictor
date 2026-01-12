# Road Accident Severity Predictor

A machine learning-powered web application that predicts the severity of road accidents based on environmental and road conditions. This project uses a **Flask (Python)** backend with an XGBoost model and a **React (Vite)** frontend.

## 🚀 Features
-   **Severity Prediction**: Predict accident severity (0-100%) based on inputs like weather, lighting, and road type.
-   **Interactive Dashboard**: User-friendly form and visualization of results.
-   **History Tracking**: Saves past predictions for review.
-   **User System**: Simple login and registration.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
1.  **Python** (v3.8 or higher)
2.  **Node.js** (v16 or higher) & **npm**

---

## ⚙️ Installation & Setup

### 1. Clone or Download the Project
Navigate to the project directory in your terminal:
```bash
cd road-safety-predictor-main
```

### 2. Backend Setup (Flask)
The backend runs on Python and serves the machine learning model.

1.  **Open a terminal** and navigate to the project root.
2.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Start the Backend Server**:
    ```bash
    python app.py
    ```
    *   The server will start at `http://localhost:5000`.
    *   **Keep this terminal open.**

### 3. Frontend Setup (React + Vite)
The frontend is built with React and communicates with the backend.

1.  **Open a NEW terminal** (do not close the backend terminal).
2.  **Install Node dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Frontend Server**:
    ```bash
    npm run dev
    ```
4.  **Access the Application**:
    *   The terminal will show a local URL, typically:
    *   [http://localhost:8080/my_road_safety_predictor/](http://localhost:8080/my_road_safety_predictor/)

---

## ⚠️ Troubleshooting / Common Issues

### 1. "Internal Server Error" or App Crash on Predict
**Issue:** The backend console crashes when you click "Predict".
**Cause:** This often happens on Windows if the terminal cannot handle specific emoji characters used in the logs.
**Fix:**
*   We have already removed emojis from the code.
*   **Important:** If you see this, ensure you have **restarted the python server** completely (use `Ctrl+C` to stop, then `python app.py` to start again).

### 2. "Network Error" or "Failed to Fetch"
**Issue:** The frontend cannot talk to the backend.
**Fix:**
*   Ensure the backend is running (`python app.py`).
*   Ensure it is running on port **5000**.
*   Check that the frontend code points to `http://localhost:5000` (this has been configured in the latest version).

### 3. "404 Not Found" on Page Load
**Issue:** You see a blank page or 404 error when opening the link.
**Fix:**
*   Ensure you are visiting the full URL including the sub-path: `http://localhost:8080/my_road_safety_predictor/`
*   Do not just go to `localhost:8080/`.

---

## 📂 Project Structure
-   **`app.py`**: Main backend entry point.
-   **`src/`**: Frontend source code (React).
-   **`xgb_accident_severity_model.pkl`**: The trained ML model.
-   **`users.json` / `history.json`**: Local data storage.
