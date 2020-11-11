const debug = require("debug")("app");
const dbPromise = require("./db.js");

const express = require("express");
const morgan = require("morgan");
const pug = require("pug");

const app = express();

app.use(morgan("dev"));

app.use(express.static(("public")));

const makeHtml = pug.compileFile("template.pug");
app.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.send(makeHtml());
    return;
  }
  const result = await dbPromise.all(`SELECT * from dict WHERE word like ?`, [
    q,
  ]);
  result.forEach(({ translation }, idx) => {
    result[idx].translation = translation.replace(/\\n/g, "\n");
  });
  debug("Find %d matches", result.length);
  res.send(makeHtml({ q, result }));
});

app.get("/api/list", async (req, res) => {
  res.json(
    (await dbPromise.all("select word from dict")).map(({ word }) => word)
  );
});

app.get("/api/search", async (req, res) => {
  debug("Query params: %o", req.query);
  const { q, limit } = req.query;
  if (!q) {
    res.status(400).end();
    return;
  }
  const theLimit = Number(limit) || 20;
  const result = await dbPromise.all(
    `SELECT * from dict WHERE word like ? LIMIT ?`,
    [q, theLimit]
  );
  debug("Find %d matches", result.length);
  res.json(result);
});

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
