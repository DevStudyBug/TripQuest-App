import { Routes } from '@angular/router';
import { canActivateAuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  // 🔹 Default Route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔹 Auth Routes
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.page').then(m => m.RegisterPage),
  },

  // 🔹 Traveller Tabs (Protected)
  {
    path: 'tabs',
    canActivate: [canActivateAuthGuard],
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./pages/tabs/feed/feed.page').then(m => m.FeedPage),
      },
      {
        path: 'my-trips',
        loadComponent: () =>
          import('./pages/tabs/my-trips/my-trips.page').then(m => m.MyTripsPage),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./pages/tabs/explore/explore.page').then(m => m.ExplorePage),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/tabs/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/tabs/profile/profile.page').then(m => m.ProfilePage),
      },
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
    ],
  },

  // 🔹 Admin Routes (Protected)
 {
  path: 'admin',
  canActivate: [canActivateAuthGuard],
  loadComponent: () =>
    import('./pages/admin/admin-tabs/admin-tabs.page').then(m => m.AdminTabsPage),
  children: [
    {
      path: 'feed',
      loadComponent: () =>
        import('./pages/admin/admin-feed/admin-feed.page').then(m => m.AdminFeedPage),
    },
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./pages/admin/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage),
    },
    {
      path: 'manage-destinations',
      loadComponent: () =>
        import('./pages/admin/manage-destinations/manage-destinations.page').then(m => m.ManageDestinationsPage),
    },
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
  ],
},


  // 🔹 Wildcard Route (Fallback)
  { path: '**', redirectTo: 'login' },
 
];
