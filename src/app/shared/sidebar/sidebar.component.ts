import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/service/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  toggle!: boolean;
  unSub = new Subject();

  constructor(private commonService: CommonService) {
    this.commonService.sideBarTogglebtn.pipe(takeUntil(this.unSub)).subscribe({
      next: (data) => {
        this.toggle = data;
      },
      error: (e) => {
        throw new Error(e);
      },
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unSub.next(null);
    this.unSub.complete();
  }
}
