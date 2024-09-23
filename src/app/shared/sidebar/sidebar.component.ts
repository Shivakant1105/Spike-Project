import { Component, } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent  {
  toggle!: boolean;
  unSub = new Subject();

  listOfSidebar: {
    name: string;
    icon: string;
    route: string;
    className: string;
  }[] = [
    {
      name: "Chats",
      icon: "message-circle",
      route: "menu/chat",
      className: "orange",
    },
    {
      name: "Calender",
      icon: "calendar",
      route: "menu/calender",
      className: "green",
    },
    {
      name: "Email",
      icon: "Mail",
      route: "menu/mail",
      className: "red",
    },
    {
      name: "Contact",
      icon: "phone",
      route: "menu/contacts",
      className: "blue",
    },
    {
      name: "Courses",
      icon: "book",
      route: "menu/course",
      className: "grey",
    },
    {
      name: "Employee",
      icon: "users",
      route: "menu/employee",
      className: "orange",
    },
    {
      name: "Notes",
      icon: "book-open",
      route: "menu/notes",
      className: "green",
    },
    {
      name: "Tickets",
      icon: "minus-square",
      route: "menu/tickets",
      className: "red",
    },
    {
      name: "Invoice",
      icon: "folder",
      route: "menu/invoice",
      className: "blue",
    },
    {
      name: "Todo",
      icon: "edit",
      route: "menu/todo",
      className: "grey",
    },
    {
      name: "Taskboard",
      icon: "trello",
      route: "menu/taskboard",
      className: "orange",
    },
  ];

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private route: Router
  ) {
    this.commonService.sideBarTogglebtn.pipe(takeUntil(this.unSub)).subscribe({
      next: (data) => {
        this.toggle = data;
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
    this.authService.clearStorageByKey("tkn");
    this.route.navigateByUrl("/auth/login");
  }
  ngOnDestroy(): void {
    this.unSub.next(null);
    this.unSub.complete();
  }
}
