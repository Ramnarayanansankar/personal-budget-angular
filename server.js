
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use('/', express.static('public'));


app.get('/hello', (req, res) => {
    res.send('Hello world!');
});

app.get('/myBudget', (req, res) => { 
    let rawdata = fs.readFileSync('myBudget.json');
    let myBudget = JSON.parse(rawdata);
    res.json(myBudget);
});

app.listen(port, () => {
    console.log('Example app Listening at http://localhost:${port}');
});



