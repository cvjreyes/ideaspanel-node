const dotenv = require("dotenv");
dotenv.config();

exports.generateLink = (page, id, token) => {
  return `${process.env.NODE_CLIENT_URL}/${page}/${id}/${token}`;
};
