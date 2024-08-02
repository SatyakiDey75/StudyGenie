const express = require('express');
const server = express();
const cors = require('cors');
const mongocon = require('./mongocon');
const user = require("./routes/User");
const chat = require("./routes/Chats");

require('dotenv/config');

const PORT = 8081;

const allowedOrigins = ["/*","http://localhost:5173", "http://35.202.78.159", "https://studygenie-cf.vercel.app"];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"]
};

mongocon();  


server.use(express.json());
server.use(cors(corsOptions)); 

server.get("/", (req, res) => {
    res.send("CodeFusers Extracto Server started");
});

server.listen(PORT, () => {
    console.log("Server started successfully at ", PORT);
});

// Routes
server.use("/api/users", user.router);
server.use("/api/chats", chat.router); 
