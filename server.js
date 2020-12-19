const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
const port = 4000;
const db = require("./config/keys").mongoURI;

//const index = require('./routes/index');
const musers = require('./routes/api/musers');

app.use(cors());

// Bodyparser Middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

//Connect To MongoDB
mongoose.connect(
    db,
    { useNewUrlParser: true })
    .then(() => console.log("MongoDB Successfully Connected To MLabs"))
    .catch(err => console.log(err));

//Passport
app.use(passport.initialize());
require("./config/passport")(passport);

//Routes
//app.use('/', index);
app.use('/api/musers', musers);

app.listen(port, function () {
    console.log("Server Is Running On Port: " + port);
});