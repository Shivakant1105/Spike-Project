import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { SidebarComponent } from "./sidebar.component";
import { AuthService } from "src/app/service/auth.service";
import { CommonService } from "src/app/service/common.service";
import { of } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

describe("SidebarComponent", () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;
  let commonServiceMock: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj("AuthService", [
      "clearStorageByKey",
      "getTokenData",
    ]);

    commonServiceMock = jasmine.createSpyObj(
      "CommonService",
      ["sideBarTogglebtn", "getUserById"],
      {
        sideBarTogglebtn: of(false), // default value for sidebar toggle
      }
    );

    routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    sanitizer = jasmine.createSpyObj("DomSanitizer", [
      "bypassSecurityTrustResourceUrl",
    ]);

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: Router, useValue: routerSpy },
        { provide: DomSanitizer, useValue: sanitizer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should call logout and navigate to login page", () => {
    component.logout();
    expect(authServiceSpy.clearStorageByKey).toHaveBeenCalledWith("tkn");
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith("/auth/login");
  });

  it("should call identify function and return index", () => {
    const index = component.identify(5);
    expect(index).toBe(5);
  });

  it("should unsubscribe from common service on destroy", () => {
    spyOn(component.unSub, "next");
    spyOn(component.unSub, "complete");

    component.ngOnDestroy();

    expect(component.unSub.next).toHaveBeenCalledWith(null);
    expect(component.unSub.complete).toHaveBeenCalled();
  });

  it("should initialize user data on ngOnInit with valid user data", () => {
    const mockTokenData = { id: 1 };
    const mockUserData = {
      data: {
        name: "John Doe",
        profilePicture: "someBase64EncodedImageString",
      },
    };

    authServiceSpy.getTokenData.and.returnValue(mockTokenData);
    commonServiceMock.getUserById.and.returnValue(of(mockUserData));
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url); // Simplified for testing

    component.ngOnInit();

    expect(authServiceSpy.getTokenData).toHaveBeenCalled();
    expect(commonServiceMock.getUserById).toHaveBeenCalledWith(
      mockTokenData.id
    );
    expect(component.userData).toEqual(mockUserData.data);
    expect(component.userName).toEqual("John");
    expect(component.profilePicture).toEqual(
      "data:image/jpeg;base64,someBase64EncodedImageString"
    );
  });

  it("should initialize user data on ngOnInit with profile null", () => {
    const mockTokenData = { id: 1 };
    const mockUserData = {
      data: {
        name: "John Doe",
        profilePicture: null,
      },
    };

    authServiceSpy.getTokenData.and.returnValue(mockTokenData);
    commonServiceMock.getUserById.and.returnValue(of(mockUserData));
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url); // Simplified for testing

    component.ngOnInit();

    expect(authServiceSpy.getTokenData).toHaveBeenCalled();
    expect(commonServiceMock.getUserById).toHaveBeenCalledWith(
      mockTokenData.id
    );
    expect(component.userData).toEqual(mockUserData.data);
    expect(component.userName).toEqual("John");
    expect(component.profilePicture).toEqual("../../../assets/mesage_user.jpg");
  });
});
