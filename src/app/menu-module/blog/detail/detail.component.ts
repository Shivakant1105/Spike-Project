import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

import { BlogService } from 'src/app/service/blog.service';
import { CommonService } from 'src/app/service/common.service';
import { LoggerService } from 'src/app/service/logger.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  commentList: any[] = [];
  commentId!: string;
  blogId!: string;
  isUpdateform: boolean = false;
  count: number = 0;
  blogDetail: any;
  username!: string;
  commentForm!: FormGroup;

  constructor(
    public blogService: BlogService,
    private logger: LoggerService,
    private actRoute: ActivatedRoute,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.commentForm = new FormGroup({
      content: new FormControl('', [
        Validators.required,
        Validators.maxLength(970),
      ]),
    });
  }

  ngOnInit(): void {
    this.blogId = this.actRoute.snapshot.paramMap.get('id')!;
    this.getUserName();
    this.getBlogById(this.blogId);
    this.getAllcommentById(this.blogId);
    this.commentForm.get('content')!.valueChanges.subscribe((res) => {
      this.count = res!.length;
    });
  }
  /**
   * @description This is a submit function
   * @author Gautam Yadav
   * @return {void} Return a void
   */
  onSubmit(): void {
    if (!this.isUpdateform) {
      this.postCommentById(this.blogId, this.commentForm.value);
    } else {
      this.updateCommentById();
    }
    this.isUpdateform = false;
    this.commentForm.reset();
  }

  /**
   * @description Fetches all comments for the given blog ID and formats the creation date.
   * @author Gautam Yadav
   * @param {any} id - A any param
   * @return {void} Return a void
   */
  getAllcommentById(id: any): void {
    this.commonService.showLoader();

    this.blogService.getAllCommentById(id).subscribe({
      next: (res) => {
        this.commentList = res.data.map((data: any) => {
          return { ...data, time: this.calculateTimeAgo(data.createdDate) };
        });

        // we remove because api response time different
        // this.commonService.hideLoader();
      },
      error: () => {
        this.commonService.hideLoader();
      },
    });
  }
  /**
   * @description Submits a new comment and refreshes the comment list.
   * @author Gautam Yadav
   * @param {any} id - A string param
   * @param {any} payload - A number param
   * @return {void} Return a void
   */
  postCommentById(id: any, payload: any): void {
    this.commonService.showLoader();

    const formData = new FormData();
    formData.append('content', payload.content);
    this.blogService.createCommentById(id, formData).subscribe({
      next: () => {
        this.getAllcommentById(id);
        this.getBlogById(this.blogId);

        this.commonService.hideLoader();

        this.logger.alertWithSuccess('Comment posted successfully!🎉');
      },
      error: () => {
        this.commonService.hideLoader();
      },
    });
  }
  /**
   * @description Fetches a specific comment for editing.
   * @author Gautam Yadav
   * @param {any} value - A string param
   * @return {void} Return a void
   */
  getCommentById(id: any): void {
    this.commonService.showLoader();
    this.commentId = id;
    this.blogService.getCommentById(id).subscribe({
      next: (res) => {
        this.commentForm.get('content')!.patchValue(res.data.content);
        this.isUpdateform = true;
        this.commonService.hideLoader();
      },
      error: () => {
        this.commonService.hideLoader();
      },
    });
  }
  /**
   * @description Updates an existing comment with new content.
   * @author Gautam Yadav
   * @return {void} Return a void
   */
  updateCommentById(): void {
    this.commonService.showLoader();
    let data = this.commentForm.get('content')!.value;
    this.blogService.updateCommentById(this.commentId, data).subscribe({
      next: (res: any) => {
        this.commonService.hideLoader();
        this.getAllcommentById(this.blogId);
        this.getBlogById(this.blogId);

        this.logger.alertWithSuccess(res.message);
      },
      error: () => {
        this.commonService.hideLoader();
      },
    });
  }
  /**
   * @description  Deletes a specified comment and updates the comment list.
   * @author Gautam Yadav
   * @param {string} commentId - A string param
   * @return {void} Return a void
   */
  deleteComment(commentId: string): void {
    this.commonService.showLoader();

    this.blogService.deleteCommentById(this.blogId, commentId).subscribe({
      next: (res: any) => {
        this.getAllcommentById(this.blogId);
        this.getBlogById(this.blogId);

        this.logger.alertWithSuccess(res.message);
        this.commonService.hideLoader();
      },
      error: () => {
        this.commonService.hideLoader();
      },
    });
  }
  /**
   * @description Computes the time elapsed since a comment was created, returning a user-friendly string (e.g., "5 minutes ago").
   * @author Gautam Yadav
   * @param {string} createdDate - A string param
   * @return {string} Return a string
   */
  calculateTimeAgo(createdDate: string): string {
    const currentDate = new Date();
    const dateCreated = new Date(createdDate);

    const timeZoneOffset = currentDate.getTimezoneOffset() * 60000;
    const adjustedCreatedDate = new Date(
      dateCreated.getTime() - timeZoneOffset
    );

    const timeDifference =
      currentDate.getTime() - adjustedCreatedDate.getTime();

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  }

  identify(id: number): number {
    return id;
  }
  /**
   * @description Fetches a specific blog for editing.
   * @author Gautam Yadav
   * @return {void} Return a void
   */
  getBlogById(id: any): void {
    this.commonService.showLoader();
    this.blogService.getBlogById(id).subscribe({
      next: (res: any) => {
        const profilePictureUrl = res.data.profilePic
          ? this.sanitizer.bypassSecurityTrustResourceUrl(
              'data:image/jpeg;base64,' + res.data.profilePic
            )
          : '../../../assets/mesage_user.jpg';

        const mediaFiles = res.data.mediaFile[0]
          ? this.sanitizer.bypassSecurityTrustResourceUrl(
              'data:image/jpeg;base64,' + res.data.mediaFile
            )
          : '../../../assets/blog-img1.jpg';

        const date = new Date(res.data.createdDateTime);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        const createdDated = `${day} ${month}, ${year}`;
        this.blogDetail = {
          ...res.data,
          createdDatedCustom: createdDated,
          profilePictureUrlCustom: profilePictureUrl,
          mediaFileCustom: mediaFiles,
        };

        this.commonService.hideLoader();
      },
      error: () => {
        this.commonService.hideLoader();
      },
    });
  }
  getUserName() {
    this.username = this.authService.getTokenData().sub;
  }
}
