import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home.component';
import { ExploreComponent } from './features/articles/pages/explore/explore.component';
import { CreateComponent } from './features/articles/pages/create/create.component';
import { ArticleComponent } from './features/articles/pages/article/article.component';
import { EditComponent } from './features/articles/pages/edit/edit.component';
import { ProfileComponent } from './features/user/pages/profile/profile.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { MyArticlesComponent } from './features/articles/pages/my-articles/my-articles.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'explore',
    component: ExploreComponent,
  },
  {
    path: 'explore/:page',
    component: ExploreComponent,
  },
  {
    path: 'article/create',
    component: CreateComponent,
    canActivate: [authGuard('auth')],
  },

  {
    path: 'article/:id',
    component: ArticleComponent,
  },
  {
    path: 'article/:id/edit',
    component: EditComponent,
    canActivate: [authGuard('auth')],
  },
  {
    path: 'myarticles',
    component: MyArticlesComponent,
    canActivate: [authGuard('auth')],
  },

  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [authGuard('auth')],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'CL - Page de connexion',
    canActivate: [authGuard('guest')],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: "CL - Page de d'inscription",
    canActivate: [authGuard('guest')],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
