const cors = require("cors");
const express = require("express");
const cookieParser = require('cookie-parser');
const errorHandler = require("./middlewares/errorHandler");
const checkJWT = require("./middlewares/checkJWT");
const corsOptions = require("./config/corsOptions");
const connect = require("./config/connectDB");
require("dotenv").config();

// const Admin = require('./models/Admin');
// const bcrypt = require('bcrypt');

const PORT = process.env.PORT;

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/auth", require("./routes/refresh"));
app.use("/auth", require("./routes/logout"));

app.use(checkJWT);
app.use("/protected", require("./routes/crmUsers"));

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
});


// bcrypt.hash('Kevin26owen5@', 12).then(hash => {
//   const user = new Admin({
//     username: 'splinter@ninjaco.admin',
//     password: hash,
//   });
//   user.save();
// });