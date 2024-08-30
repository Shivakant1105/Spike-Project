import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { CommonService } from 'src/service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  toggle!: boolean;

  constructor(
    private commonService: CommonService,
    private authService: AuthService
  ) {}

  //   @description This is a toggle button.
  //   @author Gautam Yadav
  // @return {void} Return a void
  toggleFn(): void {
    this.toggle = !this.toggle;
    this.commonService.setSideBarToggleBtn(this.toggle);
  }
  ngOnInit(): void {}

  //   @description This is a logout method.
  //   @author Gautam Yadav
  // @return {void} Return a void
  onLogout(): void {
    this.authService.logout(false);
  }
}
