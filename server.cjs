// This script checks if your MongoDB is alive on your computer
const net = require('net');//pendrieve
const client = new net.Socket();
const port = 27017; // The default MongoDB port
const host = '127.0.0.1';

client.connect(port, host, function() {
  
    console.log("Your are connected to the mongodb database.");
  
    process.exit();
});

client.on('error', function(err) {
    console.log(" ERROR: MongoDB is not running yet.");
    console.log("Please open MongoDB Compass and click Connect first.");
    process.exit();
});