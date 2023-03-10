require("dotenv").config();
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const app = express();

// SETTINGS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require("cors")());

// SECURITY
// for images
app.use(require("helmet")());
app.use(
  require("helmet").crossOriginResourcePolicy({ policy: "cross-origin" })
);
app.disable("x-powered-by");
app.use(require("hpp")()); // middleware to protect against HTTP Parameter Pollution attacks
// adding limiter to /user requests to stop brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after an hour",
});

// To use the rate limiting middleware to certain API calls only, you can select routes like this:
app.use("/users", apiLimiter);
// app.use(apiLimiter);

// ROUTES
app.use("/users", require("./src/main/users/users.routes"));
app.use("/ideas", require("./src/main/ideas/ideas.routes"));
app.use("/votes", require("./src/main/votes/votes.routes"));

app.use("/images", express.static("images"));

// NODE-CRON
require("./src/node_cron/cron")();

// 404 HANDLING
app.use("*", (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.error(
    `Someone with IP ${ip} tried to go to: ${req.baseUrl} but got sent an error`
  );
  res.send({ ok: false, body: "Please, stop inventing" });
});

// set port, listen for requests
app.listen(process.env.NODE_DB_PORT, () => {
  console.info(`Server is running on port: ${process.env.NODE_DB_PORT}`);
});
