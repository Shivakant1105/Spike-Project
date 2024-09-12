import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  toggle!: boolean;

  constructor(
    private commonService: CommonService,
  ) {}
  /*
   * @description This is a toggle button.
   *   @author Gautam Yadav
   * @return {void} Return a void
   */
  toggleFn(): void {
    this.toggle = !this.toggle;
    this.commonService.setSideBarToggleBtn(this.toggle);
  }
  ngOnInit(): void {}

}
