const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const jwtValidator = require("./middlewares/jwtValidator");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/connectDB");
const credsHandler = require("./middlewares/credsHandler");

const PORT = process.env.PORT;
const app = express();

app.use(credsHandler);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/crm", require("./routes/login"));
app.use("/crm", require("./routes/refresh"));
app.use("/crm", require("./routes/logout"));

// This middleware should be place before protected routes only.
app.use(jwtValidator);

app.use("/crm/branches", require("./routes/crmUsers"));

app.use(errorHandler);

// Making sure the DB connection is successful before connecting to the PORT
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("MongoDB Atlas connection failed.");
  });