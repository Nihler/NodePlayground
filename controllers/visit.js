const sequelize = require("../helpers/database");
const Visit = require("../models/visit");

exports.postAddVisit = async (req, res, next) => {
  const date = req.params.date;
  const time = req.params.time;
  const category = req.params.category;

  await Visit.build({
    day: date,
    hour: time,
    type: category,
    userId: req.session.user.id
  })
    .save()
    .then(() => {
      res.render("student");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.deleteVisit = async (req, res) => {
  //dete vist from firestory by user clik on li button -odowałaj wizytę
  const id = req.params.id;
  Visit.destroy({
    where: {
      id: id
    }
  }).catch(err => {
    console.log(err);
  });
};

exports.readVisit = async (req, res) => {
  //loading data of a particular visit,used after adding a visit to firestrone=> to insert it into ul
  const id = req.params.id;
  Visit.findByPk(id)
    .then(function(doc) {
      if (doc) {
        console.log("Document data:", doc);
        res.json(doc);
      } else {
        console.log("No such document!");
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
      res.json(error);
    });
};

exports.checkUserVisits = async (req, res) => {
  //checking user's visits(firestore) after logging in to his panel
  Visit.findAll({
    where: {
      userId: req.session.user.id
    }
  })
    .then(function(querySnapshot) {
      let arrayData = [];
      querySnapshot.forEach(function(doc) {
        const tempArrayData = [doc.id, doc.day.toString(), doc.hour.substring(0, 5), doc.type];
        arrayData.push(tempArrayData);
      });
      res.json(arrayData);
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
      res.json(error);
    });
};

exports.checkFreeVisitsHours = async (req, res, next) => {
  const date = req.params.date;
  //checking free houres for date
  Visit.findAll({
    where: { day: date }
  })
    .then(function(querySnapshot) {
      let unavailableHours = [];
      querySnapshot.forEach(function(doc) {
        unavailableHours.push(doc.hour.substring(0, 5));
      });
      res.json(unavailableHours);
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
      res.json(error);
    });
};
