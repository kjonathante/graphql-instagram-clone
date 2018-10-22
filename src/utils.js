var jwt = require("jsonwebtoken");

function getUserId(context) {
  var Authorization = context.token;
  if (Authorization) {
    var token = Authorization.replace("Bearer ", "");
    var user = jwt.verify(token, "secret");
    return user.userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  getUserId
};
