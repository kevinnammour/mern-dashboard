const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const connect = require('./config/db');
const app = express();

const PORT = process.env.PORT;

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost/${PORT}`);
  });
});