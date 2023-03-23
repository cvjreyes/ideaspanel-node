const cron = require("node-cron");
const { checkVoting } = require("./cron-fns");

const cronFn = () => {
  // cron.schedule("* * * * *", () => {
  cron.schedule("0 23 * * 1-5", () => {
    checkVoting();
    console.info(
      new Date(Date.now()).toLocaleDateString(),
      new Date(Date.now()).toLocaleTimeString(),
      "Voting checked"
    );
  });
};

module.exports = () => {
  cronFn();
};
