import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ICellRendererParams } from 'ag-grid-community';
import { MultiValRendererComponent } from './multi-val-renderer.component';

class MockDomSanitizer {
  bypassSecurityTrustResourceUrl(url: string) {
    return url; // Mock implementation
  }
}

describe('MultiValRendererComponent', () => {
  let component: MultiValRendererComponent;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DomSanitizer, useClass: MockDomSanitizer }],
    });

    sanitizer = TestBed.inject(DomSanitizer);
    component = new MultiValRendererComponent(sanitizer);
  });

  it('should set profilePicture to sanitized URL if profilePicture exists', () => {
    const params: ICellRendererParams = {
      data: {
        profilePicture: 'base64string', // Mock base64 string
      },
    } as ICellRendererParams;

    component.agInit(params);

    expect(component.profilePicture).toBe(
      'data:image/jpeg;base64,base64string'
    );
  });

  it('should set profilePicture to default image if profilePicture does not exist', () => {
    const params: ICellRendererParams = {
      data: {
        profilePicture: null, // No profile picture
      },
    } as ICellRendererParams;

    component.agInit(params);

    expect(component.profilePicture).toBe('../../../../assets/mesage_user.jpg');
  });

  it('should update params on refresh', () => {
    const params: ICellRendererParams = {
      data: {
        profilePicture: 'anotherBase64String',
      },
    } as ICellRendererParams;

    component.refresh(params);

    expect(component.params).toBe(params);
  });
});
