import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {
  adminGuard,
  authGuard,
  QuizGuard,
  roleGuard,
} from './guards/auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { DashboardComponent } from './components/settings/dashboard/dashboard.component';
import { UsersComponent } from './components/settings/users/users.component';
import { BrandsComponent } from './components/settings/brands/brands.component';
import { ModelsComponent } from './components/settings/models/models.component';
import { QuizzesComponent } from './components/settings/quizzes/quizzes.component';
import { VersionsComponent } from './components/settings/versions/versions.component';
import { QuestionsComponent } from './components/settings/questions/questions.component';
import { FeaturesComponent } from './components/settings/features/features.component';
import { PermissionsComponent } from './components/settings/permissions/permissions.component';
import { RolesComponent } from './components/settings/roles/roles.component';
import { SubSettingsComponent } from './components/settings/sub-settings/sub-settings.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'HowItWorks',
        loadComponent: () =>
          import('./components/how-it-works/how-it-works.component').then(
            (m) => m.HowItWorksComponent
          ),
      },
      {
        path: 'Quiz',
        canActivate: [QuizGuard],
        loadComponent: () =>
          import('./components/quiz/quiz.component').then(
            (m) => m.QuizComponent
          ),
      
      },
    ],
  },
  {
    path: 'settings',
    canActivate: [QuizGuard],
    canActivateChild: [QuizGuard],
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/settings/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './components/settings/sub-settings/sub-settings.component'
          ).then((m) => m.SubSettingsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/settings/users/users.component').then(
            (m) => m.UsersComponent
          ),
        canActivate: [roleGuard],
        data: { service: 'users' },
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./components/settings/brands/brands.component').then(
            (m) => m.BrandsComponent
          ),
        canActivate: [roleGuard],
        data: { service: 'brands' },
      },
      {
        path: 'models',
        loadComponent: () =>
          import('./components/settings/models/models.component').then(
            (m) => m.ModelsComponent
          ),
        canActivate: [roleGuard],
        data: { service: 'models' },
      },
      {
        path: 'versions',
        loadComponent: () =>
          import('./components/settings/versions/versions.component').then(
            (m) => m.VersionsComponent
          ),
        canActivate: [roleGuard],
        data: { service: 'versions' },
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('./components/settings/quizzes/quizzes.component').then(
            (m) => m.QuizzesComponent
          ),
      },
      {
        path: 'questions',
        loadComponent: () =>
          import('./components/settings/questions/questions.component').then(
            (m) => m.QuestionsComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./components/settings/features/features.component').then(
            (m) => m.FeaturesComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import(
            './components/settings/permissions/permissions.component'
          ).then((m) => m.PermissionsComponent),
        canActivate: [adminGuard],
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./components/settings/roles/roles.component').then(
            (m) => m.RolesComponent
          ),
        canActivate: [roleGuard],
        data: { service: 'roles' },
      },
    ],
  },
  {
    path: 'Login',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
