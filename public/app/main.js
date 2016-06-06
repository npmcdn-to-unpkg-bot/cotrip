"use strict";
// The usual bootstrapping imports
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var common_2 = require('@angular/common');
var app_component_1 = require('./app.component');
var angular2_jwt_1 = require("angular2-jwt");
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    common_1.FORM_PROVIDERS,
    router_deprecated_1.ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    angular2_jwt_1.AUTH_PROVIDERS,
    core_1.provide(angular2_jwt_1.AuthHttp, {
        useFactory: function (http) {
            return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
                tokenName: 'id_token'
            }), http);
        },
        deps: [http_1.Http]
    }),
    core_1.provide(common_2.APP_BASE_HREF, { useValue: '/' })
]);
//# sourceMappingURL=main.js.map