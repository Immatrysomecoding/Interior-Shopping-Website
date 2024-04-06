const user = require("../models/user.model");

const userAccount = {
  getAll: async (req, res) => {
    try {
      const accounts = await user.find();
      res.status(200).json(accounts);

    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const deletedAccount = await user.findByIdAndRemove(req.params.id);
      if (!deletedAccount) {
        console.log(req.params.id);
        return res.status(404).json({ error: "Account not found" });
      }
      res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateAccount: async (req, res) => {
    try {
      const account = await user.findById(req.body._id);
      if (!account) {

        return res.status(404).json({ error: "Account not found" });
      }
      account.email = req.body.email;
      account.name = req.body.name;
      account.address = req.body.address;
      await account.save();
      res.status(200).json({ message: "Account updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  blocked: async (req, res) => {
    try {
      await user.updateOne(
        { _id: req._id },
        { isBlocked: req.isBlocked }
      )
      return res.status(200).json({ error: "Block or unblock susess" });
    }
    catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = userAccount;
