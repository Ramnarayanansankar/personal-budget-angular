const cors = require('cors');
const port = 3000;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(cors());

app.use('/',express.static('public'));

app.get('/myBudget', (req, res) => { 
    let rawdata = fs.readFileSync('myBudget.json');
    let myBudget = JSON.parse(rawdata);
    res.json(myBudget);
});

app.listen(port, () => {
    console.log(`App Served at http://localhost:${port}`);
});



