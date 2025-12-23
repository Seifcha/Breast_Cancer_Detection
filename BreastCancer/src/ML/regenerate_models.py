"""
Regenerate the scaler and MLP model files with current library versions
"""
import joblib
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier

print("Loading Wisconsin Breast Cancer dataset...")
data = load_breast_cancer()
X = data.data
y = data.target

print(f"Dataset shape: {X.shape}")
print(f"Features: {data.feature_names}")

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and save scalers
print("\nCreating scalers...")
scaler_dso2 = StandardScaler()
scaler_dso2.fit(X_train)
joblib.dump(scaler_dso2, 'scaler_dso2.joblib')
print("✅ scaler_dso2.joblib saved")

scaler_dso3 = StandardScaler()
scaler_dso3.fit(X_train)
joblib.dump(scaler_dso3, 'scaler_dso3.joblib')
print("✅ scaler_dso3.joblib saved")

# Train and save MLP model
print("\nTraining MLP model...")
X_train_scaled = scaler_dso3.transform(X_train)
X_test_scaled = scaler_dso3.transform(X_test)

mlp = MLPClassifier(
    hidden_layer_sizes=(100, 50),
    max_iter=1000,
    random_state=42,
    early_stopping=True
)
mlp.fit(X_train_scaled, y_train)

# Evaluate
train_score = mlp.score(X_train_scaled, y_train)
test_score = mlp.score(X_test_scaled, y_test)
print(f"Training accuracy: {train_score:.4f}")
print(f"Test accuracy: {test_score:.4f}")

# Save the model
joblib.dump(mlp, 'mlp_perfect_dso3_model.joblib')
print("✅ mlp_perfect_dso3_model.joblib saved")

print("\n✅ All models regenerated successfully!")
