const http = require("http");
const fs = require("fs");
const mySocket = require("./socket");
const ServoController = require("./ServoController");
const servoController = new ServoController();

const server = http.createServer((req, res) => {
  fs.readFile(__dirname + "/../public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading socket.io.html");
    }

    res.writeHead(200);
    res.end(data);
  });
});

mySocket.init(server, servoController);

server.listen(8080);
console.log("server running on port:", 8080);
