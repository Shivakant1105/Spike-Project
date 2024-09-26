import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contacts: any = [];
  currentPage: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  constructor(
    private commonService: CommonService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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

    this.commonService
      .getAllContacts(this.currentPage, this.pageSize)
      .subscribe({
        next: (data: any) => {
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
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  /**
   * @description This is a OnScroll method.
   * @author Shiva Kant
   */

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;
    if (scrollTop >= scrollHeight - 400) {
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
}
