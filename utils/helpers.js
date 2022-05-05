const jwt = require('jsonwebtoken');

exports.reqFilter = (reqBody, ...allowedData) => {
  let filteredData = {};
  Object.keys(reqBody).forEach(el => {
    const value = reqBody[el] ? reqBody[el] : undefined;
    allowedData.includes(el) ? filteredData[el] = value : null;
  });
  return filteredData;
}
/**
 * Method to create token and add user id to payload.
 */
exports.signToken = async (userId) => {
  return await jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};
