const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("ecdict.sqlite");

const dbPromise = {
  db,
};

const promisify = (fun) => {
  return (query, params) => {
    return new Promise((resolve, reject) => {
      fun.bind(db)(query, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };
};

dbPromise.get = promisify(db.get);
dbPromise.all = promisify(db.all);

module.exports = dbPromise;
