import subprocess
import paho.mqtt.publish as publish
import time

# function to capture image using Cheese
def capture_image(file_path):
	subprocess.run(['cheese', '--snapshot', '--filename=' + file_path])

# function to read image file and return image data
def read_image(file_path):
	with open(file_path, 'rb') as file:
	return file.read()

# function to send image data to MQTT broker
def send_image_to_broker(image_data, topic, broker_address, port):
	publish.single(topic, payload=image_data, hostname=broker_adress, port=port)

def main():
	#Capture image
	image_file_path="/path/to/image.jpg"
	capture_image(image_file_path)

	#Read image file
	image_data = read_image(image_file_path)

	#MQTT Broker details
	broker_address = "your_broker_adress"
	port = 1883
	topic = "image_topic"

	#Send image to MQTT broker
	send_image_to_broker(image_data,topic,broker_adress, port)

if__name__ == '__main__":
	main()
