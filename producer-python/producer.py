import requests, pika, time
import json

API_URL = "https://api.open-meteo.com/v1/forecast"
RABBITMQ_HOST = "rabbitmq"
QUEUE_NAME = "weather_data_queue"
PARAMS = {
    "latitude": -15.55,
    "longitude": -47.34,
    "current_weather": "true",
    "timezone": "America/Sao_Paulo",
}
INTERVALO_SEGUNDOS = 60  


def main_loop():
    while True:
        print("Iniciando nova iteração de coleta e envio de dados...")
        
        queue_data = fetch_weather_data()
        
        if queue_data:
            send_to_queue(queue_data)
        else:
            print("Coleta de dados falhou. Pulando envio para a fila.")
        
        print(f"Ciclo finalizado. Dormindo por {INTERVALO_SEGUNDOS} segundos...")
        time.sleep(INTERVALO_SEGUNDOS)


def send_to_queue(data_dict):
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBITMQ_HOST)
        )
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=True)

        message = json.dumps(data_dict)
        channel.basic_publish(
            exchange="",
            routing_key=QUEUE_NAME,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,
            ),
        )
        print(f"Enviado {message} para a fila {QUEUE_NAME} com sucesso.")

        connection.close()
    except pika.exceptions.AMQPConnectionError as e:
        print(f"Erro ao conectar com o RabbitMQ: {e}")
    except Exception as e:
        print(f"Erro ao enviar mensagem para a fila: {e}")


def fetch_weather_data():
    try:
        response = requests.get(API_URL, params=PARAMS)
        response.raise_for_status()
        data = response.json()

        temperature = data["current_weather"]["temperature"]
        wind_velocity = data["current_weather"]["windspeed"]

        print(f"Temperatura Atual: {temperature}ºC")
        print(f"Velocidade do Vento: {wind_velocity} km/h")

        queue_data = {
            "location": "Formosa, GO",
            "temperature": temperature,
            "wind_velocity": wind_velocity,
            "timestamp": data["current_weather"]["time"],
        }
        
        return queue_data

    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar com a api: {e}")
        return None
    except KeyError as e:
        print(f"Erro ao extrair dados da resposta: Campo {e} não encontrado.")
        return None
    
if __name__ == "__main__":
    main_loop()