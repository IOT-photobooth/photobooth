import time
from rpi_ws281x import PixelStrip, Color

import sys
import paho.mqtt.client as mqtt

# LED strip configuration:
LED_COUNT = 10        # Number of LED pixels.
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

# mqtt setup
def on_connect(client, userdata, flags, rc, properties):
    print(f"Connected with result code {rc}")
    client.subscribe('photobooth/AHS')


def message_handler(client, userdata, message):
    print(f"Message received: {message.payload.decode()}")
    # if message.topic == 'photobooth/AHS' and message.payload.decode() == 'flash':
    if message.payload.decode() == 'flash':
        print("Flash!")
        ledCountdown(strip)

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = message_handler

if client.connect("mqtt.eclipseprojects.io", 1883, 60) != 0:
    print("Could not connect to MQTT broker")
    sys.exit(1)

def colorWipe(strip, color, wait_ms=75):
    """Wipe color across display a pixel at a time."""
    for i in range(strip.numPixels() // 2):
        strip.setPixelColor(i, color)
        strip.setPixelColor(strip.numPixels() - i - 1, color)
        strip.show()
        time.sleep(wait_ms / 1000.0)

def fill (strip, color):
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
    strip.show()

def runningLights(strip, color, interval, count=3, wait_s=0.1):
    fill(strip, Color(0, 0, 0))
    positions = [-(interval * i) for i in range(count)]
    
    while positions[-1] < LED_COUNT // 2:
        fill(strip, Color(0, 0, 0))
        for pos in positions:
            if pos >= 0 and pos < LED_COUNT // 2:
                strip.setPixelColor(LED_COUNT // 2 + pos, Color(*color))
                strip.setPixelColor(LED_COUNT // 2 - pos - 1, Color(*color))
        strip.show()
        time.sleep(wait_s)
        positions = [pos + 1 for pos in positions]
    fill(strip, Color(0, 0, 0))

def ledCountdown(strip, count=5, color1=(255, 0, 0), color2=(255, 255, 255), color3=(0, 255, 0)):
    fill(strip, Color(0, 0, 0))  # Wis alle LEDs
    strip.show()
    for i in range(LED_COUNT // 2):
        print(count - i)
        strip.setPixelColor(i, Color(*color1))         # Linkerlicht
        strip.setPixelColor((LED_COUNT - i - 1), Color(*color1))  # Rechterlicht
        strip.show()
        time.sleep(1)
    print("wit")
    fill(strip, Color(*color2))  # Maak alle LEDs wit
    strip.show()
    time.sleep(2)
    fill(strip, Color(0, 0, 0))  # Wis alle LEDs
    strip.show()
    print("groen")
    time.sleep(0.5)
    runningLights(strip, (0, 255, 0), 1, 5, 0.05)
    runningLights(strip, (0, 255, 0), 1, 5, 0.05)
    print("uit")
    fill(strip, Color(0, 0, 0))  # Wis alle LEDs
    strip.show()

if __name__ == '__main__':
    # Clear the strip
    colorWipe(strip, Color(0, 0, 0))

    # Run a color wipe of red, green, and blue
    colorWipe(strip, Color(255, 0, 0))  # Red wipe
    colorWipe(strip, Color(0, 255, 0))  # Green wipe
    colorWipe(strip, Color(0, 0, 255))  # Blue wipe
    colorWipe(strip, Color(0, 0, 0))  # Wipe out

    #time.sleep(1)

    #ledCountdown(strip)

    client.loop_forever()