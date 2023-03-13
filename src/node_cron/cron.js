const cron = require("node-cron");
const {
  checkForExpiredIdeas,
  checkForIdeasToPublish,
  checkForInactiveComiteeMembers,
  checkVoting,
} = require("./cron-fns");

const cronFn = () => {
  // cron.schedule("* * * * *", () => {
  cron.schedule("* * 23 * 1-5", () => {
    checkVoting();
  });
};

module.exports = () => {
  cronFn();
};
