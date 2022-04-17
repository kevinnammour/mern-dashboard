// cors is used to allow making requests from one 
// website to another website in the browser


const cors = require("cors");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const connect = require('./config/connectDB');
const { PORT } = require('./config/loadEnv');

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
});

app.use(errorHandler);