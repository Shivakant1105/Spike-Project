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
  isLoading: boolean = false;
  pageSize: number = 10;
  totalContact!: number;
  searchName: string = '';
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
    if (this.isLoading) return;
    this.isLoading = true;

    if (this.contacts.length !== this.totalContact) {
      this.commonService.showLoader();
      this.commonService
        .getAllContacts(this.id, this.currentPage, this.pageSize)
        .subscribe({
          next: (data: any) => {
            this.totalContact = data.totalContacts;
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

            this.contacts = [...this.contacts, ...newContacts];
            this.currentPage++;
            this.isLoading = false;
            this.commonService.hideLoader();
          },
          error: () => {
            this.commonService.hideLoader();
          },
        });
    }
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

    if (scrollTop >= scrollHeight - 100) {
      this.getAllContacts();
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
  /**
   * @description This function filters contacts based on the search name.
   * @author Shiva Kant
   * @param {string} searchName - The name to search for in the contacts.
   * @param {Array} contacts - The list of contacts to filter.
   * @return {Array} - The filtered list of contacts.
   */
  get filteredContacts() {
    if (!this.searchName) {
      return this.contacts;
    }
    const name = this.searchName.toLowerCase();
    return this.contacts.filter((contact: any) =>
      contact.name.toLowerCase().includes(name)
    );
  }
}
