import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss'],
})
export class ButtonRendererComponent {
  constructor(private commonServce: CommonService) {
    this.commonServce.toggleTheme
      .pipe(takeUntil(this.unSub))
      .subscribe((theme) => {
        this.theme = theme;
      });
  }

  params: any;
  theme: string = '';
  unSub = new Subject();

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
  deleteData() {
    console.log(this.params.data.id);
    this.params.context.component.deleteEmployee(this.params.data.id);
  }
  editData() {
    this.params.context.component.editEmployee(this.params.data.id);
  }

  ngOnDestroy(): void {
    this.unSub.next(null);
    this.unSub.complete();
  }
}
