import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Kendo UI Imports
import { GridModule, GridDataResult, PageChangeEvent, SortDescriptor } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';

// Services and Models
import { TaskService } from '../../core/services/task.service';
import { TaskItem } from '../../core/models/task.model';
import { TaskStatus, TaskPriority } from '../../core/enums/task.enums';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    ButtonsModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    DialogModule,
    NotificationModule
  ],
  template: `
    <div class="task-list-container">
      <!-- Header with Actions -->
      <div class="task-list-header">
        <h2>📝 Task Management</h2>
        <div class="header-actions">
          <button 
            kendoButton 
            [primary]="true"
            (click)="openCreateDialog()"
            class="action-btn">
            ➕ New Task
          </button>
          <button 
            kendoButton 
            [fillMode]="'outline'"
            (click)="refreshTasks()"
            class="action-btn">
            🔄 Refresh
          </button>
          <button 
            kendoButton 
            [fillMode]="'outline'"
            [themeColor]="'success'"
            (click)="exportToExcel()"
            class="action-btn">
            📊 Export Excel
          </button>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="filters-panel">
        <div class="filter-group">
          <label>🔍 Search:</label>
          <input 
            kendoTextBox 
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Search tasks..."
            class="search-input" />
        </div>

        <div class="filter-group">
          <label>📊 Status:</label>
          <kendo-dropdownlist
            [(ngModel)]="selectedStatus"
            [data]="statusOptions"
            [textField]="'text'"
            [valueField]="'value'"
            (valueChange)="onStatusFilter()"
            class="filter-dropdown">
          </kendo-dropdownlist>
        </div>

        <div class="filter-group">
          <label>⚡ Priority:</label>
          <kendo-dropdownlist
            [(ngModel)]="selectedPriority"
            [data]="priorityOptions"
            [textField]="'text'"
            [valueField]="'value'"
            (valueChange)="onPriorityFilter()"
            class="filter-dropdown">
          </kendo-dropdownlist>
        </div>

        <div class="filter-group">
          <label>👤 Assigned To:</label>
          <kendo-dropdownlist
            [(ngModel)]="selectedUser"
            [data]="userOptions"
            [textField]="'text'"
            [valueField]="'value'"
            (valueChange)="onUserFilter()"
            class="filter-dropdown">
          </kendo-dropdownlist>
        </div>

        <button 
          kendoButton 
          [fillMode]="'flat'"
          (click)="clearFilters()"
          class="clear-filters-btn">
          🗑️ Clear Filters
        </button>
      </div>

      <!-- Kendo UI Grid with Advanced Features -->
      <kendo-grid
        [data]="gridData"
        [pageSize]="pageSize"
        [skip]="skip"
        [pageable]="true"
        [sortable]="true"
        [filterable]="true"
        [groupable]="true"
        [resizable]="true"
        [reorderable]="true"
        [selectable]="true"
        [loading]="loading"
        (pageChange)="onPageChange($event)"
        (sortChange)="onSortChange($event)"
        class="tasks-grid">

        <!-- ID Column -->
        <kendo-grid-column 
          field="id" 
          title="ID" 
          [width]="60"
          [sortable]="true">
          <ng-template kendoGridCellTemplate let-dataItem>
            <span class="task-id">#{{ dataItem.id }}</span>
          </ng-template>
        </kendo-grid-column>

        <!-- Title Column -->
        <kendo-grid-column 
          field="title" 
          title="Task Title" 
          [width]="250"
          [sortable]="true">
          <ng-template kendoGridCellTemplate let-dataItem>
            <div class="task-title-cell">
              <span class="task-title">{{ dataItem.title }}</span>
              <span class="task-description" *ngIf="dataItem.description">
                {{ dataItem.description | slice:0:50 }}{{ dataItem.description?.length > 50 ? '...' : '' }}
              </span>
            </div>
          </ng-template>
        </kendo-grid-column>

        <!-- Status Column -->
        <kendo-grid-column 
          field="status" 
          title="Status" 
          [width]="120"
          [sortable]="true">
          <ng-template kendoGridCellTemplate let-dataItem>
            <span [class]="'status-badge status-' + dataItem.status.toLowerCase()">
              {{ getStatusIcon(dataItem.status) }} {{ dataItem.statusText }}
            </span>
          </ng-template>
        </kendo-grid-column>

        <!-- Priority Column -->
        <kendo-grid-column 
          field="priority" 
          title="Priority" 
          [width]="100"
          [sortable]="true">
          <ng-template kendoGridCellTemplate let-dataItem>
            <span [class]="'priority-badge priority-' + dataItem.priority.toLowerCase()">
              {{ getPriorityIcon(dataItem.priority) }} {{ dataItem.priorityText }}
            </span>
          </ng-template>
        </kendo-grid-column>

        <!-- Assigned User Column -->
        <kendo-grid-column 
          field="assignedToUser.fullName" 
          title="Assigned To" 
          [width]="150"
          [sortable]="true">
          <ng-template kendoGridCellTemplate let-dataItem>
            <div class="user-cell" *ngIf="dataItem.assignedToUser">
              <span class="user-avatar">👤</span>
              <span class="user-name">{{ dataItem.assignedToUser.fullName }}</span>
            </div>
            <span *ngIf="!dataItem.assignedToUser" class="unassigned">Unassigned</span>
          </ng-template>
        </kendo-grid-column>

        <!-- Due Date Column -->
        <kendo-grid-column 
          field="dueDate" 
          title="Due Date" 
          [width]="120"
          [sortable]="true">
          <ng-template kendoGridCellTemplate let-dataItem>
            <span *ngIf="dataItem.dueDate" 
                  [class]="getDueDateClass(dataItem.dueDate)">
              {{ dataItem.dueDate | date:'MMM dd, yyyy' }}
            </span>
            <span *ngIf="!dataItem.dueDate" class="no-due-date">No due date</span>
          </ng-template>
        </kendo-grid-column>

        <!-- Progress Column -->
        <kendo-grid-column 
          title="Progress" 
          [width]="100"
          [sortable]="false">
          <ng-template kendoGridCellTemplate let-dataItem>
            <div class="progress-container">
              <div class="progress-bar" 
                   [style.width.%]="getTaskProgress(dataItem)">
              </div>
              <span class="progress-text">{{ getTaskProgress(dataItem) }}%</span>
            </div>
          </ng-template>
        </kendo-grid-column>

        <!-- Actions Column -->
        <kendo-grid-column title="Actions" [width]="160" [sortable]="false">
          <ng-template kendoGridCellTemplate let-dataItem>
            <div class="action-buttons">
              <button 
                kendoButton 
                [fillMode]="'flat'"
                [size]="'small'"
                (click)="editTask(dataItem)"
                title="Edit Task">
                ✏️
              </button>
              <button 
                kendoButton 
                [fillMode]="'flat'"
                [size]="'small'"
                [themeColor]="'success'"
                (click)="markComplete(dataItem)"
                title="Mark Complete"
                [disabled]="dataItem.status === 'Completed'">
                ✅
              </button>
              <button 
                kendoButton 
                [fillMode]="'flat'"
                [size]="'small'"
                [themeColor]="'error'"
                (click)="deleteTask(dataItem)"
                title="Delete Task">
                🗑️
              </button>
            </div>
          </ng-template>
        </kendo-grid-column>
      </kendo-grid>

      <!-- Pagination Info -->
      <div class="pagination-info">
        <span>Showing {{ skip + 1 }} - {{ skip + pageSize }} of {{ total }} tasks</span>
        <span class="quick-stats">
          | 📊 {{ getTaskCount('New') }} New 
          | 🔄 {{ getTaskCount('InProgress') }} In Progress 
          | ✅ {{ getTaskCount('Completed') }} Completed
        </span>
      </div>
    </div>

    <!-- Notification Container -->
    <kendo-notification-container></kendo-notification-container>
  `,
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  // Grid Data
  public gridData: GridDataResult = { data: [], total: 0 };
  public loading = false;
  public pageSize = 10;
  public skip = 0;
  public total = 0;
  public sort: SortDescriptor[] = [];

  // Filtering
  public searchTerm = '';
  public selectedStatus: any = null;
  public selectedPriority: any = null;
  public selectedUser: any = null;

  // Data
  public tasks: TaskItem[] = [];

  // Filter Options
  public statusOptions = [
    { text: 'All Statuses', value: null },
    { text: '🆕 New', value: 'New' },
    { text: '🔄 In Progress', value: 'InProgress' },
    { text: '🧪 Testing', value: 'Testing' },
    { text: '✅ Completed', value: 'Completed' },
    { text: '❌ Cancelled', value: 'Cancelled' },
    { text: '⏸️ On Hold', value: 'OnHold' }
  ];

  public priorityOptions = [
    { text: 'All Priorities', value: null },
    { text: '🔵 Low', value: 'Low' },
    { text: '🟡 Medium', value: 'Medium' },
    { text: '🟠 High', value: 'High' },
    { text: '🔴 Critical', value: 'Critical' }
  ];

  public userOptions = [
    { text: 'All Users', value: null },
    // Will be populated from API
  ];

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }

  // Data Loading Methods
  private loadTasks(): void {
    this.loading = true;
    
    const params = {
      page: (this.skip / this.pageSize) + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      status: this.selectedStatus || undefined,
      priority: this.selectedPriority || undefined,
      userId: this.selectedUser || undefined,
      orderBy: this.sort.length > 0 ? this.sort[0].field : 'CreatedDate',
      descending: this.sort.length > 0 ? this.sort[0].dir === 'desc' : true
    };

    this.taskService.getPagedTasks(params).subscribe({
      next: (response) => {
        this.tasks = response.items;
        this.gridData = {
          data: response.items,
          total: response.totalCount
        };
        this.total = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.showNotification('Error loading tasks', 'error');
        this.loading = false;
      }
    });
  }

  private loadUsers(): void {
    this.taskService.getUsers().subscribe({
      next: (users) => {
        this.userOptions = [
          { text: 'All Users', value: null },
          ...users.map(user => ({ text: user.fullName, value: user.id }))
        ];
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  // Event Handlers
  public onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadTasks();
  }

  public onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadTasks();
  }

  public onSearch(): void {
    this.skip = 0;
    this.loadTasks();
  }

  public onStatusFilter(): void {
    this.skip = 0;
    this.loadTasks();
  }

  public onPriorityFilter(): void {
    this.skip = 0;
    this.loadTasks();
  }

  public onUserFilter(): void {
    this.skip = 0;
    this.loadTasks();
  }

  public clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = null;
    this.selectedPriority = null;
    this.selectedUser = null;
    this.skip = 0;
    this.loadTasks();
  }

  public refreshTasks(): void {
    this.loadTasks();
    this.showNotification('Tasks refreshed successfully', 'success');
  }

  // Task Actions
  public openCreateDialog(): void {
    // Navigate to create task form or open dialog
    this.showNotification('Create task functionality will be implemented', 'info');
  }

  public editTask(task: TaskItem): void {
    // Navigate to edit task form or open dialog
    this.showNotification(`Edit task: ${task.title}`, 'info');
  }

  public markComplete(task: TaskItem): void {
    const updatedTask = { ...task, status: TaskStatus.Completed };
    
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.showNotification(`Task "${task.title}" marked as completed`, 'success');
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.showNotification('Error updating task', 'error');
      }
    });
  }

  public deleteTask(task: TaskItem): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.showNotification(`Task "${task.title}" deleted successfully`, 'success');
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.showNotification('Error deleting task', 'error');
        }
      });
    }
  }

  public exportToExcel(): void {
    // Implement Excel export functionality
    this.showNotification('Excel export functionality will be implemented', 'info');
  }

  // Helper Methods
  public getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'New': '🆕',
      'InProgress': '🔄',
      'Testing': '🧪',
      'Completed': '✅',
      'Cancelled': '❌',
      'OnHold': '⏸️'
    };
    return icons[status] || '📋';
  }

  public getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'Low': '🔵',
      'Medium': '🟡',
      'High': '🟠',
      'Critical': '🔴'
    };
    return icons[priority] || '⚪';
  }

  public getDueDateClass(dueDate: string): string {
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'due-today';
    if (diffDays <= 3) return 'due-soon';
    return 'due-normal';
  }

  public getTaskProgress(task: TaskItem): number {
    const progressMap: { [key: string]: number } = {
      'New': 0,
      'InProgress': 50,
      'Testing': 80,
      'Completed': 100,
      'Cancelled': 0,
      'OnHold': 25
    };
    return progressMap[task.statusText] || 0;
  }

  public getTaskCount(status: string): number {
    return this.tasks.filter(task => task.statusText === status).length;
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    const hideAfter = type === 'error' ? 5000 : 3000;
    
    this.notificationService.show({
      content: message,
      hideAfter: hideAfter,
      position: { horizontal: 'right', vertical: 'top' },
      animation: { type: 'slide', duration: 400 },
      type: { style: type, icon: true }
    });
  }
}