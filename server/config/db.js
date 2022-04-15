const mongoose = require("mongoose");

module.exports = connect = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Atlas connected successfully");
};