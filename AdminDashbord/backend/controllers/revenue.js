const revenueModel = require("../models/revenue.model");
const chartModel = require("../models/chart.model")
const Revenue = {
    getRevenue: async (req, res) => {
        try {
            const revenue = await revenueModel.find();
            if (!revenue) {
                return res.status(404).json("không tìm thấy doanh thu")
            }
            return res.status(200).json(revenue)
        } catch (err) {
            return res.status(500).json("server error")
        }
    },
    getChart: async (req, res) => {
        try {
            const chart = await chartModel.find();
            if (!chart) {
                return res.status(404).json("không tìm thấy doanh thu")
            }
            return res.status(200).json(chart)
        } catch (err) {
            return res.status(500).json("server error")
        }
    },
}

module.exports = Revenue;