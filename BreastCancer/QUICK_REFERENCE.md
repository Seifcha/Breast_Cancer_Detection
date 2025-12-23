# Quick Reference Guide - Breast Cancer Detection System

## 🎯 Quick Start

### Start the System
```bash
# Terminal 1 - Flask Backend
cd f:\MLproject\BreastCancer\src\ML
python app.py

# Terminal 2 - React Frontend  
cd f:\MLproject\BreastCancer
npm run dev
```

## 📝 What Happens When You Click "Create Patient Report"

1. **Report Description** → Saved to `input_report.txt`
2. **Features Loaded** → From `extracted_features.json`
3. **API Called** → `/predict2` with features
4. **ML Prediction** → Softmax Regression model
5. **Results Displayed** → On Results page

## 🔗 API Endpoints

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/save_report` | POST | Save report description | `{"report_description": "..."}` | `{"status": "success"}` |
| `/predict2` | POST | Get ML prediction (DSO2) | 30 features JSON | `{"prediction": 0/1, "probability_class0": ..., "probability_class1": ...}` |
| `/predict3` | POST | Get ML prediction (DSO3) | 30 features JSON | Risk stratification + recommendations |

## 📊 Input Features (30 Total)

### Mean Features (10)
- mean radius, mean texture, mean perimeter, mean area
- mean smoothness, mean compactness, mean concavity
- mean concave points, mean symmetry, mean fractal dimension

### Error Features (10)
- radius error, texture error, perimeter error, area error
- smoothness error, compactness error, concavity error
- concave points error, symmetry error, fractal dimension error

### Worst Features (10)
- worst radius, worst texture, worst perimeter, worst area
- worst smoothness, worst compactness, worst concavity
- worst concave points, worst symmetry, worst fractal dimension

## 📂 Key Files

| File | Location | Purpose |
|------|----------|---------|
| `Home.tsx` | `src/pages/` | Patient report form |
| `Results.tsx` | `src/pages/` | Display predictions |
| `app.py` | `src/ML/` | Flask API server |
| `extracted_features.json` | `src/ML/` | Input features for ML |
| `input_report.txt` | `src/ML/` | Saved report descriptions |
| `scaler_dso2.joblib` | `src/ML/` | Feature scaler |
| `softmax_regression_dso2.pth` | `src/ML/` | PyTorch model |

## 🔄 Data Flow

```
User Input → Save Report → Load Features → API Prediction → Display Results
```

## 🧪 Testing the API

### Test Save Report
```bash
curl -X POST http://localhost:5000/save_report \
  -H "Content-Type: application/json" \
  -d '{"report_description": "Test clinical notes"}'
```

### Test Prediction
```bash
curl -X POST http://localhost:5000/predict2 \
  -H "Content-Type: application/json" \
  -d @src/ML/extracted_features.json
```

## 📋 Prediction Response

```json
{
  "prediction": 0,              // 0 = Benign, 1 = Malignant
  "probability_class0": 0.8234, // Probability of Benign
  "probability_class1": 0.1766  // Probability of Malignant
}
```

## 🎨 Results Page Displays

1. **Main Diagnosis**
   - BÉNIN or MALIN
   - Confidence percentage
   - Recommendation

2. **Patient Info**
   - Name, ID, Date

3. **Image Preview**
   - Mammogram or PDF indicator

4. **Clinical Notes**
   - Report description

5. **AI Analysis Details** (if API works)
   - Predicted class
   - Both probabilities with progress bars
   - Model information

## ⚙️ Configuration

### Flask Server
- **Port**: 5000
- **CORS**: Enabled for all origins
- **Debug**: Not specified (default)

### React Frontend
- **Dev Server**: Usually port 5173
- **API URL**: `http://localhost:5000`

## 🐛 Troubleshooting

### Flask Server Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Try different port
# In app.py, change: app.run(port=5001)
```

### CORS Errors
- Ensure `flask-cors` is installed
- Check CORS is enabled in app.py: `CORS(app)`

### API Returns 400 Error
- Check `extracted_features.json` is valid JSON
- Ensure all 30 feature keys are present
- Null values are OK (replaced with 0)

### No API Response in Results
- Check browser console for errors
- Verify Flask server is running
- Check network tab in browser DevTools

## 📦 Dependencies

### Python (Flask Backend)
- flask
- flask-cors
- torch
- numpy
- scikit-learn
- joblib

### JavaScript (React Frontend)
- react
- react-router-dom
- typescript

## 🔐 Security Notes

⚠️ **Development Only**
- CORS enabled for all origins
- No authentication
- File writes unrestricted

🔒 **For Production**
- Add authentication
- Restrict CORS origins
- Validate all inputs
- Add rate limiting
- Use HTTPS

## 📈 Future Enhancements

- [ ] Extract features from uploaded images
- [ ] Store predictions in database
- [ ] Add user authentication
- [ ] Export reports to PDF
- [ ] Compare /predict2 and /predict3 results
- [ ] Add feature importance visualization
- [ ] Real-time feature extraction from text

## 💡 Tips

1. **Modify Features**: Edit `extracted_features.json` to test different cases
2. **Check Logs**: Watch Flask terminal for API call logs
3. **Browser DevTools**: Use Network tab to debug API calls
4. **Test Endpoints**: Use Postman or curl before frontend testing
5. **Null Values**: OK in features, automatically replaced with 0

## 📞 Quick Help

**Flask not responding?**
- Restart Flask server
- Check terminal for errors
- Verify port 5000 is free

**Frontend not connecting?**
- Check API URL is correct
- Verify CORS is enabled
- Check browser console

**Wrong predictions?**
- Verify `extracted_features.json` data
- Check model files are present
- Ensure scaler is loaded correctly

## 🎓 Understanding the ML Model

**Model Type**: Softmax Regression (PyTorch)
**Input**: 30 normalized features
**Output**: 2 class probabilities (Benign, Malignant)
**Normalization**: StandardScaler (mean=0, std=1)
**Decision**: argmax(probabilities)

## 📊 Example Feature Values

```json
{
  "mean radius": 18.5,        // Typical range: 6-28
  "mean texture": 20.0,       // Typical range: 9-40
  "mean area": 1000.0,        // Typical range: 143-2501
  "worst area": 2000.0,       // Typical range: 185-4254
  // ... etc
}
```

## ✅ Checklist Before Running

- [ ] Flask server started
- [ ] React dev server started
- [ ] `extracted_features.json` exists
- [ ] Model files present in ML directory
- [ ] flask-cors installed
- [ ] Browser pointed to React URL

---

**Last Updated**: 2025-12-15
**Version**: 1.0
