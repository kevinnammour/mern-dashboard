const express = require("express");
// cors is used to allow making requests from one 
// website to another website in the browser
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT;
const connect = require('./config/db');
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/ninjaco', require('./controllers/auth'));

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost/${PORT}`);
  });
});