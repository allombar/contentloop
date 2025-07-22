import { Component } from '@angular/core';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-register',
  imports: [LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  readonly ArrowLeft = ArrowLeftIcon;
}
