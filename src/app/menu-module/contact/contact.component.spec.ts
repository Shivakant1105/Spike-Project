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
  it('should fetch all contacts and map them correctly', () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', profilePicture: 'mockBase64String1' },
      { id: 2, name: 'Jane Doe', profilePicture: 'mockBase64String2' },
    ];

    commonService.getAllContacts.and.returnValue(
      of({ data: mockContacts, totalContacts: 2 })
    );
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url);

    component.getAllContacts();

    expect(commonService.getAllContacts).toHaveBeenCalledWith(
      component.id,
      component.currentPage,
      component.pageSize
    );
    expect(component.contacts.length).toBe(2);
    expect(component.contacts[0].profilePicture).toBe('mockBase64String1');
    expect(component.contacts[1].profilePicture).toBe('mockBase64String2');
    expect(component.isLoading).toBeFalse();
  });
  it('should fetch all contacts and map them correctly', () => {
    const mockContacts = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];

    commonService.getAllContacts.and.returnValue(
      of({ data: mockContacts, totalContacts: 2 })
    );

    component.getAllContacts();

    expect(commonService.getAllContacts).toHaveBeenCalledWith(
      component.id,
      component.currentPage,
      component.pageSize
    );
    expect(component.contacts.length).toBe(2);
    expect(component.contacts[0].profilePicture).toBe('mockBase64String1');
    expect(component.contacts[1].profilePicture).toBe('mockBase64String2');
    expect(component.isLoading).toBeFalse();
  });
  it('should handle empty data correctly', () => {
    commonService.getAllContacts.and.returnValue(
      of({ data: [], totalContacts: 0 })
    );

    component.getAllContacts();

    expect(commonService.getAllContacts).toHaveBeenCalled();
    expect(component.contacts.length).toBe(0);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors correctly', () => {
    commonService.getAllContacts.and.returnValue(
      throwError('Error fetching contacts')
    );

    component.getAllContacts();

    expect(commonService.getAllContacts).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });
  it('should handle error during contact fetch', () => {
    commonService.getAllContacts.and.returnValue(
      throwError('Error fetching contacts')
    );

    component.getAllContacts();

    expect(component.contacts.length).toBe(0);
    expect(component.isLoading).toBeFalse();
  });

  it('should not fetch contacts if already loading', () => {
    component.isLoading = true;

    component.getAllContacts();

    expect(commonService.getAllContacts).not.toHaveBeenCalled();
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
});
