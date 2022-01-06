// URI Configuration
require('dotenv').config();

// Main Imports
const fs = require("fs");
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

// DocumentDB Connection
if (process.env.INFRASTRUCTURE === "AWS") {
    const path = require('path');
    const fs   = require("fs")
    const filePath = path.join(__dirname, 'rds-combined-ca-bundle.pem');
    mongoose.connect(process.env.AWS_URI,
        {
            ssl             :   true,
            sslValidate     :   false,
            sslCA: filePath
        },
        async (err) => {
            if(err) {
                console.log(err);
            } else {
                console.log('DocumentDB Connection Established');
            }
        });
}

 app.get('/', (req, res) => {
    res.send(`Welcome to tai's server running on port: ${port}`);
  });

// Listen to LocalHost:5000/
var server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

