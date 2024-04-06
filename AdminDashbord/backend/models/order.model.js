const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    purchasedDate: Date,
  },

 
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
