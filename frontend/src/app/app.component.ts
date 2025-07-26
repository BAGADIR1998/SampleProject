import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

// Kendo UI Imports
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NavigationModule } from '@progress/kendo-angular-navigation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    LayoutModule,
    ButtonsModule,
    NavigationModule
  ],
  template: `
    <div class="app-container">
      <!-- Header with Kendo UI -->
      <header class="app-header">
        <kendo-panelbar class="navigation-panel">
          <kendo-panelbar-item 
            [title]="'🚀 Task Management System'" 
            [expanded]="false"
            [disabled]="true">
          </kendo-panelbar-item>
        </kendo-panelbar>
        
        <nav class="header-nav">
          <button 
            kendoButton 
            [primary]="true"
            routerLink="/dashboard"
            class="nav-button">
            📊 Dashboard
          </button>
          <button 
            kendoButton 
            [primary]="false"
            routerLink="/tasks"
            class="nav-button">
            📝 Tasks
          </button>
          <button 
            kendoButton 
            [primary]="false"
            routerLink="/users"
            class="nav-button">
            👥 Users
          </button>
          <button 
            kendoButton 
            [primary]="false"
            routerLink="/reports"
            class="nav-button">
            📈 Reports
          </button>
        </nav>
      </header>

      <!-- Main Content Area -->
      <main class="app-main">
        <kendo-splitter 
          orientation="horizontal"
          [panes]="splitterPanes"
          class="main-splitter">
          
          <!-- Sidebar -->
          <kendo-splitter-pane [collapsible]="true" [size]="'250px'">
            <div class="sidebar">
              <div class="sidebar-section">
                <h3>📋 Quick Actions</h3>
                <button 
                  kendoButton 
                  [fillMode]="'outline'"
                  [themeColor]="'primary'"
                  class="sidebar-button"
                  routerLink="/tasks/new">
                  ➕ New Task
                </button>
                <button 
                  kendoButton 
                  [fillMode]="'outline'"
                  [themeColor]="'success'"
                  class="sidebar-button"
                  routerLink="/tasks/my-tasks">
                  👤 My Tasks
                </button>
                <button 
                  kendoButton 
                  [fillMode]="'outline'"
                  [themeColor]="'warning'"
                  class="sidebar-button"
                  routerLink="/tasks/overdue">
                  ⚠️ Overdue
                </button>
              </div>
              
              <div class="sidebar-section">
                <h3>🔍 Filters</h3>
                <div class="filter-options">
                  <label>Status:</label>
                  <button kendoButton [fillMode]="'flat'" class="filter-btn">All</button>
                  <button kendoButton [fillMode]="'flat'" class="filter-btn">New</button>
                  <button kendoButton [fillMode]="'flat'" class="filter-btn">In Progress</button>
                  <button kendoButton [fillMode]="'flat'" class="filter-btn">Completed</button>
                </div>
              </div>
            </div>
          </kendo-splitter-pane>

          <!-- Content Area -->
          <kendo-splitter-pane>
            <div class="content-area">
              <router-outlet></router-outlet>
            </div>
          </kendo-splitter-pane>
        </kendo-splitter>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-content">
          <span>© 2024 Task Management System | Built with Angular, Kendo UI, .NET Core & Entity Framework</span>
          <span class="footer-tech">
            🔧 Angular 17 • 🎨 Kendo UI • 🚀 .NET 8 • 🗄️ Entity Framework • 🔍 LINQ
          </span>
        </div>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Task Management System';
  
  splitterPanes = [
    { collapsible: true, size: '250px' },
    { collapsible: false }
  ];
}
