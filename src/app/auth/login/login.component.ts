import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  ngOnInit(): void {}
  /*   @description  Handles the form submission for user login. Sends a login request with the form data,.
   *   @author vivekSengar
   * @return {void} Return a void
   */
  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.data.token) {
          this.authService.setDataInLocalStorage(
            'userData',
            JSON.stringify(res)
          );
          this.authService.setDataInLocalStorage(
            'tkn',
            JSON.stringify(res.data.token)
          );
          this.router.navigate(['home/dashboard']);
        }
      },
    });
  }
}
