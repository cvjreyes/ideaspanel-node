const cron = require("node-cron");
const { checkForExpiredIdeas, checkForIdeasToPublish } = require("./cron-fns");

const cronFn = () => {
  // cron.schedule("* * * * *", () => {
  cron.schedule("* * 23 * 1-5", () => {
    checkForIdeasToPublish();
    // checkForExpiredIdeas();
    console.info(
      new Date(Date.now()).toLocaleDateString(),
      new Date(Date.now()).toLocaleTimeString(),
      "Checked ideas for approved/rejected"
    );
  });
};

module.exports = () => {
  cronFn();
};
