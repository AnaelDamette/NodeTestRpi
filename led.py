import RPi.GPIO as GPIO

GPIO.setwarnings(False)

GPIO.setmode(GPIO.BCM)

LED = 16

GPIO.setup(LED, GPIO.OUT)

state = GPIO.input(LED)

if state:
    GPIO.output(LED, GPIO.LOW)

else:
    GPIO.output(LED, GPIO.HIGH)

