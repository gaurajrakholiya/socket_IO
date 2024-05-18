const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors')

const app = express();
const server = http.createServer(app);
const io = new Server(server ,{
  cors:{
    origin:"http://localhost:3000",
    methods:['GET','POST'], 
    credentials: true ,
  }
});

// app.use(express.static(path.resolve("../front/public")));
app.use(cors())

// app.get("/", (req, res) => {
//   return res.sendFile("../front/public/index.html");
// }); 

app.get("/", (req, res) => {
    res.send("hello world!!");
}); 

const user = false

io.use((socket , next) => {
  if(user) next();
})

// on will be receiver
// emit will be sender
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on("message", ({room ,message})=>{
      console.log({room ,message})
      io.to(room).emit("receive-message", message )
    })

    socket.on("join-room", (room)=>{
      socket.join(room);
    console.log(`User joined room ${room}`);
    })
    
    socket.on("disconnect",()=>{
      console.log("user disconnected", socket.id)
    })
 });

server.listen(8000, () => {
  console.log("server running at 8000");
});  

