import { config } from "dotenv";

import cors from "cors";
import express from "express";

import main from "./mongo.js";

config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Mundo !!");
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

export default app;
