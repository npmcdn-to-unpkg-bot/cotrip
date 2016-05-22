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
var common_1 = require('@angular/common');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var Observable_1 = require("rxjs/Observable");
var SignupComponent = (function () {
    function SignupComponent(router, http) {
        this.router = router;
        this.http = http;
        this.signUpForm = new common_1.ControlGroup({
            first_name: new common_1.Control(""),
            last_name: new common_1.Control(""),
            username: new common_1.Control(""),
            password: new common_1.Control("")
        });
    }
    SignupComponent.prototype.signup = function (data) {
        var _this = this;
        var first_name = data.first_name;
        var last_name = data.last_name;
        var username = data.username;
        var password = data.password;
        var credentials = "first_name=" + first_name + "&last_name=" +
            last_name + "&username=" + username + "&password=" + password;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post('http://localhost:3005/signup', credentials, {
            headers: headers
        }).map(function (res) { return res.json(); })
            .subscribe(function (data) {
            SignupComponent.saveJwt(data.id_token);
            _this.router.parent.navigateByUrl('/profile');
        }, function (err) { return SignupComponent.handleError(err); }, function () { return console.log('Auth OK!'); });
    };
    SignupComponent.saveJwt = function (jwt) {
        if (jwt) {
            localStorage.setItem('id_token', jwt);
        }
    };
    SignupComponent.handleError = function (error) {
        alert('[' + error.status + '] ' + error._body);
        return Observable_1.Observable.throw(error);
    };
    SignupComponent = __decorate([
        core_1.Component({
            selector: 'signup',
            directives: [router_deprecated_1.RouterLink],
            templateUrl: 'app/components/signup/signup.component.html'
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=signup.component.js.map