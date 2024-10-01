import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { LoaderComponent } from "./loader.component";
import { CommonService } from "src/app/service/common.service";

class MockCommonService {
  loader = new BehaviorSubject<boolean>(false);
}

describe("LoaderComponent", () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let commonService: MockCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [{ provide: CommonService, useClass: MockCommonService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService) as unknown as MockCommonService;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with loading set to false", () => {
    expect(component.loading).toBeFalse();
  });

  it("should subscribe to the loader observable and update loading state on ngOnInit", () => {
    component.ngOnInit();

    commonService.loader.next(true);
    expect(component.loading).toBeTrue();

    commonService.loader.next(false);
    expect(component.loading).toBeFalse();
  });

  it("should unsubscribe on destroy", () => {
    spyOn(component["unSub"], "next");
    spyOn(component["unSub"], "complete");

    component.ngOnDestroy();

    expect(component["unSub"].next).toHaveBeenCalled();
    expect(component["unSub"].complete).toHaveBeenCalled();
  });
});
