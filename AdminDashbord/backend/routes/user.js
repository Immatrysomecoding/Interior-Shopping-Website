const userController = require("../controllers/userController");
const user = require("../controllers/user")
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);
router.get("/account",user.getAll)
router.delete("/account/:id",user.deleteAccount);
router.post("/account/update",user.updateAccount)
router.post("/account/block",verifyToken,user.blocked)
//DELETE USER
router.delete("/:id", verifyToken,userController.deleteUser);
//UPDATE EMAIL
router.post("/UpdateEmail",verifyToken,userController.updateEmail)
router.post("/UpdatePassword",verifyToken,userController. updatePassword)

module.exports = router;