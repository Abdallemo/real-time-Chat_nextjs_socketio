import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
    },
});

const users = new Map();

io.engine.on("connection_error", (err) => {
    console.error("WebSocket Error:", {
        request: err.req,    // Request object
        code: err.code,      // Error code
        message: err.message, // Error message
        context: err.context // Additional context
    });
});

io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("user joined", (username) => {
        users.set(socket.id, username);
        io.emit("user joined", username);
        io.emit("update users", Array.from(users.values()));
    });

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
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


httpServer.listen(8080, () => {
    console.log("> WebSocket Server running on http://localhost:8080");
});
