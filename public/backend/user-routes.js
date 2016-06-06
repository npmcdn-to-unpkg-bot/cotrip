var express = require('express'),
    _ = require('lodash'),
    config = require('./config'),
    jwt = require('jsonwebtoken'),
    models = require('./server.js'),
    Sequelize = require('sequelize');

// export express' router to server.js
var app = module.exports = express.Router();

// PostgreSQL Database
var sequelize = new Sequelize('postgres://postgres:rad3eDru9a@localhost:5432/postgres');

// sync database with 'force: false'
// it doesn't delete the tables on restart
sequelize.sync({force: false});

// import models
var User = sequelize.import(__dirname + "/models/user");
var Address = sequelize.import(__dirname + "/models/address");
var Version = sequelize.import(__dirname + "/models/version");
var Trip = sequelize.import(__dirname + "/models/trip");
var Day = sequelize.import(__dirname + "/models/day");
var Transportation = sequelize.import(__dirname + "/models/transportation");
var ActivityCategory = sequelize.import(__dirname + "/models/activity_category");
var Activity = sequelize.import(__dirname + "/models/activity");
var DayActivity = sequelize.import(__dirname + "/models/day_activity");

// from the documentation:
// creating an association will add a foreign key constraint to the attributes and
// all associations use CASCADE on update and SET NULL on delete, except for n:m, which also uses CASCADE on delete

// 'hasOne': Creates an association between this (the source) and the provided target.
// The foreign key is added on the target.
Address.hasOne(User, {foreignKey: 'address_id'});
Version.belongsTo(User, {foreignKey: 'user_id'});
Trip.belongsTo(User, {foreignKey: 'user_id'});
Version.belongsTo(Trip, {foreignKey: 'trip_id'});
Day.belongsTo(Trip, {foreignKey: 'trip_id'});
Transportation.belongsTo(Day, {foreignKey: 'day_id'});
Address.hasOne(Activity, {foreignKey: 'address_id'});
Activity.belongsTo(ActivityCategory, {foreignKey: 'category_id'});


function createToken(user) {
    return jwt.sign(_.pick(user, 'id', 'username'), config.secret, {expiresIn: 60 * 5});
}

app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({message: "You must send the username and the password"});
    }

    User.findOne({where: {username: req.body.username}}).then(function (user) {
        if (!user || !(user.password === req.body.password)) {
            return res.status(401).send("The username or password don't match.");
        }
        res.status(201).send({
            id_token: createToken(user)
        });
    });
});

app.post('/signup', function (req, res) {

    User.findOrCreate({
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

app.post('/get-user', function (req, res) {
    User.findOne({where: {id: req.body.id}}).then(function (user) {
        // user.update(req.body.updates)
        res.status(201).send({
            user: _.omit(user.dataValues, 'password')
        })
    });
});

app.post('/create-trip', function (req, res) {
    Trip.create({
        user_id: req.body.user_id
    }).then(function (trip) {
        res.status(201).send({
            trip: _.pick(trip.get({plain: true}), 'id')
        })
    });
});

app.post('/get-trip', function (req, res) {
    Trip.find({where: {id: req.body.id}}).then(function (trip) {
        res.status(201).send({
            trip: trip.dataValues
        })
    })
});

app.post('/save-trip', function (req, res) {
    console.log(req.body);
    Trip.update(req.body, {where: {id: req.body.id}}).then(function (affectedCount, affectedRows) {
        if (affectedCount == 1) res.status(200).send("Trip SAVED.");
    })
});

app.post('/delete-trip', function (req, res) {
    // delete linked days before deleting the trip
    Day.destroy({where: {trip_id: req.body.id}});

    Trip.destroy({where: {id: req.body.id}}).then(function (affectedRows) {
        if (affectedRows == 1) res.status(200).send("Trip deleted.");
        else res.status(400).send("Unable to delete trip.")
    })
});

app.post('/delete-day', function (req, res) {
    Day.destroy({where: {trip_id: req.body.trip_id, date: req.body.date}}).then(function (affectedRows) {
        if (affectedRows == 1) res.status(200).send("Trip deleted.");
        else res.status(400).send("Unable to delete day.")
    })
});

app.post('/get-trips', function (req, res) {
    Trip.findAll({where: {user_id: req.body.id}, order: [['updatedAt', 'DESC']]}).then(function (trips) {
        res.status(201).send({
            trips: trips
        })
    })
});

app.post('/get-days', function (req, res) {
    Day.findAll({where: {trip_id: req.body.trip_id}, order: [['date', 'ASC']]}).then(function (days) {
        res.status(201).send({
            days: days
        })
    })
});

app.post('/push-day', function (req, res) {
    Day.findOrCreate({
        where: {
            trip_id: req.body.trip_id,
            date: new Date(req.body.date)
        },
        defaults: {
            trip_id: req.body.trip_id,
            date: new Date(req.body.date)
        }
    }).spread(function (day, created) {
        res.status(200).send();
    })
});