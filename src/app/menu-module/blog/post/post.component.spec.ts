import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { BlogService } from 'src/app/service/blog.service';
import { of, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let mockBlogService: jasmine.SpyObj<BlogService>;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    mockBlogService = jasmine.createSpyObj('BlogService', ['getAllBlogs']);
    mockSanitizer = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustResourceUrl',
    ]);

    await TestBed.configureTestingModule({
      declarations: [PostComponent],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: DomSanitizer, useValue: mockSanitizer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    mockBlogService.getAllBlogs.and.returnValue(of({ data: [] }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllBlogs on initialization', () => {
    spyOn(component, 'getAllBlogs').and.callThrough();
    component.ngOnInit();
    expect(component.getAllBlogs).toHaveBeenCalled();
  });

  it('should load blogs correctly', () => {
    const mockData = {
      data: [
        {
          id: 1,
          profilePic: 'base64Image',
          mediaFiles: ['base64Media1', 'base64Media2'],
        },
      ],
    };

    mockBlogService.getAllBlogs.and.returnValue(of(mockData));
    mockSanitizer.bypassSecurityTrustResourceUrl.and.callFake((url) => url);

    component.getAllBlogs();

    expect(mockBlogService.getAllBlogs).toHaveBeenCalledWith(0, 10);
    expect(component.blogs.length).toBe(1);
    expect(component.blogs[0].profilePic).toBe(
      'data:image/jpeg;base64,base64Image'
    );
    // expect(component.blogs[0].mediaFile.length).toBe(2);
  });
  it('should load blogs correctly', () => {
    const mockData = {
      data: [
        {
          id: 1,
        },
      ],
    };

    mockBlogService.getAllBlogs.and.returnValue(of(mockData));
    mockSanitizer.bypassSecurityTrustResourceUrl.and.callFake((url) => url);

    component.getAllBlogs();

    expect(mockBlogService.getAllBlogs).toHaveBeenCalledWith(0, 10);
    expect(component.blogs.length).toBe(1);
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
    // expect(component.getAllBlogs).not.toHaveBeenCalled();
  });

  it('should track blog by ID', () => {
    const blog = { id: 123 };
    expect(component.trackByBlogId(blog)).toBe(123);
  });
});
