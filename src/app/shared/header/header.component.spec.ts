import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { CommonService } from "src/app/service/common.service";
import { AuthService } from "src/app/service/auth.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let commonService: jasmine.SpyObj<CommonService>;
  let authService: jasmine.SpyObj<AuthService>;

  let sanitizer: jasmine.SpyObj<DomSanitizer>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const commonServiceSpy = jasmine.createSpyObj("CommonService", [
      "setSideBarToggleBtn",
      "getUserById", // Add this for ngOnInit
    ]);

    const authServiceSpy = jasmine.createSpyObj("AuthService", [
      "clearStorageByKey",
      "getTokenData", // Add this for ngOnInit
    ]);

    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    sanitizer = jasmine.createSpyObj("DomSanitizer", [
      "bypassSecurityTrustResourceUrl",
    ]);

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DomSanitizer, useValue: sanitizer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
  });

  it("should toggle the value and call setSideBarToggleBtn", () => {
    component.toggle = false;
    component.toggleFn();
    expect(component.toggle).toBeTrue();
    expect(commonService.setSideBarToggleBtn).toHaveBeenCalledWith(true);

    component.toggleFn();
    expect(component.toggle).toBeFalse();
  });

  it("should clear storage and navigate to login on logout", () => {
    component.logout();
    expect(router.navigateByUrl).toHaveBeenCalledWith("/auth/login");
  });
  it("should initialize user data on ngOnInit profile null", () => {
    const mockTokenData = { id: 1 };
    const mockUserData = {
      data: {
        name: "John Doe",
        profilePicture: null,
      },
    };

    authService.getTokenData.and.returnValue(mockTokenData);
    commonService.getUserById.and.returnValue(of(mockUserData));
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url); // Simplified for testing

    component.ngOnInit();

    expect(authService.getTokenData).toHaveBeenCalled();
    expect(component.profilePicture).toEqual("../../../assets/mesage_user.jpg");
  });

  it("should initialize user data with valid profile picture on ngOnInit", () => {
    const mockTokenData = { id: 1 };
    const mockProfilePicture = "base64EncodedImageString";
    const mockUserData = {
      data: {
        name: "Jane Doe",
        profilePicture: mockProfilePicture,
      },
    };

    authService.getTokenData.and.returnValue(mockTokenData);
    commonService.getUserById.and.returnValue(of(mockUserData));
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url);

    component.ngOnInit();

    expect(authService.getTokenData).toHaveBeenCalled();
    expect(commonService.getUserById).toHaveBeenCalledWith(mockTokenData.id);
    expect(component.userData).toEqual(mockUserData.data);
    expect(component.userName).toEqual("Jane");
    expect(component.profilePicture).toEqual(
      "data:image/jpeg;base64," + mockProfilePicture
    );
  });
});
