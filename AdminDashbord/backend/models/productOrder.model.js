const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductOrderSchema = new Schema(
  {
    idProduct: { type: Schema.Types.String },
    quantity: { type: Schema.Types.Number },
    name: { type: Schema.Types.String },
    image: { type: Schema.Types.String },
    unitPrice: { type: Schema.Types.Number },
  },

  {collection :"product-order"}
);

module.exports = mongoose.model("ProductOrder", ProductOrderSchema);

