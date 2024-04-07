const { PORT } = require("../config/config");
const mongodb = require("./db/mongoose");
const app = require("./app");

mongodb.connectDB(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
