package main

import (
	"bytes"
	"encoding/json"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"net/http"
	"time"
)

const (
	RABBITMQ_URL   = "amqp://guest:guest@rabbitmq:5672/"
	QUEUE_NAME     = "weather_data_queue"
	NESTJS_API_URL = "http://nestjs-api:3000/api/weather/logs"
)

type WeatherLog struct {
	Location     string  `json:"location"`
	Temperature  float64 `json:"temperature"`
	WindVelocity float64 `json:"wind_velocity"`
	Timestamp    string  `json:"timestamp"`
}

func processAndSendToAPI(messageBody []byte) {
	var logData WeatherLog

	if err := json.Unmarshal(messageBody, &logData); err != nil {
		log.Printf(" Erro ao desserializar JSON: %v", err)
		return
	}

	jsonBody, err := json.Marshal(logData)
	if err != nil {
		log.Printf("Erro ao Serializar dados para NestJS: %v", err)
		return
	}

	client := http.Client{Timeout: 5 * time.Second}

	resp, err := client.Post(
		NESTJS_API_URL,
		"application/json",
		bytes.NewBuffer(jsonBody),
	)

	if err != nil {
		log.Printf("Erro de rede/timeout ao enviar para NestJS: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		log.Printf("Erro no servidor NestJS: %d", resp.StatusCode)
		return
	}

	log.Printf("Simulando envio dos dados para NestJS: %s", string(messageBody))
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %v", msg, err)
	}
}

func main() {
	log.Println("Go Worker Iniciado!")

	conn, err := amqp.Dial(RABBITMQ_URL)
	failOnError(err, "Falha ao conectar ao RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir um Canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		QUEUE_NAME,
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao declarar uma fila")

	log.Printf("Esperando por mensagens na fila '%s'. Para sair, pressione CTRL+C", q.Name)

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao registrar um consumidor")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			log.Printf("Mensagem Recebida: %s", d.Body)

			processAndSendToAPI(d.Body)

			d.Ack(false)
		}

	}()
	<-forever
}
