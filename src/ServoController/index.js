const Gpio = require("pigpio").Gpio;

class ServoController {
  constructor() {
    this.pin = 18;
    this.minPulse = 501;
    this.maxPulse = 2200;
    this.minDegrees = 0;
    this.maxDegrees = 180;
    this.speed = 0.1;

    this.motor = new Gpio(this.pin, { mode: Gpio.OUTPUT });
    this.pulseMove(this.minPulse);
  }

  on(eventName, data) {
    const events = {
      moveMotor: () => this.moveAtDegrees(data),
      moveMotorMin: () => this.pulseMove(this.minPulse),
      moveMotorMax: () => this.pulseMove(this.maxPulse),
      animate: () => this.sequences(data),
    };

    events[eventName]();
  }

  moveAtDegrees(degrees) {
    const pulse = this.degreesToPulse(degrees);
    this.pulseMove(pulse);
  }

  pulseMove(pulseValue) {
    this.motor.servoWrite(pulseValue);
  }

  async sequences(degreesArray) {
    for (const value of degreesArray) {
      this.moveAtDegrees(value);
      await wait(500);
    }
  }

  async demo() {
    for (let i = 0; i < 100; i++) {
      this.moveAtDegrees(Math.round(Math.random() * (this.maxDegrees - 0) + 0));
      await wait(500);
    }
  }

  // Private
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
