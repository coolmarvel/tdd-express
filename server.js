const express = require("express");
const port = 3000;
const app = express();
require("dotenv").config();

const mongoose = require("mongoose");

const { MONGO_USER, MONGO_PASS } = process.env;

mongoose
  .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@nodejs-jest.pupt9ui.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => console.log("MongoDB Connected..."))
  .catch((error) => console.error(error));

app.use(express.json());

app.use("/api/products", require("./routes"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: error.message });
});

app.listen(port);
console.log(`Running on port ${port}`);
