const mongoose = require("mongoose");

module.exports = connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Atlas connected successfully");
};