const db = require('../database/config');
var mongo = require('mongodb');

const userCtrl = {};

// Recupera un perfil de usuario en base a su id y dependiendo de si es player o club cambia de collection
userCtrl.getUserProfile = async (req, res) => {
  const _id = req.query.uid;
  try {
    db.then((db) =>
      db
        .collection('player')
        .findOne({ _id: _id })
        .then((data) => {
          if (!data) {
            throw 'error';
          }
          return res
            .status(200)
            .json({ success: true, data: { ...data, role: 'player' } });
        })
        .catch(() => {
          db.collection('club')
            .findOne({ _id: _id })
            .then((data) => {
              if (!data) {
                return res
                  .status(400)
                  .json({ success: false, error: `No data found` });
              }
              return res
                .status(200)
                .json({ success: true, data: { ...data, role: 'club' } });
            })
            .catch((err) => next(err));
        })
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Subida de perfil de usuario, en el que se indica también el perfil para cambiar de collection
userCtrl.postUser = async (req, res, next) => {
  const collection = req.body.role;

  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a user',
      });
    } else {
      const response = db.then((db) =>
        db
          .collection(collection)
          .insertOne(req.body)
          .then((result) => {
            res.status(201).json({
              success: true,
              id: result.insertedId,
              message: 'User created!',
            });
          })
          .catch((err) => next(err))
      );
      return response;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = userCtrl;

// Nos permite actualizar un perfil de usuario en base a su rol y id
userCtrl.updateUser = (req, res) => {
  try {
    const { user, data } = req.body;
    const role = data.role;

    db.then((db) =>
      db
        .collection(role)
        .findOneAndUpdate(
          { _id: data._id },
          {
            $set: user,
          }
        )
        .then((response) => {
          return res.status(200).json({ success: true, data: response.value });
        })
        .catch((err) => {
          console.log(err);
          next(err);
        })
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};
