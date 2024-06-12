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


    """ import time
from rpi_ws281x import PixelStrip, Color

# LED strip configuration:
LED_COUNT = 30        # Number of LED pixels.
LED_PIN = 18          # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10          # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False    # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0

# Create PixelStrip object with appropriate configuration.
strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
# Intialize the library (must be called once before other functions).
strip.begin()

def colorWipe(strip, color, wait_ms=50):
    ""Wipe color across display a pixel at a time.""
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms / 1000.0)

if __name__ == '__main__':
    # Clear the strip
    colorWipe(strip, Color(0, 0, 0), 10)

    # Run a color wipe of red, green, and blue
    colorWipe(strip, Color(255, 0, 0))  # Red wipe
    colorWipe(strip, Color(0, 255, 0))  # Green wipe
    colorWipe(strip, Color(0, 0, 255))  # Blue wipe
 """