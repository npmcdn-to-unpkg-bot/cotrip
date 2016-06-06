import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from "rxjs/Observable";
import {Handle} from "./handle.service";
import {AuthHttp} from "angular2-jwt/angular2-jwt";
import {Observer} from "rxjs/Observer";
import {User} from "../models/user";
import {Subscription} from "rxjs/Rx";
import {Moment} from "~moment/moment";
import {Trip} from "../models/trip";
import * as _ from 'lodash';

declare var moment:any;

@Injectable()
export class UserService {

    result:Object;
    headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    constructor(public http:Http, private handle:Handle) {
    }

    static isLoggedIn() {
        var token = localStorage.getItem('id_token');
        return !(typeof token === 'undefined' || !token);
    }

    logout() {
        localStorage.removeItem('id_token')
    }

    createTrip(user_id:string):Observable<any> {
        return this.http.post('http://localhost:3010/create-trip', 'user_id=' + user_id, {headers: this.headers}
        ).map(function (res:Response) {
            let body = res.json();
            return body.trip.id || {};
        }).catch(this.handleError);
    }

    /**
     * Returns Observable of type Trip
     * containing trip info given its 'id'.
     * @param id
     * @returns {Observable<Trip>}
     */
    getTrip(id:string):Observable<Trip> {
        return this.http.post('http://localhost:3010/get-trip', 'id=' + id, {headers: this.headers}
        ).map(function (res:Response) {
            let body = res.json();
            if (body.trip) {
                body.trip.start_date = moment(body.trip.start_date).format('YYYY-MM-DD');
                body.trip.end_date = moment(body.trip.end_date).format('YYYY-MM-DD');
            }
            return body.trip || {};
        }).catch(this.handleError);
    }

    /**
     * Returns Observable of type Array<Trip>
     * containing list of trip given user's 'id'
     * @param id
     * @returns {Observable<Array<Trip>>}
     */
    getTrips(id:string):Observable<Array<Trip>> {
        return this.http.post('http://localhost:3010/get-trips', 'id=' + id, {headers: this.headers}
        ).map(function (res:Response) {
            let body = res.json();
            return body.trips || {};
        }).catch(this.handleError);
    }

    deleteTrip(id:string):Observable<number> {
        return this.http.post('http://localhost:3010/delete-trip', 'id=' + id, {headers: this.headers}
        ).map(function (res:Response) {
            return res.status;
        }).catch(this.handleError);
    }

    getUser(id:string):Observable<any> {
        return this.http.post('http://localhost:3010/get-user', 'id=' + id, {headers: this.headers}
        ).map(function (res:Response) {
            let body = res.json();
            return body.user || {};
        }).catch(this.handleError);
    }

    saveTrip(trip:Object):Observable<number> {
        var object = this.parseTrip(trip);
        return this.http.post('http://localhost:3010/save-trip', object, {headers: this.headers}
        ).map(function (res:Response) {
            return res.status;
        }).catch(this.handleError);
    }

    pushDay(trip_id:string, date:Date) {
        var variables = 'trip_id=' + trip_id + '&date=' + date;
        return this.http.post('http://localhost:3010/push-day', variables, {headers: this.headers}
        ).map(function (res:Response) {
            return res.status;
        }).catch(this.handleError);
    }

    deleteDay(trip_id:string, date:Date) {
        var variables = 'trip_id=' + trip_id + '&date=' + date;
        return this.http.post('http://localhost:3010/delete-day', variables, {headers: this.headers}
        ).map(function (res:Response) {
            return res.status;
        }).catch(this.handleError);
    }

    getDays(trip_id:string) {
        var variables = 'trip_id=' + trip_id;
        return this.http.post('http://localhost:3010/get-days', variables, {headers: this.headers}
        ).map(function (res:Response) {
            let body = res.json();
            return body.days || {};
        }).catch(this.handleError);
    }

    private handleError(error:any) {
        console.log(error);
        // let errMsg = (error.message) ? error.message :
        //     error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        // console.error(errMsg); // log to console instead
        return Observable.throw(error);
    }

    private parseTrip(trip:Object):string {
        var result:string = '';
        _.forEach(trip, function (value, key) {
            // workaround for letting some values pass
            // not really good if more keys are involved
            if (value != '' || !_.isNil(value)) {
                result += key + '=' + value + '&'
            }
        });
        return result
    }
}