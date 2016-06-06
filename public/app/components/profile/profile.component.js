"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
var angular2_jwt_1 = require('angular2-jwt');
var http_1 = require('@angular/http');
var user_service_1 = require("../../services/user.service");
var handle_service_1 = require("../../services/handle.service");
var bootflat_datepicker_1 = require("../../interfaces/datepicker/bootflat-datepicker");
var trip_1 = require("../../models/trip");
var tabs_1 = require("ng2-bootstrap/components/tabs");
var day_1 = require("../../models/day");
var day_component_1 = require("./day/day.component");
var _ = require('lodash');
var ProfileComponent = (function () {
    function ProfileComponent(router, http, userService) {
        var _this = this;
        this.router = router;
        this.http = http;
        this.userService = userService;
        this.numberOfDays = 0; // changes when data range changes
        this.days = []; // generated after date range selection
        this.showDays = false; // used to switch between views based on selected date range
        this.showTrips = false;
        this.updatingDays = false; // used to avoid simultaneous/concurrect updates
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.editingInfo = false;
        this.creatingTrip = false;
        var token = localStorage.getItem('id_token');
        // get current user profile info from server
        // list of trips gets retrieved in this methods
        this.getUser(this.jwtHelper.decodeToken(token).id);
        this.formTrip = new common_1.ControlGroup({
            id: new common_1.Control(""),
            name: new common_1.Control(""),
            start_date: new common_1.Control(""),
            end_date: new common_1.Control(""),
            description: new common_1.Control(""),
            participants: new common_1.Control(""),
            is_public: new common_1.Control("")
        });
        this.formTrip.valueChanges.subscribe(function (data) {
            // check if dates are valid
            if (data.start_date && data.end_date && _this.trip &&
                data.start_date != 'Invalid date' && data.end_date != 'Invalid date') {
                var new_start = moment(data.start_date);
                // moment.js presumed bug, when adding one day '_i' (input) doesn't change
                var new_end = moment(moment(moment(data.end_date).add(1, 'days')._d).format("YYYY-MM-DD"));
                var new_range = new_end.diff(new_start, 'days');
                _this.showDays = true;
                if (_this.days.length == 0) {
                    // if diff > 0 push days into day list
                    if (!_this.updatingDays) {
                        _this.pushDays(new_range, new_start);
                    }
                }
                else {
                    console.log('this.days', _this.days);
                    // they are not moments though
                    var old_start = moment(_.head(_this.days).date).format("YYYY-MM-DD");
                    var old_end = moment(_.last(_this.days).date).format("YYYY-MM-DD");
                    console.log('old_start', old_start);
                    console.log('new_start', new_start);
                    // if user changes 'start_date' then check if that date
                    // is after original start_date
                    if (moment(new_start).isAfter(old_start)) {
                        var diffStartAfter = new_start.diff(old_start, 'days');
                        // drop from left
                        var new_days = _.drop(_this.days, diffStartAfter);
                        _this.updateDays(userService, _this.trip.id, _this.days, new_days);
                    }
                    // is before original start_date
                    if (moment(new_start).isBefore(old_start)) {
                        var diffStartBefore = moment(old_start).diff(new_start, 'days');
                        if (!_this.updatingDays) {
                            _this.pushDays(diffStartBefore, new_start);
                        }
                    }
                    // 'new_end' has been increased from the beginning in order to include
                    // that very last day among those displayed in the day list but
                    // now it has to be decrease in order for the following method to
                    // correctly determine the difference between the two days
                    var new_end = moment(moment(moment(new_end).subtract(1, 'days')._d).format("YYYY-MM-DD"));
                    // if user changes 'end_date' then check if that date
                    // is after original end_date
                    if (moment(new_end).isAfter(old_end)) {
                        var diffEndAfter = new_end.diff(old_end, 'days');
                        console.log(diffEndAfter);
                        if (!_this.updatingDays) {
                            _this.pushDays(diffEndAfter, new_end);
                        }
                    }
                    // is before original end_date
                    if (moment(new_end).isBefore(old_end)) {
                        var diffEndBefore = moment(old_end).diff(new_end, 'days');
                        console.log(diffEndBefore);
                        var new_days = _.dropRight(_this.days, diffEndBefore);
                        _this.updateDays(userService, _this.trip.id, _this.days, new_days);
                    }
                }
                // set numberOfDays with new values
                _this.numberOfDays = new_range;
            }
            delete _this.selectedDay;
            // filter data to avoid send null or empty values to the server
            var new_trip = data;
            // dates must be valid
            if (data.start_date == 'Invalid date' || data.start_date == '' ||
                data.end_date == 'Invalid date' || data.end_date == '') {
                new_trip = _.omit(new_trip, ['start_date', 'end_date']);
            }
            // participants must be a number
            new_trip.participants = _.toNumber(data.participants);
            // is_public must be a boolean
            if (!_.isBoolean(data.is_public))
                new_trip = _.omit(new_trip, ['is_public']);
            if (_this.trip && _this.trip.id) {
                // save at every changes
                _this.userService.saveTrip(_.omitBy(new_trip, _.isNil)).subscribe(function (status) {
                    if (status == 200) {
                        console.log('saved');
                    }
                    else
                        alert('A server error occurred.');
                }, function (error) { return console.log(error); });
            }
        });
    }
    ProfileComponent.prototype.ngOnInit = function () {
    };
    ProfileComponent.prototype.logout = function () {
        delete this.user;
        this.userService.logout();
        this.router.navigate(['Login']);
    };
    // NOT STATIC
    ProfileComponent.prototype.getDate = function (date) {
        return moment(date).fromNow();
    };
    ProfileComponent.prototype.edit = function () {
        this.editingInfo = !this.editingInfo;
    };
    ProfileComponent.prototype.save = function () {
        this.editingInfo = !this.editingInfo;
    };
    /**
     * Called from the 'create' button on top of trips list.
     * Simply creates a new trip.
     */
    ProfileComponent.prototype.createTrip = function () {
        var _this = this;
        this.creatingTrip = !this.creatingTrip;
        // init trip
        this.trip = new trip_1.Trip();
        this.userService.createTrip(this.user.id).subscribe(function (id) { return _this.trip.setID(id); }, function (error) { return console.log(error); });
    };
    ProfileComponent.prototype.editTrip = function (id) {
        var _this = this;
        $('body').loading();
        // init trip
        this.trip = new trip_1.Trip();
        // make sure array of days has been emptied
        this.days = [];
        this.userService.getTrip(id).subscribe(function (trip) {
            _this.trip = trip;
            _this.getDays();
            _this.creatingTrip = !_this.creatingTrip;
            $('body').loading('stop');
        }, function (error) { return console.log(error); });
    };
    ProfileComponent.prototype.deleteTrip = function (id) {
        var _this = this;
        this.userService.deleteTrip(id).subscribe(function (status) {
            if (status == 200) {
                _this.getTrips(_this.user.id);
                console.log('delete day');
            }
            else
                alert('A server error occurred.');
        }, function (error) { return console.log(error); });
    };
    ProfileComponent.prototype.saveTrip = function (form) {
        $('body').loading();
        this.userService.saveTrip(form).subscribe(function (status) {
            if (status == 200) {
                $('body').loading('stop');
            }
            else
                alert('A server error occurred.');
        }, function (error) { return console.log(error); });
    };
    ProfileComponent.prototype.selectDay = function (day) {
        this.selectedDay = day;
    };
    // date parsing function used for DOM rendering
    ProfileComponent.prototype.parseDate = function (date, format) {
        // doesn't check for 'date' to be undefined since
        // moment().format() return a default date anyway
        if (typeof format === 'undefined')
            throw new Error("Wrong input parameters in 'parseDate'");
        if (!moment(date).isValid()) {
            if (format == 'YYYY') {
                return 'Select dates';
            }
            else {
                return '-';
            }
        }
        return moment(date).format(format);
    };
    ProfileComponent.prototype.goBack = function () {
        // resetting everything
        this.trip = null;
        delete this.trip;
        this.days = [];
        this.numberOfDays = 0;
        this.showDays = false;
        _.forEach(this.formTrip.controls, function (control, name) {
            control.updateValue('');
            control.setErrors(null);
        });
        this.getTrips(this.user.id);
        this.creatingTrip = !this.creatingTrip;
    };
    // GOLDEN RULE: always delegate data access to a supporting service class
    ProfileComponent.prototype.getUser = function (id) {
        var _this = this;
        this.userService.getUser(id).subscribe(function (user) {
            _this.user = user;
            // as soon as user is ready, ask the server for the list of trips
            _this.getTrips(_this.user.id);
        }, function (error) { return console.log(error); });
    };
    ProfileComponent.prototype.getTrips = function (id) {
        var _this = this;
        $('body').loading({ theme: 'dark' });
        this.userService.getTrips(id).subscribe(function (trips) {
            _this.trips = trips;
            $('body').loading('stop');
            _this.showTrips = _this.trips.length > 0;
        }, function (error) { return console.log(error); });
    };
    ProfileComponent.prototype.updateDays = function (userService, trip_id, old_days, new_days) {
        var diff = _.difference(old_days, new_days);
        console.log('diff', diff);
        var reverseDiff = _.difference(new_days, old_days);
        console.log('reverseDiff', reverseDiff);
        if (diff.length > 0) {
            diff.forEach(function (element, index, _array) {
                console.log('for each');
                userService.deleteDay(trip_id, moment(element.date).format('YYYY-MM-DD')).subscribe(function (status) {
                    if (status == 200) {
                        console.log('deleted');
                    }
                }, function (error) {
                    return error;
                });
            });
            this.getDays();
        }
        else {
        }
    };
    ProfileComponent.prototype.pushDays = function (new_range, new_start) {
        var _this = this;
        // toggle status of updating days
        this.updatingDays = true;
        $('body').loading();
        if (this.trip && this.trip.id) {
            if (new_range > 0) {
                var day = new day_1.Day(new_start);
                this.userService.pushDay(this.trip.id, day.date.toDate()).subscribe(function (status) {
                    if (status == 200) {
                        _this.pushDays(new_range - 1, moment(new_start).add(1, 'days'));
                    }
                }, function (error) { return console.log(error); });
            }
            else {
                this.updatingDays = false;
                this.getDays();
                $('body').loading('stop');
            }
        }
        else {
            alert('Cannot getDays, this.trip is undefined.');
        }
    };
    ProfileComponent.prototype.getDays = function () {
        var _this = this;
        this.days = [];
        if (this.trip && this.trip.id) {
            this.userService.getDays(this.trip.id).subscribe(function (days) { return _this.days = days; }, function (error) { return console.log(error); });
        }
        else {
            alert('Cannot getDays, this.trip is undefined.');
        }
    };
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'profile',
            directives: [common_1.CORE_DIRECTIVES, router_deprecated_1.ROUTER_DIRECTIVES, common_1.NgSwitch, common_1.NgSwitchWhen, common_1.NgSwitchDefault, common_1.NgClass,
                bootflat_datepicker_1.BootFlatDatePicker, tabs_1.TAB_DIRECTIVES, day_component_1.DayComponent],
            providers: [user_service_1.UserService, handle_service_1.Handle, angular2_jwt_1.AuthHttp],
            styleUrls: ['app/components/profile/profile.component.css'],
            templateUrl: 'app/components/profile/profile.component.html'
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http, user_service_1.UserService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map