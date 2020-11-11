const dbPromise = require("./db.js");

const express = require("express");
const app = express();

app.get("/api/word/:word", async (req, res) => {
  const word = req.params.word;
  const result = await dbPromise.get(`SELECT * FROM dict WHERE word = ?`, [
    word,
  ]);
  if (!result) {
    res.status(404).end();
    return;
  }
  res.status(200).json(result);
});

app.listen(3000, () => {
  console.log("Listening at http://localhost:3000/");
});
