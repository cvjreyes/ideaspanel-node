exports.calculateDaysPassed = (date) => {
  const actualDate = new Date();
  const createdDate = new Date(date);
  const daysPassed = (
    (actualDate - createdDate) /
    1000 /
    60 /
    60 /
    24
  ).toFixed();
  return daysPassed;
};
