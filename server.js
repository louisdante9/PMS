const express = require('express');
require('dotenv').config();
require('./models/db');
const app = express();

//app port
const port = process.env.PORT || 5000;
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");//Allow all domains to access the api
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token"); //Headers allowed ina request
    if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE"); //Methods allowed
      return res.status(200).json({});
    }
    else {
      next()
    }
  });
//start server
const server = app.listen(port, (err) => !err ? console.log(`app pop running on port ${port}`) : console.log(err));

module.exports = server;