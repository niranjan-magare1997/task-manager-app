const mongoose = require("mongoose");
const { MONGO_URI } = require("../../config/config");

async function connectDB(cb) {
  await mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true /* ,
        "useCreateIndex": true */,
    })
    .then(() => {
      console.log("Connected to MONGODB.!");
      cb && cb();
    });
}

module.exports = {
  connectDB,
};
