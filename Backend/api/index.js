const serverless = require("serverless-http");
const app = require("../app"); // import your existing Express app

module.exports = serverless(app);
