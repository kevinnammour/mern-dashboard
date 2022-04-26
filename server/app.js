const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const checkJWT = require("./middlewares/checkJWT");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/connectDB");
const handleCreds = require("./middlewares/handleCreds");

const PORT = process.env.PORT;
const app = express();

app.use(handleCreds);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/crm", require("./routes/auth"));
app.use("/crm", require("./routes/refresh"));
app.use("/crm", require("./routes/logout"));

// This middleware should be place before protected routes only.
app.use(checkJWT);

app.use("/crm/students", require("./routes/crmUsers"));

app.use(errorHandler);

// Making sure the DB connection is successful before connecting to the PORT
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log('MongoDB Atlas connection failed.');
  });
