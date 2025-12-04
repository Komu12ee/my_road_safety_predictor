# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY app.py requirements.txt xgb_accident_severity_model.pkl /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variable for Azure Web App port
ENV PORT 8000

# Run uvicorn as production server
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "app:app"]





# FROM python:3.10-slim

# WORKDIR /app

# # Install system dependencies
# RUN apt-get update && apt-get install -y build-essential curl && rm -rf /var/lib/apt/lists/*

# # Copy requirements
# COPY requirements.txt .

# # Install python packages
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt

# # Copy the rest of the backend
# COPY . .

# # Expose port (Azure uses dynamic port later)
# ENV PORT=8000
# EXPOSE 8000

# # Health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
#   CMD curl -f http://localhost:${PORT}/health || exit 1

# # Run using Gunicorn
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
