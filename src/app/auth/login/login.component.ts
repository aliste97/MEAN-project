import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading: boolean = false;

  constructor (private authService: AuthService) {}

  onLogin (loginForm: NgForm) {
    if (!loginForm.valid) { return; }
    this.isLoading = true;
    this.authService.login (loginForm.value.email, loginForm.value.password);
  } // onLogin
} // LoginComponent
