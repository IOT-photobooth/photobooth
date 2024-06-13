import time
import board
import busio
import adafruit_pixelbuf
import neopixel_spi as neopixel

import sys
import paho.mqtt.client as mqtt

# Configuratie voor de LED strip
LED_COUNT = 10
LED_BRIGHTNESS = 1.0


# Initialiseer SPI
spi = busio.SPI(board.SCK, MOSI=board.MOSI)

# Maak een NeoPixel object met SPI
pixels = neopixel.NeoPixel_SPI(spi, LED_COUNT, brightness=LED_BRIGHTNESS, auto_write=False)


# mqtt setup
def on_connect(client, userdata, flags, rc, properties):
    print(f"Connected with result code {rc}")
    client.subscribe('photobooth/AHS')


def message_handler(client, userdata, message):
    print(f"Message received: {message.payload.decode()}")
    # if message.topic == 'photobooth/AHS' and message.payload.decode() == 'flash':
    if message.payload.decode() == 'flash':
        print("Flash!")
        runningLightsCountdown(pixels)

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = message_handler

if client.connect("mqtt.eclipseprojects.io", 1883, 60) != 0:
    print("Could not connect to MQTT broker")
    sys.exit(1)

def runningLightsCountdown(pixels, count=5, color1=(255, 0, 0), color2=(255, 255, 255), color3=(0, 255, 0)):

    pixels.fill((0, 0, 0))  # Wis alle LEDs
    pixels.show()
    for i in range(LED_COUNT // 2):
        print(count - i)
        pixels[i] = color1         # Linkerlicht
        pixels[LED_COUNT - i - 1] = color1  # Rechterlicht
        pixels.show()
        time.sleep(1)

    print("wit")
    pixels.fill(color2)  # Maak alle LEDs wit
    pixels.show()
    time.sleep(2)
    print("groen")
    for i in range(LED_COUNT // 2):
        j = LED_COUNT // 2 - i - 1
        pixels.fill((0, 0, 0))
        pixels.show()
        pixels[j] = color3         # Linkerlicht
        pixels[LED_COUNT - j - 1] = color3  # Rechterlicht
        pixels.show()
        time.sleep(.1)
    print("uit")
    pixels.fill((0, 0, 0))  # Wis alle LEDs
    pixels.show()

if __name__ == '__main__':
    # runningLightsCountdown(pixels)  # Start de aftelling
    client.loop_forever()


    #for i in range(LED_COUNT // 2):
      #  j = LED_COUNT // 2 - i - 1
     #   fill(strip, Color(0, 0, 0))
    #    strip.show()
   #     strip.setPixelColor(j, Color(*color3))         # Linkerlicht
  #      strip.setPixelColor((LED_COUNT - j - 1), Color(*color3))  # Rechterlicht
 #       strip.show()
#        time.sleep(.1)