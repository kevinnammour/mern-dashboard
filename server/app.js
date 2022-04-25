// cors is used to allow making requests from one
// website to another website in the browser

const cors = require("cors");
const express = require("express");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middlewares/errorHandler");
const connect = require("./config/connectDB");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(errorHandler);

// Routes
app.use("/protected", require("./routes/crmUsers"));
app.use("/auth", require("./routes/auth"));

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
});