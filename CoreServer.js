// Main Imports
const express = require("express");

// Define Express App + Port #
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;

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

// Listen to LocalHost:5000/
var server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
