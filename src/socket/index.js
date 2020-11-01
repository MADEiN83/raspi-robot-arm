const init = (server, servoController) => {
  const io = require("socket.io")(server);
  const middleware = require("socketio-wildcard")();

  io.use(middleware);

  io.sockets.on("connection", (socket) => {
    socket.on("*", ({ data }) => servoController.on(data[0], data[1]));
  });
};

module.exports = { init };
