import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.metrics import precision_recall_fscore_support
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(42)

symptoms_list = [
    'fever', 'cough', 'headache', 'fatigue', 'sore_throat', 
    'shortness_of_breath', 'chest_pain', 'nausea', 'vomiting', 
    'diarrhea', 'muscle_ache', 'loss_of_taste', 'runny_nose',
    'chills', 'joint_pain', 'dizziness', 'sweating', 'appetite_loss'
]

diseases_list = [
    'Common Cold', 'Influenza', 'COVID-19', 'Gastroenteritis',
    'Migraine', 'Bronchitis', 'Pneumonia', 'Food Poisoning',
    'Seasonal Allergies', 'Strep Throat'
]

disease_symptom_patterns = {
    'Common Cold': {
        'fever': 0.3, 'cough': 0.8, 'sore_throat': 0.7, 'runny_nose': 0.9,
        'headache': 0.4, 'fatigue': 0.5
    },
    'Influenza': {
        'fever': 0.95, 'cough': 0.8, 'headache': 0.85, 'fatigue': 0.9,
        'muscle_ache': 0.85, 'chills': 0.8, 'sore_throat': 0.6
    },
    'COVID-19': {
        'fever': 0.87, 'cough': 0.85, 'fatigue': 0.88, 'shortness_of_breath': 0.7,
        'loss_of_taste': 0.65, 'headache': 0.6, 'muscle_ache': 0.6
    },
    'Gastroenteritis': {
        'nausea': 0.9, 'vomiting': 0.85, 'diarrhea': 0.95, 'fever': 0.5,
        'fatigue': 0.7, 'appetite_loss': 0.8
    },
    'Migraine': {
        'headache': 1.0, 'nausea': 0.7, 'dizziness': 0.6, 'fatigue': 0.5
    },
    'Bronchitis': {
        'cough': 0.95, 'chest_pain': 0.6, 'fatigue': 0.7, 'shortness_of_breath': 0.5,
        'fever': 0.4
    },
    'Pneumonia': {
        'fever': 0.85, 'cough': 0.9, 'chest_pain': 0.7, 'shortness_of_breath': 0.8,
        'fatigue': 0.85, 'chills': 0.6
    },
    'Food Poisoning': {
        'nausea': 0.95, 'vomiting': 0.9, 'diarrhea': 0.85, 'fever': 0.4,
        'muscle_ache': 0.5
    },
    'Seasonal Allergies': {
        'runny_nose': 0.9, 'cough': 0.5, 'sore_throat': 0.4, 'headache': 0.3,
        'fatigue': 0.4
    },
    'Strep Throat': {
        'sore_throat': 0.95, 'fever': 0.8, 'headache': 0.6, 'fatigue': 0.7
    }
}

def generate_patient_data(n_samples=5000):
    data = []
    
    for _ in range(n_samples):
        disease = np.random.choice(diseases_list)

        patient = {'disease': disease}

        patient['age'] = np.random.randint(5, 85)
        patient['gender'] = np.random.choice(['male', 'female', 'other'], p=[0.48, 0.48, 0.04])

        pattern = disease_symptom_patterns[disease]
        for symptom in symptoms_list:
            if symptom in pattern:
                patient[symptom] = 1 if np.random.random() < pattern[symptom] else 0
            else:
                patient[symptom] = 1 if np.random.random() < 0.05 else 0
        
        data.append(patient)
    
    return pd.DataFrame(data)

print("Generating synthetic medical dataset...")
df = generate_patient_data(5000)
print(f"Dataset shape: {df.shape}")
print(f"\nDisease distribution:\n{df['disease'].value_counts()}")
print(f"\nFirst few samples:\n{df.head()}")

X = df.drop('disease', axis=1)
y = df['disease']

gender_encoder = LabelEncoder()
X['gender'] = gender_encoder.fit_transform(X['gender'])

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print(f"\nFeatures shape: {X.shape}")
print(f"Classes: {label_encoder.classes_}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"Training set: {X_train.shape}, Test set: {X_test.shape}")

print("\n" + "="*50)
print("Training Random Forest Classifier...")
print("="*50)

rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train, y_train)

cv_scores = cross_val_score(rf_model, X_train, y_train, cv=5)
print(f"Cross-validation scores: {cv_scores}")
print(f"Mean CV accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

y_pred = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n{'='*50}")
print(f"MODEL EVALUATION RESULTS")
print(f"{'='*50}")
print(f"Test Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(
    y_test, y_pred, 
    target_names=label_encoder.classes_,
    zero_division=0
))

cm = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix:")
print(cm)

feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 10 Most Important Features:")
print(feature_importance.head(10))

print("\n" + "="*50)
print("Saving model and artifacts...")
print("="*50)

joblib.dump(rf_model, 'disease_prediction_model_v1.joblib')
print("✓ Model saved: disease_prediction_model_v1.joblib")

joblib.dump(label_encoder, 'label_encoder.joblib')
joblib.dump(gender_encoder, 'gender_encoder.joblib')
print("✓ Encoders saved")

feature_names = X.columns.tolist()
joblib.dump(feature_names, 'feature_names.joblib')
print("✓ Feature names saved")

metadata = {
    'model_version': 'v1.0.0',
    'train_date': pd.Timestamp.now().isoformat(),
    'accuracy': float(accuracy),
    'cv_mean': float(cv_scores.mean()),
    'cv_std': float(cv_scores.std()),
    'n_classes': len(label_encoder.classes_),
    'classes': label_encoder.classes_.tolist(),
    'n_features': len(feature_names),
    'features': feature_names,
    'training_samples': len(X_train),
    'test_samples': len(X_test)
}

import json
with open('model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("✓ Metadata saved: model_metadata.json")

def predict_disease(age, gender, symptoms_dict):
    model = joblib.load('disease_prediction_model_v1.joblib')
    label_enc = joblib.load('label_encoder.joblib')
    gender_enc = joblib.load('gender_encoder.joblib')
    features = joblib.load('feature_names.joblib')
    
    input_data = {'age': age, 'gender': gender_enc.transform([gender])[0]}

    for symptom in features:
        if symptom in ['age', 'gender']:
            continue
        input_data[symptom] = symptoms_dict.get(symptom, 0)
    
    X_new = pd.DataFrame([input_data])[features]

    prediction = model.predict(X_new)[0]
    probabilities = model.predict_proba(X_new)[0]
    
    # Get top 3 predictions
    top_indices = probabilities.argsort()[::-1][:3]
    results = []
    
    for idx in top_indices:
        results.append({
            'disease': label_enc.classes_[idx],
            'probability': float(probabilities[idx]),
            'confidence': 'high' if probabilities[idx] > 0.7 else 'moderate' if probabilities[idx] > 0.4 else 'low'
        })
    
    return {
        'top_prediction': label_enc.classes_[prediction],
        'all_predictions': results
    }

print("\n" + "="*50)
print("Testing Prediction Function")
print("="*50)

test_symptoms_1 = {
    'fever': 1,
    'cough': 1,
    'headache': 1,
    'fatigue': 1,
    'muscle_ache': 1,
    'chills': 1
}

result_1 = predict_disease(35, 'male', test_symptoms_1)
print("\nTest Case 1 - Flu-like symptoms:")
print(f"Top prediction: {result_1['top_prediction']}")
for pred in result_1['all_predictions']:
    print(f"  - {pred['disease']}: {pred['probability']:.2%} ({pred['confidence']} confidence)")

test_symptoms_2 = {
    'nausea': 1,
    'vomiting': 1,
    'diarrhea': 1,
    'fever': 1
}

result_2 = predict_disease(28, 'female', test_symptoms_2)
print("\nTest Case 2 - GI symptoms:")
print(f"Top prediction: {result_2['top_prediction']}")
for pred in result_2['all_predictions']:
    print(f"  - {pred['disease']}: {pred['probability']:.2%} ({pred['confidence']} confidence)")

print("\n" + "="*50)
print("✅ Model training and testing complete!")
print("="*50)
print("\nFiles created:")
print("  - disease_prediction_model_v1.joblib")
print("  - label_encoder.joblib")
print("  - gender_encoder.joblib")
print("  - feature_names.joblib")
print("  - model_metadata.json")
print("\nModel is ready for deployment!")