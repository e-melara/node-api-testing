const mongoose = require("mongoose");

const { MONGO_URL_DB, MONGO_URL_DB_TEST, NODE_ENV } = process.env;

async function main() {
  await mongoose.connect(NODE_ENV === 'test' ? MONGO_URL_DB_TEST : MONGO_URL_DB);
}

module.exports = main;
