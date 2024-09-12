import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'spike-project';
  isLogIn: boolean = true;
  isLightTheme!: boolean;
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
  /**  
    * @description This is a theme function.  
    * @author Shiva Kant Mishra
  */

  ngOnInit(): void {

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.isLightTheme = storedTheme === 'light';
    } else {

      this.isLightTheme = true;
    }
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
    localStorage.setItem('theme', this.isLightTheme ? 'light' : 'dark');
  }

}
