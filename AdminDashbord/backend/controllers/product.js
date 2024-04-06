const productModel = require("../models/product.model");
const category = require("../models/category.model")
const Product = {
  addProduct: async (req, res) => {
    try {
      const newProduct = new productModel(req.body);
      const saveProduct = await newProduct.save();
      if (req.body.category) {
        const cate = await category.findOne({ name: req.body.category });

        if (cate) {
          await cate.updateOne({ $push: { listIdProduct: saveProduct._id } });
        } else {
          console.log("Danh mục không tồn tại.");
        }
      }
      return res.status(200).json(saveProduct);
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  },

  getAllProduct: async (req, res) => {
    try {
      const products = await productModel.find().exec();
      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await productModel.findOne({ idProduct: req.params.idProduct })
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      await category.updateMany({ listIdProduct: product._id }, { $pull: { listIdProduct: product._id } })
      await product.remove();
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const Product = await productModel.findOne({ idProduct: req.body.idProduct });
      if (!Product) {

        return res.status(404).json({ error: "Product not found" });
      }
      Product.details = req.body.details,
        Product.name = req.body.name,
        Product.price = req.body.price,
        Product.quantity = req.body.quantity,
        Product.image = req.body.image,
        Product.listImgExtra = req.body.listImgExtra
      Product.pricesale = req.body.pricesale
      try {
        if (req.body.category) {
          const cate = await category.findOne({ name: req.body.category });

          if (cate) {

            await category.updateOne(
              { _id: cate._id },
              { $addToSet: { listIdProduct: Product._id } }
            );
            Product.category = req.body.category
            await category.updateMany(
              { _id: { $ne: cate._id }, listIdProduct: Product._id },
              { $pull: { listIdProduct: Product._id } }
            );
          } else {

            console.log("Danh mục không tồn tại.");
          }

        }
      } catch (error) {
        console.error(error);

      }


      await Product.save();
      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

};

module.exports = Product;
