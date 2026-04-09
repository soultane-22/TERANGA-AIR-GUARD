from sklearn.ensemble import RandomForestRegressor
import numpy as np

# 1. INITIALISATION DE LA VRAIE IA
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
is_model_trained = False

def train_real_ai(historical_data):
    """
    Entraîne le modèle de Machine Learning avec l'historique des capteurs.
    Il apprend comment la météo et les taux précédents affectent la pollution future.
    """
    global is_model_trained
    if len(historical_data) < 10:
        return # Pas assez de données pour apprendre

    X = [] # Les caractéristiques (Features)
    y = [] # Ce qu'on veut prédire (Target)
    
    # On crée les données d'entraînement : on utilise l'état actuel pour prédire l'état suivant
    for i in range(len(historical_data) - 1):
        current = historical_data[i]
        future = historical_data[i+1] # La cible est le PM2.5 de l'heure suivante
        
        features = [current['pm25'], current['pm10'], current['temp'], current['humidite']]
        X.append(features)
        y.append(future['pm25'])

    if X and y:
        rf_model.fit(X, y) # L'IA s'entraîne ici !
        is_model_trained = True

def predict_pm25_3h(current_data, current_weather):
    """Prédit le niveau de PM2.5 en utilisant le modèle entraîné et la météo réelle"""
    if not current_data:
        return 0
    
    latest = current_data[-1]
    
    try:
        # On TENTE de faire une prédiction avec l'IA
        features = [[latest['pm25'], latest['pm10'], latest['temp'], latest['humidite']]]
        base_prediction = rf_model.predict(features)[0]
        
        # Facteur Météo : Le vent nettoie l'air, l'humidité retient les particules
        wind_speed = current_weather.get('wind_speed', 10)
        weather_adjustment = - (wind_speed * 0.3) 
        
        final_pred = base_prediction + weather_adjustment
        return max(0, round(final_pred, 1))
        
    except Exception:
        # FILET DE SÉCURITÉ : Si l'IA n'a pas encore assez de données pour être entraînée
        # (et déclenche une erreur au lieu de faire une prédiction),
        # on intercepte le plantage et on renvoie simplement le taux de pollution actuel.
        return latest['pm25']
def get_ai_recommendations(pm25, co2, weather):
    """Génère des recommandations médicales basées sur les données combinées"""
    alerts = []
    temp = weather.get('temp', 25)
    
    if pm25 > 35:
        alerts.append({
            "type": "danger",
            "msg": f"Pollution critique ({pm25} µg/m³). L'air est lourd avec {temp}°C. Restez à l'intérieur.",
            "wolof": "Pollution bi dëgër na lool! Tejal palanteer yi té bu gënë."
        })
    elif pm25 > 15:
        alerts.append({
            "type": "warning",
            "msg": "Qualité de l'air moyenne. Le port du masque est conseillé.",
            "wolof": "Air bi baxul lool. Solal masque su ngéy guène."
        })
    
    if co2 > 1000:
        alerts.append({
            "type": "warning",
            "msg": "Taux de CO2 élevé. Profitez du vent pour aérer la pièce.",
            "wolof": "CO2 bi yokuna. Ubbi lën palanteer yi."
        })
        
    if not alerts:
        alerts.append({
            "type": "success",
            "msg": "Les conditions météorologiques et de l'air sont excellentes !",
            "wolof": "Air bi set na lool ci Deuk bi tay!"
        })
    return alerts

#66e22601-c57f-430b-8858-420dc7016083