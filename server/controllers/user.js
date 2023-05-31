const { User } = require("../models/User");

const getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId }).select("-password");
    res.json(user);
  } catch (error) {
    res.json({ error });
  }
};

module.exports = { getUser };
