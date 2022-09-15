const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const port = 3200;
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

var userList = [];

const rest = [
    { "id": 1, "name": "truc1" },
    { "id": 2, "name": "truc2" },
    { "id": 3, "name": "truc3" }
]

function removeUser(arr, item) {
    for (var i = arr.length; i--;) {
        if (arr[i].socket === item) arr.splice(i, 1);
    }
}

app.use(express.urlencoded())
app.use(express.json())


app.get("/", (req, res) => {

    //res.status(200).send()
    res.sendStatus(200)
})

app.get("/rest", (req, res) => { //get all item request
    res.status(200).send(rest)
})

app.get("/rest/:id", (req, res) => { //get specific item request

    // res.status(200).send({ "data": { status: 200, data: 'OK' } })
    const data = rest.find(item => item.id === parseInt(req.params.id))
    if (data) {
        res.status(200).send(data)
    } else {
        res.sendStatus(404)
    }
})

app.post("/rest/add", (req, res) => { //add new item request
    rest.push({
        id: rest.length + 1,
        name: req.body.name
    })
    res.status(200).send({ "status": 200, "data": rest })
})

app.put("/rest/update", (req, res) => { //update exits item request 
    const data = rest.find(item => item.name === req.body.oldName)
    if (data) {
        data.name = req.body.newName
        res.status(200).send(rest)
    } else {
        res.sendStatus(404)
    }
})

app.delete("/rest/delete", (req, res) => { //delete specific item request
    const data = rest.find(item => item.name === req.body.name)
    if (data) {
        rest.splice(rest.indexOf(data), 1)
        res.status(200).send(rest)
    } else {
        res.sendStatus(404)
    }
})

io.on("connection", (socket) => {

    //  io.sockets.emit("user-connect", socket.id)
    // console.log(socket.id)

    socket.emit("Welcome", "Hello " + socket.id)

    socket.on("user-connected", (data) => {
        userList.push({
            socket: socket.id,
            name: data.name,
            key: data.PublicKey
        })
        io.sockets.emit("userList", userList)
    })

    socket.on("send-msg", (data) => {
        socket.to(data.to).emit("new-msg", data)
        console.log(data)
    })

    socket.on("disconnect", () => {
        removeUser(userList, socket.id)
        socket.broadcast.emit("userList", userList)
    })
});

httpServer.listen(port, () => {
    console.log("Server running on port: " + port)
});