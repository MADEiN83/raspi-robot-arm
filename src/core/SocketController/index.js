class SocketController {
  constructor(server, servoControllers) {
    this.server = server;
    this.servoControllers = servoControllers;
  }

  init() {
    const io = require("socket.io")(this.server);
    const middleware = require("socketio-wildcard")();

    io.use(middleware);

    io.sockets.on("connection", (socket) => {
      socket.on("*", ({ data }) => this.executeEvent(this, data));
      this.sendServoConfigToFront(socket);
    });
  }

  executeEvent(ctx, response) {
    const [eventName, data] = response;
    const aMotorController = ctx.getRelatedMotor(data.pinNumber);

    if (!aMotorController) {
      return;
    }

    aMotorController.on(eventName, data);
  }

  getRelatedMotor(pinNumber) {
    const aMotorController = this.servoControllers.find(
      (aServoController) => (aServoController.pin = pinNumber)
    );
    return aMotorController;
  }

  sendServoConfigToFront(socket) {
    socket.emit("init", {
      count: this.servoControllers.length,
      pins: this.servoControllers.map((aServo) => aServo.pin),
    });
  }
}

module.exports = SocketController;
