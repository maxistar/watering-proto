import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = 'admin';
  password = 'admin';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe((success) => {
      this.isSubmitting = false;

      if (!success) {
        this.errorMessage = 'Invalid username or password.';
        return;
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
      void this.router.navigateByUrl(returnUrl);
    });
  }
}
