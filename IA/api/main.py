from fastapi import FastAPI
import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel

# Charger le modèle
model = joblib.load("best_model_pipeline.pkl")

# Initialiser l'application FastAPI
app = FastAPI()

# Définir un modèle de données pour la requête
class AirbnbInput(BaseModel):
    neighbourhood_cleansed: str
    latitude: float
    longitude: float
    property_type: str
    room_type: str
    accommodates: int
    bathrooms: float
    bedrooms: float
    beds: float
    minimum_nights: int
    maximum_nights: int
    instant_bookable: str
    availability_365: int

# Fonction de transformation (similaire au notebook)
def transform_input(data: pd.DataFrame) -> pd.DataFrame:
    data['bedrooms_per_bed'] = data['bedrooms'] / data['beds'].replace(0, pd.NA)
    data['accommodates_per_bathroom'] = data['accommodates'] / data['bathrooms'].replace(0, pd.NA)
    data['accommodates_bedrooms'] = data['accommodates'] * data['bedrooms']
    return data

# Route pour la prédiction
@app.post("/predict")
def predict_price(input_data: AirbnbInput):
    # Convertir les données en DataFrame
    input_df = pd.DataFrame([input_data.dict()])
    
    # Appliquer la transformation
    transformed_input = transform_input(input_df)
    
    # Faire des prédictions
    predictions = model.predict(transformed_input)
    predicted_prices = pd.Series(predictions).apply(lambda x: round(np.expm1(x), 2))

    
    # Retourner le prix prédit
    return {"predicted_price": predicted_prices.tolist()}
