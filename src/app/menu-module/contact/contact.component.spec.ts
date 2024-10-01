import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { CommonService } from 'src/app/service/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let commonService: jasmine.SpyObj<CommonService>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;
  let authService: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    const commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'getAllContacts',
      'showLoader',
      'hideLoader',
    ]);
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustResourceUrl',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getTokenData',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ContactComponent],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
    sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    commonService.getAllContacts.and.returnValue(of({ data: [] }));
    authService.getTokenData.and.returnValue({ id: 1 });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllContacts on ngOnInit', () => {
    component.ngOnInit();
    expect(commonService.getAllContacts).toHaveBeenCalled();
  });

  it('should set isLoading to true when loading contacts', () => {
    component.getAllContacts();
    expect(component.isLoading).toBeFalse();
  });

  it('should fetch all contacts and map them correctly with profile pictures', () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', profilePicture: 'mockBase64String1' },
      { id: 2, name: 'Jane Doe', profilePicture: 'mockBase64String2' },
    ];

    commonService.getAllContacts.and.returnValue(
      of({ data: mockContacts, totalContacts: 2 })
    );
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url);

    component.getAllContacts();

    expect(component.contacts.length).toBe(2);
    expect(component.contacts[0].profilePicture).toBe(
      'data:image/jpeg;base64,mockBase64String1'
    );
    expect(component.contacts[1].profilePicture).toBe(
      'data:image/jpeg;base64,mockBase64String2'
    );
    expect(component.isLoading).toBeFalse();
  });

  it('should set default profile picture for contacts without one', () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', profilePicture: null },
      { id: 2, name: 'Jane Doe', profilePicture: null },
    ];

    commonService.getAllContacts.and.returnValue(
      of({ data: mockContacts, totalContacts: 2 })
    );

    component.getAllContacts();

    expect(component.contacts[0].profilePicture).toBe(
      '../../../assets/mesage_user.jpg'
    );
    expect(component.contacts[1].profilePicture).toBe(
      '../../../assets/mesage_user.jpg'
    );
  });

  it('should handle empty data correctly', () => {
    commonService.getAllContacts.and.returnValue(
      of({ data: [], totalContacts: 0 })
    );

    component.getAllContacts();

    expect(component.contacts.length).toBe(0);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors correctly', () => {
    commonService.getAllContacts.and.returnValue(
      throwError('Error fetching contacts')
    );

    component.getAllContacts();

    expect(component.contacts.length).toBe(0);
  });

  it('should not fetch contacts if already loading', () => {
    component.isLoading = true;

    component.getAllContacts();

    expect(commonService.getAllContacts).not.toHaveBeenCalled();
  });

  it('should show loader when fetching contacts', () => {
    component.getAllContacts();
    expect(commonService.showLoader).toHaveBeenCalled();
  });

  it('should hide loader when fetching is complete', () => {
    const mockContacts = [{ id: 1, name: 'John Doe', profilePicture: null }];
    commonService.getAllContacts.and.returnValue(
      of({ data: mockContacts, totalContacts: 1 })
    );

    component.getAllContacts();

    expect(commonService.hideLoader).toHaveBeenCalled();
  });

  it('should call getAllContacts when scrolled near the bottom', () => {
    const event = {
      target: {
        scrollTop: 600,
        clientHeight: 400,
        scrollHeight: 1000,
      },
    } as unknown as Event;

    spyOn(component, 'getAllContacts').and.callThrough();

    component.onScroll(event);

    expect(component.getAllContacts).toHaveBeenCalled();
  });

  it('should return the correct contact id', () => {
    const mockContact: any = { id: 1, name: 'John Doe' };
    const result = component.trackByContactId(mockContact);

    expect(result).toBe(1);
  });
  it('should call getAllContacts when scrolled near the bottom', () => {
    const event = {
      target: {
        scrollTop: 600,
        clientHeight: 400,
        scrollHeight: 1000,
      },
    } as unknown as Event;

    spyOn(component, 'getAllContacts');

    component.onScroll(event);

    expect(component.getAllContacts).toHaveBeenCalled();
  });

  it('should return the correct contact id', () => {
    const mockContact: any = { id: 1, name: 'John Doe' };
    const result = component.trackByContactId(mockContact);

    expect(result).toBe(1);
  });
  it('should return all contacts when searchName is empty', () => {
    component.searchName = '';
    const result = component.filteredContacts;
    expect(result).toEqual(component.contacts);
  });

  it('should return an empty array if no contacts match the searchName', () => {
    component.searchName = 'xyz';
    component.contacts = [{ name: 'xyz' }];
    const result = component.filteredContacts;
    expect(result).toEqual([]);
  });

  it('should be case insensitive when filtering', () => {
    component.searchName = 'AL';
    const result = component.filteredContacts;
    expect(result).toEqual([]);
  });
});
