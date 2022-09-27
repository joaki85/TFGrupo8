require('dotenv').config();

const { MongoClient } = require('mongodb');

// Conexión con la base de datos
const db = async () => {
  const uri = process.env.DB_CONN;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('head2head');
    console.log('Mongodb connected!');
    return db;
  } catch (e) {
    console.error(e);
  } finally {
    //client.close();
  }
};

module.exports = db();
