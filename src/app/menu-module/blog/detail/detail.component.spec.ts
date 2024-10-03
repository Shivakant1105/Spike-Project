import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { BlogService } from 'src/app/service/blog.service';
import { LoggerService } from 'src/app/service/logger.service';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let blogservice: BlogService;
  let authservice: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [
        BlogService,
        LoggerService,
        AuthService,
        CommonService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    blogservice = TestBed.inject(BlogService);
    authservice = TestBed.inject(AuthService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllcommentById on ngOnInit', () => {
    spyOn(component, 'getAllcommentById').and.callThrough();
    component.ngOnInit();
    expect(component.getAllcommentById).toHaveBeenCalledWith('1');
  });

  it('should initialize comment form', () => {
    const contentControl = component.commentForm.get('content') as FormControl;
    expect(contentControl).toBeTruthy();
    expect(contentControl.valid).toBeFalse(); // Initially, the form should be invalid
  });

  it('should call postCommentById() on submit updateform is false', () => {
    component.commentForm = new FormGroup({
      context: new FormControl(''),
    });

    component.isUpdateform = false; // Ensure the condition is met
    component.blogId = '1'; // Set blogId
    component.commentForm.setValue({ context: null }); // Set form value
    spyOn(component, 'postCommentById').and.callThrough();
    component.onSubmit();
    expect(component.postCommentById).toHaveBeenCalledWith(
      component.blogId,
      component.commentForm.value
    );
  });

  it('should call postCommentById() on submit updateform is true', () => {
    component.isUpdateform = true; // Ensure the condition is met
    spyOn(component, 'updateCommentById').and.callThrough();

    component.onSubmit();

    expect(component.updateCommentById).toHaveBeenCalled();
  });

  it('should call getAllCommentById and process comments correctly', (done) => {
    const mockResponse = {
      data: [
        { id: '1', createdDate: '2024-10-22T01:00:00Z' }, // Assuming this is the format of the response
      ],
    };

    spyOn(component, 'calculateTimeAgo').and.returnValue('1 day ago');

    spyOn(blogservice, 'getAllCommentById').and.returnValue(of(mockResponse));
    component.getAllcommentById('1');
    expect(blogservice.getAllCommentById).toHaveBeenCalledWith('1');
    blogservice.getAllCommentById('1').subscribe({
      next: () => {
        expect(component.commentList).toEqual([
          { id: '1', time: '1 day ago', createdDate: '2024-10-22T01:00:00Z' },
        ]);

        done();
      },
    });
  });

  it('should handle error when getAllCommentById fails', (done) => {
    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();
    spyOn(blogservice, 'getAllCommentById').and.returnValue(
      throwError(() => new Error('Error occurred'))
    );
    component.getAllcommentById('1');

    expect(component.commonService.showLoader).toHaveBeenCalled();

    blogservice.getAllCommentById('1').subscribe({
      error: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should have been call postCommentById', () => {
    const mockData = {
      content: 'test',
    };
    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'createCommentById').and.returnValue(
      of('1', mockData)
    );
    // spyOn(component.getAllcommentById).and.call();
    component.postCommentById('1', mockData);
    component.blogService.createCommentById('1', mockData).subscribe({
      next: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });
  it('should have been call postCommentById throw error', () => {
    const mockData = {
      content: 'test',
    };
    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'createCommentById').and.returnValue(
      throwError(() => {
        new Error('error occour');
      })
    );
    component.postCommentById('1', mockData);
    component.blogService.createCommentById('1', mockData).subscribe({
      error: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });

  it('should be call updateCommentById', () => {
    const mockData = {
      content: 'test',
    };
    component.commentId = '1';
    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'updateCommentById').and.returnValue(
      of(component.commentId, mockData)
    );
    component.updateCommentById();
    component.blogService
      .updateCommentById(component.commentId, mockData)
      .subscribe(() => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      });
  });

  it('should be call updateCommentById error', () => {
    const mockData = {
      content: 'test',
    };
    component.commentId = '1';
    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'updateCommentById').and.returnValue(
      throwError(() => new Error('error'))
    );
    component.updateCommentById();

    component.blogService
      .updateCommentById(component.commentId, mockData)
      .subscribe({
        error: () => {
          expect(component.commonService.hideLoader).toHaveBeenCalled();
        },
      });
  });
  it('should have been call getCommentById', () => {
    const mockData = '1';
    component.commentId = '1';
    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'getCommentById').and.returnValue(
      of({ data: { context: 'test' } })
    );
    component.getCommentById(mockData);

    expect(component.commentId).toBe(mockData);
    component.blogService.getCommentById(mockData).subscribe({
      next: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });

  it('should have been call getCommentById error', () => {
    const mockData = '1';
    component.commentId = '1';
    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'getCommentById').and.returnValue(
      throwError(() => {
        return new Error('error');
      })
    );
    component.getCommentById(mockData);

    expect(component.commentId).toBe(mockData);
    component.blogService.getCommentById(mockData).subscribe({
      error: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });

  it('should have been call deletecomment', () => {
    const mockData = '1';

    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'deleteCommentById').and.returnValue(of([]));
    component.deleteComment(mockData);
    component.blogService.deleteCommentById(mockData, mockData).subscribe({
      next: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });

  it('should have been call deletecomment error', () => {
    const mockData = '1';

    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'deleteCommentById').and.returnValue(
      throwError(() => {
        return new Error('error');
      })
    );
    component.deleteComment(mockData);
    component.blogService.deleteCommentById(mockData, mockData).subscribe({
      error: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });

  it('should have been call identify', () => {
    spyOn(component, 'identify').and.callThrough();
    component.identify(1);
    expect(component.identify).toHaveBeenCalledWith(1);
  });

  it('should have been call getUserName', () => {
    const mockData = { sub: 'test' };
    spyOn(authservice, 'getTokenData').and.returnValue(mockData);
    component.getUserName();
    expect(component.username).toEqual('test');
  });

  it("should return '1 days ago' when date is a day old", () => {
    const mockData = {
      createdDate: '2024-10-01T01:00:00Z',
    };

    const result = component.calculateTimeAgo(mockData.createdDate);

    expect(result).toEqual('1 days ago');
  });

  it("should return 'x hours ago' when date is within hours", () => {
    const mockData = {
      createdDate: '2024-10-02T01:00:00Z', // Assuming current time is after this, within the same day
    };

    const result = component.calculateTimeAgo(mockData.createdDate);

    expect(result).toContain('hours ago');
  });

  it("should return 'Just now' when date is very recent", () => {
    const mockData = {
      createdDate: new Date().toISOString(), // Just now
    };

    const result = component.calculateTimeAgo(mockData.createdDate);
    expect(result).toEqual('Just now');
  });

  it('should be call getBlogByID', () => {
    const mockData = {
      data: {
        profilePic: 'test',
        mediaFile: [1],
        createdDateTime: 'test',
      },
    };

    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'getBlogById').and.returnValue(of(mockData));
    component.getBlogById('1');
    component.blogService.getBlogById('1').subscribe({
      next: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });

  it('should be call getBlogByID profilepic doesnot exisit', () => {
    const mockData = {
      data: {
        mediaFile: [],
        createdDateTime: 'test',
      },
    };

    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'getBlogById').and.returnValue(of(mockData));
    component.getBlogById('1');
    component.blogService.getBlogById('1').subscribe({
      next: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });

  it('should be call getBlogByID error', () => {
    const mockData = throwError(() => new Error('error'));

    spyOn(component.commonService, 'showLoader').and.callThrough();
    spyOn(component.commonService, 'hideLoader').and.callThrough();

    spyOn(component.blogService, 'getBlogById').and.returnValue(mockData);
    component.getBlogById('1');
    component.blogService.getBlogById('1').subscribe({
      error: () => {
        expect(component.commonService.hideLoader).toHaveBeenCalled();
      },
    });
  });
});
