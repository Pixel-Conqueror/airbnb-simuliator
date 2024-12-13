# Importation des bibliothèques
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor
from sklearn.metrics import mean_absolute_error
import joblib
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import ast
import glob

# Chargement des données
folder_path = "data/septembre2024"  # Adapter au chemin correct
csv_files = glob.glob(f"{folder_path}/*.csv")
dataframes = [pd.read_csv(file) for file in csv_files]
data = pd.concat(dataframes, ignore_index=True)


# Affichage des informations de base
print("Aperçu des données initiales:")
print(data.head())
print(data.info())

# Préparation des données
selected_columns = [
    'neighbourhood_cleansed', 'latitude', 'longitude', 
    'property_type', 'room_type', 'accommodates',
    'bathrooms', 'bedrooms', 'beds', 'price',
    'minimum_nights', 'maximum_nights', 'instant_bookable',  'availability_365'
]
data = data[selected_columns]

# Traitement des valeurs aberrantes
price_q1, price_q3 = np.percentile(data['price'], [25, 75])
iqr = price_q3 - price_q1
lower_bound = price_q1 - 1.5 * iqr
upper_bound = price_q3 + 1.5 * iqr
data = data[(data['price'] >= lower_bound) & (data['price'] <= upper_bound)]

# Création de nouvelles variables
if all(col in data.columns for col in ['bedrooms', 'beds']):
    data['bedrooms_per_bed'] = data['bedrooms'] / data['beds'].replace(0, np.nan)
if all(col in data.columns for col in ['accommodates', 'bathrooms']):
    data['accommodates_per_bathroom'] = data['accommodates'] / data['bathrooms'].replace(0, np.nan)

# Gestion des outliers pour 'minimum_nights' et 'maximum_nights'
for col in ['minimum_nights', 'maximum_nights']:
    if col in data.columns:
        q1, q3 = data[col].quantile(0.25), data[col].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        data = data[(data[col] >= lower_bound) & (data[col] <= upper_bound)]
        
data.loc[:, 'accommodates_bedrooms'] = data['accommodates'] * data['bedrooms']
data.loc[:, 'price'] = np.log1p(data['price'])

categorical_columns = ['neighbourhood_cleansed', 'property_type', 'room_type', 'instant_bookable']
num_features = [
    'latitude', 'longitude', 'accommodates', 'bathrooms', 'bedrooms', 
    'beds', 'minimum_nights', 'maximum_nights', 'accommodates_bedrooms', 'availability_365', 'bedrooms_per_bed', 'accommodates_per_bathroom', 'accommodates_bedrooms'
]

preprocessor = ColumnTransformer(
    transformers=[
        ('num', RobustScaler(), num_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_columns)
    ]
)

# Séparation des données
X = data.drop('price', axis=1)
y = data['price']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modèles à évaluer
models = {
    'RandomForest': RandomForestRegressor(random_state=42, n_jobs=-1),
    'XGBoost': XGBRegressor(random_state=42, n_jobs=-1),
    'LightGBM': LGBMRegressor(random_state=42, n_jobs=-1),
    'CatBoost': CatBoostRegressor(verbose=0, random_state=42, thread_count=-1),
    'Ridge': Ridge(random_state=42)
}

# Dictionnaire pour stocker les scores des modèles
model_scores = {}

print(X_train.columns)
print(preprocessor)

X_train = X_train.dropna()
y_train = y_train.loc[X_train.index]

print(X_train.isnull().sum())
for name, model in models.items():
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', model)
    ])
    
    # Cross-validation
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='neg_mean_absolute_error', n_jobs=-1)
    mean_cv_score = -np.mean(cv_scores)
    model_scores[name] = mean_cv_score
    print(f"{name}: Cross-Validated MAE = {mean_cv_score:.4f}")

# Sélection du meilleur modèle
best_model_name = min(model_scores, key=model_scores.get)
best_model_class = models[best_model_name]
print(f"Meilleur modèle: {best_model_name} avec MAE = {model_scores[best_model_name]:.4f}")

# Ajustement final du meilleur modèle
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', best_model_class)
])

pipeline.fit(X_train, y_train)

# Prédiction et évaluation
y_pred = np.expm1(pipeline.predict(X_test))
y_test_actual = np.expm1(y_test)
mae = mean_absolute_error(y_test_actual, y_pred)
print(f"MAE sur le jeu de test avec {best_model_name}: {mae:.4f}")

# Exportation du modèle
joblib.dump(pipeline, f'best_airbnb_price_model_{best_model_name}.pkl')
print(f"Modèle exporté en tant que 'best_airbnb_price_model_{best_model_name}.pkl'")

# Charger le pipeline sauvegardé
pipeline = joblib.load('best_airbnb_price_model.pkl')

# Définir la forme des données d'entrée
initial_type = [('float_input', FloatTensorType([None, len(X_train.columns)]))]

# Convertir le modèle en ONNX
onnx_model = convert_sklearn(pipeline, initial_types=initial_type)

# Sauvegarder le modèle ONNX
with open("best_airbnb_price_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
