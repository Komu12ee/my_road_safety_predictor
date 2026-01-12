# 🚦 Road Safety Predictor

## 1. Project Overview

The **Road Safety Predictor** is a full-stack web application designed to predict **accident severity** based on road, traffic, and environmental conditions.  
It combines a **modern React frontend** with a **machine-learning–powered Flask backend** using an **XGBoost model**.

The system allows users to:
- Enter accident-related parameters
- Receive a severity risk score (0–100%)
- Maintain prediction history
- Register and log in using basic authentication

---

## 2. Technology Stack

### 🔙 Backend
- **Language:** Python  
- **Framework:** Flask, Flask-CORS  
- **Machine Learning:** XGBoost (`xgb_accident_severity_model.pkl`), scikit-learn, joblib  
- **Data Processing:** Pandas, NumPy  
- **Storage:** Local JSON files (`history.json`, `users.json`)  
- **Database:** None (file-based persistence)

### 🎨 Frontend
- **Framework:** React (Vite)
- **Language:** TypeScript
- **UI Library:** shadcn-ui (Radix UI based)
- **Styling:** Tailwind CSS, Tailwind Merge, Class Variance Authority
- **State & Data Fetching:** React Query (`@tanstack/react-query`)
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Form Validation:** Zod + React Hook Form

---

## 3. Architecture & Project Structure

### 📁 Backend Structure (`/`)
