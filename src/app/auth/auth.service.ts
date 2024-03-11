import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated: boolean = false;
    private token: string;
    private authStatus = new Subject<boolean>();
    private tokenTimer: any;

    constructor(private http: HttpClient, private router: Router) { }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(response => {
            this.router.navigate(['/login']);
        });
    } // createUser

    login(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };

        this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData).subscribe(response => {
            console.log(response);
            this.token = response.token;
            if (this.token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer (expiresInDuration);
                this.isAuthenticated = true;
                this.authStatus.next(true);
                const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
                this.saveAuthData(this.token, expirationDate);
                this.router.navigate(['/']);
            } // if
        });
    } // login

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatus.next(false);
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
    } // logout

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) { return; }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime () - now.getTime ();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer (expiresIn / 1000);
            this.authStatus.next(true);
        } // if
    } // autoAuthUser

    getToken() {
        return this.token;
    } // getToken

    getAuthStatusListener() {
        return this.authStatus.asObservable();
    } // getAuthStatusListener

    getIsAuth() {
        return this.isAuthenticated;
    } // getIsAuth

    private setAuthTimer (duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    } // setAuthTimer

    // Save datas on localstorage of the browser
    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    } // saveAuthData

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    } // clearAuthData

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');

        if (!token || !expirationDate) {
            return;
        } // if

        return { token: token, expirationDate: new Date(expirationDate) }
    } // getAuthData

} // AuthService
