from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import requests 
import threading
import time
import json  
import os    
from ai_engine import predict_pm25_3h, get_ai_recommendations, train_real_ai

app = FastAPI(title="Teranga Air-Guard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🔑 METS TON TOKEN AIRGRADIENT ICI
# ==========================================
AIRGRADIENT_TOKEN = "66e22601-c57f-430b-8858-420dc7016083"

# ==========================================
# 💾 SYSTÈME DE BASE DE DONNÉES PERSISTANTE
# ==========================================
DB_FILE = "database.json"

# Au démarrage, on essaie de charger l'historique sauvegardé sur le disque dur
if os.path.exists(DB_FILE):
    with open(DB_FILE, "r") as f:
        try:
            db_history = json.load(f)
            print(f"✅ Base de données chargée avec {len(db_history)} enregistrements !")
        except:
            db_history = []
else:
    db_history = []

# On reconstruit les localisations des capteurs à partir de l'historique
LOCATIONS = {}
for entry in db_history:
    name = entry["sensor_id"]
    if name not in LOCATIONS and "lat" in entry and "lng" in entry:
        LOCATIONS[name] = {"lat": entry["lat"], "lng": entry["lng"]}

# On entraîne l'IA une seule fois au démarrage avec les données rechargées
if db_history:
    train_real_ai(db_history)

class SensorData(BaseModel):
    sensor_id: str
    pm25: float
    pm10: float
    temp: float
    humidite: float
    co2: float

# ==========================================
# --- VARIABLES SYSTÈME GLOBALES ---
SERVER_START_TIME = time.time()  # Enregistre l'heure de démarrage du serveur
system_logs = [
    {"time": datetime.now().strftime("%H:%M:%S"), "type": "INFO", "msg": "Démarrage du serveur Teranga Air-Guard"}
]

def add_system_log(log_type, msg):
    """Fonction pour ajouter un événement au journal (max 50 événements)"""
    system_logs.append({
        "time": datetime.now().strftime("%H:%M:%S"), 
        "type": log_type, 
        "msg": msg
    })
    if len(system_logs) > 50:
        system_logs.pop(0)  # Supprime le plus vieux si on dépasse 50

# ==========================================
# 📡 LE MOTEUR DE RÉCUPÉRATION AIRGRADIENT
# ==========================================
def poll_airgradient():
    while True:
        if AIRGRADIENT_TOKEN != "COLLE_TON_TOKEN_ICI":
            try:
                url = f"https://api.airgradient.com/public/api/v1/locations/measures/current?token={AIRGRADIENT_TOKEN}"
                res = requests.get(url, timeout=10)
                
                if res.status_code == 200:
                    sensors_data = res.json()
                    now_dt = datetime.now()
                    
                    for sensor in sensors_data:
                        name = sensor.get("locationName", "Capteur Inconnu")
                        vrai_lat = sensor.get("latitude") or 14.6937
                        vrai_lng = sensor.get("longitude") or -17.4441
                        
                        entry = {
                            "sensor_id": name,
                            "pm25": sensor.get("pm02") or 0, 
                            "pm10": sensor.get("pm10") or 0,
                            "temp": sensor.get("atmp") or 0,
                            "humidite": sensor.get("rhum") or 0,
                            "co2": sensor.get("rco2") or 0,
                            "lat": vrai_lat,
                            "lng": vrai_lng,
                            "date": now_dt.strftime("%Y-%m-%d"),
                            "time": now_dt.strftime("%H:%M")
                        }
                        
                        db_history.append(entry)
                        LOCATIONS[name] = {"lat": vrai_lat, "lng": vrai_lng}
                            
                    # On entraîne l'IA uniquement quand de nouvelles données arrivent !
                    train_real_ai(db_history)
                    add_system_log("NET", "Nouvelles données AirGradient synchronisées")
                    
                    # 💾 SAUVEGARDE SUR LE DISQUE DUR APRÈS CHAQUE NOUVELLE LECTURE
                    with open(DB_FILE, "w") as f:
                        json.dump(db_history, f)
                        
                    print(f"[{now_dt.strftime('%H:%M:%S')}] Succès : Données synchronisées et sauvegardées !")
                            
            except Exception as e:
                print("Erreur de connexion aux capteurs physiques :", e)
                add_system_log("API", "Échec de connexion à l'API AirGradient")
                
        time.sleep(60)

threading.Thread(target=poll_airgradient, daemon=True).start()

# ==========================================

def get_real_weather():
    try:
        url = "https://api.open-meteo.com/v1/forecast?latitude=14.6937&longitude=-17.4441&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Africa%2FDakar"
        res = requests.get(url, timeout=5).json()
        curr = res['current']
        wmo_map = {0: ("Dégagé", "sun"), 1: ("Peu nuageux", "sun"), 2: ("Nuageux", "cloud-sun"), 3: ("Couvert", "cloud-sun"), 61: ("Pluie faible", "cloud-sun"), 80: ("Averses", "cloud-sun")}
        condition, icon = wmo_map.get(curr['weather_code'], ("Variable", "cloud-sun"))
        
        hourly_list = []
        for i in range(0, 24, 3):
            hourly_list.append({"time": res['hourly']['time'][i][-5:], "temp": res['hourly']['temperature_2m'][i]})
            
        forecast_list = []
        days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
        for i in range(7):
            day_idx = datetime.strptime(res['daily']['time'][i], '%Y-%m-%d').weekday()
            _, d_icon = wmo_map.get(res['daily']['weather_code'][i], ("Variable", "cloud-sun"))
            forecast_list.append({"day": days[day_idx], "max": round(res['daily']['temperature_2m_max'][i]), "min": round(res['daily']['temperature_2m_min'][i]), "icon": d_icon})

        return {
            "city": "Dakar", "condition": condition, "temp": curr['temperature_2m'], "precipitation": f"{curr['precipitation']} mm",
            "humidity": f"{curr['relative_humidity_2m']} %", "wind": f"{curr['wind_speed_10m']} km/h", "wind_speed": curr['wind_speed_10m'],
            "time": datetime.now().strftime("%H:%M"), "hourly": hourly_list, "forecast": forecast_list
        }
    except Exception as e:
        return {"city": "Dakar", "condition": "Ensoleillé", "temp": 28, "precipitation": "0 mm", "humidity": "70 %", "wind": "15 km/h", "wind_speed": 15, "time": datetime.now().strftime("%H:%M"), "hourly": [], "forecast": []}

def get_sensor_status(last_date, last_time):
    """
    Calcule si un capteur est en ligne en comparant l'heure actuelle
    avec la date et l'heure de sa dernière remontée de données.
    """
    try:
        date_str = f"{last_date} {last_time}"
        # CORRECTION ICI : Le format doit être %Y-%m-%d et non %d/%m/%Y
        last_seen = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S") 
        maintenant = datetime.now()
        difference = (maintenant - last_seen).total_seconds()
        
        if difference > 600:
            return "Hors Ligne"
        else:
            return "En Ligne"
    except Exception as e:
        return "Inconnu"

@app.post("/api/sensor-data")
async def receive_data(data: SensorData):
    entry = data.dict()
    now_dt = datetime.now()
    entry["date"] = now_dt.strftime("%Y-%m-%d")
    entry["time"] = now_dt.strftime("%H:%M") 
    db_history.append(entry)
    
    # On entraîne l'IA uniquement quand de nouvelles données arrivent !
    train_real_ai(db_history)
    add_system_log("NET", f"Données reçues manuellement du capteur {entry['sensor_id']}")
    
    with open(DB_FILE, "w") as f:
        json.dump(db_history, f)
        
    return {"status": "success"}

@app.get("/api/system-health")
def get_system_health():
    uptime_seconds = time.time() - SERVER_START_TIME
    heures, reste = divmod(uptime_seconds, 3600)
    minutes, _ = divmod(reste, 60)
    uptime_str = f"{int(heures)}h {int(minutes)}m"

    db_status = "En Ligne"
    db_size = "0 Ko"
    if os.path.exists("database.json"):
        size_bytes = os.path.getsize("database.json")
        db_size = f"{size_bytes / 1024:.1f} Ko"
    else:
        db_status = "Introuvable"

    return {
        "uptime": uptime_str,
        "database": {"status": db_status, "size": db_size},
        "ai_status": "Opérationnel", 
        "logs": list(reversed(system_logs)) 
    }

@app.get("/api/dashboard-stats")
async def get_stats():
    real_weather = get_real_weather()
    
    if not db_history:
        return {"current": None, "history": {}, "latest_by_zone": [], "weather": real_weather, "predictions_by_zone": {}, "recos_by_zone": {}}
    
    # CORRECTION : On a supprimé le train_real_ai(db_history) ici ! Le tableau de bord redevient ultra-rapide.

    history_by_zone = {}
    latest_by_zone = []
    predictions_by_zone = {}
    recos_by_zone = {}
    current_global = db_history[-1]
    
    for zone in LOCATIONS.keys():
        zone_data = [d for d in db_history if d["sensor_id"] == zone][-24:]
        if zone_data:
            history_by_zone[zone] = zone_data
            
            latest = dict(zone_data[-1])
            latest["status"] = get_sensor_status(latest.get("date", ""), latest.get("time", ""))
            latest_by_zone.append(latest)
            predictions_by_zone[zone] = predict_pm25_3h(zone_data, real_weather)
            recos_by_zone[zone] = get_ai_recommendations(latest['pm25'], latest['co2'], real_weather)

    return {
        "current": current_global, "history": history_by_zone, "latest_by_zone": latest_by_zone,
        "weather": real_weather, "predictions_by_zone": predictions_by_zone, "recos_by_zone": recos_by_zone             
    }

@app.get("/api/map-sensors")
async def get_map_sensors():
    latest_sensors = {}
    for entry in db_history:
        latest_sensors[entry["sensor_id"]] = entry
    map_data = []
    for sensor, data in latest_sensors.items():
        if sensor in LOCATIONS:
            map_data.append({"name": sensor, "lat": LOCATIONS[sensor]["lat"], "lng": LOCATIONS[sensor]["lng"], "pm25": data["pm25"], "pm10": data["pm10"], "temp": data["temp"]})
    return map_data

@app.get("/api/history")
async def get_history():
    return db_history[::-1] 

@app.get("/api/export-excel")
async def export_excel(start_date: str = None, end_date: str = None, zone: str = None):
    filtered_data = db_history
    if start_date: filtered_data = [d for d in filtered_data if d['date'] >= start_date]
    if end_date: filtered_data = [d for d in filtered_data if d['date'] <= end_date]
    if zone: filtered_data = [d for d in filtered_data if d['sensor_id'] == zone]
    if not filtered_data: return {"message": "Aucune donnée pour ces filtres"}

    real_weather = get_real_weather()
    enriched_data = []
    for row in filtered_data:
        recos = get_ai_recommendations(row['pm25'], row['co2'], real_weather)
        new_row = row.copy()
        new_row['prediction_ia'] = row['pm25'] 
        new_row['reco_ia'] = recos[0]['msg'] if recos else "Normal"
        enriched_data.append(new_row)

    df = pd.DataFrame(enriched_data)
    df = df[['date', 'time', 'sensor_id', 'pm25', 'pm10', 'temp', 'humidite', 'co2', 'prediction_ia', 'reco_ia']]
    df.columns = ['Date', 'Heure', 'Capteur', 'PM 2.5', 'PM 10', 'Temp (°C)', 'Humidité (%)', 'CO2 (ppm)', 'Prédiction IA +3h', 'Recommandation IA']
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Qualité Air Dakar')
    output.seek(0)
    
    filename = f"rapport_{zone.lower().replace(' ', '_')}.xlsx" if zone else "rapport_global.xlsx"
    return StreamingResponse(output, headers={'Content-Disposition': f'attachment; filename="{filename}"'}, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")