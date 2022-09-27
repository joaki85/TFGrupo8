const db = require('../database/config');
var mongo = require('mongodb');

const tournamentCtrl = {};

// Recupera todo los torneos
tournamentCtrl.getTournaments = async (req, res, next) => {
  try {
    db.then((db) =>
      db
        .collection('tournaments')
        .find({})
        // .limit(50)
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

// Recupera todos los torneos pero filstra en base a los campos que lleguen por filters
// Dela pantalla de listado de torneos
tournamentCtrl.getTournamentList = async (req, res, next) => {
  const { province_name, comunity, surface, court_type, sport_type } =
    JSON.parse(req.query.filters);
  let filters = {};

  // Si vienen los diferentes campos de los filtros se van añadiendo  antes de la b´usqueda en filters
  // Con $in y el nombre del campo, nos busca todos los que estén dentro del array que le pasamos
  if (province_name.length > 0) {
    filters = {
      ...filters,
      ...{ administrative_area_level_2: { $in: province_name } },
    };
  }
  if (comunity.length > 0) {
    filters = {
      ...filters,
      ...{ administrative_area_level_1: { $in: comunity } },
    };
  }
  if (surface.length > 0) {
    filters = { ...filters, ...{ surface: { $in: surface } } };
  }
  if (court_type.length > 0) {
    filters = { ...filters, ...{ court_type: { $in: court_type } } };
  }
  if (sport_type.length > 0) {
    filters = { ...filters, ...{ sport: { $in: sport_type } } };
  }
  try {
    db.then((db) =>
      db
        .collection('tournaments')
        .aggregate([
          {
            $match: filters,
          },
        ])
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

// Recupera los torneos en base a los id de los favoritos
tournamentCtrl.getTournamentFav = async (req, res, next) => {
  const favourites = req.query.favourites;

  // Convertimos el id que llega en string en un ID de mongo para que pueda hacer la búsqueda

  let favs = [];
  if (favourites) {
    favs = favourites.reduce((prev, current) => {
      prev.push(new mongo.ObjectID(current));
      return prev;
    }, []);
  }

  try {
    db.then((db) =>
      db
        .collection('tournaments')
        .aggregate([
          {
            $match: { _id: { $in: favs } },
          },
        ])
        // .limit(50)
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

// Subida de torneo
tournamentCtrl.postTournament = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a tournament',
      });
    } else {
      const response = db.then((db) =>
        db
          .collection('tournaments')
          .insertOne(req.body)
          .then((result) => {
            res.status(201).json({
              success: true,
              data: result,
              message: 'Tournament created!',
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

// Actualiza el torneo, lo utilizamos para cuando recuperamos la url de la imagen
tournamentCtrl.updateTournament = async (req, res, next) => {
  const poster_url = req.body.poster_url;
  const id = req.body.id;

  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a tournament',
      });
    } else {
      const response = db.then((db) =>
        db
          .collection('tournaments')
          .findOneAndUpdate(
            { _id: mongo.ObjectId(id) },
            {
              $set: { poster_url: poster_url },
            }
          )
          .then((result) => {
            res.status(201).json({
              success: true,
              data: result,
              message: 'Tournament created!',
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

module.exports = tournamentCtrl;
