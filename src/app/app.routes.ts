import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home.component';
import { ExploreComponent } from './features/articles/pages/explore/explore.component';
import { CreateComponent } from './features/articles/pages/create/create.component';
import { ArticleComponent } from './features/articles/pages/article/article.component';
import { EditComponent } from './features/articles/pages/edit/edit.component';
import { ProfileComponent } from './features/user/pages/profile/profile.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'explore',
    component: ExploreComponent,
  },
  { path: 'article/create', component: CreateComponent },
  {
    path: 'article/:id',
    component: ArticleComponent,
  },
  {
    path: 'article/:id/edit',
    component: EditComponent,
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
  },
  { path: 'login', component: LoginComponent, title: 'Page de connexion' },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
