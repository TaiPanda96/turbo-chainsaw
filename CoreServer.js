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

    var MongoClient = require('mongodb').MongoClient

    // Create a MongoDB client, open a connection to DocDB; as a replica set,
    // and specify the read preference as secondary preferred

    var client = MongoClient.connect(
     'mongodb://localhost:27017/utradea-test-docdb2',
    {
    tlsCAFile: `rds-combined-ca-bundle.pem`, //Specify the DocDB; cert
    tlsAllowInvalidHostnames: true,
    auth: {
        username:'lintai',
        password: 'Panda9686'
    },
    },
    function(err, client) {
        if(err)
            throw err;

        //Specify the database to be used
        db = client.db('sample-database');

        //Specify the collection to be used
        col = db.collection('sample-collection');

        //Insert a single document
        col.insertOne({'hello':'Amazon DocumentDB'}, function(err, result){
        //Find the document that was previously written
        col.findOne({'hello':'DocDB;'}, function(err, result){
            //Print the result to the screen
            console.log(result);

            //Close the connection
            client.close()
        });
    });
});
}
// Listen to LocalHost:5000/
var server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

