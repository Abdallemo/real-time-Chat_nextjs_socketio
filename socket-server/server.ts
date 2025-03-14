
import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { db, client } from "../drizzle/client";
import { messages } from "../drizzle/schema"; 


const app = express();
const PORT = process.env.SOCKET_IO_URL_PORT
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  connectTimeout:70000,
  pingTimeout:60000,
  pingInterval:25000
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
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("✅ Database client connected, listening for updates...");
    await client.query("LISTEN chat_updates").catch(console.error);
    setInterval(async () => {
      try {
        await client.query("SELECT 1");
      } catch (err) {
        console.error("❌ Keep-alive query failed:", err);
        await connectToDatabase(); 
      }
    }, 30000);

  } catch (err) {
    console.error("❌ Error connecting client:", err);
    setTimeout(connectToDatabase, 5000);
  }
}

connectToDatabase();



client.on("notification", (msg) => {
  console.log("📩 Database Update Received:", msg.payload);

  
  io.emit("chat message", JSON.parse(msg.payload!));
});

client.on("error",(error)=>{
  console.error("❌ Database client error:", error);
  client.end();
 
})

io.on("connection", async (socket) => {
  console.log("A client connected",socket.id);
  try {
    //! Might cause a problem
    if(db){

      const allMessages = await db.select().from(messages);
      socket.emit("all messages", allMessages);
    }
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
  }


  socket.on("user joined", (username) => {
    console.log(username, "joined");
  
    users.set(socket.id, username); 
  
    const usernames = Array.from(users.values()); 
    console.log("Updated users (server):", usernames);
  
    io.emit("update users", usernames);
  });

  socket.on("chat message", (msg) => {
    console.log(msg);
    insert(msg);
    // io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  
    users.delete(socket.id); 
    const usernames = Array.from(users.values());
    console.log("Updated users (server):", usernames);
  
    io.emit("update users", usernames);
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

httpServer.listen(PORT, () => {
  console.log(`> WebSocket Server running on http://localhost:${PORT}`);
});

export {};