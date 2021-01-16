const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:8082',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Loads database, ensure is running
var models = require('./models');
models.sequelize.sync().then(() => {
  console.log("Database is connected");
}).catch(err => {
  console.log(err, "Something wrong with the database")
})

// Main routing
require('./routes')(app);

// Running app
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("app is running.");
});

module.exports = {app}