import { Component, computed, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layouts/navbar/navbar.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { ToasterComponent } from "./components/ui/toaster/toaster.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // private $auth = inject(AuthService);
  // user = this.$auth.user;
  // email = computed(() => this.user()?.email);
  // userEffect$ = effect(() => {
  //   const user = this.user();
  //   console.log(user);
  // });
}
