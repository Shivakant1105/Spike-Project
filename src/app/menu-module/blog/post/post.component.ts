import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { departments } from 'src/app/modal/user';
import { AuthService } from 'src/app/service/auth.service';
import { BlogService } from 'src/app/service/blog.service';
import { CommonService } from 'src/app/service/common.service';
import { LoggerService } from 'src/app/service/logger.service';

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
  allDepartments: departments[] = [];
  allBlogsLoaded: boolean = false;
  fileSrc: string | ArrayBuffer | File | null = null;
  isImgSupported: boolean = true;
  fileType: 'image' | 'audio' | null = null;

  constructor(
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    const id = this.authService.getTokenData().id;
    this.commonService.getUserById(id).subscribe({
      next: (user: any) => {
        if (user.data.role === 'ADMIN') {
          this.commonService.getAllDepartments().subscribe({
            next: (res: any) => {
              this.allDepartments = res.data;
            },
          });
        } else {
          this.allDepartments = user.data.department;
        }
      },
    });
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
        console.log(data);

        if (this.blogs.length >= data.totalResults) {
          this.allBlogsLoaded = true;
        }
        const newBlogs = data.data.map((blog: any) => {
          const profilePictureUrl = blog.profilePic
            ? this.sanitizer.bypassSecurityTrustResourceUrl(
                'data:image/jpeg;base64,' + blog.profilePic
              )
            : '../../../assets/mesage_user.jpg';

          const mediaFiles = blog.mediaFile
            ? this.sanitizer.bypassSecurityTrustResourceUrl(
                'data:image/jpeg;base64,' + blog.mediaFile
              )
            : '../../../assets/blog-img1.jpg';
          // const mediaFiles = blog.mediaFile
          //   ? this.sanitizer.bypassSecurityTrustResourceUrl(
          //       'data:image/jpeg;base64,' + blog.mediaFile
          //     )
          //   : '../../../assets/blog-img1.jpg';

          const date = new Date(blog.createdDateTime);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear().toString().slice(-2);
          const createdDated = `${day} ${month}, ${year}`;

          return {
            ...blog,
            createdDate: createdDated,
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
 * @description This method handles the scroll event for a container.
 * It checks if the user has scrolled close to the bottom and,
 * if so, triggers the loading of more blogs.
 
 * @author Shiva Kant Mishra
 * @return {void} This method does not return a value.
 */
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;

    if (
      scrollTop >= scrollHeight - 100 &&
      !this.isLoading &&
      !this.allBlogsLoaded
    ) {
      this.getAllBlogs();
      console.log(this.blogs);
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

  /**
   * @description This is a trackBy department id method.
   * @author Jagdish
   * @return {number}
   */
  trackByDepartmentId(department: any): number {
    return department.id;
  }

  blog_form = this.fb.group({
    departmentId: [null, Validators.required],
    title: ['', Validators.required],
    content: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  /**
   * @description This is method to check error in formControls.
   * @author Jagdish
   * @param {string} fieldName
   * @param {string} errorName
   * @returns {boolean | undefined}
   */
  checkError(fieldName: string, errorName: string): boolean | undefined {
    return (
      this.blog_form.get(fieldName)!.hasError(errorName) &&
      this.blog_form.get(fieldName)!.touched
    );
  }

  /**
   * @description This method is responsible for submiting blog_form and posting a blog to the backend server.
   * @author Jagdish
   * @returns {void}
   */

  onSubmit(): void {
    if (this.blog_form.valid) {
      let formData = new FormData();
      let departmentId = +this.blog_form.controls['departmentId'].value;

      formData.append('departmentId', departmentId as any);
      formData.append('title', this.blog_form.value.title);
      formData.append('content', this.blog_form.value.content);

      if (this.fileSrc) {
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput && fileInput.files) {
          const file = fileInput.files[0];
          if (file) {
            formData.append('media', file);
          }
        }
      }

      this.blogService.postBlog(formData).subscribe({
        next: (response) => {
          this.loggerService.alertWithSuccess(response.message);
          this.reset_blog_form();
        },
        error: (_err) => {
          this.loggerService.errorAlert('ops something went wrong!');
        },
      });
    }
  }

  /**
   * @description This method handles file selection changes, reading the selected file as a data URL and determining its type (image, audio, or video).
   * @author Jagdish
   * @returns {void}
   */

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file.size > 1 * 1024 * 1024) {
      // this.loggerService.errorAlert('Selected Image should be 1 mb!');
      this.isImgSupported = false;
      this.fileSrc = null;
      this.fileType = null;
      return;
    }
    if (file) {
      this.isImgSupported = true;
      const reader = new FileReader();
      const fileType = file.type.split('/')[0]; //  "image", "audio", "video"

      reader.onload = (e: any) => {
        this.fileSrc = e.target.result;
        this.fileType = fileType as 'image' | 'audio';
      };

      if (fileType === 'image' || fileType === 'audio') {
        reader.readAsDataURL(file);
      } else {
        this.loggerService.errorAlert('Unsupported file type!');
      }
    }
  }

  /**
   * @description This method reset the blog form and patches default values to them.
   * @author Jagdish
   * @returns {void}
   */

  reset_blog_form(): void {
    this.blog_form.reset();
    this.blog_form.patchValue({
      departmentId: null,
      title: '',
      content: '',
    });
    this.fileSrc = null;
    this.fileType = null;
  }

  /**
   * @description This method reset the blog form while opening blog form popup .
   * @author Jagdish
   * @returns {void}
   */

  openAddBlogForm(): void {
    this.blog_form.reset();
    this.blog_form.patchValue({
      departmentId: null,
      title: '',
      content: '',
    });
    this.fileSrc = null;
    this.fileType = null;
  }
}
