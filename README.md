# Realtime Updates with Next.js, Express, and Socket.io

## Overview
I integrated **Socket.io** into a **Next.js** project while keeping everything in a single repository. Instead of creating a separate backend, I structured the project with a dedicated `server.ts` inside a `socket-server` folder, handling real-time updates via **Express** and **Socket.io**.  
![Screenshot 2025-03-16 135820](https://github.com/user-attachments/assets/286ef46e-eeef-40b2-ae24-ad956ce83776)

The goal was to enable real-time communication for features like chat messages while keeping the rest of the Next.js app fully functional.

---

## How I Set It Up

1. **Express & HTTP Server in Next.js**  
   - Instead of creating a separate backend, I used Express inside a `server.ts` file.
   - Wrapped Express inside an HTTP server to initialize **Socket.io**.
   - Allowed CORS for `localhost:3000` since Next.js runs on that port.

2. **Socket.io for Realtime Updates**  
   - Used `io.on("connection")` to listen for new clients.
   - Emitted and listened to events like `"chat message"` for updates.
   - Implemented database-triggered real-time updates using PostgreSQL's **LISTEN/NOTIFY** with **Drizzle ORM**.

3. **Database Integration with Drizzle ORM**  
   - Used **PostgreSQL LISTEN/NOTIFY** to detect and emit changes.
   - On `INSERT`, a message was sent to all connected clients via `io.emit("chat message", msg)`.
   - Connected the database client once and started listening for updates.

4. **Next.js Client Integration**  
   - Used the `socket.io-client` package in the frontend.
   - Connected to the WebSocket server via `io("http://localhost:5000")`.
   - Used React's `useEffect` to manage connections and send user-related data.

---

## What I Learned

- **Using `ts-node-esm` was problematic**  
  - Initially used `ts-node-esm` for running `server.ts`, but it caused issues with `.ts` file extensions.
  - Switching to **`tsx`** fixed the problem and provided better performance.

- **Keeping everything in one Next.js project is possible**  
  - I didn’t need a separate backend.
  - Running `next dev` and `tsx server.ts` together using **concurrently** worked perfectly.

- **PostgreSQL’s LISTEN/NOTIFY is great for real-time updates**  
  - Instead of constantly querying the database, I made PostgreSQL **push updates** whenever a message was inserted.
  - This minimized unnecessary database calls and improved performance.

- **Socket.io works well inside Next.js when handled separately**  
  - Instead of trying to use API routes (`/api/socket`), keeping the WebSocket server outside of Next.js in `server.ts` made things cleaner.

---

## How I Ran Everything

I used `concurrently` to run both Next.js and the WebSocket server:

```sh
"devStart": "concurrently -n \"NEXT,EXPRESS\" -c \"blue,green\" \"next dev\" \"tsx socket-server/server.ts\""
