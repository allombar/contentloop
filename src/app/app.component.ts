import { Component, computed, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layouts/navbar/navbar.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { AuthService } from './features/auth/services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Content Loop';

  // private $auth = inject(AuthService);

  // user = this.$auth.user;

  // email = computed(() => this.user()?.email);

  // userEffect$ = effect(() => {
  //   const user = this.user();

  //   console.log(user);
  // });
}
