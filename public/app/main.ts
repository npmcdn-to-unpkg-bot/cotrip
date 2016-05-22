// The usual bootstrapping imports
import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {FORM_PROVIDERS} from '@angular/common';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {APP_BASE_HREF} from '@angular/common';


import {AppComponent}   from './app.component';
import {AuthHttp, AuthConfig} from "angular2-jwt";

bootstrap(AppComponent, [
    FORM_PROVIDERS,
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(AuthHttp, {
        useFactory: (http) => {
            return new AuthHttp(new AuthConfig({
                tokenName: 'id_token'
            }), http);
        },
        deps: [Http]
    }),
    provide(APP_BASE_HREF, {useValue: '/'})
]);