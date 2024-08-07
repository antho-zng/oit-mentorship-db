const User = require("../../db/models/User");

const requireUserToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = await User.findByToken(token);
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { requireUserToken };
