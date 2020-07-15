const http = require('http');
const port = '8080';

const app = http.createServer((req, res) => {
    res.write('Hello World!');
    res.end();
})

app.listen(port, function(){
    console.log(`Server is listening on port ${port}...`);
})