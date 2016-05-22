var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    jwt = require('jsonwebtoken'),
    models = require('./server.js'),
    Sequelize = require('sequelize');

var app = module.exports = express.Router();

// XXX: This should be a database of users :).
var users = [{
    id: 1,
    username: 'gonto',
    password: 'gonto'
}];

// DB
var sequelize = new Sequelize('postgres://postgres:rad3eDru9a@localhost:5432/postgres');
sequelize.sync({force: false});
Users = sequelize.import(__dirname + "/models/users");

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, {expiresIn: 60 * 5});
}


app.post('/users', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }

    if (Users.find({where: {username: req.body.username}})) {
        return res.status(400).send("A user with that username already exists");
    }

    var profile = _.pick(req.body, 'username', 'password', 'extra');
    profile.id = _.max(users, 'id').id + 1;

    users.push(profile);

    res.status(201).send({
        id_token: createToken(profile)
    });
});

app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({message: "You must send the username and the password"});
    }

    Users.findOne({where: {username: req.body.username}}).then(function (user) {
        if (!user || !(user.password === req.body.password)) {
            return res.status(401).send("The username or password don't match.");
        }
        res.status(201).send({
            id_token: createToken(user)
        });
    });
});

app.post('/signup', function (req, res) {

    Users.findOrCreate({
        where: {username: req.body.username},
        defaults: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        }
    }).spread(function (user, created) {
        if (!created) {
            return res.status(400).send({message: "Username already taken."});
        }
        res.status(201).send({
            id_token: createToken(user)
        })
    });
});