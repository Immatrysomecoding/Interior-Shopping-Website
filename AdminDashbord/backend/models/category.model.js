const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: { type: String, unique: true },
    idCategory: {type: String,unique: true},
    image: String,
    listIdProduct: [{ type: mongoose.Schema.Types.ObjectId ,ref: 'Product'}],
  },
  {collection :"category"}
 
);
CategorySchema.index({ idCategory: 1 }, { unique: false });
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
