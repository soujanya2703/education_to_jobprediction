import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import os

class CareerPredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.target_encoder = LabelEncoder()
        # Initialize and train on import/instantiation for now
        # In production, you'd load a saved model
        self.dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'career_prediction_dataset.csv')
        self.train_model()

    def train_model(self):
        try:
            if not os.path.exists(self.dataset_path):
                print(f"Dataset not found at {self.dataset_path}")
                return

            df = pd.read_csv(self.dataset_path)
            
            # Preprocessing
            # 1. CGPA Parsing
            df['CGPA_Float'] = df['CGPA'].apply(self._parse_cgpa)
            
            # 2. Encoders
            self.label_encoders = {}
            categorical_cols = ['Degree', 'Specialization', 'College_Name'] # Ignoring College_Type for now as we don't capture it
            
            for col in categorical_cols:
                le = LabelEncoder()
                # Handle potential unknown values by appending 'Other' explicitly if needed, 
                # but for training we just fit on what we have.
                df[col] = df[col].astype(str).str.strip()
                df[col] = le.fit_transform(df[col])
                self.label_encoders[col] = le
            
            # Target
            self.target_encoder = LabelEncoder()
            y = self.target_encoder.fit_transform(df['Job_Role'])
            
            # Features
            # Using: Degree, Specialization, College_Name, CGPA_Float, Certificates, Graduation_Year
            X = df[['Degree', 'Specialization', 'College_Name', 'CGPA_Float', 'Certificates', 'Graduation_Year']]
            
            # Train Random Forest
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.model.fit(X, y)
            print("Model trained successfully on CSV dataset.")
            
        except Exception as e:
            print(f"Error training model: {e}")

    def _parse_cgpa(self, val):
        if isinstance(val, (int, float)):
            return float(val)
        val = str(val).strip()
        if "–" in val or "-" in val:
            parts = val.replace('–', '-').split('-')
            try:
                return (float(parts[0]) + float(parts[1])) / 2
            except:
                return float(parts[0])
        if "Below" in val:
            return 5.5
        try:
            return float(val)
        except:
            return 7.5

    def _get_encoded_value(self, col, val):
        le = self.label_encoders.get(col)
        if not le:
            return 0
        try:
            return le.transform([str(val).strip()])[0]
        except ValueError:
            # Fallback for unseen values
            # Ideally we'd have an 'Other' class trained, but purely numeric encoding implies we map to *something*
            # Let's try to map to 0 or a mode if possible, or just -1 if model can handle it (RF can't usually)
            # Safe bet: map to index 0
            return 0

    def predict(self, user_profile):
        """
        user_profile expects keys: 'Degree', 'Specialization', 'College_Name', 'CGPA', 'Certificates', 'Graduation_Year'
        """
        try:
            if not self.model:
                return "Model not trained"

            # Extract raw inputs
            degree = user_profile.get('Degree', 'Other')
            spec = user_profile.get('Specialization', 'Other')
            college = user_profile.get('College_Name', 'Other')
            cgpa_raw = user_profile.get('CGPA', '7.0-7.9')
            certs = int(user_profile.get('Certificates', 0))
            year = int(user_profile.get('Graduation_Year', 2024))
            
            # Preprocess
            cgpa_float = self._parse_cgpa(cgpa_raw)
            degree_enc = self._get_encoded_value('Degree', degree)
            spec_enc = self._get_encoded_value('Specialization', spec)
            college_enc = self._get_encoded_value('College_Name', college)
            
            # Feature Vector
            # Order must match training: Degree, Specialization, College_Name, CGPA_Float, Certificates, Graduation_Year
            features = np.array([[degree_enc, spec_enc, college_enc, cgpa_float, certs, year]])
            
            # Predict
            prediction_idx = self.model.predict(features)[0]
            predicted_career = self.target_encoder.inverse_transform([prediction_idx])[0]
            
            return predicted_career
        except Exception as e:
            print(f"Prediction error: {e}")
            return "General Specialist"
