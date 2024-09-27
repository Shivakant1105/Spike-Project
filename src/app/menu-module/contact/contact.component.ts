import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contacts: any = [];
  id!: number;
  currentPage: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  allContactsLoaded: boolean = false;
  totalContact: number = 0;
  constructor(
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    let data = this.authService.getTokenData();
    this.id = data.id;
    this.getAllContacts();
  }

  /**
   * @description This is get all contacts details method
   * @author Shiva Kant
   * @returns  {Observable<any>}
   */

  getAllContacts() {
    if (this.isLoading || this.allContactsLoaded) return;

    this.isLoading = true;

    this.commonService
      .getAllContacts(this.id, this.currentPage, this.pageSize)
      .subscribe({
        next: (data: any) => {
          if (this.contacts.length >= data.totalContacts) {
            this.allContactsLoaded = true;
          }
          const newContacts = data.data.map((contact: any) => {
            const profilePictureUrl = contact.profilePicture
              ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  'data:image/jpeg;base64,' + contact.profilePicture
                )
              : '../../../assets/mesage_user.jpg';

            return {
              ...contact,
              profilePicture: profilePictureUrl,
            };
          });

          // Update the contacts array and increment the current page
          this.contacts = [...this.contacts, ...newContacts];
          this.currentPage++;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  /**
 * @description This method handles the scroll event for a container.
 * It checks if the user has scrolled close to the bottom and,
 * if so, triggers the loading of more contacts.
 
 * @author Shiva Kant Mishra
 * @return {void} This method does not return a value.
 */
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;

    if (
      scrollTop >= scrollHeight - 100 &&
      !this.isLoading &&
      !this.allContactsLoaded
    ) {
      this.getAllContacts();
      console.log(this.contacts);
    }
  }

  /**
   * @description This is a trackBy Contact id method.
   * @author Shiva Kant
   * @return {number}
   */

  trackByContactId(contact: any) {
    return contact.id;
  }
}
