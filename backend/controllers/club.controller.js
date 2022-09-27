const db = require('../database/config');
var mongo = require('mongodb');

const clubCtrl = {};

// Recupera todos los clubs
clubCtrl.getClubs = async (req, res, next) => {
  try {
    db.then((db) =>
      db
        .collection('club')
        .find({})
        .limit(50)
        .toArray()
        .then((data) => {
          if (!data) {
            return res
              .status(400)
              .json({ success: false, error: `No data found` });
          }
          return res.status(200).json({ success: true, data });
        })
        .catch((err) => next(err))
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = clubCtrl;
