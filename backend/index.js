const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
//this mean we don't need to use body-parser anymore
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
require('dotenv').config();

app.use(
  '/',

  require('./routes/tournament.routes')
);
app.use(
  '/',

  require('./routes/club.routes')
);

app.use(
  '/',

  require('./routes/user.routes')
);

app.listen(process.env.PORT, () => {
  console.log('Servidor Corriendo en Puerto' + ' ' + process.env.PORT);
});
