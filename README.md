(https://raspberry-pi.fr/servomoteur-raspberry-pi/)

Update available packages:

```bash
$ sudo apt-get update
```

Then attempt to install the RPi.GPIO package :

```bash
$ sudo apt-get install rpi.gpio wiringpi
```

Enable PWM on port 12, GPIO 18:

```bash
gpio mode 18 pwm
gpio pwm-ms
gpio pwmc 192
gpio pwmr 2000

```

![](https://raspberry-projects.com/pi/wp-content/uploads/2016/05/rpi_zero_io_pinouts.jpg)

gpio -g pwm 18 150
