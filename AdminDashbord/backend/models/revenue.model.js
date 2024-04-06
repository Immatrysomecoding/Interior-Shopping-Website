const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RevenueSchema = new Schema(
  {
    name:{type:String},
    sale: {type:Number,default:0},
    total: {type:Number,default:0},
    order: {type:Number,default:0},
  },
  
  {collection :"revenue"}
);

const Revenue = mongoose.model("Revenue", RevenueSchema);
module.exports = Revenue
