const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: String,
    details: String,
    quantity: Number,
    price: Number,
    pricesale:Number,
    image: String,
    listImgExtra: [],
    category: String,
    producer: String,
    idProduct:{type: String,unique: true,maxlength:255},
    listIdRating: [{ type: Schema.Types.ObjectId }],
    url: String,
   
  },
  {collection :"product"}
  
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
