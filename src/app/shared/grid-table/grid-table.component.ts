import { Component, Input } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
})
export class GridTableComponent {
  constructor(private commonService: CommonService) {
    this.commonService.toggleTheme
      .pipe(takeUntil(this.unSub))
      .subscribe((theme: string) => {
        this.themeClass =
          theme == 'light-theme' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark';
      });
  }

  @Input() colDefs?: ColDef[];
  @Input() rowData: any;
  @Input() gridOptions: any;

  themeClass: string = '';
  unSub = new Subject();

  defaultColDef: ColDef = {
    minWidth: 250,
    flex: 2,
    sortable: true,
    filter: 'agTextColumnFilter',
  };

  ngOnDestroy(): void {
    this.unSub.next(null);
    this.unSub.complete();
  }
}
