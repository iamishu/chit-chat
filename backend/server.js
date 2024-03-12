const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRouter = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(
  PORT,
  console.log(`server started on Port ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connect to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room::", room);
  });

  socket.on("typing", ({ room, name }) => socket.in(room).emit("typing", name));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;
    console.log("newMessage", newMessage);
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessage);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
