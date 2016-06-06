import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class Handle {
    constructor() {
    }

    error(error:any) {
        alert('[' + error.status + '] ' + error._body);
        return Observable.throw(error);
    }

    saveJwt(jwt:string) {
        if (jwt) localStorage.setItem('id_token', jwt)
    }
}