const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)

const io = require("socket.io")(server, {
	cors: {
		origin: "https://coach-meet-next.vercel.app",
		methods: [ "GET", "POST" ]
	}
})

const chatMessages = [];

app.get("/",(req,res)=>{
	res.send("Working...");
})

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	setInterval(() => {
		const promptText = "Hello from server, connection is stable!!";
		socket.emit("prompt", promptText);
	}, 30000);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser",async (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data)
	})

  	socket.on("chatMessage", (message) => {
    chatMessages.push(message);

    // Broadcast the chat message to all connected clients
    io.emit("chatMessage", message);
  });
})

server.listen(5000, () => console.log("Server is running on port 5000"));