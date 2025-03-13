
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { db, client } from "../drizzle/client";
import { messages } from "../drizzle/schema"; 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const users = new Map();
let message;
io.engine.on("connection_error", (err) => {
  console.error("WebSocket Error:", {
    request: err.req,
    code: err.code,
    message: err.message,
    context: err.context,
  });
});

client
  .connect()
  .then(() => {
    console.log("✅ Database client connected, listening for updates...");
    client.query("LISTEN chat_updates");
  })
  .catch((err) => console.error("❌ Error connecting client:", err));


client.on("notification", (msg) => {
  console.log("📩 Database Update Received:", msg.payload);

  
  io.emit("chat message", JSON.parse(msg.payload!));
});

io.on("connection", async (socket) => {
  console.log("A client connected");
  try {
    const allMessages = await db.select().from(messages);
    socket.emit("all messages", allMessages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
  }


  socket.on("user joined", (username) => {
    console.log(username);
    users.set(socket.id, username);
    io.emit("user joined", username);
    io.emit("update users", Array.from(users.values()));
  });

  socket.on("chat message", (msg) => {
    console.log(msg);
    insert(msg);
  });

  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    if (username) {
      io.emit("user left", username);
      users.delete(socket.id);
      io.emit("update users", Array.from(users.values()));
    }
  });
});

async function insert(msg:typeof messages.$inferInsert) {
  //* so i destruct it
  const { id, user, text, system } = msg;
  try {
    console.warn("about to insert to db");
    console.warn("data before inserting to db");
    console.log(msg);

    message = await db
      .insert(messages)
      .values({
        id,
        user,
        text,
        timestamp: new Date(),
        system,
      })
      .returning();

      await client.query(`NOTIFY chat_updates, '${JSON.stringify(msg)}'`);

      console.log("after insertion data: ")
      console.log(message)
  } catch (error) {
    console.error(error);
  }
}


httpServer.listen(5000, () => {
  console.log("> WebSocket Server running on http://localhost:5000");
});

export {};