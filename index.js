const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/database")();

const port = process.env.PORT || 3700;
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
