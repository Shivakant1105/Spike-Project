import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  @ViewChild('theme') themeElem!: ElementRef<any>

  title = 'spike-project';
  isLogIn: boolean = true;

  isTheme: string = '';
  /*
   * @description Monitors router events and sets the login state based on the current URL.
   * @author Gautam Yadav
   * @param {Router} router - Angular Router used to subscribe to navigation events
   */
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/auth/login') {
          this.isLogIn = true;
        } else {
          this.isLogIn = false;
        }
      }
    });
  }

  ngOnInit(): void {

  }

  /**  
    * @description This is a theme function.  
    * @author Shiva Kant Mishra
  */
  ngAfterViewInit() {
    this.isTheme = localStorage.getItem('theme') as string;

    if (this.isTheme == null) {
      this.themeElem.nativeElement.classList.add("light-theme");
      localStorage.setItem('theme', "light-theme");
    } else {
      this.themeElem?.nativeElement.classList.add(this.isTheme);
    }
  }

  toggleTheme() {
    if (this.themeElem.nativeElement.classList.contains('dark-theme')) {
      this.themeElem.nativeElement.classList.replace("dark-theme", "light-theme");
      this.isTheme = 'light-theme';

    } else {
      this.themeElem.nativeElement.classList.replace("light-theme", "dark-theme");
      this.isTheme = 'dark-theme'
    }

    localStorage.setItem('theme', this.isTheme);
  }
}