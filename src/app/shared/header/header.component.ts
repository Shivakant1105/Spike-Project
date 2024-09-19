import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {
  toggle!: boolean;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private route: Router
  ) {}
  /**
   * @description This is a toggle button.
   * @author Gautam Yadav
   * @return {void} Return a void
   */
  toggleFn(): void {
    this.toggle = !this.toggle;
    this.commonService.setSideBarToggleBtn(this.toggle);
  }
  /**
   * @description This is a logout button and here we re-direct to login page.
   * @author Gautam Yadav
   * @return {void} Return a void
   */
  logout(): void {
    this.authService.clearStorageByKey('tkn');
    this.route.navigateByUrl('/auth/login');
  }
}
