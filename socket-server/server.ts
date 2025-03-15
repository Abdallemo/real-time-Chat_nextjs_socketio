
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
let isReconnecting = false;


io.engine.on("connection_error", (err) => {
  console.error("WebSocket Error:", {
    request: err.req,
    code: err.code,
    message: err.message,
    context: err.context,
  });
});
async function connectToDatabase() {
  if(isReconnecting) return
  isReconnecting = true;

  try {

    await client.connect();
    console.log("✅ Database client connected, listening for updates...");
    await client.query("LISTEN chat_updates").catch(console.error);

    setInterval(async () => {

      try {
        await client.query("SELECT 1");
      } catch (err) {
        console.error("❌ Keep-alive query failed:", err);
        isReconnecting = false
        await connectToDatabase(); 
      }
    }, 30000);

  } catch (err) {
    console.error("❌ Error connecting client:", err);
    isReconnecting = false;
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
  try {
    client.end();
    
  } catch (error) {
    console.error("⚠️ Error closing database client:", error);
    setTimeout(() => {
      console.error('Reconnecting...')
      connectToDatabase()
      isReconnecting = false;
    }, 5000);
  }
  
 
})

io.on("connection", async (socket) => {
  console.log("A client connected", socket.id);

  socket.on("user joined", (username) => {
    console.log(username, "joined");
    if(!users.has(socket.id)){
      socket.broadcast.emit("user joined",username)
  
      users.set(socket.id, username); 
      socket.join("globalRoom"); 
      // io.to("globalRoom").emit("user joined", username);
      const usernames = Array.from(users.values()); 

      console.log("Updated users (server):", usernames);
      io.to('globalRoom').emit('system message', `${username} has joined the chat.`);
      io.to("globalRoom").emit("update users", usernames);

    }
  });
 

  
  try {
    //! Might cause a problem
    if(db){

      const allMessages = await db.select().from(messages);
      socket.emit("all messages", allMessages);
    }
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
  }

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    console.log(`${users.get(socket.id)} joined room: ${roomId}`);
  });

  socket.on("chat message", (msg) => {
    console.log(msg);
    insert(msg);
    // io.to(msg.roomId || "globalRoom").emit("chat message", msg); 
  });


  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  
    const username = users.get(socket.id);
    if(username){

      users.delete(socket.id); 
      io.to("globalRoom").emit("user left", username);
      //socket.leave("globalRoom"); 
      const usernames = Array.from(users.values());

      console.log("Updated users (server):", usernames);
      io.to("globalRoom").emit("update users", usernames);
      io.to('globalRoom').emit('system message', `${username} has left the chat.`);
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

    const message = await db
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