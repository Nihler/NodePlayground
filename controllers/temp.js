const Order = require("../models/temp");

exports.newOrder = (req, res, next) => {
  Order.findOne({
    order: [["createdAt", "DESC"]]
  })
    .then(result => {
      Order.build({
        orderNumber: result.orderNumber + 1,
        isActive: 0
      })
        .save()
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.activateOrder = (req, res, next) => {
  Order.findOne({
    where: {
      isActive: 0
    },
    order: [["createdAt", "ASC"]]
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};
