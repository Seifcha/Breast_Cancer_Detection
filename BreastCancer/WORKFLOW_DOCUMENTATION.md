# Breast Cancer Detection System - Workflow Documentation

## Overview
This system integrates a React frontend with a Flask ML backend to provide breast cancer diagnosis predictions using machine learning models.

## System Architecture

### Frontend (React + TypeScript)
- **Home.tsx**: Patient report creation form
- **Results.tsx**: Display prediction results and detailed analysis

### Backend (Flask + Python)
- **app.py**: Flask API with ML model endpoints
- **Models Used**:
  - Softmax Regression (PyTorch) - DSO2
  - MLP Classifier (scikit-learn) - DSO3

## Complete Workflow

### 1. User Creates Patient Report (Home.tsx)

When the user fills out the form and clicks "Create Patient Report":

1. **Form Fields**:
   - Patient Name
   - Patient ID
   - Report Description (clinical notes)
   - Mammogram Image/PDF

2. **Form Submission Process**:
   ```
   User clicks "Create Patient Report" button
   ↓
   Form validation
   ↓
   Save patient to context (if new)
   ↓
   Call Flask API: /save_report
   ↓
   Load extracted_features.json
   ↓
   Call Flask API: /predict2
   ↓
   Navigate to Results page
   ```

### 2. Save Report Description (Flask: /save_report)

**Endpoint**: `POST http://localhost:5000/save_report`

**Request Body**:
```json
{
  "report_description": "Clinical notes and observations..."
}
```

**Action**: Writes the report description to `input_report.txt` in the ML directory.

**Response**:
```json
{
  "status": "success",
  "message": "Report saved successfully",
  "file_path": "f:/MLproject/BreastCancer/src/ML/input_report.txt"
}
```

### 3. Load Feature Data (extracted_features.json)

The frontend loads the feature data from `extracted_features.json`:

```json
{
  "mean radius": 18.5,
  "mean texture": null,
  "mean perimeter": null,
  "mean area": null,
  ...
  "worst area": 2000.0,
  ...
}
```

**Note**: Null values are automatically replaced with 0 by the Flask API.

### 4. Get ML Prediction (Flask: /predict2)

**Endpoint**: `POST http://localhost:5000/predict2`

**Request Body**: The entire `extracted_features.json` content (30 features)

**ML Process**:
1. Replace null values with 0
2. Create numpy array from features
3. Apply StandardScaler normalization (scaler_dso2)
4. Convert to PyTorch tensor
5. Run through Softmax Regression model
6. Calculate probabilities using softmax
7. Determine predicted class (0=Benign, 1=Malignant)

**Response**:
```json
{
  "prediction": 0,  // 0 = Benign, 1 = Malignant
  "probability_class0": 0.8234,  // Probability of Benign
  "probability_class1": 0.1766   // Probability of Malignant
}
```

### 5. Display Results (Results.tsx)

The Results page displays:

1. **Main Diagnosis Card**:
   - Prediction: BÉNIN or MALIN
   - Confidence Score (%)
   - Recommendation based on diagnosis

2. **Patient Information**:
   - Patient Name
   - Patient ID
   - Date of analysis

3. **Image Preview**:
   - Uploaded mammogram or PDF indicator

4. **Clinical Notes**:
   - Report description from the form

5. **Detailed AI Analysis** (if API response available):
   - Predicted Class (0 or 1)
   - Probability Benign (%)
   - Probability Malignant (%)
   - ML Model information

## File Structure

```
f:/MLproject/BreastCancer/
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Patient report form
│   │   └── Results.tsx           # Prediction results display
│   └── ML/
│       ├── app.py                # Flask API server
│       ├── extracted_features.json  # Input features for prediction
│       ├── input_report.txt      # Saved report descriptions
│       ├── scaler_dso2.joblib    # Feature scaler for DSO2
│       ├── softmax_regression_dso2.pth  # PyTorch model
│       ├── scaler_dso3.joblib    # Feature scaler for DSO3
│       └── mlp_perfect_dso3_model.joblib  # MLP model
```

## API Endpoints

### 1. POST /save_report
Saves the report description to input_report.txt

### 2. POST /predict2
Uses Softmax Regression (PyTorch) model with DSO2 scaler
- Input: 30 breast cancer features
- Output: Prediction class and probabilities

### 3. POST /predict3
Uses MLP Classifier (scikit-learn) with DSO3 scaler
- Input: 30 breast cancer features
- Output: Risk stratification and recommendations

## Running the System

### 1. Start Flask Backend
```bash
cd f:/MLproject/BreastCancer/src/ML
python app.py
```
Server runs on: `http://localhost:5000`

### 2. Start React Frontend
```bash
cd f:/MLproject/BreastCancer
npm run dev
```
Frontend runs on: `http://localhost:5173` (or similar)

### 3. Usage Flow
1. Open the React app in browser
2. Navigate to Home page
3. Fill in patient information
4. Enter clinical notes in "Description du Rapport"
5. Upload mammogram image/PDF
6. Click "Create Patient Report"
7. View results on Results page

## Features

### Input Features (30 total)
The ML models expect 30 features from breast cancer cell nuclei measurements:

**Mean Features (10)**:
- mean radius, mean texture, mean perimeter, mean area
- mean smoothness, mean compactness, mean concavity
- mean concave points, mean symmetry, mean fractal dimension

**Error Features (10)**:
- radius error, texture error, perimeter error, area error
- smoothness error, compactness error, concavity error
- concave points error, symmetry error, fractal dimension error

**Worst Features (10)**:
- worst radius, worst texture, worst perimeter, worst area
- worst smoothness, worst compactness, worst concavity
- worst concave points, worst symmetry, worst fractal dimension

## Error Handling

1. **Missing Features**: Null values are replaced with 0
2. **API Failures**: Frontend falls back to random prediction
3. **CORS Issues**: Flask-CORS enabled for all routes
4. **Invalid Data**: API returns 400 error with message

## Security Notes

- CORS is enabled for all origins (development only)
- No authentication implemented (add for production)
- File writes are limited to input_report.txt
- Input validation should be enhanced for production

## Future Enhancements

1. Add image processing to extract features from mammograms
2. Implement user authentication
3. Store predictions in database
4. Add export to PDF functionality
5. Integrate both /predict2 and /predict3 for comparison
6. Add feature importance visualization
7. Implement real-time feature extraction from medical reports
