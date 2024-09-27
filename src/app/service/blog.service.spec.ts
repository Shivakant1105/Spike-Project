import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService],
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
    service['baseUrl'] = baseUrl;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllBlogs', () => {
    it('should return an Observable of blogs', () => {
      const dummyBlogs = [
        { id: 1, title: 'Test Blog' },
        { id: 2, title: 'Another Blog' },
      ];
      const pageNo = 1;
      const pageSize = 10;

      service.getAllBlogs(pageNo, pageSize).subscribe((blogs) => {
        expect(blogs.length).toBe(2);
        expect(blogs).toEqual(dummyBlogs);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/blog/get-all?pageNum=${pageNo}&pageSize=${pageSize}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyBlogs); // Simulate the server response
    });
  });

  describe('postBlog', () => {
    it('should post a blog and return the response', () => {
      const formData = new FormData();
      formData.append('title', 'New Blog');
      formData.append('content', 'This is the content of the new blog');

      service.postBlog(formData).subscribe((response) => {
        expect(response).toEqual({
          success: true,
          message: 'Blog created successfully',
        });
      });

      const req = httpMock.expectOne(`${baseUrl}/blog/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.has('title')).toBeTrue();
      expect(req.request.body.has('content')).toBeTrue();
      req.flush({ success: true, message: 'Blog created successfully' });
    });
  });
});
