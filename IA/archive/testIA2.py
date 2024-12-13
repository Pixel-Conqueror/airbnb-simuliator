# Importation des bibliothèques
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler, StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor, StackingRegressor
from sklearn.linear_model import Ridge
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor
from sklearn.metrics import mean_absolute_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
import joblib
import shap

# Chargement des données
folder_path = "data/septembre2024"  # Adapter au chemin correct
csv_files = glob.glob(f"{folder_path}/*.csv")
dataframes = [pd.read_csv(file) for file in csv_files]
data = pd.concat(dataframes, ignore_index=True)

# Préparation des données
selected_columns = [
    'neighbourhood_cleansed', 'latitude', 'longitude', 
    'property_type', 'room_type', 'accommodates',
    'bathrooms', 'bedrooms', 'beds', 'price',
    'minimum_nights', 'maximum_nights', 'instant_bookable', 'availability_365'
]
data = data[selected_columns]

# Traitement des valeurs aberrantes sur le prix
price_q1, price_q3 = np.percentile(data['price'], [25, 75])
iqr = price_q3 - price_q1
lower_bound = price_q1 - 1.5 * iqr
upper_bound = price_q3 + 1.5 * iqr
data = data[(data['price'] >= lower_bound) & (data['price'] <= upper_bound)]

# Création de nouvelles variables
data['bedrooms_per_bed'] = data['bedrooms'] / data['beds'].replace(0, np.nan)
data['accommodates_per_bathroom'] = data['accommodates'] / data['bathrooms'].replace(0, np.nan)
data['accommodates_bedrooms'] = data['accommodates'] * data['bedrooms']
data['price_per_accommodate'] = data['price'] / data['accommodates']

# Gestion des outliers sur 'minimum_nights' et 'maximum_nights'
for col in ['minimum_nights', 'maximum_nights']:
    q1, q3 = data[col].quantile(0.25), data[col].quantile(0.75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    data = data[(data[col] >= lower_bound) & (data[col] <= upper_bound)]
        
data.loc[:, 'price'] = np.log1p(data['price'])

# Séparation des features
categorical_columns = ['neighbourhood_cleansed', 'property_type', 'room_type', 'instant_bookable']
num_features = [
    'latitude', 'longitude', 'accommodates', 'bathrooms', 'bedrooms', 
    'beds', 'minimum_nights', 'maximum_nights', 'availability_365',
    'bedrooms_per_bed', 'accommodates_per_bathroom', 'accommodates_bedrooms', 'price_per_accommodate'
]

# Préprocesseur
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

# Modèles
models = {
    'RandomForest': RandomForestRegressor(random_state=42, n_jobs=-1),
    'XGBoost': XGBRegressor(random_state=42, n_jobs=-1),
    'LightGBM': LGBMRegressor(random_state=42, n_jobs=-1),
    'CatBoost': CatBoostRegressor(verbose=0, random_state=42, thread_count=-1),
    'Ridge': Ridge(random_state=42)
}

# Entraînement et évaluation des modèles
model_scores = {}
for name, model in models.items():
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', model)
    ])
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='neg_mean_absolute_error', n_jobs=-1)
    mean_cv_score = -np.mean(cv_scores)
    model_scores[name] = mean_cv_score
    print(f"{name}: Cross-Validated MAE = {mean_cv_score:.4f}")

# Modèle avec le meilleur MAE
best_model_name = min(model_scores, key=model_scores.get)
best_model_class = models[best_model_name]
print(f"Meilleur modèle: {best_model_name} avec MAE = {model_scores[best_model_name]:.4f}")

# Ajustement final du meilleur modèle
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', best_model_class)
])
pipeline.fit(X_train, y_train)

# Prédictions et évaluation
y_pred = np.expm1(pipeline.predict(X_test))
y_test_actual = np.expm1(y_test)
mae = mean_absolute_error(y_test_actual, y_pred)
print(f"MAE sur le jeu de test avec {best_model_name}: {mae:.4f}")

# Ajout d'un modèle Deep Learning
X_train_scaled = preprocessor.fit_transform(X_train)
X_test_scaled = preprocessor.transform(X_test)

dl_model = Sequential([
    Dense(128, activation='relu', input_dim=X_train_scaled.shape[1]),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(1)  # Sortie pour la régression
])
dl_model.compile(optimizer='adam', loss='mean_absolute_error')
dl_model.fit(X_train_scaled, y_train, epochs=50, batch_size=32, validation_split=0.2, verbose=1)

# Prédictions avec le modèle DL
y_pred_dl = dl_model.predict(X_test_scaled).flatten()
y_pred_dl_actual = np.expm1(y_pred_dl)
mae_dl = mean_absolute_error(y_test_actual, y_pred_dl_actual)
print(f"MAE avec Deep Learning: {mae_dl:.4f}")

# Visualisation des erreurs
errors = y_test_actual - y_pred
sns.histplot(errors, kde=True)
plt.title('Distribution des erreurs')
plt.show()

# Stacking de modèles
base_models = [
    ('rf', RandomForestRegressor(random_state=42)),
    ('xgb', XGBRegressor(random_state=42)),
    ('lgbm', LGBMRegressor(random_state=42))
]
stack_model = StackingRegressor(estimators=base_models, final_estimator=Ridge(random_state=42))
stack_model.fit(X_train_scaled, y_train)
y_pred_stack = stack_model.predict(X_test_scaled)
mae_stack = mean_absolute_error(y_test_actual, np.expm1(y_pred_stack))
print(f"MAE avec Stacking: {mae_stack:.4f}")
