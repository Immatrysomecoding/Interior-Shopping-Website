const productModel = require("../models/product.model");
const Category = require("../models/category.model")
const CategoryContrller = {
  addCategory: async (req, res) => {
    try {
      const newCategory = new Category(req.body)
      const saveCategory = await newCategory.save();
      return res.status(200).json(saveCategory)
    } catch (err) {
      return res.status(500).json(err)
    }
  },

  getAllCategory: async (req, res) => {
    try {
      const allcate = await Category.find().populate('listIdProduct');
      return res.status(200).json(allcate);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  editCategory: async (req, res) => {
    try {
      const cate = await Category.findOne({ idCategory: req.body.idCategory });
      if (!cate) {
        return res.status(404).json("Không tìm thấy danh mục");
      }
      const category = {
        name: req.body.name,
        image: req.body.image,
        listIdProduct: req.body.listIdProduct,
      }
      await Promise.all(cate.listIdProduct.map(async (item) => {
        await productModel.updateOne(
          { _id: item },
          { category: cate.name }
        );
      }));
      await Category.updateMany(
        { idCategory: req.body.idCategory },
        { $set: category }
      )
      return res.status(200).json("Đã cập nhật thành công");
    } catch (err) {
      console.error(err);
      return res.status(500).json("Đã xảy ra lỗi trong quá trình xử lý");
    }
  }
  ,


  deleteProductCategory: async (req, res) => {
    try {
      const product = await findOne({ idProduct: req.params.idProduct });

      if (product) {
        await Category.updateMany(
          { listIdProduct: product._id },
          { $pull: { listIdProduct: product._id } }
        );
        await productModel.updateOne(
          { _id: product._id },
          { $set: { category: "Trống" } }
        );

        return res.status(200).json({ message: "Product category set to null successfully" });
      } else {
        return res.status(404).json({ error: "Product not found" });
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },




  deleteCategory: async (req, res) => {
    try {
      cate = await Category.findOne({ idCategory: req.params.idCategory });
      if (!cate) {
        return res.status(404).json({ message: 'Danh mục không tồn tại.' });
      }
      await productModel.updateMany({ category: cate.name }, { category: "Trống" })
      await cate.remove();
      return res.status(200).json("Xóa danh mục thành công")
    } catch (err) {

      return res.status(500).json(err)

    }
  }
}
module.exports = CategoryContrller;