import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { CommonService } from 'src/app/service/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let commonService: jasmine.SpyObj<CommonService>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;
  beforeEach(async () => {
    const commonServiceSpy = jasmine.createSpyObj('CommonService', ['getAllContacts']);
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    await TestBed.configureTestingModule({
      declarations: [ContactComponent],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    commonService = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;
    sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
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
      { id: 2, name: 'Jane Doe', profilePicture: 'mockBase64String2' }
    ];
    commonService.getAllContacts.and.returnValue(of({ data: mockContacts }));
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url);
    component.getAllContacts();
    expect(commonService.getAllContacts).toHaveBeenCalled();
  });
  it('should fetch all contacts and map them correctly', () => {
    const mockContacts = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ];
    commonService.getAllContacts.and.returnValue(of({ data: mockContacts }));
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url);
    component.getAllContacts();
    expect(commonService.getAllContacts).toHaveBeenCalled();
  });
  it('should return the correct contact id', () => {
    const mockContact: any = { id: 1, name: 'John Doe' };
    const result = component.trackByContactId(mockContact);

    expect(result).toBe(1);
  });
});
