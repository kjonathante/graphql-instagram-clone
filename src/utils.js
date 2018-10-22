const jwt = require("jsonwebtoken");

function getUserId(context) {
  const Authorization = context.token;
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const user = jwt.verify(token, "secret");
    return user.userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  getUserId
};
