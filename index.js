const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = 8080;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post('/webhook', (req, res) => { 
    console.log(req.body.events[0].type ,req.body.events[0].source.userId,req.body.events[0].beacon.hwid)
    res.send('Hello B');
});
app.get('/', (req, res) => {
    
    return res.send({ 
        error: false, 
        message: 'Welcome to RESTful'
    })
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});