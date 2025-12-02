import requests
import json

API_URL = "https//api.open-meteo.com/v1/forecast"

PARAMS = {
    "latitude": -15.55,
    "longitude": -47.34,
    "current_weather": "true",
    "timezone": "America/Sao_Paulo"
}

try:
    response = requests.get(API_URL, params=PARAMS)
    response.raise_for_status()
    data = response.json()

    temperature = data['current_weather']['temperature']
    wild_velocity = data['current_weather']['windspeed']

    print(f"Temperatura Atual: {temperature}ºC")
    print(f"Velocidade do Vento: {wild_velocity} km/h")

    