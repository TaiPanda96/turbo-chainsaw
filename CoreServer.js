// URI Configuration
require('dotenv').config();

// Main Imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// Define Express App + Port #
const app = express();
const port = process.env.PORT || 3000;

// Launch Express App
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, auth-token, Authorization, stripe-signature, APPS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    return next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));

// Error Logging
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

// DocumentDB Connection
const uri = process.env.AWS_URI;
console.log(uri)
try {
    mongoose.connect(uri,  {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }, () =>
       console.log("DocumentDB Connection Established!"));
 } catch (error) {
    console.log("could not connect");
 }

 app.get('/', (req, res) => {
    res.send(`Welcome to tai's server running on port: ${port}`);
  });

// Listen to LocalHost:5000/
var server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


