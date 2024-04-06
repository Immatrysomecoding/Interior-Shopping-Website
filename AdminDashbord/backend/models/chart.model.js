const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Chart = new Schema(
  {
revenue:{type :Number,default:0},
sale: { type: Number, default: 1 },
  },
  {timestamps:true},
  {collection :"Chart"}
  
);
const ChartOrder = mongoose.model("Chart", Chart);
module.exports =ChartOrder
