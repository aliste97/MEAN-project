import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  userIsAuthenticated: boolean = false;

  constructor (private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth ();
    this.authListenerSub = this.authService.getAuthStatusListener ().subscribe (isAuthenticated => this.userIsAuthenticated = isAuthenticated);
  } // ngOnInit

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe ();
  } // ngOnDestroy

  onLogout () {
    this.authService.logout ();
  } // onLogout
} // HeaderComponent
