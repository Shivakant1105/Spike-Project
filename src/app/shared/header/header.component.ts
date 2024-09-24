import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  toggle!: boolean;
  tokenData:any
  userName!:string
  profilePicture!:any
  userRole!:any
  userData!:any
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private route: Router,
    private sanitizer:DomSanitizer
  ) {}
  /**
   * @description fetch id from the tokenData and get all user details by id 
   * @author vivekSengar
   */
  ngOnInit(): void {
    this.tokenData=this.authService.getTokenData()
   this.commonService.getUserById(this.tokenData.id).subscribe({
     next:(user:any)=>{
      this.userData=user.data
        this.userName= user.data.name.split(' ')[0]
        this.profilePicture = user.data.profilePicture
            ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + user.data.profilePicture)
            : '../../../assets/mesage_user.jpg';
      
     }
   })
    
 }
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
