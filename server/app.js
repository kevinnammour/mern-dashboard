// cors is used to allow making requests from one 
// website to another website in the browser
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const connect = require('./config/db');
const { PORT } = require('./config/env');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/auth', require('./routes/users'));

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
});