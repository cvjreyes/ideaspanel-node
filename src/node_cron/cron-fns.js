const { calculateDaysPassed } = require("../helpers/time");
const {
  countPositiveVotes,
  checkForInactiveComitteeMembers,
} = require("../main/comittee_votes/comiitte_votes.service");
const {
  getSentToValidate,
  declineIdea,
  publishIdea,
} = require("../main/ideas/ideas.service");
const { getComitteeUsersService } = require("../main/users/users.service");

exports.checkVoting = async () => {
  const sentToValidate = await getSentToValidate();
  const comitteeMembers = await getComitteeUsersService();
  const totalComitteeMembers = comitteeMembers.length;
  for (let i = 0; i < sentToValidate.length; i++) {
    const idea = sentToValidate[i];
    const daysPassed = calculateDaysPassed(idea.sent_to_validate_at);
    const positiveVotes = await countPositiveVotes(idea.id);
    if (daysPassed > 14) {
      if (positiveVotes > totalComitteeMembers / 2) {
        publishIdea(idea.id);
      } else {
        declineIdea(idea.id);
      }
    }
    // checkForInactiveComitteeMembers(comitteeMembers, idea.id, idea.user_id);
  }
};
