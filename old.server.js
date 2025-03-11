import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const users = new Map();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("user joined", (username) => {
      users.set(socket.id, username);
      io.emit("user joined", username);
      io.emit("update users", Array.from(users.values()));
    });

    socket.on("chat message", (msg) => {
      console.log("Message received:", msg);
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      const username = users.get(socket.id); // ✅ Fetch the username from the users Map
      if (username) {
        console.log(`User disconnected: ${username}`);
        io.emit("user left", username); // ✅ Send the correct username
        users.delete(socket.id); // ✅ Remove user from Map
        io.emit("update users", Array.from(users.values())); // ✅ Update user list
      }
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
