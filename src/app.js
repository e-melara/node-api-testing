require('dotenv').config();

const fs = require('fs');
const cors = require('cors');
const express = require('express');
const { errors } = require('celebrate');

const main = require('./mongo');
const app = express();

app.use(cors());
app.use(express.json());

const dirRoutes = `${__dirname}/routes`;
fs.readdirSync(dirRoutes).forEach(file => {
	const nameFile = file.split('.')[0];
	app.use(require(`${dirRoutes}/${nameFile}`));
});

// Celebrate library error handler
app.use(errors());

main().catch(err => {
	console.log(err);
});

module.exports = app;
