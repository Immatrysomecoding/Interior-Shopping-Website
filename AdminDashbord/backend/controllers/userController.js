const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const userController = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "2m" }
    );
  },
  //GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //DELETE USER
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      return res.status(200).json("Delete successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  },


  updateEmail: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Error");
      }
      if (user.email === req.body.email) {
        return res.status(404).json("please change email");
      }
      if (user.email !== req.body.email) {
        user.email = req.body.email;
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
          token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
          const url = `http://localhost:3000/users/${user._id}/verify/${token.token}`;
          try {
            await sendEmail(user.email, "Verify Email", url);
            await User.updateOne(
              { _id: user._id },
              { verified: false }
            )
          } catch (err) {
            console.log(err);
          }
        }
        const accessToken = userController.generateAccessToken(user);
        await user.save();
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json(err);

    }
  },
  updatePassword: async (req, res) => {
    try {

      const user = await User.findOne({ username: req.body.username });
      console.log(req.body)
      if (!user) {
        return res.status(404).json("Error");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        console.log("wrong password")
        return res.status(404).json("wrong password");
      }
      if (req.body.newpassword === req.body.password) {
        console.log("please change password")
        return res.status(404).json("please change password");
      }
      if (validPassword && req.body.newpassword !== req.body.oldpassword) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.newpassword, salt);

        user.password = hashed;

        await user.save();
        return res.status(200).json(user);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },


}

module.exports = userController;