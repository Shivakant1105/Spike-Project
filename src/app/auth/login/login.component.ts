import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private commmonService: CommonService
  ) {}

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  /*   @description  Handles the form submission for user login. Sends a login request with the form data,.
   *   @author vivekSengar
   * @return {void} Return a void
   */
  onSubmit(): void {
    this.commmonService.showLoader();
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.data.token) {
          this.authService.setDataInLocalStorage(
            'tkn',
            JSON.stringify(res.data.token)
          );
        }
        const userData = this.authService.getTokenData();
        if (userData.role == 'ADMIN') {
          this.router.navigate(['home/dashboard']);
        } else {
          this.router.navigate(['menu/course']);
        }
        setTimeout(() => {
          this.authService.logout();
        }, (userData.exp - userData.iat) * 1000);
      },
      complete: () => {
        this.commmonService.hideLoader();
      },
    });
  }
}
