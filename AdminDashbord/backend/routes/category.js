const router = require("express").Router();
const category = require("../controllers/category")
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

router.get("/allcategory", category.getAllCategory);
router.post("/addcategory", verifyToken, category.addCategory);
router.post("/updatecategory", verifyToken, category.editCategory);
router.delete("/category/:idCategory", category.deleteCategory);
router.delete("/categoryproduct/:idProduct", category.deleteProductCategory);
module.exports = router;
