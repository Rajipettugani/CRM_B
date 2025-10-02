import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
//import cors from 'cors';
import connectDB from './config/db.js';
import { ensureDefaultAdmin } from './utils/setupDefaultUser.js';
import { initSocket } from './serverSocket.js';

const PORT = process.env.PORT || 8000;

const start = async () => {
  await connectDB();
  await ensureDefaultAdmin();

  // Add a root route to avoid 404 on GET /
  app.get('/', (req, res) => {
    res.send('SkyCRM backend is running!');
  });

//   app.use(cors({
//   origin: ['https://crm-f-eight.vercel.app'], // replace with your actual Vercel URL
//   credentials: true
// }));

  const server = http.createServer(app);

  //initSocket(server);
    const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://crm-f-eight.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket"]
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`SkyCRM backend listening on ${PORT}`);
  });
};

start().catch(e => {
  console.error('Failed to start server', e);
  process.exit(1);
});
// import dotenv from 'dotenv';
// dotenv.config();
// import http from 'http';
// import app from './app.js';
// import connectDB from './config/db.js';
// import { ensureDefaultAdmin } from './utils/setupDefaultUser.js';
// import { initSocket } from './serverSocket.js';

// const PORT = process.env.PORT || 8000;

// const start = async () => {
//   await connectDB();
//   await ensureDefaultAdmin();
//   const server = http.createServer(app);

//   initSocket(server);
  
//   server.listen(PORT, () => {
//     console.log(`SkyCRM backend listening on http://localhost:${PORT}`);
//   });
// };

// start().catch(e => {
//   console.error('Failed to start server', e);
//   process.exit(1);
// });
