const dbPromise = require("./db");

afterAll(() => {
  dbPromise.db.close();
});

// wc -l ecdict.csv
//   770612 ecdict.csv
test("数据库有 770611 条记录", async () => {
  const { count } = await dbPromise.get("select count(*) as count from dict");
  expect(count).toBe(770611);
});

test("可以查到 hello", async () => {
  const result = await dbPromise.get("select * from dict where word = 'hello'");
  expect(result).toBeDefined();
});
