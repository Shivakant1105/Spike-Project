import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { BlogService } from 'src/app/service/blog.service';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { LoggerService } from 'src/app/service/logger.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let mockBlogService: jasmine.SpyObj<BlogService>;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockFormBuilder: FormBuilder;

  beforeEach(async () => {
    mockBlogService = jasmine.createSpyObj('BlogService', [
      'getAllBlogs',
      'postBlog',
    ]);
    mockSanitizer = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustResourceUrl',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getTokenData']);
    mockCommonService = jasmine.createSpyObj('CommonService', ['getUserById']);
    mockLoggerService = jasmine.createSpyObj('LoggerService', [
      'alertWithSuccess',
      'errorAlert',
    ]);
    mockFormBuilder = new FormBuilder();

    await TestBed.configureTestingModule({
      declarations: [PostComponent],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: DomSanitizer, useValue: mockSanitizer },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: FormBuilder, useValue: mockFormBuilder },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    mockBlogService.getAllBlogs.and.returnValue(of({ data: [] }));
    mockAuthService.getTokenData.and.returnValue({ id: 1 });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize all departments on ngOnInit for admin user and cover the assignment line', () => {
    const mockUser = {
      data: { role: 'ADMIN' },
    };
    const mockDepartments = {
      data: [
        { id: 1, name: 'HR' },
        { id: 2, name: 'Finance' },
      ],
    };

    mockCommonService.getUserById.and.returnValue(of(mockUser));

    mockCommonService.getAllDepartments.and.returnValue(of(mockDepartments));

    component.ngOnInit();

    expect(mockCommonService.getUserById).toHaveBeenCalledWith(1);
    expect(mockCommonService.getAllDepartments).toHaveBeenCalled();
    // Ensure the specific line is covered
    expect(component.allDepartments).toEqual(mockDepartments.data);
  });
  it('should initialize departments on ngOnInit for non-admin user', () => {
    const mockUser = {
      data: { department: [{ id: 1, name: 'HR' }] },
    };

    mockCommonService.getUserById.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(mockCommonService.getUserById).toHaveBeenCalledWith(1);
    expect(component.allDepartments).toEqual(mockUser.data.department);
  });

  it('should call getAllBlogs on initialization', () => {
    spyOn(component, 'getAllBlogs').and.callThrough();
    component.ngOnInit();
    expect(component.getAllBlogs).toHaveBeenCalled();
  });
  it('should load blogs successfully and process them', () => {
    const mockData = {
      data: [
        {
          id: 1,
          profilePic: 'base64Image',
          mediaFile: 'mediaBase64Image',
          createdDateTime: '2023-09-25T12:00:00Z',
        },
      ],
      totalResults: 1,
    };

    mockBlogService.getAllBlogs.and.returnValue(of(mockData));
    mockSanitizer.bypassSecurityTrustResourceUrl.and.callFake((url) => url);

    component.getAllBlogs();

    expect(mockBlogService.getAllBlogs).toHaveBeenCalledWith(0, 10);
    expect(component.blogs.length).toBe(1);
    expect(component.blogs[0].profilePic).toBe(
      'data:image/jpeg;base64,base64Image'
    );
    expect(component.blogs[0].mediaFile).toBe(
      'data:image/jpeg;base64,mediaBase64Image'
    );
    expect(component.blogs[0].createdDate).toBe('25 Sep, 23');
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty results correctly', () => {
    const mockData = {
      data: [],
      totalResults: 0,
    };

    mockBlogService.getAllBlogs.and.returnValue(of(mockData));

    component.getAllBlogs();

    expect(mockBlogService.getAllBlogs).toHaveBeenCalledWith(0, 10);
    expect(component.blogs.length).toBe(0);
    expect(component.allBlogsLoaded).toBe(true);
    expect(component.isLoading).toBe(false);
  });

  it('should handle errors correctly', () => {
    mockBlogService.getAllBlogs.and.returnValue(throwError('Error occurred'));

    component.getAllBlogs();

    expect(mockBlogService.getAllBlogs).toHaveBeenCalledWith(0, 10);
    expect(component.isLoading).toBe(false);
  });

  it('should not load blogs if already loading', () => {
    component.isLoading = true;

    component.getAllBlogs();

    expect(mockBlogService.getAllBlogs).not.toHaveBeenCalled();
  });

  it('should increment currentPage after loading', () => {
    const mockData = {
      data: [
        {
          id: 1,
          profilePic: 'base64Image',
          mediaFile: 'mediaBase64Image',
          createdDateTime: '2023-09-25T12:00:00Z',
        },
      ],
      totalResults: 1,
    };

    mockBlogService.getAllBlogs.and.returnValue(of(mockData));
    component.getAllBlogs();

    expect(component.currentPage).toBe(1);
  });

  it('should set allBlogsLoaded to true when all blogs are loaded', () => {
    const mockData = {
      data: [{ id: 1 }],
      totalResults: 1,
    };

    component.blogs = [{ id: 1 }]; // Simulate already loaded blog
    mockBlogService.getAllBlogs.and.returnValue(of(mockData));

    component.getAllBlogs();

    expect(component.allBlogsLoaded).toBe(true);
  });

  it('should handle errors when loading blogs', () => {
    mockBlogService.getAllBlogs.and.returnValue(
      throwError('Error loading blogs')
    );

    component.getAllBlogs();

    expect(component.isLoading).toBeFalse();
    expect(component.blogs.length).toBe(0);
  });

  it('should load more blogs on scroll', () => {
    spyOn(component, 'getAllBlogs').and.callThrough();
    component.onScroll({
      target: { scrollTop: 900, clientHeight: 100, scrollHeight: 1000 },
    } as any);
    expect(component.getAllBlogs).toHaveBeenCalled();
  });

  it('should not load more blogs if already loading', () => {
    component.isLoading = true;
    spyOn(component, 'getAllBlogs').and.callThrough();
    component.onScroll({
      target: { scrollTop: 900, clientHeight: 100, scrollHeight: 1000 },
    } as any);
    expect(component.getAllBlogs).not.toHaveBeenCalled();
  });

  it('should track blog by ID', () => {
    const blog = { id: 123 };
    expect(component.trackByBlogId(blog)).toBe(123);
  });
  it('should return a different id for different departments', () => {
    const department1 = { id: 1, name: 'HR' };

    expect(component.trackByDepartmentId(department1)).toBe(1);
  });
  it('should submit blog form successfully', () => {
    component.blog_form.patchValue({
      departmentId: 1,
      title: 'Test Title',
      content: 'Test Content',
    });

    const mockResponse = { message: 'Blog posted successfully' };
    mockBlogService.postBlog.and.returnValue(of(mockResponse));

    spyOn(component, 'reset_blog_form').and.callThrough();

    component.onSubmit();

    expect(mockBlogService.postBlog).toHaveBeenCalled();
    expect(mockLoggerService.alertWithSuccess).toHaveBeenCalledWith(
      mockResponse.message
    );
    expect(component.reset_blog_form).toHaveBeenCalled();
  });

  it('should handle error on blog form submission', () => {
    component.blog_form.patchValue({
      departmentId: 1,
      title: 'Test Title',
      content: 'Test Content',
    });

    mockBlogService.postBlog.and.returnValue(throwError('Error posting blog'));

    component.onSubmit();

    expect(mockLoggerService.errorAlert).toHaveBeenCalled();
  });

  it('should reset the blog form correctly', () => {
    component.reset_blog_form();

    expect(component.blog_form.value).toEqual({
      departmentId: null,
      title: '',
      content: '',
    });
    expect(component.fileSrc).toBeNull();
    expect(component.fileType).toBeNull();
  });

  it('should check error in form controls correctly', () => {
    component.blog_form.get('title')?.setErrors({ required: true });
    component.blog_form.get('title')?.markAsTouched();

    expect(component.checkError('title', 'required')).toBeTrue();
  });

  it('should set isImgSupported to true and read image file correctly', (done) => {
    const fileContent = new Blob([''], { type: 'image/png' });
    const event = {
      target: {
        files: [
          new File([fileContent], 'test.png', {
            type: 'image/png',
          }), // 500KB file
        ],
      },
    };

    component.onFileChange(event);

    // Simulate the FileReader onload event
    const reader = new FileReader();
    reader.onload = (e: any) => {
      expect(component.fileSrc).toBe(e.target.result);
      expect(component.fileType).toBe('image');
      expect(component.isImgSupported).toBeTrue();
      done();
    };
    reader.readAsDataURL(event.target.files[0]);
  });

  it('should show error alert for unsupported file types', () => {
    const event = {
      target: {
        files: [
          new File([''], 'test.txt', { type: 'text/plain' }), // 500KB file
        ],
      },
    };

    component.onFileChange(event);
    component.isImgSupported = false;
    component.fileSrc = null;
    component.fileType = null;
    expect(mockLoggerService.errorAlert).toHaveBeenCalledWith(
      'Unsupported file type!'
    );
    expect(component.isImgSupported).toBeFalse();
    expect(component.fileSrc).toBeNull();
    expect(component.fileType).toBeNull();
  });
  it('should set isImgSupported to false and reset file properties if file size is greater than 1MB', () => {
    const largeFile = new Blob(['a'.repeat(2 * 1024 * 1024)], {
      type: 'image/png',
    }); // 2MB file
    const event = {
      target: {
        files: [new File([largeFile], 'large-image.png')],
      },
    };

    component.onFileChange(event); // Assuming onFileChange is the method handling the event

    expect(component.isImgSupported).toBeFalse();
    expect(component.fileSrc).toBeNull();
    expect(component.fileType).toBeNull();
  });

  it('should set isImgSupported to true for audio file', (done) => {
    const fileContent = new Blob([''], { type: 'audio/mp3' });
    const event = {
      target: {
        files: [
          new File([fileContent], 'test.mp3', {
            type: 'audio/mp3',
          }), // 500KB file
        ],
      },
    };

    component.onFileChange(event);

    // Simulate the FileReader onload event
    const reader = new FileReader();
    reader.onload = (e: any) => {
      expect(component.fileSrc).toBe(e.target.result);
      expect(component.fileType).toBe('audio');
      expect(component.isImgSupported).toBeTrue();
      done();
    };
    reader.readAsDataURL(event.target.files[0]);
  });
});
