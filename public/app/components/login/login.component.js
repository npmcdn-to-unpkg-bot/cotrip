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
var http_1 = require('@angular/http');
// Add the RxJS Observable operators we need in this app.
require('./rxjs-operators');
var Observable_1 = require("rxjs/Observable");
var user_service_1 = require("../../services/user.service");
var LoginComponent = (function () {
    function LoginComponent(router, http) {
        this.router = router;
        this.http = http;
        this.loginForm = new common_1.ControlGroup({
            username: new common_1.Control(""),
            password: new common_1.Control("")
        });
        if (user_service_1.UserService.isLoggedIn())
            this.router.parent.navigateByUrl('/profile');
    }
    LoginComponent.prototype.authenticate = function (data) {
        var _this = this;
        var username = data.username;
        var password = data.password;
        var credentials = "username=" + username + "&password=" + password;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        this.http.post('http://localhost:3010/login', credentials, {
            headers: headers
        }).map(function (res) { return res.json(); })
            .subscribe(function (data) {
            LoginComponent.saveJwt(data.id_token);
            _this.router.parent.navigateByUrl('/profile');
        }, function (err) { return LoginComponent.handleError(err); }, function () { return console.log('Auth OK!'); });
    };
    LoginComponent.saveJwt = function (jwt) {
        if (jwt)
            localStorage.setItem('id_token', jwt);
    };
    LoginComponent.handleError = function (error) {
        console.log(error);
        alert('[' + error.status + '] ' + error._body);
        return Observable_1.Observable.throw(error);
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            directives: [router_deprecated_1.RouterLink, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_deprecated_1.ROUTER_DIRECTIVES],
            styleUrls: ['app/components/login/login.component.css'],
            templateUrl: 'app/components/login/login.component.html'
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map