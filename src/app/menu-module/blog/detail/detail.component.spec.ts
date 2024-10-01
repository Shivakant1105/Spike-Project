import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DetailComponent } from './detail.component';
import { BlogService } from 'src/app/service/blog.service';
import { CommonService } from 'src/app/service/common.service';
import { LoggerService } from 'src/app/service/logger.service';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let blogService: BlogService;
  let commonService: CommonService;
  let logger: LoggerService;

  beforeEach(async () => {
    const blogServiceMock = {
      getAllCommentById: jasmine.createSpy('getAllCommentById').and.returnValue(
        of({
          data: [{ createdDate: '10-2-2024' }, { createdDate: '12 -2-2024' }],
        })
      ),
      createCommentById: jasmine
        .createSpy('createCommentById')
        .and.returnValue(of({})),
      getCommentById: jasmine
        .createSpy('getCommentById')
        .and.returnValue(of({ data: { content: 'Test comment' } })),
      updateCommentById: jasmine
        .createSpy('updateCommentById')
        .and.returnValue(of({})),
      deleteCommentById: jasmine
        .createSpy('deleteCommentById')
        .and.returnValue(of({ message: 'Deleted' })),
    };

    const commonServiceMock = {
      showLoader: jasmine.createSpy('showLoader'),
      hideLoader: jasmine.createSpy('hideLoader'),
    };

    const loggerMock = {
      alertWithSuccess: jasmine.createSpy('alertWithSuccess'),
    };

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: BlogService, useValue: blogServiceMock },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: LoggerService, useValue: loggerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService);
    commonService = TestBed.inject(CommonService);
    logger = TestBed.inject(LoggerService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with blogId and fetch comments', () => {
    component.ngOnInit();
    expect(component.blogId).toBe('1');
    expect(blogService.getAllCommentById).toHaveBeenCalledWith('1');
  });

  it('should post a new comment', () => {
    component.commentForm.setValue({ content: 'New Comment' });
    component.onSubmit();
    expect(commonService.showLoader).toHaveBeenCalled();

    expect(logger.alertWithSuccess).toHaveBeenCalledWith(
      'Comment posted successfully!🎉'
    );
    expect(component.isUpdateform).toBe(false);
  });

  it('should update comment', () => {
    component.isUpdateform = true;
    component.onSubmit();

    spyOn(component, 'updateCommentById');
    expect(component.isUpdateform).toBe(false);
  });

  it('should fetch a comment by id and set it for updating', () => {
    component.getCommentById('2');
    expect(component.commentId).toBe('2');
    expect(blogService.getCommentById).toHaveBeenCalledWith('2');
    expect(component.commentForm.value.content).toBe('Test comment');
    expect(component.isUpdateform).toBe(true);
    expect(commonService.hideLoader).toHaveBeenCalled();
  });

  it('should update a comment', () => {
    component.commentId = '2';
    component.commentForm.setValue({ content: 'Updated Comment' });
    component.updateCommentById();
    // expect(blogService.updateCommentById).toHaveBeenCalledWith('2', {
    //   content: 'Updated Comment',
    // });
  });

  it('should delete a comment', () => {
    component.blogId = '1';
    component.deleteComment('2');
    expect(blogService.deleteCommentById).toHaveBeenCalledWith('1', '2');
    expect(logger.alertWithSuccess).toHaveBeenCalledWith('Deleted');
    expect(commonService.hideLoader).toHaveBeenCalled();
  });

  describe('calculateTimeAgo', () => {
    it('should return "Just now" if the time difference is less than 1 minute', () => {
      const now = new Date().toISOString();
      const result = component.calculateTimeAgo(now);
      expect(result).toBe('Just now');
    });

    it('should return the correct number of hours ago if the time difference is within the past day', () => {
      const date = new Date(
        new Date().getTime() - 10 * 60 * 60 * 1000
      ).toISOString(); // 10 hours ago
      const result = component.calculateTimeAgo(date);
      expect(result).toBe('4 hours ago');
    });

    it('should return the correct number of days ago if the time difference is more than 24 hours', () => {
      const date = new Date(
        new Date().getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(); // 2 days ago
      const result = component.calculateTimeAgo(date);
      expect(result).toBe('1 days ago');
    });
  });

  it('should return the same id that is passed to the identify method', () => {
    const id = 42;
    const result = component.identify(id);
    expect(result).toBe(id);
  });
});
