
const productOrder = require("../models/productOrder.model");
const shoppingcart = require("../models/shoppingcart.model");
const checkout = require("../models/checkout.model")
const userModel = require("../models/user.model");
const revenue = require("../models/revenue.model");
const chartModel = require("../models/chart.model")
const ProductOrder = {
    getProductOrder: async (id) => {
        try {
            const order = await productOrder.findById(id);

            if (!order) {
                throw new Error(`ProductOrder not found with ID ${id}`);
            }

            if (order.pricesale !== 0) {

                order.price = order.pricesale;
            }

            return order;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },



    getShoppingCart: async (id) => {
        try {

            const shopping = await shoppingcart.findById(id);
            if (!shopping) {

                return { time: null, allProducts: [] };
            }

            const time = shopping.purchasedTime;
            const arr = shopping.listProductOrder;

            const allProducts = await Promise.all(arr.map(item => ProductOrder.getProductOrder(item)));

            return { time, allProducts };
        } catch (err) {
            return { time: null, allProducts: [] };
        }
    },

    getAllCheckout: async (req, res) => {
        try {
            const checks = await checkout.find();

            const checksWithAllProducts = await Promise.all(checks.map(async (check) => {
                try {
                    const { idShoppingCart, ...others } = check._doc;
                    let name = "";
                    let address = "";
                    try {
                        const user = await userModel.findOne({ email: check.email });
                        if (user) {
                            name = user.name;
                            address = user.address;
                        }
                    } catch (error) {

                    }
                    const price = 0;
                    const allProducts = await ProductOrder.getShoppingCart(idShoppingCart);
                    others.time = allProducts.time;
                    others.price = price;
                    return {
                        name,
                        address,
                        ...others,
                        products: allProducts.allProducts,
                    };
                } catch (err) {
                    throw err;
                }
            }));

            return res.status(200).json(checksWithAllProducts);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    CheckOutYes: async (req, res) => {
        try {
            const checkoutedit = await checkout.findById(req.params.id);
            if (!checkoutedit) {
                return res.status(404).json({ error: "Account not found" });
            }
            checkoutedit.status = "Delivering";
            await checkoutedit.save();
            const newChart = await new chartModel({
                revenue: req.body.total
            })
            await newChart.save()
            const user = await userModel.findOne({ email: req.body.email });
            if (user) {
                const currentTotal = user.total;
                const newTotal = currentTotal + req.body.total;
                await userModel.updateOne(
                    { email: req.body.email },
                    { $set: { total: newTotal } }
                );
            }
            const reven = await revenue.findOne()
            if (reven) {
                const SaleTotal = reven.total;
                const newSaleTotal = SaleTotal + req.body.total;
                const Sales = reven.sale;
                const newSale = Sales + 1;
                await revenue.updateOne(
                    {},
                    {
                        total: newSaleTotal,
                        sale: newSale
                    }
                )
            }
            res.status(200).json({ message: "Account deleted successfully" });
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: "Internal server error" });
        }
    },
    CheckOutNo: async (req, res) => {
        try {
            const checkoutedit = await checkout.findById(req.params.id);
            if (!checkoutedit) {

                return res.status(404).json({ error: "Account not found" });
            }
            checkoutedit.status = "Canceled";
            await checkoutedit.save();
            res.status(200).json({ message: "Account deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    },
}

module.exports = ProductOrder;
