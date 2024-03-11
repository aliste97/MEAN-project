import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable ()
export class AuthInterceptor implements HttpInterceptor {

    constructor (private authService: AuthService) {}

    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken ();
        const authRequest = req.clone ({
            headers: req.headers.set ('Authorization', "Bearer " + authToken) // Same header of the backend
        });

        return next.handle (authRequest);
    } // intercept
} // AuthInterceptor
