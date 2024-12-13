# Importation des bibliothèques
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler, OneHotEncoder
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error
import joblib  # For exporting the model
import ast
import glob

# Chargement des données
folder_path = "data"  # Adapter au chemin correct
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
    'bathrooms', 'bedrooms', 'beds', 'amenities', 'price',
    'minimum_nights', 'maximum_nights', 'instant_bookable', 
]
data = data[selected_columns]

# Nettoyage des données
# Suppression des doublons
data.drop_duplicates(inplace=True)

# Nettoyage de la colonne `price`
data['price'] = data['price'].str.replace('$', '').str.replace(',', '').astype(float)

# Traitement des valeurs manquantes
numeric_columns = ['bathrooms', 'bedrooms', 'beds', 'price']
for col in numeric_columns:
    median_value = data[col].median()
    data[col].fillna(median_value, inplace=True)

# Suppression des lignes critiques avec des valeurs manquantes
critical_columns = ['neighbourhood_cleansed', 'latitude', 'longitude']
data.dropna(subset=critical_columns, inplace=True)

# Traitement des valeurs aberrantes
price_q1, price_q3 = np.percentile(data['price'], [25, 75])
iqr = price_q3 - price_q1
lower_bound = price_q1 - 1.5 * iqr
upper_bound = price_q3 + 1.5 * iqr
data = data[(data['price'] >= lower_bound) & (data['price'] <= upper_bound)]

# Ajouter une colonne 'amenities_count' contenant le nombre d'amenities
data['amenities'] = data['amenities'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
data['amenities_count'] = data['amenities'].apply(len)

# Ajouter des features dérivées
data['accommodates_bedrooms'] = data['accommodates'] * data['bedrooms']

# Transformation de la variable cible
data['price'] = np.log1p(data['price'])

# Encodage et transformation des caractéristiques
categorical_columns = ['neighbourhood_cleansed', 'property_type', 'room_type', 'instant_bookable']
num_features = [
    'latitude', 'longitude', 'accommodates', 'bathrooms', 'bedrooms', 
    'beds', 'minimum_nights', 'maximum_nights', 'amenities_count', 'accommodates_bedrooms'
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

# Construction du pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', XGBRegressor(random_state=42))
])

# Tuning des hyperparamètres
param_grid = {
    'model__n_estimators': [50, 100, 200],
    'model__max_depth': [3, 6, 10],
    'model__learning_rate': [0.01, 0.1, 0.3],
    'model__subsample': [0.7, 0.8, 1.0]
}
grid_search = GridSearchCV(
    pipeline, param_grid, cv=5, scoring='neg_mean_absolute_error', n_jobs=-1
)

grid_search.fit(X_train, y_train)

# Meilleur modèle
best_model = grid_search.best_estimator_

# Évaluation avec cross-validation
cv_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='neg_mean_absolute_error')
print("Cross-Validated MAE:", -np.mean(cv_scores))

# Prédiction et évaluation
y_pred = np.expm1(best_model.predict(X_test))
y_test_actual = np.expm1(y_test)
mae = mean_absolute_error(y_test_actual, y_pred)
print("MAE:", mae)

# Exportation du modèle
joblib.dump(best_model, 'best_airbnb_price_model.pkl')
print("Modèle exporté en tant que 'best_airbnb_price_model.pkl'")
