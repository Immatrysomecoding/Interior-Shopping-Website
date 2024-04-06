const productRouter = require("./product");
const homeRouter = require("./home");
const userRouter = require("./user");
const checkOutRouter = require("./checkOut");

function route(app) {
  app.use("/home", homeRouter);

  app.use("/shop-grid", productRouter);

  app.use("/", userRouter);

  app.get("/shop-details", function (req, res) {
    res.render("shop-details/shop-details");
  });

  app.get("/shoping-cart", function (req, res) {
    res.render("shoping-cart/shoping-cart");
  });

  app.get("/post", function (req, res) {
    res.render("post/post");
  });

  app.get("/contact", function (req, res) {
    res.render("contact/contact");
  });

  app.use("/checkout", checkOutRouter);
}

module.exports = route;
