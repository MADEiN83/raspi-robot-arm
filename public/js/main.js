//load socket.io-client and connect to the host
const socket = io.connect();

socket.on("init", (data) => {
  const { count = 0, pins = [] } = data;

  const section = document.querySelector("body section");

  for (let i = 0; i < count; i++) {
    const pinNumber = pins[i];
    const node = section.cloneNode(true);
    node.setAttribute("data-pin", pinNumber);
    node.setAttribute("id", `pin#${pinNumber}`);

    node.querySelectorAll("button").forEach((button) => {
      button.setAttribute("onclick", "run(this);");
    });

    section.after(node);
  }

  section.remove();
});

/**
 * EVENTS.
 */
const moveAngles = (pinNumber) => {
  const angles = +document.querySelector(
    `section[data-pin="${pinNumber}"] input.value`
  ).value;

  socket.emit("moveAngles", { pinNumber, angles });
};

const moveMin = (pinNumber) => {
  socket.emit("moveMin", { pinNumber });
};

const moveMax = (pinNumber) => {
  socket.emit("moveMax", { pinNumber });
};

const animate = (pinNumber) => {
  const element = document.querySelector(
    `section[data-pin="${pinNumber}"] input.animate-value`
  );
  const values = element.value.split(" ").map((p) => +p);
  socket.emit("animate", { pinNumber, values });
};

/**
 * UTILS.
 */
const run = (aButton) => {
  const events = {
    moveAngles: moveAngles,
    moveMin: moveMin,
    moveMax: moveMax,
    animate: animate,
  };

  const eventName = aButton.getAttribute("data-event");
  const pinNumber = aButton.closest("section").getAttribute("data-pin");

  events[eventName](pinNumber);
};
