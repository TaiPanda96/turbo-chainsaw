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
    //let dbURI      = 'mongodb://utradeaProduction:sttMTL111519@utradea-production-historical.cluster-cfy17jkuwodi.us-east-2a.docdb.amazonaws.com:27017/utradea-production-historical?tls=true&retryWrites=false&authSource=admin'
    const filePath = path.join(__dirname, 'rds-combined-ca-bundle.pem')
    mongoose.connect(process.env.AWS_URI, {
        ssl             : true,
        sslValidate     : false,
        useUnifiedTopology: true,
        useNewUrlParser : true,
        useCreateIndex  : true,
        useFindAndModify: false,
        sslCA: filePath
    });
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("DocumentDB Connection Established");
    }).catch(err => console.log(err.reason, err.type));
    console.log(mongoose.connection.client.topology.s.servers);

} else {
    const uri = process.env.ATLAS_URI
    // MongoDB Connection
    mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
    )
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB Connection Established");
    }).catch(err => console.log(err));
}

 app.get('/', (req, res) => {
    res.send(`Welcome to tai's server running on port: ${port}`);
  });

// Listen to LocalHost:5000/
var server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

