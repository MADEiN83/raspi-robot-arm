const Gpio = require("pigpio").Gpio;

class ServoController {
  constructor(config) {
    this.pin = config.pin;
    this.minPulse = config.minPulse;
    this.maxPulse = config.maxPulse;
    this.minDegrees = config.minDegrees;
    this.maxDegrees = config.maxDegrees;
    this.speed = config.speed;

    this.motor = new Gpio(this.pin, { mode: Gpio.OUTPUT });
    this.pulseMove(this.minPulse);
  }

  on(eventName, data) {
    const events = {
      moveAngles: () => this.moveAngles(data),
      moveMin: () => this.moveMin(),
      moveMax: () => this.moveMax(),
      animate: () => this.animate(data),
    };

    if (!events[eventName]) {
      throw new Error(`Unable to launch "${eventName}".`);
    }

    events[eventName]();
  }

  /**
   * EVENTS.
   */
  moveAngles({ angles }) {
    console.log("moveAngles", { pin: this.pin, angles });
    const pulse = this.degreesToPulse(angles);
    this.pulseMove(pulse);
  }

  moveMin() {
    console.log("moveMin", { pin: this.pin });
    this.pulseMove(this.minPulse);
  }

  moveMax() {
    console.log("moveMax", { pin: this.pin });
    this.pulseMove(this.maxPulse);
  }

  animate({ values = [] }) {
    console.log("animate", { pin: this.pin, values });
    this.sequences(values);
  }

  /**
   * PRIVATE.
   */
  pulseMove(pulseValue) {
    this.motor.servoWrite(pulseValue);
  }

  async sequences(degreesArray) {
    for (const value of degreesArray) {
      this.moveAngles({ angles: value });
      await wait(500);
    }
  }

  degreesToPulse(degrees) {
    const degreesPercents = (100 * degrees) / this.maxDegrees;
    const pulse = Math.round(
      (degreesPercents * (this.maxPulse - this.minPulse)) / 100 + this.minPulse
    );

    return pulse;
  }
}

module.exports = ServoController;

const wait = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
