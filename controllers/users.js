const { Users } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRETKEY = "JWTSECRET";

module.exports.signUp = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const validuser = await Users.findOne({ username: username });
    if (!validuser) {
      const user = new Users({
        username,
        password: hash,
        role,
      });
      await user.save();

      const token = jwt.sign(
        { username: user.username, id: user._id, role: user.role },
        SECRETKEY
      );
      res.cookie("jwt", token, { httpOnly: true });
      console.log("user saved");
      res.end();
    } else {
      res.send("user already exists");
    }
  } catch (err) {
    console.error(err);
  }
};
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username: username });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = jwt.sign(
          { username: user.username, id: user._id, role: user.role },
          SECRETKEY
        );
        res.cookie("jwt", token, { httpOnly: true });
        console.log("logged in");
        res.send("logged in");
        res.end();
      } else {
        res.send("incorrect password or user");
      }
    } else {
      res.send("incorrect user or password");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.send("Logged out");
};
