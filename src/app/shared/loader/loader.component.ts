import { Component, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { CommonService } from "src/app/service/common.service";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent implements OnInit {
  unSub = new Subject();
  loading: boolean = false;
  constructor(private commomService: CommonService) {}
  ngOnInit(): void {
    this.commomService.lodder.pipe(takeUntil(this.unSub)).subscribe({
      next: (data) => {
        this.loading = data;
      },
    });
  }
  ngOnDestroy(): void {
    this.unSub.next(null);
    this.unSub.complete();
  }
}
