const express = require('express');
const dotenv = require('dotenv');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
dotenv.config();
const PORT = process.env.PORT || 8080;
//express app
const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
  'Origin, X-Requested-With, Content-Type, Accept',
};

const usersRouter = require('./server/routes/users');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

//connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  });

  app.use('/', usersRouter)

module.exports = app;
