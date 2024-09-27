import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICellRendererParams } from 'ag-grid-community';
@Component({
  selector: 'app-multi-val-renderer',
  templateUrl: './multi-val-renderer.component.html',
  styleUrls: ['./multi-val-renderer.component.scss'],
})
export class MultiValRendererComponent {
  constructor(private sanitizer: DomSanitizer) {}

  params: any;
  profilePicture: any;
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.profilePicture = params.data.profilePicture
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpeg;base64,' + params.data.profilePicture
        )
      : '../../../../assets/mesage_user.jpg';
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
}
