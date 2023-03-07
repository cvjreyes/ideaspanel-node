const cron = require("node-cron");
const { checkDateFromIdeasValidate, ideasPublished } = require("./ideas");

const cronFn = () => {
  cron.schedule("* * 23 * *", () => {
    checkDateFromIdeasValidate();
    ideasPublished();
    console.log(
      new Date(Date.now()).toLocaleDateString(),
      new Date(Date.now()).toLocaleTimeString(),
      "Idea checked date"
    );
  });
};

module.exports = () => {
  cronFn();
};
