require("dotenv").config();

const fs = require("fs");
const cors = require("cors");
const express = require("express");

const main = require("./mongo");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Mundo !!");
});

const dirRoutes = `${__dirname}/src/routes`;
fs.readdirSync(dirRoutes).forEach((file) => {
  const nameFile = file.split(".")[0];
  app.use(require(`${dirRoutes}/${nameFile}`));
});

main()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Corriendo el servidor en el puerto, ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
