const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.DB_CONNECTION_STRING;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function mongoConnect() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error occurred while connecting to MongoDB:", err);
    throw err;
  }
}

async function mongoDisconnect() {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB!");
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
