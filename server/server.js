const http = require('http');
const app = require('./app');

app.set('port', 8080);

const server = http.createServer(app);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + 8080;
    console.log('Listening on ' + bind);
});

server.listen(8080, () => {
    console.log(`Server is running on port 8080.`);
});