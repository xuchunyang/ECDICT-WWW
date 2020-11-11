const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("ecdict.sqlite");

const dbPromise = {
  db,
};

dbPromise.get = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

module.exports = dbPromise;
