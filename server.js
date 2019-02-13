const express = require('express');
require('dotenv').config();
const app = express();

//app port
const port = process.env.PORT || 5000;

//start server
const server = app.listen(port, (err) => !err ? console.log(`app pop running on port ${port}`) : console.log(err));

module.exports = server;