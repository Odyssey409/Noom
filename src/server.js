import http from "http";
import WebSocket from "ws";
import express, { json } from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const PORT = 3000;
const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from Browser ❌"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSokect) =>
          aSokect.send(
            `${socket.nickname}: ${message.payLoad.toString("utf-8")}`
          )
        );
        break;

      case "nickname":
        socket["nickname"] = message.payLoad.toString("utf-8");
        break;
    }
  });
});

server.listen(PORT, handleListening);
