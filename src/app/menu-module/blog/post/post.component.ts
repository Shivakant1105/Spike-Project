import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/service/blog.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  blogs: any = [];
  currentPage: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;

  constructor(
    private blogService: BlogService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getAllBlogs();
  }

  /**
   * @description This is get all blogs method
   * @author Shiva Kant
   * @returns  {Observable<any>}
   */

  getAllBlogs() {
    if (this.isLoading) return;
    this.isLoading = true;

    this.blogService.getAllBlogs(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        const newBlogs = data.data.map((blog: any) => {
          const profilePictureUrl = blog.profilePic
            ? this.sanitizer.bypassSecurityTrustResourceUrl(
                'data:image/jpeg;base64,' + blog.profilePic
              )
            : '../../../assets/mesage_user.jpg';

          const mediaFiles = blog.profilePic
            ? this.sanitizer.bypassSecurityTrustResourceUrl(
                'data:image/jpeg;base64,' + blog.profilePic
              )
            : '../../../assets/blog-img1.jpg';

          return {
            ...blog,
            profilePic: profilePictureUrl,
            mediaFile: mediaFiles,
          };
        });

        this.blogs = [...this.blogs, ...newBlogs];
        this.currentPage++;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  /**
   * @description This is a OnScroll method.
   * @author Shiva Kant
   */
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;

    if (scrollTop >= scrollHeight - 100) {
      this.getAllBlogs();
    }
  }
  /**
   * @description This is a trackBy blog id method.
   * @author Shiva Kant
   * @return {number}
   */
  trackByBlogId(blog: any) {
    return blog.id;
  }
}
