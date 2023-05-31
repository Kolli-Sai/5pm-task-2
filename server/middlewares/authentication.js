const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        msg: "Aurherization revoked",
      });
    }
    let token = authHeader.split(" ")[1];
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    res.json({
      error,
    });
  }
};

module.exports = { authentication };
