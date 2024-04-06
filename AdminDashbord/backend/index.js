const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const product = require("./routes/product");
const notification = require("./routes/notification")
const category = require("./routes/category")
const Revenue = require("./routes/revenue-route")
const socketIO = require('socket.io');
const bodyParser = require("body-parser")
const Notification = require("./models/notification.model")
const Checkout = require("./models/checkout.model")
const user = require("./models/user.model");
const revenue = require("./models/revenue.model")
const morgan = require('morgan');

dotenv.config();

mongoose.connect("mongodb+srv://RisDeyy:thanhluc2903@changcannang.nudknv1.mongodb.net/Changcannang_Interior_Web", () => {
  console.log("CONNECTED TO MONGO DB");
});
app.use(morgan('common'));
app.use(bodyParser.json({ limit: "50mb" }))
app.use(cors());
app.use(cookieParser());
app.use(express.json());
const server = app.listen(8000, () => {
  console.log("Server is running");
});

const existingRevenue = revenue.findOne({ name: "Tổng doanh thu" });

if (!existingRevenue) {
  revenue.insertOne({
    name: "Tổng doanh thu",
    sale: 0,
    total: 0,
    order: 0,
  });
}
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on('connection', (socket) => {
  console.log('Client connected');


  const changeStreamOrder = Checkout.watch();

  changeStreamOrder.on('change', async (change) => {
    if (change.operationType === 'insert') {
      try {
        const userRecord = await user.findOne({ name: change.fullDocument.email });

        const customerName = userRecord ? userRecord.name : change.fullDocument.numberPhone;

        const newNoti = new Notification({
          title: 'Đặt hàng',
          content: `Khách hàng ${customerName} đã đặt hàng`,
        });
        const reven = await revenue.findOne()
        if (reven) {

          const Order = reven.order;
          const newOrder = Order + 1;
          await revenue.updateOne(
            {},
            { order: newOrder }
          )
        }
        await newNoti.save();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });


  const changeStream = Notification.watch();

  changeStream.on('change', (change) => {
    console.log(change)
    if (change.operationType === 'insert' || change.operationType === 'update') {
      const extractedData = {
        id: change._id._data,
        title: change.fullDocument.title,
        content: change.fullDocument.content,
        updatedAt: change.wallTime
      };


      io.emit('notification', extractedData);
    }
  });

  // Ngắt kết nối Socket.IO
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    changeStream.close();
    changeStreamOrder.close();
  });
});


//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/navbar", notification);
app.use("/menu", product);
app.use("/menu", category);
app.use("/home", Revenue);
