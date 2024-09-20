import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contacts: any = [];

  constructor(private commonService: CommonService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getAllContacts()
  }

  /**
   * @description This is get all contacts details method
   * @author Shiva Kant
   * @returns  {Observable<any>} 
   */

  getAllContacts() {
    this.commonService.getAllContacts().subscribe({
      next: (data: any) => {
        this.contacts = data.data.map((contact: any) => {
          const profilePictureUrl = contact.profilePicture
            ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + contact.profilePicture)
            : '../../../assets/mesage_user.jpg';

          return {
            ...contact,
            profilePicture: profilePictureUrl
          };
        });

      }
    });
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