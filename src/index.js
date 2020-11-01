const express = require("express");
const app = express();
const http = require("http").createServer(app);

const SocketController = require("./core/SocketController");
const ServoController = require("./core/ServoController");

const SERVO_MOTORS = require("./core/servo.config");
const servoControllers = SERVO_MOTORS.map(
  (aMotor) => new ServoController(aMotor)
);

const socketController = new SocketController(http, servoControllers);
socketController.init();

app.use("/", express.static(__dirname + "/../public"));
app.get("/", (_, res) => {
  res.sendFile(__dirname + "/../public/index.html");
});

http.listen(8080, () => {
  console.log("server running on port:", 8080);
});
