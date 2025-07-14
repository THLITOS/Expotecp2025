import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signupForm: FormGroup;
  loginForm: FormGroup;
  registerMessage = '';
  loginMessage = '';
  emailErrorMessage: string | null = null;
  passwordErrorMessage: string | null = null;
  emailLoginErrorMessage: string | null = null;
  passwordLoginErrorMessage: string | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimer: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      password: ['', [Validators.required,  Validators.maxLength(25)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm.get('email')?.valueChanges.subscribe(() => this.validateEmail());
    this.signupForm.get('password')?.valueChanges.subscribe(() => this.validatePassword());
    this.loginForm.get('email')?.valueChanges.subscribe(() => this.validateLoginEmail());
    this.loginForm.get('password')?.valueChanges.subscribe(() => this.validateLoginPassword());
  }

  ngOnInit(): void {
  }

  onRegister(): void {
    this.registerMessage = ''; 

    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.registerMessage = 'Registro exitoso!';
          this.signupForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.registerMessage = 'Error en el registro';
        }
      });
    }
  }

  onLogin(): void {
    this.loginMessage = ''; 

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.authService.saveIdUsuario(res.idUsuario);
          this.loginMessage = 'Inicio de sesión exitoso!';
          this.router.navigate(['/pagPrincipal']);
        },
        error: (err) => {
          console.error(err);
          this.loginMessage = 'Credenciales incorrectas';
          this.showCustomToast(this.loginMessage);
        }
      });
    }
  }

  validateEmail() {
    const emailControl = this.signupForm.get('email');
    if (emailControl?.invalid && emailControl.touched) {
      this.emailErrorMessage = 'Ingrese un correo válido';
      this.showCustomToast(this.emailErrorMessage);
    } else {
      this.emailErrorMessage = null;
    }
  }

  validatePassword() {
    const passwordControl = this.signupForm.get('password');
    if (passwordControl?.hasError('minlength') && passwordControl.touched) {
      this.passwordErrorMessage = 'La contraseña debe tener al menos 6 caracteres';
      this.showCustomToast(this.passwordErrorMessage);
    } else {
      this.passwordErrorMessage = null;
    }
  }

  validateLoginEmail() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.invalid && emailControl.touched) {
      this.emailLoginErrorMessage = 'Ingrese un correo válido';
      this.showCustomToast(this.emailLoginErrorMessage);
    } else {
      this.emailLoginErrorMessage = null;
    }
  }

  validateLoginPassword() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('minlength') && passwordControl.touched) {
      this.passwordLoginErrorMessage = 'La contraseña debe tener al menos 6 caracteres';
      this.showCustomToast(this.passwordLoginErrorMessage);
    } else {
      this.passwordLoginErrorMessage = null;
    }
  }

  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  validatePhoneInput(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  showCustomToast(message: string, duration: number = 3000): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastMessage = message;
    this.showToast = true;

    this.toastTimer = setTimeout(() => {
      this.showToast = false;
      this.toastTimer = null;
    }, duration);
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }


}
