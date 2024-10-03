import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateTask, departments } from 'src/app/modal/user';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { LoggerService } from 'src/app/service/logger.service';
import { TaskboardService } from 'src/app/service/taskboard.service';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
})
export class TaskboardComponent implements OnInit {
  @ViewChild('cancel') cancel!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private taskboardService: TaskboardService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    let id = this.authService.getTokenData().id;
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
  }
  allDepartments: departments[] = [];
  tasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description for Task 1',
      status: 'todo',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description for Task 2',
      status: 'todo',
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description for Task 3',
      status: 'inprogress',
    },
    {
      id: 4,
      title: 'Task 4',
      description: 'Description for Task 4',
      status: 'onhold',
    },
    {
      id: 5,
      title: 'Task 5',
      description: 'Description for Task 5',
      status: 'completed',
    },
  ];

  taskBoard_form = this.fb.group({
    departmentId: [null, Validators.required],
    title: ['', Validators.required],
    content: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  onSubmit() {
    if (this.taskBoard_form.valid) {
      this.commonService.showLoader();
      let formData = this.taskBoard_form.value as CreateTask;
      this.taskboardService
        .createTask({
          departmentId: +formData.departmentId,
          title: formData.title,
          content: formData.content,
        })
        .subscribe({
          next: (response) => {
            this.commonService.hideLoader();
            this.loggerService.alertWithSuccess(response.message);
            this.reset_taskBoard_form();
            this.cancel.nativeElement.click();
          },
        });
    }
  }

  /**
   * @description This is method to check error in formControls.
   * @author Jagdish
   * @param {string} fieldName
   * @param {string} errorName
   * @returns {boolean | undefined}
   */
  checkError(fieldName: string, errorName: string): boolean | undefined {
    return (
      this.taskBoard_form.get(fieldName)!.hasError(errorName) &&
      this.taskBoard_form.get(fieldName)!.touched
    );
  }

  /**
   * @description This method sets the drag data for a task, using its ID, when a drag event starts.
   * @author Jagdish
   * @param {DragEvent} event
   * @param {Task} task
   * @return {void}
   */

  onDragStart(event: DragEvent, task: Task): void {
    event.dataTransfer?.setData('text/plain', task.id.toString());
  }

  /**
   * @description This method retrieves a task ID from the drag event and updates the task's status if the task is found.
   * @author Jagdish
   * @param {DragEvent} event
   * @param {string} newStatus
   * @return {void}
   */

  onDrop(event: DragEvent, newStatus: string): void {
    const taskId = Number(event.dataTransfer!.getData('text/plain'));
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = newStatus;
    }
  }

  /**
   * @description This method prevents the default behavior during a drag-over event to allow dropping.
   * @author Jagdish
   * @param {DragEvent} event
   * @return {void}
   */

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /**
   * @description This is a trackBy method with task id .
   * @author Jagdish
   * @return {number}
   */
  trackByTaskId(task: any): number {
    return task.id;
  }

  /**
   * @description This is a trackBy department id method.
   * @author Jagdish
   * @return {number}
   */
  trackByDepartmentId(department: any): number {
    return department.id;
  }

  /**
   * @description This method reset the taskbaord form and patches default values to them.
   * @author Jagdish
   * @returns {void}
   */

  reset_taskBoard_form(): void {
    this.taskBoard_form.reset();
  }

  /**
   * @description This method reset the taskbaord form while opening taskbaord form popup .
   * @author Jagdish
   * @returns {void}
   */

  openCreateTask(): void {
    this.taskBoard_form.reset();
    this.taskBoard_form.patchValue({
      departmentId: null,
      title: '',
      content: '',
    });
  }

  /**
   * @description This method is responsible for deleting a Task.
   * @author Jagdish
   * @param {number} taskId
   * @returns {void}
   */

  onDeleteTask(taskId: number): void {
    this.commonService.showLoader();
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.commonService.hideLoader();
    this.loggerService.alertWithSuccess('Task Deleted!');
  }
}
