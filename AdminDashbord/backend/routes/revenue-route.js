const revenue = require("../controllers/revenue");
const router = require("express").Router();

router.get("/revenue", revenue.getRevenue);
router.get("/chart",revenue.getChart)
module.exports = router;