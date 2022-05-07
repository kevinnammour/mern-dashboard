const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

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

app.use("/crm", require("./routes/auth"));
app.use("/invoices", require("./routes/invoices"));
app.use("/branches", require("./routes/branches"));
app.use("/students", require("./routes/students"));
app.use("/inquiries", require("./routes/inquiries"));
app.use("/analytics", require("./routes/analytics"));
app.use("/attendances", require("./routes/attendances"));

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("MongoDB Atlas connection failed.");
  });