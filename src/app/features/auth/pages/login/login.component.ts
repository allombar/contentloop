import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  readonly ArrowLeft = ArrowLeftIcon;

  ngOnInit(): void {
    this.authService
      .login({ email: 'user@example.com', password: 'string' })
      .subscribe({
        next: (user: any) => {
          console.log('User login', user);
        },
      });
  }
}
