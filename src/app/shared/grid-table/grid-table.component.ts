import { Component, Input, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
})
export class GridTableComponent implements OnInit {
  constructor() {}

  @Input() colDefs?: ColDef[];
  @Input() rowData: any;
  ngOnInit(): void {}

  defaultColDef: ColDef = {
    minWidth: 200,
    flex: 2,
    sortable: true,
    filter: 'agTextColumnFilter',
  };
}
