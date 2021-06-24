const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const morgan = require('morgan'); // Loger middleware
const helmet = require('helmet'); // Basic security patcher for express webserver
const bodyParser = require('body-parser'); // Parse incomming request body from express

const app = express();
app.use(cookieParser());
const corsOptions = {
  //origin: 'http://localhost:8082',
  optionsSuccessStatus: 200,
  //credentials: true
}
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());

// Loads database, ensure is running
let db = require('./models/index');
let seqModels = require('./models/models');
(async () => {
  await seqModels.synchronize();
})();


// Main routing
require('./routes')(app);

// Running app
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("Server is running.");
});

module.exports = {app}