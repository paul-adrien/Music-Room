const http = require('http');
const app = require('./app');
const messaging_controller = require("./controllers/messaging-controller");

app.set('port', 8080);

const server = http.createServer(app);
const options = {
    cors: {
        origin: 'http://localhost:8100',
        methods: ["GET", "POST"],
        credentials: true,
        allowEIO3: true
    },
};
const io = require('socket.io')(server, options);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + 8080;
    console.log('Listening on ' + bind);
});

app.get('/test-socket', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (data) => {
        console.log(data);
        messaging_controller.sendMessage(data.userId, data.convId, data.message);
        io.emit('chat message', data.message);
    });
});

server.listen(8080, () => {
    console.log(`Server is running on port 8080.`);
});