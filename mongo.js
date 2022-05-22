const mongoose = require("mongoose");

async function main() {
  console.log("corriendo la base de datos ....");
  await mongoose.connect(process.env.MONGO_URL_DB);
}

module.exports = main;
