import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    roleId: ['2', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.getRawValue();
      const role = formValue.roleId === '2' ? 'LANDLORD' : 'TENANT';

      this.authService.register({
        fullName: formValue.fullName!,
        email: formValue.email!,
        phone: formValue.phone!,
        password: formValue.password!,
        role
      }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error) => alert(error.error?.message || 'No se pudo registrar la cuenta.')
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
