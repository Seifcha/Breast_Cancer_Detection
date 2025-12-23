# System Flow Diagram

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE (React)                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         HOME PAGE (Home.tsx)                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  User fills form:                                               │    │
│  │  • Patient Name                                                 │    │
│  │  • Patient ID                                                   │    │
│  │  • Report Description (clinical notes)                          │    │
│  │  • Mammogram Image/PDF                                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│                    [User clicks "Create Patient Report"]                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 1: Save Report Description                       │
│                                                                          │
│  POST http://localhost:5000/save_report                                 │
│  Body: { "report_description": "..." }                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLASK API (/save_report)                              │
│                                                                          │
│  • Receives report description                                          │
│  • Writes to: src/ML/input_report.txt                                   │
│  • Returns: { "status": "success", ... }                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 2: Load Feature Data                             │
│                                                                          │
│  Frontend fetches: /src/ML/extracted_features.json                      │
│                                                                          │
│  {                                                                       │
│    "mean radius": 18.5,                                                 │
│    "mean texture": null,                                                │
│    ...                                                                   │
│    "worst area": 2000.0,                                                │
│    ...                                                                   │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 3: Get ML Prediction                             │
│                                                                          │
│  POST http://localhost:5000/predict2                                    │
│  Body: { all 30 features from extracted_features.json }                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLASK API (/predict2)                                 │
│                                                                          │
│  1. Receive features                                                    │
│  2. Replace null values with 0                                          │
│  3. Create numpy array (1 x 30)                                         │
│  4. Apply StandardScaler (scaler_dso2.joblib)                           │
│  5. Convert to PyTorch tensor                                           │
│  6. Run through Softmax Regression model                                │
│  7. Calculate probabilities with softmax                                │
│  8. Determine class: argmax(probabilities)                              │
│                                                                          │
│  Returns:                                                                │
│  {                                                                       │
│    "prediction": 0 or 1,  // 0=Benign, 1=Malignant                      │
│    "probability_class0": 0.8234,  // Benign probability                 │
│    "probability_class1": 0.1766   // Malignant probability              │
│  }                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 4: Process Response                              │
│                                                                          │
│  Frontend (Home.tsx):                                                    │
│  • Receives API response                                                │
│  • Extracts prediction class                                            │
│  • Calculates confidence from probabilities                             │
│  • Saves report to patient context                                      │
│  • Navigates to Results page with data                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    RESULTS PAGE (Results.tsx)                            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  MAIN DIAGNOSIS CARD                                            │    │
│  │  • Diagnosis: BÉNIN or MALIN                                    │    │
│  │  • Confidence Score: XX.X%                                      │    │
│  │  • Recommendation                                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  PATIENT INFORMATION                                            │    │
│  │  • Name, ID, Date                                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  IMAGE PREVIEW                                                  │    │
│  │  • Uploaded mammogram or PDF indicator                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  CLINICAL NOTES                                                 │    │
│  │  • Report description from form                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  DETAILED AI ANALYSIS (if API response available)               │    │
│  │  • Predicted Class: 0 (Bénin) or 1 (Malin)                      │    │
│  │  • Probability Benign: XX.XX% [progress bar]                    │    │
│  │  • Probability Malignant: XX.XX% [progress bar]                 │    │
│  │  • Model: Softmax Regression (PyTorch) - DSO2                   │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  [Print Report] [New Diagnosis]                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## File Interactions

```
┌─────────────────────┐
│   extracted_        │
│   features.json     │──┐
│                     │  │
│  • 30 features      │  │  Read by
│  • Some null values │  │  Frontend
└─────────────────────┘  │
                         │
                         ▼
                    ┌─────────────┐
                    │  Home.tsx   │
                    └─────────────┘
                         │
                         │ POST
                         ▼
                    ┌─────────────┐
                    │   Flask     │
                    │   /predict2 │
                    └─────────────┘
                         │
                         │ Uses
                         ▼
        ┌────────────────────────────────┐
        │  scaler_dso2.joblib            │
        │  softmax_regression_dso2.pth   │
        └────────────────────────────────┘


┌─────────────────────┐
│  Report             │
│  Description        │──┐
│  (from form)        │  │
└─────────────────────┘  │
                         │ POST
                         ▼
                    ┌─────────────┐
                    │   Flask     │
                    │ /save_report│
                    └─────────────┘
                         │
                         │ Writes to
                         ▼
                    ┌─────────────┐
                    │  input_     │
                    │  report.txt │
                    └─────────────┘
```

## API Endpoints Summary

```
┌──────────────────────────────────────────────────────────────┐
│  Flask API Endpoints (http://localhost:5000)                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  POST /save_report                                           │
│  ├─ Input: { "report_description": "..." }                   │
│  └─ Output: { "status": "success", ... }                     │
│                                                              │
│  POST /predict2                                              │
│  ├─ Input: { 30 breast cancer features }                     │
│  └─ Output: { "prediction": 0/1, "probability_class0": ...,  │
│              "probability_class1": ... }                     │
│                                                              │
│  POST /predict3                                              │
│  ├─ Input: { 30 breast cancer features }                     │
│  └─ Output: { "prediction": ..., "risk_level_fr": ...,       │
│              "recommendation_fr": ..., ... }                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Transformation Pipeline

```
Raw Features (JSON)
    ↓
[Replace null with 0]
    ↓
NumPy Array (1 x 30)
    ↓
[StandardScaler Transform]
    ↓
Normalized Features
    ↓
[Convert to PyTorch Tensor]
    ↓
PyTorch Tensor (1 x 30)
    ↓
[Softmax Regression Model]
    ↓
Logits (1 x 2)
    ↓
[Softmax Function]
    ↓
Probabilities [P(Benign), P(Malignant)]
    ↓
[ArgMax]
    ↓
Predicted Class (0 or 1)
```

## Error Handling Flow

```
┌─────────────────────┐
│  API Call Attempt   │
└─────────────────────┘
         │
         ▼
    ┌─────────┐
    │ Success?│
    └─────────┘
      │    │
   Yes│    │No
      │    │
      │    └──────┐
      │           ▼
      │    ┌──────────────┐
      │    │ Log Warning  │
      │    └──────────────┘
      │           │
      │           ▼
      │    ┌──────────────┐
      │    │  Use Fallback│
      │    │  (Random)    │
      │    └──────────────┘
      │           │
      └───────────┘
              │
              ▼
      ┌──────────────┐
      │  Continue to │
      │  Results     │
      └──────────────┘
```
