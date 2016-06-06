import {Component, OnInit, Output, Directive} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {
    CORE_DIRECTIVES, NgSwitch, NgSwitchWhen, NgSwitchDefault, NgClass, Control,
    ControlGroup
} from '@angular/common';
import {AuthHttp, JwtHelper} from 'angular2-jwt';
import {Http, Headers} from '@angular/http';
import {UserService} from "../../services/user.service";
import {Handle} from "../../services/handle.service";
import {BootFlatDatePicker} from "../../interfaces/datepicker/bootflat-datepicker";
import {Trip} from "../../models/trip";
import {TAB_DIRECTIVES} from "ng2-bootstrap/components/tabs";
import {Day} from "../../models/day";
import {DayComponent} from "./day/day.component";
import {Moment} from "~moment/moment";
import {User} from "../../models/user";
import * as _ from 'lodash';

declare var moment:any;

@Component({
    selector: 'profile',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, NgSwitch, NgSwitchWhen, NgSwitchDefault, NgClass,
        BootFlatDatePicker, TAB_DIRECTIVES, DayComponent],
    providers: [UserService, Handle, AuthHttp],
    styleUrls: ['app/components/profile/profile.component.css'],
    templateUrl: 'app/components/profile/profile.component.html'
})
export class ProfileComponent implements OnInit {

    formTrip:ControlGroup;

    user:User; // current user object
    trip:Trip; // trip object for the trip creation section
    trips:Array<Trip>; // array of trips created by the user
    numberOfDays:number = 0; // changes when data range changes
    days:Array<Day> = []; // generated after date range selection
    selectedDay:Date; // day selection in trip creation section
    showDays:boolean = false; // used to switch between views based on selected date range
    showTrips:boolean = false;
    updatingDays:boolean = false; // used to avoid simultaneous/concurrect updates

    jwt:string;
    response:string;
    api:string;
    jwtHelper:JwtHelper = new JwtHelper();

    editingInfo:Boolean = false;
    creatingTrip:Boolean = false;

    ngOnInit():any {

    }

    constructor(public router:Router, public http:Http, private userService:UserService) {
        var token = localStorage.getItem('id_token');

        // get current user profile info from server
        // list of trips gets retrieved in this methods
        this.getUser(this.jwtHelper.decodeToken(token).id);

        this.formTrip = new ControlGroup({
            id: new Control(""),
            name: new Control(""),
            start_date: new Control(""),
            end_date: new Control(""),
            description: new Control(""),
            participants: new Control(""),
            is_public: new Control("")
        });

        this.formTrip.valueChanges.subscribe(
            data => {
                // check if dates are valid
                if (data.start_date && data.end_date && this.trip &&
                    data.start_date != 'Invalid date' && data.end_date != 'Invalid date') {
                    var new_start = moment(data.start_date);

                    // moment.js presumed bug, when adding one day '_i' (input) doesn't change
                    var new_end = moment(moment(moment(data.end_date).add(1, 'days')._d).format("YYYY-MM-DD"));
                    var new_range = new_end.diff(new_start, 'days');

                    this.showDays = true;

                    if (this.days.length == 0) {
                        // if diff > 0 push days into day list
                        if (!this.updatingDays) {
                            this.pushDays(new_range, new_start)
                        }
                    } else {
                        console.log('this.days', this.days);
                        // they are not moments though
                        var old_start = moment(_.head(this.days).date).format("YYYY-MM-DD");
                        var old_end = moment(_.last(this.days).date).format("YYYY-MM-DD");
                        console.log('old_start', old_start);
                        console.log('new_start', new_start);

                        // if user changes 'start_date' then check if that date
                        // is after original start_date
                        if (moment(new_start).isAfter(old_start)) {
                            var diffStartAfter = new_start.diff(old_start, 'days');

                            // drop from left
                            var new_days = _.drop(this.days, diffStartAfter);
                            this.updateDays(userService, this.trip.id, this.days, new_days);
                        }

                        // is before original start_date
                        if (moment(new_start).isBefore(old_start)) {
                            var diffStartBefore = moment(old_start).diff(new_start, 'days');

                            if (!this.updatingDays) {
                                this.pushDays(diffStartBefore, new_start)
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
                            if (!this.updatingDays) {
                                this.pushDays(diffEndAfter, new_end)
                            }
                        }

                        // is before original end_date
                        if (moment(new_end).isBefore(old_end)) {
                            var diffEndBefore = moment(old_end).diff(new_end, 'days');
                            console.log(diffEndBefore);
                            var new_days = _.dropRight(this.days, diffEndBefore);
                            this.updateDays(userService, this.trip.id, this.days, new_days);
                        }
                    }

                    // set numberOfDays with new values
                    this.numberOfDays = new_range;
                }

                delete this.selectedDay;

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
                if (!_.isBoolean(data.is_public)) new_trip = _.omit(new_trip, ['is_public']);


                if (this.trip && this.trip.id) {
                    // save at every changes
                    this.userService.saveTrip(_.omitBy(new_trip, _.isNil)).subscribe(
                        status => {
                            if (status == 200) {
                                console.log('saved')
                            }
                            else alert('A server error occurred.')
                        },
                        error => console.log(error)
                    );
                }
            }
        );
    }

    logout() {
        delete this.user;
        this.userService.logout();
        this.router.navigate(['Login']);
    }

    // NOT STATIC
    getDate(date) {
        return moment(date).fromNow()
    }

    edit() {
        this.editingInfo = !this.editingInfo
    }

    save() {
        this.editingInfo = !this.editingInfo
    }

    /**
     * Called from the 'create' button on top of trips list.
     * Simply creates a new trip.
     */
    createTrip() {
        this.creatingTrip = !this.creatingTrip;

        // init trip
        this.trip = new Trip();

        this.userService.createTrip(this.user.id).subscribe(
            id => this.trip.setID(id),
            error => console.log(error)
        );

    }

    editTrip(id:string) {
        $('body').loading();

        // init trip
        this.trip = new Trip();

        // make sure array of days has been emptied
        this.days = [];

        this.userService.getTrip(id).subscribe(
            trip => {
                this.trip = trip;
                this.getDays();
                this.creatingTrip = !this.creatingTrip;
                $('body').loading('stop');
            },
            error => console.log(error)
        );
    }

    deleteTrip(id:string) {
        this.userService.deleteTrip(id).subscribe(
            status => {
                if (status == 200) {
                    this.getTrips(this.user.id);
                    console.log('delete day')
                }
                else alert('A server error occurred.')
            },
            error => console.log(error)
        );
    }

    saveTrip(form:Trip) {
        $('body').loading();

        this.userService.saveTrip(form).subscribe(
            status => {
                if (status == 200) {
                    $('body').loading('stop');
                }
                else alert('A server error occurred.')
            },
            error => console.log(error)
        );
    }

    selectDay(day:Day) {
        this.selectedDay = day;
    }

    // date parsing function used for DOM rendering
    parseDate(date:Moment, format:string):string {
        // doesn't check for 'date' to be undefined since
        // moment().format() return a default date anyway
        if (typeof format === 'undefined') throw new Error("Wrong input parameters in 'parseDate'");
        if (!moment(date).isValid()) {
            if (format == 'YYYY') {
                return 'Select dates';
            } else {
                return '-';
            }
        }
        return moment(date).format(format)
    }

    goBack() {
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
        this.creatingTrip = !this.creatingTrip
    }

    // GOLDEN RULE: always delegate data access to a supporting service class
    getUser(id:string) {
        this.userService.getUser(id).subscribe(
            user => {
                this.user = user;
                // as soon as user is ready, ask the server for the list of trips
                this.getTrips(this.user.id);

            },
            error => console.log(error)
        )
    }

    getTrips(id:string) {
        $('body').loading({theme: 'dark'});
        this.userService.getTrips(id).subscribe(
            trips => {
                this.trips = trips;
                $('body').loading('stop');
                this.showTrips = this.trips.length > 0
            },
            error => console.log(error)
        )
    }

    updateDays(userService, trip_id, old_days:Array<Day>, new_days:Array<Day>) {
        var diff = _.difference(old_days, new_days);
        console.log('diff', diff);
        var reverseDiff = _.difference(new_days, old_days);
        console.log('reverseDiff', reverseDiff);
        if (diff.length > 0) {
            diff.forEach(function (element, index, _array) {
                console.log('for each');
                userService.deleteDay(trip_id, moment(element.date).format('YYYY-MM-DD')).subscribe(
                    status => {
                        if (status == 200) {
                            console.log('deleted');
                        }
                    },
                    error => {
                        return error
                    }
                )
            });
            this.getDays()
        } else {

        }
    }

    pushDays(new_range:number, new_start:Moment) {
        // toggle status of updating days
        this.updatingDays = true;
        $('body').loading();

        if (this.trip && this.trip.id) {
            if (new_range > 0) {
                var day = new Day(new_start);

                this.userService.pushDay(this.trip.id, day.date.toDate()).subscribe(
                    status => {
                        if (status == 200) {
                            this.pushDays(new_range - 1, moment(new_start).add(1, 'days'))
                        }
                    },
                    error => console.log(error)
                );
            } else {
                this.updatingDays = false;
                this.getDays();
                $('body').loading('stop')
            }
        } else {
            alert('Cannot getDays, this.trip is undefined.')
        }

    }

    getDays() {
        this.days = [];
        if (this.trip && this.trip.id) {
            this.userService.getDays(this.trip.id).subscribe(
                days => this.days = days,
                error => console.log(error)
            )
        } else {
            alert('Cannot getDays, this.trip is undefined.')
        }

    }
}