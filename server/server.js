const express = require("express");
const Path = require("path");
const app = express();
const port = 5555;

app.use(express.static(Path.join(__dirname, "/../build")));
app.get("/", (req, res, next) => {
  res.end();
});
app.listen(port, () =>
  console.log(`currency converter listening on por ${port}`)
);
