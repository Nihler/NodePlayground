const Order = require("../models/temp");

exports.newOrder = (req, res, next) => {
  Order.findOne({
    order: [["createdAt", "DESC"]]
  })
    .then(result => {
      let orderNumberNew = result.orderNumber;
      if (result.orderNumber == 99) {
        orderNumberNew = 0;
      }
      Order.build({
        orderNumber: orderNumberNew + 1,
        isActive: 0
      })
        .save()
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      Order.build({
        orderNumber: 1,
        isActive: 0
      })
        .save()
        .catch(err => {
          console.log(err);
        });
    });
};

exports.activateOrder = (req, res, next) => {
  const item = Order.findOne({
    where: {
      isActive: 0
    }
  })
    .then(result => {
      result.update({
        isActive: 1
      });
    })
    .catch(err => {
      console.log("No more open orders!");
    });
};

exports.finishOrder = (req, res, next) => {
  const item = Order.findOne({
    where: {
      orderNumber: req.params.orderId
    }
  })
    .then(result => {
      result.update({
        isActive: 2
      });
    })
    .catch(err => {
      console.log("Wrong order number m8");
    });
};
