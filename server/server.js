const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { urlNotFound, errorHandler } = require("./middlewares/errorMiddlewares");

require("colors");
require("dotenv").config();
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Our API is running successfully!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(urlNotFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server started on https://localhost:${port}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://full-stack-messaging-app.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (user) => {
    socket.join(user._id);
    console.log(`User login: ${user.name}`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User join: ${room}`);
  });

  socket.on("typing", (x) => socket.in(x.room).emit("typing", x.user));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (message) => {
    var chat = message.chat;
    if (!chat.users) {
      return console.log("Error: chat.users not defined!");
    }
    chat.users.forEach((user) => {
      if (user._id == message.sender._id) {
        return;
      }
      console.log(`${user.name} recieved ${message.content}`);
      socket.in(user._id).emit("message recieved", message);
    });
  });

  socket.on("leave chat", (room) => socket.leave(room));

  socket.off("setup", (user) => {
    socket.leave(user._id);
    console.log("User disconnected");
  });
});
