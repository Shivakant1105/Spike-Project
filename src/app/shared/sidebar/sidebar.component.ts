import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  toggle!: boolean;
  userData!: any;
  tokenData!: any;
  profilePicture: any;
  userName!: string;
  unSub = new Subject();

  listOfSidebar: {
    name: string;
    icon: string;
    route: string;
    className: string;
  }[] = [
    {
      name: 'Chats',
      icon: 'message-circle',
      route: 'menu/chat',
      className: 'orange',
    },
    {
      name: 'Calender',
      icon: 'calendar',
      route: 'menu/calender',
      className: 'green',
    },
    {
      name: 'Email',
      icon: 'Mail',
      route: 'menu/mail',
      className: 'red',
    },
    {
      name: 'Contact',
      icon: 'phone',
      route: 'menu/contacts',
      className: 'blue',
    },
    {
      name: 'Courses',
      icon: 'book',
      route: 'menu/course',
      className: 'grey',
    },
    {
      name: 'Employee',
      icon: 'users',
      route: 'menu/employee',
      className: 'orange',
    },
    {
      name: 'Notes',
      icon: 'book-open',
      route: 'menu/notes',
      className: 'green',
    },
    {
      name: 'Tickets',
      icon: 'minus-square',
      route: 'menu/tickets',
      className: 'red',
    },

    {
      name: 'Todo',
      icon: 'edit',
      route: 'menu/todo',
      className: 'blue',
    },
    {
      name: 'Taskboard',
      icon: 'trello',
      route: 'menu/taskboard',
      className: 'grey',
    },
    {
      name: 'Blog',
      icon: 'life-buoy',
      route: 'menu/post',
      className: 'orange',
    },
  ];

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private route: Router,
    private sanitizer: DomSanitizer
  ) {
    this.commonService.sideBarTogglebtn.pipe(takeUntil(this.unSub)).subscribe({
      next: (data) => {
        this.toggle = data;
      },
    });
  }

  /**
   * @description fetch id from the tokenData and get all user details by id
   * @author vivekSengar
   */
  ngOnInit(): void {
    this.tokenData = this.authService.getTokenData();
    this.commonService.getUserById(this.tokenData.id).subscribe({
      next: (user: any) => {
        this.userData = user.data;
        this.userName = user.data.name.split(' ')[0];
        this.profilePicture = user.data.profilePicture
          ? this.sanitizer.bypassSecurityTrustResourceUrl(
              'data:image/jpeg;base64,' + user.data.profilePicture
            )
          : '../../../assets/mesage_user.jpg';
      },
    });
  }

  /**
   * @description This is a trackBy function.
   * @author Gautam Yadav
   * @param {number} index
   * @return {number}
   */
  identify(index: number): number {
    return index;
  }
  /**
   * @description This is a logout button and here we re-direct to login page.
   * @author Gautam Yadav
   * @return {void} Return a void
   */
  logout() {
    this.authService.clearStorageByKey('tkn');
    this.route.navigateByUrl('/auth/login');
  }
  ngOnDestroy(): void {
    this.unSub.next(null);
    this.unSub.complete();
  }
}
